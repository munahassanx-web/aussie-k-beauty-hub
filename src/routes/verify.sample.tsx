import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/verify/sample')({
  head: () => ({ meta: [
    { title: 'Sample verification record — Skin Grocer' },
    { name: 'description', content: 'See a fictional example of the receiving and packaging checks documented for a Skin Grocer parcel.' },
    { property: 'og:title', content: 'Sample verification record — Skin Grocer' },
    { property: 'og:description', content: 'A fictional demonstration of a Skin Grocer parcel verification record.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary' },
  ] }),
  component: SampleRecord,
});

const SAMPLE_ITEMS = [
  { brand: 'DEMO BRAND', name: 'Example Barrier Cream', size: '50ml', quantity: '1', supplier: 'UMMA', received: '20 August 2026', checked: '22 August 2026', batch: 'DEMO-A17K', dateLabel: 'Expiry date', date: '30 June 2029', seal: 'Outer carton intact; closure seal present and intact', condition: 'No visible damage recorded' },
  { brand: 'SAMPLE LAB', name: 'Example Hydrating Toner', size: '200ml', quantity: '2', supplier: 'Seoul4PM', received: '20 August 2026', checked: '22 August 2026', batch: 'SAMPLE-L042', dateLabel: 'Manufactured date', date: '14 July 2026', seal: 'Bottle closure intact; packaging clean', condition: 'No visible leakage or damage recorded' },
];

function Field({ label, value }: { label: string; value: string }) {
  return <div className="border-t border-border/70 py-3"><dt className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{label}</dt><dd className="mt-1 text-sm leading-relaxed text-foreground">{value}</dd></div>;
}

function SampleRecord() {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto h-px w-14 bg-primary/50" />
      <header className="mt-8 text-center">
        <p className="text-[11px] uppercase tracking-[0.28em] text-primary">Example only — not a customer order</p>
        <h1 className="mt-4 font-display text-3xl leading-tight text-foreground sm:text-4xl">Sample verification record</h1>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">This fictional demonstration shows the information a genuine QR-linked record can contain. It has no customer, order or payment information.</p>
      </header>
      <dl className="mt-10 grid border-y border-border sm:grid-cols-2 sm:gap-x-8">
        <Field label="Verification reference" value="SG-DEMO-7K2M" /><Field label="Record status" value="Example — not a live record" /><Field label="Parcel checked date" value="22 August 2026" /><Field label="Products checked" value="2" /><Field label="Checked in" value="Melbourne, Australia" /><Field label="Record version / updated" value="Version 1 · 22 August 2026" />
      </dl>
      <section className="mt-12" aria-labelledby="products-heading">
        <h2 id="products-heading" className="font-display text-2xl text-foreground sm:text-3xl">Products verified in this parcel</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">This record shows the receiving and packaging checks documented by Skin Grocer for the products included in this parcel. It is not laboratory testing or independent certification.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {SAMPLE_ITEMS.map((item) => (
            <article key={item.name} className="border border-border bg-secondary/30 p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">Example only — not linked to a customer order</p>
              <p className="mt-5 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{item.brand}</p>
              <h3 className="mt-1 font-display text-xl text-foreground">{item.name}</h3>
              <dl className="mt-4"><Field label="Size" value={item.size} /><Field label="Quantity" value={item.quantity} /><Field label="Supplier" value={item.supplier} /><Field label="Date received in Melbourne" value={item.received} /><Field label="Date Skin Grocer checked it" value={item.checked} /><Field label="Batch or lot code" value={item.batch} /><Field label={item.dateLabel} value={item.date} /><Field label="Packaging and seal status" value={item.seal} /><Field label="Product condition" value={item.condition} /><Field label="Final verification status" value="Checked before dispatch" /></dl>
              <Link to="/contact" search={{ verification: 'SG-DEMO-7K2M', product: `${item.brand} ${item.name}` }} className="mt-4 inline-flex min-h-11 items-center text-sm font-medium text-foreground underline underline-offset-4 hover:text-primary">Report a concern about this product</Link>
            </article>
          ))}
        </div>
      </section>
      <section className="mt-10 border border-border bg-secondary/50 p-5">
        <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">What &ldquo;verified&rdquo; means</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">&ldquo;Verified by Skin Grocer&rdquo; means the batch completed Skin Grocer&rsquo;s documented receiving and verification procedure. It does not mean the product was laboratory tested or independently certified unless the record explicitly states otherwise. Packaging can change when a brand reformulates or redesigns a product, so a difference does not automatically mean a product is counterfeit — we investigate concerns against our supplier, receiving and verification records.</p>
      </section>
      <div className="mt-10 text-center"><Link to="/about" className="text-[12px] font-semibold uppercase tracking-[0.2em] text-foreground underline underline-offset-4 hover:text-primary">How we source and verify →</Link></div>
    </main>
  );
}