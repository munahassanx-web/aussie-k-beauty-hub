import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/shipping-policy")({
  head: () => ({
    meta: [
      { title: "Shipping Policy — Skin Grocer" },
      { name: "description", content: "Australia-wide shipping from our Melbourne warehouse. Free express over A$80, same-day dispatch before 12pm, and tracking on every order." },
      { property: "og:title", content: "Shipping Policy — Skin Grocer" },
      { property: "og:description", content: "Australia-wide shipping from our Melbourne warehouse. Free express over A$80, same-day dispatch before 12pm." },
      { property: "og:url", content: "/shipping-policy" },
    ],
    links: [{ rel: "canonical", href: "/shipping-policy" }],
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
            Orders placed before 12pm AEST/AEDT on a business day are dispatched the same day. Orders placed after 12pm, or on a weekend/public holiday, are dispatched the next business day.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">Delivery times</h2>
          <p className="mt-3 text-muted-foreground">
            Metro Melbourne, Sydney, Canberra, Adelaide and Brisbane — typically next business day after dispatch. Regional areas, WA and NT — typically 2–5 business days after dispatch. These are typical timeframes based on our carrier's standard service, not guarantees.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">Shipping cost</h2>
          <p className="mt-3 text-muted-foreground">
            Free express shipping on orders over A$80. Orders under A$80 ship for a flat A$9.95. All prices shown at checkout include GST.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">Order tracking</h2>
          <p className="mt-3 text-muted-foreground">
            Once your order is dispatched, you'll receive a tracking link by email. You can also check order status anytime at the{" "}
            <Link to="/track" className="text-primary underline underline-offset-4 hover:no-underline">
              Track your order
            </Link>{" "}
            page.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">Address accuracy</h2>
          <p className="mt-3 text-muted-foreground">
            Please double-check your delivery address at checkout — we can't redirect a parcel once it's with the carrier, and re-delivery due to an incorrect address may incur an additional shipping fee.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">Questions</h2>
          <p className="mt-3 text-muted-foreground">
            Email{" "}
            <a href="mailto:hello@skingrocer.com.au" className="text-primary underline underline-offset-4 hover:no-underline">
              hello@skingrocer.com.au
            </a>{" "}
            with your order number and we'll help.
          </p>
        </section>
      </div>
    </div>
  );
}
