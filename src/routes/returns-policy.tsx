import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/returns-policy")({
  head: () => ({
    meta: [
      { title: "Returns & Refund Policy — Skin Grocer" },
      { name: "description", content: "30-day change-of-mind returns, Australian Consumer Law protections, and our glow-or-refund guarantee on personally recommended routines." },
      { property: "og:title", content: "Returns & Refund Policy — Skin Grocer" },
      { property: "og:description", content: "30-day change-of-mind returns, Australian Consumer Law protections, and our glow-or-refund guarantee." },
      { property: "og:url", content: "https://skingrocer.com.au/returns-policy" },
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

      <div className="mt-16 space-y-12">
        <section>
          <h2 className="font-display text-2xl text-foreground">Your rights under Australian Consumer Law</h2>
          <p className="mt-3 text-muted-foreground">
            Nothing in this policy limits your rights under the Australian Consumer Law. If a product you receive is faulty, not as described, or arrives damaged, you're entitled to a repair, replacement or refund regardless of the timeframes below — contact us and we'll sort it out.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">Change of mind — 30 days</h2>
          <p className="mt-3 text-muted-foreground">
            If you simply change your mind, you can return any unopened, unused product in its original packaging within 30 days of delivery for a refund or exchange. The item needs to be in resaleable condition. Email{" "}
            <a href="mailto:hello@skingrocer.com.au" className="text-primary underline underline-offset-4 hover:no-underline">
              hello@skingrocer.com.au
            </a>{" "}
            with your order number to start a return. Return shipping for change-of-mind returns is at your own cost unless the item arrived faulty or incorrect.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">Our glow-or-refund guarantee</h2>
          <p className="mt-3 text-muted-foreground">
            If you followed a routine we personally recommended (through the skin quiz or direct advice) and it didn't work for your skin, we'll make it right within 30 days of delivery — even if the product's been opened. Email{" "}
            <a href="mailto:hello@skingrocer.com.au" className="text-primary underline underline-offset-4 hover:no-underline">
              hello@skingrocer.com.au
            </a>{" "}
            with your order number and a note on what didn't work.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">Faulty, damaged or incorrect items</h2>
          <p className="mt-3 text-muted-foreground">
            If something arrives faulty, damaged in transit, or isn't what you ordered, email us within 30 days with your order number and a photo of the issue. We'll cover return shipping and send a replacement or refund, your choice.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">How refunds are processed</h2>
          <p className="mt-3 text-muted-foreground">
            Approved refunds are issued to your original payment method via Stripe. Please allow 5–10 business days for the refund to appear, depending on your bank.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">What can't be returned</h2>
          <p className="mt-3 text-muted-foreground">
            For hygiene reasons, we can't accept change-of-mind returns on opened skincare unless it falls under the glow-or-refund guarantee above.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground">Questions</h2>
          <p className="mt-3 text-muted-foreground">
            Email{" "}
            <a href="mailto:hello@skingrocer.com.au" className="text-primary underline underline-offset-4 hover:no-underline">
              hello@skingrocer.com.au
            </a>{" "}
            with your order number and we'll walk you through it.
          </p>
        </section>
      </div>
    </div>
  );
}
