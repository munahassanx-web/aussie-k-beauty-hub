import { createFileRoute, Link, useSearch } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { useState } from 'react';

import { submitStockRequest } from '@/lib/stock-request.functions';
import { stockRequestSchema } from '@/lib/stock-request';
import { WATCHLIST_RANKING, RANKING_SNAPSHOT_DATE } from '@/lib/korea-rankings';

const searchSchema = (search: Record<string, unknown>): { brand?: string; product?: string } => ({
  brand: typeof search['brand'] === 'string' ? search['brand'].slice(0, 120) : undefined,
  product: typeof search['product'] === 'string' ? search['product'].slice(0, 200) : undefined,
});

export const Route = createFileRoute('/stock-request')({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: 'Ask us to stock it — Skin Grocer' },
      {
        name: 'description',
        content:
          'Tell Skin Grocer which Korean skincare product you want us to bring into Melbourne. We log every request, review them weekly, and email you first if it lands.',
      },
      { property: 'og:title', content: 'Ask us to stock it — Skin Grocer' },
      { property: 'og:description', content: 'Request a Korean product we do not stock yet. We email you if it lands.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
      { property: 'og:url', content: 'https://skingrocer.com.au/stock-request' },
    ],
    links: [{ rel: 'canonical', href: 'https://skingrocer.com.au/stock-request' }],
  }),
  component: StockRequestPage,
});

type Field = 'email' | 'name' | 'productBrand' | 'productName' | 'note';

function StockRequestPage() {
  const search = useSearch({ from: '/stock-request' });
  const submit = useServerFn(submitStockRequest);

  const [form, setForm] = useState({
    email: '',
    name: '',
    productBrand: search.brand ?? '',
    productName: search.product ?? '',
    note: '',
  });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [emailed, setEmailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const update = (field: Field, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      email: form.email,
      name: form.name || undefined,
      productBrand: form.productBrand || undefined,
      productName: form.productName,
      note: form.note || undefined,
      source: 'shop_watchlist',
    };
    const parsed = stockRequestSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<Field, string>> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path[0] as Field;
        if (!fieldErrors[path]) fieldErrors[path] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setStatus('loading');
    setErrorMessage('');
    try {
      const result = await submit({ data: parsed.data });
      setEmailed(Boolean(result?.emailed));
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <Shell>
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Sourcing desk</p>
        <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3rem)] leading-tight text-foreground">
          Request logged.
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
          {emailed
            ? `We've sent a confirmation to ${form.email}. Our buyer reviews requests weekly against the Korean ranking — if this one lands in Melbourne, that address hears first.`
            : `We've saved your request against ${form.email}. Our confirmation email couldn't go out just now, but the request is on the buyer's list and we'll be in touch if it lands.`}
        </p>
        <div className="mt-8 flex flex-wrap gap-6">
          <Link
            to="/shop"
            className="inline-flex min-h-11 items-center border-b border-border text-sm text-foreground hover:border-primary hover:text-primary"
          >
            Shop what's in stock
          </Link>
          <button
            type="button"
            onClick={() => {
              setForm({ email: form.email, name: form.name, productBrand: '', productName: '', note: '' });
              setStatus('idle');
            }}
            className="inline-flex min-h-11 items-center border-b border-border text-sm text-foreground hover:border-primary hover:text-primary"
          >
            Request another product
          </button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <header>
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Sourcing desk <span className="ml-3 opacity-60">입고 요청</span>
        </p>
        <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3rem)] leading-tight text-foreground">
          Ask us to stock it
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Seen something ranking in Korea that isn't on our shelf? Tell us. Every request is logged and reviewed weekly
          by our buyer against the Hwahae board (snapshot {RANKING_SNAPSHOT_DATE}) and what we can realistically land in
          Melbourne. We can't promise a date — we can promise you'll hear first if it arrives.
        </p>
      </header>

      <form onSubmit={handleSubmit} noValidate className="mt-10 max-w-xl border-t border-border pt-8">
        <Field2 label="Product" error={errors.productName}>
          <input
            value={form.productName}
            onChange={(e) => update('productName', e.target.value)}
            list="watchlist-products"
            placeholder="e.g. Anua PDRN Hyaluronic Acid Capsule 100 Serum"
            className="w-full border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
          />
          <datalist id="watchlist-products">
            {WATCHLIST_RANKING.map((e) => (
              <option key={`${e.brand}-${e.name}`} value={e.name}>
                {e.brand}
              </option>
            ))}
          </datalist>
        </Field2>

        <Field2 label="Brand (optional)" error={errors.productBrand}>
          <input
            value={form.productBrand}
            onChange={(e) => update('productBrand', e.target.value)}
            placeholder="e.g. Anua"
            className="w-full border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
          />
        </Field2>

        <Field2 label="Your name (optional)" error={errors.name}>
          <input
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            autoComplete="name"
            className="w-full border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
          />
        </Field2>

        <Field2 label="Email" error={errors.email}>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
          />
        </Field2>

        <Field2 label="Anything else (optional)" error={errors.note}>
          <textarea
            value={form.note}
            onChange={(e) => update('note', e.target.value)}
            rows={4}
            placeholder="Size, shade, or why you want it — helps our buyer prioritise."
            className="w-full border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
          />
        </Field2>

        {status === 'error' && (
          <p role="alert" className="mt-4 text-sm text-destructive">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="mt-8 min-h-11 bg-foreground px-8 text-[11px] font-semibold uppercase tracking-[0.24em] text-background hover:opacity-90 disabled:opacity-60"
        >
          {status === 'loading' ? 'Sending…' : 'Send request'}
        </button>

        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          We use your email only to confirm this request and to tell you if the product lands. See our{' '}
          <Link to="/privacy-policy" className="underline underline-offset-4 hover:text-primary">
            privacy policy
          </Link>
          .
        </p>
      </form>
    </Shell>
  );
}

function Field2({
  label,
  error,
  children,
}: {
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <label className="mt-6 block first:mt-0">
      <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</span>
      <span className="mt-2 block">{children}</span>
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-4xl px-6 py-12 md:py-16">{children}</div>;
}
