import { useEffect, useRef } from 'react';
import { Link } from '@tanstack/react-router';
import {
  FLAT_SHIPPING_CENTS,
  FREE_SHIPPING_THRESHOLD_CENTS,
  FREE_SHIPPING_THRESHOLD_LABEL,
  formatAud,
  useCart,
} from '@/lib/cart';
import { sizeForPriceId } from '@/lib/shop-catalog';
import { FREE_GIFT_THRESHOLD_CENTS, FREE_GIFT_THRESHOLD_LABEL, qualifiesForFreeGift } from '@/lib/shipping-rates';
import { completeRoutineSuggestions } from '@/lib/routine-suggestions';
import { routineStepLabel } from '@/lib/product-detail';
import { useBuyNow } from '@/hooks/use-buy-now';
import { useSoldOutSkus } from '@/hooks/use-stock';
import { PaymentOptionsNote } from '@/components/payment-options-note';

export function CartDrawer() {
  const cart = useCart();
  const { buy } = useBuyNow();
  const { isSoldOut } = useSoldOutSkus();
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
  const remainingForGift = FREE_GIFT_THRESHOLD_CENTS - cart.subtotalCents;
  const giftUnlocked = !cart.hasSubscription && qualifiesForFreeGift(cart.subtotalCents);
  const progress = Math.min(100, Math.round((cart.subtotalCents / FREE_SHIPPING_THRESHOLD_CENTS) * 100));
  const giftMarker = Math.round((FREE_GIFT_THRESHOLD_CENTS / FREE_SHIPPING_THRESHOLD_CENTS) * 100);
  const suggestions = cart.hasSubscription
    ? []
    : completeRoutineSuggestions(
        cart.lines.map((l) => l.priceId),
        isSoldOut,
      );

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
        <header className="flex items-start justify-between gap-4 border-b border-border px-6 py-4 sm:px-7 sm:py-6">
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
                className="flex min-h-12 items-center justify-center rounded-full bg-hanbok-deep px-7 text-[11px] font-bold uppercase tracking-[0.18em] text-background transition-colors hover:bg-hanbok"
              >
                Shop skincare
              </Link>
              <button
                onClick={() => cart.setOpen(false)}
                className="min-h-11 rounded-full text-[11px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
              >
                Continue shopping
              </button>
            </div>
          </div>
        ) : (
          <>
            {!cart.hasSubscription && (
              <div className="border-b border-border px-6 py-3 sm:px-7 sm:py-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-foreground">
                  {remainingForGift > 0 ? (
                    <>
                      <span className="text-muted-foreground">Add </span>
                      {formatAud(remainingForGift)}
                      <span className="text-muted-foreground"> for a free K-beauty sample</span>
                    </>
                  ) : remainingForFree > 0 ? (
                    <>
                      <span className="text-muted-foreground">Sample unlocked · add </span>
                      {formatAud(remainingForFree)}
                      <span className="text-muted-foreground"> for free delivery</span>
                    </>
                  ) : (
                    'Free sample and free delivery unlocked'
                  )}
                </p>
                <div className="relative mt-3">
                  <div
                    className="h-1.5 w-full overflow-hidden rounded-full bg-blush"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={progress}
                    aria-label="Progress towards a free sample and free delivery"
                  >
                    <div className="h-1.5 rounded-full bg-glaze transition-all duration-500" style={{ width: `${progress}%` }} />
                  </div>
                  <span
                    aria-hidden="true"
                    className={`absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background ${
                      giftUnlocked ? 'bg-glaze' : 'bg-blush'
                    }`}
                    style={{ left: `${giftMarker}%` }}
                  />
                </div>
                <div aria-hidden="true" className="relative mt-1.5 h-3 text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                  <span className="absolute -translate-x-1/2" style={{ left: `${giftMarker}%` }}>
                    {FREE_GIFT_THRESHOLD_LABEL}
                  </span>
                  <span className="absolute right-0">{FREE_SHIPPING_THRESHOLD_LABEL}</span>
                </div>
              </div>
            )}

            <div className="flex-1 divide-y divide-border overflow-y-auto px-6 sm:px-7">
              {cart.lines.map((line) => (
                <div key={line.priceId} className="flex gap-5 py-6">
                  <div className="sg-stage h-28 w-24 shrink-0 rounded-2xl">
                    <img
                      src={line.image}
                      alt={line.name}
                      loading="lazy"
                      className="sg-stage-img h-full w-full object-contain p-3"
                    />
                  </div>
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
                      <div className="inline-flex items-center overflow-hidden rounded-full border border-border">
                        <button
                          aria-label={`Decrease quantity of ${line.brand} ${line.name}`}
                          disabled={line.quantity <= 1}
                          onClick={() => cart.setQuantity(line.priceId, line.quantity - 1)}
                          className="h-11 w-11 text-base text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-30"
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
                          aria-label={`Increase quantity of ${line.brand} ${line.name}`}
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
                          aria-label={`Remove ${line.brand} ${line.name} from bag`}
                          className="mt-1 min-h-9 text-[10px] uppercase tracking-[0.16em] text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {suggestions.length > 0 && (
                <section aria-labelledby="complete-routine" className="py-6">
                  <h3 id="complete-routine" className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">
                    Complete your routine
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">The steps your bag is missing, matched to your skin goals.</p>
                  <ul className="mt-4 grid grid-cols-3 gap-3">
                    {suggestions.map((p) => (
                      <li key={p.priceId} className="flex min-w-0 flex-col">
                        <div className="sg-stage aspect-square rounded-2xl">
                          <img
                            src={p.image}
                            alt={`${p.brand} ${p.name}`}
                            loading="lazy"
                            className="sg-stage-img h-full w-full object-contain p-2.5"
                          />
                        </div>
                        <p className="mt-2 text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                          {routineStepLabel(p).split('—')[0].trim()}
                        </p>
                        <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-foreground">{p.name}</p>
                        <button
                          type="button"
                          onClick={() => buy({ priceId: p.priceId, name: p.name, priceLabel: p.price, brand: p.brand, image: p.image })}
                          aria-label={`Add ${p.brand} ${p.name} to bag`}
                          className="mt-2 min-h-9 rounded-full border border-border text-[10px] font-semibold uppercase tracking-[0.12em] text-foreground transition-colors hover:border-glaze hover:bg-blush"
                        >
                          + {p.price}
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            <div className="border-t border-border px-6 py-4 sm:px-7 sm:py-5">
              {cart.mixedModes && (
                <p className="mb-4 rounded-2xl border border-border bg-blush/40 p-3 text-xs leading-relaxed text-foreground">
                  Restock subscriptions are set up one at a time — please check out your one-off items separately.
                </p>
              )}
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm text-foreground">
                  <span>Subtotal</span>
                  <span>{formatAud(cart.subtotalCents)}</span>
                </div>
                {giftUnlocked && (
                  <div className="flex justify-between text-sm text-foreground">
                    <span>K-beauty sample (gift)</span>
                    <span>Free</span>
                  </div>
                )}
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
              </div>
              <div className="mt-3 flex items-baseline justify-between border-t border-border pt-3">
                <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  Total <span className="normal-case tracking-normal">· incl. GST</span>
                </span>
                <span className="text-[1.75rem] font-light leading-none tabular-nums tracking-[-0.02em] text-foreground">
                  {formatAud(cart.totalCents)}
                </span>
              </div>
              <Link
                to="/checkout"
                onClick={() => cart.setOpen(false)}
                className="mt-4 flex min-h-14 items-center justify-center rounded-full bg-hanbok-deep text-[11px] font-bold uppercase tracking-[0.18em] text-background shadow-[0_16px_34px_-18px_rgba(58,38,32,0.7)] transition-colors hover:bg-hanbok"
              >
                Continue to checkout
              </Link>
              <PaymentOptionsNote totalCents={cart.totalCents} recurring={cart.hasSubscription} />
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
                <button
                  type="button"
                  onClick={() => cart.setOpen(false)}
                  className="min-h-9 underline-offset-4 transition-colors hover:text-foreground hover:underline"
                >
                  Continue shopping
                </button>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
