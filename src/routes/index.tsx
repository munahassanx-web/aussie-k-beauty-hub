import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
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
import { bundleMath, BUNDLE_DEFINITIONS, RESTOCK_DISCOUNT_PERCENT, SHOP_PRODUCTS } from "@/lib/shop-catalog";
import glassSkinStarterExplainer from "@/assets/bundle-explainers/glass-skin-starter.webp.asset.json";
import completeGlowExplainer from "@/assets/bundle-explainers/complete-glow-edit.webp.asset.json";
import calmClearExplainer from "@/assets/bundle-explainers/calm-clear-bundle.webp.asset.json";
import applyingSerum from "@/assets/applying-serum.webp.asset.json";
import authenticityCard from "@/assets/authenticity-card.webp.asset.json";
import ritualScene from "@/assets/ritual-scene.webp";
import quizBareSkin from "@/assets/quiz-bare-skin.webp";
import cabinetEdit from "@/assets/brand-cabinet-products.jpg";

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

const concerns: { name: string; desc: string; slug: "hydration" | "acne" | "pigmentation" | "sensitivity" | "anti-aging" | "barrier" }[] = [
  { name: "Hydration & Glow", desc: "For skin that feels dry, tight or simply wants more moisture.", slug: "hydration" },
  { name: "Blemish-Prone", desc: "A simpler edit for skin that often looks congested or shiny.", slug: "acne" },
  { name: "Uneven-Looking Tone", desc: "For a routine focused on a brighter, more even-looking finish.", slug: "pigmentation" },
  { name: "Easily Unsettled", desc: "Gentle-feeling choices for skin that prefers a quieter routine.", slug: "sensitivity" },
  { name: "Firmness & Fine Lines", desc: "For routines centred on hydration and a smoother-looking finish.", slug: "anti-aging" },
  { name: "Barrier-Focused", desc: "Comforting, moisture-first choices for skin that feels dry or overworked.", slug: "barrier" },
];


const ingredients = [
  { name: "Snail Mucin", role: "Repair & glow" },
  { name: "Centella Asiatica", role: "Soothe redness" },
  { name: "Niacinamide", role: "Even tone" },
  { name: "Propolis", role: "Barrier support" },
  { name: "Beta-Glucan", role: "Deep hydration" },
  { name: "Madecassoside", role: "Sensitive calm" },
];





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
      <SkinQuizSection />
      <Reveal><BundleOffer /></Reveal>
      <Reveal><Concerns /></Reveal>
      <Reveal><WhyPillars /></Reveal>
      <ApplicationMoment />
      <RitualCTA />
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

function WhyPillars() {
  const points = [
    {
      n: "01",
      title: "SOURCED FROM SEOUL",
      copy: "We source our Korean skincare directly from Seoul, bringing our considered edit closer to Australian customers.",
    },
    {
      n: "02",
      title: "EVERY ORDER VERIFIED",
      copy: "Every order is checked by our team before dispatch and sent with a QR authenticity card linked to that order, so you can see exactly what we recorded.",
    },
    {
      n: "03",
      title: "YOUR ROUTINE, IN THE BOX",
      copy: "Every order arrives with a QR code linking you directly to How to Apply guidance for the products you purchased.",
      hero: true,
    },
    {
      n: "04",
      title: "GUIDANCE AFTER CHECKOUT",
      copy: "The relationship doesn’t end when your parcel arrives. Your product guides help you understand how to use what you bought and where it belongs in your routine.",
    },
  ];

  return (
    <section
      className="relative overflow-hidden bg-paper"
      aria-labelledby="why-heading"
    >
      <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">

        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">
            Why Skin Grocer
          </p>
          <h2 id="why-heading" className="display-section mt-4 text-ink">
            From Seoul to your shelf —{" "}
            <span className="italic text-hanbok-deep">with nothing left to guess.</span>
          </h2>
          <p className="lede mt-5 text-ink/70">
            We built Skin Grocer around two things customers should never have to
            second-guess: where their skincare came from, and what to do with it once it arrives.
          </p>
        </div>

        <div className="mt-16 grid gap-12 md:grid-cols-12 md:gap-10">
          {/* Proof points + journey */}
          <div className="md:col-span-7">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-border pb-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/65">
              <span>SEOUL</span>
              <span className="text-grocer-butter">→</span>
              <span>VERIFIED</span>
              <span className="text-grocer-butter">→</span>
              <span>SKINGROCER</span>
              <span className="text-grocer-butter">→</span>
              <span>SCAN</span>
              <span className="text-grocer-butter">→</span>
              <span>YOUR ROUTINE</span>
            </div>

            <ul className="mt-2">
              {points.map((p) => (
                <li
                  key={p.title}
                  className={`group border-b border-ink/10 py-7 transition-colors hover:border-ink/25 ${p.hero ? "md:py-9" : ""}`}
                >
                  <div className="flex gap-5 md:gap-6">
                    <span
                      className={`font-display italic text-hanbok-deep/30 transition-colors group-hover:text-hanbok-deep/60 ${p.hero ? "text-3xl" : "text-2xl"}`}
                    >
                      {p.n}
                    </span>
                    <div className="flex-1">
                      <h3
                        className={`font-display uppercase tracking-[0.12em] text-ink ${p.hero ? "text-base" : "text-sm"}`}
                      >
                        {p.title}
                      </h3>
                      <p
                        className={`mt-2 leading-relaxed text-ink/70 ${p.hero ? "text-[15px]" : "text-sm"}`}
                      >
                        {p.copy}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Navy packaging visual panel — placeholder for the approved real photograph */}
          <div className="md:col-span-5">
            <div className="relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-sm bg-hanbok-deep px-8 py-10 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.45)] md:aspect-auto md:h-full">
              {/* Cinematic gel light across the panel, echoing the hero stage */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(70% 50% at 20% 0%, color-mix(in oklab, var(--grocer-butter) 30%, transparent), transparent 65%), radial-gradient(60% 45% at 100% 100%, color-mix(in oklab, var(--grocer-butter) 18%, transparent), transparent 70%)",
                }}
              />
              {/* Quiet vertical lines as a premium texture layer */}
              <div className="absolute inset-0 opacity-[0.08]">
                <div className="absolute left-1/4 top-0 h-full w-px bg-paper" />
                <div className="absolute left-2/4 top-0 h-full w-px bg-paper" />
                <div className="absolute left-3/4 top-0 h-full w-px bg-paper" />
              </div>

              <div className="relative">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-grocer-butter/80">
                  Premium packaging
                </p>
                <h3 className="mt-5 max-w-[13ch] font-display text-3xl leading-[1.05] text-paper md:text-[2.6rem]">
                  Your routine starts here.
                </h3>
              </div>

              <div className="relative space-y-6">
                <div className="h-px w-12 bg-grocer-butter/40" />
                <p className="max-w-[28ch] text-sm leading-relaxed text-sand/85">
                  Scan the card in your order for product-by-product guidance.
                </p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-sand/50">
                  Navy box · Warm gold seal · Ivory tissue
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


/**
 * A personal guidance moment — an invitation to narrow K-beauty choices,
 * not a diagnostic tool or sales funnel.
 */
function SkinQuizSection() {
  const prompts = [
    {
      title: "WHAT IS YOUR SKIN ASKING FOR?",
      line: "Start with the concern you notice most.",
    },
    {
      title: "WHAT ARE YOU USING ALREADY?",
      line: "A good routine doesn’t need unnecessary duplicates.",
    },
    {
      title: "HOW MUCH ROUTINE FITS YOUR LIFE?",
      line: "Keep it simple, or build it out gradually.",
    },
  ];

  return (
    <section className="bg-paper" aria-labelledby="skin-quiz-heading">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 md:grid-cols-12 md:items-center md:gap-16">
        <div className="md:col-span-5">
          <div className="relative mx-auto aspect-[4/5] max-w-sm overflow-hidden rounded-2xl bg-sand md:max-w-none">
            <img
              src={quizBareSkin}
              alt="Close-up of bare skin in soft natural light, showing natural texture and dryness on the cheek"
              loading="lazy"
              width={1280}
              height={1600}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="md:col-span-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">
            A SIMPLER PLACE TO START
          </p>
          <h2
            id="skin-quiz-heading"
            className="mt-4 max-w-2xl font-display text-4xl leading-tight text-ink md:text-[2.75rem]"
          >
            Your skin doesn’t need more noise.{" "}
            <span className="italic text-hanbok-deep">It needs a clearer routine.</span>
          </h2>
          <p className="mt-5 max-w-xl text-ink/70">
            Tell us a little about your skin, what you’re using now and what you want to improve.
            We’ll help you narrow the choices and make the next step feel simpler.
          </p>

          <ul className="mt-10 border-t border-border">
            {prompts.map((p, i) => (
              <li
                key={p.title}
                className="border-b border-border py-6 md:py-7"
              >
                <div className="flex items-baseline gap-4 md:gap-5">
                  <span className="font-display text-xs italic text-ink/60">
                    {String(i + 1).padStart(2, "0")}
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

          <Link
            to="/consultation"
            className="group mt-10 inline-flex items-center gap-3 rounded-full bg-pop px-8 py-4 text-[12px] font-bold uppercase tracking-[0.2em] text-pop-foreground shadow-[0_16px_38px_-12px] shadow-pop/60 transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110"
          >
            Take the skin quiz
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
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


function Concerns() {
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">
            SHOP BY WHAT YOU NOTICE
          </p>
          <h2 className="display-section mt-4 text-ink">
            Start with what your skin is asking for.
          </h2>
          <p className="mt-5 max-w-2xl text-ink/70">
            You don't need to know every ingredient or trend. Begin with what you notice day to day, then explore a more considered edit.
          </p>
        </div>

        <div className="mt-16 grid border-l border-t border-border md:grid-cols-2 lg:grid-cols-3">
          {concerns.map((c, i) => (
            <Link
              key={c.slug}
              to="/shop"
              search={{ concern: c.slug }}
              className="group flex flex-col border-b border-r border-border p-6 md:p-8 transition-colors hover:bg-sand/50"
            >
              <span className="font-display text-xs italic text-ink/60">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-display text-xl text-ink md:text-2xl">
                {c.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">
                {c.desc}
              </p>
              <span className="mt-auto pt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink transition-colors group-hover:text-hanbok-deep">
                Explore the edit
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}



const BUNDLE_EXPLAINERS: Record<string, string> = {
  bundle_glass_skin_starter_onetime: glassSkinStarterExplainer.url,
  bundle_complete_glow_onetime: completeGlowExplainer.url,
  bundle_calm_clear_onetime: calmClearExplainer.url,
};

function BundleCardMedia({
  bundle,
  explainer,
}: {
  bundle: { products: { img: string; alt: string }[]; name: string };
  explainer?: string;
}) {
  const [showExplainer, setShowExplainer] = useState(false);

  return (
    <div className="relative aspect-[5/3] overflow-hidden bg-sand">
      <div
        className={`grid h-full w-full transition-opacity duration-300 ${showExplainer ? "opacity-0" : "opacity-100"}`}
        style={{ gridTemplateColumns: `repeat(${bundle.products.length}, minmax(0, 1fr))` }}
      >
        {bundle.products.map((p) => (
          <div key={p.alt} className="flex items-center justify-center bg-paper p-2">
            <img
              src={p.img}
              alt={p.alt}
              title={p.alt}
              loading="lazy"
              className="h-full w-full object-contain mix-blend-multiply"
            />
          </div>
        ))}
      </div>

      {explainer && (
        <img
          src={explainer}
          alt={`Routine overview for ${bundle.name}`}
          loading="lazy"
          aria-hidden={!showExplainer}
          className={`pointer-events-none absolute inset-0 h-full w-full bg-paper object-contain transition-opacity duration-300 ${
            showExplainer ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {explainer && (
        <button
          type="button"
          onClick={() => setShowExplainer((v) => !v)}
          className="absolute bottom-3 right-3 z-10 border border-ink/20 bg-paper/95 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink transition hover:bg-paper"
        >
          {showExplainer ? "Back to products" : "See the routine"}
        </button>
      )}
    </div>
  );
}

function BundleOffer() {
  const { buy, modal } = useBuyNow();

  // Totals are computed live from the current catalog prices — never hardcoded.
  const bundles = BUNDLE_DEFINITIONS.map((b) => ({ ...b, ...bundleMath(b.includes, b.price) }));

  return (
    <section id="bundles" className="scroll-mt-20 bg-secondary">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">
            THE ROUTINE EDITS
          </p>
          <h2 className="mt-4 display-section text-ink">
            A considered routine,{" "}
            <span className="italic text-hanbok-deep">already put together.</span>
          </h2>
          <p className="mt-5 max-w-xl text-ink/70">
            A few complete starting points for when you want the products to work together
            without spending hours comparing every step.
          </p>
          <p className="mt-3 max-w-xl text-sm text-ink/60">
            Choose the edit closest to your skin goals, then adjust as your routine evolves.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {bundles.map((b) => {
            const explainer = BUNDLE_EXPLAINERS[b.priceId];
            return (
              <article
                key={b.name}
                className={`flex flex-col overflow-hidden border bg-paper ${
                  b.featured ? "border-ink/80" : "border-border/70"
                }`}
              >
                {b.featured && (
                  <div className="border-b border-ink/10 bg-paper px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink">
                    THE COMPLETE EDIT
                  </div>
                )}
                <BundleCardMedia bundle={b} explainer={explainer} />
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-2xl leading-tight text-ink">{b.name}</h3>
                  <p className="mt-2 text-sm text-ink/70">{b.desc}</p>

                  <div className="mt-6">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/65">
                      IN THIS EDIT
                    </p>
                    <ul className="mt-3 space-y-2 border-t border-border pt-3 text-sm text-ink/80">
                      {b.includes.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-hanbok" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 flex items-end gap-3 border-t border-border/60 pt-5">
                    <p className="font-display text-3xl text-ink">A${b.price}</p>
                    {b.original > b.price && (
                      <>
                        <p className="pb-1 text-sm text-muted-foreground line-through">A${b.original}</p>
                        <p className="ml-auto pb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-clay">
                          Save A${b.save}
                        </p>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => buy({ priceId: b.priceId, name: b.name, priceLabel: `A$${b.price}` })}
                    className="mt-5 w-full border border-ink bg-ink py-3.5 text-xs font-semibold uppercase tracking-[0.22em] text-paper transition hover:bg-paper hover:text-ink"
                  >
                    Shop this edit
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
      {modal}
    </section>
  );
}



function ProvenanceCard() {
  const principles = [
    { t: "ORIGINAL PACKAGING", d: "Products stay in their original branded packaging." },
    { t: "CLEAR PRODUCT DETAILS", d: "Know the brand, size and product you’re choosing." },
    { t: "AUSTRALIAN-BASED SHOPPING", d: "A local storefront for discovering Korean skincare." },
    { t: "QUESTIONS WELCOME", d: "If something doesn’t look right, ask us before you use it." },
  ];

  return (
    <section className="bg-ink text-paper">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 md:grid-cols-12 md:items-center md:gap-16">
        <div className="md:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink">
            <img
              src={authenticityCard.url}
              alt="A Skin Grocer authenticity card with a wax seal, resting among Korean skincare in original branded packaging from Haruharu Wonder, SKIN1004, Anua, mixsoon and Beauty of Joseon"
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-ink/10" />
          </div>

        </div>

        <div className="md:col-span-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
            AUTHENTICITY, WITHOUT THE GUESSWORK
          </p>
          <h2 className="mt-4 font-display text-4xl leading-tight text-paper md:text-[2.75rem]">
            Know what’s touching your skin.
          </h2>
          <p className="mt-5 max-w-xl text-paper/70">
            K-beauty should feel exciting, not uncertain. Skin Grocer is built around a simple
            standard: genuine products, clear product information and a more considered way to shop
            Korean skincare in Australia.
          </p>

          <ul className="mt-10 grid border-l border-t border-paper/10 md:grid-cols-2">
            {principles.map((p, i) => (
              <li
                key={p.t}
                className="border-b border-r border-paper/10 px-5 py-6 md:px-6 md:py-7"
              >
                <span className="font-display text-xs italic text-paper/65">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-2 font-display text-sm uppercase tracking-[0.14em] text-paper">
                  {p.t}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-paper/60">{p.d}</p>
              </li>
            ))}
          </ul>

          <Link
            to="/about"
            className="group mt-10 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-paper transition hover:text-accent"
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

function ApplicationMoment() {
  return (
    <section className="relative overflow-hidden bg-ink" aria-labelledby="ritual-heading">
      <div className="absolute inset-0">
        <img
          src={applyingSerum.url}
          alt="Woman applying a lightweight Korean serum to her face in soft natural light"
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-ink/30 to-ink/10" />
      </div>
      <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="grid md:grid-cols-12 md:items-center md:gap-12">
          <div className="md:col-span-6 lg:col-span-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sand/80">
              THE DAILY RITUAL
            </p>
            <h2
              id="ritual-heading"
              className="mt-4 font-display text-4xl leading-tight text-paper md:text-5xl"
            >
              Good skincare should fit the life you actually live.
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-paper/80">
              A considered routine doesn’t need to take over your bathroom shelf — or your morning.
              Start with what matters, layer with intention, and build only when your skin asks for more.
            </p>

            <div className="mt-8 border-t border-paper/20 pt-6">
              <div className="space-y-3">
                <div className="grid grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-paper/60">
                    AM
                  </span>
                  <span className="text-sm text-paper/90">Cleanse · Treat · Moisturise · Protect</span>
                </div>
                <div className="grid grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-paper/60">
                    PM
                  </span>
                  <span className="text-sm text-paper/90">Cleanse · Treat · Moisturise</span>
                </div>
              </div>
              <p className="mt-4 text-xs italic text-paper/70">
                A simple starting point — adjust for your skin.
              </p>
            </div>

            <div className="mt-10 flex flex-col items-start gap-5 md:flex-row md:gap-8">
              <Link
                to="/consultation"
                className="group inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-paper transition hover:text-sand"
              >
                <span className="border-b border-paper/40 pb-0.5 transition-colors group-hover:border-sand">
                  Find your routine
                </span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <Link
                to="/shop"
                className="group inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-paper transition hover:text-sand"
              >
                <span className="border-b border-paper/40 pb-0.5 transition-colors group-hover:border-sand">
                  Explore the ritual
                </span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
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


