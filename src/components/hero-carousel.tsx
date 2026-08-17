import { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "@tanstack/react-router";
import heroVideo from "@/assets/hero-video.mp4.asset.json";
import notStocked from "@/assets/hero-slides/not-stocked.jpg";
import authenticityCheck from "@/assets/hero-slides/authenticity-check.jpg";
import overwhelmed from "@/assets/hero-slides/overwhelmed.jpg";
import localDispatch from "@/assets/hero-slides/local-dispatch.jpg";



type Align = "center" | "left" | "right";
type Vertical = "center" | "top" | "bottom";

type CTA = {
  label: string;
  to: string;
  variant: "primary" | "secondary";
  icon?: "arrow" | "sparkle";
};

type Slide = {
  type: "video" | "image";
  src: string;
  eyebrow: string;
  headline: string;
  body: string;
  durationMs: number;
  ctas: CTA[];
  headlineClass?: string;
  bodyClass?: string;
  /** Art direction: where the type sits relative to the subject (md+ only) */
  align?: Align;
  vertical?: Vertical;
  /** Directional scrim that protects type without flattening the photograph */
  scrimClass?: string;
  /** Tiny label for the editorial progress system */
  navLabel: string;
};

const slides: Slide[] = [
  {
    // Brand slide — symmetrical, centred, the campaign's anchor
    type: "video" as const,
    src: heroVideo.url,
    eyebrow: "Melbourne · Authentic Korean skincare",
    headline: "skin grocer",
    body: "K-beauty for your skin — and your postcode.",
    durationMs: 2500,
    ctas: [
      { label: "Discover skingrocer", to: "/about", variant: "primary", icon: "arrow" },
      { label: "Shop the edit", to: "/shop", variant: "secondary", icon: "arrow" },
    ],
    headlineClass: "hero-headline-xl max-w-3xl",
    bodyClass: "max-w-md",
    align: "center",
    vertical: "center",
    navLabel: "SKIN GROCER",
  },
  {
    // Vanity still life: bottles sit right of centre — type occupies the empty
    // sunlit wall on the left, above the folded towel.
    type: "image" as const,
    src: notStocked,
    eyebrow: "What you can't find locally",
    headline: "Mecca doesn't stock it.",
    body: "The Seoul drops you won't find at Mecca.",
    durationMs: 5000,
    ctas: [
      { label: "Discover the Seoul edit", to: "/shop", variant: "primary", icon: "arrow" },
    ],
    headlineClass: "hero-headline-lg max-w-xl",
    bodyClass: "max-w-sm",
    align: "left",
    vertical: "center",
    scrimClass: "bg-gradient-to-r from-ink/70 via-ink/25 to-transparent",
    navLabel: "DISCOVERY",
  },
  {
    // Hands holding the Medicube box fill the lower-left third — type drops to
    // the calm upper-right negative space so nothing covers the packaging.
    type: "image" as const,
    src: authenticityCheck,
    eyebrow: "Why authenticity matters",
    headline: "Amazon might not be real.",
    body: "Batch-checked. Sealed. Authorised.",
    durationMs: 5000,
    ctas: [
      { label: "Our authenticity promise", to: "/about", variant: "primary", icon: "arrow" },
    ],
    headlineClass: "hero-headline-sm max-w-lg leading-[1.02] tracking-[-0.03em]",
    bodyClass: "max-w-xs",
    align: "right",
    vertical: "top",
    scrimClass: "bg-gradient-to-bl from-ink/70 via-ink/25 to-transparent",
    navLabel: "AUTHENTICITY",
  },
  {
    // Portrait: her face and the serum live left of centre — type sits right,
    // clear of the face, reading against the soft mirror reflection.
    type: "image" as const,
    src: overwhelmed,
    eyebrow: "How to use it",
    headline: "Ten steps, no instructions.",
    body: "Korean routines, translated into plain English.",
    durationMs: 5000,
    ctas: [
      { label: "Build your routine", to: "/consultation", variant: "primary", icon: "arrow" },
      { label: "Take the skin quiz", to: "/consultation", variant: "secondary", icon: "sparkle" },
    ],
    headlineClass: "hero-headline-lg max-w-xl leading-[1.0]",
    bodyClass: "max-w-sm",
    align: "right",
    vertical: "center",
    scrimClass: "bg-gradient-to-l from-ink/72 via-ink/28 to-transparent",
    navLabel: "ROUTINES",
  },
  {
    // Packing shot: the box and hands sit centre-high — type takes the lower-left
    // linen, generous negative space above it.
    type: "image" as const,
    src: localDispatch,
    eyebrow: "From Melbourne, not Seoul",
    headline: "No shipping from Seoul.",
    body: "Next-day VIC. Express Australia-wide.",
    durationMs: 5000,
    ctas: [
      { label: "Shop K-beauty", to: "/shop", variant: "primary", icon: "arrow" },
    ],
    headlineClass: "hero-headline-sm max-w-lg leading-[1.02]",
    bodyClass: "max-w-sm",
    align: "left",
    vertical: "bottom",
    scrimClass: "bg-gradient-to-tr from-ink/78 via-ink/25 to-transparent",
    navLabel: "LOCAL DELIVERY",
  },
];

const alignMap: Record<Align, string> = {
  center: "md:items-center md:text-center md:self-center",
  left: "md:items-start md:text-left md:self-start",
  right: "md:items-end md:text-right md:self-end",
};

const verticalMap: Record<Vertical, string> = {
  center: "md:justify-center",
  top: "md:justify-start md:pt-[12vh]",
  bottom: "md:justify-end md:pb-[14vh]",
};

const ctaAlignMap: Record<Align, string> = {
  center: "md:justify-center",
  left: "md:justify-start",
  right: "md:justify-end",
};

const RESUME_DELAY_MS = 6000;

export function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [contentKey, setContentKey] = useState(0);
  const [progressKey, setProgressKey] = useState(0);
  const [paused, setPaused] = useState(false);

  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartX = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (autoTimerRef.current) {
      clearTimeout(autoTimerRef.current);
      autoTimerRef.current = null;
    }
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  const next = useCallback(() => {
    setActive((i) => (i + 1) % slides.length);
    setContentKey((k) => k + 1);
    setProgressKey((k) => k + 1);
  }, []);

  const prev = useCallback(() => {
    setActive((i) => (i - 1 + slides.length) % slides.length);
    setContentKey((k) => k + 1);
    setProgressKey((k) => k + 1);
  }, []);

  const manualNext = useCallback(() => {
    setPaused(true);
    next();
  }, [next]);

  const manualPrev = useCallback(() => {
    setPaused(true);
    prev();
  }, [prev]);

  const goTo = useCallback(
    (i: number) => {
      if (i === active) return;
      setPaused(true);
      setActive(i);
      setContentKey((k) => k + 1);
      setProgressKey((k) => k + 1);
    },
    [active]
  );

  useEffect(() => {
    clearTimers();
    if (paused) {
      resumeTimerRef.current = setTimeout(() => {
        setProgressKey((k) => k + 1);
        setPaused(false);
      }, RESUME_DELAY_MS);
    } else {
      autoTimerRef.current = setTimeout(next, slides[active].durationMs);
    }
    return clearTimers;
  }, [active, contentKey, progressKey, paused, next, clearTimers]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target;
      if (
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        manualPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        manualNext();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [manualNext, manualPrev]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartX.current;
    if (start == null) return;
    const end = e.changedTouches[0].screenX;
    const diff = start - end;
    if (diff > 50) manualNext();
    else if (diff < -50) manualPrev();
    touchStartX.current = null;
  };

  return (
    <section
      className="relative overflow-hidden bg-ink"
      aria-roledescription="carousel"
      aria-label="Skin Grocer hero campaign"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Media layer */}
      <div className="absolute inset-0">
        {slides.map((slide, i) => {
          const isActive = i === active;
          return (
            <div
              key={slide.type === "video" ? "video" : slide.src}
              className={`absolute inset-0 transition-opacity duration-[1400ms] [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] ${
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
                  key={isActive ? `drift-${active}-${contentKey}` : "idle"}
                  src={slide.src}
                  alt=""
                  loading={i === 1 ? "eager" : "lazy"}
                  decoding="async"
                  className={`h-full w-full object-cover ${isActive ? "animate-hero-drift" : ""}`}
                  style={
                    {
                      "--hero-drift-duration": `${slide.durationMs + 2200}ms`,
                    } as React.CSSProperties
                  }
                />
              )}
            </div>
          );
        })}

        {/* Layered editorial scrim — protects type, keeps skin tones natural */}
        <div className="hero-scrim absolute inset-0" />

        {/* Directional scrim, composed per slide so type sits in the image's quiet zone */}
        {slides[active].scrimClass ? (
          <div
            key={`scrim-${active}`}
            className={`absolute inset-0 hidden transition-opacity duration-[1400ms] md:block ${slides[active].scrimClass}`}
          />
        ) : null}
      </div>

      {/* Content */}
      <div
        className={`relative mx-auto flex min-h-[86vh] max-w-7xl flex-col items-center justify-center px-6 py-20 text-center md:px-10 md:py-24 ${
          verticalMap[slides[active].vertical || "center"]
        }`}
      >
        <div
          key={`content-${contentKey}`}
          className={`flex w-full max-w-4xl flex-col items-center ${alignMap[slides[active].align || "center"]}`}
        >
          <span
            className="hero-line inline-flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.32em] text-paper/70"
            style={{ "--hero-delay": "80ms", "--hero-rise": "8px", "--hero-line-duration": "900ms" } as React.CSSProperties}
          >
            <span
              className={`h-px w-6 bg-paper/40 ${
                slides[active].align === "right" ? "md:hidden" : ""
              }`}
            />
            {slides[active].eyebrow}
            <span
              className={`h-px w-6 bg-paper/40 ${
                slides[active].align === "left" ? "md:hidden" : ""
              }`}
            />
          </span>

          <h1
            className={`hero-line hero-headline hero-text-shadow mt-5 ${slides[active].headlineClass || ""}`}
            style={{ "--hero-delay": "260ms", "--hero-rise": "18px", "--hero-line-duration": "1150ms" } as React.CSSProperties}
          >
            {slides[active].headline}
          </h1>

          <p
            className={`hero-line mt-5 text-balance text-sm font-light leading-[1.55] tracking-[0.01em] text-paper/85 hero-body-shadow md:text-[15px] ${slides[active].bodyClass || "max-w-md"}`}
            style={{ "--hero-delay": "440ms", "--hero-rise": "12px", "--hero-line-duration": "1000ms" } as React.CSSProperties}
          >
            {slides[active].body}
          </p>

          <div
            className={`hero-line mt-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-4 ${
              ctaAlignMap[slides[active].align || "center"]
            }`}
            style={{ "--hero-delay": "600ms", "--hero-rise": "10px", "--hero-line-duration": "950ms" } as React.CSSProperties}
          >
            {slides[active].ctas.map((cta) => (
              <Link
                key={cta.label}
                to={cta.to}
                className={
                  cta.variant === "primary"
                    ? "group inline-flex items-center gap-3 rounded-none border border-paper bg-paper px-9 py-3.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-ink transition duration-500 hover:bg-transparent hover:text-paper"
                    : "group inline-flex items-center gap-2.5 rounded-none border border-paper/40 px-8 py-3.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-paper transition duration-500 hover:border-paper hover:bg-paper/10"
                }
              >
                {cta.icon === "sparkle" && (
                  <SparkleIcon className="h-3.5 w-3.5 text-paper/70 transition-transform duration-700 group-hover:rotate-90" />
                )}
                <span>{cta.label}</span>
                {cta.icon === "arrow" && (
                  <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar: editorial progress system + ticker */}
      <div className="relative z-20 border-t border-paper/10 bg-ink/60 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-6 py-3 md:flex-row md:items-center md:justify-between md:gap-6 md:px-10">
          {/* Editorial progress nav */}
          <div className="flex flex-col items-center gap-2 md:items-start">
            <span className="hidden text-[10px] font-medium uppercase tracking-[0.26em] text-paper/70 md:block">
              {slides[active].navLabel}
            </span>
            <nav aria-label="Hero slides" className="flex items-center">
              {slides.map((slide, i) => {
                const isActive = i === active;
                const isLast = i === slides.length - 1;
                return (
                  <div key={i} className="flex items-center">
                    <button
                      type="button"
                      onClick={() => goTo(i)}
                      aria-label={`Go to ${slide.navLabel}`}
                      aria-current={isActive ? "true" : undefined}
                      className={`px-1 py-0.5 text-[10px] font-light tracking-[0.18em] transition-colors duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-paper/50 ${
                        isActive ? "text-paper" : "text-paper/30 hover:text-paper/65"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </button>
                    {!isLast && (
                      <span className="mx-1 text-[10px] text-paper/20" aria-hidden="true">
                        —
                      </span>
                    )}
                  </div>
                );
              })}
            </nav>
            {/* Very thin animated progress line */}
            <div className="relative h-px w-28 overflow-hidden bg-paper/20 md:w-40">
              <span
                key={progressKey}
                className="absolute inset-y-0 left-0 block h-full bg-paper animate-hero-fill"
                style={{
                  animationDuration: `${slides[active].durationMs}ms`,
                  animationPlayState: paused ? "paused" : "running",
                }}
              />
            </div>
          </div>

          {/* Ticker */}
          <div className="flex items-center gap-8 overflow-x-auto text-[10px] font-light uppercase tracking-[0.28em] text-paper/60 no-scrollbar">
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
