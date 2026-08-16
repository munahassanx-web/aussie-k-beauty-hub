import { createFileRoute, Link } from "@tanstack/react-router";
import { FaqSection } from "@/components/faq-section";
import { FAQ_PAGE_FAQS, faqJsonLd } from "@/lib/faqs";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Korean Skincare Questions Answered | Skin Grocer" },
      {
        name: "description",
        content:
          "Answers to the most common questions about Korean skincare, authenticity, delivery across Australia, the Restock Club points system and Subscribe & Save.",
      },
      { property: "og:title", content: "FAQ — Korean Skincare Questions Answered | Skin Grocer" },
      {
        property: "og:description",
        content:
          "Routines, ingredients, authenticity, delivery, loyalty points and Subscribe & Save — answered plainly by Skin Grocer.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
    scripts: [faqJsonLd(FAQ_PAGE_FAQS)],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <div>
      <div className="mx-auto max-w-3xl px-6 pt-24 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-primary">Help centre</p>
        <h1 className="mt-4 text-5xl text-foreground md:text-7xl">Frequently asked questions</h1>
        <p className="mt-6 text-muted-foreground">
          Everything Australians ask us about Korean skincare — routines, ingredients, authenticity,
          delivery, rewards and subscriptions.
        </p>
      </div>

      <FaqSection
        id="faq-all"
        eyebrow="Common questions"
        title="Korean skincare, answered plainly."
        items={FAQ_PAGE_FAQS}
      />

      <section className="bg-sand">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <h2 className="font-display text-2xl text-foreground">Need the full detail?</h2>
          <p className="mt-3 text-muted-foreground">
            Our policy pages cover shipping, returns and privacy in full.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/shipping-policy"
              className="rounded-full border border-border bg-background px-5 py-2.5 text-sm text-foreground hover:border-primary hover:text-primary"
            >
              Shipping Policy
            </Link>
            <Link
              to="/returns-policy"
              className="rounded-full border border-border bg-background px-5 py-2.5 text-sm text-foreground hover:border-primary hover:text-primary"
            >
              Returns &amp; Refund Policy
            </Link>
            <Link
              to="/privacy-policy"
              className="rounded-full border border-border bg-background px-5 py-2.5 text-sm text-foreground hover:border-primary hover:text-primary"
            >
              Privacy Policy
            </Link>
          </div>
          <p className="mt-8 text-sm text-muted-foreground">
            Still stuck?{" "}
            <Link to="/contact" className="text-primary underline underline-offset-4 hover:no-underline">
              Contact our team
            </Link>{" "}
            — we reply within one business day.
          </p>
        </div>
      </section>
    </div>
  );
}
