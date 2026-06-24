import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import heroKoreanModel from "@/assets/hero-korean-model.jpg";
import heroVideo from "@/assets/hero-video.mp4.asset.json";
import productFlatlay from "@/assets/product-flatlay.jpg";
import textureMacro from "@/assets/texture-macro.jpg";
import ritualScene from "@/assets/ritual-scene.jpg";
import brandSpotlight from "@/assets/brand-spotlight.jpg";
import skinMacro from "@/assets/skin-macro.jpg";
import customers from "@/assets/customers.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Skin Grocer — Authentic Korean Skincare, Next-Day from Melbourne" },
      { name: "description", content: "Melbourne's destination for authentic K-beauty and premium imports. Locally stocked, expertly guided, dispatched next-day across Australia." },
      { property: "og:title", content: "Skin Grocer — Authentic Korean Skincare in Australia" },
      { property: "og:description", content: "Locally stocked authentic K-beauty. Next-day dispatch from Melbourne. Expert routine guidance." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

const categories = [
  { name: "Cleansers", count: "32 products", img: textureMacro },
  { name: "Toners & Essences", count: "28 products", img: ritualScene },
  { name: "Serums", count: "41 products", img: productFlatlay },
  { name: "Moisturisers", count: "26 products", img: brandSpotlight },
  { name: "SPF", count: "18 products", img: skinMacro },
  { name: "Masks", count: "22 products", img: customers },
];

const concerns = [
  { name: "Hydration & Glow", desc: "Plump, dewy, glass-skin finish", color: "from-hanbok/15" },
  { name: "Acne & Breakouts", desc: "Calm congestion, balance oil", color: "from-clay/20" },
  { name: "Pigmentation", desc: "Brighten and even skin tone", color: "from-sand-deep/40" },
  { name: "Sensitivity", desc: "Repair and soothe the barrier", color: "from-hanbok/10" },
];

const bestsellers = [
  { brand: "COSRX", name: "Advanced Snail 96 Mucin Power Essence", price: 32, rating: 4.9, reviews: 1284, tag: "Bestseller" },
  { brand: "Beauty of Joseon", name: "Relief Sun Rice + Probiotics SPF50+", price: 28, rating: 4.9, reviews: 2310, tag: "AU Reformulated" },
  { brand: "Anua", name: "Heartleaf 77% Soothing Toner", price: 34, rating: 4.8, reviews: 902, tag: "Editor's Pick" },
  { brand: "Round Lab", name: "1025 Dokdo Toner", price: 29, rating: 4.8, reviews: 644, tag: "Restocked" },
];

const ingredients = [
  { name: "Snail Mucin", role: "Repair & glow" },
  { name: "Centella Asiatica", role: "Soothe redness" },
  { name: "Niacinamide", role: "Even tone" },
  { name: "Propolis", role: "Barrier support" },
  { name: "Beta-Glucan", role: "Deep hydration" },
  { name: "Madecassoside", role: "Sensitive calm" },
];

const journal = [
  { tag: "Routine 101", title: "How to build a Korean 7-step routine that actually fits your life", read: "6 min" },
  { tag: "Ingredient", title: "Why snail mucin works — and how to layer it correctly", read: "4 min" },
  { tag: "Australia", title: "The best K-beauty sunscreens for Australian UV", read: "8 min" },
];

const reviews = [
  { name: "Lara · Carlton VIC", quote: "Genuinely changed my skin in three weeks. The advisor reply email helped me build a routine I actually stick to." },
  { name: "Priya · Brunswick VIC", quote: "Ordered at 11am, in my hands by 4pm next day. Authentic batch codes, sealed exactly as expected." },
  { name: "Emma · Richmond VIC", quote: "Skin Grocer is the only AU retailer I trust for Beauty of Joseon. The provenance card is such a nice touch." },
];

function HomePage() {
  return (
    <div>
      <Hero />
      <Promise />
      <Categories />
      <Concerns />
      <Bestsellers />
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

function ParallaxScene() {
  return (
    <section
      className="relative min-h-[80vh] bg-ink bg-cover bg-center bg-fixed bg-no-repeat"
      style={{ backgroundImage: `url(${heroKoreanModel})` }}
      aria-label="Glass skin in motion"
    >
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
          src={heroVideo.url}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-label="Models with glowing glassy skin laughing"
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-transparent to-ink/55" />
      </div>

      <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col items-center justify-between px-6 py-12 text-center">
        {/* Top: brand wordmark */}
        <div className="flex w-full flex-col items-center pt-6">
          <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-paper/75">
            Melbourne · Est. by skin nerds
          </span>
          <h1 className="mt-4 font-display text-6xl leading-none text-paper md:text-[8.5rem] lg:text-[10rem]">
            skin grocer
          </h1>
        </div>

        {/* Bottom: minimal tagline + single CTA */}
        <div className="flex w-full flex-col items-center gap-6 pb-4">
          <p className="max-w-md text-sm leading-relaxed text-paper/85 md:text-base">
            Authentic Korean skincare. Next-day from Melbourne.
          </p>
          <Link
            to="/shop"
            className="group inline-flex items-center gap-3 rounded-full bg-paper px-10 py-4 text-xs font-semibold uppercase tracking-[0.28em] text-ink transition hover:bg-accent"
          >
            Shop now
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
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
          <p className="text-base text-ink/70">
            Not sure where to start? Our 2-minute skin quiz pairs you with an advisor-built
            routine, every step explained.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {concerns.map((c) => (
            <Link
              key={c.name}
              to="/skin-concerns"
              className={`group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${c.color} to-paper p-7 lift`}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-hanbok-deep">Concern</p>
              <h3 className="mt-4 font-display text-2xl text-ink">{c.name}</h3>
              <p className="mt-2 text-sm text-ink/70">{c.desc}</p>
              <span className="mt-8 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Build my routine
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
              <img
                src={[productFlatlay, ritualScene, textureMacro, brandSpotlight][i % 4]}
                alt={p.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute left-3 top-3 rounded-full bg-paper/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-hanbok-deep backdrop-blur">
                {p.tag}
              </span>
              <button
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
    </section>
  );
}

function ProvenanceCard() {
  return (
    <section className="bg-ink text-paper">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 md:grid-cols-2 md:items-center">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
          <img src={productFlatlay} alt="Sealed K-beauty products" loading="lazy" className="h-full w-full object-cover" />
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
            to="/journal"
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
