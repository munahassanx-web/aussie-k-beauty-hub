import { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "@tanstack/react-router";
import brandMoment from "@/assets/hero-slides/brand-moment.jpg";
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
  /** Per-slide photographic grade (CSS filter) when the default needs tuning */
  filter?: string;
};

const slides: Slide[] = [
  {
    // Brand slide — editorial portrait with authentic packshots, type in the left quiet zone
    type: "image" as const,
    src: brandMoment,
    eyebrow: "MELBOURNE · AUTHENTIC KOREAN SKINCARE",
    headline: "SKINCARE, CURATED DIFFERENTLY.",
    body: "For your climate, your skin, your routine.",
    durationMs: 7000,
    ctas: [
      { label: "EXPLORE THE EDIT", to: "/shop", variant: "primary", icon: "arrow" },
      { label: "FIND YOUR ROUTINE", to: "/consultation", variant: "secondary", icon: "arrow" },
    ],
    headlineClass: "hero-headline-lg max-w-[15ch]",
    bodyClass: "max-w-md",

    align: "left",
    vertical: "center",
    scrimClass: "bg-gradient-to-r from-ink/58 via-ink/20 to-transparent",
    navLabel: "SKIN GROCER",
    filter: "brightness(1.00) contrast(1.02) saturate(1.00)",
  },
  {
    // Local access: Seoul shelf edit, type sits in the left negative space
    type: "image" as const,
    src: notStocked,
    eyebrow: "SEOUL → MELBOURNE",
    headline: "SEOUL BEAUTY. CLOSER THAN YOU THINK.",
    body: "Korean skincare discoveries, dispatched locally across Australia.",
    durationMs: 7000,
    ctas: [
      { label: "DISCOVER K-BEAUTY", to: "/shop", variant: "primary", icon: "arrow" },
    ],
    headlineClass: "hero-headline-lg max-w-[13ch]",
    bodyClass: "max-w-sm",
    align: "left",
    vertical: "center",
    scrimClass: "bg-gradient-to-r from-ink/52 via-ink/16 to-transparent",
    navLabel: "LOCAL ACCESS",
    filter: "brightness(1.02) contrast(1.03) saturate(1.01)",
  },
  {
    // Routine guidance: hands holding product in lower-left, type takes upper-right
    type: "image" as const,
    src: authenticityCheck,
    eyebrow: "YOUR ROUTINE, SIMPLIFIED",
    headline: "SKINCARE SHOULDN'T FEEL COMPLICATED.",
    body: "We make Korean skincare easier to understand — step by step, skin by skin.",
    durationMs: 7000,
    ctas: [
      { label: "BUILD YOUR ROUTINE", to: "/consultation", variant: "primary", icon: "arrow" },
      { label: "TAKE THE SKIN QUIZ", to: "/consultation", variant: "secondary", icon: "sparkle" },
    ],
    headlineClass: "hero-headline-lg max-w-[13ch]",
    bodyClass: "max-w-xs",
    align: "right",
    vertical: "top",
    scrimClass: "bg-gradient-to-bl from-ink/64 via-ink/22 to-transparent",
    navLabel: "ROUTINE GUIDANCE",
    filter: "brightness(1.00) contrast(1.03) saturate(1.01)",
  },
  {
    // Authenticity: portrait with product left-of-centre, type sits right
    type: "image" as const,
    src: overwhelmed,
    eyebrow: "AUTHENTICITY, ALWAYS",
    headline: "KNOW WHAT'S TOUCHING YOUR SKIN.",
    body: "Authentic skincare. Carefully sourced. Batch-checked. No guesswork.",
    durationMs: 7000,
    ctas: [
      { label: "OUR AUTHENTICITY PROMISE", to: "/about", variant: "primary", icon: "arrow" },
    ],
    headlineClass: "hero-headline-lg max-w-[13ch]",
    bodyClass: "max-w-sm",
    align: "right",
    vertical: "center",
    scrimClass: "bg-gradient-to-l from-ink/66 via-ink/24 to-transparent",
    navLabel: "AUTHENTICITY",
    filter: "brightness(1.02) contrast(1.03) saturate(1.01)",
  },
  {
    // Discovery: packing shot, type takes lower-left
    type: "image" as const,
    src: localDispatch,
    eyebrow: "THE SEOUL EDIT",
    headline: "BEYOND THE BEAUTY SHELF.",
    body: "Discover the Korean skincare worth knowing before everyone else does.",
    durationMs: 7000,
    ctas: [
      { label: "DISCOVER THE SEOUL EDIT", to: "/shop", variant: "primary", icon: "arrow" },
    ],
    headlineClass: "hero-headline-lg max-w-[13ch]",
    bodyClass: "max-w-sm",
    align: "left",
    vertical: "center",
    scrimClass: "bg-gradient-to-r from-ink/56 via-ink/18 to-transparent",
    navLabel: "DISCOVERY",
    filter: "brightness(1.02) contrast(1.02) saturate(1.01)",
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

const RESUME_DELAY_MS = 9000;

export function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [contentKey, setContentKey] = useState(0);
  const [progressKey, setProgressKey] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

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
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Autoplay halts entirely while the visitor is engaged with the controls or CTAs.
  const holding = hovered || reducedMotion;

  useEffect(() => {
    clearTimers();
    if (holding) return;
    if (paused) {
      resumeTimerRef.current = setTimeout(() => {
        setProgressKey((k) => k + 1);
        setPaused(false);
      }, RESUME_DELAY_MS);
    } else {
      autoTimerRef.current = setTimeout(next, slides[active].durationMs);
    }
    return clearTimers;
  }, [active, contentKey, progressKey, paused, holding, next, clearTimers]);

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
                      filter: slide.filter ?? "brightness(1.02) contrast(1.03) saturate(1.01)",
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

        {/* Mobile: soft localized falloff behind the centred copy column */}
        <div
          aria-hidden="true"
          className="hero-scrim-mobile absolute inset-0 md:hidden"
        />
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
            className={`hero-line mt-8 flex w-full max-w-sm flex-col items-center gap-3 sm:max-w-none sm:flex-row sm:gap-4 ${
              ctaAlignMap[slides[active].align || "center"]
            }`}
            style={{ "--hero-delay": "600ms", "--hero-rise": "10px", "--hero-line-duration": "950ms" } as React.CSSProperties}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocusCapture={() => setHovered(true)}
            onBlurCapture={() => setHovered(false)}
          >
            {slides[active].ctas.map((cta) => (
              <Link
                key={cta.label}
                to={cta.to}
                className={`group inline-flex w-full items-center justify-center gap-3 rounded-none px-9 py-3.5 text-[10px] font-semibold uppercase tracking-[0.3em] transition duration-500 sm:w-auto ${
                  cta.variant === "primary"
                    ? "border border-paper bg-paper text-ink hover:bg-transparent hover:text-paper"
                    : "border border-paper/40 text-paper hover:border-paper hover:bg-paper/10"
                }`}
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
      <div
        className="relative z-20 border-t border-paper/10 bg-ink/60 backdrop-blur"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setHovered(true)}
        onBlurCapture={() => setHovered(false)}
      >
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
                      className={`min-h-11 px-2 py-3 text-[10px] font-light tracking-[0.18em] transition-colors duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-paper/50 ${
                        isActive ? "text-paper" : "text-paper/70 hover:text-paper"
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
                  animationPlayState: paused || holding ? "paused" : "running",
                }}
              />
            </div>
          </div>

          {/* Ticker */}
          <div
            className="flex max-w-full items-center gap-8 overflow-x-auto pr-6 text-[10px] font-light uppercase tracking-[0.28em] text-paper/60 no-scrollbar"
            style={{
              maskImage: "linear-gradient(to right, transparent 0, #000 24px, #000 calc(100% - 40px), transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0, #000 24px, #000 calc(100% - 40px), transparent 100%)",
            }}
          >

            {[
              "Sourced direct from Seoul",
              "Sealed & batch-checked",
              "Dispatched from Melbourne",
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
