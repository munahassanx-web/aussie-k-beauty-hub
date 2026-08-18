import { createFileRoute, Link } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import {
  adjustStock,
  getInventoryHistory,
  listInventory,
  setInventorySettings,
  setOpeningStock,
  type InventoryRow,
} from '@/lib/inventory.functions';

export const Route = createFileRoute('/admin/inventory')({
  head: () => ({
    meta: [
      { title: 'Stock on hand — Skin Grocer admin' },
      { name: 'description', content: 'Warehouse stock levels, opening counts and the movement audit trail for Skin Grocer.' },
      { name: 'robots', content: 'noindex, nofollow' },
      { property: 'og:title', content: 'Stock on hand — Skin Grocer admin' },
      { property: 'og:description', content: 'Single-warehouse inventory for Skin Grocer.' },
    ],
  }),
  component: InventoryBoard,
});

const STATUS_LABEL: Record<string, string> = {
  all: 'All SKUs',
  not_counted: 'Not counted yet',
  out_of_stock: 'Out of stock',
  low: 'Low stock',
  healthy: 'In stock',
  untracked: 'Tracking off',
};

const STATUS_STYLE: Record<string, string> = {
  not_counted: 'bg-secondary text-muted-foreground',
  out_of_stock: 'bg-destructive/10 text-destructive',
  low: 'bg-primary/10 text-primary',
  healthy: 'bg-secondary text-foreground',
  untracked: 'bg-secondary text-muted-foreground',
};

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Admin</p>
      <h1 className="mt-3 font-display text-4xl text-foreground">Stock on hand</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
        One warehouse, one row per catalog SKU. Counts start empty — a product stays purchasable until you enter its
        first real count, and every change after that is logged.
      </p>
      <div className="mt-8">{children}</div>
    </main>
  );
}

function InventoryBoard() {
  const { user, loading } = useAuth();
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [openSku, setOpenSku] = useState<string | null>(null);
  const fetchInventory = useServerFn(listInventory);

  const q = useQuery({
    queryKey: ['admin-inventory'],
    queryFn: () => fetchInventory({ data: undefined as never }),
    enabled: Boolean(user),
    retry: false,
  });

  const rows = useMemo(() => {
    const all = q.data?.rows ?? [];
    const term = search.trim().toLowerCase();
    return all.filter(
      (r) =>
        (status === 'all' || r.status === status) &&
        (!term || `${r.brand} ${r.name} ${r.sku}`.toLowerCase().includes(term)),
    );
  }, [q.data, status, search]);

  if (loading) return <Shell><p className="text-sm text-muted-foreground">Loading…</p></Shell>;
  if (!user) {
    return (
      <Shell>
        <p className="text-sm text-muted-foreground">
          <Link to="/auth" className="underline">Sign in</Link> with a staff account to manage stock.
        </p>
      </Shell>
    );
  }
  if (q.isError) return <Shell><p className="text-sm text-destructive">{(q.error as Error).message}</p></Shell>;

  const counts = q.data?.counts ?? {};

  return (
    <Shell>
      <div className="grid gap-3 sm:grid-cols-4">
        {(['out_of_stock', 'low', 'not_counted', 'healthy'] as const).map((k) => (
          <div key={k} className="rounded-2xl border border-border p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{STATUS_LABEL[k]}</p>
            <p className="mt-2 font-display text-3xl text-foreground">{counts[k] ?? 0}</p>
          </div>
        ))}
      </div>

      <BundleMappingPanel enabled={Boolean(user)} />


      <div className="mt-8 flex flex-wrap items-center gap-2">
        {Object.keys(STATUS_LABEL).map((k) => (
          <button
            key={k}
            onClick={() => setStatus(k)}
            className={`min-h-11 rounded-full border px-4 text-xs uppercase tracking-[0.16em] ${
              status === k ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-foreground hover:bg-secondary'
            }`}
          >
            {STATUS_LABEL[k]} {k === 'all' ? counts['all'] ?? 0 : counts[k] ?? 0}
          </button>
        ))}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search brand, product or SKU"
          aria-label="Search inventory"
          className="ml-auto min-h-11 w-full max-w-xs rounded-full border border-border bg-background px-4 text-sm text-foreground"
        />
      </div>

      <div className="mt-6 divide-y divide-border border-y border-border">
        {rows.length === 0 && <p className="py-8 text-sm text-muted-foreground">No SKUs match this view.</p>}
        {rows.map((row) => (
          <StockRow key={row.sku} row={row} open={openSku === row.sku} onToggle={() => setOpenSku(openSku === row.sku ? null : row.sku)} />
        ))}
      </div>
    </Shell>
  );
}

function StockRow({ row, open, onToggle }: { row: InventoryRow; open: boolean; onToggle: () => void }) {
  return (
    <div className="py-4">
      <div className="flex flex-wrap items-center gap-4">
        <img src={row.image} alt="" width={56} height={56} className="h-14 w-14 rounded-lg object-cover" loading="lazy" />
        <div className="min-w-[12rem] flex-1">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{row.brand}</p>
          <p className="text-sm text-foreground">{row.name}</p>
          <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">{row.sku}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.14em] ${STATUS_STYLE[row.status]}`}>
          {STATUS_LABEL[row.status]}
        </span>
        <p className="w-20 text-right font-display text-2xl text-foreground">
          {row.counted ? row.onHand : '—'}
        </p>
        <button onClick={onToggle} aria-expanded={open} className="min-h-11 px-3 text-sm underline text-foreground">
          {open ? 'Close' : row.counted ? 'Adjust' : 'Enter count'}
        </button>
      </div>
      {open && <RowEditor row={row} />}
    </div>
  );
}

function RowEditor({ row }: { row: InventoryRow }) {
  const queryClient = useQueryClient();
  const openingFn = useServerFn(setOpeningStock);
  const adjustFn = useServerFn(adjustStock);
  const settingsFn = useServerFn(setInventorySettings);
  const historyFn = useServerFn(getInventoryHistory);

  const [qty, setQty] = useState('');
  const [reason, setReason] = useState<'purchase_received' | 'return_to_stock' | 'manual_adjustment' | 'damage_writeoff'>('purchase_received');
  const [note, setNote] = useState('');
  const [threshold, setThreshold] = useState(String(row.lowStockThreshold));

  const history = useQuery({
    queryKey: ['inventory-history', row.sku],
    queryFn: () => historyFn({ data: { sku: row.sku } }),
    retry: false,
  });

  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: ['admin-inventory'] });
    void queryClient.invalidateQueries({ queryKey: ['inventory-history', row.sku] });
    setQty('');
    setNote('');
  };

  const opening = useMutation({
    mutationFn: () =>
      openingFn({ data: { sku: row.sku, quantity: Number(qty), lowStockThreshold: Number(threshold), note: note || undefined } }),
    onSuccess: (r) => { toast.success(`Opening count set — ${r.onHand} on hand`); refresh(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const adjust = useMutation({
    mutationFn: () => adjustFn({ data: { sku: row.sku, delta: Number(qty), reason, note: note || undefined } }),
    onSuccess: (r) => { toast.success(`Stock updated — ${r.onHand} on hand`); refresh(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const settings = useMutation({
    mutationFn: (trackInventory: boolean) =>
      settingsFn({ data: { sku: row.sku, lowStockThreshold: Number(threshold), trackInventory } }),
    onSuccess: () => { toast.success('Settings saved'); refresh(); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="mt-4 grid gap-6 rounded-2xl border border-border p-5 lg:grid-cols-2">
      <div>
        {!row.counted ? (
          <form
            onSubmit={(e) => { e.preventDefault(); opening.mutate(); }}
            className="space-y-3"
          >
            <p className="text-sm font-medium text-foreground">First physical count</p>
            <p className="text-xs text-muted-foreground">
              Count the shelf, then enter the real number. Nothing is assumed before you do.
            </p>
            <label className="block text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Units on hand
              <input
                type="number" min={0} required value={qty} onChange={(e) => setQty(e.target.value)}
                className="mt-1 block min-h-11 w-40 rounded-lg border border-border bg-background px-3 text-sm text-foreground"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Low-stock alert at
              <input
                type="number" min={0} value={threshold} onChange={(e) => setThreshold(e.target.value)}
                className="mt-1 block min-h-11 w-40 rounded-lg border border-border bg-background px-3 text-sm text-foreground"
              />
            </label>
            <button disabled={opening.isPending} className="min-h-11 rounded-full bg-primary px-6 text-sm uppercase tracking-[0.16em] text-primary-foreground disabled:opacity-60">
              {opening.isPending ? 'Saving…' : 'Set opening count'}
            </button>
          </form>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); adjust.mutate(); }} className="space-y-3">
            <p className="text-sm font-medium text-foreground">Record a movement</p>
            <div className="flex flex-wrap gap-2">
              {([
                ['purchase_received', 'Received'],
                ['return_to_stock', 'Return to stock'],
                ['damage_writeoff', 'Damage / write-off'],
                ['manual_adjustment', 'Recount adjustment'],
              ] as const).map(([value, label]) => (
                <button
                  key={value} type="button" onClick={() => setReason(value)}
                  className={`min-h-11 rounded-full border px-4 text-xs ${reason === value ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-foreground hover:bg-secondary'}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <label className="block text-xs uppercase tracking-[0.16em] text-muted-foreground">
              {reason === 'manual_adjustment' ? 'Change (+/−)' : 'Units'}
              <input
                type="number" required value={qty} onChange={(e) => setQty(e.target.value)}
                className="mt-1 block min-h-11 w-40 rounded-lg border border-border bg-background px-3 text-sm text-foreground"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Note {(reason === 'manual_adjustment' || reason === 'damage_writeoff') && '(required)'}
              <input
                value={note} onChange={(e) => setNote(e.target.value)} maxLength={200}
                className="mt-1 block min-h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground"
              />
            </label>
            <div className="flex flex-wrap items-end gap-3">
              <button disabled={adjust.isPending} className="min-h-11 rounded-full bg-primary px-6 text-sm uppercase tracking-[0.16em] text-primary-foreground disabled:opacity-60">
                {adjust.isPending ? 'Saving…' : 'Record movement'}
              </button>
              <label className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                Low-stock at
                <input
                  type="number" min={0} value={threshold} onChange={(e) => setThreshold(e.target.value)}
                  className="mt-1 block min-h-11 w-24 rounded-lg border border-border bg-background px-3 text-sm text-foreground"
                />
              </label>
              <button type="button" onClick={() => settings.mutate(row.trackInventory)} className="min-h-11 px-2 text-xs underline text-foreground">
                Save threshold
              </button>
              <button type="button" onClick={() => settings.mutate(!row.trackInventory)} className="min-h-11 px-2 text-xs underline text-foreground">
                {row.trackInventory ? 'Stop tracking this SKU' : 'Resume tracking'}
              </button>
            </div>
          </form>
        )}
      </div>

      <div>
        <p className="text-sm font-medium text-foreground">Movement history</p>
        {history.isLoading && <p className="mt-2 text-xs text-muted-foreground">Loading…</p>}
        {history.data?.length === 0 && <p className="mt-2 text-xs text-muted-foreground">No movements recorded yet.</p>}
        <ul className="mt-2 max-h-72 space-y-2 overflow-y-auto pr-1">
          {(history.data ?? []).map((m) => (
            <li key={m.id} className="flex items-baseline justify-between gap-3 border-b border-border pb-2 text-xs">
              <span className="text-muted-foreground">
                {new Date(m.createdAt).toLocaleString('en-AU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                {' · '}
                {m.reason.replace(/_/g, ' ')}
                {m.note ? ` · ${m.note}` : ''}
                {m.orderId ? ' · order' : ''}
              </span>
              <span className="whitespace-nowrap text-foreground">
                {m.delta > 0 ? `+${m.delta}` : m.delta} → {m.resultingOnHand}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
