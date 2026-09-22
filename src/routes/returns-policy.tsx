import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/returns-policy")({
  head: () => ({
    meta: [
      { title: "Returns & Refund Policy — Skin Grocer" },
      { name: "description", content: "Skin Grocer change-of-mind returns, Australian Consumer Law rights, product concerns and order cancellations." },
      { property: "og:title", content: "Returns & Refund Policy — Skin Grocer" },
      { property: "og:description", content: "Skin Grocer change-of-mind returns, Australian Consumer Law rights, product concerns and order cancellations." },
      { property: "og:url", content: "https://skingrocer.com.au/returns-policy" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://skingrocer.com.au/returns-policy" }],
  }),
  component: ReturnsPolicy,
});

function ReturnsPolicy() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <p className="text-center text-xs uppercase tracking-[0.2em] text-primary">After purchase</p>
      <h1 className="mt-4 text-center text-5xl text-foreground md:text-7xl">Returns & Refund Policy</h1>
      <p className="mt-5 text-center text-sm text-muted-foreground">Last updated: 22 September 2026</p>

      <div className="mt-16 space-y-12">
        <section>
          <h2 className="font-display text-2xl text-foreground">Your rights under Australian Consumer Law</h2>
          <p className="mt-3 text-muted-foreground">
            Nothing in this policy excludes or limits rights that cannot legally be excluded under the Australian Consumer Law. If a product does not meet a consumer guarantee, the remedy available depends on the nature and seriousness of the problem. For a major problem, you may be entitled to choose a refund or replacement. For a minor problem, Skin Grocer may first provide an appropriate remedy within a reasonable time. We may assess the product and request reasonable proof of purchase and information about the issue before confirming a remedy.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">Change of mind — 30 days</h2>
          <p className="mt-3 text-muted-foreground">
            If you simply change your mind, you can request a return within 30 days of delivery if the product is unopened, unused, undamaged, in its original packaging and in saleable condition. Email{" "}
            <a href="mailto:customercare@skingrocer.com.au" className="text-primary underline underline-offset-4 hover:no-underline">
              customercare@skingrocer.com.au
            </a>{" "}
            with your order number to request a return. Return shipping for an approved change-of-mind return is at your own cost.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">Faulty, damaged, incorrect or not-as-described products</h2>
          <p className="mt-3 text-muted-foreground">
            Contact us as soon as reasonably possible at{" "}
            <a href="mailto:customercare@skingrocer.com.au" className="text-primary underline underline-offset-4 hover:no-underline">
              customercare@skingrocer.com.au
            </a>{" "}
            if a product is faulty, damaged, incorrect or not as described. Please provide:
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
            <li>Your order number</li>
            <li>The product name</li>
            <li>A description of the issue</li>
            <li>Photographs where reasonably available</li>
            <li>The batch or lot code where available</li>
          </ul>
          <p className="mt-4 text-muted-foreground">
            Skin Grocer may assess the product before confirming the appropriate remedy. Your rights and the available remedy are determined under the Australian Consumer Law and are not limited by the change-of-mind period above.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">Opened products and skin reactions</h2>
          <p className="mt-3 text-muted-foreground">
            For hygiene reasons, opened or used products cannot be returned for change of mind. Skincare suitability varies between individuals. A sensitivity or reaction does not automatically mean a product is faulty. If you experience significant discomfort, stop using the product and contact us so we can record the concern and explain the available next steps. This does not affect rights available under the Australian Consumer Law.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">Order cancellations</h2>
          <p className="mt-3 text-muted-foreground">
            If you need to cancel an order, contact us as soon as possible. We will try to help, but cancellation cannot be guaranteed after an order has entered processing. Once an order has been dispatched, it cannot be cancelled and any return must follow this policy. This does not limit rights available under the Australian Consumer Law.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">How refunds are processed</h2>
          <p className="mt-3 text-muted-foreground">
            Approved refunds are issued to your original payment method via Stripe. Please allow 5–10 business days for the refund to appear, depending on your bank.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">Questions</h2>
          <p className="mt-3 text-muted-foreground">
            Email{" "}
            <a href="mailto:customercare@skingrocer.com.au" className="text-primary underline underline-offset-4 hover:no-underline">
              customercare@skingrocer.com.au
            </a>{" "}
            with your order number and we'll walk you through it.
          </p>
        </section>
      </div>
    </div>
  );
}
