import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { type StripeEnv, createStripeClient, getStripeErrorMessage } from '@/lib/stripe.server';
import {
  type CheckoutLineInput,
  computeRedemption,
  isValidEmail,
  lineDescriptor,
  mapOrderReceipt,
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
      orderId: order.id as string,
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

/**
 * Guest checkout — no account required. Points can't be earned or redeemed;
 * the order is stored against the email and claimed if they sign up later.
 */
export const createGuestCartCheckout = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { items: CheckoutLineInput[]; email: string; returnUrl: string; environment: StripeEnv }) => {
      if (!Array.isArray(data.items) || data.items.length === 0) throw new Error('Your cart is empty');
      if (data.items.length > 20) throw new Error('Too many items in one order');
      for (const item of data.items) {
        if (!/^[a-z0-9_]+$/.test(item.priceId)) throw new Error('Invalid priceId');
        if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 10) {
          throw new Error('Invalid quantity');
        }
      }
      if (typeof data.email !== 'string' || !isValidEmail(data.email.trim())) {
        throw new Error('Enter a valid email address');
      }
      return { ...data, email: data.email.trim().toLowerCase() };
    },
  )
  .handler(async ({ data }): Promise<CheckoutResult> => {
    try {
      const stripe = createStripeClient(data.environment);
      const lines = await resolvePrices(stripe, data.items);

      if (lines.some((l) => l.price.type === 'recurring')) {
        return { error: 'Restock subscriptions need an account. Please sign in to set one up.' };
      }

      const subtotal = subtotalCents(lines);
      const session = await stripe.checkout.sessions.create({
        line_items: lines.map((l) => ({ price: l.price.id, quantity: l.quantity })),
        mode: 'payment',
        ui_mode: 'embedded_page',
        return_url: data.returnUrl,
        customer_email: data.email,
        shipping_address_collection: { allowed_countries: ['AU'] },
        phone_number_collection: { enabled: true },
        shipping_options: [shippingOptionFor(subtotal)],
        payment_intent_data: { description: lineDescriptor(lines) },
        metadata: {
          guestEmail: data.email,
          pointsRedeemed: '0',
          itemCount: String(lines.reduce((sum, l) => sum + l.quantity, 0)),
        },
      });

      return { clientSecret: session.client_secret ?? '' };
    } catch (error) {
      return { error: getStripeErrorMessage(error) };
    }
  });

/** Receipt lookup for guest orders — keyed on the unguessable Stripe session id. */
export const getGuestOrderBySession = createServerFn({ method: 'GET' })
  .inputValidator((data: { sessionId: string }) => {
    if (!/^[a-zA-Z0-9_]+$/.test(data.sessionId)) throw new Error('Invalid session id');
    return data;
  })
  .handler(async ({ data }): Promise<OrderReceipt | null> => {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { data: order } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('stripe_session_id', data.sessionId)
      .is('user_id', null)
      .maybeSingle();
    if (!order) return null;
    return mapOrderReceipt(order as Record<string, any>);
  });

/** Links any guest orders placed with the signed-in user's email to their account. */
export const claimGuestOrders = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ claimed: number }> => {
    const { data } = await context.supabase.rpc('claim_guest_orders');
    return { claimed: typeof data === 'number' ? data : 0 };
  });

export type TrackedOrder = OrderReceipt & {
  orderId: string;
  placedAt: string;
  fulfillmentStatus: string;
  trackingNumber: string | null;
};

/**
 * Guest order tracking: requires BOTH the order id (an unguessable uuid) and the
 * email it was placed with, so knowing one alone reveals nothing.
 */
export const trackOrder = createServerFn({ method: 'POST' })
  .inputValidator((data: { orderId: string; email: string }) => {
    const orderId = data.orderId.trim().toLowerCase();
    const email = data.email.trim().toLowerCase();
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(orderId)) {
      throw new Error('That order ID does not look right. Check the confirmation email.');
    }
    if (!isValidEmail(email)) throw new Error('Enter the email you used at checkout.');
    return { orderId, email };
  })
  .handler(async ({ data }): Promise<TrackedOrder | null> => {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { data: order } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', data.orderId)
      .maybeSingle();
    if (!order) return null;

    const row = order as Record<string, any>;
    const guestEmail = typeof row['guest_email'] === 'string' ? row['guest_email'].toLowerCase() : null;
    let matches = guestEmail === data.email;
    if (!matches && row['user_id']) {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('email')
        .eq('id', row['user_id'])
        .maybeSingle();
      const accountEmail = typeof profile?.email === 'string' ? profile.email.toLowerCase() : null;
      matches = accountEmail === data.email;
    }
    if (!matches) return null;

    return {
      ...mapOrderReceipt(row),
      orderId: row['id'] as string,
      placedAt: row['created_at'] as string,
      fulfillmentStatus: (row['fulfillment_status'] as string) ?? 'processing',
      trackingNumber: (row['tracking_number'] as string | null) ?? null,
    };
  });
