import { useEffect, useState, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import heroVideo from "@/assets/hero-video.mp4.asset.json";
import notStocked from "@/assets/hero-slides/not-stocked.jpg";
import authenticityCheck from "@/assets/hero-slides/authenticity-check.jpg";
import overwhelmed from "@/assets/hero-slides/overwhelmed.jpg";
import localDispatch from "@/assets/hero-slides/local-dispatch.jpg";



type Slide = {
  type: "video" | "image";
  src: string;
  eyebrow: string;
  headline: string;
  body: string;
  durationMs: number;
  headlineClass?: string;
  bodyClass?: string;
};

const slides: Slide[] = [
  {
    type: "video" as const,
    src: heroVideo.url,
    eyebrow: "Melbourne · Authentic Korean skincare",
    headline: "skin grocer",
    body: "K-beauty for your skin — and your postcode.",
    durationMs: 2500,
    headlineClass: "hero-headline-xl max-w-3xl",
    bodyClass: "max-w-md",
  },
  {
    type: "image" as const,
    src: notStocked,
    eyebrow: "What you can't find locally",
    headline: "Mecca doesn't stock it.",
    body: "The Seoul drops you won't find at Mecca.",
    durationMs: 5000,
    headlineClass: "hero-headline-lg max-w-3xl",
    bodyClass: "max-w-sm",
  },
  {
    type: "image" as const,
    src: authenticityCheck,
    eyebrow: "Why authenticity matters",
    headline: "Amazon might not be real.",
    body: "Batch-checked. Sealed. Authorised.",
    durationMs: 5000,
    headlineClass: "hero-headline-sm max-w-3xl leading-[1.02] tracking-[-0.03em]",
    bodyClass: "max-w-xs",
  },
  {
    type: "image" as const,
    src: overwhelmed,
    eyebrow: "How to use it",
    headline: "Ten steps, no instructions.",
    body: "Korean routines, translated into plain English.",
    durationMs: 5000,
    headlineClass: "hero-headline-lg max-w-2xl leading-[1.0]",
    bodyClass: "max-w-md",
  },
  {
    type: "image" as const,
    src: localDispatch,
    eyebrow: "From Melbourne, not Seoul",
    headline: "No shipping from Seoul.",
    body: "Next-day VIC. Express Australia-wide.",
    durationMs: 5000,
    headlineClass: "hero-headline-sm max-w-3xl leading-[1.02]",
    bodyClass: "max-w-sm",
  },
];

export function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [key, setKey] = useState(0);

  const next = useCallback(() => {
    setActive((i) => (i + 1) % slides.length);
    setKey((k) => k + 1);
  }, []);

  useEffect(() => {
    const id = setTimeout(next, slides[active].durationMs);
    return () => clearTimeout(id);
  }, [next, key, active]);


  const goTo = (i: number) => {
    setActive(i);
    setKey((k) => k + 1);
  };

  return (
    <section className="relative overflow-hidden bg-ink">

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

        {/* Layered editorial scrim — protects type, keeps skin tones natural */}
        <div className="hero-scrim absolute inset-0" />
      </div>

      {/* Content */}
      <div className="relative mx-auto flex min-h-[86vh] max-w-7xl flex-col items-center justify-center px-6 py-20 text-center md:py-24">
        <div key={`${active}-${key}`} className="flex w-full max-w-4xl flex-col items-center">
          <span
            className="hero-line inline-flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.32em] text-paper/70"
            style={{ "--hero-delay": "60ms" } as React.CSSProperties}
          >
            <span className="h-px w-6 bg-paper/40" />
            {slides[active].eyebrow}
            <span className="h-px w-6 bg-paper/40" />
          </span>

          <h1
            className={`hero-line hero-headline hero-text-shadow mt-5 ${slides[active].headlineClass || ""}`}
            style={{ "--hero-delay": "180ms" } as React.CSSProperties}
          >
            {slides[active].headline}
          </h1>

          <p
            className={`hero-line mt-5 text-balance text-sm font-light leading-[1.55] tracking-[0.01em] text-paper/85 hero-body-shadow md:text-[15px] ${slides[active].bodyClass || "max-w-md"}`}
            style={{ "--hero-delay": "320ms" } as React.CSSProperties}
          >
            {slides[active].body}
          </p>

          <div
            className="hero-line mt-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-4"
            style={{ "--hero-delay": "460ms" } as React.CSSProperties}
          >
            <Link
              to="/shop"
              className="group inline-flex items-center gap-3 rounded-none border border-paper bg-paper px-9 py-3.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-ink transition duration-500 hover:bg-transparent hover:text-paper"
            >
              Shop now
              <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
            </Link>
            <Link
              to="/consultation"
              className="group inline-flex items-center gap-2.5 rounded-none border border-paper/40 px-8 py-3.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-paper transition duration-500 hover:border-paper hover:bg-paper/10"
            >
              <SparkleIcon className="h-3.5 w-3.5 text-paper/70 transition-transform duration-700 group-hover:rotate-90" />
              <span>Take the 2-minute skin quiz</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Floating ticker */}
      <div className="relative border-t border-paper/10 bg-ink/60 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 overflow-x-auto px-6 py-3.5 text-[10px] font-light uppercase tracking-[0.28em] text-paper/60 no-scrollbar">
          {[
            "Sourced direct from Seoul",
            "Sealed & batch-checked",
            "Next-day VIC delivery",
            "Express AU shipping",
            "Advisor-built routines",
          ].map((t) => (
            <span key={t} className="flex items-center gap-3 whitespace-nowrap">
              <span className="h-[3px] w-[3px] rounded-full bg-paper/50" />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Progress bars */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex gap-2 px-6 pb-4 md:px-10">
        {slides.map((slide, i) => (
          <button
            key={slide.type === "video" ? "video" : slide.src}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="group relative h-6 flex-1 before:absolute before:inset-x-0 before:top-1/2 before:h-px before:-translate-y-1/2 before:bg-paper/25"
          >
            <span
              key={i === active ? key : `${i}-off`}
              className={`absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-paper ${
                i === active ? "animate-hero-fill" : "w-0"
              }`}
              style={
                i === active
                  ? ({ animationDuration: `${slides[active].durationMs}ms` } as React.CSSProperties)
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
