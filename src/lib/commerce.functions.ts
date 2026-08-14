import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { type StripeEnv, createStripeClient, getStripeErrorMessage } from '@/lib/stripe.server';
import {
  type CheckoutLineInput,
  computeRedemption,
  lineDescriptor,
  resolveOrCreateCustomer,
  resolvePrices,
  shippingOptionFor,
  subtotalCents,
} from '@/lib/commerce.server';

type CheckoutResult = { clientSecret: string } | { error: string };

export const createCartCheckout = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (data: {
      items: CheckoutLineInput[];
      redeemPoints?: number;
      returnUrl: string;
      environment: StripeEnv;
    }) => {
      if (!Array.isArray(data.items) || data.items.length === 0) throw new Error('Your cart is empty');
      if (data.items.length > 20) throw new Error('Too many items in one order');
      for (const item of data.items) {
        if (!/^[a-z0-9_]+$/.test(item.priceId)) throw new Error('Invalid priceId');
        if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 10) {
          throw new Error('Invalid quantity');
        }
      }
      if (data.redeemPoints !== undefined && (!Number.isInteger(data.redeemPoints) || data.redeemPoints < 0)) {
        throw new Error('Invalid redeemPoints');
      }
      return data;
    },
  )
  .handler(async ({ data, context }): Promise<CheckoutResult> => {
    try {
      const { supabase, userId } = context;
      const { data: userRes } = await supabase.auth.getUser();
      const email = userRes.user?.email ?? undefined;

      const stripe = createStripeClient(data.environment);
      const lines = await resolvePrices(stripe, data.items);

      const recurringCount = lines.filter((l) => l.price.type === 'recurring').length;
      if (recurringCount > 0 && recurringCount !== lines.length) {
        return { error: 'Subscription items must be checked out separately from one-off items.' };
      }
      const isSubscription = recurringCount > 0;
      if (isSubscription && lines.length > 1) {
        return { error: 'Please set up one Restock subscription at a time.' };
      }

      const subtotal = subtotalCents(lines);

      // Points redemption is validated against the live ledger balance.
      let redeemPoints = 0;
      let discountCents = 0;
      if (data.redeemPoints) {
        const { data: ledger } = await supabase.from('points_ledger').select('delta').eq('user_id', userId);
        const balance = (ledger ?? []).reduce((sum, row) => sum + (row.delta as number), 0);
        const result = computeRedemption(data.redeemPoints, balance, subtotal);
        redeemPoints = result.points;
        discountCents = result.discountCents;
      }

      const discounts: { coupon: string }[] = [];
      if (discountCents > 0) {
        const coupon = await stripe.coupons.create({
          amount_off: discountCents,
          currency: 'aud',
          duration: 'once',
          name: `${redeemPoints} points reward`,
          metadata: { userId, pointsRedeemed: String(redeemPoints) },
        });
        discounts.push({ coupon: coupon.id });
      }

      const customerId = await resolveOrCreateCustomer(stripe, userId, email);
      const description = lineDescriptor(lines);

      const session = await stripe.checkout.sessions.create({
        line_items: lines.map((l) => ({ price: l.price.id, quantity: l.quantity })),
        mode: isSubscription ? 'subscription' : 'payment',
        ui_mode: 'embedded_page',
        return_url: data.returnUrl,
        customer: customerId,
        // Physical goods: always collect an Australian delivery address.
        shipping_address_collection: { allowed_countries: ['AU'] },
        phone_number_collection: { enabled: true },
        ...(isSubscription
          ? {
              subscription_data: {
                metadata: { userId, pointsRedeemed: String(redeemPoints) },
                ...(discounts.length && { discounts }),
              },
            }
          : {
              shipping_options: [shippingOptionFor(subtotal)],
              payment_intent_data: { description },
              ...(discounts.length && { discounts }),
            }),
        metadata: {
          userId,
          pointsRedeemed: String(redeemPoints),
          itemCount: String(lines.reduce((sum, l) => sum + l.quantity, 0)),
        },
      });

      return { clientSecret: session.client_secret ?? '' };
    } catch (error) {
      return { error: getStripeErrorMessage(error) };
    }
  });

export type OrderReceipt = {
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

/** Reads the order the webhook wrote for a completed checkout session. */
export const getOrderBySession = createServerFn({ method: 'GET' })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { sessionId: string }) => {
    if (!/^[a-zA-Z0-9_]+$/.test(data.sessionId)) throw new Error('Invalid session id');
    return data;
  })
  .handler(async ({ data, context }): Promise<OrderReceipt | null> => {
    const { supabase, userId } = context;
    const { data: order } = await supabase
      .from('orders')
      .select('*')
      .eq('stripe_session_id', data.sessionId)
      .eq('user_id', userId)
      .maybeSingle();
    if (!order) return null;
    return {
      status: (order.status as string) === 'paid' ? 'paid' : 'pending',
      amountCents: (order.amount_cents as number) ?? 0,
      shippingCents: (order.shipping_cents as number) ?? 0,
      discountCents: (order.discount_cents as number) ?? 0,
      pointsEarned: (order.points_earned as number) ?? 0,
      pointsRedeemed: (order.points_redeemed as number) ?? 0,
      isSubscriptionOrder: Boolean(order.is_subscription_order),
      lineItems: Array.isArray(order.line_items) ? (order.line_items as OrderReceipt['lineItems']) : [],
      shipping: order.shipping_line1
        ? {
            name: (order.shipping_name as string | null) ?? null,
            line1: (order.shipping_line1 as string | null) ?? null,
            line2: (order.shipping_line2 as string | null) ?? null,
            city: (order.shipping_city as string | null) ?? null,
            state: (order.shipping_state as string | null) ?? null,
            postcode: (order.shipping_postcode as string | null) ?? null,
          }
        : null,
    };
  });

/** Cancel at period end, or resume a subscription already scheduled to cancel. */
export const setSubscriptionCancellation = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { subscriptionRowId: string; cancel: boolean; environment: StripeEnv }) => data)
  .handler(async ({ data, context }): Promise<{ ok: true } | { error: string }> => {
    const { supabase, userId } = context;
    const { data: row } = await supabase
      .from('subscriptions')
      .select('stripe_subscription_id')
      .eq('id', data.subscriptionRowId)
      .eq('user_id', userId)
      .eq('environment', data.environment)
      .maybeSingle();
    if (!row?.stripe_subscription_id) return { error: 'Subscription not found' };
    try {
      const stripe = createStripeClient(data.environment);
      await stripe.subscriptions.update(row.stripe_subscription_id as string, {
        cancel_at_period_end: data.cancel,
      });
      return { ok: true };
    } catch (error) {
      return { error: getStripeErrorMessage(error) };
    }
  });

/** Billing portal — resolves the Stripe customer even for one-off-only buyers. */
export const openBillingPortal = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { returnUrl: string; environment: StripeEnv }) => data)
  .handler(async ({ data, context }): Promise<{ url: string } | { error: string }> => {
    const { supabase, userId } = context;
    try {
      const stripe = createStripeClient(data.environment);
      const { data: userRes } = await supabase.auth.getUser();
      const customerId = await resolveOrCreateCustomer(stripe, userId, userRes.user?.email ?? undefined);
      const portal = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: data.returnUrl,
      });
      return { url: portal.url };
    } catch (error) {
      return { error: getStripeErrorMessage(error) };
    }
  });

export const updateProfileDetails = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { displayName: string }) => {
    const name = data.displayName.trim();
    if (name.length < 1 || name.length > 80) throw new Error('Name must be 1–80 characters');
    return { displayName: name };
  })
  .handler(async ({ data, context }): Promise<{ ok: true } | { error: string }> => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from('profiles')
      .update({ display_name: data.displayName })
      .eq('id', userId);
    if (error) return { error: error.message };
    return { ok: true };
  });
