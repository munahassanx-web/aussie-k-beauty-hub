import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useBuyNow } from "@/hooks/use-buy-now";
import { NewsletterForm } from "@/components/newsletter-form";
import { FaqSection } from "@/components/faq-section";
import { HOME_FAQS, faqJsonLd } from "@/lib/faqs";
import { Reveal } from "@/components/reveal";


import { HeroCarousel } from "@/components/hero-carousel";
import { SeoulSignalStrip } from "@/components/seoul-signal";
import { KoreaRightNow } from "@/components/korea-right-now";
import { bundleMath, BUNDLE_DEFINITIONS, bundleSavingsSummary } from "@/lib/shop-catalog";
import glassSkinStarterExplainer from "@/assets/bundle-explainers/glass-skin-starter.png.asset.json";
import completeGlowExplainer from "@/assets/bundle-explainers/complete-glow-edit.png.asset.json";
import calmClearExplainer from "@/assets/bundle-explainers/calm-clear-bundle.png.asset.json";
import applyingSerum from "@/assets/applying-serum.png.asset.json";
import authenticityCard from "@/assets/authenticity-card.png.asset.json";
import brandLineup from "@/assets/brand-lineup.png.asset.json";
import textureMacro from "@/assets/texture-macro.jpg";
import ritualScene from "@/assets/ritual-scene.jpg";
import brandSpotlight from "@/assets/brand-spotlight.jpg";
import customers from "@/assets/customers.jpg";
import quizBareSkin from "@/assets/quiz-bare-skin.jpg";
import categoryMasks from "@/assets/category-masks.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Skin Grocer — Authentic Korean Skincare, Next-Day from Melbourne" },
      { name: "description", content: "Melbourne's destination for authentic K-beauty and premium imports. Locally stocked, expertly guided, dispatched next-day across Australia." },
      { property: "og:title", content: "Skin Grocer — Authentic Korean Skincare, Next-Day from Melbourne" },
      { property: "og:description", content: "Melbourne's destination for authentic K-beauty and premium imports. Locally stocked, expertly guided, dispatched next-day across Australia." },
      { property: "og:url", content: "https://skingrocer.com.au/" },
    ],
    links: [{ rel: "canonical", href: "https://skingrocer.com.au/" }],
    scripts: [faqJsonLd(HOME_FAQS)],
  }),
  component: HomePage,
});

const categories: {
  name: string;
  count: string;
  img: string;
  label: string;
  brand: string;
  price: string;
  size: string;
  benefit: string;
  ingredient: string;
  search: { category: "cleanse" | "tone" | "treat" | "moisturise" | "protect" | "masks" };
}[] = [
  { name: "Cleansers", count: "Melt & rinse", img: "/products/beplain/mung-bean-cleansing-oil-200ml.png", label: "beplain Mung Bean Cleansing Oil", brand: "beplain", price: "A$35", size: "200ml", benefit: "Dissolves SPF, makeup and sebum, rinses clean without stripping.", ingredient: "Mung bean extract", search: { category: "cleanse" } },
  { name: "Toners & Essences", count: "Prep & hydrate", img: "/products/wellage/real-hyaluronic-toner-200ml.png", label: "WELLAGE Real Hyaluronic Toner", brand: "WELLAGE", price: "A$28", size: "200ml", benefit: "A watery first layer that preps skin so everything after absorbs better.", ingredient: "Hyaluronic acid", search: { category: "tone" } },
  { name: "Serums", count: "Treat & target", img: "/products/medicube/pdrn-pink-peptide-serum-30ml.png", label: "MEDICUBE PDRN Pink Peptide Serum", brand: "MEDICUBE", price: "A$40", size: "30ml", benefit: "Concentrated step aimed at firmness and elasticity.", ingredient: "PDRN + peptides", search: { category: "treat" } },
  { name: "Moisturisers", count: "Seal & protect", img: "/products/aestura/atobarrier365-cream.png", label: "AESTURA Atobarrier365 Cream", brand: "AESTURA", price: "A$55", size: "Cream", benefit: "Seals in the layers underneath and supports a dry, reactive barrier.", ingredient: "Ceramides", search: { category: "moisturise" } },
  { name: "SPF", count: "Everyday defence", img: "/products/aestura/derma-uv365-barrier-moisture-mineral-sun-cream.png", label: "AESTURA Derma UV365 Mineral Sun Cream", brand: "AESTURA", price: "A$10", size: "20ml", benefit: "A mineral daily sunscreen that finishes moisturising, not chalky.", ingredient: "Mineral UV filters", search: { category: "protect" } },
  { name: "Masks", count: "Sheet & overnight masks", img: "/products/biodance/bio-collagen-real-deep-mask.png", label: "BIODANCE Bio Collagen Real Deep Mask", brand: "BIODANCE", price: "A$38", size: "Hydrogel mask", benefit: "An overnight hydrogel mask that melts down onto skin as you sleep.", ingredient: "Bio-collagen", search: { category: "masks" } },
];



const concerns: { name: string; desc: string; color: string; slug: "hydration" | "acne" | "pigmentation" | "sensitivity" | "anti-aging" | "barrier" }[] = [
  { name: "Hydration & Glow", desc: "Plump, dewy, glass-skin finish", color: "from-hanbok/15", slug: "hydration" },
  { name: "Acne & Breakouts", desc: "Calm congestion, balance oil", color: "from-clay/20", slug: "acne" },
  { name: "Pigmentation", desc: "Brighten and even skin tone", color: "from-sand-deep/40", slug: "pigmentation" },
  { name: "Sensitivity", desc: "Repair and soothe the barrier", color: "from-hanbok/10", slug: "sensitivity" },
  { name: "Anti-Ageing", desc: "Firmness, elasticity & wrinkle care", color: "from-clay/15", slug: "anti-aging" },
  { name: "Barrier Repair", desc: "Rebuild a compromised skin barrier", color: "from-sand-deep/30", slug: "barrier" },
];


const ingredients = [
  { name: "Snail Mucin", role: "Repair & glow" },
  { name: "Centella Asiatica", role: "Soothe redness" },
  { name: "Niacinamide", role: "Even tone" },
  { name: "Propolis", role: "Barrier support" },
  { name: "Beta-Glucan", role: "Deep hydration" },
  { name: "Madecassoside", role: "Sensitive calm" },
];




const reviews = [
  { name: "Lara · Carlton VIC", quote: "Genuinely changed my skin in three weeks. The advisor reply email helped me build a routine I actually stick to." },
  { name: "Priya · Brunswick VIC", quote: "Ordered at 11am, in my hands by 4pm next day. Authentic batch codes, sealed exactly as expected." },
  { name: "Emma · Richmond VIC", quote: "Skin Grocer is the only AU retailer I trust for Beauty of Joseon. The provenance card is such a nice touch." },
];

function HomePage() {
  return (
    <div>
      <PromoBar />
      <HeroCarousel />
      <Promise />
      <KoreaRightNow />
      <Reveal><Categories /></Reveal>
      <BrandMarquee />
      <Reveal><IngredientStrip /></Reveal>

      <Reveal><ProvenanceCard /></Reveal>
      <SkinQuizSection />
      <Reveal><BundleOffer /></Reveal>
      <Reveal><Concerns /></Reveal>
      <Reveal><WhyPillars /></Reveal>
      <ApplicationMoment />
      <RitualCTA />
      <ParallaxScene />
      <Reveal><LearnStrip /></Reveal>
      <SeoulSignalStrip />
      <Reveal><ReviewsCarousel /></Reveal>

      <FaqSection
        id="k-beauty-faq"
        eyebrow="Common questions"
        title="Korean skincare, answered plainly."
        intro="The questions Australians ask us most — about routines, ingredients, authenticity and delivery. Short answers first, detail underneath."
        items={HOME_FAQS}
        tone="sand"
      />
      <NewsletterStrip />
    </div>
  );
}

function WhyPillars() {
  const pillars = [
    { t: "Sourced & shipped from Seoul", d: "Direct relationships with Korean brands and distributors, flown into our Melbourne warehouse." },
    { t: "Thousands of SKUs in one place", d: "The K-beauty edit — skincare, makeup, hair and body — stocked locally, ready to ship." },
    { t: "Best, local & exclusive brands", d: "Cult favourites plus small-batch Korean labels you can't find anywhere else in AU." },
    { t: "100% authentic, always", d: "Every batch verified on arrival. Sealed, coded, provenance-carded. No greymarket, ever." },
    { t: "Fair local AUD pricing", d: "No inflated import markups. Premium K-beauty, priced honestly for Australian shoppers." },
    { t: "On-trend, curated weekly", d: "New arrivals every Friday — the drops Korean TikTok is talking about, on Aussie shelves first." },
  ];
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-2xl">
          <p className="eyebrow eyebrow-rule text-clay">Why Skin Grocer</p>
          <h2 className="display-section mt-4 text-ink">
            Australia's K-beauty grocer,<br />
            <span className="italic text-hanbok-deep">for every skincare ritual.</span>
          </h2>
          <p className="mt-5 max-w-xl text-ink/70">
            We're a Melbourne-based retailer of authentic Korean skincare — locally stocked,
            honestly priced, and here to guide you from your first cleanse to your final SPF.
          </p>
        </div>




        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-3">
          {pillars.map((p, i) => (
            <div key={p.t} className="flex flex-col gap-3 bg-paper p-8">
              <span className="font-display text-3xl text-hanbok-deep/30">0{i + 1}</span>
              <h3 className="font-display text-xl leading-tight text-ink">{p.t}</h3>
              <p className="text-sm text-ink/70">{p.d}</p>
            </div>
          ))}
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
                  <span className="font-display text-xs italic text-ink/30">
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
            className="group mt-10 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-ink transition hover:text-hanbok-deep"
          >
            <span className="border-b border-ink/30 pb-0.5 transition-colors group-hover:border-hanbok-deep">
              Find your routine
            </span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}



function BrandMarquee() {
  const brands = [
    "AESTURA", "BIODANCE", "Beauty of Joseon", "Dr.G", "HARUHARU WONDER",
    "ISNTREE", "MEDICUBE", "ROUND LAB", "S.NATURE", "TIRTIR",
    "TORRIDEN", "WELLAGE", "beplain",
  ];
  return (
    <section className="border-y border-border/60 bg-paper">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">
              THE BRAND CABINET
            </p>
            <h2 className="mt-3 font-display text-3xl leading-tight text-ink md:text-4xl">
              Korean skincare houses, <span className="italic text-hanbok-deep">chosen with intention.</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm text-ink/70">
              From barrier specialists to modern cult favourites, explore the names shaping the SkinGrocer edit.
            </p>
          </div>
          <Link
            to="/brands"
            className="group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink transition hover:text-hanbok-deep"
          >
            Browse all brands
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>

        <ul className="grid divide-y divide-border/60 border-t border-border/60 md:grid-cols-3 md:divide-x md:divide-y-0">
          {brands.map((brand, i) => (
            <li
              key={brand}
              className="group flex items-center justify-between border-b border-border/60 px-1 py-5 md:px-4 md:py-6"
            >
              <div className="flex items-baseline gap-4">
                <span className="font-display text-xs italic text-ink/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-ink transition-colors group-hover:text-hanbok-deep">
                  {brand}
                </span>
              </div>
              <span className="text-ink/20 transition-all duration-300 group-hover:translate-x-1 group-hover:text-hanbok-deep">
                →
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function PromoBar() {
  const { maxPercent } = bundleSavingsSummary();
  const messages = [
    `Save up to ${maxPercent}% on advisor-built bundles`,
    "Bundle + subscribe for an extra 10% off, forever",
    "Routine card + samples in every bundle",
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % messages.length), 7000);
    return () => clearInterval(t);
  }, [messages.length]);
  return (
    <Link
      to="/"
      hash="bundles"
      className="block bg-hanbok-deep text-paper transition hover:bg-hanbok"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-6 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.2em]">
        <span className="truncate transition-opacity duration-700">{messages[i]}</span>
        <span className="hidden whitespace-nowrap text-accent sm:inline">Shop bundles →</span>
      </div>
    </Link>
  );
}


function ParallaxScene() {
  return (
    <section
      className="relative min-h-[88vh] overflow-hidden bg-ink"
      aria-label="Glass skin in motion"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="cinematic-layer absolute inset-0 bg-cover bg-center bg-no-repeat md:bg-fixed"
          style={{ backgroundImage: `url(${brandLineup.url})` }}
        />
      </div>
      <div className="cinematic-scrim absolute inset-0" />
      <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col items-start justify-end px-6 py-28">
        <Reveal>
          <p className="eyebrow eyebrow-rule text-paper/70">Glass skin, decoded</p>
        </Reveal>
        <Reveal delay={110}>
          <h2 className="display-section mt-5 max-w-3xl text-paper">
            The Korean approach: <span className="italic">layer light, hold water, protect glow.</span>
          </h2>
        </Reveal>
        <Reveal delay={200}>
          <div className="mt-8 max-w-xl">
            <div className="hairline-rule text-paper/70" />
            <p className="lede mt-6 text-paper/80">
              Hydration first, occlusion last, sunscreen always. A philosophy we've imported,
              translated, and stocked locally for Australian skin.
            </p>
          </div>
        </Reveal>
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
  return (
    <section className="border-y border-border/60 bg-paper">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 py-16 text-center">
        <p className="eyebrow eyebrow-rule text-clay">The Learn Hub</p>
        <h2 className="max-w-2xl display-section text-ink">
          Korean skincare, <span className="italic text-hanbok-deep">actually explained.</span>
        </h2>
        <p className="max-w-xl text-ink/70">
          Ingredients decoded, concerns addressed, routines simplified — written for Australian skin
          and climate, not copied from a label.
        </p>
        <Link
          to="/learn/hub"
          className="group inline-flex items-center gap-3 rounded-full border border-hanbok/40 bg-hanbok/5 px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-ink transition duration-300 hover:-translate-y-1 hover:border-hanbok hover:bg-hanbok/15 hover:shadow-[0_20px_45px_-22px_var(--color-hanbok)]"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          <span className="underline-grow">Explore the Learn Hub</span>
          <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
        </Link>
      </div>
    </section>
  );
}

function Promise() {
  const items = [
    { num: "01", title: "AUTHENTIC FROM KOREA", line: "Batch verified" },
    { num: "02", title: "DISPATCHED FROM MELBOURNE", line: "Fast Australian delivery" },
    { num: "03", title: "PERSONAL GUIDANCE", line: "Skincare made simpler" },
    { num: "04", title: "CURATED WITH INTENTION", line: "Only what’s worth knowing" },
  ];
  return (
    <section className="border-b border-border/60 bg-paper">
      <div className="mx-auto max-w-7xl px-6">
        <ul className="grid divide-y divide-border/60 md:grid-cols-4 md:divide-y-0 md:divide-x">
          {items.map((item) => (
            <li
              key={item.num}
              className="flex flex-col items-center gap-3 py-10 text-center md:items-start md:px-8 md:py-14 md:text-left first:md:pl-0 last:md:pr-0"
            >
              <span className="font-display text-xs italic leading-none text-ink/30">
                {item.num}
              </span>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink">
                  {item.title}
                </p>
                <p className="text-xs text-muted-foreground">{item.line}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const routineSteps: { num: string; step: string; line: string; cat: string }[] = [
  { num: "01", step: "Cleanse", line: "Remove the day without stripping your skin.", cat: "Cleansers" },
  { num: "02", step: "Tone", line: "The first layer of hydration.", cat: "Toners & Essences" },
  { num: "03", step: "Treat", line: "Target what your skin is asking for.", cat: "Serums" },
  { num: "04", step: "Moisturise", line: "Seal in hydration. Support the barrier.", cat: "Moisturisers" },
  { num: "05", step: "Protect", line: "Your final morning step. Every day.", cat: "SPF" },
  { num: "06", step: "Mask", line: "The extra step when your skin asks for more.", cat: "Masks" },
];

function CategoryTile({ c, s }: { c: (typeof categories)[number]; s: (typeof routineSteps)[number] }) {
  return (
    <Link
      to="/shop"
      search={c.search}
      className="group flex flex-col border border-foreground/12 bg-paper p-6 transition-colors hover:border-foreground/30 md:p-8"
    >
      <div className="flex items-baseline gap-3">
        <span className="font-display text-sm italic leading-none text-ink/35">{s.num}</span>
        <span className="h-px flex-1 bg-foreground/12" />
      </div>
      <div className="flex flex-1 items-center justify-center py-8">
        <img
          src={c.img}
          alt={`${s.step} — ${c.label}`}
          loading="lazy"
          className="max-h-[220px] w-full object-contain transition-transform duration-700 motion-reduce:transition-none group-hover:scale-[1.03]"
        />
      </div>
      <h3 className="font-display text-2xl leading-tight text-ink">{s.step}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink/65">{s.line}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink">
        Explore {s.step.toLowerCase()}
        <span className="transition-transform duration-300 motion-reduce:transition-none group-hover:translate-x-1">
          →
        </span>
      </span>
    </Link>
  );
}

function Categories() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="flex flex-wrap items-end justify-between gap-8">
        <div className="max-w-2xl">
          <p className="eyebrow eyebrow-rule text-clay">The ritual, step by step</p>
          <h2 className="display-section mt-4 text-ink">
            Six steps. Use only what your skin needs.
          </h2>
          <p className="mt-5 max-w-xl text-ink/70">
            Korean skincare doesn’t have to mean ten products. Start with the essentials, then add
            the steps that earn their place.
          </p>
        </div>
        <Link
          to="/shop"
          className="hidden text-[11px] font-semibold uppercase tracking-[0.22em] text-ink underline underline-offset-4 hover:text-clay md:inline"
        >
          Browse all →
        </Link>
      </div>
      <div className="mt-12 grid gap-px bg-foreground/10 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c, i) => (
          <CategoryTile key={c.name} c={c} s={routineSteps[i]!} />
        ))}
      </div>
      <div className="mt-8 md:hidden">
        <Link
          to="/shop"
          className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink underline underline-offset-4"
        >
          Browse all →
        </Link>
      </div>
    </section>
  );
}


function Concerns() {
  return (
    <section className="bg-sand">

      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid items-end gap-6 md:grid-cols-2">
          <div>
            <p className="eyebrow eyebrow-rule text-clay">Shop by Concern</p>
            <h2 className="display-section mt-4 text-ink">
              Tell us your skin.<br />
              <span className="italic text-hanbok-deep">We'll match the ritual.</span>
            </h2>
          </div>
          <p className="text-base text-ink/70">
            Every face is different. We use what you tell us about your skin, your climate, and your routine to build a Korean ritual that actually fits you.
          </p>
        </div>


        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {concerns.map((c) => (
            <Link
              key={c.name}
              to="/shop"
              search={{ concern: c.slug }}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${c.color} to-paper p-7 lift`}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-hanbok-deep">Concern</p>
              <h3 className="mt-4 font-display text-2xl text-ink">{c.name}</h3>
              <p className="mt-2 text-sm text-ink/70">{c.desc}</p>
              <span className="mt-8 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Shop the edit
                <span className="transition-transform group-hover:translate-x-1">→</span>
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
  bundle: { products: { img: string; alt: string }[]; tag: string; name: string };
  explainer?: string;
}) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div
      className="relative aspect-[5/3] overflow-hidden bg-sand"
      onMouseEnter={() => setRevealed(true)}
      onMouseLeave={() => setRevealed(false)}
      onFocus={() => setRevealed(true)}
      onBlur={() => setRevealed(false)}
    >
      <div
        className={`grid h-full w-full transition-opacity duration-300 ${revealed ? "opacity-0" : "opacity-100"}`}
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
          alt={`What's inside the ${bundle.name} bundle`}
          loading="lazy"
          aria-hidden={!revealed}
          className={`pointer-events-none absolute inset-0 h-full w-full bg-paper object-contain transition-opacity duration-300 ${
            revealed ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      <span className="absolute left-4 top-4 z-10 rounded-full bg-paper/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-hanbok-deep backdrop-blur">
        {bundle.tag}
      </span>

      {explainer && (
        <button
          type="button"
          onClick={() => setRevealed((v) => !v)}
          className="absolute bottom-3 right-3 z-10 rounded-full bg-ink/85 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-paper md:hidden"
        >
          {revealed ? "Hide" : "What's inside"}
        </button>
      )}
    </div>
  );
}

function BundleOffer() {
  const { buy, modal } = useBuyNow();

  // Totals are computed live from the current catalog prices — never hardcoded.
  const bundles = BUNDLE_DEFINITIONS.map((b) => ({ ...b, ...bundleMath(b.includes, b.price) }));
  const maxSave = Math.max(...bundles.map((b) => b.save));

  return (
    <section id="bundles" className="scroll-mt-20 bg-secondary">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-hanbok-deep/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-hanbok-deep">
              <span className="h-1.5 w-1.5 rounded-full bg-clay" /> Advisor-built bundles
            </p>
            <h2 className="mt-4 display-section text-ink">
              Skip the guesswork.<br />
              <span className="italic text-hanbok-deep">Save up to A${maxSave}.</span>
            </h2>
            <p className="mt-4 max-w-md text-sm text-ink/70">
              Advisor-built bundles, sealed direct from Seoul. Cheaper than buying each step alone — and they arrive next day to metro and most regional areas (remote postcodes may take 1–2 extra days).
            </p>
          </div>
          <ul className="grid gap-2 text-sm text-ink/80 md:text-right">
            <li>✓ Save up to {Math.max(...bundles.map((b) => b.percent))}% vs. individual prices</li>
            <li>✓ Free express shipping, every bundle</li>
            <li>✓ 30-day glow-or-refund guarantee</li>
            <li>✓ Free routine card + samples inside</li>
          </ul>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {bundles.map((b) => {
            const explainer = BUNDLE_EXPLAINERS[b.priceId];
            return (
            <article
              key={b.name}
              className={`relative flex flex-col overflow-hidden rounded-3xl border bg-paper transition-all duration-500 lift group ${
                b.featured
                  ? "border-hanbok shadow-[0_30px_60px_-30px_rgba(46,63,110,0.45)] md:-translate-y-3"
                  : "border-border/70"
              }`}
            >
              {b.featured && (
                <div className="absolute right-4 top-4 z-10 rounded-full bg-hanbok px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-paper">
                  Advisor pick
                </div>
              )}
              <BundleCardMedia bundle={b} explainer={explainer} />
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-2xl leading-tight text-ink">{b.name}</h3>
                <p className="mt-2 text-sm text-ink/70">{b.desc}</p>

                <ul className="mt-5 space-y-2 text-sm text-ink/80">
                  {b.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-hanbok" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex items-end gap-3 border-t border-border/60 pt-5">
                  <p className="font-display text-3xl text-ink">A${b.price}</p>
                  <p className="pb-1 text-sm text-muted-foreground line-through">A${b.original}</p>
                  <p className="ml-auto pb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-clay">
                    Save A${b.save}
                  </p>
                </div>

                <button
                  onClick={() => buy({ priceId: b.priceId, name: b.name, priceLabel: `A$${b.price}` })}
                  className={`mt-5 w-full rounded-full py-3.5 text-xs font-semibold uppercase tracking-[0.22em] transition ${
                    b.featured
                      ? "bg-hanbok text-paper hover:bg-hanbok-deep"
                      : "bg-ink text-paper hover:bg-hanbok"
                  }`}
                >
                  Buy this bundle
                </button>
              </div>
            </article>
            );
          })}
        </div>

        <p className="mt-8 text-center text-xs uppercase tracking-[0.22em] text-muted-foreground">
          30-day satisfaction guarantee · Free express shipping · Authenticity card included
        </p>
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
              src={categoryMasks}
              alt="A curated flatlay of Korean sheet masks in their original branded packaging, including Abib, Medicube, Mixsoon and Torriden"
              loading="lazy"
              className="h-full w-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-ink/50" />
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
            K-beauty should feel exciting, not uncertain. SkinGrocer is built around a simple
            standard: genuine products, clear product information and a more considered way to shop
            Korean skincare in Australia.
          </p>

          <ul className="mt-10 grid border-l border-t border-paper/10 md:grid-cols-2">
            {principles.map((p, i) => (
              <li
                key={p.t}
                className="border-b border-r border-paper/10 px-5 py-6 md:px-6 md:py-7"
              >
                <span className="font-display text-xs italic text-paper/30">
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
    <section className="relative overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <img
          src={applyingSerum.url}
          alt="Woman applying a lightweight Korean serum to her face in soft natural light"
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/40 to-ink/20" />
      </div>
      <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-28 md:grid-cols-2 md:items-center">
        <div className="text-paper">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">The daily ritual</p>
          <h2 className="mt-4 max-w-md font-display text-4xl leading-tight md:text-5xl">
            Skincare that fits into <span className="italic">real life.</span>
          </h2>
          <p className="mt-5 max-w-lg text-paper/80">
            Two minutes in the morning, two at night. We build routines that work for busy mums,
            shift workers, students — anyone who wants healthy skin without the 10-step confusion.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/consultation" className="rounded-full bg-paper px-7 py-3.5 text-sm font-medium text-ink hover:bg-accent">
              Build your routine
            </Link>
            <Link to="/shop" className="rounded-full border border-paper/40 px-7 py-3.5 text-sm font-medium text-paper hover:bg-paper/10">
              Shop the ritual
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}


function IngredientStrip() {
  return (
    <section className="border-b border-border bg-paper py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow eyebrow-rule text-clay">THE INGREDIENT LIBRARY</p>
            <h2 className="mt-4 font-display text-3xl leading-tight text-ink md:text-4xl">
              Know what earns a place on your skin.
            </h2>
            <p className="mt-4 max-w-xl text-sm text-ink/70">
              Six ingredients you’ll see often in Korean skincare — and the simple reason each one matters.
            </p>
          </div>
          <Link
            to="/learn"
            className="group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink transition hover:text-hanbok-deep"
          >
            Explore ingredients
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>

        <ul className="grid border-l border-t border-border md:grid-cols-2 lg:grid-cols-3">
          {ingredients.map((ing, i) => (
            <li
              key={ing.name}
              className="group border-b border-r border-border px-5 py-6 md:px-6 md:py-7"
            >
              <div className="flex items-baseline gap-4">
                <span className="font-display text-xs italic text-ink/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-col">
                  <span className="font-display text-xl text-ink transition-colors group-hover:text-hanbok-deep">
                    {ing.name}
                  </span>
                  <span className="mt-1 text-[12px] uppercase tracking-[0.14em] text-ink/60">
                    {ing.role}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function RitualCTA() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={ritualScene} alt="" loading="lazy" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-hanbok-deep/85 via-hanbok-deep/70 to-hanbok-deep/30" />
      </div>
      <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-28 md:grid-cols-2 md:items-center">
        <div className="text-paper">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">Subscribe & Save</p>
          <h2 className="mt-4 font-display text-4xl md:text-6xl">
            Your routine,<br />
            <span className="italic">never out of stock.</span>
          </h2>
          <p className="mt-5 max-w-lg text-paper/80">
            Set a refill rhythm for your essentials — 30, 45, 60 or 90 days.
            Save 10% on every shipment, pause or skip any time, and we'll
            even swap in samples of new arrivals you'll love.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/shop" className="rounded-full bg-paper px-7 py-3.5 text-sm font-medium text-ink hover:bg-accent">
              Browse subscribable products
            </Link>
            <Link to="/journey" className="rounded-full border border-paper/40 px-7 py-3.5 text-sm font-medium text-paper hover:bg-paper/10">
              See how it works
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}


function ReviewsCarousel() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % reviews.length), 5500);
    return () => clearInterval(t);
  }, []);
  return (
    <section className="bg-sand">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 md:grid-cols-12 md:items-center">
        <div className="md:col-span-5">
          <p className="eyebrow eyebrow-rule text-clay">Customer Notes</p>
          <h2 className="display-section mt-4 text-ink">
            Real feedback from <span className="italic text-hanbok-deep">real customers.</span>
          </h2>
          <p className="mt-5 text-ink/70">From real customers across Melbourne, Sydney and beyond.</p>
          <Link to="/reviews" className="mt-8 inline-flex text-sm font-medium text-primary underline-grow">
            Read all reviews →
          </Link>
        </div>
        <div className="relative md:col-span-7">
          <div className="rounded-3xl border border-border bg-paper p-10 shadow-[0_30px_60px_-40px_rgba(46,63,110,0.3)]">
            <p className="font-display text-2xl leading-snug text-ink md:text-3xl">
              "{reviews[i].quote}"
            </p>
            <p className="mt-6 text-[11px] uppercase tracking-[0.22em] text-clay">{reviews[i].name}</p>
          </div>
          <div className="mt-6 flex gap-2">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                className={`h-1 rounded-full transition-all ${idx === i ? "w-10 bg-hanbok" : "w-4 bg-ink/15"}`}
                aria-label={`Review ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function NewsletterStrip() {
  return (
    <section className="bg-secondary">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 px-6 py-20 text-center">
        <p className="eyebrow eyebrow-rule text-clay">The Skin Grocer Drop</p>
        <h2 className="display-section text-ink">
          Restock alerts, routine guides, Seoul intel.
        </h2>
        <p className="max-w-xl text-ink/70">
          New arrivals before they sell through, advisor-built routine notes and
          the occasional Seoul travel diary. One email a week, no spam.
        </p>
        <NewsletterForm source="homepage" />
      </div>
    </section>
  );
}
