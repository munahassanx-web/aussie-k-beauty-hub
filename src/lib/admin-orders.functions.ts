import { isPlausibleTracking } from '@/lib/shipping/carriers';
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
  deliveredAt: string | null;
  cancelledAt: string | null;
  refundedAt: string | null;
  refundedCents: number | null;
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
      deliveredAt: r['delivered_at'] ?? null,
      cancelledAt: r['cancelled_at'] ?? null,
      refundedAt: r['refunded_at'] ?? null,
      refundedCents: typeof r['refunded_cents'] === 'number' ? r['refunded_cents'] : null,
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

/**
 * Reports whether an automated label provider is actually connected.
 * Today this is always false — the UI uses it to show the honest manual
 * workflow instead of a dead "buy label" button.
 */
export const getShippingCapability = createServerFn({ method: 'GET' }).handler(async () => {
  const { PROVIDERS, hasAutomatedProvider } = await import('@/lib/shipping/provider.server');
  return {
    automated: hasAutomatedProvider(),
    providers: PROVIDERS.map((p) => ({ id: p.id, label: p.label, configured: p.isConfigured() })),
  };
});

/** Fulfilment-only write: stage, carrier/service, shipment + label fields, notes. */
export const updateOrderFulfilment = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: {
    id: string;
    fulfillmentStatus?: string;
    trackingNumber?: string | null;
    shippingCarrier?: string | null;
    shippingService?: string | null;
    shipmentId?: string | null;
    labelReference?: string | null;
    labelUrl?: string | null;
    shippingCostActualCents?: number | null;
    opsNotes?: string | null;
  }) => {
    if (!input?.id) throw new Error('Missing order id');
    if (input.fulfillmentStatus && !EDITABLE_STATUSES.includes(input.fulfillmentStatus as any)) {
      throw new Error('Unknown fulfilment status');
    }
    // "Delivered" notifies the customer, so it has its own confirmed action.
    if (input.fulfillmentStatus === 'delivered') {
      throw new Error('Use the confirmed "Mark delivered" action for this order');
    }
    if (input.trackingNumber && input.trackingNumber.trim().length > 80) throw new Error('Tracking number too long');
    if (input.shipmentId && input.shipmentId.trim().length > 120) throw new Error('Shipment ID too long');
    if (input.labelUrl && !/^https:\/\//i.test(input.labelUrl.trim()) && input.labelUrl.trim() !== '') {
      throw new Error('Label URL must be an https link');
    }
    if (
      input.shippingCostActualCents != null &&
      (!Number.isFinite(input.shippingCostActualCents) || input.shippingCostActualCents < 0)
    ) {
      throw new Error('Label cost must be a positive amount');
    }
    if (input.opsNotes && input.opsNotes.length > 2000) throw new Error('Note too long');
    return input;
  })
  .handler(async ({ data, context }) => {
    await assertStaff(context as any);
    const supabase = context.supabase as any;
    const now = new Date().toISOString();

    // Payment gate: only a genuinely paid order can move into packing or
    // dispatch. Pending / failed / refunded orders can be cancelled or noted,
    // never fulfilled by accident.
    if (data.fulfillmentStatus && data.fulfillmentStatus !== 'cancelled') {
      const { data: payRow } = await supabase.from('orders').select('status').eq('id', data.id).maybeSingle();
      const payStatus = (payRow?.status as string | null) ?? 'pending';
      if (payStatus !== 'paid') {
        throw new Error(`Payment status is "${payStatus}" — only paid orders can be packed or dispatched`);
      }
    }

    const patch: Record<string, unknown> = {
      fulfillment_updated_at: now,
      fulfillment_updated_by: context.userId,
    };
    if (data.shippingService !== undefined) patch['shipping_service'] = data.shippingService?.trim() || null;
    if (data.shipmentId !== undefined) patch['shipment_id'] = data.shipmentId?.trim() || null;
    if (data.labelReference !== undefined) patch['label_reference'] = data.labelReference?.trim() || null;
    if (data.labelUrl !== undefined) {
      const url = data.labelUrl?.trim() || null;
      patch['label_url'] = url;
      // Manual workflow: a pasted label link is proof the label exists.
      patch['label_status'] = url ? 'ready' : 'none';
    }
    if (data.shippingCostActualCents !== undefined) {
      patch['shipping_cost_actual_cents'] =
        data.shippingCostActualCents == null ? null : Math.round(data.shippingCostActualCents);
    }
    if (data.fulfillmentStatus) {
      patch['fulfillment_status'] = data.fulfillmentStatus;
      if (data.fulfillmentStatus === 'cancelled') patch['cancelled_at'] = now;
      if (data.fulfillmentStatus === 'packed') patch['packed_at'] = now;
      if (data.fulfillmentStatus === 'shipped') {
        patch['shipped_at'] = now;
        patch['dispatched_at'] = now;
      }
    }
    if (data.trackingNumber !== undefined) patch['tracking_number'] = data.trackingNumber?.trim() || null;
    if (data.shippingCarrier !== undefined) patch['shipping_carrier'] = data.shippingCarrier?.trim() || null;
    if (data.opsNotes !== undefined) patch['ops_notes'] = data.opsNotes?.trim() || null;

    const { error } = await supabase.from('orders').update(patch).eq('id', data.id);
    if (error) throw new Error(error.message);

    // Dispatch notification fires only once the order is genuinely marked
    // shipped. It is recorded in the ledger either way; with no provider
    // connected it records `not_configured`, never a false "sent".
    let notification: { status: string; reason?: string } | null = null;
    if (data.fulfillmentStatus === 'shipped') {
      // Server-side guard: a dispatch email is only worth sending when the
      // stored carrier + tracking are genuinely present and plausible.
      const { data: shipRow } = await supabase
        .from('orders')
        .select('tracking_number, shipping_carrier')
        .eq('id', data.id)
        .maybeSingle();
      const carrier = (shipRow?.shipping_carrier as string | null) ?? null;
      const tracking = (shipRow?.tracking_number as string | null) ?? null;
      if (!isPlausibleTracking(carrier, tracking)) {
        return { ok: true, notification: { status: 'skipped', reason: 'missing_tracking' } };
      }
      try {
        const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
        const { dispatchOrderNotification } = await import('@/lib/email/notifications.server');
        notification = await dispatchOrderNotification(supabaseAdmin, data.id, 'dispatch');
      } catch (e) {
        console.error('[ops] dispatch notification failed', (e as Error)?.message);
        notification = { status: 'failed' };
      }
    }

    return { ok: true, notification };
  });

// ------------------------------------------------------------------ comms

export type OrderNotification = {
  kind: 'order_confirmation' | 'dispatch' | 'delivery' | 'cancellation';
  status: 'pending' | 'not_configured' | 'queued' | 'sent' | 'failed' | 'skipped';
  provider: string;
  recipientMasked: string | null;
  subject: string | null;
  error: string | null;
  attempts: number;
  createdAt: string;
  sentAt: string | null;
};

/** Truthful comms state for one order, straight from the persisted ledger. */
export const getOrderComms = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => {
    if (!input?.id) throw new Error('Missing order id');
    return input;
  })
  .handler(async ({ data, context }) => {
    await assertStaff(context as any);
    const supabase = context.supabase as any;
    const { data: rows, error } = await supabase
      .from('order_notifications')
      .select('kind, status, provider, recipient_masked, subject, error, attempts, created_at, sent_at')
      .eq('order_id', data.id);
    if (error) throw new Error(error.message);

    const { emailCapability } = await import('@/lib/email/provider.server');
    const { dispatchMessagePlainText } = await import('@/lib/email/order-emails.server');
    const { toOrderEmailData } = await import('@/lib/email/notifications.server');

    const { data: order } = await supabase
      .from('orders')
      .select(
        'id, created_at, currency, amount_cents, shipping_cents, discount_cents, line_items, shipping_name, shipping_line1, shipping_line2, shipping_city, shipping_state, shipping_postcode, shipping_country, shipping_method, tracking_number, shipping_carrier',
      )
      .eq('id', data.id)
      .maybeSingle();

    return {
      capability: emailCapability(),
      notifications: ((rows ?? []) as Row[]).map((r) => ({
        kind: r['kind'],
        status: r['status'],
        provider: r['provider'],
        recipientMasked: r['recipient_masked'] ?? null,
        subject: r['subject'] ?? null,
        error: r['error'] ?? null,
        attempts: r['attempts'] ?? 0,
        createdAt: r['created_at'],
        sentAt: r['sent_at'] ?? null,
      })) as OrderNotification[],
      // Manual fallback text — real order reference, carrier, tracking and link only.
      dispatchMessage: order ? dispatchMessagePlainText(toOrderEmailData(order as Row)) : null,
    };
  });

/**
 * Staff-triggered (re)send. The recipient is resolved server-side from the
 * stored order, never from client input, and the ledger keeps it idempotent.
 */
export const sendOrderNotification = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; kind: 'order_confirmation' | 'dispatch' | 'delivery' | 'cancellation' }) => {
    if (!input?.id) throw new Error('Missing order id');
    if (!['order_confirmation', 'dispatch', 'delivery', 'cancellation'].includes(input.kind)) {
      throw new Error('Unknown notification kind');
    }
    return input;
  })
  .handler(async ({ data, context }) => {
    await assertStaff(context as any);
    const supabase = context.supabase as any;
    const { data: row } = await supabase
      .from('orders')
      .select('status, fulfillment_status, delivered_at, refunded_at, tracking_number, shipping_carrier')
      .eq('id', data.id)
      .maybeSingle();
    if (!row) throw new Error('Order not found');

    // Each notice may only be (re)sent when the state it describes is real.
    if (data.kind === 'delivery' && !row.delivered_at) {
      throw new Error('This order has not been marked delivered yet');
    }
    if (data.kind === 'cancellation' && !row.refunded_at && row.fulfillment_status !== 'cancelled') {
      throw new Error('This order has no recorded cancellation or refund');
    }
    if (data.kind === 'dispatch' && row.fulfillment_status !== 'shipped' && row.fulfillment_status !== 'delivered') {
      throw new Error('This order has not been dispatched yet');
    }
    if (data.kind === 'dispatch' && !isPlausibleTracking(row.shipping_carrier ?? null, row.tracking_number ?? null)) {
      throw new Error('Add a valid tracking number before sending the dispatch email');
    }
    if (data.kind === 'order_confirmation' && row.status !== 'paid') {
      throw new Error('Only a paid order can receive an order confirmation');
    }

    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { dispatchOrderNotification } = await import('@/lib/email/notifications.server');
    // Staff pressed the button deliberately, so a completed notice may be re-sent.
    return dispatchOrderNotification(supabaseAdmin, data.id, data.kind, { force: true });
  });

/**
 * Staff-confirmed delivery. Australia Post MyPost Business gives this project
 * no authenticated tracking API, so there is no trustworthy automatic delivery
 * signal — a human confirms it. Sets the stage, stamps `delivered_at` and sends
 * the approved Delivered email exactly once via the notification ledger.
 */
export const markOrderDelivered = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; confirm: true }) => {
    if (!input?.id) throw new Error('Missing order id');
    if (input.confirm !== true) throw new Error('Delivery must be explicitly confirmed');
    return input;
  })
  .handler(async ({ data, context }) => {
    await assertStaff(context as any);
    const supabase = context.supabase as any;
    const now = new Date().toISOString();

    const { data: row } = await supabase
      .from('orders')
      .select('status, fulfillment_status, delivered_at')
      .eq('id', data.id)
      .maybeSingle();
    if (!row) throw new Error('Order not found');
    if (row.status !== 'paid') throw new Error('Only a paid order can be marked delivered');
    if (row.fulfillment_status !== 'shipped' && row.fulfillment_status !== 'delivered') {
      throw new Error('Mark the order dispatched before marking it delivered');
    }

    if (!row.delivered_at) {
      const { error } = await supabase
        .from('orders')
        .update({
          fulfillment_status: 'delivered',
          delivered_at: now,
          fulfillment_updated_at: now,
          fulfillment_updated_by: context.userId,
        })
        .eq('id', data.id);
      if (error) throw new Error(error.message);
    }

    let notification: { status: string; reason?: string } = { status: 'failed' };
    try {
      const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
      const { dispatchOrderNotification } = await import('@/lib/email/notifications.server');
      notification = await dispatchOrderNotification(supabaseAdmin, data.id, 'delivery');
    } catch (e) {
      console.error('[ops] delivery notification failed', (e as Error)?.message);
    }
    return { ok: true, notification };
  });
