import { createFileRoute, Link } from '@tanstack/react-router';

/**
 * Public, keyboard-accessible sample of the Skin Grocer verification record.
 *
 * This exists so customers (and anyone reviewing the homepage authenticity
 * section) can see exactly what a scanned QR opens, without needing an order,
 * a login, or a phone to scan their own screen. It contains no customer,
 * supplier, pricing or internal information.
 */
export const Route = createFileRoute('/verify/sample')({
  head: () => ({
    meta: [
      { title: 'Sample verification record — Skin Grocer' },
      {
        name: 'description',
        content:
          'A public example of the Skin Grocer verification record a QR-linked authenticity card opens: what was checked, when, and how to raise a concern.',
      },
      { property: 'og:title', content: 'Sample verification record — Skin Grocer' },
      {
        property: 'og:description',
        content: 'See exactly what a Skin Grocer authenticity card QR opens before you order.',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
    ],
  }),
  component: SampleRecord,
});

const CHECKS = [
  'Supplier and purchase-record match',
  'Products in the parcel match the order',
  'Product identity matched to the Skin Grocer catalogue',
  'Visible packaging review, including seals where the brand supplies one',
  'Product condition and quantity reconciliation',
];

function SampleRecord() {
  return (
    <main className="mx-auto w-full max-w-xl px-5 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto h-px w-14 bg-primary/50" />

      <section className="mt-8 text-center">
        <p className="text-[11px] uppercase tracking-[0.28em] text-primary">
          Skin Grocer verification record
        </p>
        <h1 className="mt-4 font-display text-3xl leading-tight text-foreground sm:text-4xl">
          Sample verification record
        </h1>
        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          This is a public example, shown so you can see what the QR code on a Skin Grocer
          authenticity card opens. A real card opens the record for your own order, with the details
          our team recorded in Melbourne before your parcel was sealed.
        </p>
      </section>

      <dl className="mt-10 border-y border-border">
        {[
          ['Record type', 'Batch verification record'],
          ['Status', 'Example — not a live order record'],
          ['Card reference', 'SG-SAMPLE'],
          ['Date checked', '28 August 2026'],
          ['Received in Melbourne', '26 August 2026'],
        ].map(([k, v]) => (
          <div
            key={k}
            className="flex items-baseline justify-between gap-4 border-b border-border/60 py-3.5 last:border-b-0"
          >
            <dt className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{k}</dt>
            <dd className="text-sm text-foreground">{v}</dd>
          </div>
        ))}
      </dl>

      <section className="mt-10">
        <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          What Skin Grocer checked
        </h2>
        <ul className="mt-4 space-y-3">
          {CHECKS.map((c) => (
            <li key={c} className="flex items-start gap-3 text-sm leading-relaxed text-foreground">
              <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 border border-border bg-secondary/50 p-5">
        <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          What &ldquo;verified&rdquo; means
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          &ldquo;Verified by Skin Grocer&rdquo; means the batch completed Skin Grocer&rsquo;s
          documented receiving and verification procedure. It does not mean the product was
          laboratory tested or independently certified unless the record explicitly states
          otherwise. Packaging can change when a brand reformulates or redesigns a product, so a
          difference does not automatically mean a product is counterfeit — we investigate concerns
          against our supplier, receiving and verification records.
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          Something doesn&rsquo;t match?{' '}
          <a
            href="mailto:customercare@skingrocer.com.au"
            className="underline underline-offset-4 hover:text-foreground"
          >
            customercare@skingrocer.com.au
          </a>
        </p>
      </section>

      <div className="mt-10 text-center">
        <Link
          to="/about"
          className="text-[12px] font-semibold uppercase tracking-[0.2em] text-foreground underline underline-offset-4 hover:text-primary"
        >
          How we source and verify →
        </Link>
      </div>
    </main>
  );
}
