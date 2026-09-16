import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';

export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'removed';

export const MODERATION_REASONS = [
  'spam',
  'abuse_or_harassment',
  'personal_information',
  'unrelated_to_product',
  'unlawful_content',
  'unsupported_medical_claims',
  'duplicate_submission',
  'not_genuine',
] as const;
export type ModerationReason = (typeof MODERATION_REASONS)[number];

export const SKIN_TYPES = ['dry', 'oily', 'combination', 'balanced', 'unspecified'] as const;
export const TIME_USED = ['first_impressions', 'under_2_weeks', '2_6_weeks', 'over_6_weeks'] as const;

type OrderRow = {
  id: string;
  line_items: unknown;
  status: string | null;
  fulfillment_status: string | null;
  cancelled_at: string | null;
  refunded_cents: number | null;
  amount_cents: number | null;
  delivered_at: string | null;
  dispatched_at: string | null;
  shipped_at: string | null;
  created_at: string;
};

const ORDER_COLUMNS =
  'id, line_items, status, fulfillment_status, cancelled_at, refunded_cents, amount_cents, delivered_at, dispatched_at, shipped_at, created_at';

const FULFILLED_STAGES = new Set(['shipped', 'delivered', 'fulfilled', 'dispatched']);

function normalise(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

/** An order counts only when it is paid, fulfilled/delivered, not cancelled and not fully refunded. */
function orderIsUsable(o: OrderRow) {
  if (o.status !== 'paid') return false;
  if (o.cancelled_at) return false;
  if (o.fulfillment_status === 'cancelled') return false;
  const refunded = o.refunded_cents ?? 0;
  if (refunded > 0 && o.amount_cents != null && refunded >= o.amount_cents) return false;
  return Boolean(o.delivered_at) || FULFILLED_STAGES.has(o.fulfillment_status ?? '');
}

/** Exact line-item match by catalogue price id, falling back to product naming. */
function orderContains(o: OrderRow, productId: string, productName: string, brand: string) {
  const items = Array.isArray(o.line_items)
    ? (o.line_items as Array<{ name?: string; lookupKey?: string | null }>)
    : [];
  if (items.some((i) => i?.lookupKey && i.lookupKey === productId)) return true;
  const target = normalise(`${brand} ${productName}`);
  const plain = normalise(productName);
  return items.some((item) => {
    const name = normalise(String(item?.name ?? ''));
    if (!name) return false;
    return name === target || name.includes(plain) || target.includes(name);
  });
}

async function assertAdmin(
  supabase: { rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: unknown }> },
  userId: string,
) {
  const { data, error } = await supabase.rpc('has_role', { _user_id: userId, _role: 'admin' });
  if (error || data !== true) throw new Error('Unauthorized: admin only');
}

type EligibilityInput = { productId: string; productName: string; brand: string };

/**
 * Server-side eligibility. Never trusts the browser: the caller's identity comes
 * from the verified bearer token and the order history is read as that user.
 */
async function evaluateEligibility(
  supabase: any,
  userId: string,
  data: EligibilityInput,
): Promise<{
  eligible: boolean;
  reason: 'ok' | 'no_purchase' | 'not_fulfilled' | 'already_reviewed';
  alreadySubmitted: boolean;
  pending: boolean;
  orderId: string | null;
}> {
  const { data: rows } = await supabase
    .from('orders')
    .select(ORDER_COLUMNS)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(200);

  const orders = ((rows ?? []) as OrderRow[]).filter((o) =>
    orderContains(o, data.productId, data.productName, data.brand),
  );
  const usable = orders.filter(orderIsUsable);

  const { data: existing } = await supabase
    .from('reviews')
    .select('id, status')
    .eq('product_id', data.productId)
    .eq('customer_id', userId)
    .in('status', ['pending', 'approved'])
    .limit(1);

  const mine = existing?.[0] as { status?: ReviewStatus } | undefined;
  if (mine) {
    return {
      eligible: false,
      reason: 'already_reviewed',
      alreadySubmitted: true,
      pending: mine.status === 'pending',
      orderId: null,
    };
  }

  if (usable.length === 0) {
    return {
      eligible: false,
      reason: orders.length > 0 ? 'not_fulfilled' : 'no_purchase',
      alreadySubmitted: false,
      pending: false,
      orderId: null,
    };
  }

  return { eligible: true, reason: 'ok', alreadySubmitted: false, pending: false, orderId: usable[0]!.id };
}

export const getReviewEligibility = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: EligibilityInput) => input)
  .handler(async ({ data, context }) => evaluateEligibility(context.supabase, context.userId, data));

type SubmitInput = EligibilityInput & {
  rating: number;
  reviewText: string;
  title?: string;
  skinType?: string;
  timeUsed?: string;
  customerName: string;
};

export const submitReview = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: SubmitInput) => {
    if (!input.productId) throw new Error('Missing product');
    if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) {
      throw new Error('Please choose a rating from 1 to 5 stars.');
    }
    const text = (input.reviewText ?? '').trim();
    if (text.length < 30 || text.length > 2000) {
      throw new Error('Your review needs to be between 30 and 2,000 characters.');
    }
    const name = (input.customerName ?? '').trim();
    if (name.length < 2 || name.length > 60) throw new Error('Please enter a display name.');
    const title = (input.title ?? '').trim();
    if (title.length > 80) throw new Error('Please keep the title under 80 characters.');
    const skinType = input.skinType && (SKIN_TYPES as readonly string[]).includes(input.skinType)
      ? input.skinType
      : undefined;
    const timeUsed = input.timeUsed && (TIME_USED as readonly string[]).includes(input.timeUsed)
      ? input.timeUsed
      : undefined;
    return { ...input, reviewText: text, customerName: name, title, skinType, timeUsed };
  })
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const check = await evaluateEligibility(supabase, userId, data);
    if (check.alreadySubmitted) throw new Error('You have already reviewed this product.');
    if (!check.eligible) {
      throw new Error(
        'No eligible purchase was found for this product. Reviews are available after your Skin Grocer order has been fulfilled.',
      );
    }

    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { error } = await supabaseAdmin.from('reviews').insert({
      product_id: data.productId,
      customer_id: userId,
      customer_name: data.customerName,
      title: data.title || null,
      skin_type: data.skinType ?? null,
      time_used: data.timeUsed ?? null,
      order_id: check.orderId,
      rating: data.rating,
      review_text: data.reviewText,
      verified_purchase: true,
      status: 'pending',
      approved: false,
      is_published: false,
    } as never);
    if (error) {
      if (String(error.message).includes('reviews_active_unique')) {
        throw new Error('You have already reviewed this product.');
      }
      throw new Error('We could not save your review just now. Please try again.');
    }
    return { ok: true, pending: true };
  });

export type PublicReview = {
  id: string;
  product_id: string;
  rating: number;
  title: string | null;
  review_text: string | null;
  customer_name: string | null;
  skin_type: string | null;
  time_used: string | null;
  verified_purchase: boolean | null;
  response_text: string | null;
  response_at: string | null;
  created_at: string;
};

const PUBLIC_COLUMNS =
  'id, product_id, rating, title, review_text, customer_name, skin_type, time_used, verified_purchase, response_text, response_at, created_at';

/**
 * Approved reviews for one product. Public: RLS exposes approved rows only.
 * Throws on failure so the UI can distinguish "temporarily unavailable" from
 * a genuine empty state.
 */
export const listProductReviews = createServerFn({ method: 'POST' })
  .inputValidator((input: { productId: string }) => input)
  .handler(async ({ data }) => {
    const { publicClient } = await import('@/lib/signals.server');
    const { data: rows, error } = await publicClient()
      .from('reviews')
      .select(PUBLIC_COLUMNS)
      .eq('product_id', data.productId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) throw new Error('Reviews are temporarily unavailable. Please try again later.');
    return (rows ?? []) as unknown as PublicReview[];
  });

/**
 * Public read of approved reviews for the /reviews page. No auth: RLS exposes
 * only approved rows. Runs during SSR so review JSON-LD lands in the initial
 * HTML for crawlers. Never blocks the page: failures return an empty list.
 */
export const listApprovedReviews = createServerFn({ method: 'GET' }).handler(async () => {
  const { publicClient } = await import('@/lib/signals.server');
  const { data, error } = await publicClient()
    .from('reviews')
    .select(PUBLIC_COLUMNS)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(60);
  if (error) return [];
  return (data ?? []) as unknown as PublicReview[];
});

export const listPendingReviews = createServerFn({ method: 'GET' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase as never, context.userId);
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { data, error } = await supabaseAdmin
      .from('reviews')
      .select(
        'id, product_id, customer_name, title, rating, review_text, skin_type, time_used, verified_purchase, status, moderation_reason, moderated_at, created_at',
      )
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

/**
 * Moderation. Approving publishes; rejecting or removing keeps the row with a
 * documented reason and an audit timestamp — reviews are never deleted, and a
 * review is never rejected merely for being critical.
 */
export const moderateReview = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; status: ReviewStatus; reason?: string }) => {
    if (!input.id) throw new Error('Missing review');
    if (!['pending', 'approved', 'rejected', 'removed'].includes(input.status)) {
      throw new Error('Unknown moderation status');
    }
    if (input.status !== 'approved') {
      if (!input.reason || !(MODERATION_REASONS as readonly string[]).includes(input.reason)) {
        throw new Error('A documented moderation reason is required.');
      }
    }
    return input;
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase as never, context.userId);
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { error } = await supabaseAdmin
      .from('reviews')
      .update({
        status: data.status,
        moderation_reason: data.status === 'approved' ? null : (data.reason ?? null),
        moderated_at: new Date().toISOString(),
        moderated_by: context.userId,
      } as never)
      .eq('id', data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/**
 * Post-purchase review-request preparation. Lists the signed-in customer's own
 * delivered order lines that became review-eligible 21–30 days ago. No email is
 * sent from here — this is the data source a future reminder would use, and the
 * order is identified server-side, never through the product URL.
 */
export const listMyReviewRequests = createServerFn({ method: 'GET' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const now = Date.now();
    const { data: rows } = await supabase
      .from('orders')
      .select(ORDER_COLUMNS)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(200);

    const { data: mine } = await supabase
      .from('reviews')
      .select('product_id')
      .eq('customer_id', userId)
      .in('status', ['pending', 'approved']);
    const reviewed = new Set((mine ?? []).map((r: { product_id: string }) => r.product_id));

    const out: Array<{ orderId: string; productId: string; productName: string; deliveredAt: string }> = [];
    for (const o of (rows ?? []) as OrderRow[]) {
      if (!orderIsUsable(o)) continue;
      const anchor = o.delivered_at ?? o.dispatched_at ?? o.shipped_at;
      if (!anchor) continue;
      const days = (now - new Date(anchor).getTime()) / 86_400_000;
      if (days < 21 || days > 30) continue;
      const items = Array.isArray(o.line_items)
        ? (o.line_items as Array<{ name?: string; lookupKey?: string | null }>)
        : [];
      for (const item of items) {
        const productId = item?.lookupKey ?? null;
        if (!productId || reviewed.has(productId)) continue;
        out.push({
          orderId: o.id,
          productId,
          productName: String(item?.name ?? ''),
          deliveredAt: anchor,
        });
      }
    }
    return out;
  });
