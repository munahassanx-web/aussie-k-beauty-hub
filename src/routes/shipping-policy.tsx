import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/shipping-policy")({
  head: () => ({
    meta: [
      { title: "Shipping Policy — Skin Grocer" },
      { name: "description", content: "Australia Post delivery within Australia, with free standard shipping from A$100 and tracking on every order." },
      { property: "og:title", content: "Shipping Policy — Skin Grocer" },
      { property: "og:description", content: "Australia Post delivery within Australia, with free standard shipping from A$100 and tracking on every order." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://skingrocer.com.au/shipping-policy" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://skingrocer.com.au/shipping-policy" }],
  }),
  component: ShippingPolicy,
});

function ShippingPolicy() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <p className="text-center text-xs uppercase tracking-[0.2em] text-primary">Delivery</p>
      <h1 className="mt-4 text-center text-5xl text-foreground md:text-7xl">Shipping Policy</h1>

      <div className="mt-16 space-y-12">
        <section>
          <h2 className="font-display text-2xl text-foreground">Where we ship from</h2>
          <p className="mt-3 text-muted-foreground">All orders are dispatched from our warehouse in Epping, Victoria.</p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">Dispatch times</h2>
          <p className="mt-3 text-muted-foreground">
            We aim to dispatch orders placed before 12pm Melbourne time on the same business day. Orders placed after
            the cutoff, on weekends or on Victorian public holidays are normally processed on the next business day.
            Dispatch may take longer during launches, promotions and unusually busy periods.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">Delivery times</h2>
          <p className="mt-3 text-muted-foreground">
            Delivery times depend on the destination postcode and the Australia Post service selected at checkout.
            Estimates shown by Australia Post begin after dispatch and are not guaranteed.
          </p>
          <a
            href="https://auspost.com.au/parcels-mail/calculate-postage-delivery-times/"
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block text-primary underline underline-offset-4 hover:no-underline"
          >
            Check current Australia Post delivery estimates
          </a>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">Shipping cost</h2>
          <p className="mt-3 text-muted-foreground">
            Free standard delivery applies to orders of A$100 or more. Orders under A$100 have a flat A$9.95 standard
            delivery charge. Prices include GST where applicable.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">Delivery area</h2>
          <p className="mt-3 text-muted-foreground">We currently deliver to Australian addresses only.</p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">Order tracking</h2>
          <p className="mt-3 text-muted-foreground">
            Every order ships with Australia Post tracking. Once your order is dispatched, you'll receive a tracking link by email. You can also check order status anytime at the{" "}
            <Link to="/track" className="text-primary underline underline-offset-4 hover:no-underline">
              Track your order
            </Link>{" "}
            page.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">Address accuracy</h2>
          <p className="mt-3 text-muted-foreground">
            Customers are responsible for checking their delivery details before payment. Contact us immediately if an
            address is incorrect. We cannot guarantee changes after an order has entered processing or been transferred
            to Australia Post. Additional postage may apply if a parcel is returned because the address supplied was
            incomplete or incorrect.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">Delays</h2>
          <p className="mt-3 text-muted-foreground">
            Carrier delays, severe weather, public holidays and high-volume periods may affect delivery. If tracking has
            not updated within the expected timeframe, contact us with your Skin Grocer order number.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">Questions</h2>
          <p className="mt-3 text-muted-foreground">
            Email{" "}
            <a href="mailto:customercare@skingrocer.com.au" className="text-primary underline underline-offset-4 hover:no-underline">
              customercare@skingrocer.com.au
            </a>{" "}
            with your order number and we'll help.
          </p>
        </section>

        <p className="border-t border-border pt-6 text-sm text-muted-foreground">Last updated: 16 September 2026</p>
      </div>
    </div>
  );
}
