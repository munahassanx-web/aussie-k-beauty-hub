import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { getGuestOrderBySession, getOrderBySession, type OrderReceipt } from '@/lib/commerce.functions';
import { useCart, formatAud } from '@/lib/cart';

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

  if (!sessionId) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-display text-4xl text-foreground">No order found</h1>
        <Link to="/shop" className="mt-6 inline-flex rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground">Back to shop</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <p className="text-xs uppercase tracking-[0.2em] text-primary">Thank you</p>
      <h1 className="mt-3 font-display text-4xl text-foreground">Your order is confirmed</h1>
      <p className="mt-3 text-muted-foreground">
        We've emailed your receipt. Orders placed before 12pm are dispatched the same business day.*
      </p>

      <div className="mt-8 rounded-2xl border border-border p-6">
        {!receipt ? (
          <p className="text-sm text-muted-foreground">
            {tries > 10 ? 'Payment received — your order details will appear in your account shortly.' : 'Finalising your order…'}
          </p>
        ) : (
          <div className="space-y-4">
            <ul className="space-y-2">
              {receipt.lineItems.map((l, i) => (
                <li key={i} className="flex justify-between text-sm text-foreground">
                  <span>{l.name} × {l.quantity}</span>
                  <span>{formatAud(l.amountCents)}</span>
                </li>
              ))}
            </ul>
            <div className="space-y-1 border-t border-border pt-4 text-sm">
              {receipt.shippingCents > 0 && (
                <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span>{formatAud(receipt.shippingCents)}</span></div>
              )}
              {receipt.discountCents > 0 && (
                <div className="flex justify-between text-muted-foreground"><span>Points reward</span><span>−{formatAud(receipt.discountCents)}</span></div>
              )}
              <div className="flex justify-between text-base text-foreground"><span>Total paid</span><span>{formatAud(receipt.amountCents)}</span></div>
            </div>
            {receipt.pointsEarned > 0 && (
              <p className="rounded-xl bg-secondary p-3 text-sm text-foreground">
                You earned {receipt.pointsEarned} points on this order.
              </p>
            )}
            {receipt.shipping && (
              <div className="text-sm text-muted-foreground">
                <p className="text-foreground">Delivering to</p>
                <p>{receipt.shipping.name}</p>
                <p>{receipt.shipping.line1}{receipt.shipping.line2 ? `, ${receipt.shipping.line2}` : ''}</p>
                <p>{receipt.shipping.city} {receipt.shipping.state} {receipt.shipping.postcode}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">*Metro and most regional areas. Remote postcodes may take 1–2 extra days.</p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/club" className="rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground hover:opacity-90">View your account</Link>
        <Link to="/shop" className="rounded-full border border-border px-7 py-3 text-sm font-medium text-foreground hover:bg-secondary">Keep shopping</Link>
      </div>
    </div>
  );
}
