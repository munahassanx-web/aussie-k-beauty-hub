import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { trackUi } from "@/lib/analytics";

type Slide = {
  slug: string;
  brand: string;
  name: string;
  price: string;
  image: string;
  /** Korean label shown on the chip, and its plain-English meaning. */
  ko: string;
  en: string;
  hook: string;
  /** Hwahae rating and review count, rounded down. */
  proof: string;
  /** Backdrop gradient and the RGB tint of the floating bubbles. */
  bg: [string, string];
  tint: string;
};

/**
 * Stocked products from the Hwahae Global Trending Ranking (checked
 * 7 October 2026). Review counts are rounded down so they stay true as
 * Hwahae's totals grow.
 */
const SLIDES: Slide[] = [
  {
    slug: "aestura-atobarrier365-cream",
    brand: "AESTURA",
    name: "Atobarrier365 Cream",
    price: "A$55",
    image: "/products/aestura/atobarrier365-cream.webp",
    ko: "장벽 크림",
    en: "Barrier cream",
    hook: "Korea’s go-to moisturiser for dry, easily unsettled skin.",
    proof: "4.7★ from 18,000+ Hwahae reviews",
    bg: ["#fbeee9", "#f1d3c8"],
    tint: "227,164,147",
  },
  {
    slug: "beplain-mung-bean-ph-balanced-cleansing-foam-80ml",
    brand: "beplain",
    name: "Mung Bean pH-Balanced Cleansing Foam",
    price: "A$24",
    image: "/products/beplain/mung-bean-ph-balanced-cleansing-foam-80ml.webp",
    ko: "녹두",
    en: "Mung bean",
    hook: "The low-pH daily cleanser that rinses clean without tightness.",
    proof: "4.6★ from 50,000+ Hwahae reviews",
    bg: ["#f3f6ea", "#d6e2bd"],
    tint: "150,180,100",
  },
  {
    slug: "torriden-dive-in-soothing-cream",
    brand: "TORRIDEN",
    name: "Dive In Soothing Cream",
    price: "A$40",
    image: "/products/torriden/dive-in-soothing-cream.webp",
    ko: "판테놀",
    en: "Panthenol",
    hook: "The soothing cream from Torriden’s DIVE IN line.",
    proof: "4.7★ from 27,000+ Hwahae reviews",
    bg: ["#f6f9f8", "#d8e9eb"],
    tint: "150,196,200",
  },
  {
    slug: "round-lab-1025-dokdo-toner-100ml",
    brand: "ROUND LAB",
    name: "1025 Dokdo Toner",
    price: "A$18",
    image: "/products/round-lab/1025-dokdo-toner-100ml.webp",
    ko: "해양심층수",
    en: "Deep-sea water",
    hook: "A toner built on deep-sea water drawn off Dokdo island.",
    proof: "4.4★ from 95,000+ Hwahae reviews",
    bg: ["#faf4ec", "#e7d6bf"],
    tint: "200,170,130",
  },
];

/** Glass bubbles: position (%), size (px at desktop) and parallax depth. */
const BUBBLES = [
  { x: 8, y: 14, s: 150, d: 0.9, t: 9 },
  { x: 72, y: 6, s: 96, d: 0.5, t: 7 },
  { x: 80, y: 58, s: 190, d: 1.2, t: 11 },
  { x: 14, y: 70, s: 84, d: 0.7, t: 8 },
  { x: 58, y: 80, s: 52, d: 1.6, t: 6 },
  { x: 32, y: 6, s: 38, d: 1.8, t: 5 },
  { x: 90, y: 30, s: 30, d: 2, t: 6.5 },
  { x: 4, y: 46, s: 24, d: 2.2, t: 5.5 },
];

const ROTATE_MS = 5200;

/** The words customers already search for, in English and Korean. */
const GLOW_WORDS: [string, string][] = [
  ["glass skin", "물광"],
  ["cica", "병풀"],
  ["honey glow", "꿀광"],
  ["hydration", "수분"],
  ["barrier", "장벽"],
];

function bubbleStyle(tint: string): CSSProperties {
  return {
    background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.95) 0 5%, rgba(255,255,255,0.4) 13%, rgba(${tint},0.12) 42%, rgba(${tint},0.42) 100%)`,
    boxShadow: `inset -10px -14px 28px rgba(${tint},0.38), inset 8px 10px 20px rgba(255,255,255,0.7), 0 22px 44px rgba(${tint},0.22)`,
  };
}

/**
 * Product-led homepage hero: real stocked products float in a glass-bubble
 * scene that tilts with the cursor, and each one's key ingredient label
 * translates from Korean to English.
 */
export function GlassSkinHero() {
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [english, setEnglish] = useState(false);
  const swipeX = useRef<number | null>(null);
  const slide = SLIDES[index];

  useEffect(() => {
    if (reduce || paused) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), ROTATE_MS);
    return () => window.clearInterval(id);
  }, [reduce, paused]);

  useEffect(() => {
    setEnglish(false);
    if (reduce) return;
    const id = window.setTimeout(() => setEnglish(true), 1600);
    return () => window.clearTimeout(id);
  }, [index, reduce]);

  const go = (i: number) => {
    setIndex((i + SLIDES.length) % SLIDES.length);
    setPaused(true);
  };

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (reduce || e.pointerType !== "mouse" || !stageRef.current) return;
    const r = stageRef.current.getBoundingClientRect();
    setTilt({
      x: (e.clientX - r.left) / r.width - 0.5,
      y: (e.clientY - r.top) / r.height - 0.5,
    });
  };

  return (
    <section
      aria-labelledby="glass-skin-heading"
      onPointerMove={onMove}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
      className="relative grid overflow-hidden bg-paper text-ink md:min-h-[640px] md:grid-cols-[0.95fr_1.05fr]"
    >
      <div className="relative z-10 flex flex-col justify-center gap-6 px-6 pb-12 pt-9 md:py-16 md:pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] md:pr-10">
        <span className="inline-flex w-fit max-w-full items-center gap-2.5 rounded-full bg-blush px-4 py-2 text-[13px]">
          <b className="font-[family-name:var(--font-hangul)] font-bold text-hanbok">화해 랭킹</b>
          <span className="text-ink/80">ranked by Korean reviewers on Hwahae</span>
        </span>
        <h1
          id="glass-skin-heading"
          className="text-[clamp(2.9rem,4.7vw,5.1rem)] font-light lowercase leading-[0.98] tracking-[-0.045em]"
        >
          <span className="block">the skincare</span>
          <span className="block text-hanbok">korea swears by.</span>
        </h1>
        <p className="max-w-[38ch] text-lg leading-relaxed text-clay">
          The cult favourites with tens of thousands of Korean reviews, checked in Melbourne and
          explained in plain English. Start with three products, not ten.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/shop"
            onClick={() => trackUi("hero_shop_click", { slide_id: "korea_bestsellers" })}
            className="inline-flex items-center gap-2 rounded-full bg-hanbok-deep px-7 py-4 text-[13px] font-bold uppercase tracking-[0.1em] text-paper transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-hanbok focus-visible:ring-offset-2"
          >
            Shop the bestsellers <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            to="/consultation"
            onClick={() => trackUi("hero_routine_finder_click", { slide_id: "korea_bestsellers" })}
            className="inline-flex items-center rounded-full border-[1.5px] border-hanbok-deep px-7 py-4 text-[13px] font-bold uppercase tracking-[0.1em] text-hanbok-deep transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-hanbok focus-visible:ring-offset-2"
          >
            Find my routine
          </Link>
        </div>
        <a
          href="#glass-skin-club"
          className="w-fit text-sm text-clay underline-offset-4 hover:text-ink hover:underline"
        >
          Join the Glass Skin Club for new arrivals and routine notes →
        </a>
      </div>

      <div
        ref={stageRef}
        onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
        onPointerDown={(e) => {
          swipeX.current = e.clientX;
        }}
        onPointerUp={(e) => {
          if (swipeX.current === null) return;
          const dx = e.clientX - swipeX.current;
          swipeX.current = null;
          if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
        }}
        className="relative order-first flex min-h-[440px] touch-pan-y select-none flex-col overflow-hidden transition-[background] duration-700 md:order-none md:m-5 md:min-h-0 md:rounded-[2rem]"
        style={{
          background: `radial-gradient(120% 90% at 50% 35%, ${slide.bg[0]} 0%, ${slide.bg[1]} 100%)`,
        }}
        aria-roledescription="carousel"
        aria-label="Korean bestsellers"
      >
        <div className="absolute right-5 top-5 z-20 flex gap-2 md:right-7 md:top-7">
          {SLIDES.map((s, i) => (
            <button
              key={s.slug}
              type="button"
              onClick={() => go(i)}
              aria-label={`Show ${s.brand} ${s.name}`}
              aria-pressed={i === index}
              className={`grid h-12 w-12 place-items-center rounded-full bg-paper/80 p-1.5 backdrop-blur transition-all ${i === index ? "ring-2 ring-hanbok-deep" : "opacity-70 hover:opacity-100"}`}
            >
              <img src={s.image} alt="" className="h-full w-full object-contain" />
            </button>
          ))}
        </div>
        {BUBBLES.map((b, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="pointer-events-none absolute"
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              width: `clamp(${Math.round(b.s * 0.55)}px, ${b.s / 7}vw, ${b.s}px)`,
              aspectRatio: "1",
              transform: `translate3d(${tilt.x * b.d * -36}px, ${tilt.y * b.d * -36}px, 0)`,
              transition: "transform 0.4s ease-out",
            }}
          >
            <span
              className="block h-full w-full rounded-full transition-[background,box-shadow] duration-700 motion-safe:animate-[sg-bob_var(--t)_ease-in-out_infinite]"
              style={{ ...bubbleStyle(slide.tint), ["--t" as string]: `${b.t}s` }}
            />
          </span>
        ))}

        <div className="relative flex flex-1 items-center justify-center [perspective:1100px]">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[7%] h-[9%] w-[48%] rounded-[50%] transition-[background,box-shadow] duration-700"
            style={{
              background: `radial-gradient(60% 70% at 40% 35%, rgba(255,255,255,0.75), rgba(${slide.tint},0.18) 55%, rgba(${slide.tint},0.32) 100%)`,
              boxShadow: `inset 0 -6px 14px rgba(${slide.tint},0.35), 0 18px 30px rgba(58,38,32,0.16)`,
              transform: `translateX(${tilt.x * -14}px)`,
            }}
          />
          {SLIDES.map((s, i) => {
            const on = i === index;
            return (
              <Link
                key={s.slug}
                to="/product/$slug"
                params={{ slug: s.slug }}
                tabIndex={on ? 0 : -1}
                aria-hidden={!on}
                onClick={() => trackUi("hero_product_click", { slide_id: s.slug })}
                aria-label={`${s.brand} ${s.name}, ${s.price}`}
                className="absolute h-[80%] max-h-[540px] w-[70%] max-w-[470px] transition-[opacity,transform] duration-700 ease-[cubic-bezier(.2,.8,.2,1)]"
                style={{
                  opacity: on ? 1 : 0,
                  pointerEvents: on ? "auto" : "none",
                  transform: on
                    ? `rotateY(${tilt.x * 22}deg) rotateX(${tilt.y * -12}deg) translateZ(0)`
                    : `translateY(60px) scale(0.85) rotateY(${i < index ? -30 : 30}deg)`,
                  transformStyle: "preserve-3d",
                }}
              >
                <span className="block h-full w-full motion-safe:animate-[sg-bob_6s_ease-in-out_infinite]">
                  <img
                    src={s.image}
                    alt=""
                    width={1400}
                    height={1400}
                    fetchPriority={i === 0 ? "high" : "low"}
                    className="h-full w-full object-contain drop-shadow-[0_34px_36px_rgba(58,38,32,0.28)]"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 mix-blend-soft-light"
                    style={{
                      background: `linear-gradient(${105 + tilt.x * 40}deg, rgba(255,255,255,0) ${30 + tilt.x * 30}%, rgba(255,255,255,0.85) ${45 + tilt.x * 30}%, rgba(255,255,255,0) ${60 + tilt.x * 30}%)`,
                      WebkitMaskImage: `url(${s.image})`,
                      maskImage: `url(${s.image})`,
                      WebkitMaskSize: "contain",
                      maskSize: "contain",
                      WebkitMaskRepeat: "no-repeat",
                      maskRepeat: "no-repeat",
                      WebkitMaskPosition: "center",
                      maskPosition: "center",
                    }}
                  />
                </span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => setEnglish((v) => !v)}
            aria-label={`${slide.ko}: ${slide.en}`}
            className="absolute left-[6%] top-[12%] z-20 flex items-center gap-2.5 rounded-full bg-paper/95 px-4 py-2.5 text-[13px] font-semibold text-ink shadow-[0_14px_34px_rgba(58,38,32,0.18)] backdrop-blur transition-transform hover:scale-[1.04] md:left-[8%] md:top-[16%]"
          >
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-glaze" />
            <span aria-hidden="true" className="grid">
              <span
                className={`[grid-area:1/1] font-[family-name:var(--font-hangul)] transition-all duration-300 ${english ? "-translate-y-1.5 opacity-0" : "opacity-100"}`}
              >
                {slide.ko}
              </span>
              <span
                className={`[grid-area:1/1] transition-all duration-300 ${english ? "opacity-100" : "translate-y-1.5 opacity-0"}`}
              >
                {slide.en}
              </span>
            </span>
          </button>
        </div>

        <div className="relative z-10 px-6 pb-6 md:px-8 md:pb-7">
          <div aria-live="polite" className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink/60">
              {slide.brand} · {slide.price}
            </p>
            <p className="mt-1 text-xl font-light leading-tight tracking-[-0.02em]">{slide.name}</p>
            <p className="mt-1 text-sm text-ink/70">{slide.hook}</p>
            <p className="mt-2 text-xs font-semibold text-ink/80">{slide.proof}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Scrolling band of the glow words in English and Korean. */
export function GlowWordBand() {
  const run = [...GLOW_WORDS, ...GLOW_WORDS];
  return (
    <div className="overflow-hidden whitespace-nowrap bg-hanbok-deep py-3.5 text-paper">
      <p className="sr-only">
        Glass skin (물광), cica (병풀), honey glow (꿀광), hydration (수분), barrier (장벽).
      </p>
      <div
        aria-hidden="true"
        className="inline-block motion-safe:animate-[sg-marquee_32s_linear_infinite]"
      >
        {[0, 1].map((copy) => (
          <span key={copy}>
            {run.map(([en, ko], i) => (
              <span key={`${copy}-${i}`}>
                <span className="mx-5 text-[22px] font-light italic">{en}</span>
                <span className="mx-5 font-[family-name:var(--font-hangul)] text-lg text-glaze">
                  {ko}
                </span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
