import type Stripe from 'stripe';
import { createStripeClient } from '@/lib/stripe.server';

export const FLAT_SHIPPING_CENTS = 995;
export const FREE_SHIPPING_THRESHOLD_CENTS = 8000;
export const POINTS_PER_DOLLAR_REDEEM = 100; // 100 points = A$5
export const REDEEM_CENTS_PER_BLOCK = 500;

export type CheckoutLineInput = { priceId: string; quantity: number };

export async function resolveOrCreateCustomer(
  stripe: Stripe,
  userId: string,
  email: string | undefined,
): Promise<string> {
  if (!/^[a-zA-Z0-9_-]+$/.test(userId)) throw new Error('Invalid userId');
  const search = await stripe.customers.search({ query: `metadata['userId']:'${userId}'`, limit: 1 });
  if (search.data.length) return search.data[0].id;
  if (email) {
    const existing = await stripe.customers.list({ email, limit: 1 });
    if (existing.data.length) {
      await stripe.customers.update(existing.data[0].id, {
        metadata: { ...existing.data[0].metadata, userId },
      });
      return existing.data[0].id;
    }
  }
  const created = await stripe.customers.create({ ...(email && { email }), metadata: { userId } });
  return created.id;
}

export type ResolvedLine = { price: Stripe.Price; quantity: number };

export async function resolvePrices(stripe: Stripe, lines: CheckoutLineInput[]): Promise<ResolvedLine[]> {
  const resolved: ResolvedLine[] = [];
  for (const line of lines) {
    const prices = await stripe.prices.list({ lookup_keys: [line.priceId], expand: ['data.product'] });
    if (!prices.data.length) throw new Error(`Price not found: ${line.priceId}`);
    resolved.push({ price: prices.data[0], quantity: line.quantity });
  }
  return resolved;
}

export function subtotalCents(lines: ResolvedLine[]): number {
  return lines.reduce((sum, l) => sum + (l.price.unit_amount ?? 0) * l.quantity, 0);
}

export function shippingCentsFor(subtotal: number, isSubscription: boolean): number {
  if (isSubscription) return 0;
  return subtotal >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : FLAT_SHIPPING_CENTS;
}

/** Circle price lookup keys — the only subscriptions that grant free Express Post. */
export const CIRCLE_PRICE_IDS = new Set(['circle_monthly', 'circle_yearly']);

/** Service level recorded on the order so fulfilment ships the right product. */
export type ShippingService = 'auspost_parcel_post' | 'auspost_express_post';

export type ShippingSelection = {
  service: ShippingService;
  carrier: 'Australia Post';
  amountCents: number;
  displayName: string;
};

/**
 * Authoritative shipping selection. Circle members always get Australia Post
 * Express Post at A$0, whatever the subtotal; everyone else keeps the normal
 * A$9.95 / free-over-A$80 Parcel Post rules.
 */
export function shippingSelectionFor(subtotal: number, circleExpress: boolean): ShippingSelection {
  if (circleExpress) {
    return {
      service: 'auspost_express_post',
      carrier: 'Australia Post',
      amountCents: 0,
      displayName: 'Circle member · Free Express Post (Australia Post)',
    };
  }
  const amount = shippingCentsFor(subtotal, false);
  return {
    service: 'auspost_parcel_post',
    carrier: 'Australia Post',
    amountCents: amount,
    displayName: amount === 0 ? 'Free standard shipping (Australia Post)' : 'Standard shipping (Australia Post)',
  };
}

export function shippingOptionFor(subtotal: number, circleExpress = false) {
  const selection = shippingSelectionFor(subtotal, circleExpress);
  return {
    shipping_rate_data: {
      type: 'fixed_amount' as const,
      fixed_amount: { amount: selection.amountCents, currency: 'aud' },
      display_name: selection.displayName,
      delivery_estimate: {
        minimum: { unit: 'business_day' as const, value: 1 },
        maximum: { unit: 'business_day' as const, value: circleExpress ? 3 : 5 },
      },
    },
  };
}

/** True when a subscriptions row grants Circle benefits right now. */
export function isActiveCircleRow(row: { price_id?: string | null; status?: string | null; current_period_end?: string | null }): boolean {
  if (!row.price_id || !CIRCLE_PRICE_IDS.has(row.price_id)) return false;
  const status = row.status ?? '';
  if (status === 'active' || status === 'trialing' || status === 'past_due') return true;
  // End-of-period grace: cancelled but still inside the paid period.
  return status === 'canceled' && Boolean(row.current_period_end) && new Date(row.current_period_end!) > new Date();
}

/** Points redeemable against a subtotal, rounded down to whole 100-point blocks. */
export function computeRedemption(
  requestedPoints: number,
  balance: number,
  subtotal: number,
): { points: number; discountCents: number } {
  if (!requestedPoints || requestedPoints < POINTS_PER_DOLLAR_REDEEM) return { points: 0, discountCents: 0 };
  const usable = Math.floor(Math.min(requestedPoints, balance) / POINTS_PER_DOLLAR_REDEEM) * POINTS_PER_DOLLAR_REDEEM;
  if (usable <= 0) return { points: 0, discountCents: 0 };
  const rawDiscount = (usable / POINTS_PER_DOLLAR_REDEEM) * REDEEM_CENTS_PER_BLOCK;
  // Never discount below A$1 remaining so Stripe still has a chargeable amount.
  const maxDiscount = Math.max(0, subtotal - 100);
  const capped = Math.min(rawDiscount, Math.floor(maxDiscount / REDEEM_CENTS_PER_BLOCK) * REDEEM_CENTS_PER_BLOCK);
  if (capped <= 0) return { points: 0, discountCents: 0 };
  return { points: (capped / REDEEM_CENTS_PER_BLOCK) * POINTS_PER_DOLLAR_REDEEM, discountCents: capped };
}

export function lineDescriptor(lines: ResolvedLine[]): string {
  const names = lines.map((l) => {
    const product = l.price.product;
    const name = typeof product === 'string' ? l.price.lookup_key ?? 'Skin Grocer order' : (product as Stripe.Product).name;
    return l.quantity > 1 ? `${name} x${l.quantity}` : name;
  });
  const joined = names.join(', ');
  return joined.length > 300 ? `${joined.slice(0, 297)}...` : joined;
}

export function stripeFor(env: 'sandbox' | 'live'): Stripe {
  return createStripeClient(env);
}

export type OrderReceiptShape = {
  orderId?: string;
  status: 'pending' | 'paid';
  amountCents: number;
  shippingCents: number;
  discountCents: number;
  pointsEarned: number;
  pointsRedeemed: number;
  isSubscriptionOrder: boolean;
  lineItems: Array<{ name: string; quantity: number; amountCents: number }>;
  shipping: {
    name: string | null;
    line1: string | null;
    line2: string | null;
    city: string | null;
    state: string | null;
    postcode: string | null;
  } | null;
};

/** Shapes a raw orders row into the receipt the confirmation page renders. */
export function mapOrderReceipt(order: Record<string, any>): OrderReceiptShape {
  return {
    orderId: order['id'] as string,
    status: (order['status'] as string) === 'paid' ? 'paid' : 'pending',
    amountCents: (order['amount_cents'] as number) ?? 0,
    shippingCents: (order['shipping_cents'] as number) ?? 0,
    discountCents: (order['discount_cents'] as number) ?? 0,
    pointsEarned: (order['points_earned'] as number) ?? 0,
    pointsRedeemed: (order['points_redeemed'] as number) ?? 0,
    isSubscriptionOrder: Boolean(order['is_subscription_order']),
    lineItems: Array.isArray(order['line_items']) ? order['line_items'] : [],
    shipping: order['shipping_line1']
      ? {
          name: (order['shipping_name'] as string | null) ?? null,
          line1: (order['shipping_line1'] as string | null) ?? null,
          line2: (order['shipping_line2'] as string | null) ?? null,
          city: (order['shipping_city'] as string | null) ?? null,
          state: (order['shipping_state'] as string | null) ?? null,
          postcode: (order['shipping_postcode'] as string | null) ?? null,
        }
      : null,
  };
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) && value.length <= 254;
}
