import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { listAdminOrders } from '@/lib/admin-orders.functions';
import { listInventory } from '@/lib/inventory.functions';
import { useStaffAccess } from '@/hooks/use-staff-access';

export const Route = createFileRoute('/admin/')({
  head: () => ({
    meta: [
      { title: 'Admin dashboard — Skin Grocer' },
      { name: 'description', content: 'Internal operational launchpad for Skin Grocer staff.' },
      { name: 'robots', content: 'noindex, nofollow' },
      { property: 'og:title', content: 'Admin dashboard — Skin Grocer' },
      { property: 'og:description', content: 'Orders, inventory and editorial desks for Skin Grocer staff.' },
    ],
  }),
  component: AdminHome,
});

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Admin</p>
          <h1 className="mt-3 font-display text-4xl text-foreground">Operations</h1>
        </div>
        <Link
          to="/"
          className="min-h-11 text-xs uppercase tracking-[0.18em] text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
        >
          ← Back to store
        </Link>
      </div>
      <div className="mt-8">{children}</div>
    </main>
  );
}

function Metric({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="border border-border bg-secondary/40 p-4">
      <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-3xl text-foreground">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

type CardDef = { to: string; title: string; body: string; note?: string };

function DeskCard({ card }: { card: CardDef }) {
  return (
    <Link
      to={card.to}
      className="group flex min-h-[104px] flex-col justify-between border border-border p-5 transition hover:border-primary"
    >
      <div>
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-display text-xl text-foreground">{card.title}</h2>
          <span className="text-sm text-muted-foreground group-hover:text-primary">→</span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.body}</p>
      </div>
      {card.note && <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{card.note}</p>}
    </Link>
  );
}

function AdminHome() {
  const { isStaff, isAdmin, loading, signedIn } = useStaffAccess();
  const fetchOrders = useServerFn(listAdminOrders);
  const fetchInventory = useServerFn(listInventory);

  const ordersQ = useQuery({
    queryKey: ['admin-dashboard-orders'],
    queryFn: () => fetchOrders({ data: { stage: 'all' } }),
    enabled: isStaff,
    retry: false,
  });
  const inventoryQ = useQuery({
    queryKey: ['admin-dashboard-inventory'],
    queryFn: () => fetchInventory(),
    enabled: isStaff,
    retry: false,
  });

  if (loading) {
    return (
      <Shell>
        <p className="text-sm text-muted-foreground">Loading…</p>
      </Shell>
    );
  }

  if (!signedIn) {
    return (
      <Shell>
        <p className="text-sm text-muted-foreground">
          <Link to="/auth" className="underline underline-offset-4">
            Sign in
          </Link>{' '}
          with your staff account to continue.
        </p>
      </Shell>
    );
  }

  if (!isStaff) {
    return (
      <Shell>
        <div className="border border-border p-6">
          <h2 className="font-display text-2xl text-foreground">Not authorised</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            This area is for Skin Grocer fulfilment staff. Your account doesn’t have access.
          </p>
          <Link
            to="/"
            className="mt-5 inline-flex min-h-11 items-center border border-border px-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground hover:border-primary hover:text-primary"
          >
            Back to store
          </Link>
        </div>
      </Shell>
    );
  }

  const counts = ordersQ.data?.counts;
  const totals = ordersQ.data?.totals;
  const invCounts = inventoryQ.data?.counts;
  const lowStock = (invCounts?.['low'] ?? 0) + (invCounts?.['out_of_stock'] ?? 0);

  const cards: CardDef[] = [
    { to: '/admin/orders', title: 'Orders', body: 'Pick, pack, print and dispatch the live fulfilment queue.' },
    { to: '/admin/inventory', title: 'Inventory', body: 'Stock counts, adjustments and movement history.' },
  ];
  if (isAdmin) {
    cards.push(
      { to: '/admin/reviews', title: 'Reviews', body: 'Approve or remove customer reviews awaiting moderation.', note: 'Admin only' },
      { to: '/admin/signals', title: 'Seoul Signal', body: 'Harvest signals, draft and publish editorial issues.', note: 'Admin only' },
    );
  }
  cards.push({ to: '/admin/guide-links', title: 'Product guide links', body: 'Check every product guide PDF resolves.' });

  return (
    <Shell>
      {ordersQ.isError || inventoryQ.isError ? (
        <p className="mb-6 text-sm text-destructive">Some operational figures couldn’t load just now.</p>
      ) : null}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Metric label="To pack" value={ordersQ.isLoading ? '—' : String(counts?.['processing'] ?? 0)} hint="Awaiting picking" />
        <Metric label="Packed" value={ordersQ.isLoading ? '—' : String(counts?.['packed'] ?? 0)} hint="Awaiting dispatch" />
        <Metric
          label="Paid · 7 days"
          value={ordersQ.isLoading ? '—' : String(totals?.last7Count ?? 0)}
          hint="Paid orders this week"
        />
        <Metric
          label="Low / out of stock"
          value={inventoryQ.isLoading ? '—' : String(lowStock)}
          hint="Counted SKUs needing attention"
        />
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        {cards.map((c) => (
          <DeskCard key={c.to} card={c} />
        ))}
      </div>
    </Shell>
  );
}
