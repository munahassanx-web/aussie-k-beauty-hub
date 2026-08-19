/**
 * Order notification ledger — server only.
 *
 * One row per (order, kind) in `public.order_notifications`. The unique
 * constraint is the idempotency guarantee: Stripe can retry the webhook as many
 * times as it likes and the confirmation is recorded (and, once a provider
 * exists, sent) exactly once.
 *
 * States: pending → not_configured | queued | sent | failed | skipped.
 * `not_configured` is the honest state today — a template exists, no provider
 * does, so nothing was sent.
 */

import { activeEmailProvider } from './provider.server';
import {
  renderCancellationNotice,
  renderDeliveryConfirmation,
  renderDispatchNotice,
  renderOrderConfirmation,
  type OrderEmailData,
} from './order-emails.server';
import { maskEmail } from '@/lib/commerce-log';

export type NotificationKind = 'order_confirmation' | 'dispatch' | 'delivery' | 'cancellation';


const ORDER_EMAIL_COLUMNS =
  'id, created_at, currency, amount_cents, shipping_cents, discount_cents, line_items, shipping_name, shipping_line1, shipping_line2, shipping_city, shipping_state, shipping_postcode, shipping_country, shipping_method, tracking_number, shipping_carrier, user_id, guest_email, status, fulfillment_status';

export function toOrderEmailData(row: Record<string, any>): OrderEmailData {
  const lines = Array.isArray(row['line_items']) ? row['line_items'] : [];
  return {
    id: row['id'],
    createdAt: row['created_at'],
    currency: row['currency'] ?? 'aud',
    amountCents: row['amount_cents'] ?? 0,
    shippingCents: row['shipping_cents'] ?? 0,
    discountCents: row['discount_cents'] ?? 0,
    lines: lines.map((l: any) => ({
      name: String(l?.name ?? 'Item'),
      quantity: Number(l?.quantity ?? 1),
      amountCents: Number(l?.amountCents ?? 0),
      lookupKey: l?.lookupKey ? String(l.lookupKey) : null,
    })),
    shippingName: row['shipping_name'] ?? null,
    shippingLine1: row['shipping_line1'] ?? null,
    shippingLine2: row['shipping_line2'] ?? null,
    shippingCity: row['shipping_city'] ?? null,
    shippingState: row['shipping_state'] ?? null,
    shippingPostcode: row['shipping_postcode'] ?? null,
    shippingCountry: row['shipping_country'] ?? null,
    shippingMethod: row['shipping_method'] ?? null,
    trackingNumber: row['tracking_number'] ?? null,
    shippingCarrier: row['shipping_carrier'] ?? null,
    status: row['status'] ?? null,
    dispatchedAt: row['dispatched_at'] ?? row['shipped_at'] ?? null,
    deliveredAt: row['delivered_at'] ?? null,
    refundedCents: typeof row['refunded_cents'] === 'number' ? row['refunded_cents'] : null,
  };
}

/**
 * Recipient always comes from the stored order — a guest email captured by
 * Stripe, or the account's profile email. It is never taken from client input,
 * so this path cannot be abused to mail an arbitrary address.
 */
async function resolveRecipient(supabase: any, row: Record<string, any>): Promise<string | null> {
  const guest = (row['guest_email'] as string | null)?.trim();
  if (guest) return guest;
  const userId = row['user_id'] as string | null;
  if (!userId) return null;
  const { data } = await supabase.from('profiles').select('email').eq('id', userId).maybeSingle();
  const email = (data?.email as string | null)?.trim();
  return email || null;
}

/**
 * Records the notification intent and sends it if — and only if — a provider is
 * configured. Safe to call repeatedly: an already-sent notification is a no-op.
 */
export async function dispatchOrderNotification(
  supabaseAdminClient: any,
  orderId: string,
  kind: NotificationKind,
): Promise<{ status: string; reason?: string }> {
  const supabase = supabaseAdminClient;

  const { data: existing } = await supabase
    .from('order_notifications')
    .select('id, status, attempts')
    .eq('order_id', orderId)
    .eq('kind', kind)
    .maybeSingle();

  if (existing?.status === 'sent') return { status: 'sent', reason: 'already_sent' };

  const { data: row, error } = await supabase.from('orders').select(ORDER_EMAIL_COLUMNS).eq('id', orderId).maybeSingle();
  if (error || !row) return { status: 'failed', reason: 'order_not_found' };

  const recipient = await resolveRecipient(supabase, row);
  const order = toOrderEmailData(row);
  const rendered =
    kind === 'dispatch'
      ? renderDispatchNotice(order)
      : kind === 'delivery'
        ? renderDeliveryConfirmation(order)
        : kind === 'cancellation'
          ? renderCancellationNotice(order)
          : renderOrderConfirmation(order);

  const base = {
    order_id: orderId,
    kind,
    subject: rendered.subject,
    recipient_masked: maskEmail(recipient),
    attempts: (existing?.attempts ?? 0) + 1,
    updated_at: new Date().toISOString(),
  };

  const write = async (patch: Record<string, unknown>) => {
    await supabase.from('order_notifications').upsert({ ...base, ...patch }, { onConflict: 'order_id,kind' });
  };

  if (!recipient) {
    await write({ status: 'skipped', provider: 'none', error: 'No stored email address on this order' });
    return { status: 'skipped', reason: 'no_recipient' };
  }

  const provider = activeEmailProvider();
  if (!provider) {
    await write({ status: 'not_configured', provider: 'none', error: null });
    return { status: 'not_configured' };
  }

  const result = await provider.send({
    to: recipient,
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text,
    idempotencyKey: `${kind}:${orderId}`,
  });

  if (result.ok) {
    await write({ status: 'sent', provider: provider.id, error: null, sent_at: new Date().toISOString() });
    return { status: 'sent' };
  }

  await write({ status: 'failed', provider: provider.id, error: result.error.slice(0, 500) });
  return { status: 'failed', reason: result.error };
}
