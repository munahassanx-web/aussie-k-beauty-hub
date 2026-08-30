import { createFileRoute, Link } from "@tanstack/react-router";
import { RoutineFinderSection } from "@/components/routine-finder";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { trackUi } from "@/lib/analytics";
import { useBuyNow } from "@/hooks/use-buy-now";
import { FaqSection } from "@/components/faq-section";
import { HOME_FAQS, faqJsonLd } from "@/lib/faqs";
import { RoutineEducation } from "@/components/routine-education";
import { Reveal } from "@/components/reveal";
import { IngredientLibrary } from "@/components/ingredient-library";


import { AtmosHero } from "@/components/atmos-hero";
import { ProductShelf } from "@/components/product-shelf";
import { SeoulSignalStrip } from "@/components/seoul-signal";
import { KoreaRightNow } from "@/components/korea-right-now";
import { SHOP_PRODUCTS } from "@/lib/shop-catalog";
import { RoutineEdits } from "@/components/routine-edits";
import { ConcernNavigator } from "@/components/concern-navigator";
import { DailyRitualSection } from "@/components/daily-ritual";
import authenticityCardV2 from "@/assets/authenticity-card-v2.webp.asset.json";
import batchCheckImage from "@/assets/authenticity-batch-check.jpg";
import cabinetEdit from "@/assets/brand-cabinet-products.jpg";

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
    ],
    links: [{ rel: "canonical", href: "https://skingrocer.com.au/" }],
    scripts: [faqJsonLd(HOME_FAQS), organizationJsonLd()],
  }),
  component: HomePage,
});








function HomePage() {
  return (
    <div>
      <AtmosHero />
      <ProductShelf />
      <div id="skin-grocer-promise"><Promise /></div>
      <KoreaRightNow />
      <Reveal><RoutineEducation /></Reveal>
      <BrandMarquee />
      <IngredientLibrary />

      <Reveal><ProvenanceCard /></Reveal>
      <RoutineFinderSection />
      <Reveal><RoutineEdits /></Reveal>
      <Reveal><ConcernNavigator /></Reveal>
      <Reveal><WhyPillars /></Reveal>
      <DailyRitualSection />
      {RESTOCK_FEATURE_ENABLED && (
        <Suspense fallback={null}>
          <RestockCta />
        </Suspense>
      )}
      <Reveal><LearnStrip /></Reveal>
      <SeoulSignalStrip />
      <Reveal><CustomerNotes /></Reveal>

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

const WHY_JOURNEY = [
  "KOREAN SUPPLY PARTNER",
  "RECEIVED IN MELBOURNE",
  "SKIN GROCER CHECK",
  "QR VERIFICATION RECORD",
  "ROUTINE GUIDANCE",
];

const WHY_PROOF = [
  {
    n: "01",
    title: "Sourced through Korean supply partners",
    copy: "Products are purchased through approved Korean wholesale supply partners, with supplier and purchase records retained as part of our receiving process.",
  },
  {
    n: "02",
    title: "Checked when received in Melbourne",
    copy: "When stock arrives, our team reconciles the shipment against supplier records, product identity, quantity, visible packaging, condition and seals where the brand supplies them.",
    note: "This is a documented receiving check—not laboratory testing or independent certification.",
  },
  {
    n: "03",
    title: "A record you can actually open",
    copy: "Orders are sealed with a Skin Grocer authenticity card. Its QR code opens the verification record associated with that order and shows the details recorded by our Melbourne team.",
    cta: true,
  },
  {
    n: "04",
    title: "Guidance after your order arrives",
    copy: "Product-by-product guidance helps customers understand application order, frequency and where each purchase may fit within a routine.",
    note: "Cosmetic education only—not medical advice or diagnosis.",
  },
];

const SAMPLE_RECORD_FIELDS: [string, string][] = [
  ["Record type", "Batch verification record"],
  ["Status", "Example — not a live order record"],
  ["Card reference", "SG-SAMPLE"],
  ["Received in Melbourne", "26 August 2026"],
  ["Date checked", "28 August 2026"],
];

const SAMPLE_RECORD_CHECKS = [
  "Supplier and purchase-record match",
  "Product and order reconciliation",
  "Visible packaging and condition review",
];

/** Renders a genuine QR for the public sample record; no decorative placeholder. */
function SampleRecordQr() {
  const [qr, setQr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const url = `${window.location.origin}/verify/sample`;
    void import("qrcode").then(({ default: QRCode }) =>
      QRCode.toDataURL(url, { errorCorrectionLevel: "M", margin: 2, scale: 8 }).then((data) => {
        if (!cancelled) setQr(data);
      }),
    );
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex items-center gap-4">
      <div className="h-24 w-24 shrink-0 rounded-sm border border-ink/15 bg-white p-1.5">
        {qr ? (
          <img
            src={qr}
            alt="QR code linking to the Skin Grocer public sample verification record at /verify/sample"
            width={96}
            height={96}
            className="h-full w-full"
          />
        ) : (
          <div aria-hidden="true" className="h-full w-full bg-ink/5" />
        )}
      </div>
      <div className="text-sm leading-relaxed text-ink/70">
        <p className="font-semibold text-ink">Scan the public example</p>
        <Link
          to="/verify/sample"
          onClick={() => trackUi("authenticity_record_open", { from: "why_qr_link" })}
          className="mt-1 inline-block underline underline-offset-4 hover:text-hanbok-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-hanbok-deep"
        >
          Or open /verify/sample
        </Link>
      </div>
    </div>
  );
}

function WhyPillars() {
  return (
    <section className="relative overflow-hidden bg-paper" aria-labelledby="why-heading">
      <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">
            Why Skin Grocer
          </p>
          <h2 id="why-heading" className="display-section mt-4 text-ink">
            Know where it came from.{" "}
            <span className="italic text-hanbok-deep">Know what to do with it.</span>
          </h2>
          <p className="lede mt-5 text-ink/70">
            We created Skin Grocer to remove two common uncertainties from buying Korean skincare
            online: whether the product has travelled through a documented supply process, and how
            it belongs in your routine once it arrives.
          </p>
        </div>

        <div className="mt-14 grid gap-10 md:grid-cols-12 md:items-start md:gap-12">
          {/* Retained, founder-approved authenticity photograph */}
          <div className="md:col-span-5">
            <div className="overflow-hidden rounded-2xl bg-ink">
              <img
                src={authenticityCardV2.url}
                alt="A Skin Grocer authenticity card with a wax seal and a scannable QR code, resting among Korean skincare in original branded packaging"
                loading="lazy"
                width={1024}
                height={1280}
                className="h-full w-full object-cover"
              />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-ink/55">
              DOCUMENTED RECEIVING AND ORDER CHECK
            </p>
          </div>

          <div className="md:col-span-7">
            {/* Verification journey — vertical, never compressed to a hairline */}
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/60">
              The verification journey
            </h3>
            <ol className="mt-4 space-y-0">
              {WHY_JOURNEY.map((step, i) => (
                <li key={step}>
                  <div className="flex items-center gap-4 rounded-sm border border-ink/10 bg-white/60 px-4 py-3">
                    <span className="font-display text-sm italic text-hanbok-deep/50">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ink">
                      {step}
                    </span>
                  </div>
                  {i < WHY_JOURNEY.length - 1 && (
                    <div aria-hidden="true" className="py-1 pl-6 text-grocer-butter">
                      ↓
                    </div>
                  )}
                </li>
              ))}
            </ol>

            {/* Genuine sample record preview */}
            <div className="mt-10 rounded-sm border border-ink/15 bg-white p-6 shadow-[0_20px_50px_-40px_rgba(0,0,0,0.5)] transition-shadow motion-safe:hover:shadow-[0_28px_60px_-36px_rgba(0,0,0,0.55)]">
              <div className="h-px w-12 bg-grocer-butter" />
              <h3 className="mt-4 font-display text-xl text-ink">Sample verification record</h3>
              <dl className="mt-4 border-y border-ink/10">
                {SAMPLE_RECORD_FIELDS.map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-baseline justify-between gap-4 border-b border-ink/10 py-2.5 last:border-b-0"
                  >
                    <dt className="text-[11px] uppercase tracking-[0.16em] text-ink/60">{k}</dt>
                    <dd className="text-sm text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
              <ul className="mt-4 space-y-2">
                {SAMPLE_RECORD_CHECKS.map((c) => (
                  <li key={c} className="flex items-start gap-3 text-sm leading-relaxed text-ink/75">
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1 w-1 shrink-0 rounded-full bg-grocer-butter"
                    />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>

              <h4 className="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/60">
                What “verified by Skin Grocer” means
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                The batch completed Skin Grocer’s documented receiving and verification procedure.
                It does not mean the product was laboratory tested or independently certified unless
                the record specifically states otherwise.
              </p>

              <div className="mt-6 border-t border-ink/10 pt-6">
                <SampleRecordQr />
              </div>
            </div>
          </div>
        </div>

        {/* Four proof cards */}
        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_PROOF.map((p) => (
            <li
              key={p.n}
              className="flex flex-col rounded-sm border border-ink/12 bg-white/70 p-6 transition-colors hover:border-ink/30"
            >
              <span className="font-display text-2xl italic text-hanbok-deep/35">{p.n}</span>
              <h3 className="mt-3 font-display text-lg leading-snug text-ink">{p.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/70">{p.copy}</p>
              {p.note && <p className="mt-3 text-xs leading-relaxed text-ink/55">{p.note}</p>}
              {p.cta && (
                <div className="mt-4">
                  <Link
                    to="/verify/sample"
                    onClick={() => trackUi("authenticity_record_open", { from: "why_proof_card" })}
                    className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-hanbok-deep underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-hanbok-deep"
                  >
                    View a sample verification record
                    <span aria-hidden="true">→</span>
                  </Link>
                  <p className="mt-2 text-xs text-ink/55">
                    Public example · Not a live customer order
                  </p>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}






const CABINET_BRANDS: { name: string; knownFor: string }[] = [
  { name: "AESTURA", knownFor: "Barrier-focused moisturising care" },
  { name: "Beauty of Joseon", knownFor: "Traditional-inspired formulas with modern textures" },
  { name: "beplain", knownFor: "Gentle, uncomplicated daily skincare" },
  { name: "BIODANCE", knownFor: "Hydrating masks and comfort-focused care" },
  { name: "Dr.G", knownFor: "Skin-comfort and barrier-conscious formulas" },
  { name: "HARUHARU WONDER", knownFor: "Fermented ingredients and lightweight hydration" },
  { name: "ISNTREE", knownFor: "Ingredient-led hydration and everyday essentials" },
  { name: "MEDICUBE", knownFor: "Targeted formulas and texture-focused care" },
  { name: "ROUND LAB", knownFor: "Gentle hydration inspired by Korean regional ingredients" },
  { name: "S.NATURE", knownFor: "Comforting hydration for easily unsettled skin" },
  { name: "TIRTIR", knownFor: "Glow-focused skincare and complexion preparation" },
  { name: "TORRIDEN", knownFor: "Lightweight, layerable hydration" },
  { name: "WELLAGE", knownFor: "Hydration-focused ampoules and treatment textures" },
];

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function BrandMarquee() {
  const groups = new Map<string, { name: string; knownFor: string; count: number }[]>();
  for (const brand of [...CABINET_BRANDS].sort((a, b) =>
    a.name.localeCompare(b.name, "en", { sensitivity: "base" }),
  )) {
    const count = SHOP_PRODUCTS.filter((p) => p.brand.toLowerCase() === brand.name.toLowerCase()).length;
    if (count === 0) continue; // never link to an empty brand page
    const letter = brand.name[0]!.toUpperCase();
    const bucket = groups.get(letter) ?? [];
    bucket.push({ ...brand, count });
    groups.set(letter, bucket);
  }
  const letters = [...groups.keys()];

  // Place the curation callout after the first group that reaches five brands.
  let running = 0;
  let calloutAfter = letters[letters.length - 1];
  for (const l of letters) {
    running += groups.get(l)!.length;
    if (running >= 5) {
      calloutAfter = l;
      break;
    }
  }

  return (
    <section className="border-y border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <header className="grid gap-10 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.85fr)] md:items-end md:gap-16">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-ink/50">
              THE BRAND CABINET
            </p>
            <h2 className="mt-4 max-w-[18ch] font-display text-3xl leading-[1.05] text-ink md:text-5xl">
              The names shaping Korean skincare, <span className="italic">curated for your shelf.</span>
            </h2>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink/70">
              Meet the Korean brands we believe are worth knowing&mdash;selected for formulation quality,
              clear routine roles and products customers can realistically use and finish.
            </p>
            <Link
              to="/brands"
              className="group mt-7 inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-ink"
            >
              <span className="border-b border-ink/25 pb-1 transition-colors group-hover:border-[var(--stripe-gold)]">
                Browse all brands
              </span>
            </Link>
          </div>
          <figure className="m-0 md:pl-8">
            <div className="relative border border-border/60">
              <img
                src={cabinetEdit}
                alt="Editorial still life of five stocked Skin Grocer products: Beauty of Joseon Dynasty Cream, Haruharu Wonder Black Rice Hyaluronic Toner, Torriden Dive-In Serum, Medicube PDRN Pink Peptide Serum and Biodance Bio-Collagen Real Deep Mask"
                loading="lazy"
                decoding="async"
                width={1200}
                height={960}
                className="aspect-[4/3] w-full object-cover md:aspect-[5/4]"
              />
            </div>
            <figcaption className="mt-3 text-[10px] uppercase tracking-[0.24em] text-ink/45">
              The Skin Grocer Edit &middot; Beauty of Joseon, Haruharu Wonder, Torriden, Medicube, Biodance
            </figcaption>
          </figure>
        </header>

        {/* A–Z index */}
        <nav
          aria-label="Browse brands alphabetically"
          className="mt-12 -mx-6 overflow-x-auto px-6 md:mx-0 md:px-0"
        >
          <ul className="flex min-w-max items-center gap-x-3 border-y border-border/60 py-3 md:min-w-0 md:flex-wrap md:gap-x-5">
            {ALPHABET.map((l) => {
              const active = groups.has(l);
              return (
                <li key={l}>
                  {active ? (
                    <a
                      href={`#cabinet-${l}`}
                      className="block px-1 py-1 font-display text-[13px] tracking-[0.08em] text-ink underline-offset-[6px] transition-colors hover:text-[var(--stripe-gold)] hover:underline focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink"
                    >
                      {l}
                    </a>
                  ) : (
                    <span
                      aria-disabled="true"
                      className="block cursor-default px-1 py-1 font-display text-[13px] tracking-[0.08em] text-ink/20"
                    >
                      {l}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-4">
          {letters.map((letter) => (
            <div key={letter}>
              <section
                id={`cabinet-${letter}`}
                aria-labelledby={`cabinet-${letter}-label`}
                className="scroll-mt-32 border-b border-border/60 py-8 md:grid md:grid-cols-[6rem_minmax(0,1fr)] md:items-start md:gap-10 md:py-9"
              >
                <h3
                  id={`cabinet-${letter}-label`}
                  className="font-display text-4xl leading-none text-ink md:text-6xl"
                >
                  {letter}
                </h3>
                <ul className="mt-6 grid gap-x-12 gap-y-2 md:mt-1 lg:grid-cols-2">
                  {groups.get(letter)!.map((b) => (
                    <li key={b.name}>
                      <Link
                        to="/shop"
                        search={{ brand: b.name }}
                        className="group flex min-h-14 items-start justify-between gap-6 border-b border-border/40 py-4 transition-transform duration-300 hover:translate-x-1 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-ink lg:border-b-0 lg:py-3"
                      >
                        <span className="min-w-0">
                          <span className="block text-[17px] font-medium uppercase tracking-[0.1em] text-ink md:text-lg">
                            {b.name}
                          </span>
                          <span className="mt-1.5 block text-[13px] leading-relaxed text-ink/70">
                            {b.knownFor}
                          </span>
                          <span className="mt-1.5 block text-[10px] uppercase tracking-[0.2em] text-ink/45">
                            {b.count} {b.count === 1 ? "product" : "products"}
                          </span>
                        </span>
                        <span className="mt-1 shrink-0 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/55 transition-colors group-hover:text-[var(--stripe-gold)]">
                          Explore brand <span aria-hidden="true">→</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>

              {letter === calloutAfter && (
                <aside className="my-8 border border-border/60 bg-secondary/40 px-6 py-7 md:flex md:items-center md:justify-between md:gap-10 md:px-9">
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-ink/50">
                      Not sure where to begin?
                    </p>
                    <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink/75">
                      You don&rsquo;t need to recognise every Korean brand. Tell us what your skin needs
                      and we&rsquo;ll narrow the shelf.
                    </p>
                  </div>
                  <Link
                    to="/consultation"
                    className="mt-5 inline-flex min-h-11 items-center gap-2 border border-ink/30 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-background focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-ink md:mt-0 md:shrink-0"
                  >
                    Find my routine <span aria-hidden="true">→</span>
                  </Link>
                </aside>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}









function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}


function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <p className="font-display text-2xl text-ink">{n}</p>
      <p className="mt-1 leading-tight text-ink/60">{l}</p>
    </div>
  );
}

function LearnStrip() {
  const topics = [
    {
      num: "01",
      title: "BUILD A ROUTINE",
      line: "Understand the order, then keep only the steps that earn their place.",
      to: "/routines/",
    },
    {
      num: "02",
      title: "KNOW THE INGREDIENT",
      line: "A plain-English starting point for the names you keep seeing on the label.",
      to: "/learn/",
    },
    {
      num: "03",
      title: "USE IT WELL",
      line: "Learn where products fit and how to make your routine easier to follow.",
    },
  ];

  return (
    <section className="border-t border-border/60 bg-paper" aria-labelledby="learn-strip-heading">
      <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="grid gap-16 md:grid-cols-12 md:gap-10">
          {/* Heading block */}
          <div className="md:col-span-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">
              THE SKINGROCER EDIT
            </p>
            <h2
              id="learn-strip-heading"
              className="mt-4 max-w-[14ch] font-display text-4xl leading-[1.05] text-ink md:text-[2.85rem]"
            >
              Know more. <span className="italic text-hanbok-deep">Buy better.</span>
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink/70">
              Clear guides to Korean skincare — from what an ingredient does to where a product belongs in your routine.
            </p>
            <Link
              to="/learn/hub"
              className="group mt-10 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-ink transition hover:text-hanbok-deep"
            >
              <span className="border-b border-ink/30 pb-0.5 transition-colors group-hover:border-hanbok-deep">
                Explore the Learn Hub
              </span>
              <span className="transition-transform duration-300 motion-safe:group-hover:translate-x-1">→</span>
            </Link>
          </div>

          {/* Editorial index */}
          <div className="md:col-span-7">
            <ul className="border-t border-border">
              {topics.map((t) => (
                <li
                  key={t.title}
                  className="border-b border-border py-7 md:py-8"
                >
                  {t.to ? (
                    <Link
                      to={t.to}
                      className="group flex items-baseline gap-5 md:gap-6"
                    >
                      <span className="font-display text-sm italic text-ink/60">
                        {t.num}
                      </span>
                      <div className="flex-1">
                        <h3 className="font-display text-sm uppercase tracking-[0.12em] text-ink transition-colors group-hover:text-hanbok-deep">
                          {t.title}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-ink/60">
                          {t.line}
                        </p>
                      </div>
                    </Link>
                  ) : (
                    <div className="flex items-baseline gap-5 md:gap-6">
                      <span className="font-display text-sm italic text-ink/60">
                        {t.num}
                      </span>
                      <div className="flex-1">
                        <h3 className="font-display text-sm uppercase tracking-[0.12em] text-ink">
                          {t.title}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-ink/60">
                          {t.line}
                        </p>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Promise() {
  const items = [
    { num: "01", title: "AUTHENTICITY CHECKED", line: "Verified by the Skin Grocer team before dispatch." },
    { num: "02", title: "STOCKED IN MELBOURNE", line: "Australian-held inventory with truthful stock status." },
    { num: "03", title: "GUIDANCE INCLUDED", line: "Clear instructions for where each product fits." },
    { num: "04", title: "CURATED WITH PURPOSE", line: "Selected for formulation, routine fit and customer relevance." },
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
    <section className="border-b border-border/60 bg-paper" aria-label="Skin Grocer promises">
      <div className="mx-auto max-w-7xl px-6">
        <ul
          ref={ref}
          className="grid grid-cols-2 gap-x-6 divide-border/60 md:grid-cols-4 md:gap-0 md:divide-x"
        >
          {items.map((item) => (
            <li
              key={item.num}
              data-trust-id={item.num}
              className="flex flex-col gap-2 py-8 md:px-8 md:py-14 first:md:pl-0 last:md:pr-0"
            >
              <span className="font-display text-xs italic leading-none text-ink/60">
                {item.num}
              </span>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink">
                {item.title}
              </p>
              <p className="text-xs leading-relaxed text-ink/70">{item.line}</p>
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




function RitualCTA() {
  const steps = [
    {
      n: "01",
      title: "Choose an eligible essential",
      copy: "A small set of routine staples can be ordered as a monthly Restock — look for the Restock option on the product.",
    },
    {
      n: "02",
      title: "Set it up with an account",
      copy: `Restock orders repeat monthly at ${RESTOCK_DISCOUNT_PERCENT}% off the one-time price, and are kept with your account.`,
    },
    {
      n: "03",
      title: "Change your mind any time",
      copy: "Cancel a Restock from your account and it simply stops at the end of the current period.",
    },
  ];

  return (
    <section className="relative overflow-hidden" aria-labelledby="restock-heading">
      <div className="absolute inset-0">
        <img src={ritualScene} alt="" loading="lazy" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-hanbok-deep/55 md:bg-gradient-to-r md:from-hanbok-deep/80 md:via-hanbok-deep/55 md:to-hanbok-deep/15" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="max-w-xl text-paper">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-paper/70">
            Replenishment, made simple
          </p>
          <h2 id="restock-heading" className="display-section mt-4">
            The products you finish.{" "}
            <span className="italic">Before you run out.</span>
          </h2>
          <p className="lede mt-5 text-paper/80">
            For the essentials that earn a permanent place in your routine, make
            restocking one less thing to remember.
          </p>
        </div>

        <div className="mt-14 max-w-3xl border-t border-paper/25">
          {steps.map((s) => (
            <div
              key={s.n}
              className="grid gap-2 border-b border-paper/20 py-6 md:grid-cols-[4rem_1fr] md:gap-8"
            >
              <span className="font-display text-sm italic text-paper/60">{s.n}</span>
              <div>
                <h3 className="text-[12px] font-semibold uppercase tracking-[0.18em] text-paper">
                  {s.title}
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-paper/75">{s.copy}</p>
              </div>
            </div>
          ))}
        </div>

        <Link
          to="/shop"
          className="group mt-10 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-paper"
        >
          <span className="border-b border-paper/40 pb-1 transition-colors group-hover:border-paper">
            Browse restockable essentials
          </span>
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </section>
  );
}


function CustomerNotes() {
  const prompts = [
    {
      n: "01",
      title: "WHAT THEY BOUGHT",
      line: "The exact product or routine they used.",
    },
    {
      n: "02",
      title: "THEIR SKIN CONTEXT",
      line: "Useful details such as skin type or the concern they were shopping for — when the reviewer chooses to share them.",
    },
    {
      n: "03",
      title: "THEIR EXPERIENCE",
      line: "What worked for them, what didn’t, and how the product fitted into real life.",
    },
  ];

  return (
    <section className="bg-sand" aria-labelledby="customer-notes-heading">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 md:grid-cols-12 md:items-start md:gap-16">
        <div className="md:col-span-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">
            CUSTOMER NOTES
          </p>
          <h2
            id="customer-notes-heading"
            className="mt-4 max-w-2xl font-display text-4xl leading-tight text-ink md:text-[2.75rem]"
          >
            The details that help someone else decide.
          </h2>
          <p className="mt-5 max-w-xl text-ink/70">
            The most useful skincare reviews are specific — what someone bought, how it fitted into their routine and what their skin was like before they tried it.
          </p>
        </div>

        <div className="md:col-span-7">
          <ul className="border-t border-border">
            {prompts.map((p) => (
              <li
                key={p.title}
                className="border-b border-border py-6 md:py-7"
              >
                <div className="flex items-baseline gap-4 md:gap-5">
                  <span className="font-display text-xs italic text-ink/60">
                    {p.n}
                  </span>
                  <div>
                    <p className="font-display text-sm uppercase tracking-[0.14em] text-ink">
                      {p.title}
                    </p>
                    <p className="mt-1 text-sm text-ink/60">{p.line}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[11px] uppercase tracking-[0.16em] text-ink/65">
            Verified customer feedback will appear here as it is collected.
          </p>
        </div>
      </div>
    </section>
  );
}


