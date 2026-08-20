import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';

/**
 * Per-order authenticity / provenance card (Phase 1).
 *
 * Staff issue a card at packing time after completing a verification
 * checklist. The card carries a QR pointing at /verify/<token>. The public
 * page resolves the token server-side and returns a hand-built DTO that
 * contains no customer identity, no order id, no money and no internal notes.
 *
 * Claims discipline: the public page renders only what was actually recorded.
 * Batch, origin and supplier fields stay null until Phase 2 evidence exists,
 * so nothing unsupportable is ever displayed.
 */

export type PublicCardItem = {
  productName: string;
  brand: string | null;
  quantity: number;
  batchCode: string | null;
  originCountry: string | null;
};

export type PublicVerification =
  | {
      state: 'valid';
      cardRef: string;
      verifiedAt: string | null;
      issuedAt: string;
      dispatchedAt: string | null;
      items: PublicCardItem[];
      checks: string[];
    }
  | { state: 'revoked' | 'superseded' | 'unknown' };

export type OpsCardItem = { productName: string; brand: string | null; quantity: number; sku: string | null };

export type OpsCard = {
  id: string;
  cardRef: string;
  status: 'active' | 'revoked' | 'superseded';
  version: number;
  issuedAt: string;
  verifiedAt: string | null;
  revokedAt: string | null;
  revokedReason: string | null;
  checklist: Record<string, boolean>;
  scanCount: number;
  firstScannedAt: string | null;
  lastScannedAt: string | null;
  items: OpsCardItem[];
};

async function assertStaff(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc('is_fulfillment_staff', { _user_id: context.userId });
  if (error || data !== true) throw new Error('Unauthorized: fulfilment staff only');
}

function mapOpsCard(row: any, items: any[]): OpsCard {
  return {
    id: row.id,
    cardRef: row.card_ref,
    status: row.status,
    version: row.version,
    issuedAt: row.issued_at,
    verifiedAt: row.verified_at ?? null,
    revokedAt: row.revoked_at ?? null,
    revokedReason: row.revoked_reason ?? null,
    checklist: (row.checklist ?? {}) as Record<string, boolean>,
    scanCount: row.scan_count ?? 0,
    firstScannedAt: row.first_scanned_at ?? null,
    lastScannedAt: row.last_scanned_at ?? null,
    items: items.map((i) => ({
      productName: i.product_name,
      brand: i.brand ?? null,
      quantity: i.quantity ?? 1,
      sku: i.sku ?? null,
    })),
  };
}

// ------------------------------------------------------------------- ops

/** Full card history for one order — staff only. */
export const getOrderAuthenticityCards = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { orderId: string }) => {
    if (!input?.orderId) throw new Error('Missing order id');
    return input;
  })
  .handler(async ({ data, context }): Promise<OpsCard[]> => {
    await assertStaff(context as any);
    const supabase = context.supabase as any;

    const { data: cards, error } = await supabase
      .from('authenticity_cards')
      .select('*')
      .eq('order_id', data.orderId)
      .order('version', { ascending: false });
    if (error) throw new Error(error.message);
    if (!cards || cards.length === 0) return [];

    const { data: items } = await supabase
      .from('authenticity_card_items')
      .select('card_id, position, product_name, brand, quantity, sku')
      .in('card_id', cards.map((c: any) => c.id))
      .order('position', { ascending: true });

    return cards.map((c: any) =>
      mapOpsCard(c, ((items ?? []) as any[]).filter((i) => i.card_id === c.id)),
    );
  });

/**
 * Issue (or reissue) the card for an order. Returns the raw token exactly
 * once so the card can be printed; it is never retrievable again.
 */
export const issueAuthenticityCard = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { orderId: string; checklist: Record<string, boolean>; reason?: string | null }) => {
    if (!input?.orderId) throw new Error('Missing order id');
    if (!input.checklist || typeof input.checklist !== 'object') throw new Error('Missing checklist');
    if (input.reason && input.reason.length > 300) throw new Error('Reason too long');
    return input;
  })
  .handler(async ({ data, context }) => {
    await assertStaff(context as any);
    const supabase = context.supabase as any;

    const { generateToken, generateCardRef, hashToken } = await import('@/lib/authenticity.server');
    const { REQUIRED_CHECKS, OPTIONAL_CHECKS } = await import('@/lib/authenticity-checks');

    for (const key of REQUIRED_CHECKS) {
      if (data.checklist[key] !== true) throw new Error('Complete the required verification checklist first');
    }
    const checklist: Record<string, boolean> = {};
    for (const key of [...REQUIRED_CHECKS, ...OPTIONAL_CHECKS]) {
      checklist[key] = data.checklist[key] === true;
    }

    // Snapshot the products from the order's own recorded line items — never
    // invented values.
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, line_items')
      .eq('id', data.orderId)
      .maybeSingle();
    if (orderError) throw new Error(orderError.message);
    if (!order) throw new Error('Order not found');

    const { SHOP_PRODUCTS } = await import('@/lib/shop-catalog');
    const lines: any[] = Array.isArray(order.line_items) ? order.line_items : [];
    const items = lines.map((l) => {
      const match = SHOP_PRODUCTS.find((p) => p.priceId === l?.lookupKey);
      return {
        product_name: match ? match.name : String(l?.name ?? 'Item'),
        brand: match ? match.brand : null,
        quantity: Math.max(1, Number(l?.quantity ?? 1)),
        sku: (l?.lookupKey as string | null) ?? null,
      };
    });

    const token = generateToken();
    const cardRef = generateCardRef();
    const tokenHash = await hashToken(token);

    const { data: cardId, error } = await supabase.rpc('issue_authenticity_card', {
      _order_id: data.orderId,
      _card_ref: cardRef,
      _token_hash: tokenHash,
      _token_prefix: token.slice(0, 6),
      _checklist: checklist,
      _items: items,
      _reissue_reason: data.reason?.trim() || null,
    });
    if (error) throw new Error(error.message);

    return { cardId: cardId as string, cardRef, token, verifyPath: `/verify/${token}` };
  });

export const revokeAuthenticityCard = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { cardId: string; reason: string }) => {
    if (!input?.cardId) throw new Error('Missing card id');
    if (!input?.reason || input.reason.trim().length < 3) throw new Error('A revoke reason is required');
    if (input.reason.length > 300) throw new Error('Reason too long');
    return input;
  })
  .handler(async ({ data, context }) => {
    await assertStaff(context as any);
    const { error } = await (context.supabase as any).rpc('revoke_authenticity_card', {
      _card_id: data.cardId,
      _reason: data.reason.trim(),
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------------------------------------------------------------- public

/**
 * Public verification lookup. Unauthenticated by design: the token *is* the
 * credential. It is hashed here and matched against the unique hash index —
 * the raw token never leaves the request, and no row is ever returned to the
 * browser directly.
 */
export const getVerificationRecord = createServerFn({ method: 'POST' })
  .inputValidator((input: { token: string }) => ({ token: String(input?.token ?? '') }))
  .handler(async ({ data }): Promise<PublicVerification> => {
    const { isWellFormedToken, hashToken } = await import('@/lib/authenticity.server');
    const { CHECK_LABELS, REQUIRED_CHECKS, OPTIONAL_CHECKS } = await import('@/lib/authenticity-checks');
    if (!isWellFormedToken(data.token)) return { state: 'unknown' };

    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const tokenHash = await hashToken(data.token);

    const { data: card } = await supabaseAdmin
      .from('authenticity_cards')
      .select('id, card_ref, status, issued_at, verified_at, checklist, order_id')
      .eq('token_hash', tokenHash)
      .maybeSingle();

    if (!card) return { state: 'unknown' };
    if (card.status !== 'active') return { state: card.status as 'revoked' | 'superseded' };

    const [{ data: items }, { data: order }] = await Promise.all([
      supabaseAdmin
        .from('authenticity_card_items')
        .select('product_name, brand, quantity, batch_code, origin_country, position')
        .eq('card_id', card.id)
        .order('position', { ascending: true }),
      supabaseAdmin.from('orders').select('dispatched_at, shipped_at').eq('id', card.order_id).maybeSingle(),
    ]);

    // Scan telemetry is deliberately NOT recorded here. This lookup runs during
    // SSR and can run again on client navigation, which double-counted a single
    // visit. The page records exactly one scan via recordVerificationScan.


    const checklist = (card.checklist ?? {}) as Record<string, boolean>;
    const checks = [...REQUIRED_CHECKS, ...OPTIONAL_CHECKS]
      .filter((key) => checklist[key] === true)
      .map((key) => CHECK_LABELS[key]);

    return {
      state: 'valid',
      cardRef: card.card_ref,
      issuedAt: card.issued_at,
      verifiedAt: card.verified_at ?? null,
      dispatchedAt: (order?.dispatched_at as string | null) ?? (order?.shipped_at as string | null) ?? null,
      items: ((items ?? []) as any[]).map((i) => ({
        productName: i.product_name,
        brand: i.brand ?? null,
        quantity: i.quantity ?? 1,
        batchCode: i.batch_code ?? null,
        originCountry: i.origin_country ?? null,
      })),
      checks,
    };
  });

/**
 * Records a single scan for one verification-page visit.
 *
 * Called once from the client after hydration so SSR + hydration of the same
 * visit cannot double-count. Counter and timestamps only — no IP, user agent,
 * cookie, fingerprint or customer identifier is captured or stored.
 */
export const recordVerificationScan = createServerFn({ method: 'POST' })
  .inputValidator((input: { token: string }) => ({ token: String(input?.token ?? '') }))
  .handler(async ({ data }) => {
    const { isWellFormedToken, hashToken } = await import('@/lib/authenticity.server');
    if (!isWellFormedToken(data.token)) return { ok: false };

    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const tokenHash = await hashToken(data.token);

    const { data: card } = await supabaseAdmin
      .from('authenticity_cards')
      .select('id, status')
      .eq('token_hash', tokenHash)
      .maybeSingle();

    // Only active cards count as a verification scan.
    if (!card || card.status !== 'active') return { ok: false };

    await supabaseAdmin.rpc('record_authenticity_scan', { _card_id: card.id });
    return { ok: true };
  });
