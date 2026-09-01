import { useEffect, useRef } from 'react';
import { Link } from '@tanstack/react-router';
import { FLAT_SHIPPING_CENTS, FREE_SHIPPING_THRESHOLD_CENTS, formatAud, useCart } from '@/lib/cart';
import { useCircle } from '@/hooks/use-circle';
import { sizeForPriceId } from '@/lib/shop-catalog';

export function CartDrawer() {
  const cart = useCart();
  const { isCircle } = useCircle();
  const panelRef = useRef<HTMLDivElement>(null);
  const open = cart.open;

  // Lock background scroll, close on Escape, and move focus into the panel.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cart.setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, cart]);

  if (!open) return null;

  const remainingForFree = FREE_SHIPPING_THRESHOLD_CENTS - cart.subtotalCents;
  const progress = Math.min(100, Math.round((cart.subtotalCents / FREE_SHIPPING_THRESHOLD_CENTS) * 100));

  return (
    <div className="fixed inset-0 z-[110] flex justify-end">
      <button
        aria-label="Close bag"
        onClick={() => cart.setOpen(false)}
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
      />
      <aside
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Your bag"
        className="relative flex h-full w-full max-w-md flex-col overflow-x-hidden bg-background outline-none"
      >
        <header className="flex items-start justify-between gap-4 border-b border-border px-6 py-6 sm:px-7">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">Skin Grocer</p>
            <h2 className="mt-1.5 font-display text-[1.75rem] leading-none tracking-tight text-foreground">
              Your bag
            </h2>
            {cart.count > 0 && (
              <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                {cart.count} {cart.count === 1 ? 'item' : 'items'}
              </p>
            )}
          </div>
          <button
            onClick={() => cart.setOpen(false)}
            aria-label="Close bag"
            className="-mr-2 -mt-1 flex h-11 w-11 items-center justify-center rounded-[2px] text-base text-muted-foreground transition-colors hover:text-foreground"
          >
            ✕
          </button>
        </header>

        {cart.lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center">
            <span className="h-px w-12 bg-rose-gold" aria-hidden="true" />
            <p className="font-display text-2xl leading-tight text-foreground">Your bag is empty</p>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Start with a cleanser, a hydrating serum and an SPF — the three that do most of the work.
            </p>
            <div className="flex w-full max-w-xs flex-col gap-3">
              <Link
                to="/shop"
                onClick={() => cart.setOpen(false)}
                className="flex min-h-12 items-center justify-center rounded-[2px] bg-foreground px-7 text-[11px] font-medium uppercase tracking-[0.2em] text-background transition-opacity hover:opacity-90"
              >
                Shop skincare
              </Link>
              <button
                onClick={() => cart.setOpen(false)}
                className="min-h-11 rounded-[2px] text-[11px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
              >
                Continue shopping
              </button>
            </div>
          </div>
        ) : (
          <>
            {!cart.hasSubscription && isCircle && (
              <div className="border-b border-border px-6 py-4 sm:px-7">
                <p className="text-[11px] uppercase tracking-[0.16em] text-foreground">
                  Circle member · Free Express Post
                </p>
                <p className="mt-1 text-[11px] normal-case tracking-normal text-muted-foreground">
                  Australia Post Express Post, applied at checkout on every order.
                </p>
              </div>
            )}

            {!cart.hasSubscription && !isCircle && (
              <div className="border-b border-border px-6 py-4 sm:px-7">
                <p className="text-[11px] uppercase tracking-[0.16em] text-foreground">
                  {remainingForFree > 0 ? (
                    <>
                      <span className="text-muted-foreground">Add </span>
                      {formatAud(remainingForFree)}
                      <span className="text-muted-foreground"> for free standard shipping</span>
                    </>
                  ) : (
                    'Free standard shipping unlocked'
                  )}
                </p>
                <div
                  className="mt-2.5 h-px w-full bg-border"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={progress}
                  aria-label="Progress towards free shipping"
                >
                  <div className="h-px bg-rose-gold transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            <div className="flex-1 divide-y divide-border overflow-y-auto px-6 sm:px-7">
              {cart.lines.map((line) => (
                <div key={line.priceId} className="flex gap-5 py-6">
                  <img
                    src={line.image}
                    alt={line.name}
                    loading="lazy"
                    className="h-28 w-24 shrink-0 rounded-[2px] bg-secondary object-contain p-3"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{line.brand}</p>
                    <p className="mt-1.5 text-sm leading-snug text-foreground">{line.name}</p>
                    {sizeForPriceId(line.priceId) && (
                      <p className="mt-1 text-xs text-muted-foreground">{sizeForPriceId(line.priceId)}</p>
                    )}
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      {formatAud(line.unitCents)} each
                      {line.recurring && <span> · monthly</span>}
                    </p>
                    <div className="mt-4 flex items-end justify-between gap-3">
                      <div className="inline-flex items-center rounded-[2px] border border-border">
                        <button
                          aria-label={`Decrease quantity of ${line.name}`}
                          onClick={() => cart.setQuantity(line.priceId, line.quantity - 1)}
                          className="h-11 w-11 text-base text-foreground transition-colors hover:bg-secondary"
                        >
                          −
                        </button>
                        <span
                          aria-live="polite"
                          className="min-w-9 border-x border-border text-center text-sm leading-[2.75rem] text-foreground"
                        >
                          {line.quantity}
                        </span>
                        <button
                          aria-label={`Increase quantity of ${line.name}`}
                          disabled={line.quantity >= 10}
                          onClick={() => cart.setQuantity(line.priceId, line.quantity + 1)}
                          className="h-11 w-11 text-base text-foreground transition-colors hover:bg-secondary disabled:opacity-30"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-foreground">{formatAud(line.unitCents * line.quantity)}</p>
                        <button
                          onClick={() => cart.remove(line.priceId)}
                          aria-label={`Remove ${line.name} from bag`}
                          className="mt-1 min-h-9 text-[10px] uppercase tracking-[0.16em] text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border px-6 py-6 sm:px-7">
              {cart.mixedModes && (
                <p className="mb-4 rounded-[2px] border border-border bg-secondary/60 p-3 text-xs leading-relaxed text-foreground">
                  Restock subscriptions are set up one at a time — please check out your one-off items separately.
                </p>
              )}
              <div className="space-y-2.5">
                <div className="flex justify-between text-sm text-foreground">
                  <span>Subtotal</span>
                  <span>{formatAud(cart.subtotalCents)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{isCircle && !cart.hasSubscription ? 'Express Post · Circle member' : 'Standard shipping'}</span>
                  <span>
                    {cart.hasSubscription || isCircle
                      ? cart.hasSubscription
                        ? 'Included'
                        : 'Free'
                      : cart.shippingCents === 0
                        ? 'Free'
                        : formatAud(FLAT_SHIPPING_CENTS)}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
                <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Total</span>
                <span className="font-display text-[1.75rem] leading-none text-foreground">
                  {formatAud(isCircle && !cart.hasSubscription ? cart.subtotalCents : cart.totalCents)}
                </span>
              </div>
              <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
                Includes GST. Shipped with Australia Post from our Melbourne warehouse — transit times are estimates and
                depend on your postcode and the service available there.
              </p>
              <Link
                to="/checkout"
                onClick={() => cart.setOpen(false)}
                className="mt-5 flex min-h-14 items-center justify-center rounded-[2px] bg-foreground text-[11px] font-medium uppercase tracking-[0.22em] text-background transition-opacity hover:opacity-90"
              >
                Continue to checkout
              </Link>
              <p className="mt-3 text-center text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Secure payment by Stripe
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                <Link
                  to="/shipping-policy"
                  onClick={() => cart.setOpen(false)}
                  className="underline-offset-4 transition-colors hover:text-foreground hover:underline"
                >
                  Shipping &amp; returns
                </Link>
                <Link
                  to="/contact"
                  onClick={() => cart.setOpen(false)}
                  className="underline-offset-4 transition-colors hover:text-foreground hover:underline"
                >
                  Customer care
                </Link>
              </div>
              <button
                onClick={() => cart.setOpen(false)}
                className="mt-3 min-h-11 w-full text-center text-[11px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
              >
                Continue shopping
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
