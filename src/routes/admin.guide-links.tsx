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

function GuideLinksDesk() {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [query, setQuery] = useState('');
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

  const filtered = targets.filter((t) =>
    `${t.product.brand} ${t.product.name} ${t.slug}`.toLowerCase().includes(query.toLowerCase()),
  );
  const specific = targets.filter((t) => t.productSpecific).length;

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
    'brand,product,slug,guide_url,directions',
    ...targets.map((t) =>
      [
        `"${t.product.brand}"`,
        `"${t.product.name.replace(/"/g, '""')}"`,
        t.slug,
        t.absoluteUrl,
        t.productSpecific ? 'product-specific' : 'generic-fallback',
      ].join(','),
    ),
  ].join('\n');
  const csvHref = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;

  return (
    <Shell>
      <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Every SKU’s permanent “How to apply” URL, plus a QR image encoding that exact URL. Codes are
        generated here on demand — nothing is printed or attached to orders automatically. Packing
        inserts and label printing are still a manual warehouse step.
      </p>
      <p className="mt-3 text-sm text-muted-foreground">
        {specific} of {targets.length} SKUs have their own written directions. The rest show general
        routine-step guidance and are marked below.
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
          <li key={t.slug} className="flex items-center gap-5 border-b border-border py-5">
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
              {!t.productSpecific && (
                <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-primary">
                  Generic directions — needs brand copy
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
