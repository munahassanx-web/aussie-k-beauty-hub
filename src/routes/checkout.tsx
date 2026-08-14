import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { getStripe, getStripeEnvironment } from '@/lib/stripe';
import { useAuth } from '@/hooks/use-auth';
import { useCart, formatAud } from '@/lib/cart';
import { createCartCheckout } from '@/lib/commerce.functions';
import { supabase } from '@/integrations/supabase/client';

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

function Checkout() {
  const cart = useCart();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [redeem, setRedeem] = useState(0);
  const [points, setPoints] = useState<number | null>(null);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setPoints(null);
      return;
    }
    supabase.rpc('my_points_balance').then(({ data }) => setPoints(typeof data === 'number' ? data : 0));
  }, [user]);

  const maxRedeem = Math.min(
    Math.floor((points ?? 0) / 100) * 100,
    Math.floor(cart.subtotalCents / 500) * 100,
  );
  const canRedeem = maxRedeem >= 100;

  const fetchClientSecret = async (): Promise<string> => {
    const result = await createCartCheckout({
      data: {
        items: cart.lines.map((l) => ({ priceId: l.priceId, quantity: l.quantity })),
        redeemPoints: redeem,
        environment: getStripeEnvironment(),
        returnUrl: `${window.location.origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
      },
    });
    if ('error' in result) throw new Error(result.error);
    return result.clientSecret;
  };

  if (loading) {
    return <div className="mx-auto max-w-3xl px-6 py-24 text-sm text-muted-foreground">Loading…</div>;
  }

  if (cart.lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-display text-4xl text-foreground">Your basket is empty</h1>
        <p className="mt-3 text-muted-foreground">Add a few staples and come back.</p>
        <Link to="/shop" className="mt-6 inline-flex rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground hover:opacity-90">
          Browse the shop
        </Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-display text-4xl text-foreground">Sign in to check out</h1>
        <p className="mt-3 text-muted-foreground">
          Your basket is saved. Signing in lets us track your order, points and Restock deliveries.
        </p>
        <button
          onClick={() => navigate({ to: '/auth' })}
          className="mt-6 rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Sign in or create an account
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[1fr_380px]">
      <div>
        <h1 className="font-display text-4xl text-foreground">Checkout</h1>
        {cart.mixedModes ? (
          <p className="mt-6 rounded-2xl border border-border bg-secondary/60 p-5 text-sm text-foreground">
            Your basket mixes Restock subscriptions with one-off items. Please remove one type and check out separately.
          </p>
        ) : !started ? (
          <div className="mt-8 space-y-5">
            {canRedeem ? (
              <div className="rounded-2xl border border-border p-5">
                <p className="text-sm font-medium text-foreground">Redeem points</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  You have {points} points. 100 pts = A$5 off.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[0, 100, 200, 500, 1000, maxRedeem]
                    .filter((v, i, a) => v <= maxRedeem && a.indexOf(v) === i)
                    .map((v) => (
                      <button
                        key={v}
                        onClick={() => setRedeem(v)}
                        className={`rounded-full border px-4 py-1.5 text-xs ${redeem === v ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-foreground hover:bg-secondary'}`}
                      >
                        {v === 0 ? 'No thanks' : `Use ${v} pts (−A$${(v / 100) * 5})`}
                      </button>
                    ))}
                </div>
              </div>
            ) : (
              points !== null && (
                <p className="text-xs text-muted-foreground">
                  You have {points} points. Earn 100+ to unlock rewards at checkout.
                </p>
              )
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button
              onClick={() => { setError(null); setStarted(true); }}
              className="w-full rounded-full bg-primary py-3.5 text-sm font-medium uppercase tracking-wider text-primary-foreground hover:opacity-90"
            >
              Continue to payment
            </button>
            <p className="text-xs text-muted-foreground">
              Pay with Apple Pay, Google Pay, or card. Delivery address is collected on the next
              step. We ship within Australia only.
            </p>
          </div>
        ) : (
          <div className="mt-8">
            <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret }}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        )}
      </div>

      <aside className="h-fit rounded-2xl border border-border p-6">
        <h2 className="font-display text-xl text-foreground">Order summary</h2>
        <ul className="mt-4 space-y-4">
          {cart.lines.map((l) => (
            <li key={l.priceId} className="flex gap-3">
              <img src={l.image} alt={l.name} className="h-14 w-14 rounded-lg bg-secondary object-contain p-1" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-foreground">{l.name}</p>
                <p className="text-xs text-muted-foreground">Qty {l.quantity}{l.recurring ? ' · monthly' : ''}</p>
              </div>
              <span className="text-sm text-foreground">{formatAud(l.unitCents * l.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between text-foreground"><span>Subtotal</span><span>{formatAud(cart.subtotalCents)}</span></div>
          <div className="flex justify-between text-muted-foreground">
            <span>Shipping</span>
            <span>{cart.shippingCents === 0 ? 'Free' : formatAud(cart.shippingCents)}</span>
          </div>
          {redeem > 0 && (
            <div className="flex justify-between text-muted-foreground">
              <span>Points reward</span><span>−A${(redeem / 100) * 5}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-border pt-3 text-base text-foreground">
            <span>Total</span>
            <span>{formatAud(Math.max(0, cart.totalCents - (redeem / 100) * 500))}</span>
          </div>
          <p className="text-[11px] text-muted-foreground">Includes GST. Final total confirmed by Stripe.</p>
        </div>
      </aside>
    </div>
  );
}
