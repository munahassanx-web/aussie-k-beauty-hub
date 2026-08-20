import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { getStripe, getStripeEnvironment } from '@/lib/stripe';
import { useAuth } from '@/hooks/use-auth';
import { useCart, formatAud, FLAT_SHIPPING_CENTS, FREE_SHIPPING_THRESHOLD_CENTS } from '@/lib/cart';
import { createCartCheckout, createGuestCartCheckout } from '@/lib/commerce.functions';
import { supabase } from '@/integrations/supabase/client';
import { useCircle } from '@/hooks/use-circle';
import { track, centsToAud } from '@/lib/analytics';

export const Route = createFileRoute('/checkout')({
  head: () => ({
    meta: [
      { title: 'Checkout — Skin Grocer' },
      { name: 'description', content: 'Securely complete your Skin Grocer order. Australian delivery, GST included, points redeemable at checkout.' },
      { property: 'og:title', content: 'Checkout — Skin Grocer' },
      { property: 'og:description', content: 'Securely complete your Skin Grocer order.' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: Checkout,
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function Checkout() {
  const cart = useCart();
  const { user, loading } = useAuth();
  const { isCircle } = useCircle();
  const navigate = useNavigate();
  const [redeem, setRedeem] = useState(0);
  const [points, setPoints] = useState<number | null>(null);
  const [started, setStarted] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [guestMode, setGuestMode] = useState(false);
  const [guestEmail, setGuestEmail] = useState('');
  const [summaryOpen, setSummaryOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      setPoints(null);
      return;
    }
    setGuestMode(false);
    supabase.rpc('my_points_balance').then(({ data }) => setPoints(typeof data === 'number' ? data : 0));
  }, [user]);

  // Restore a previously typed guest email if the customer bounced back.
  useEffect(() => {
    const stored = window.sessionStorage.getItem('sg-guest-email');
    if (stored) setGuestEmail(stored);
  }, []);

  useEffect(() => {
    if (guestEmail) window.sessionStorage.setItem('sg-guest-email', guestEmail);
  }, [guestEmail]);

  const maxRedeem = Math.min(
    Math.floor((points ?? 0) / 100) * 100,
    Math.floor(cart.subtotalCents / 500) * 100,
  );
  const canRedeem = Boolean(user) && maxRedeem >= 100;
  const hasSubscription = cart.lines.some((l) => l.recurring);
  const discountCents = (redeem / 100) * 500;
  // Circle members ship free on Express Post — the server applies the same rule.
  const circleExpress = isCircle && !hasSubscription;
  const shippingCents = circleExpress ? 0 : cart.shippingCents;
  const grandTotal = Math.max(0, cart.subtotalCents + shippingCents - discountCents);

  const fetchClientSecret = async (): Promise<string> => {
    const returnUrl = `${window.location.origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`;
    const items = cart.lines.map((l) => ({ priceId: l.priceId, quantity: l.quantity }));
    // Client-side breadcrumb so a broken total can be traced back to the exact basket.
    console.log(
      '[commerce] ' +
        JSON.stringify({
          scope: 'cart',
          event: 'checkout.submitted',
          mode: user ? 'member' : 'guest',
          items,
          subtotalCents: cart.subtotalCents,
          shippingCents: cart.shippingCents,
          totalCents: cart.totalCents,
          redeemPoints: user ? redeem : 0,
          environment: getStripeEnvironment(),
        }),
    );
    const result = user
      ? await createCartCheckout({
          data: { items, redeemPoints: redeem, environment: getStripeEnvironment(), returnUrl },
        })
      : await createGuestCartCheckout({
          data: { items, email: guestEmail.trim(), environment: getStripeEnvironment(), returnUrl },
        });
    if ('error' in result) {
      console.error('[commerce] ' + JSON.stringify({ scope: 'cart', event: 'checkout.failed', error: result.error }));
      throw new Error(result.error);
    }
    return result.clientSecret;
  };

  if (loading) {
    return <div className="mx-auto max-w-3xl px-6 py-24 text-sm text-muted-foreground">Loading…</div>;
  }

  if (cart.lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Checkout</p>
        <h1 className="mt-4 font-display text-4xl text-foreground">Your bag is empty</h1>
        <p className="mt-3 text-muted-foreground">Add a few staples and come back — nothing has been lost.</p>
        <Link
          to="/shop"
          className="mt-8 inline-flex min-h-13 items-center rounded-[2px] bg-foreground px-9 text-[11px] font-medium uppercase tracking-[0.22em] text-background transition-opacity hover:opacity-90"
        >
          Shop skincare
        </Link>
      </div>
    );
  }

  if (!user && !guestMode) {
    return (
      <div className="mx-auto max-w-xl px-6 py-20">
        <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Checkout</p>
        <h1 className="mt-4 font-display text-4xl leading-tight text-foreground">
          {hasSubscription ? 'Restock needs an account' : 'Check out as a guest'}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {hasSubscription
            ? 'Restock subscriptions need an account so we can manage and pause your deliveries.'
            : 'No account required. Enter an email for your receipt and pay — it takes about a minute.'}
        </p>
        <div className="mt-8 space-y-3">
          {!hasSubscription && (
            <button
              onClick={() => setGuestMode(true)}
              className="flex min-h-14 w-full items-center justify-center rounded-[2px] bg-foreground px-7 text-[11px] font-medium uppercase tracking-[0.22em] text-background transition-opacity hover:opacity-90"
            >
              Continue as guest
            </button>
          )}
          <button
            onClick={() => navigate({ to: '/auth' })}
            className="flex min-h-14 w-full items-center justify-center rounded-[2px] border border-border px-7 text-[11px] font-medium uppercase tracking-[0.22em] text-foreground transition-colors hover:bg-secondary"
          >
            Sign in or create an account
          </button>
        </div>
        <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
          Members earn points and can redeem rewards. Guest orders are linked to your account automatically if you sign
          up later with the same email.
        </p>
      </div>
    );
  }

  const summary = (
    <>
      <ul className="divide-y divide-border">
        {cart.lines.map((l) => (
          <li key={l.priceId} className="flex gap-3 py-4">
            <img src={l.image} alt={l.name} loading="lazy" className="h-16 w-14 shrink-0 bg-secondary object-contain p-1" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{l.brand}</p>
              <p className="text-sm leading-snug text-foreground">{l.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Qty {l.quantity}
                {l.recurring ? ' · monthly' : ''}
              </p>
            </div>
            <span className="text-sm text-foreground">{formatAud(l.unitCents * l.quantity)}</span>
          </li>
        ))}
      </ul>
      <div className="space-y-2 border-t border-border pt-4 text-sm">
        <div className="flex justify-between text-foreground">
          <span>Subtotal</span>
          <span>{formatAud(cart.subtotalCents)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>{circleExpress ? 'Circle member · Free Express Post' : 'Standard shipping'}</span>
          <span>
            {cart.hasSubscription ? 'Included' : shippingCents === 0 ? 'Free' : formatAud(FLAT_SHIPPING_CENTS)}
          </span>
        </div>
        {redeem > 0 && (
          <div className="flex justify-between text-muted-foreground">
            <span>Points reward ({redeem} pts)</span>
            <span>−{formatAud(discountCents)}</span>
          </div>
        )}
        <div className="flex items-baseline justify-between border-t border-border pt-3">
          <span className="text-sm uppercase tracking-[0.16em] text-muted-foreground">Total</span>
          <span className="font-display text-2xl text-foreground">{formatAud(grandTotal)}</span>
        </div>
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Includes GST. Any promotion code you enter on the payment step is applied by Stripe before you pay.
        </p>
      </div>
      {!cart.hasSubscription && !circleExpress && cart.subtotalCents < FREE_SHIPPING_THRESHOLD_CENTS && (
        <p className="mt-3 text-[11px] text-muted-foreground">
          Add {formatAud(FREE_SHIPPING_THRESHOLD_CENTS - cart.subtotalCents)} more to qualify for free shipping.
        </p>
      )}
      <div className="mt-4 border-t border-border pt-4">
        <button
          type="button"
          onClick={() => cart.setOpen(true)}
          className="text-xs uppercase tracking-[0.16em] text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline"
        >
          Edit bag
        </button>
      </div>
    </>
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 lg:py-16">
      <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
        {started ? 'Step 2 of 2 · Payment' : 'Step 1 of 2 · Your details'}
      </p>
      <h1 className="mt-3 font-display text-4xl text-foreground">Checkout</h1>

      {/* Mobile order summary — collapsed so the form stays above the fold. */}
      <div className="mt-6 border border-border lg:hidden">
        <button
          onClick={() => setSummaryOpen((v) => !v)}
          aria-expanded={summaryOpen}
          className="flex w-full items-center justify-between px-5 py-4 text-left"
        >
          <span className="text-sm text-foreground">
            {summaryOpen ? 'Hide' : 'Show'} order summary ({cart.count} {cart.count === 1 ? 'item' : 'items'})
          </span>
          <span className="font-display text-lg text-foreground">{formatAud(grandTotal)}</span>
        </button>
        {summaryOpen && <div className="border-t border-border px-5 pb-5">{summary}</div>}
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div>
          {cart.mixedModes ? (
            <div className="border border-border bg-secondary/60 p-6 text-sm text-foreground">
              <p>Your bag mixes Restock subscriptions with one-off items.</p>
              <p className="mt-2 text-muted-foreground">
                Please remove one type from your bag and check the other out separately.
              </p>
              <button
                onClick={() => cart.setOpen(true)}
                className="mt-4 border border-border px-5 py-2.5 text-xs uppercase tracking-[0.16em] text-foreground transition hover:bg-background"
              >
                Edit bag
              </button>
            </div>
          ) : !started ? (
            <div className="space-y-6">
              {!user && (
                <div className="border border-border p-6">
                  <label htmlFor="guest-email" className="text-sm font-medium text-foreground">
                    Email address <span className="text-muted-foreground">(required)</span>
                  </label>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Your receipt, order ID and tracking updates are sent here.
                  </p>
                  <input
                    id="guest-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    required
                    aria-invalid={Boolean(emailError)}
                    aria-describedby={emailError ? 'guest-email-error' : undefined}
                    value={guestEmail}
                    onChange={(e) => {
                      setGuestEmail(e.target.value);
                      if (emailError) setEmailError(null);
                    }}
                    onBlur={() => {
                      if (guestEmail && !EMAIL_RE.test(guestEmail.trim())) {
                        setEmailError('That email doesn’t look right — check for a typo.');
                      }
                    }}
                    placeholder="you@example.com"
                    className={`mt-3 w-full border bg-background px-4 py-3 text-base text-foreground outline-none transition focus:border-primary ${
                      emailError ? 'border-destructive' : 'border-border'
                    }`}
                  />
                  {emailError && (
                    <p id="guest-email-error" role="alert" className="mt-2 text-xs text-destructive">
                      {emailError}
                    </p>
                  )}
                </div>
              )}

              {canRedeem && (
                <div className="border border-border p-6">
                  <p className="text-sm font-medium text-foreground">Redeem points</p>
                  <p className="mt-1 text-xs text-muted-foreground">You have {points} points. 100 pts = A$5 off.</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {[0, 100, 200, 500, 1000, maxRedeem]
                      .filter((v, i, a) => v <= maxRedeem && a.indexOf(v) === i)
                      .map((v) => (
                        <button
                          key={v}
                          aria-pressed={redeem === v}
                          onClick={() => setRedeem(v)}
                          className={`border px-4 py-2.5 text-xs transition ${
                            redeem === v
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border text-foreground hover:bg-secondary'
                          }`}
                        >
                          {v === 0 ? 'No thanks' : `Use ${v} pts (−A$${(v / 100) * 5})`}
                        </button>
                      ))}
                  </div>
                </div>
              )}
              {user && !canRedeem && points !== null && (
                <p className="text-xs text-muted-foreground">
                  You have {points} points. Earn 100+ to unlock rewards at checkout.
                </p>
              )}

              <details className="border border-border">
                <summary className="cursor-pointer list-none px-6 py-4 text-sm text-foreground">
                  Have a promotion code?
                </summary>
                <p className="px-6 pb-5 text-xs leading-relaxed text-muted-foreground">
                  Enter it in the secure payment step on the next screen — your total updates before you pay.
                  {canRedeem && ' A promotion code can’t be combined with a points reward on the same order.'}
                </p>
              </details>

              <div className="border-t border-border pt-6 text-xs leading-relaxed text-muted-foreground">
                <p className="text-foreground">What happens next</p>
                <p className="mt-2">
                  On the next screen you’ll enter your Australian delivery address and pay with card, Apple Pay or
                  Google Pay. Your total, including shipping and GST, is shown before you confirm payment.
                </p>
              </div>

              <button
                onClick={() => {
                  if (!user && !EMAIL_RE.test(guestEmail.trim())) {
                    setEmailError('Enter a valid email address so we can send your receipt.');
                    document.getElementById('guest-email')?.focus();
                    return;
                  }
                  setEmailError(null);
                  track('begin_checkout', {
                    currency: 'AUD',
                    value: centsToAud(cart.subtotalCents),
                    items: cart.lines.map((l) => ({
                      item_id: l.priceId,
                      item_name: l.name,
                      item_brand: l.brand,
                      price: centsToAud(l.unitCents),
                      quantity: l.quantity,
                    })),
                  });
                  setStarted(true);
                }}
                className="flex min-h-14 w-full items-center justify-center rounded-[2px] bg-foreground text-[11px] font-medium uppercase tracking-[0.22em] text-background transition-opacity hover:opacity-90"
              >
                Continue to payment
              </button>
              <p className="text-center text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Secure payment by Stripe
              </p>
            </div>
          ) : (
            <div>
              <button
                onClick={() => setStarted(false)}
                className="mb-5 text-xs uppercase tracking-[0.16em] text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline"
              >
                ← Back to your details
              </button>
              <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret }}>
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
              <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
                Payments are processed by Stripe — Skin Grocer never sees or stores your card details. We ship within
                Australia only.
              </p>
            </div>
          )}

          <ul className="mt-10 grid gap-3 border-t border-border pt-6 text-xs leading-relaxed text-muted-foreground sm:grid-cols-3">
            <li>Secure payment handled by Stripe.</li>
            <li>
              Dispatched from Melbourne.{' '}
              <Link to="/shipping-policy" className="underline underline-offset-4 hover:text-foreground">
                Shipping &amp; returns
              </Link>
              .
            </li>
            <li>
              Your details are used to fulfil your order only.{' '}
              <Link to="/privacy-policy" className="underline underline-offset-4 hover:text-foreground">
                Privacy
              </Link>
              .
            </li>
          </ul>
        </div>

        <aside className="hidden h-fit border border-border p-6 lg:sticky lg:top-24 lg:block">
          <h2 className="font-display text-xl text-foreground">Order summary</h2>
          <div className="mt-2">{summary}</div>
        </aside>
      </div>
    </div>
  );
}
