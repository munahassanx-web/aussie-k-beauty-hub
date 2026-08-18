import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';

/**
 * Warehouse / owner order operations.
 *
 * Access is enforced twice: `is_fulfillment_staff()` RLS on `public.orders`
 * (admin or moderator) and an explicit check here, so a non-staff caller gets a
 * clear error instead of an empty list. Staff can read orders and update
 * fulfilment fields only — never money, line items or customer identity.
 */

export const FULFILMENT_STAGES = ['processing', 'packed', 'shipped', 'delivered'] as const;
export type FulfilmentStage = (typeof FULFILMENT_STAGES)[number];
const EDITABLE_STATUSES = [...FULFILMENT_STAGES, 'cancelled'] as const;

export type AdminOrderLine = { name: string; quantity: number; amountCents: number; lookupKey: string | null };

export type AdminOrderSummary = {
  id: string;
  createdAt: string;
  status: string;
  fulfillmentStatus: string;
  amountCents: number;
  currency: string;
  isSubscriptionOrder: boolean;
  itemCount: number;
  customerName: string | null;
  customerEmail: string | null;
  isGuest: boolean;
  shippingCity: string | null;
  shippingState: string | null;
  trackingNumber: string | null;
  shippingCarrier: string | null;
  lines: AdminOrderLine[];
};

export type AdminOrderDetail = AdminOrderSummary & {
  shippingName: string | null;
  shippingPhone: string | null;
  shippingLine1: string | null;
  shippingLine2: string | null;
  shippingPostcode: string | null;
  shippingCountry: string | null;
  shippingMethod: string | null;
  shippingCents: number;
  discountCents: number;
  pointsEarned: number;
  pointsRedeemed: number;
  stripeSessionId: string | null;
  stripePaymentIntentId: string | null;
  environment: string;
  packedAt: string | null;
  shippedAt: string | null;
  dispatchedAt: string | null;
  fulfillmentUpdatedAt: string | null;
  opsNotes: string | null;
  // Carrier-integration seam — populated manually today, by an adapter later.
  shippingProvider: string;
  shippingService: string | null;
  shipmentId: string | null;
  labelStatus: string;
  labelUrl: string | null;
  labelReference: string | null;
  shippingCostActualCents: number | null;
};

type Row = Record<string, any>;

async function assertStaff(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc('is_fulfillment_staff', { _user_id: context.userId });
  if (error || data !== true) throw new Error('Unauthorized: fulfilment staff only');
}

function toLines(value: unknown): AdminOrderLine[] {
  if (!Array.isArray(value)) return [];
  return value.map((l: any) => ({
    name: String(l?.name ?? 'Item'),
    quantity: Number(l?.quantity ?? 1),
    amountCents: Number(l?.amountCents ?? 0),
    lookupKey: (l?.lookupKey as string | null) ?? null,
  }));
}

function summarise(row: Row, emailByUser: Map<string, { email: string | null; name: string | null }>): AdminOrderSummary {
  const lines = toLines(row['line_items']);
  const profile = row['user_id'] ? emailByUser.get(row['user_id'] as string) : undefined;
  return {
    id: row['id'],
    createdAt: row['created_at'],
    status: row['status'] ?? 'paid',
    fulfillmentStatus: row['fulfillment_status'] ?? 'processing',
    amountCents: row['amount_cents'] ?? 0,
    currency: (row['currency'] ?? 'aud').toUpperCase(),
    isSubscriptionOrder: Boolean(row['is_subscription_order']),
    itemCount: lines.reduce((sum, l) => sum + l.quantity, 0),
    customerName: row['shipping_name'] ?? profile?.name ?? null,
    customerEmail: row['guest_email'] ?? profile?.email ?? null,
    isGuest: !row['user_id'],
    shippingCity: row['shipping_city'] ?? null,
    shippingState: row['shipping_state'] ?? null,
    trackingNumber: row['tracking_number'] ?? null,
    shippingCarrier: row['shipping_carrier'] ?? null,
    lines,
  };
}

async function profileMap(supabase: any, rows: Row[]) {
  const ids = [...new Set(rows.map((r) => r['user_id']).filter(Boolean))] as string[];
  const map = new Map<string, { email: string | null; name: string | null }>();
  if (ids.length === 0) return map;
  const { data } = await supabase.from('profiles').select('id, email, display_name').in('id', ids);
  for (const p of (data ?? []) as Row[]) {
    map.set(p['id'], { email: p['email'] ?? null, name: p['display_name'] ?? null });
  }
  return map;
}

const LIST_COLUMNS =
  'id, created_at, status, fulfillment_status, amount_cents, currency, is_subscription_order, line_items, user_id, guest_email, shipping_name, shipping_city, shipping_state, tracking_number, shipping_carrier';

/** Owner overview + the live fulfilment queue in one round trip. */
export const listAdminOrders = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { stage?: string; search?: string } | undefined) => input ?? {})
  .handler(async ({ data, context }) => {
    await assertStaff(context as any);
    const supabase = context.supabase as any;

    let query = supabase.from('orders').select(LIST_COLUMNS).order('created_at', { ascending: false }).limit(200);
    if (data.stage && data.stage !== 'all') query = query.eq('fulfillment_status', data.stage);

    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);

    const map = await profileMap(supabase, (rows ?? []) as Row[]);
    let orders = ((rows ?? []) as Row[]).map((r) => summarise(r, map));

    const term = data.search?.trim().toLowerCase();
    if (term) {
      orders = orders.filter((o) =>
        [o.id, o.customerEmail, o.customerName, o.trackingNumber, ...o.lines.map((l) => l.name)]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(term)),
      );
    }

    // Counts are computed over the unfiltered queue so the overview stays stable.
    const { data: allRows } = await supabase
      .from('orders')
      .select('fulfillment_status, status, amount_cents, created_at')
      .order('created_at', { ascending: false })
      .limit(500);

    const counts: Record<string, number> = { processing: 0, packed: 0, shipped: 0, delivered: 0, cancelled: 0 };
    let revenueCents = 0;
    let last7Cents = 0;
    let last7Count = 0;
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    for (const r of (allRows ?? []) as Row[]) {
      const stage = (r['fulfillment_status'] as string) ?? 'processing';
      counts[stage] = (counts[stage] ?? 0) + 1;
      if (r['status'] === 'paid') {
        revenueCents += r['amount_cents'] ?? 0;
        if (new Date(r['created_at'] as string).getTime() >= weekAgo) {
          last7Cents += r['amount_cents'] ?? 0;
          last7Count += 1;
        }
      }
    }

    return {
      orders,
      counts,
      totals: { revenueCents, last7Cents, last7Count, total: (allRows ?? []).length },
    };
  });

export const getAdminOrder = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => {
    if (!input?.id) throw new Error('Missing order id');
    return input;
  })
  .handler(async ({ data, context }): Promise<AdminOrderDetail | null> => {
    await assertStaff(context as any);
    const supabase = context.supabase as any;
    const { data: row, error } = await supabase.from('orders').select('*').eq('id', data.id).maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) return null;

    const map = await profileMap(supabase, [row as Row]);
    const base = summarise(row as Row, map);
    const r = row as Row;
    return {
      ...base,
      shippingName: r['shipping_name'] ?? null,
      shippingPhone: r['shipping_phone'] ?? null,
      shippingLine1: r['shipping_line1'] ?? null,
      shippingLine2: r['shipping_line2'] ?? null,
      shippingPostcode: r['shipping_postcode'] ?? null,
      shippingCountry: r['shipping_country'] ?? null,
      shippingMethod: r['shipping_method'] ?? null,
      shippingCents: r['shipping_cents'] ?? 0,
      discountCents: r['discount_cents'] ?? 0,
      pointsEarned: r['points_earned'] ?? 0,
      pointsRedeemed: r['points_redeemed'] ?? 0,
      stripeSessionId: r['stripe_session_id'] ?? null,
      stripePaymentIntentId: r['stripe_payment_intent_id'] ?? null,
      environment: r['environment'] ?? 'sandbox',
      packedAt: r['packed_at'] ?? null,
      shippedAt: r['shipped_at'] ?? null,
      dispatchedAt: r['dispatched_at'] ?? null,
      fulfillmentUpdatedAt: r['fulfillment_updated_at'] ?? null,
      opsNotes: r['ops_notes'] ?? null,
      shippingProvider: r['shipping_provider'] ?? 'manual',
      shippingService: r['shipping_service'] ?? null,
      shipmentId: r['shipment_id'] ?? null,
      labelStatus: r['label_status'] ?? 'none',
      labelUrl: r['label_url'] ?? null,
      labelReference: r['label_reference'] ?? null,
      shippingCostActualCents: r['shipping_cost_actual_cents'] ?? null,
    };
  });

/** Fulfilment-only write: stage, carrier, tracking and internal notes. */
export const updateOrderFulfilment = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: {
    id: string;
    fulfillmentStatus?: string;
    trackingNumber?: string | null;
    shippingCarrier?: string | null;
    opsNotes?: string | null;
  }) => {
    if (!input?.id) throw new Error('Missing order id');
    if (input.fulfillmentStatus && !EDITABLE_STATUSES.includes(input.fulfillmentStatus as any)) {
      throw new Error('Unknown fulfilment status');
    }
    if (input.trackingNumber && input.trackingNumber.trim().length > 80) throw new Error('Tracking number too long');
    if (input.opsNotes && input.opsNotes.length > 2000) throw new Error('Note too long');
    return input;
  })
  .handler(async ({ data, context }) => {
    await assertStaff(context as any);
    const supabase = context.supabase as any;
    const now = new Date().toISOString();

    const patch: Record<string, unknown> = {
      fulfillment_updated_at: now,
      fulfillment_updated_by: context.userId,
    };
    if (data.fulfillmentStatus) {
      patch['fulfillment_status'] = data.fulfillmentStatus;
      if (data.fulfillmentStatus === 'packed') patch['packed_at'] = now;
      if (data.fulfillmentStatus === 'shipped') patch['shipped_at'] = now;
    }
    if (data.trackingNumber !== undefined) patch['tracking_number'] = data.trackingNumber?.trim() || null;
    if (data.shippingCarrier !== undefined) patch['shipping_carrier'] = data.shippingCarrier?.trim() || null;
    if (data.opsNotes !== undefined) patch['ops_notes'] = data.opsNotes?.trim() || null;

    const { error } = await supabase.from('orders').update(patch).eq('id', data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
