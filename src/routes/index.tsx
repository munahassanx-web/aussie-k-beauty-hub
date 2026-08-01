import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useBuyNow } from "@/hooks/use-buy-now";
import applyingSerum from "@/assets/applying-serum.png.asset.json";
import brandLineup from "@/assets/brand-lineup.png.asset.json";
import heroVideo from "@/assets/hero-video.mp4.asset.json";
import productFlatlay from "@/assets/product-flatlay.jpg";
import textureMacro from "@/assets/texture-macro.jpg";
import ritualScene from "@/assets/ritual-scene.jpg";
import brandSpotlight from "@/assets/brand-spotlight.jpg";
import skinMacro from "@/assets/skin-macro.jpg";
import customers from "@/assets/customers.jpg";
import categoryMasks from "@/assets/category-masks.jpg";

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

const categories: { name: string; count: string; img: string; search: { category: "cleanse" | "tone" | "treat" | "moisturise" | "protect" | "masks" } }[] = [
  { name: "Cleansers", count: "Melt & rinse", img: textureMacro, search: { category: "cleanse" } },
  { name: "Toners & Essences", count: "Prep & hydrate", img: ritualScene, search: { category: "tone" } },
  { name: "Serums", count: "Treat & target", img: productFlatlay, search: { category: "treat" } },
  { name: "Moisturisers", count: "Seal & protect", img: brandSpotlight, search: { category: "moisturise" } },
  { name: "SPF", count: "Everyday defence", img: skinMacro, search: { category: "protect" } },
  { name: "Masks", count: "Weekly rituals", img: categoryMasks, search: { category: "masks" } },
];


const concerns: { name: string; desc: string; color: string; slug: "hydration" | "acne" | "pigmentation" | "sensitivity" }[] = [
  { name: "Hydration & Glow", desc: "Plump, dewy, glass-skin finish", color: "from-hanbok/15", slug: "hydration" },
  { name: "Acne & Breakouts", desc: "Calm congestion, balance oil", color: "from-clay/20", slug: "acne" },
  { name: "Pigmentation", desc: "Brighten and even skin tone", color: "from-sand-deep/40", slug: "pigmentation" },
  { name: "Sensitivity", desc: "Repair and soothe the barrier", color: "from-hanbok/10", slug: "sensitivity" },
];

const bestsellers: { brand: string; name: string; price: number; rating: number; reviews: number; tag: string; priceId: string }[] = [
  { brand: "COSRX", name: "Advanced Snail 96 Mucin Power Essence", price: 32, rating: 4.9, reviews: 1284, tag: "Bestseller", priceId: "snail_essence_onetime" },
  { brand: "Beauty of Joseon", name: "Relief Sun SPF50+", price: 22, rating: 4.9, reviews: 2310, tag: "AU Cult", priceId: "relief_sun_onetime" },
  { brand: "Anua", name: "Heartleaf Soothing Ampoule", price: 38, rating: 4.8, reviews: 902, tag: "Editor's Pick", priceId: "heartleaf_ampoule_onetime" },
  { brand: "SKIN1004", name: "Centella Calming Toner", price: 28, rating: 4.8, reviews: 644, tag: "Restocked", priceId: "centella_toner_onetime" },
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
      <WhyPillars />
      <BundleOffer />
      <Categories />
      <Concerns />
      <ApplicationMoment />
      <Bestsellers />
      <BrandMarquee />
      <ProvenanceCard />


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
    "COSRX", "Beauty of Joseon", "Anua", "Round Lab", "SKIN1004", "Numbuzin",
    "Abib", "Mixsoon", "Haruharu Wonder", "Isntree", "Klairs", "Pyunkang Yul",
    "TIRTIR", "Mediheal", "Some By Mi", "Torriden", "Kahi", "Rom&nd",
    "Laneige", "Dr. Jart+", "Innisfree", "Etude", "Missha", "Purito",
    "iUNIK", "Manyo", "Peripera", "Kaine", "Sulwhasoon", "d'Alba",
  ];
  const row = [...brands, ...brands];
  return (
    <section className="overflow-hidden border-y border-border bg-ink py-16 text-paper">
      <div className="mx-auto mb-8 max-w-7xl px-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">The Brand Cabinet</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl leading-tight md:text-4xl">
          30+ authentic Korean labels, <span className="italic text-accent">all under one Australian roof.</span>
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
  const messages = [
    "Limited drop · Save up to 25% on advisor-built bundles",
    "Free express AU shipping on every bundle",
    "Bundle + Subscribe = an extra 10% off, forever",
    "Only 48 Glow Edit kits left this week",
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

        <div className="absolute inset-0 bg-gradient-to-b from-ink/35 via-ink/20 to-ink/65" />
      </div>

      <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col items-center justify-center px-6 py-12 text-center">
        <div className="flex max-w-3xl flex-col items-center gap-5">
          <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-paper/75">
            Melbourne · Est. by skin nerds
          </span>

          <h1 className="font-display text-7xl leading-[0.9] text-paper md:text-[8.5rem] lg:text-[10rem]">
            skin grocer
          </h1>

          <div className="mt-4 flex flex-col items-center gap-3">
            <p className="max-w-3xl text-balance font-display text-2xl leading-snug text-paper/95 md:text-3xl lg:text-4xl">
              Most skincare advice is built for someone else's climate —{" "}
              <span className="italic text-accent">not yours.</span>
            </p>
            <p className="max-w-md text-xs uppercase tracking-[0.22em] text-paper/60">
              Korean skincare, curated and delivered for Australian skin.
            </p>
          </div>

          {/* Trust badges */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {[
              "Sourced Direct from Seoul",
              "Authenticity Verified",
              "Order by 12pm, on your doorstep tomorrow",
              "Built for Your Skin",
            ].map((b) => (
              <span
                key={b}
                className="inline-flex items-center gap-2 rounded-full border border-paper/25 bg-paper/10 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-paper/90 backdrop-blur-sm"
              >
                <span className="h-1 w-1 rounded-full bg-accent" />
                {b}
              </span>
            ))}
          </div>

          {/* Provenance supporting line */}
          <p className="mt-2 max-w-md text-balance text-xs leading-relaxed text-paper/65">
            Every order arrives batch-verified, with a provenance card tracing it from Seoul to your door.
          </p>

          <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row">
            <Link
              to="/shop"
              className="group inline-flex items-center gap-3 rounded-full bg-paper px-10 py-4 text-xs font-semibold uppercase tracking-[0.28em] text-ink transition hover:bg-accent"
            >
              Shop now
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              to="/consultation"
              className="group inline-flex items-center gap-2.5 rounded-full border border-paper/50 bg-transparent px-8 py-4 text-xs font-semibold uppercase tracking-[0.24em] text-paper transition hover:border-paper hover:bg-paper/10"
            >
              <SparkleIcon className="h-4 w-4 text-accent" />
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

function Promise() {
  const items = [
    { t: "100% Authentic", d: "Direct from Korea, batch-verified, sealed." },
    { t: "Next-Day from MEL", d: "Order by 2pm, on your doorstep tomorrow." },
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
      <div className="mt-10 grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        {categories.map((c) => (
          <Link
            key={c.name}
            to="/shop"
            search={c.search}
            className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-secondary lift"
          >

            <img
              src={c.img}
              alt={c.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <p className="font-display text-lg text-paper">{c.name}</p>
              <p className="text-[11px] uppercase tracking-[0.18em] text-paper/70">{c.count}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Concerns() {
  return (
    <section className="bg-secondary">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid items-end gap-6 md:grid-cols-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">Shop by Concern</p>
            <h2 className="mt-3 font-display text-4xl text-ink md:text-5xl">
              Tell us your skin.<br />
              <span className="italic text-hanbok-deep">We'll match the ritual.</span>
            </h2>
          </div>
          <div className="text-base text-ink/70">
            <p>
              Not sure where to start? Our 2-minute skin quiz pairs you with an advisor-built
              routine, every step explained.
            </p>
            <Link to="/consultation" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary underline-grow">
              Start the quiz now →
            </Link>
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

function Bestsellers() {
  const [hover, setHover] = useState<number | null>(null);
  const { buy, modal } = useBuyNow();
  const covers = [productFlatlay, ritualScene, textureMacro, brandSpotlight];
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">Loved by Australia</p>
          <h2 className="mt-3 font-display text-4xl text-ink md:text-5xl">This week's bestsellers.</h2>
        </div>
        <Link to="/shop" className="text-sm font-medium text-primary underline-grow">View all bestsellers →</Link>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {bestsellers.map((p, i) => (
          <article
            key={p.name}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card transition-all duration-500 hover:border-hanbok/40 hover:shadow-[0_24px_50px_-30px_rgba(46,63,110,0.35)]"
          >
            <div className="relative aspect-square overflow-hidden bg-sand">
              <Link to="/shop" search={{ brand: p.brand }} className="block h-full w-full">
              <img
                src={covers[i % 4]}
                alt={p.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute left-3 top-3 rounded-full bg-paper/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-hanbok-deep backdrop-blur">
                {p.tag}
              </span>
              </Link>
              <button
                onClick={() => buy({ priceId: p.priceId, name: p.name, priceLabel: `A$${p.price}` })}
                className={`absolute inset-x-3 bottom-3 rounded-full bg-ink py-3 text-xs font-semibold uppercase tracking-[0.18em] text-paper transition-all duration-300 ${
                  hover === i ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                Quick Add · A${p.price}
              </button>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-clay">{p.brand}</p>
              <h3 className="mt-2 font-display text-lg leading-tight text-ink">{p.name}</h3>
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="text-accent">★★★★★</span>
                <span>{p.rating} ({p.reviews.toLocaleString()})</span>
              </div>
              <div className="mt-4 flex items-end justify-between">
                <p className="font-display text-xl text-ink">A${p.price}</p>
                <span className="text-[11px] uppercase tracking-[0.18em] text-hanbok-deep">Subscribe & save</span>
              </div>
            </div>
          </article>
        ))}
      </div>
      {modal}
    </section>
  );

}

function BundleOffer() {
  const { buy, modal } = useBuyNow();
  const bundles = [
    {
      priceId: "starter_bundle_onetime",
      tag: "Starter Ritual",
      name: "The Glass Skin Starter",
      desc: "A 4-step intro to Korean skincare — cleanse, hydrate, treat, protect.",
      includes: ["Anua Heartleaf Cleansing Oil", "Round Lab 1025 Dokdo Toner", "COSRX Snail 96 Essence", "Beauty of Joseon Relief Sun SPF50+"],
      original: 138,
      price: 109,
      save: 29,
      img: productFlatlay,
      featured: false,
    },
    {
      priceId: "complete_glow_bundle_onetime",
      tag: "Best Value · Save 25%",
      name: "The Complete Glow Edit",
      desc: "Our most-loved 7-step ritual, advisor-built. A full month of glass-skin results.",
      includes: ["Double cleanse duo", "Hydrating toner + essence", "Brightening serum", "Barrier moisturiser", "SPF50+ finish", "Free overnight mask"],
      original: 264,
      price: 198,
      save: 66,
      img: ritualScene,
      featured: true,
    },
    {
      priceId: "calm_clear_bundle_onetime",
      tag: "Concern Kit",
      name: "Calm & Clear Bundle",
      desc: "For breakout-prone, sensitive skin. Centella, heartleaf and gentle actives.",
      includes: ["Anua Heartleaf 77% Toner", "SKIN1004 Madagascar Centella Ampoule", "Beauty of Joseon Calming Serum", "Numbuzin Soothing Cream"],
      original: 156,
      price: 124,
      save: 32,
      img: textureMacro,
      featured: false,
    },
  ];

  return (
    <section id="bundles" className="scroll-mt-20 bg-secondary">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-hanbok-deep/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-hanbok-deep">
              <span className="h-1.5 w-1.5 rounded-full bg-clay" /> Limited drop · This week only
            </p>
            <h2 className="mt-4 font-display text-4xl text-ink md:text-5xl">
              Skip the guesswork.<br />
              <span className="italic text-hanbok-deep">Save up to A$66.</span>
            </h2>
            <p className="mt-4 max-w-md text-sm text-ink/70">
              Advisor-built bundles, sealed direct from Seoul. Cheaper than buying each step alone — and they arrive tomorrow.
            </p>
          </div>
          <ul className="grid gap-2 text-sm text-ink/80 md:text-right">
            <li>✓ Save up to 25% vs. individual prices</li>
            <li>✓ Free express shipping, every bundle</li>
            <li>✓ 30-day glow-or-refund guarantee</li>
            <li>✓ Free routine card + samples inside</li>
          </ul>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {bundles.map((b) => (
            <article
              key={b.name}
              className={`relative flex flex-col overflow-hidden rounded-3xl border bg-paper transition-all duration-500 lift ${
                b.featured
                  ? "border-hanbok shadow-[0_30px_60px_-30px_rgba(46,63,110,0.45)] md:-translate-y-3"
                  : "border-border/70"
              }`}
            >
              {b.featured && (
                <div className="absolute right-4 top-4 z-10 rounded-full bg-hanbok px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-paper">
                  Most popular
                </div>
              )}
              <div className="relative aspect-[5/3] overflow-hidden bg-sand">
                <img src={b.img} alt={b.name} loading="lazy" className="h-full w-full object-cover" />
                <span className="absolute left-4 top-4 rounded-full bg-paper/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-hanbok-deep backdrop-blur">
                  {b.tag}
                </span>
              </div>
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
          ))}
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
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-gradient-to-br from-hanbok-deep/40 to-ink">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,_rgba(234,215,178,0.25),_transparent_70%)]" />
          <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-paper/15 bg-ink/70 p-5 backdrop-blur">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">Provenance card</p>
            <p className="mt-3 font-display text-xl text-paper">Batch BJ-24-0719 · Sealed in Seoul</p>
            <div className="mt-3 grid grid-cols-3 gap-3 text-xs text-paper/70">
              <div><p className="text-paper/50">Manufactured</p><p>2024 · 07 · 19</p></div>
              <div><p className="text-paper/50">Imported</p><p>2024 · 08 · 02</p></div>
              <div><p className="text-paper/50">Expires</p><p>2027 · 07 · 19</p></div>
            </div>
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
            3,400+ reviews. <span className="italic text-hanbok-deep">4.9 stars.</span>
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
          10% off your first ritual.
        </h2>
        <p className="max-w-xl text-ink/70">
          Restock alerts, routine guides and the occasional Seoul travel diary.
          One email a week, no spam.
        </p>
        <form className="mt-3 flex w-full max-w-md overflow-hidden rounded-full border border-ink/15 bg-paper">
          <input
            type="email"
            placeholder="your@email.com"
            className="w-full bg-transparent px-5 py-3.5 text-sm text-ink placeholder:text-ink/40 focus:outline-none"
          />
          <button className="bg-primary px-6 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground hover:bg-hanbok">
            Join
          </button>
        </form>
      </div>
    </section>
  );
}
