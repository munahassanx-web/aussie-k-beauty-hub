import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { listAdminOrders, FULFILMENT_STAGES } from '@/lib/admin-orders.functions';
import { useAuth } from '@/hooks/use-auth';

export const Route = createFileRoute('/admin/orders/')({
  head: () => ({
    meta: [
      { title: 'Order queue — Skin Grocer admin' },
      { name: 'description', content: 'Internal fulfilment queue for Skin Grocer orders dispatched from Melbourne.' },
      { name: 'robots', content: 'noindex, nofollow' },
      { property: 'og:title', content: 'Order queue — Skin Grocer admin' },
      { property: 'og:description', content: 'Pick, pack and dispatch Skin Grocer orders.' },
    ],
  }),
  component: OrderQueue,
});

export function money(cents: number, currency = 'AUD') {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency }).format((cents ?? 0) / 100);
}

function when(iso: string) {
  return new Date(iso).toLocaleString('en-AU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Admin</p>
      <h1 className="mt-3 font-display text-4xl text-foreground">Order queue</h1>
      <div className="mt-8">{children}</div>
    </main>
  );
}

const STAGE_LABEL: Record<string, string> = {
  processing: 'To pack',
  packed: 'Packed',
  shipped: 'Dispatched',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  unpaid: 'Unpaid / failed',
};

const PAYMENT_LABEL: Record<string, string> = {
  paid: 'Paid',
  partially_refunded: 'Part refunded',
  refunded: 'Refunded',
  pending: 'Unpaid',
  failed: 'Payment failed',
};

/** Loud, unmistakable marker so a test order is never mistaken for a sale. */
function TestBadge() {
  return (
    <span className="ml-2 rounded-full border border-destructive px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-destructive">
      Test
    </span>
  );
}

function OrderQueue() {
  const { user, loading } = useAuth();
  const [environment, setEnvironment] = useState<'live' | 'sandbox'>('live');
  const [stage, setStage] = useState<string>('processing');
  const [search, setSearch] = useState('');
  const fetchOrders = useServerFn(listAdminOrders);

  const q = useQuery({
    queryKey: ['admin-orders', environment, stage, search],
    queryFn: () => fetchOrders({ data: { stage, search, environment } }),
    enabled: Boolean(user),
    retry: false,
  });

  const isSandbox = environment === 'sandbox';

  if (loading) return <Shell><p className="text-sm text-muted-foreground">Loading…</p></Shell>;
  if (!user) {
    return (
      <Shell>
        <p className="text-sm text-muted-foreground">
          <Link to="/auth" className="underline">Sign in</Link> with a staff account to see the fulfilment queue.
        </p>
      </Shell>
    );
  }
  if (q.isError) {
    return (
      <Shell>
        <p className="text-sm text-destructive">{(q.error as Error).message}</p>
      </Shell>
    );
  }


  const data = q.data;

  return (
    <Shell>
      {data && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'To pack', value: String(data.counts['processing'] ?? 0) },
            { label: 'Dispatched', value: String(data.counts['shipped'] ?? 0) },
            { label: 'Paid orders (7 days)', value: String(data.totals.last7Count) },
            { label: 'Revenue (7 days)', value: money(data.totals.last7Cents) },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-border p-4 sm:p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{s.label}</p>
              <p className="mt-2 font-display text-2xl text-foreground">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-2">
        {(['all', ...FULFILMENT_STAGES, 'cancelled'] as string[]).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStage(s)}
            aria-pressed={stage === s}
            className={`rounded-full border px-4 py-2 text-sm ${
              stage === s ? 'border-foreground bg-foreground text-background' : 'border-border text-muted-foreground'
            }`}
          >
            {s === 'all' ? 'All' : STAGE_LABEL[s] ?? s}
            {s !== 'all' && data ? ` (${data.counts[s] ?? 0})` : ''}
          </button>
        ))}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search email, name, tracking, product…"
          aria-label="Search orders"
          className="ml-auto w-full max-w-xs rounded-full border border-border bg-background px-4 py-2 text-sm outline-none focus:border-primary"
        />
      </div>

      <div className="mt-6 hidden overflow-x-auto rounded-2xl border border-border md:block">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-[0.14em] text-muted-foreground">
            <tr>
              <th scope="col" className="px-4 py-3">Placed</th>
              <th scope="col" className="px-4 py-3">Customer</th>
              <th scope="col" className="px-4 py-3">Items</th>
              <th scope="col" className="px-4 py-3">Total</th>
              <th scope="col" className="px-4 py-3">Stage</th>
              <th scope="col" className="px-4 py-3">Tracking</th>
              <th scope="col" className="px-4 py-3"><span className="sr-only">Open</span></th>
            </tr>
          </thead>
          <tbody>
            {q.isLoading && (
              <tr><td colSpan={7} className="px-4 py-8 text-muted-foreground">Loading orders…</td></tr>
            )}
            {data?.orders.length === 0 && !q.isLoading && (
              <tr><td colSpan={7} className="px-4 py-8 text-muted-foreground">Nothing in this stage right now.</td></tr>
            )}
            {data?.orders.map((o) => (
              <tr key={o.id} className="border-b border-border/60 last:border-0">
                <td className="px-4 py-3 text-muted-foreground">{when(o.createdAt)}</td>
                <td className="px-4 py-3">
                  <p className="text-foreground">{o.customerName ?? 'Not provided'}</p>
                  <p className="text-xs text-muted-foreground">
                    {o.customerEmail ?? '—'}{o.isGuest ? ' · guest' : ''}
                  </p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{o.itemCount}</td>
                <td className="px-4 py-3 text-foreground">{money(o.amountCents, o.currency)}</td>
                <td className="px-4 py-3">{STAGE_LABEL[o.fulfillmentStatus] ?? o.fulfillmentStatus}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{o.trackingNumber ?? '—'}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    to="/admin/orders/$id"
                    params={{ id: o.id }}
                    className="rounded-full border border-border px-4 py-2 text-xs hover:border-foreground"
                  >
                    Open
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phone view — same queue as cards, one tap per order. */}
      <ul className="mt-6 space-y-3 md:hidden">
        {q.isLoading && <li className="text-sm text-muted-foreground">Loading orders…</li>}
        {data?.orders.length === 0 && !q.isLoading && (
          <li className="text-sm text-muted-foreground">Nothing in this stage right now.</li>
        )}
        {data?.orders.map((o) => (
          <li key={o.id}>
            <Link
              to="/admin/orders/$id"
              params={{ id: o.id }}
              className="block rounded-2xl border border-border p-4 active:border-foreground"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-display text-lg text-foreground">{o.customerName ?? 'Not provided'}</span>
                <span className="text-sm text-foreground">{money(o.amountCents, o.currency)}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {o.customerEmail ?? '—'}{o.isGuest ? ' · guest' : ''}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {when(o.createdAt)} · {o.itemCount} item{o.itemCount === 1 ? '' : 's'} ·{' '}
                {STAGE_LABEL[o.fulfillmentStatus] ?? o.fulfillmentStatus}
              </p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                {o.trackingNumber ? `${o.shippingCarrier ?? 'Carrier'} ${o.trackingNumber}` : 'No tracking yet'}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </Shell>
  );
}
