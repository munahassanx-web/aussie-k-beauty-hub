import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, type FormEvent } from 'react';
import { trackOrder, type TrackedOrder } from '@/lib/commerce.functions';
import { formatAud } from '@/lib/cart';

export const Route = createFileRoute('/track')({
  head: () => ({
    meta: [
      { title: 'Track your order — Skin Grocer' },
      {
        name: 'description',
        content:
          'Check the status of a Skin Grocer order with your email and order ID — no account needed. Dispatched next day from Melbourne.',
      },
      { property: 'og:title', content: 'Track your order — Skin Grocer' },
      {
        property: 'og:description',
        content: 'Enter your email and order ID to see fulfilment status and tracking for your Skin Grocer order.',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: TrackOrderPage,
});

const STAGES: Array<{ key: string; label: string; note: string }> = [
  { key: 'processing', label: 'Order received', note: 'Payment confirmed, picking in Melbourne.' },
  { key: 'packed', label: 'Packed', note: 'Sealed, batch-checked and labelled.' },
  { key: 'shipped', label: 'Dispatched', note: 'On its way with your carrier.' },
  { key: 'delivered', label: 'Delivered', note: 'Enjoy the ritual.' },
];

function stageIndex(status: string): number {
  const i = STAGES.findIndex((s) => s.key === status.toLowerCase());
  return i === -1 ? 0 : i;
}

function TrackOrderPage() {
  const [email, setEmail] = useState('');
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setOrder(null);
    try {
      const result = await trackOrder({ data: { orderId, email } });
      if (!result) {
        setError("We couldn't find an order with that email and order ID. Check the details in your confirmation email.");
      } else {
        setOrder(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const current = order ? stageIndex(order.fulfillmentStatus) : 0;

  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <p className="text-xs uppercase tracking-[0.2em] text-primary">Order status</p>
      <h1 className="mt-3 font-display text-4xl text-foreground">Track your order</h1>
      <p className="mt-3 text-muted-foreground">
        No account needed. Enter the email you checked out with and the order ID from your confirmation email.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-2xl border border-border p-6">
        <div>
          <label htmlFor="track-email" className="text-sm text-foreground">
            Email
          </label>
          <input
            id="track-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
          />
        </div>
        <div>
          <label htmlFor="track-order-id" className="text-sm text-foreground">
            Order ID
          </label>
          <input
            id="track-order-id"
            required
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="e.g. 3f9c1a20-5c1e-4b2f-9a77-0b1f2c3d4e5f"
            className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 font-mono text-sm text-foreground outline-none focus:border-primary"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
        >
          {loading ? 'Looking up…' : 'Track order'}
        </button>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </form>

      {order && (
        <div className="mt-8 space-y-6 rounded-2xl border border-border p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <p className="font-display text-2xl text-foreground">{STAGES[current]?.label}</p>
              <p className="text-sm text-muted-foreground">{STAGES[current]?.note}</p>
            </div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Placed {new Date(order.placedAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>

          <ol className="space-y-3">
            {STAGES.map((stage, i) => (
              <li key={stage.key} className="flex items-start gap-3">
                <span
                  className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${i <= current ? 'bg-primary' : 'bg-border'}`}
                  aria-hidden="true"
                />
                <span className={`text-sm ${i <= current ? 'text-foreground' : 'text-muted-foreground'}`}>{stage.label}</span>
              </li>
            ))}
          </ol>

          {order.trackingNumber && (
            <p className="rounded-xl bg-secondary p-3 text-sm text-foreground">
              Tracking number: <span className="font-mono">{order.trackingNumber}</span>
            </p>
          )}

          <div className="border-t border-border pt-4">
            <ul className="space-y-2">
              {order.lineItems.map((l, i) => (
                <li key={i} className="flex justify-between text-sm text-foreground">
                  <span>
                    {l.name} × {l.quantity}
                  </span>
                  <span>{formatAud(l.amountCents)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between border-t border-border pt-3 text-base text-foreground">
              <span>Total paid</span>
              <span>{formatAud(order.amountCents)}</span>
            </div>
          </div>

          {order.shipping && (
            <div className="text-sm text-muted-foreground">
              <p className="text-foreground">Delivering to</p>
              <p>{order.shipping.name}</p>
              <p>
                {order.shipping.line1}
                {order.shipping.line2 ? `, ${order.shipping.line2}` : ''}
              </p>
              <p>
                {order.shipping.city} {order.shipping.state} {order.shipping.postcode}
              </p>
            </div>
          )}
        </div>
      )}

      <p className="mt-6 text-sm text-muted-foreground">
        Can't find your order ID?{' '}
        <Link to="/contact" className="underline">
          Contact us
        </Link>{' '}
        and we'll look it up.
      </p>
    </div>
  );
}
