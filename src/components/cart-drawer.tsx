import { useEffect, useRef } from 'react';
import { Link } from '@tanstack/react-router';
import { FLAT_SHIPPING_CENTS, FREE_SHIPPING_THRESHOLD_CENTS, formatAud, useCart } from '@/lib/cart';

export function CartDrawer() {
  const cart = useCart();
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
        aria-label="Close basket"
        onClick={() => cart.setOpen(false)}
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
      />
      <aside
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Your basket"
        className="relative flex h-full w-full max-w-md flex-col bg-background shadow-2xl outline-none"
      >
        <header className="flex items-center justify-between border-b border-border px-6 py-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Skin Grocer</p>
            <h2 className="font-display text-2xl leading-tight text-foreground">
              Your basket{cart.count > 0 && <span className="text-muted-foreground"> ({cart.count})</span>}
            </h2>
          </div>
          <button
            onClick={() => cart.setOpen(false)}
            aria-label="Close basket"
            className="-mr-2 flex h-11 w-11 items-center justify-center text-sm text-muted-foreground transition hover:text-foreground"
          >
            ✕
          </button>
        </header>

        {cart.lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
            <p className="font-display text-xl text-foreground">Nothing in the basket yet</p>
            <p className="text-sm text-muted-foreground">
              Start with a cleanser, a hydrating serum and an SPF — the three that do most of the work.
            </p>
            <Link
              to="/shop"
              onClick={() => cart.setOpen(false)}
              className="bg-primary px-7 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              Browse the shop
            </Link>
          </div>
        ) : (
          <>
            {!cart.hasSubscription && (
              <div className="border-b border-border px-6 py-4">
                <p className="text-xs text-foreground">
                  {remainingForFree > 0 ? (
                    <>
                      <span className="text-muted-foreground">Add </span>
                      {formatAud(remainingForFree)}
                      <span className="text-muted-foreground"> more for free shipping</span>
                    </>
                  ) : (
                    'Free standard shipping unlocked'
                  )}
                </p>
                <div
                  className="mt-2 h-px w-full bg-border"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={progress}
                  aria-label="Progress towards free shipping"
                >
                  <div className="h-px bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            <div className="flex-1 divide-y divide-border overflow-y-auto px-6">
              {cart.lines.map((line) => (
                <div key={line.priceId} className="flex gap-4 py-5">
                  <img
                    src={line.image}
                    alt={line.name}
                    loading="lazy"
                    className="h-24 w-20 shrink-0 bg-secondary object-contain p-2"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{line.brand}</p>
                    <p className="mt-1 text-sm leading-snug text-foreground">{line.name}</p>
                    <p className="mt-1 text-sm text-foreground">
                      {formatAud(line.unitCents)}
                      {line.recurring && <span className="text-xs text-muted-foreground"> / month</span>}
                    </p>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="flex items-center border border-border">
                        <button
                          aria-label={`Decrease quantity of ${line.name}`}
                          onClick={() => cart.setQuantity(line.priceId, line.quantity - 1)}
                          className="h-10 w-10 text-sm text-foreground transition hover:text-primary"
                        >
                          −
                        </button>
                        <span aria-live="polite" className="min-w-8 text-center text-sm text-foreground">
                          {line.quantity}
                        </span>
                        <button
                          aria-label={`Increase quantity of ${line.name}`}
                          disabled={line.quantity >= 10}
                          onClick={() => cart.setQuantity(line.priceId, line.quantity + 1)}
                          className="h-10 w-10 text-sm text-foreground transition hover:text-primary disabled:opacity-30"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-foreground">{formatAud(line.unitCents * line.quantity)}</p>
                        <button
                          onClick={() => cart.remove(line.priceId)}
                          className="mt-0.5 text-[11px] uppercase tracking-[0.14em] text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t border-border px-6 py-5">
              {cart.mixedModes && (
                <p className="border border-border bg-secondary/60 p-3 text-xs text-foreground">
                  Restock subscriptions are set up one at a time — please check out your one-off items separately.
                </p>
              )}
              <div className="flex justify-between text-sm text-foreground">
                <span>Subtotal</span>
                <span>{formatAud(cart.subtotalCents)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Standard shipping</span>
                <span>
                  {cart.hasSubscription
                    ? 'Included'
                    : cart.shippingCents === 0
                      ? 'Free'
                      : formatAud(FLAT_SHIPPING_CENTS)}
                </span>
              </div>
              <div className="flex items-baseline justify-between border-t border-border pt-3">
                <span className="text-sm uppercase tracking-[0.16em] text-muted-foreground">Total</span>
                <span className="font-display text-2xl text-foreground">{formatAud(cart.totalCents)}</span>
              </div>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                Includes GST. Shipping within Australia, dispatched from Melbourne — allow 1–3 business days in transit
                after dispatch.
              </p>
              <Link
                to="/checkout"
                onClick={() => cart.setOpen(false)}
                className="block bg-primary py-4 text-center text-sm font-medium uppercase tracking-[0.18em] text-primary-foreground transition hover:opacity-90"
              >
                Continue to checkout
              </Link>
              <button
                onClick={() => cart.setOpen(false)}
                className="w-full py-2 text-center text-xs uppercase tracking-[0.16em] text-muted-foreground transition hover:text-foreground"
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
