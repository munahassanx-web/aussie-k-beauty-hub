import { useCallback, useEffect, useRef, useState } from "react";
import heroVideo from "@/assets/hero-video.mp4.asset.json";
import notStocked from "@/assets/hero-slides/not-stocked.jpg";
import authenticityCheck from "@/assets/hero-slides/authenticity-check.jpg";
import overwhelmed from "@/assets/hero-slides/overwhelmed.jpg";
import localDispatch from "@/assets/hero-slides/local-dispatch.jpg";

export type HeroProduct = { name: string; brand: string; img: string };

export type HeroSlide = {
  id: string;
  kind: "video" | "image";
  src: string;
  alt: string;
  eyebrow: string;
  headline: string;
  accent: string;
  sub: string;
  products: HeroProduct[];
};

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "glow",
    kind: "video",
    src: heroVideo.url,
    alt: "Women with healthy, glassy skin laughing together",
    eyebrow: "Melbourne · Authentic Korean skincare",
    headline: "What Korea is",
    accent: "actually raving about.",
    sub: "Not TikTok trends — the shelf staples Seoul repurchases, stocked here in Melbourne.",
    products: [
      { brand: "Medicube", name: "PDRN Pink Peptide Serum", img: "/products/medicube/pdrn-pink-peptide-serum-30ml.png" },
      { brand: "Torriden", name: "Dive-In Serum", img: "/products/torriden/dive-in-serum.png" },
      { brand: "Round Lab", name: "1025 Dokdo Toner", img: "/products/round-lab/1025-dokdo-toner-100ml.png" },
    ],
  },
  {
    id: "not-stocked",
    kind: "image",
    src: notStocked,
    alt: "Shopper looking at an empty gap on a beauty store shelf",
    eyebrow: "The hard-to-find problem",
    headline: "Mecca doesn't",
    accent: "stock it.",
    sub: "Cult Korean labels you can't buy in an Australian store — on our shelf, not a waitlist.",
    products: [
      { brand: "Biodance", name: "Bio-Collagen Real Deep Mask", img: "/products/biodance/bio-collagen-real-deep-mask.png" },
      { brand: "Wellage", name: "Hyper PDRN Repair Ampoule", img: "/products/wellage/hyper-pdrn-repair-ampoule-30ml.png" },
      { brand: "TIRTIR", name: "Ceramic Milk Ampoule", img: "/products/tirtir/ceramic-milk-ampoule-40ml.png" },
    ],
  },
  {
    id: "authentic",
    kind: "image",
    src: authenticityCheck,
    alt: "Hands checking a printed batch code on a sealed skincare carton",
    eyebrow: "The authenticity problem",
    headline: "Amazon might",
    accent: "not be real.",
    sub: "Every carton batch-checked on arrival. Sealed, verified, provenance-carded.",
    products: [
      { brand: "Beauty of Joseon", name: "Revive Eye Serum", img: "/products/beauty-of-joseon/revive-eye-serum-ginseng-plus-retinal-30ml.png" },
      { brand: "Dr.G", name: "R.E.D Blemish Soothing Cream", img: "/products/dr-g/r-e-d-blemish-clear-soothing-cream-70ml.png" },
      { brand: "Isntree", name: "Hyaluronic Acid Water Essence", img: "/products/isntree/hyaluronic-acid-water-essence-50ml.png" },
    ],
  },
  {
    id: "confusing",
    kind: "image",
    src: overwhelmed,
    alt: "Woman surrounded by skincare bottles, unsure what to use",
    eyebrow: "The what-do-I-do-with-this problem",
    headline: "Ten steps,",
    accent: "no instructions.",
    sub: "Every product ships with a plain-English guide: what it does, when, and what it pairs with.",
    products: [
      { brand: "Beplain", name: "Mung Bean Cleansing Oil", img: "/products/beplain/mung-bean-cleansing-oil-200ml.png" },
      { brand: "Haruharu Wonder", name: "Black Rice Hyaluronic Toner", img: "/products/haruharu-wonder/black-rice-hyaluronic-toner-150ml.png" },
      { brand: "Aestura", name: "Atobarrier 365 Cream", img: "/products/aestura/atobarrier365-cream.png" },
    ],
  },
  {
    id: "local",
    kind: "image",
    src: localDispatch,
    alt: "Hands packing a cream parcel at a Melbourne warehouse bench",
    eyebrow: "East to West, the simple way",
    headline: "No shipping",
    accent: "from Seoul.",
    sub: "It's already here. Order by 12pm and it's on your doorstep tomorrow.*",
    products: [
      { brand: "S.Nature", name: "Aqua Squalane Serum", img: "/products/s-nature/aqua-squalane-serum.png" },
      { brand: "Medicube", name: "Collagen Jelly Cream", img: "/products/medicube/collagen-jelly-cream-110ml.png" },
      { brand: "Torriden", name: "Dive-In Soothing Cream", img: "/products/torriden/dive-in-soothing-cream.png" },
    ],
  },
];

const SLIDE_MS = 6500;

export function useHeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback((next: number) => {
    setIndex(((next % HERO_SLIDES.length) + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    timer.current = setInterval(() => setIndex((i) => (i + 1) % HERO_SLIDES.length), SLIDE_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused, index]);

  return { index, go, paused, setPaused, slideMs: SLIDE_MS };
}

export function HeroMedia({ index }: { index: number }) {
  return (
    <div className="absolute inset-0">
      {HERO_SLIDES.map((slide, i) => {
        const active = i === index;
        return (
          <div
            key={slide.id}
            aria-hidden={!active}
            className={`absolute inset-0 transition-opacity duration-[1400ms] ease-out ${
              active ? "opacity-100" : "opacity-0"
            }`}
          >
            {slide.kind === "video" ? (
              <video
                src={slide.src}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                aria-label={slide.alt}
                className="h-full w-full object-cover"
              />
            ) : (
              <img
                src={slide.src}
                alt={slide.alt}
                width={1920}
                height={1088}
                loading={i === 0 ? "eager" : "lazy"}
                className={`h-full w-full object-cover ${active ? "animate-ken-burns" : ""}`}
              />
            )}
          </div>
        );
      })}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/55 to-ink/90" />
    </div>
  );
}

export function HeroSlideCopy({ index }: { index: number }) {
  return (
    <div className="relative mt-4 min-h-[13rem] w-full sm:min-h-[11rem]">
      {HERO_SLIDES.map((slide, i) => {
        const active = i === index;
        return (
          <div
            key={slide.id}
            aria-hidden={!active}
            className={`absolute inset-0 flex flex-col items-center gap-4 transition-all duration-700 ease-out ${
              active ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
            }`}
          >
            <span className="rounded-full bg-grocer-butter px-5 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-ink shadow-[0_10px_30px_-14px_rgba(0,0,0,0.9)]">
              {slide.eyebrow}
            </span>
            <p className="max-w-4xl text-balance text-center font-display text-4xl font-black leading-[1.02] text-paper drop-shadow-[0_6px_24px_rgba(0,0,0,0.75)] md:text-6xl lg:text-7xl">
              {slide.headline}{" "}
              <span className="text-grocer-butter">{slide.accent}</span>
            </p>
            <p className="max-w-2xl text-balance text-center text-lg font-bold text-paper md:text-xl drop-shadow-[0_3px_14px_rgba(0,0,0,0.85)]">
              {slide.sub}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export function HeroProgress({
  index,
  go,
  paused,
  slideMs,
}: {
  index: number;
  go: (n: number) => void;
  paused: boolean;
  slideMs: number;
}) {
  return (
    <div className="flex items-center gap-2.5">
      {HERO_SLIDES.map((slide, i) => (
        <button
          key={slide.id}
          type="button"
          onClick={() => go(i)}
          aria-label={`Show slide ${i + 1}: ${slide.headline}`}
          aria-current={i === index}
          className="group relative h-1 w-10 overflow-hidden rounded-full bg-paper/25 transition hover:bg-paper/40 md:w-14"
        >
          <span
            key={`${slide.id}-${index}-${paused}`}
            className="absolute inset-y-0 left-0 bg-paper"
            style={
              i === index
                ? {
                    animation: `hero-fill ${slideMs}ms linear forwards`,
                    animationPlayState: paused ? "paused" : "running",
                  }
                : { width: 0 }
            }
          />
        </button>
      ))}
    </div>
  );
}
