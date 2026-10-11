import { createFileRoute, Link } from "@tanstack/react-router";
import { SkinQuizBanner } from "@/components/skin-quiz-banner";
import { lazy, Suspense, useEffect, useRef } from "react";
import { trackUi } from "@/lib/analytics";
import { useBuyNow } from "@/hooks/use-buy-now";
import { FaqSection } from "@/components/faq-section";
import { HOME_FAQS, faqJsonLd } from "@/lib/faqs";
import { Reveal } from "@/components/reveal";


import { GlassSkinHero, GlowWordBand } from "@/components/glass-skin-hero";
import { ProductShelf } from "@/components/product-shelf";
import { RoutineEdits } from "@/components/routine-edits";
import { ConcernNavigator } from "@/components/concern-navigator";
import { GlassSkinClubInvite } from "@/components/glass-skin-club-invite";
import authenticityCardV2 from "@/assets/authenticity-card-v2.webp.asset.json";
import batchCheckImage from "@/assets/authenticity-batch-check.jpg";

/**
 * Recurring-purchase "Restock" programme is not yet operational — keep the
 * section in the codebase but out of the public homepage bundle until it is
 * fully launched (see src/components/restock-cta.tsx for the launch checklist).
 */
const RESTOCK_FEATURE_ENABLED = false;
const RestockCta = lazy(() => import("@/components/restock-cta"));


const SITE_LOGO_URL =
  "https://skingrocer.com.au/__l5e/assets-v1/e71f3ca2-370b-42a2-bc13-d5609d11ac73/skin-grocer-logo.jpg";

/** Organization JSON-LD for Google's brand knowledge panel. */
function organizationJsonLd() {
  return {
    type: "application/ld+json" as const,
    children: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Skin Grocer",
      url: "https://skingrocer.com.au",
      logo: {
        "@type": "ImageObject",
        url: SITE_LOGO_URL,
      },
      sameAs: [],
    }),
  };
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Skin Grocer — Authentic Korean Skincare, Stocked in Melbourne" },
      { name: "description", content: "Authentic Korean skincare and premium imports, locally stocked in Melbourne and dispatched across Australia. Guided routines, plainly explained." },
      { property: "og:title", content: "Skin Grocer — Authentic Korean Skincare, Stocked in Melbourne" },
      { property: "og:description", content: "Authentic Korean skincare and premium imports, locally stocked in Melbourne and dispatched across Australia. Guided routines, plainly explained." },
      { property: "og:url", content: "https://skingrocer.com.au/" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://skingrocer.com.au/" }],
    scripts: [faqJsonLd(HOME_FAQS), organizationJsonLd()],
  }),
  component: HomePage,
});








function HomePage() {
  return (
    <div data-homepage-neutral>
      {/* 1. Product feature */}
      <GlassSkinHero />
      <GlowWordBand />
      {/* 2. The six-product Edit */}
      <ProductShelf />
      {/* The skin quiz, answerable right here */}
      <SkinQuizBanner />
      {/* 3. Trust strip */}
      <div id="skin-grocer-promise"><Promise /></div>
      {/* 4. Shop by need */}
      <Reveal><ConcernNavigator /></Reveal>
      {/* 5. Compact routine help */}
      <Reveal><RoutineEdits /></Reveal>
      {/* 6. One proof section */}
      <Reveal><ProvenanceCard /></Reveal>
      {/* 7. Community invitation */}
      <GlassSkinClubInvite />
      {RESTOCK_FEATURE_ENABLED && (
        <Suspense fallback={null}>
          <RestockCta />
        </Suspense>
      )}

      <FaqSection
        id="k-beauty-faq"
        eyebrow="Before you choose"
        title="Korean skincare, answered plainly."
        intro="A few useful answers on authenticity, routines, choosing products and what happens after your order arrives."

        items={HOME_FAQS}
        tone="sand"
      />
    </div>
  );
}

function Promise() {
  const items = [
    {
      num: "01",
      title: "Documented verification",
      line: "Each received batch follows Skin Grocer’s documented checking process.",
      to: "/about" as const,
    },
    {
      num: "02",
      title: "Stocked in Melbourne",
      line: "Orders are dispatched from Australian-held inventory.",
    },
    {
      num: "03",
      title: "Routine guidance included",
      line: "Clear instructions explain where each product belongs and how to introduce it.",
      to: "/consultation" as const,
    },
    {
      num: "04",
      title: "Free standard delivery from A$100",
      line: "Available on eligible Australian orders.",
      to: "/shipping-policy" as const,
    },
  ];
  const ref = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const seen = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const id = (e.target as HTMLElement).dataset["trustId"];
          if (e.isIntersecting && id && !seen.has(id)) {
            seen.add(id);
            trackUi("homepage_trust_item_view", { item: id });
          }
        }
      },
      { threshold: 0.6 },
    );
    el.querySelectorAll("[data-trust-id]").forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  return (
    <section className="border-b border-border/60 bg-paper" aria-label="Why shop with Skin Grocer">
      <div className="mx-auto max-w-7xl px-6">
        <ul
          ref={ref}
          className="grid grid-cols-2 md:grid-cols-4"
        >
          {items.map((item, index) => (
            <li
              key={item.num}
              data-trust-id={item.num}
              className={[
                "border-ink/10 px-4 py-7 first:md:pl-0 last:md:pr-0 md:px-8 md:py-9",
                index > 0 ? "border-l" : "",
                index >= 2 ? "border-t md:border-t-0" : "",
                index === 2 ? "md:border-l" : "",
              ].join(" ")}
            >
              <p className="text-[11px] font-semibold uppercase leading-snug tracking-[0.14em] text-ink md:tracking-[0.18em]">
                <span className="font-display text-[11px] italic font-normal tracking-normal text-ink/50">
                  {item.num}
                </span>
                <span aria-hidden="true" className="mx-1.5 text-ink/30">
                  ·
                </span>
                {item.to ? (
                  <Link
                    to={item.to}
                    className="-mx-1 rounded-[2px] px-1 py-0.5 underline-offset-4 transition-colors hover:text-hanbok-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hanbok-deep/50 focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                  >
                    {item.title}
                  </Link>
                ) : (
                  <span>{item.title}</span>
                )}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-ink/65">{item.line}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}


function ProvenanceCard() {
  const stages = [
    {
      k: "SOURCE",
      t: "ESTABLISHED KOREAN WHOLESALE PARTNERS",
      d: "We purchase through established Korean B2B suppliers and retain the commercial records connected to each order.",
    },
    {
      k: "RECEIVE",
      t: "STOCK RECEIVED IN MELBOURNE",
      d: "Stock is received into Skin Grocer’s Melbourne inventory before customer dispatch.",
    },
    {
      k: "VERIFY",
      t: "DOCUMENTED BATCH CHECK",
      d: "Each received batch follows Skin Grocer’s documented verification process before it enters the customer-facing inventory: supplier and purchase-record match, product and order match, visible packaging and seal review where the brand supplies a seal, product condition, batch or expiry information where supplied, and quantity reconciliation.",
    },
    {
      k: "CONNECT",
      t: "QR-LINKED VERIFICATION RECORD",
      d: "The QR code on your authenticity card opens the Skin Grocer verification record for that parcel: the checks completed, the date verified, the products covered, and any batch information supplied by the brand. It shows no personal, payment or order-value details.",
    },
  ];

  return (
    <section className="bg-ink text-paper">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 md:grid-cols-12 md:items-start md:gap-16">
        <div className="md:col-span-5">
          <Link
            to="/verify/sample"
            onClick={() => trackUi("authenticity_record_open", { from: "image" })}
            className="group block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink">
              <img
                src={authenticityCardV2.url}
                alt="A Skin Grocer authenticity card with a wax seal and a scannable QR code, resting among Korean skincare in original branded packaging"
                loading="lazy"
                width={1024}
                height={1280}
                className="h-full w-full object-cover object-left-bottom md:object-center"
              />
              <div className="absolute inset-0 bg-ink/10 transition-opacity group-hover:opacity-0" />
            </div>
          </Link>

          <Link
            to="/verify/sample"
            onClick={() => trackUi("authenticity_record_open", { from: "button" })}
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-paper/30 px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-paper transition hover:border-accent hover:text-accent"
          >
            View a verification record
            <span aria-hidden="true">→</span>
          </Link>
          <p className="mt-3 text-xs leading-relaxed text-paper/50">
            On your phone? Tap the link instead of scanning — it opens the same record.
          </p>

          <figure className="mt-8 overflow-hidden rounded-2xl">
            <img
              src={batchCheckImage}
              alt="Close-up of batch and expiry markings printed on original Korean skincare packaging."
              loading="lazy"
              width={1200}
              height={896}
              className="h-full w-full object-cover"
            />
            <figcaption className="mt-3 text-xs leading-relaxed text-paper/50">
              Batch and expiry markings are checked against the purchase record before stock is
              released for dispatch.
            </figcaption>
          </figure>
        </div>

        <div className="md:col-span-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
            AUTHENTICITY, WITHOUT THE GUESSWORK
          </p>
          <h2 className="mt-4 font-display text-4xl leading-tight text-paper md:text-[2.75rem]">
            Every batch verified in Melbourne.
          </h2>
          <p className="mt-5 max-w-xl text-paper/70">
            Sourced from Korea. Verified in Melbourne. Dispatched to you. Here is exactly what that
            means, stage by stage.
          </p>

          <ol className="mt-10 grid border-l border-t border-paper/10 md:grid-cols-2">
            {stages.map((s, i) => (
              <li key={s.k} className="border-b border-r border-paper/10 px-5 py-6 md:px-6 md:py-7">
                <span className="font-display text-xs italic text-paper/65">
                  {String(i + 1).padStart(2, "0")} — {s.k}
                </span>
                <p className="mt-2 font-display text-sm uppercase tracking-[0.14em] text-paper">
                  {s.t}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-paper/60">{s.d}</p>
              </li>
            ))}
          </ol>

          <p className="mt-6 max-w-xl text-xs leading-relaxed text-paper/45">
            A verification record documents the checks Skin Grocer completed on that batch. It is
            not a manufacturer certificate and does not replace brand or regulatory testing.
          </p>

          <Link
            to="/about"
            className="group mt-8 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-paper transition hover:text-accent"
          >
            <span className="border-b border-paper/30 pb-0.5 transition-colors group-hover:border-accent">
              Read our sourcing approach
            </span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}


