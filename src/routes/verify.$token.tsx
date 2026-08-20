import { useEffect, useRef } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  getVerificationRecord,
  recordVerificationScan,
  type PublicVerification,
} from '@/lib/authenticity.functions';

/**
 * Public verification page. The token in the URL is the only credential; the
 * server hashes it and returns a safe DTO. Nothing here can expose the
 * customer, the order, tracking or money.
 */
export const Route = createFileRoute('/verify/$token')({
  loader: ({ params }) => getVerificationRecord({ data: { token: params.token } }),
  head: () => ({
    meta: [
      { title: 'Order verification record — Skin Grocer' },
      {
        name: 'description',
        content: 'Check the Skin Grocer verification record for the authenticity card included with your order.',
      },
      { name: 'robots', content: 'noindex, nofollow' },
      { property: 'og:title', content: 'Order verification record — Skin Grocer' },
      { property: 'og:description', content: 'Verified by Skin Grocer — sourcing and handling record for this order.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
    ],
  }),
  errorComponent: () => <Shell><NotValid state="unknown" /></Shell>,
  notFoundComponent: () => <Shell><NotValid state="unknown" /></Shell>,
  component: VerifyPage,
});

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-xl px-5 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto h-px w-14 bg-primary/50" />
      {children}
    </main>
  );
}

function dateAU(value: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
}

function NotValid({ state }: { state: 'revoked' | 'superseded' | 'unknown' }) {
  const copy =
    state === 'revoked'
      ? 'This card has been withdrawn by Skin Grocer and is no longer a valid verification record.'
      : state === 'superseded'
        ? 'This card has been replaced by a newer card for the same order, so it is no longer the active record.'
        : 'We could not match this code to a Skin Grocer verification record. Please check the reference printed on your card.';

  return (
    <section className="mt-10 text-center">
      <h1 className="font-display text-3xl text-foreground sm:text-4xl">No active verification record</h1>
      <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">{copy}</p>
      <p className="mt-8 text-sm text-muted-foreground">
        If you believe this is a mistake, contact{' '}
        <a href="mailto:customercare@skingrocer.com.au" className="underline underline-offset-4 hover:text-foreground">
          customercare@skingrocer.com.au
        </a>{' '}
        with your card reference.
      </p>
    </section>
  );
}

function VerifyPage() {
  const record = Route.useLoaderData() as PublicVerification;

  if (record.state !== 'valid') return <Shell><NotValid state={record.state} /></Shell>;

  const verified = dateAU(record.verifiedAt ?? record.issuedAt);
  const dispatched = dateAU(record.dispatchedAt);

  return (
    <Shell>
      <section className="mt-8 text-center">
        <p className="text-[11px] uppercase tracking-[0.28em] text-primary">Verified by Skin Grocer</p>
        <h1 className="mt-4 font-display text-3xl leading-tight text-foreground sm:text-4xl">
          Order verification record
        </h1>
        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          This card was issued by Skin Grocer for one specific order and checked by our team in Melbourne before the
          parcel was sealed. Below is exactly what we recorded.
        </p>
      </section>

      <dl className="mt-10 border-y border-border">
        <div className="flex items-baseline justify-between gap-4 border-b border-border/60 py-3.5">
          <dt className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Card reference</dt>
          <dd className="font-mono text-sm tracking-[0.1em] text-foreground">{record.cardRef}</dd>
        </div>
        {verified && (
          <div className="flex items-baseline justify-between gap-4 border-b border-border/60 py-3.5">
            <dt className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Verified</dt>
            <dd className="text-sm text-foreground">{verified}</dd>
          </div>
        )}
        {dispatched && (
          <div className="flex items-baseline justify-between gap-4 py-3.5">
            <dt className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Dispatched</dt>
            <dd className="text-sm text-foreground">{dispatched}</dd>
          </div>
        )}
      </dl>

      {record.items.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Products in this order</h2>
          <ul className="mt-4 divide-y divide-border border-y border-border">
            {record.items.map((item, i) => (
              <li key={`${item.productName}-${i}`} className="py-4">
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    {item.brand && (
                      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{item.brand}</p>
                    )}
                    <p className="mt-0.5 text-sm text-foreground">{item.productName}</p>
                  </div>
                  <span className="shrink-0 text-sm text-muted-foreground">× {item.quantity}</span>
                </div>
                {/* Batch / origin render only where evidence was recorded. */}
                {(item.batchCode || item.originCountry) && (
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {[item.batchCode ? `Batch ${item.batchCode}` : null, item.originCountry].filter(Boolean).join(' · ')}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {record.checks.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">What Skin Grocer checked</h2>
          <ul className="mt-4 space-y-3">
            {record.checks.map((check) => (
              <li key={check} className="flex items-start gap-3 text-sm leading-relaxed text-foreground">
                <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                <span>{check}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-10 border border-border bg-secondary/50 p-5">
        <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">What this record means</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          This is Skin Grocer&rsquo;s own sourcing and handling record for this order. It confirms the checks our team
          completed before dispatch. It is not a manufacturer certification, and we only show details we have actually
          recorded.
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          Questions?{' '}
          <a href="mailto:customercare@skingrocer.com.au" className="underline underline-offset-4 hover:text-foreground">
            customercare@skingrocer.com.au
          </a>
        </p>
      </section>
    </Shell>
  );
}
