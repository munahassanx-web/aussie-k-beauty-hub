import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { type StripeEnv, createStripeClient, getStripeErrorMessage } from '@/lib/stripe.server';

export type ClubSummary = {
  email: string | null;
  displayName: string | null;
  tier: 'basket' | 'restock' | 'circle';
  hasActiveSubscription: boolean;
  pointsBalance: number;
  lifetimeEarned: number;
  lifetimeSpent: number;
  recentLedger: Array<{
    id: string;
    delta: number;
    reason: string;
    createdAt: string;
  }>;
  activeSubscriptions: Array<{
    id: string;
    priceId: string | null;
    status: string;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
  }>;
  recentOrders: Array<{
    id: string;
    amountCents: number;
    currency: string;
    isSubscriptionOrder: boolean;
    fulfillmentStatus: string;
    trackingNumber: string | null;
    pointsEarned: number;
    pointsRedeemed: number;
    createdAt: string;
  }>;
};

export const getClubSummary = createServerFn({ method: 'GET' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ClubSummary> => {
    const { supabase, userId } = context;

    const [{ data: profile }, { data: membership }, { data: ledger }, { data: subs }, { data: orders }] =
      await Promise.all([
        supabase.from('profiles').select('email, display_name').eq('id', userId).maybeSingle(),
        supabase.from('memberships').select('tier, has_active_subscription').eq('user_id', userId).maybeSingle(),
        supabase
          .from('points_ledger')
          .select('id, delta, reason, created_at')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(25),
        supabase
          .from('subscriptions')
          .select('id, price_id, status, current_period_end, cancel_at_period_end')
          .eq('user_id', userId)
          .in('status', ['active', 'trialing', 'past_due', 'canceled'])
          .order('created_at', { ascending: false }),
        supabase
          .from('orders')
          .select('id, amount_cents, currency, is_subscription_order, fulfillment_status, tracking_number, points_earned, points_redeemed, created_at')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(10),
      ]);

    let balance = 0;
    let earned = 0;
    let spent = 0;
    for (const row of ledger ?? []) {
      balance += row.delta;
      if (row.delta > 0) earned += row.delta;
      else spent += Math.abs(row.delta);
    }

    return {
      email: (profile?.email as string | null) ?? null,
      displayName: (profile?.display_name as string | null) ?? null,
      tier: (membership?.tier as ClubSummary['tier']) ?? 'basket',
      hasActiveSubscription: Boolean(membership?.has_active_subscription),
      pointsBalance: balance,
      lifetimeEarned: earned,
      lifetimeSpent: spent,
      recentLedger: (ledger ?? []).map((r) => ({
        id: r.id as string,
        delta: r.delta as number,
        reason: r.reason as string,
        createdAt: r.created_at as string,
      })),
      activeSubscriptions: (subs ?? []).map((s) => ({
        id: s.id as string,
        priceId: (s.price_id as string | null) ?? null,
        status: s.status as string,
        currentPeriodEnd: (s.current_period_end as string | null) ?? null,
        cancelAtPeriodEnd: Boolean(s.cancel_at_period_end),
      })),
      recentOrders: (orders ?? []).map((o) => ({
        id: o.id as string,
        amountCents: o.amount_cents as number,
        currency: o.currency as string,
        isSubscriptionOrder: Boolean(o.is_subscription_order),
        createdAt: o.created_at as string,
      })),
    };
  });

type CheckoutResult = { clientSecret: string } | { error: string };

export const createCircleCheckout = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { priceId: 'circle_monthly' | 'circle_yearly'; returnUrl: string; environment: StripeEnv }) => {
    if (data.priceId !== 'circle_monthly' && data.priceId !== 'circle_yearly') {
      throw new Error('Invalid priceId');
    }
    return data;
  })
  .handler(async ({ data, context }): Promise<CheckoutResult> => {
    try {
      const { supabase, userId } = context;
      const { data: userRes } = await supabase.auth.getUser();
      const email = userRes.user?.email ?? undefined;

      const stripe = createStripeClient(data.environment);
      const prices = await stripe.prices.list({ lookup_keys: [data.priceId] });
      if (!prices.data.length) return { error: 'Price not found' };
      const price = prices.data[0];

      // Resolve or create customer with userId metadata
      let customerId: string | undefined;
      const searchRes = await stripe.customers.search({
        query: `metadata['userId']:'${userId}'`,
        limit: 1,
      });
      if (searchRes.data.length) {
        customerId = searchRes.data[0].id;
      } else if (email) {
        const existing = await stripe.customers.list({ email, limit: 1 });
        if (existing.data.length) {
          customerId = existing.data[0].id;
          await stripe.customers.update(customerId, {
            metadata: { ...existing.data[0].metadata, userId },
          });
        }
      }
      if (!customerId) {
        const created = await stripe.customers.create({
          ...(email && { email }),
          metadata: { userId },
        });
        customerId = created.id;
      }

      const session = await stripe.checkout.sessions.create({
        line_items: [{ price: price.id, quantity: 1 }],
        mode: 'subscription',
        ui_mode: 'embedded_page',
        return_url: data.returnUrl,
        customer: customerId,
        metadata: { userId },
        subscription_data: { metadata: { userId } },
      });

      return { clientSecret: session.client_secret ?? '' };
    } catch (error) {
      return { error: getStripeErrorMessage(error) };
    }
  });

export const createBillingPortal = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { returnUrl: string; environment: StripeEnv }) => data)
  .handler(async ({ data, context }): Promise<{ url: string } | { error: string }> => {
    const { supabase, userId } = context;
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .eq('environment', data.environment)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!sub?.stripe_customer_id) return { error: 'No subscription found' };
    try {
      const stripe = createStripeClient(data.environment);
      const portal = await stripe.billingPortal.sessions.create({
        customer: sub.stripe_customer_id as string,
        return_url: data.returnUrl,
      });
      return { url: portal.url };
    } catch (error) {
      return { error: getStripeErrorMessage(error) };
    }
  });
