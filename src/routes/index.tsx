import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useBuyNow } from "@/hooks/use-buy-now";
import { NewsletterForm } from "@/components/newsletter-form";
import { bundleMath, BUNDLE_DEFINITIONS, bundleSavingsSummary } from "@/lib/shop-catalog";
import glassSkinStarterExplainer from "@/assets/bundle-explainers/glass-skin-starter.png.asset.json";
import completeGlowExplainer from "@/assets/bundle-explainers/complete-glow-edit.png.asset.json";
import calmClearExplainer from "@/assets/bundle-explainers/calm-clear-bundle.png.asset.json";
import applyingSerum from "@/assets/applying-serum.png.asset.json";
import authenticityCard from "@/assets/authenticity-card.png.asset.json";
import brandLineup from "@/assets/brand-lineup.png.asset.json";
import heroVideo from "@/assets/hero-video.mp4.asset.json";
import textureMacro from "@/assets/texture-macro.jpg";
import ritualScene from "@/assets/ritual-scene.jpg";
import brandSpotlight from "@/assets/brand-spotlight.jpg";
import customers from "@/assets/customers.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Skin Grocer — Authentic Korean Skincare, Next-Day from Melbourne" },
      { name: "description", content: "Melbourne's destination for authentic K-beauty and premium imports. Locally stocked, expertly guided, dispatched next-day across Australia." },
      { property: "og:title", content: "Skin Grocer — Authentic Korean Skincare, Next-Day from Melbourne" },
      { property: "og:description", content: "Melbourne's destination for authentic K-beauty and premium imports. Locally stocked, expertly guided, dispatched next-day across Australia." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

const categories: { name: string; count: string; img: string; label: string; search: { category: "cleanse" | "tone" | "treat" | "moisturise" | "protect" | "masks" } }[] = [
  { name: "Cleansers", count: "Melt & rinse", img: "/products/beplain/mung-bean-cleansing-oil-200ml.png", label: "beplain Mung Bean Cleansing Oil", search: { category: "cleanse" } },
  { name: "Toners & Essences", count: "Prep & hydrate", img: "/products/wellage/real-hyaluronic-toner-200ml.png", label: "WELLAGE Real Hyaluronic Toner", search: { category: "tone" } },
  { name: "Serums", count: "Treat & target", img: "/products/medicube/pdrn-pink-peptide-serum-30ml.png", label: "MEDICUBE PDRN Pink Peptide Serum", search: { category: "treat" } },
  { name: "Moisturisers", count: "Seal & protect", img: "/products/aestura/atobarrier365-cream.png", label: "AESTURA Atobarrier365 Cream", search: { category: "moisturise" } },
  { name: "SPF", count: "Everyday defence", img: "/products/aestura/derma-uv365-barrier-moisture-mineral-sun-cream.png", label: "AESTURA Derma UV365 Mineral Sun Cream", search: { category: "protect" } },
  { name: "Masks", count: "Sheet & overnight masks", img: "/products/biodance/bio-collagen-real-deep-mask.png", label: "BIODANCE Bio Collagen Real Deep Mask", search: { category: "masks" } },
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

const journal: { tag: string; title: string; read: string; slug: string }[] = [
  { tag: "Routines", title: "The 10-step routine, demystified", read: "6 min", slug: "the-10-step-routine-demystified" },
  { tag: "Ingredients", title: "Snail mucin: why your skin actually loves it", read: "4 min", slug: "snail-mucin-why-your-skin-loves-it" },
  { tag: "Australia", title: "Sunscreen, every single day", read: "5 min", slug: "sunscreen-every-single-day" },
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
      <Hero />
      <Promise />
      <ProvenanceCard />
      <WhyPillars />
      <BundleOffer />
      <Categories />
      <Concerns />
      <LearnStrip />

      <ApplicationMoment />
      <BrandMarquee />
      <IngredientStrip />
      <RitualCTA />
      <ParallaxScene />
      <JournalPreview />
      <ReviewsCarousel />
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
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">Why Skin Grocer</p>
          <h2 className="mt-3 font-display text-4xl text-ink md:text-5xl">
            Australia's K-beauty grocer,<br />
            <span className="italic text-hanbok-deep">for every skincare ritual.</span>
          </h2>
          <p className="mt-5 max-w-xl text-ink/70">
            We're a Melbourne-based retailer of authentic Korean skincare — locally stocked,
            honestly priced, and here to guide you from your first cleanse to your final SPF.
          </p>
        </div>

        {/* Personal consultation — the core differentiator */}
        <div className="mt-12 overflow-hidden rounded-3xl bg-ink text-paper">
          <div className="grid md:grid-cols-5">
            <div className="p-8 md:col-span-3 md:p-12">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
                  <SparkleIcon className="h-3.5 w-3.5" />
                  Free · 2 minutes
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-paper/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-paper/70">
                  Made for you
                </span>
              </div>
              <h3 className="mt-6 font-display text-3xl leading-tight md:text-4xl">
                Your personal K-beauty consultation
              </h3>
              <p className="mt-4 max-w-lg text-paper/75">
                Not sure where to start? Answer a few questions and we'll build a routine around your skin type, your concerns, and your budget — then explain every step so you never feel lost.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/consultation"
                  className="group inline-flex items-center gap-2.5 rounded-full bg-paper px-8 py-4 text-xs font-semibold uppercase tracking-[0.24em] text-ink transition hover:bg-accent"
                >
                  Take the 2-minute quiz
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
                <Link
                  to="/journey"
                  className="inline-flex items-center gap-2 text-sm font-medium text-paper/80 underline-offset-4 transition hover:text-paper hover:underline"
                >
                  See how it works
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-4 text-xs uppercase tracking-[0.18em] text-paper/55">
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  Curated for Australian skin
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  No spam, no obligation
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  Real products, real results
                </span>
              </div>
            </div>
            <div className="relative hidden items-center justify-center bg-hanbok-deep/15 md:col-span-2 md:flex">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(circle at 70% 30%, var(--accent), transparent 50%)` }} />
              <div className="relative text-center">
                <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border border-paper/20 bg-paper/10 backdrop-blur">
                  <SparkleIcon className="h-12 w-12 text-accent" />
                </div>
                <p className="mt-5 text-[10px] uppercase tracking-[0.2em] text-paper/60">Personalised to you</p>
              </div>
            </div>
          </div>
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



function BrandMarquee() {
  const brands = [
    "AESTURA", "BIODANCE", "Beauty of Joseon", "Dr.G", "HARUHARU WONDER",
    "ISNTREE", "MEDICUBE", "ROUND LAB", "S.NATURE", "TIRTIR",
    "TORRIDEN", "WELLAGE", "beplain",
  ];
  const row = [...brands, ...brands];
  return (
    <section className="overflow-hidden border-y border-border bg-ink py-16 text-paper">
      <div className="mx-auto mb-8 max-w-7xl px-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">The Brand Cabinet</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl leading-tight md:text-4xl">
          13 hand-picked Korean labels, <span className="italic text-accent">all under one Australian roof.</span>
        </h2>
      </div>
      <div className="flex animate-marquee gap-10 whitespace-nowrap">
        {row.map((b, i) => (
          <span key={i} className="inline-flex items-center gap-10 font-display text-3xl tracking-tight text-paper/80 md:text-4xl">
            {b}
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
        ))}
      </div>
      <div className="mx-auto mt-10 max-w-7xl px-6">
        <Link to="/brands" className="inline-flex items-center gap-2 rounded-full border border-paper/30 px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-paper transition hover:bg-paper hover:text-ink">
          Browse all brands →
        </Link>
      </div>
    </section>
  );
}

function PromoBar() {
  const { maxPercent } = bundleSavingsSummary();
  const messages = [
    `Save up to ${maxPercent}% on advisor-built bundles`,
    "Free express AU shipping on every bundle",
    "Bundle + Subscribe = an extra 10% off, forever",
    "Free routine card + samples in every bundle",
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % messages.length), 3500);
    return () => clearInterval(t);
  }, [messages.length]);
  return (
    <Link
      to="/"
      hash="bundles"
      className="block bg-hanbok-deep text-paper transition hover:bg-hanbok"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-6 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.22em]">
        <span className="hidden h-1.5 w-1.5 rounded-full bg-accent sm:inline-block" />
        <span className="transition-opacity duration-500">{messages[i]}</span>
        <span className="text-accent">Shop bundles →</span>
      </div>
    </Link>
  );
}

function ParallaxScene() {
  return (
    <section
      className="relative min-h-[80vh] overflow-hidden bg-ink"
      aria-label="Glass skin in motion"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat md:bg-fixed"
        style={{ backgroundImage: `url(${brandLineup.url})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/10 to-ink/60" />
      <div className="relative mx-auto flex min-h-[80vh] max-w-7xl flex-col items-start justify-end px-6 py-24">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">Glass skin, decoded</p>
        <h2 className="mt-4 max-w-2xl font-display text-4xl leading-tight text-paper md:text-6xl">
          The Korean approach: <span className="italic">layer light, hold water, protect glow.</span>
        </h2>
        <p className="mt-5 max-w-xl text-paper/80">
          Hydration first, occlusion last, sunscreen always. A philosophy we've imported,
          translated, and stocked locally for Australian skin.
        </p>
      </div>
    </section>
  );
}



function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <video
          key={heroVideo.url}
          src={heroVideo.url}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-label="Models with glowing glassy skin laughing"
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-hanbok-deep/35 via-ink/20 to-hanbok-deep/70" />
      </div>

      <div className="relative mx-auto flex min-h-[86vh] max-w-7xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="flex max-w-3xl flex-col items-center gap-5">
          <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-paper/75">
            Melbourne · Authentic Korean skincare
          </span>

          <h1 className="font-display text-7xl leading-[0.9] text-paper md:text-[8.5rem] lg:text-[10rem]">
            skin grocer
          </h1>

          <p className="max-w-2xl text-balance font-display text-2xl leading-snug text-paper/95 md:text-3xl">
            Sourced from Seoul, stocked in Melbourne,{" "}
            <span className="italic text-accent">matched to your skin</span>.
          </p>

          <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row">
            <Link
              to="/shop"
              className="group inline-flex items-center gap-3 rounded-full bg-paper px-10 py-4 text-xs font-semibold uppercase tracking-[0.28em] text-ink transition duration-300 hover:-translate-y-0.5 hover:bg-accent hover:shadow-[0_18px_40px_-18px_var(--color-accent)]"
            >
              Shop now
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
            <Link
              to="/consultation"
              className="group inline-flex items-center gap-2.5 rounded-full border border-paper/50 bg-transparent px-8 py-4 text-xs font-semibold uppercase tracking-[0.24em] text-paper transition duration-300 hover:-translate-y-0.5 hover:border-accent hover:bg-paper/10 hover:shadow-[0_18px_40px_-22px_var(--color-accent)]"
            >
              <SparkleIcon className="h-4 w-4 text-accent transition-transform duration-500 group-hover:rotate-90" />
              <span>Take the 2-minute skin quiz</span>
            </Link>
          </div>
        </div>

      </div>


      {/* Floating ticker */}
      <div className="relative border-t border-paper/15 bg-ink/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 overflow-x-auto px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-paper/70 no-scrollbar">
          {["Sourced direct from Seoul", "Sealed & batch-checked", "Next-day VIC delivery", "Express AU shipping", "Advisor-built routines"].map((t) => (
            <span key={t} className="flex items-center gap-3 whitespace-nowrap">
              <span className="h-1 w-1 rounded-full bg-accent" />
              {t}
            </span>
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
  return (
    <section className="border-y border-border/60 bg-paper">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 py-16 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">The Learn Hub</p>
        <h2 className="max-w-2xl font-display text-4xl text-ink md:text-5xl">
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
    { t: "100% Authentic", d: "Direct from Korea, batch-verified, sealed." },
    { t: "Next-Day from MEL*", d: "Order by 12pm, on your doorstep tomorrow — metro and most regional areas; remote postcodes may take 1–2 extra days." },
    { t: "Expert Guidance", d: "Real advisors reply within 1 business hour." },
    { t: "Subscribe & Save 10%", d: "Routine refills, paused or skipped any time." },
  ];
  return (
    <section className="border-b border-border/60 bg-paper">
      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-10 md:grid-cols-4">
        {items.map((i) => (
          <div key={i.t} className="flex items-start gap-3">
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-hanbok" />
            <div>
              <p className="text-sm font-semibold text-ink">{i.t}</p>
              <p className="mt-1 text-xs text-muted-foreground">{i.d}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Categories() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">Shop by Category</p>
          <h2 className="mt-3 font-display text-4xl text-ink md:text-5xl">Every step of the ritual.</h2>
        </div>
        <Link to="/shop" className="hidden text-sm font-medium text-primary underline-grow md:inline">Browse all →</Link>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c, i) => (
          <Link
            key={c.name}
            to="/shop"
            search={c.search}
            className={`group relative aspect-[4/3] overflow-hidden rounded-3xl lift ${
              i % 3 === 0 ? "bg-sand" : i % 3 === 1 ? "bg-secondary" : "bg-sand-deep/50"
            }`}
          >

            <img
              src={c.img}
              alt={`${c.name} — ${c.label}`}
              loading="lazy"
              className="h-full w-full object-contain p-8 transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <p className="font-display text-2xl text-paper">{c.name}</p>
              <p className="text-[11px] uppercase tracking-[0.18em] text-paper/75">{c.count}</p>
            </div>
          </Link>
        ))}
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
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">Shop by Concern</p>
            <h2 className="mt-3 font-display text-4xl text-ink md:text-5xl">
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
  starter_bundle_onetime: glassSkinStarterExplainer.url,
  complete_glow_bundle_onetime: completeGlowExplainer.url,
  calm_clear_bundle_onetime: calmClearExplainer.url,
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
            <h2 className="mt-4 font-display text-4xl text-ink md:text-5xl">
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
  return (
    <section className="bg-ink text-paper">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 md:grid-cols-2 md:items-center">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-ink">
          <img
            src={authenticityCard.url}
            alt="Skin Grocer authenticity card surrounded by AESTURA, Beauty of Joseon and MEDICUBE products"
            loading="lazy"
            className="h-full w-full object-cover"
          />
          <div className="absolute left-4 top-4 rounded-full border border-paper/20 bg-ink/60 px-4 py-2 backdrop-blur">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">Provenance card</p>
          </div>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">The Authenticity Promise</p>
          <h2 className="mt-4 font-display text-4xl text-paper md:text-5xl">
            Every order arrives with a <em className="text-accent">provenance card.</em>
          </h2>
          <p className="mt-5 max-w-lg text-paper/70">
            We source direct from Korean distributors and verify every batch on arrival
            in Melbourne. The card in your parcel traces your product from factory floor
            to your bathroom shelf — manufacture date, import lot, expiry, the works.
          </p>
          <ul className="mt-8 grid gap-4 text-sm md:grid-cols-2">
            {["Sealed, batch-coded, never decanted", "Cold-chain stored in Melbourne", "Cruelty-free shipping materials", "Lifetime authenticity guarantee"].map((b) => (
              <li key={b} className="flex items-start gap-3 text-paper/85">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {b}
              </li>
            ))}
          </ul>
          <Link
            to="/about"
            className="mt-10 inline-flex items-center gap-2 rounded-full border border-paper/30 px-7 py-3.5 text-sm font-medium text-paper transition hover:bg-paper hover:text-ink"
          >
            Read our sourcing story →
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
    <section className="overflow-hidden border-b border-border bg-paper py-10">
      <div className="mx-auto mb-6 max-w-7xl px-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">The Ingredient Library</p>
      </div>
      <div className="flex animate-marquee gap-4 whitespace-nowrap">
        {[...ingredients, ...ingredients, ...ingredients].map((i, idx) => (
          <div
            key={idx}
            className="inline-flex items-center gap-4 rounded-full border border-border bg-secondary px-6 py-3"
          >
            <span className="font-display text-lg text-ink">{i.name}</span>
            <span className="h-1 w-1 rounded-full bg-clay" />
            <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{i.role}</span>
          </div>
        ))}
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

function JournalPreview() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">Skin Journal</p>
          <h2 className="mt-3 font-display text-4xl text-ink md:text-5xl">Read before you reach for the dropper.</h2>
        </div>
        <Link to="/journal" className="text-sm font-medium text-primary underline-grow">All articles →</Link>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {journal.map((j, i) => (
          <Link
            key={j.title}
            to="/journal/$slug"
            params={{ slug: j.slug }}
            className="group overflow-hidden rounded-2xl border border-border bg-card lift"
          >

            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={[brandSpotlight, textureMacro, ritualScene][i]}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-clay">
                <span>{j.tag}</span><span>·</span><span>{j.read} read</span>
              </div>
              <h3 className="mt-3 font-display text-xl leading-snug text-ink group-hover:text-primary">
                {j.title}
              </h3>
              <p className="mt-4 text-sm font-medium text-primary">Read article →</p>
            </div>
          </Link>
        ))}
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
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">Customer Notes</p>
          <h2 className="mt-3 font-display text-4xl text-ink md:text-5xl">
            1,200+ reviews. <span className="italic text-hanbok-deep">4.9 stars.</span>
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
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">The Skin Grocer Drop</p>
        <h2 className="font-display text-4xl text-ink md:text-5xl">
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
