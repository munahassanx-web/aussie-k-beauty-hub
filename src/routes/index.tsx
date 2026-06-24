import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import heroDewy from "@/assets/hero-dewy.jpg";
import brandSpotlight from "@/assets/brand-spotlight.jpg";
import products from "@/assets/products.jpg";
import skinMacro from "@/assets/skin-macro.jpg";
import glow from "@/assets/glow.jpg";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Skin Grocer — Your Daily Dose of Skin Nutrition" },
      { name: "description", content: "Curated Korean beauty, delivered fast in Australia. Authentic K-beauty brands, expert guidance and same-day delivery from Sydney." },
      { property: "og:title", content: "Skin Grocer — Curated K-Beauty in Australia" },
      { property: "og:description", content: "Your daily dose of skin nutrition. Curated K-beauty delivered fast across Australia." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const categories = [
  { name: "Cleansers", desc: "Gentle formulas to lift the day, never strip." },
  { name: "Toners", desc: "Balance pH and prep skin for better absorption." },
  { name: "Serums", desc: "Concentrated actives for targeted concerns." },
  { name: "Moisturisers", desc: "Seal in hydration, support your barrier." },
  { name: "SPF & Sun", desc: "Daily UV protection, weightless finish." },
  { name: "Masks", desc: "Intensive treatments for an instant glow." },
];

const spotlights = [
  { brand: "Beauty of Joseon", tag: "Heritage Beauty Reimagined", line: "Ancient Korean wisdom in modern formulas." },
  { brand: "COSRX", tag: "Science Meets Simplicity", line: "Clinical actives, minimal ingredients." },
  { brand: "Sulwhasoo", tag: "Timeless Elegance", line: "Luxury Korean herbal skincare since 1966." },
  { brand: "Dr. Jart+", tag: "Expert Skincare Solutions", line: "Dermatological expertise, innovative formulas." },
];

const bestSellers = [
  { name: "Advanced Snail 96 Essence", brand: "COSRX", price: "$28", rating: "2,847" },
  { name: "Dynasty Cream", brand: "Beauty of Joseon", price: "$28", was: "$35", rating: "1,523" },
  { name: "Water Sleeping Mask", brand: "Laneige", price: "$45", rating: "3,201" },
  { name: "Relief Sun SPF50+", brand: "Beauty of Joseon", price: "$24", rating: "2,134" },
  { name: "Reedle Shot 300", brand: "VT Cosmetics", price: "$48", rating: "1,876" },
  { name: "Clean It Zero Balm", brand: "Banila Co", price: "$32", rating: "2,987" },
  { name: "Toner Pads Turquoise", brand: "Mediheal", price: "$28", rating: "1,234" },
  { name: "Heartleaf Ampoule", brand: "Anua", price: "$38", rating: "987" },
];

const brands = [
  "COSRX", "Beauty of Joseon", "Anua", "Heimish", "Laneige",
  "Innisfree", "Dr. Jart+", "Some By Mi", "Etude House", "Missha", "Klairs", "Purito",
];

const concerns = [
  { name: "Dry Skin", desc: "Intense hydration & barrier repair." },
  { name: "Oily Skin", desc: "Sebum control & pore refinement." },
  { name: "Pigmentation", desc: "Brightening & dark spot correction." },
  { name: "Sensitive Skin", desc: "Calming & barrier strengthening." },
  { name: "Anti-Aging", desc: "Firmness, elasticity & wrinkle reduction." },
  { name: "Acne & Blemishes", desc: "Clear skin & breakout prevention." },
];

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  return useMemo(() => {
    const diff = Math.max(0, target.getTime() - now);
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return [d, h, m, s];
  }, [now, target]);
}

function Home() {
  const dropDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    d.setHours(9, 0, 0, 0);
    return d;
  }, []);
  const [d, h, m, s] = useCountdown(dropDate);
  const [spot, setSpot] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSpot((v) => (v + 1) % spotlights.length), 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="relative isolate min-h-[88vh] overflow-hidden bg-foreground text-background">
        <div className="absolute inset-0 -z-10">
          <img
            src={heroDewy}
            alt=""
            aria-hidden
            width={1800}
            height={1400}
            className="h-full w-full animate-ken-burns object-cover object-center will-change-transform"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/60 to-foreground/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-foreground/40" />
        </div>

        <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-center px-6 py-20">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/40 bg-background/10 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-accent backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            Next drop in
          </span>
          <h1 className="mt-6 max-w-3xl text-5xl leading-[1.02] text-background md:text-7xl lg:text-8xl">
            Your daily dose of <span className="text-shimmer italic">skin nutrition.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-background/80">
            Curated Korean beauty, delivered fast in Australia. Authentic brands,
            expert guidance and same-day shipping from our Sydney warehouse.
          </p>

          {/* Countdown */}
          <div className="mt-10 grid w-full max-w-xl grid-cols-4 gap-3">
            {[
              { v: d, l: "Days" },
              { v: h, l: "Hours" },
              { v: m, l: "Min" },
              { v: s, l: "Sec" },
            ].map((c) => (
              <div key={c.l} className="rounded-2xl border border-background/15 bg-background/5 p-4 text-center backdrop-blur">
                <div className="font-display text-3xl text-accent md:text-5xl tabular-nums">
                  {String(c.v).padStart(2, "0")}
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-background/60">{c.l}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/shop" className="rounded-full bg-accent px-7 py-3 text-sm font-medium text-foreground transition-all hover:scale-105 hover:shadow-xl hover:shadow-accent/30">
              Shop the edit
            </Link>
            <Link to="/skin-concerns" className="rounded-full border border-background/30 bg-background/5 px-7 py-3 text-sm font-medium text-background backdrop-blur transition-all hover:bg-background/10">
              Find your routine →
            </Link>
          </div>
        </div>
      </section>

      {/* CATEGORY STRIP */}
      <section className="border-b border-border bg-background py-14">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-3xl text-foreground md:text-4xl">Shop by category</h2>
            <Link to="/shop" className="hidden text-sm text-primary hover:underline md:block">View all →</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((c) => (
              <Link to="/shop" key={c.name} className="group rounded-2xl border border-border bg-secondary/40 p-5 transition-all hover:-translate-y-1 hover:border-accent/50 hover:bg-secondary">
                <p className="font-display text-lg text-foreground transition-colors group-hover:text-primary">{c.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{c.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BRAND SPOTLIGHT */}
      <section className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-xs uppercase tracking-[0.25em] text-primary">Featured Brands</p>
          <h2 className="mt-3 text-4xl text-foreground md:text-5xl">Brand spotlight</h2>

          <div className="mt-10 grid items-center gap-10 md:grid-cols-2">
            <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-accent/20">
              <img
                src={brandSpotlight}
                alt={spotlights[spot].brand}
                width={1024}
                height={1024}
                className="h-full w-full object-cover transition-all duration-1000"
                key={spot}
              />
            </div>
            <div key={spot} className="animate-fade-in">
              <p className="text-xs uppercase tracking-[0.25em] text-accent">{spotlights[spot].tag}</p>
              <h3 className="mt-3 font-display text-5xl text-foreground md:text-6xl">{spotlights[spot].brand}</h3>
              <p className="mt-4 text-lg text-muted-foreground">{spotlights[spot].line}</p>
              <Link to="/brands" className="mt-8 inline-flex rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground hover:opacity-90">
                Shop the brand
              </Link>
              <div className="mt-10 flex gap-2">
                {spotlights.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSpot(i)}
                    aria-label={`Show spotlight ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${i === spot ? "w-10 bg-primary" : "w-4 bg-border hover:bg-primary/50"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="bg-background py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-primary">Customer Favourites</p>
              <h2 className="mt-3 text-4xl text-foreground md:text-5xl">Best sellers</h2>
              <p className="mt-2 text-muted-foreground">Most-loved by thousands of skin-obsessed Australians.</p>
            </div>
            <Link to="/shop" className="hidden text-sm text-primary hover:underline md:block">View all →</Link>
          </div>
          <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {bestSellers.map((p, i) => (
              <div key={p.name} className="group">
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary">
                  <img src={i % 2 ? products : hero} alt={p.name} loading="lazy" width={1400} height={1000} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <span className="absolute left-3 top-3 rounded-full bg-foreground px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-accent">Bestseller</span>
                </div>
                <div className="mt-4">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">{p.brand}</p>
                  <h3 className="mt-1 font-display text-lg leading-tight text-foreground">{p.name}</h3>
                  <div className="mt-2 flex items-center gap-1 text-xs text-accent">
                    {"★★★★★"} <span className="text-muted-foreground">({p.rating})</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-medium text-foreground">{p.price}</span>
                      {p.was && <span className="text-xs text-muted-foreground line-through">{p.was}</span>}
                    </div>
                    <button className="rounded-full border border-primary px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary transition-colors hover:bg-primary hover:text-primary-foreground">Add</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* K-BEAUTY BRANDS GRID */}
      <section className="bg-secondary/50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-xs uppercase tracking-[0.25em] text-primary">Shop by Brand</p>
          <h2 className="mt-3 text-4xl text-foreground md:text-5xl">K-beauty brands</h2>
          <p className="mt-3 max-w-xl text-muted-foreground">Carefully curated, authentically sourced — the names you can trust.</p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {brands.map((b) => (
              <Link to="/brands" key={b} className="group relative flex aspect-[5/3] items-end overflow-hidden rounded-2xl bg-foreground p-5 transition-transform hover:-translate-y-1">
                <img src={brandSpotlight} alt={b} loading="lazy" width={1024} height={1024} className="absolute inset-0 h-full w-full object-cover opacity-50 transition-opacity duration-500 group-hover:opacity-70" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/40 to-transparent" />
                <p className="relative font-display text-2xl text-background">{b}</p>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/brands" className="inline-flex rounded-full border border-foreground/20 px-7 py-3 text-sm font-medium text-foreground hover:bg-foreground/5">View all brands →</Link>
          </div>
        </div>
      </section>

      {/* SKIN CONCERNS */}
      <section className="bg-background py-24">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-xs uppercase tracking-[0.25em] text-primary">Targeted Solutions</p>
          <h2 className="mt-3 text-4xl text-foreground md:text-5xl">Shop by skin concern</h2>
          <p className="mt-3 max-w-xl text-muted-foreground">Find products built around what your skin actually needs.</p>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {concerns.map((c) => (
              <Link to="/skin-concerns" key={c.name} className="group relative aspect-[4/3] overflow-hidden rounded-3xl">
                <img src={skinMacro} alt={c.name} loading="lazy" width={1024} height={1024} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/30 to-transparent" />
                <div className="absolute bottom-0 p-7 text-background">
                  <h3 className="font-display text-3xl text-background">{c.name}</h3>
                  <p className="mt-1 text-sm opacity-80">{c.desc}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.2em] text-accent">Explore solutions →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI SKIN ANALYSIS */}
      <section className="relative isolate overflow-hidden bg-foreground py-28 text-background">
        <div className="absolute inset-0 -z-10">
          <img src={glow} alt="" aria-hidden width={1200} height={1400} className="h-full w-full animate-ken-burns object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/80 to-foreground/40" />
        </div>
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-accent">AI-Powered Skin Analysis</p>
          <h2 className="mt-4 font-display text-5xl md:text-6xl">
            Discover your <span className="text-shimmer italic">perfect</span> ritual.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-background/70">
            Answer a few questions and let our team build a personalised K-beauty
            routine designed exclusively for your skin.
          </p>
          <Link to="/skin-concerns" className="mt-10 inline-flex rounded-full bg-accent px-8 py-3.5 text-sm font-medium text-foreground transition-all hover:scale-105 hover:shadow-xl hover:shadow-accent/30">
            Start your skin analysis
          </Link>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="bg-secondary/50 py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-primary">Loved across Australia</p>
          <blockquote className="mt-6 font-display text-3xl leading-tight text-foreground md:text-5xl">
            "Finally — real COSRX without flying to Seoul. Ordered at noon, at my door by 6pm."
          </blockquote>
          <p className="mt-6 text-sm text-muted-foreground">Mia T. — Bondi, NSW</p>
          <Link to="/reviews" className="mt-8 inline-flex text-sm font-medium text-primary hover:underline">Read more reviews →</Link>
        </div>
      </section>
    </>
  );
}
