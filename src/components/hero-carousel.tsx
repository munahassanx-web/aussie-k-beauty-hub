import { useCallback, useEffect, useRef, useState } from "react";
import heroVideo from "@/assets/hero-video.mp4.asset.json";
import notStocked from "@/assets/hero-slides/not-stocked.jpg";
import authenticityCheck from "@/assets/hero-slides/authenticity-check.jpg";
import overwhelmed from "@/assets/hero-slides/overwhelmed.jpg";
import localDispatch from "@/assets/hero-slides/local-dispatch.jpg";

export type HeroSlide = {
  id: string;
  kind: "video" | "image";
  src: string;
  alt: string;
  eyebrow: string;
  headline: string;
  accent: string;
  sub: string;
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
  },
  {
    id: "not-stocked",
    kind: "image",
    src: notStocked,
    alt: "Shopper looking at an empty gap on a beauty store shelf, with hard-to-find Korean products in the foreground",
    eyebrow: "The hard-to-find problem",
    headline: "Mecca doesn't",
    accent: "stock it.",
    sub: "Cult Korean labels you can't buy in an Australian store — on our shelf, not a waitlist.",
  },
  {
    id: "authentic",
    kind: "image",
    src: authenticityCheck,
    alt: "Hands checking a batch code on a sealed Korean skincare box with verified products nearby",
    eyebrow: "The authenticity problem",
    headline: "Amazon might",
    accent: "not be real.",
    sub: "Every carton batch-checked on arrival. Sealed, verified, provenance-carded.",
  },
  {
    id: "confusing",
    kind: "image",
    src: overwhelmed,
    alt: "Woman holding a simple routine guide with just three curated products on the vanity",
    eyebrow: "The what-do-I-do-with-this problem",
    headline: "Ten steps,",
    accent: "no instructions.",
    sub: "Every product ships with a plain-English guide: what it does, when, and what it pairs with.",
  },
  {
    id: "local",
    kind: "image",
    src: localDispatch,
    alt: "Hands packing Korean skincare products into a Melbourne shipping box",
    eyebrow: "East to West, the simple way",
    headline: "No shipping",
    accent: "from Seoul.",
    sub: "It's already here. Order by 12pm and it's on your doorstep tomorrow.*",
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
    <div className="relative mb-5 mt-6 flex min-h-[18rem] w-full flex-col justify-center sm:min-h-[16rem] md:min-h-[20rem]">
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
