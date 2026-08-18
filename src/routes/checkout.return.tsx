import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { getGuestOrderBySession, getOrderBySession, type OrderReceipt } from '@/lib/commerce.functions';
import { useAuth } from '@/hooks/use-auth';
import { useCart, formatAud } from '@/lib/cart';
import { ladderIndexFor, matchProductByReference } from '@/lib/guide-content';
import { productSlug } from '@/lib/product-detail';


export const Route = createFileRoute('/checkout/return')({
  validateSearch: (search: Record<string, unknown>): { session_id?: string } => ({
    session_id: typeof search.session_id === 'string' ? search.session_id : undefined,
  }),
  head: () => ({
    meta: [
      { title: 'Order confirmed — Skin Grocer' },
      { name: 'description', content: 'Your Skin Grocer order is confirmed. Track fulfilment, points earned and delivery details.' },
      { property: 'og:title', content: 'Order confirmed — Skin Grocer' },
      { property: 'og:description', content: 'Your Skin Grocer order is confirmed.' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: CheckoutReturn,
});

function CheckoutReturn() {
  const { session_id: sessionId } = Route.useSearch();
  const cart = useCart();
  const { user } = useAuth();
  const [receipt, setReceipt] = useState<OrderReceipt | null>(null);
  const [tries, setTries] = useState(0);

  useEffect(() => {
    cart.clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!sessionId || receipt || tries > 10) return;
    const timer = setTimeout(async () => {
      try {
        let result: OrderReceipt | null = null;
        try {
          result = await getOrderBySession({ data: { sessionId } });
        } catch {
          /* signed out — fall through to the guest lookup */
        }
        if (!result) result = await getGuestOrderBySession({ data: { sessionId } });
        if (result) setReceipt(result);
      } catch {
        /* keep polling — the webhook may not have landed yet */
      }
      setTries((t) => t + 1);
    }, tries === 0 ? 400 : 1500);
    return () => clearTimeout(timer);
  }, [sessionId, receipt, tries]);

  // Match this order's line items back to catalog products so we can link the
  // exact guides purchased. Unmatched lines are simply omitted.
  const purchasedGuides = useMemo(() => {
    const seen = new Set<string>();
    const matched = (receipt?.lineItems ?? [])
      .map((l) => matchProductByReference(l.name))
      .filter((p): p is NonNullable<typeof p> => Boolean(p))
      .filter((p) => {
        const slug = productSlug(p);
        if (seen.has(slug)) return false;
        seen.add(slug);
        return true;
      })
      .map((product) => ({ product, slug: productSlug(product) }));
    return matched.sort(
      (a, b) =>
        (ladderIndexFor(a.product) + 1 || 99) - (ladderIndexFor(b.product) + 1 || 99) ||
        a.product.name.localeCompare(b.product.name),
    );
  }, [receipt]);



  if (!sessionId) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-display text-4xl text-foreground">No order found</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          If you’ve just paid, check your inbox for the receipt — or look up your order with your email and order ID.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/track" className="border border-border px-7 py-3 text-sm uppercase tracking-[0.16em] text-foreground hover:bg-secondary">
            Track an order
          </Link>
          <Link to="/shop" className="bg-primary px-7 py-3 text-sm uppercase tracking-[0.16em] text-primary-foreground">
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <p className="text-[11px] uppercase tracking-[0.24em] text-primary">Thank you</p>
      <h1 className="mt-4 font-display text-4xl leading-tight text-foreground">Your order is confirmed</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Payment received and your receipt is on its way by email. Orders are picked and packed in Melbourne, and we’ll
        email you again the moment your parcel is dispatched.
      </p>

      <div className="mt-10 border border-border p-6">
        <h2 className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Order summary</h2>
        {!receipt ? (
          <p className="mt-4 text-sm text-muted-foreground" aria-live="polite">
            {tries > 10
              ? 'Payment received — your full order details will appear in your account and receipt email shortly.'
              : 'Finalising your order…'}
          </p>
        ) : (
          <div className="mt-4 space-y-5">
            <ul className="divide-y divide-border">
              {receipt.lineItems.map((l, i) => (
                <li key={i} className="flex justify-between gap-4 py-3 text-sm text-foreground">
                  <span>
                    {l.name} <span className="text-muted-foreground">× {l.quantity}</span>
                  </span>
                  <span>{formatAud(l.amountCents)}</span>
                </li>
              ))}
            </ul>
            <div className="space-y-2 border-t border-border pt-4 text-sm">
              {receipt.shippingCents > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>{formatAud(receipt.shippingCents)}</span>
                </div>
              )}
              {receipt.discountCents > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Points reward</span>
                  <span>−{formatAud(receipt.discountCents)}</span>
                </div>
              )}
              <div className="flex items-baseline justify-between border-t border-border pt-3">
                <span className="text-sm uppercase tracking-[0.16em] text-muted-foreground">Total paid</span>
                <span className="font-display text-2xl text-foreground">{formatAud(receipt.amountCents)}</span>
              </div>
            </div>
            {receipt.pointsEarned > 0 && (
              <p className="border border-border bg-secondary/60 p-4 text-sm text-foreground">
                You earned {receipt.pointsEarned} points on this order.
              </p>
            )}
            {receipt.shipping && (
              <div className="border-t border-border pt-4 text-sm text-muted-foreground">
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Delivering to</p>
                <p className="mt-2 text-foreground">{receipt.shipping.name}</p>
                <p>
                  {receipt.shipping.line1}
                  {receipt.shipping.line2 ? `, ${receipt.shipping.line2}` : ''}
                </p>
                <p>
                  {receipt.shipping.city} {receipt.shipping.state} {receipt.shipping.postcode}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {receipt?.orderId && (
        <p className="mt-4 text-sm text-muted-foreground">
          Order ID <span className="font-mono text-foreground">{receipt.orderId}</span> — keep this to{' '}
          <Link to="/track" className="underline underline-offset-4">
            track your order
          </Link>
          .
        </p>
      )}

      {purchasedGuides.length > 0 && (
        <section className="mt-10 border-t border-border pt-8">
          <h2 className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            How to use what you bought
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            In the order you’d apply them. Each link opens that product’s application guide.
          </p>
          <ul className="mt-5 border-t border-border">
            {purchasedGuides.map((p) => (
              <li key={p.slug} className="border-b border-border py-4">
                <Link
                  to="/guide/$productId"
                  params={{ productId: p.slug }}
                  className="flex items-baseline justify-between gap-4"
                >
                  <span className="text-sm text-foreground">
                    <span className="text-muted-foreground">{p.product.brand}</span> {p.product.name}
                  </span>
                  <span className="whitespace-nowrap text-[11px] uppercase tracking-[0.16em] text-primary">
                    How to apply →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-10 border-t border-border pt-8">
        <h2 className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">What happens next</h2>
        <ol className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
          <li>
            <span className="text-foreground">1.</span> We pick, batch-check and pack your order in Melbourne.
          </li>
          <li>
            <span className="text-foreground">2.</span> You’ll get a dispatch email with carrier tracking. Allow 1–3
            business days in transit for most Australian addresses; remote postcodes can take longer.
          </li>
          <li>
            <span className="text-foreground">3.</span> Each product has a step-by-step application guide on its
            product page whenever you need it.
          </li>
        </ol>
      </section>


      {!user && (
        <section className="mt-8 border border-border p-6">
          <h2 className="font-display text-xl text-foreground">Create an account?</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Optional — sign up with the same email you used at checkout and this order is linked to your account
            automatically, so you can see its status and start earning points.
          </p>
          <Link
            to="/auth"
            className="mt-5 inline-flex border border-border px-6 py-3 text-xs uppercase tracking-[0.16em] text-foreground transition hover:bg-secondary"
          >
            Create an account
          </Link>
        </section>
      )}

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          to="/shop"
          className="bg-primary px-7 py-3.5 text-sm font-medium uppercase tracking-[0.16em] text-primary-foreground transition hover:opacity-90"
        >
          Keep shopping
        </Link>
        <Link
          to="/track"
          className="border border-border px-7 py-3.5 text-sm uppercase tracking-[0.16em] text-foreground transition hover:bg-secondary"
        >
          Track order
        </Link>
        {user && (
          <Link
            to="/account"
            className="border border-border px-7 py-3.5 text-sm uppercase tracking-[0.16em] text-foreground transition hover:bg-secondary"
          >
            View your account
          </Link>
        )}
      </div>
    </div>
  );
}
