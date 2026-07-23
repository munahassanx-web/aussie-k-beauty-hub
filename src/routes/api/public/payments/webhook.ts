import { createFileRoute } from '@tanstack/react-router';
import { createClient } from '@supabase/supabase-js';
import { type StripeEnv, verifyWebhook } from '@/lib/stripe.server';

let _supabase: any = null;
function getSupabase(): any {
  if (!_supabase) {
    _supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  }
  return _supabase;
}

const CIRCLE_PRICE_IDS = new Set(['circle_monthly', 'circle_yearly']);
// Products offered as Restock subscriptions (routine staples only)
const RESTOCK_PRICE_IDS = new Set<string>([
  'snail_essence_sub',
  'centella_toner_sub',
  'vitc_serum_sub',
  'rice_cleanser_sub',
  'relief_sun_sub',
  'cica_cream_sub',
  'heartleaf_ampoule_sub',
]);

function resolvePriceLookup(price: any): string | null {
  return price?.lookup_key || price?.metadata?.lovable_external_id || price?.id || null;
}

async function upsertSubscription(sub: any, env: StripeEnv) {
  const userId = sub.metadata?.userId;
  if (!userId) {
    console.error('subscription missing userId metadata', sub.id);
    return;
  }
  const item = sub.items?.data?.[0];
  const priceId = resolvePriceLookup(item?.price);
  const productId = item?.price?.product;
  const periodStart = item?.current_period_start ?? sub.current_period_start;
  const periodEnd = item?.current_period_end ?? sub.current_period_end;

  await getSupabase().from('subscriptions').upsert(
    {
      user_id: userId,
      stripe_subscription_id: sub.id,
      stripe_customer_id: sub.customer,
      product_id: productId,
      price_id: priceId,
      status: sub.status,
      current_period_start: periodStart ? new Date(periodStart * 1000).toISOString() : null,
      current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
      cancel_at_period_end: sub.cancel_at_period_end ?? false,
      environment: env,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'stripe_subscription_id' },
  );

  await recomputeMembership(userId as string);
}

async function markSubscriptionCanceled(sub: any, env: StripeEnv) {
  await getSupabase()
    .from('subscriptions')
    .update({ status: 'canceled', updated_at: new Date().toISOString() })
    .eq('stripe_subscription_id', sub.id)
    .eq('environment', env);

  const userId = sub.metadata?.userId;
  if (userId) await recomputeMembership(userId as string);
}

async function recomputeMembership(userId: string) {
  const supabase = getSupabase();
  const { data: subs } = await supabase
    .from('subscriptions')
    .select('price_id, status, current_period_end, cancel_at_period_end')
    .eq('user_id', userId);

  let tier: 'basket' | 'restock' | 'circle' = 'basket';
  let hasActive = false;
  let circleSince: string | null = null;

  for (const s of subs ?? []) {
    const active = s.status === 'active' || s.status === 'trialing' || s.status === 'past_due';
    const gracePeriod = s.status === 'canceled' && s.current_period_end && new Date(s.current_period_end as string) > new Date();
    if (!active && !gracePeriod) continue;
    hasActive = true;
    if (CIRCLE_PRICE_IDS.has(s.price_id as string)) {
      tier = 'circle';
      circleSince = new Date().toISOString();
    } else if (tier !== 'circle' && RESTOCK_PRICE_IDS.has(s.price_id as string)) {
      tier = 'restock';
    } else if (tier === 'basket') {
      // Any other recurring product opts them into Restock tier
      tier = 'restock';
    }
  }

  await supabase.from('memberships').upsert(
    {
      user_id: userId,
      tier,
      has_active_subscription: hasActive,
      circle_since: circleSince,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' },
  );
}

async function handleTransactionCompleted(txn: any, env: StripeEnv) {
  // Payments platform sends a transaction event. Extract fields defensively.
  const userId = txn.metadata?.userId || txn.customer_metadata?.userId || txn.subscription?.metadata?.userId;
  const amountCents = txn.amount_total ?? txn.amount ?? txn.amount_paid ?? 0;
  const currency = (txn.currency ?? 'aud').toLowerCase();
  const sessionId = txn.checkout_session_id ?? txn.session_id ?? txn.id;
  const paymentIntentId = txn.payment_intent_id ?? txn.payment_intent ?? null;
  const isSubscription = Boolean(txn.subscription_id || txn.subscription || txn.mode === 'subscription');

  if (!userId || !amountCents) {
    console.log('transaction.completed skipped — missing userId or amount', { userId, amountCents });
    return;
  }

  const supabase = getSupabase();

  // Insert order (idempotent by session/pi id)
  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .upsert(
      {
        user_id: userId,
        stripe_session_id: sessionId,
        stripe_payment_intent_id: paymentIntentId,
        amount_cents: amountCents,
        currency,
        is_subscription_order: isSubscription,
        environment: env,
        status: 'paid',
      },
      { onConflict: 'stripe_session_id' },
    )
    .select('id')
    .single();

  if (orderErr || !order) {
    console.error('order upsert failed', orderErr);
    return;
  }

  // Award points based on current membership tier
  const { data: membership } = await supabase
    .from('memberships')
    .select('tier')
    .eq('user_id', userId)
    .maybeSingle();

  const tier = (membership?.tier as 'basket' | 'restock' | 'circle') ?? 'basket';
  const dollars = Math.floor(amountCents / 100);
  let multiplier = 1;
  if (tier === 'circle') multiplier = 2;
  else if (tier === 'restock' && isSubscription) multiplier = 1.5;

  const pointsEarned = Math.floor(dollars * multiplier);

  if (pointsEarned > 0) {
    // Unique index on (order_id) where reason='order_earn' makes this idempotent
    await supabase.from('points_ledger').insert({
      user_id: userId,
      delta: pointsEarned,
      reason: 'order_earn',
      order_id: order.id,
      metadata: { tier, multiplier, is_subscription: isSubscription },
    });
  }
}

async function handleWebhook(req: Request, env: StripeEnv) {
  const event = await verifyWebhook(req, env);
  console.log('webhook event', event.type);

  switch (event.type) {
    case 'subscription.created':
    case 'customer.subscription.created':
      await upsertSubscription(event.data.object, env);
      break;
    case 'subscription.updated':
    case 'customer.subscription.updated':
      await upsertSubscription(event.data.object, env);
      break;
    case 'subscription.canceled':
    case 'customer.subscription.deleted':
      await markSubscriptionCanceled(event.data.object, env);
      break;
    case 'transaction.completed':
      await handleTransactionCompleted(event.data.object, env);
      break;
    case 'transaction.payment_failed':
      console.log('payment failed', event.data.object?.id);
      break;
    default:
      console.log('unhandled event', event.type);
  }
}

export const Route = createFileRoute('/api/public/payments/webhook')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawEnv = new URL(request.url).searchParams.get('env');
        if (rawEnv !== 'sandbox' && rawEnv !== 'live') {
          return Response.json({ received: true, ignored: 'invalid env' });
        }
        try {
          await handleWebhook(request, rawEnv);
          return Response.json({ received: true });
        } catch (e) {
          console.error('webhook error', e);
          return new Response('Webhook error', { status: 400 });
        }
      },
    },
  },
});
