import { Link } from '@tanstack/react-router';
import { FREE_SHIPPING_THRESHOLD_CENTS, formatAud, useCart } from '@/lib/cart';

export function CartDrawer() {
  const cart = useCart();
  if (!cart.open) return null;

  const remainingForFree = FREE_SHIPPING_THRESHOLD_CENTS - cart.subtotalCents;

  return (
    <div className="fixed inset-0 z-[110] flex justify-end">
      <button
        aria-label="Close cart"
        onClick={() => cart.setOpen(false)}
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
      />
      <aside className="relative flex h-full w-full max-w-md flex-col bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-display text-xl text-foreground">Your basket</h2>
          <button onClick={() => cart.setOpen(false)} className="text-sm text-muted-foreground hover:text-foreground">
            Close ✕
          </button>
        </div>

        {cart.lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-sm text-muted-foreground">Your basket is empty.</p>
            <Link
              to="/shop"
              onClick={() => cart.setOpen(false)}
              className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Browse the shop
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
              {cart.lines.map((line) => (
                <div key={line.priceId} className="flex gap-4">
                  <img
                    src={line.image}
                    alt={line.name}
                    className="h-20 w-20 shrink-0 rounded-xl bg-secondary object-contain p-2"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{line.brand}</p>
                    <p className="truncate text-sm text-foreground">{line.name}</p>
                    <p className="mt-1 text-sm text-foreground">
                      {formatAud(line.unitCents)}
                      {line.recurring && <span className="text-xs text-muted-foreground"> /month</span>}
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex items-center rounded-full border border-border">
                        <button
                          aria-label={`Decrease quantity of ${line.name}`}
                          onClick={() => cart.setQuantity(line.priceId, line.quantity - 1)}
                          className="px-3 py-1 text-sm text-foreground hover:text-primary"
                        >
                          −
                        </button>
                        <span className="min-w-6 text-center text-sm">{line.quantity}</span>
                        <button
                          aria-label={`Increase quantity of ${line.name}`}
                          onClick={() => cart.setQuantity(line.priceId, line.quantity + 1)}
                          className="px-3 py-1 text-sm text-foreground hover:text-primary"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => cart.remove(line.priceId)}
                        className="text-xs text-muted-foreground underline hover:text-foreground"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t border-border px-6 py-5">
              {cart.mixedModes && (
                <p className="rounded-xl bg-secondary p-3 text-xs text-foreground">
                  Restock subscriptions are set up one at a time — please check out your one-off items separately.
                </p>
              )}
              <div className="flex justify-between text-sm text-foreground">
                <span>Subtotal</span>
                <span>{formatAud(cart.subtotalCents)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Shipping</span>
                <span>{cart.shippingCents === 0 ? 'Free' : formatAud(cart.shippingCents)}</span>
              </div>
              {!cart.hasSubscription && remainingForFree > 0 && (
                <p className="text-xs text-muted-foreground">
                  Add {formatAud(remainingForFree)} more for free shipping.
                </p>
              )}
              <div className="flex justify-between border-t border-border pt-3 text-base text-foreground">
                <span>Total</span>
                <span>{formatAud(cart.totalCents)}</span>
              </div>
              <p className="text-[11px] text-muted-foreground">All prices include GST. Shipping within Australia.</p>
              <Link
                to="/checkout"
                onClick={() => cart.setOpen(false)}
                className="block rounded-full bg-primary py-3 text-center text-sm font-medium uppercase tracking-wider text-primary-foreground hover:opacity-90"
              >
                Checkout
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
