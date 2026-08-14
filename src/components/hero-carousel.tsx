import { useEffect, useState, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import heroVideo from "@/assets/hero-video.mp4.asset.json";
import notStocked from "@/assets/hero-slides/not-stocked.jpg";
import authenticityCheck from "@/assets/hero-slides/authenticity-check.jpg";
import overwhelmed from "@/assets/hero-slides/overwhelmed.jpg";
import localDispatch from "@/assets/hero-slides/local-dispatch.jpg";
import { SHOP_PRODUCTS, type ShopProduct } from "@/lib/shop-catalog";

const SLIDE_MS = 5000;

const featuredHardToFind: ShopProduct[] = [
  SHOP_PRODUCTS.find((p) => p.name === "Aqua Squalane Serum")!,
  SHOP_PRODUCTS.find((p) => p.name === "Hyper PDRN Repair Ampoule 30ml")!,
  SHOP_PRODUCTS.find((p) => p.name === "Ceramic Milk Ampoule 40ml")!,
  SHOP_PRODUCTS.find((p) => p.name === "Black Rice 5 Ceramide Barrier Moisturizing Cream")!,
].filter(Boolean);

type Slide = {
  type: "video" | "image";
  src: string;
  eyebrow: string;
  headline: string;
  body: string;
  products?: ShopProduct[];
};

const slides: Slide[] = [
  {
    type: "video" as const,
    src: heroVideo.url,
    eyebrow: "Melbourne · Authentic Korean skincare",
    headline: "skin grocer",
    body: "Most skincare advice is built for someone else's climate — not yours. Authentic K-beauty, stored locally in Melbourne. Order by 12pm and it's on your doorstep tomorrow.*",
  },
  {
    type: "image" as const,
    src: notStocked,
    eyebrow: "What you can't find locally",
    headline: "Mecca doesn't stock it.",
    body: "The best-selling Korean staples Australian customers love are rarely on local shelves. We bring them here — direct from Seoul, no grey market.",
    products: featuredHardToFind,
  },
  {
    type: "image" as const,
    src: authenticityCheck,
    eyebrow: "Why authenticity matters",
    headline: "Amazon might not be real.",
    body: "Every item is batch-checked, sealed, and sourced through authorised channels. No fakes, no reformulated exports, no guesswork.",
  },
  {
    type: "image" as const,
    src: overwhelmed,
    eyebrow: "How to use it",
    headline: "Ten steps, no instructions.",
    body: "Korean routines can feel overwhelming. We translate every product into plain English: what it does, where it fits, and how much to use.",
  },
  {
    type: "image" as const,
    src: localDispatch,
    eyebrow: "From Melbourne, not Seoul",
    headline: "No shipping from Seoul.",
    body: "We hold stock locally so your routine arrives fast — next-day VIC, express Australia-wide, and same-day dispatch on orders before 12pm.*",
  },
];

export function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [key, setKey] = useState(0);

  const next = useCallback(() => {
    setActive((i) => (i + 1) % slides.length);
    setKey((k) => k + 1);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, SLIDE_MS);
    return () => clearInterval(id);
  }, [paused, next]);

  const goTo = (i: number) => {
    setActive(i);
    setKey((k) => k + 1);
  };

  return (
    <section
      className="relative overflow-hidden bg-ink"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Media layer */}
      <div className="absolute inset-0">
        {slides.map((slide, i) => {
          const isActive = i === active;
          return (
            <div
              key={slide.type === "video" ? "video" : slide.src}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
            >
              {slide.type === "video" ? (
                <video
                  src={slide.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className="h-full w-full object-cover"
                  aria-label="Women with healthy, glassy skin laughing together"
                />
              ) : (
                <img
                  src={slide.src}
                  alt=""
                  className={`h-full w-full object-cover ${isActive ? "animate-ken-burns" : ""}`}
                />
              )}
            </div>
          );
        })}

        {/* Original dark overlay for text contrast — no brightening filters */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/40 to-ink/80" />
      </div>

      {/* Content */}
      <div className="relative mx-auto flex min-h-[86vh] max-w-7xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="flex w-full max-w-4xl flex-col items-center gap-6">
          <span className="rounded-full bg-paper/15 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-paper backdrop-blur">
            {slides[active].eyebrow}
          </span>

          <h1 className="font-display text-6xl font-black leading-[0.9] text-paper drop-shadow-[0_6px_30px_rgba(0,0,0,0.6)] md:text-[7.5rem] lg:text-[9rem]">
            {slides[active].headline}
          </h1>

          <p className="max-w-2xl text-balance text-lg font-medium text-paper drop-shadow-[0_3px_14px_rgba(0,0,0,0.7)] md:text-xl">
            {slides[active].body}
          </p>

          <div className="flex flex-col items-center gap-3 pt-2 sm:flex-row">
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

          {slides[active].products && (
            <div className="w-full max-w-5xl pt-4">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-paper/70">
                Hand-picked from Korea, hard to find here
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {slides[active].products.map((product) => (
                  <Link
                    key={product.priceId}
                    to="/shop"
                    className="group flex flex-col items-center gap-2 rounded-xl border border-paper/15 bg-ink/40 p-3 text-center backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-paper/40 hover:bg-ink/60"
                  >
                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-paper/10">
                      <img
                        src={product.image}
                        alt={`${product.brand} ${product.name}`}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-paper/70">
                        {product.brand}
                      </span>
                      <span className="line-clamp-2 text-xs font-medium leading-tight text-paper">
                        {product.name}
                      </span>
                      <span className="text-xs font-semibold text-paper">
                        {product.price}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating ticker */}
      <div className="relative border-t border-paper/15 bg-ink/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 overflow-x-auto px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-paper/70 no-scrollbar">
          {[
            "Sourced direct from Seoul",
            "Sealed & batch-checked",
            "Next-day VIC delivery",
            "Express AU shipping",
            "Advisor-built routines",
          ].map((t) => (
            <span key={t} className="flex items-center gap-3 whitespace-nowrap">
              <span className="h-1 w-1 rounded-full bg-accent" />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Progress bars */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex gap-2 px-6 pb-5 md:px-10">
        {slides.map((slide, i) => (
          <button
            key={slide.type === "video" ? "video" : slide.src}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="group relative h-1 flex-1 overflow-hidden rounded-full bg-paper/25"
          >
            <span
              key={i === active ? key : `${i}-off`}
              className={`absolute inset-y-0 left-0 rounded-full bg-paper ${
                i === active ? "animate-hero-fill" : ""
              }`}
              style={
                i === active
                  ? ({ animationDuration: `${SLIDE_MS}ms` } as React.CSSProperties)
                  : undefined
              }
            />
          </button>
        ))}
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
