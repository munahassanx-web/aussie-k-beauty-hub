import { createFileRoute } from '@tanstack/react-router';
import { createClient } from '@supabase/supabase-js';
import { type StripeEnv, createStripeClient, verifyWebhook } from '@/lib/stripe.server';
import { errorCommerce, logCommerce, maskEmail, newTraceId, shortId, since, warnCommerce } from '@/lib/commerce-log';
import { dispatchOrderNotification } from '@/lib/email/notifications.server';

let _supabase: any = null;
function getSupabase(): any {
  if (!_supabase) {
    _supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  }
  return _supabase;
}

const CIRCLE_PRICE_IDS = new Set(['circle_monthly', 'circle_yearly']);

function resolvePriceLookup(price: any): string | null {
  return price?.lookup_key || price?.metadata?.lovable_external_id || price?.id || null;
}

function isRestockPrice(priceId: string | null): boolean {
  return Boolean(priceId && priceId.startsWith('restock_'));
}

// ---------------------------------------------------------------- subscriptions

async function upsertSubscription(sub: any, env: StripeEnv) {
  const userId = sub.metadata?.userId;
  if (!userId) {
    warnCommerce('webhook', 'subscription.missing_user_metadata', { subscriptionId: sub.id, env });
    return;
  }
  const item = sub.items?.data?.[0];
  const priceId = resolvePriceLookup(item?.price);
  const productId = item?.price?.product;
  const periodStart = item?.current_period_start ?? sub.current_period_start;
  const periodEnd = item?.current_period_end ?? sub.current_period_end;

  const { error } = await getSupabase().from('subscriptions').upsert(
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

  if (error) {
    errorCommerce('webhook', 'subscription.upsert_failed', error, { subscriptionId: sub.id, env });
  } else {
    logCommerce('webhook', 'subscription.upserted', {
      subscriptionId: sub.id,
      userId: shortId(userId),
      priceId,
      status: sub.status,
      unitCents: item?.price?.unit_amount ?? null,
      interval: item?.price?.recurring?.interval ?? null,
      cancelAtPeriodEnd: sub.cancel_at_period_end ?? false,
      env,
    });
  }

  await recomputeMembership(userId as string, env);
}

async function markSubscriptionCanceled(sub: any, env: StripeEnv) {
  await getSupabase()
    .from('subscriptions')
    .update({ status: 'canceled', updated_at: new Date().toISOString() })
    .eq('stripe_subscription_id', sub.id)
    .eq('environment', env);

  const userId = sub.metadata?.userId;
  if (userId) await recomputeMembership(userId as string, env);
}

async function recomputeMembership(userId: string, env: StripeEnv) {
  const supabase = getSupabase();
  const [{ data: subs }, { data: existing }] = await Promise.all([
    supabase
      .from('subscriptions')
      .select('price_id, status, current_period_end')
      .eq('user_id', userId)
      .eq('environment', env),
    supabase.from('memberships').select('circle_since').eq('user_id', userId).maybeSingle(),
  ]);

  let tier: 'basket' | 'restock' | 'circle' = 'basket';
  let hasActive = false;

  for (const s of subs ?? []) {
    const active = s.status === 'active' || s.status === 'trialing' || s.status === 'past_due';
    const grace =
      s.status === 'canceled' && s.current_period_end && new Date(s.current_period_end as string) > new Date();
    if (!active && !grace) continue;
    hasActive = true;
    if (CIRCLE_PRICE_IDS.has(s.price_id as string)) tier = 'circle';
    else if (tier !== 'circle' && isRestockPrice(s.price_id as string)) tier = 'restock';
  }

  // circle_since is set once, on the first upgrade to Circle, and never overwritten.
  const circleSince =
    tier === 'circle' ? (existing?.circle_since as string | null) ?? new Date().toISOString() : (existing?.circle_since as string | null) ?? null;

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

// ---------------------------------------------------------------- orders

async function pointsMultiplier(userId: string, isSubscription: boolean): Promise<{ tier: string; multiplier: number }> {
  const { data: membership } = await getSupabase()
    .from('memberships')
    .select('tier')
    .eq('user_id', userId)
    .maybeSingle();
  const tier = (membership?.tier as string) ?? 'basket';
  if (tier === 'circle') return { tier, multiplier: 2 };
  if (tier === 'restock' && isSubscription) return { tier, multiplier: 1.5 };
  return { tier, multiplier: 1 };
}

async function awardPoints(
  userId: string,
  orderId: string,
  pointsEarned: number,
  pointsRedeemed: number,
  meta: Record<string, unknown>,
) {
  const supabase = getSupabase();
  if (pointsEarned > 0) {
    // Unique index on (order_id, reason) makes this safe against webhook retries.
    await supabase
      .from('points_ledger')
      .upsert(
        { user_id: userId, delta: pointsEarned, reason: 'order_earn', order_id: orderId, metadata: meta },
        { onConflict: 'order_id,reason' },
      );
  }
  if (pointsRedeemed > 0) {
    await supabase
      .from('points_ledger')
      .upsert(
        { user_id: userId, delta: -pointsRedeemed, reason: 'redeem', order_id: orderId, metadata: meta },
        { onConflict: 'order_id,reason' },
      );
  }
}

/** Fulfils a completed Checkout Session (one-off order, or first subscription order). */
async function handleCheckoutSession(session: any, env: StripeEnv, paid: boolean) {
  const startedAt = Date.now();
  const userId = session.metadata?.userId ?? null;
  const guestEmail = session.metadata?.guestEmail ?? session.customer_details?.email ?? null;
  if (!userId && !guestEmail) {
    warnCommerce('webhook', 'session.missing_identity_metadata', { sessionId: session.id, env });
    return;
  }

  const supabase = getSupabase();
  const stripe = createStripeClient(env);

  // `lookupKey` is the catalog priceId — storing it lets the account area map
  // an order line back to a current SKU exactly, instead of by display name.
  let lineItems: Array<{ name: string; quantity: number; amountCents: number; lookupKey: string | null }> = [];
  try {
    const items = await stripe.checkout.sessions.listLineItems(session.id, { limit: 50, expand: ['data.price.product'] });
    lineItems = items.data.map((item: any) => ({
      name: item.description ?? item.price?.product?.name ?? 'Item',
      quantity: item.quantity ?? 1,
      amountCents: item.amount_total ?? 0,
      lookupKey: item.price?.lookup_key ?? null,
    }));
  } catch (e) {
    errorCommerce('webhook', 'session.line_items_failed', e, { sessionId: session.id, env });
  }

  const shipping = session.collected_information?.shipping_details ?? session.shipping_details ?? null;
  const address = shipping?.address ?? null;
  const amountCents = session.amount_total ?? 0;
  const shippingCents = session.total_details?.amount_shipping ?? 0;
  const discountCents = session.total_details?.amount_discount ?? 0;
  const pointsRedeemed = Number(session.metadata?.pointsRedeemed ?? 0) || 0;
  const isSubscription = session.mode === 'subscription';

  // Guest orders earn no points — there's no account to hold them.
  const { tier, multiplier } = userId
    ? await pointsMultiplier(userId, isSubscription)
    : { tier: 'guest', multiplier: 0 };
  // Points are earned on product spend only — never on shipping.
  const productCents = Math.max(0, amountCents - shippingCents);
  const pointsEarned = paid && userId ? Math.floor(Math.floor(productCents / 100) * multiplier) : 0;

  logCommerce('webhook', 'session.totals', {
    sessionId: session.id,
    env,
    paid,
    paymentStatus: session.payment_status,
    mode: session.mode,
    userId: shortId(userId),
    guestEmail: userId ? null : maskEmail(guestEmail),
    amountSubtotalCents: session.amount_subtotal ?? null,
    amountTotalCents: amountCents,
    shippingCents,
    discountCents,
    productCents,
    pointsRedeemed,
    tier,
    multiplier,
    pointsEarned,
    lineItems,
  });

  // Sanity check: Stripe's total should equal subtotal + shipping − discount.
  const expected = (session.amount_subtotal ?? 0) + shippingCents - discountCents;
  if (session.amount_subtotal != null && expected !== amountCents) {
    warnCommerce('webhook', 'session.total_mismatch', {
      sessionId: session.id,
      expectedTotalCents: expected,
      stripeTotalCents: amountCents,
    });
  }

  const { data: order, error } = await supabase
    .from('orders')
    .upsert(
      {
        user_id: userId,
        guest_email: userId ? null : guestEmail,
        stripe_session_id: session.id,
        stripe_payment_intent_id: session.payment_intent ?? null,
        amount_cents: amountCents,
        currency: (session.currency ?? 'aud').toLowerCase(),
        is_subscription_order: isSubscription,
        environment: env,
        status: paid ? 'paid' : 'pending',
        fulfillment_status: paid ? 'processing' : 'awaiting_payment',
        points_earned: pointsEarned,
        points_redeemed: userId ? pointsRedeemed : 0,
        discount_cents: discountCents,
        shipping_cents: shippingCents,
        shipping_method: session.shipping_cost?.shipping_rate ? 'standard' : null,
        line_items: lineItems,
        shipping_name: shipping?.name ?? null,
        shipping_phone: session.customer_details?.phone ?? null,
        shipping_line1: address?.line1 ?? null,
        shipping_line2: address?.line2 ?? null,
        shipping_city: address?.city ?? null,
        shipping_state: address?.state ?? null,
        shipping_postcode: address?.postal_code ?? null,
        shipping_country: address?.country ?? null,
      },
      { onConflict: 'stripe_session_id' },
    )
    .select('id')
    .single();

  if (error || !order) {
    errorCommerce('webhook', 'order.upsert_failed', error, { sessionId: session.id, env });
    return;
  }

  logCommerce('webhook', 'order.upserted', {
    sessionId: session.id,
    orderId: order.id,
    status: paid ? 'paid' : 'pending',
    amountTotalCents: amountCents,
    hasShippingAddress: Boolean(address?.line1),
    elapsedMs: since(startedAt),
  });

  if (paid) {
    // Idempotent per order line — Stripe retries never double-decrement.
    const { recordOrderStockSale } = await import('@/lib/inventory.server');
    await recordOrderStockSale(order.id, lineItems);
  }

  if (paid && userId) {
    await awardPoints(userId, order.id, pointsEarned, pointsRedeemed, {
      tier,
      multiplier,
      is_subscription: isSubscription,
    });
    logCommerce('points', 'ledger.written', {
      orderId: order.id,
      userId: shortId(userId),
      pointsEarned,
      pointsRedeemed,
      tier,
      multiplier,
    });
  }

  // Order confirmation. The (order_id, kind) unique row is the idempotency
  // guard, so Stripe webhook retries can never produce a second confirmation.
  // With no provider connected this only records `not_configured` — it never
  // claims an email was sent.
  if (paid) {
    try {
      const outcome = await dispatchOrderNotification(supabase, order.id, 'order_confirmation');
      logCommerce('webhook', 'notification.order_confirmation', { orderId: order.id, status: outcome.status });
    } catch (e) {
      errorCommerce('webhook', 'notification.order_confirmation_failed', e, { orderId: order.id });
    }
  }
}

async function markSessionFailed(session: any, env: StripeEnv) {
  await getSupabase()
    .from('orders')
    .update({ status: 'failed', fulfillment_status: 'cancelled', updated_at: new Date().toISOString() })
    .eq('stripe_session_id', session.id)
    .eq('environment', env);
}

/** Subscription renewals: each paid invoice after the first becomes its own order. */
async function handleInvoicePaid(invoice: any, env: StripeEnv) {
  const billingReason = invoice.billing_reason;
  if (billingReason !== 'subscription_cycle' && billingReason !== 'subscription_update') return;

  const supabase = getSupabase();
  const subscriptionId =
    invoice.subscription ?? invoice.parent?.subscription_details?.subscription ?? invoice.lines?.data?.[0]?.subscription;
  if (!subscriptionId) return;

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('user_id, price_id')
    .eq('stripe_subscription_id', subscriptionId)
    .eq('environment', env)
    .maybeSingle();
  if (!sub?.user_id) {
    console.error('renewal for unknown subscription', subscriptionId);
    return;
  }

  const userId = sub.user_id as string;
  const amountCents = invoice.amount_paid ?? 0;
  const { tier, multiplier } = await pointsMultiplier(userId, true);
  const pointsEarned = Math.floor(Math.floor(amountCents / 100) * multiplier);

  const { data: order, error } = await supabase
    .from('orders')
    .upsert(
      {
        user_id: userId,
        stripe_invoice_id: invoice.id,
        amount_cents: amountCents,
        currency: (invoice.currency ?? 'aud').toLowerCase(),
        is_subscription_order: true,
        environment: env,
        status: 'paid',
        fulfillment_status: 'processing',
        points_earned: pointsEarned,
        points_redeemed: 0,
        discount_cents: 0,
        shipping_cents: 0,
        line_items: (invoice.lines?.data ?? []).map((l: any) => ({
          name: l.description ?? 'Restock delivery',
          quantity: l.quantity ?? 1,
          amountCents: l.amount ?? 0,
          // Only a real catalog lookup key is stored — never Stripe's price id,
          // so renewal stock decrements can never map to the wrong SKU.
          lookupKey: renewalLookupKey(l, sub.price_id),
        })),

      },
      { onConflict: 'stripe_invoice_id' },
    )
    .select('id')
    .single();

  if (error || !order) {
    errorCommerce('webhook', 'renewal.order_upsert_failed', error, { invoiceId: invoice.id, env });
    return;
  }

  // Recurring physical shipment: decrement the component SKU exactly once per
  // paid invoice. Idempotent — the order is upserted on stripe_invoice_id and
  // the movement is keyed on sale:<orderId>:<sku>.
  {
    const { recordOrderStockSale } = await import('@/lib/inventory.server');
    await recordOrderStockSale(
      order.id,
      (invoice.lines?.data ?? []).map((l: any) => ({
        lookupKey: renewalLookupKey(l, sub.price_id),
        quantity: l.quantity ?? 1,
      })),
    );
  }

  await awardPoints(userId, order.id, pointsEarned, 0, { tier, multiplier, renewal: true });

  logCommerce('webhook', 'renewal.order_recorded', {
    invoiceId: invoice.id,
    orderId: order.id,
    userId: shortId(userId),
    amountCents,
    tier,
    multiplier,
    pointsEarned,
    env,
  });
}

async function handleInvoiceFailed(invoice: any, env: StripeEnv) {
  const subscriptionId = invoice.subscription ?? invoice.parent?.subscription_details?.subscription;
  if (!subscriptionId) return;
  const supabase = getSupabase();
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', subscriptionId)
    .eq('environment', env)
    .maybeSingle();
  // Stripe keeps retrying; we only refresh entitlement from the subscription status.
  if (sub?.user_id) await recomputeMembership(sub.user_id as string, env);
}

// ---------------------------------------------------------------- router

async function handleWebhook(req: Request, env: StripeEnv) {
  const event = await verifyWebhook(req, env);
  logCommerce('webhook', 'event.received', {
    type: event.type,
    objectId: (event.data.object as any)?.id ?? null,
    env,
  });

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      await upsertSubscription(event.data.object, env);
      break;
    case 'customer.subscription.deleted':
      await markSubscriptionCanceled(event.data.object, env);
      break;
    case 'checkout.session.completed': {
      const session = event.data.object;
      // "unpaid" means a delayed-notification method that hasn't settled yet.
      await handleCheckoutSession(session, env, session.payment_status !== 'unpaid');
      break;
    }
    case 'checkout.session.async_payment_succeeded':
      await handleCheckoutSession(event.data.object, env, true);
      break;
    case 'checkout.session.async_payment_failed':
      await markSessionFailed(event.data.object, env);
      break;
    case 'invoice.paid':
      await handleInvoicePaid(event.data.object, env);
      break;
    case 'invoice.payment_failed':
      await handleInvoiceFailed(event.data.object, env);
      break;
    default:
      logCommerce('webhook', 'event.unhandled', { type: event.type });
  }
}

export const Route = createFileRoute('/api/public/payments/webhook')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const trace = newTraceId();
        const startedAt = Date.now();
        const rawEnv = new URL(request.url).searchParams.get('env');
        if (rawEnv !== 'sandbox' && rawEnv !== 'live') {
          warnCommerce('webhook', 'request.invalid_env', { trace, rawEnv });
          return Response.json({ received: true, ignored: 'invalid env' });
        }
        try {
          await handleWebhook(request, rawEnv);
          logCommerce('webhook', 'request.completed', { trace, env: rawEnv, elapsedMs: since(startedAt) });
          return Response.json({ received: true });
        } catch (e) {
          errorCommerce('webhook', 'request.failed', e, { trace, env: rawEnv, elapsedMs: since(startedAt) });
          return new Response('Webhook error', { status: 400 });
        }
      },
    },
  },
});

