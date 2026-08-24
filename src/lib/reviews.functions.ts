import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';

type OrderRow = { line_items: unknown; status: string | null };

function normalise(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

/** True when any completed order for this user contains a line item matching the product. */
function orderContains(orders: OrderRow[], productName: string, brand: string) {
  const target = normalise(`${brand} ${productName}`);
  const plain = normalise(productName);
  return orders.some((o) => {
    const items = Array.isArray(o.line_items) ? (o.line_items as Array<{ name?: string }>) : [];
    return items.some((item) => {
      const name = normalise(String(item?.name ?? ''));
      if (!name) return false;
      return name === target || name.includes(plain) || target.includes(name);
    });
  });
}

async function assertAdmin(
  supabase: { rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: unknown }> },
  userId: string,
) {
  const { data, error } = await supabase.rpc('has_role', { _user_id: userId, _role: 'admin' });
  if (error || data !== true) throw new Error('Unauthorized: admin only');
}

export const getReviewEligibility = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { productId: string; productName: string; brand: string }) => input)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: orders } = await supabase
      .from('orders')
      .select('line_items, status')
      .eq('user_id', userId)
      .eq('status', 'paid');

    const eligible = orderContains((orders ?? []) as OrderRow[], data.productName, data.brand);

    const { data: existing } = await supabase
      .from('reviews')
      .select('id, approved')
      .eq('product_id', data.productId)
      .eq('customer_id', userId)
      .limit(1);

    const mine = existing?.[0] as { approved?: boolean } | undefined;
    return {
      eligible,
      alreadySubmitted: Boolean(mine),
      pending: Boolean(mine && mine.approved === false),
    };
  });

export const submitReview = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: {
    productId: string;
    productName: string;
    brand: string;
    rating: number;
    reviewText: string;
    customerName: string;
  }) => {
    if (!input.productId) throw new Error('Missing product');
    if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }
    const text = input.reviewText.trim();
    if (text.length < 10 || text.length > 2000) throw new Error('Review must be 10–2000 characters');
    const name = input.customerName.trim();
    if (name.length < 2 || name.length > 60) throw new Error('Please enter your name');
    return { ...input, reviewText: text, customerName: name };
  })
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: orders } = await supabase
      .from('orders')
      .select('line_items, status')
      .eq('user_id', userId)
      .eq('status', 'paid');

    const verified = orderContains((orders ?? []) as OrderRow[], data.productName, data.brand);
    if (!verified) throw new Error('Only customers with a completed order for this product can review it.');

    const { data: existing } = await supabase
      .from('reviews')
      .select('id')
      .eq('product_id', data.productId)
      .eq('customer_id', userId)
      .limit(1);
    if (existing && existing.length > 0) throw new Error('You have already reviewed this product.');

    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { error } = await supabaseAdmin.from('reviews').insert({
      product_id: data.productId,
      customer_id: userId,
      customer_name: data.customerName,
      rating: data.rating,
      review_text: data.reviewText,
      verified_purchase: true,
      approved: false,
      is_published: false,
    });
    if (error) throw new Error(error.message);
    return { ok: true, pending: true };
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
    .select('id, product_id, rating, review_text, customer_name, verified_purchase, created_at')
    .eq('approved', true)
    .order('created_at', { ascending: false })
    .limit(60);
  if (error) return [];
  return (data ?? []) as Array<{
    id: string;
    product_id: string;
    rating: number;
    review_text: string | null;
    customer_name: string | null;
    verified_purchase: boolean | null;
    created_at: string;
  }>;
});

export const listPendingReviews = createServerFn({ method: 'GET' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase as never, context.userId);
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { data, error } = await supabaseAdmin
      .from('reviews')
      .select('id, product_id, customer_name, rating, review_text, verified_purchase, approved, created_at')
      .eq('approved', false)
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const setReviewApproval = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; approved: boolean }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase as never, context.userId);
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    if (data.approved) {
      const { error } = await supabaseAdmin
        .from('reviews')
        .update({ approved: true, is_published: true })
        .eq('id', data.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin.from('reviews').delete().eq('id', data.id);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });
