import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { allGuideTargets } from '@/lib/guide-content';

export const Route = createFileRoute('/admin/guide-links')({
  head: () => ({
    meta: [
      { title: 'Guide QR links — Skin Grocer admin' },
      {
        name: 'description',
        content: 'Internal fulfilment reference: stable application-guide URLs and QR codes per SKU.',
      },
      { name: 'robots', content: 'noindex, nofollow' },
      { property: 'og:title', content: 'Guide QR links — Skin Grocer admin' },
      { property: 'og:description', content: 'Stable application-guide URLs and QR codes per SKU.' },
    ],
  }),
  component: GuideLinksDesk,
});

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Admin</p>
      <h1 className="mt-3 font-display text-4xl text-foreground">Guide QR links</h1>
      <div className="mt-8">{children}</div>
    </main>
  );
}

function QrCell({ url, filename }: { url: string; filename: string }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    void QRCode.toDataURL(url, { margin: 1, width: 512, errorCorrectionLevel: 'M' })
      .then((d) => {
        if (alive) setDataUrl(d);
      })
      .catch(() => {
        if (alive) setDataUrl(null);
      });
    return () => {
      alive = false;
    };
  }, [url]);

  if (!dataUrl) return <div className="h-20 w-20 border border-border" aria-hidden="true" />;
  return (
    <a href={dataUrl} download={`${filename}.png`} title={`Download QR for ${url}`}>
      <img src={dataUrl} alt={`QR code linking to ${url}`} width={80} height={80} />
    </a>
  );
}

type Filter = 'all' | 'complete' | 'partial' | 'fallback';

const FILTERS: Array<{ id: Filter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'complete', label: 'Complete' },
  { id: 'partial', label: 'Partial' },
  { id: 'fallback', label: 'Fallback' },
];

function Field({ on, label }: { on: boolean; label: string }) {
  return (
    <span
      className={`border px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] ${
        on ? 'border-foreground text-foreground' : 'border-border text-muted-foreground/60'
      }`}
    >
      {label}
    </span>
  );
}

function GuideLinksDesk() {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const targets = useMemo(() => allGuideTargets(), []);

  useEffect(() => {
    if (!user) {
      setIsAdmin(null);
      return;
    }
    void supabase
      .rpc('has_role', { _user_id: user.id, _role: 'admin' })
      .then(({ data, error }) => setIsAdmin(!error && data === true));
  }, [user]);

  const filtered = targets.filter(
    (t) =>
      (filter === 'all' || t.coverage === filter) &&
      `${t.product.brand} ${t.product.name} ${t.slug}`.toLowerCase().includes(query.toLowerCase()),
  );
  const counts = {
    complete: targets.filter((t) => t.coverage === 'complete').length,
    partial: targets.filter((t) => t.coverage === 'partial').length,
    fallback: targets.filter((t) => t.coverage === 'fallback').length,
  };

  if (loading) return <Shell><p className="text-sm text-muted-foreground">Loading…</p></Shell>;
  if (!user)
    return (
      <Shell>
        <p className="text-sm text-muted-foreground">
          <Link to="/auth" className="underline underline-offset-4">
            Sign in
          </Link>{' '}
          with an admin account to view fulfilment links.
        </p>
      </Shell>
    );
  if (isAdmin === false)
    return (
      <Shell>
        <p className="text-sm text-muted-foreground">This account doesn’t have admin access.</p>
      </Shell>
    );
  if (isAdmin === null)
    return <Shell><p className="text-sm text-muted-foreground">Checking access…</p></Shell>;

  const csv = [
    'brand,product,slug,guide_url,coverage,directions,amount,frequency,note,source',
    ...targets.map((t) =>
      [
        `"${t.product.brand}"`,
        `"${t.product.name.replace(/"/g, '""')}"`,
        t.slug,
        t.absoluteUrl,
        t.coverage,
        t.productSpecific ? 'product-specific' : 'generic-fallback',
        t.hasAmount ? 'yes' : 'no',
        t.hasFrequency ? 'yes' : 'no',
        t.hasNote ? 'yes' : 'no',
        `"${t.source ?? ''}"`,
      ].join(','),
    ),
  ].join('\n');
  const csvHref = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;

  return (
    <Shell>
      <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Every SKU’s permanent “How to apply” URL, plus a QR image encoding that exact URL, and the
        content-completeness state of its guide. Codes are generated here on demand — packing
        inserts and label printing are still a manual warehouse step.
      </p>
      <p className="mt-3 text-sm text-muted-foreground">
        {counts.complete} complete · {counts.partial} partial · {counts.fallback} fallback, of{' '}
        {targets.length} SKUs. Fallback SKUs show clearly-labelled general routine guidance until
        official brand directions are verified.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <label className="sr-only" htmlFor="guide-search">
          Search products
        </label>
        <input
          id="guide-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search brand or product"
          className="w-full max-w-xs border border-border bg-background px-4 py-2.5 text-sm text-foreground"
        />
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={`border px-4 py-2 text-[11px] uppercase tracking-[0.14em] ${
                filter === f.id
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border text-foreground hover:bg-secondary'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <a
          href={csvHref}
          download="skin-grocer-guide-links.csv"
          className="border border-border px-5 py-2.5 text-xs uppercase tracking-[0.16em] text-foreground hover:bg-secondary"
        >
          Export CSV
        </a>
      </div>

      <ul className="mt-8 border-t border-border">
        {filtered.map((t) => (
          <li key={t.slug} className="flex items-start gap-5 border-b border-border py-5">
            <QrCell url={t.absoluteUrl} filename={t.slug} />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {t.product.brand}
              </p>
              <p className="mt-1 text-sm text-foreground">{t.product.name}</p>
              <a
                href={t.url}
                className="mt-1 block truncate font-mono text-xs text-muted-foreground underline underline-offset-4"
              >
                {t.absoluteUrl}
              </a>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span
                  className={`px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] ${
                    t.coverage === 'complete'
                      ? 'bg-foreground text-background'
                      : t.coverage === 'partial'
                        ? 'border border-foreground text-foreground'
                        : 'border border-primary text-primary'
                  }`}
                >
                  {t.coverage}
                </span>
                <Field on={t.productSpecific} label="Directions" />
                <Field on={t.hasAmount} label="Amount" />
                <Field on={t.hasFrequency} label="When" />
                <Field on={t.hasNote} label="Note" />
              </div>
              {t.source ? (
                <p className="mt-2 truncate font-mono text-[11px] text-muted-foreground">
                  Source: {t.source}
                </p>
              ) : (
                <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  No official source on file
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
      {filtered.length === 0 && (
        <p className="mt-6 text-sm text-muted-foreground">No products match that search.</p>
      )}
    </Shell>
  );
}

