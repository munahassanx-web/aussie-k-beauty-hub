import { useEffect, useRef } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
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
    <main className="mx-auto w-full max-w-3xl px-5 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto h-px w-14 bg-primary/50" />
      {children}
    </main>
  );
}

function dateAU(value: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="border-t border-border/70 py-3"><dt className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{label}</dt><dd className="mt-1 text-sm leading-relaxed text-foreground">{value}</dd></div>;
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
  const { token } = Route.useParams();
  const scanned = useRef(false);

  // One visit = one scan. The ref survives StrictMode's double effect and any
  // re-render, and this only ever runs in the browser (never during SSR).
  useEffect(() => {
    if (record.state !== 'valid' || scanned.current) return;
    scanned.current = true;
    void recordVerificationScan({ data: { token } }).catch(() => {});
  }, [record.state, token]);

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

      <dl className="mt-10 grid border-y border-border sm:grid-cols-2 sm:gap-x-8">
        <Detail label="Verification reference" value={record.cardRef} />
        <Detail label="Record status" value={record.status} />
        <Detail label="Parcel checked date" value={verified ?? 'Not recorded'} />
        <Detail label="Products checked" value={String(record.items.length)} />
        <Detail label="Checked in" value="Melbourne, Australia" />
        <Detail label="Record version / last updated" value={`Version ${record.version} · ${dateAU(record.updatedAt) ?? 'Not recorded'}`} />
        {dispatched && <Detail label="Dispatched" value={dispatched} />}
      </dl>

      {record.items.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-2xl text-foreground sm:text-3xl">Products verified in this parcel</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">This record shows the receiving and packaging checks documented by Skin Grocer for the products included in this parcel. It is not laboratory testing or independent certification.</p>
          <div className="mt-6 grid gap-4">
            {record.items.map((item, i) => (
              <article key={`${item.productName}-${i}`} className="border border-border bg-secondary/30 p-5">
                {item.brand && <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{item.brand}</p>}
                <h3 className="mt-1 font-display text-xl text-foreground">{item.productName}</h3>
                <dl className="mt-4">
                  {item.size && <Detail label="Size" value={item.size} />}<Detail label="Quantity" value={String(item.quantity)} />
                  {item.supplier && <Detail label="Supplier" value={item.supplier} />}
                  {item.receivedInMelbourneOn && <Detail label="Date received in Melbourne" value={dateAU(item.receivedInMelbourneOn) ?? item.receivedInMelbourneOn} />}
                  {item.checkedOn && <Detail label="Date Skin Grocer checked it" value={dateAU(item.checkedOn) ?? item.checkedOn} />}
                  {item.batchCode && <Detail label="Batch or lot code" value={item.batchCode} />}
                  {item.printedDateType && item.printedDate && <Detail label={item.printedDateType} value={dateAU(item.printedDate) ?? item.printedDate} />}
                  {item.packagingSealStatus && <Detail label="Packaging and seal status" value={item.packagingSealStatus} />}
                  {item.productCondition && <Detail label="Product condition" value={item.productCondition} />}
                  <Detail label="Final verification status" value={item.verificationStatus} />
                </dl>
                <Link to="/contact" search={{ verification: record.cardRef, product: `${item.brand ? `${item.brand} ` : ''}${item.productName}` }} className="mt-4 inline-flex min-h-11 items-center text-sm font-medium text-foreground underline underline-offset-4 hover:text-primary">Report a concern about this product</Link>
              </article>
            ))}
          </div>
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
        <p className="mt-4 text-sm text-muted-foreground"><Link to="/about" className="underline underline-offset-4 hover:text-foreground">How we source and verify</Link></p>
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
