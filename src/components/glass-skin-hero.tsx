import { AISLES } from "@/lib/aisles";
import { useEffect, useRef, useState, type PointerEvent } from "react";
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
  /** Rendered backdrop and where its pedestal's top sits (0–1 of the plate). */
  plate: string;
  pedestal: number;
  /** Packshot box height as a share of the stage, the empty band below the
   *  product inside its image, and the product's width inside its image. */
  size: number;
  foot: number;
  body: number;
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
    plate: "/hero/plate-periwinkle.webp",
    pedestal: 0.85,
    size: 0.56,
    foot: 0.03,
    body: 0.43,
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
    plate: "/hero/plate-green.webp",
    pedestal: 0.785,
    size: 0.5,
    foot: 0.03,
    body: 0.32,
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
    plate: "/hero/plate-water.webp",
    pedestal: 0.8,
    size: 0.4,
    foot: 0.106,
    body: 0.94,
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
    plate: "/hero/plate-sea.webp",
    pedestal: 0.79,
    size: 0.54,
    foot: 0.03,
    body: 0.34,
  },
];

const ROTATE_MS = 6000;

/** Drag distance becomes spin, easing off towards ±60 degrees. */
const spinFor = (dx: number) => 60 * Math.tanh((dx * 0.6) / 60);

/** The words customers already search for, in English and Korean. */
const GLOW_WORDS = [AISLES.glass, AISLES.hydration, AISLES.barrier, AISLES.cica, AISLES.honey];

/**
 * Plate geometry, in the stage's container units. Each plate is a square a
 * little larger than the stage, nudged up so its pedestal sits near the
 * lower edge without ever exposing the plate's own edge.
 */
const PLATE = "calc(max(100cqw, 100cqh) * 1.08)";
const plateTop = (pedestal: number) =>
  `clamp(calc(100cqh - ${PLATE}), calc(80cqh - ${PLATE} * ${pedestal}), 0px)`;
const pedestalY = (pedestal: number) => `calc(${plateTop(pedestal)} + ${PLATE} * ${pedestal})`;

/**
 * Product-led homepage hero: each stocked bestseller rests on a rendered
 * glass-and-liquid pedestal, with real bubbles drifting in front. The scene
 * tilts with the cursor, the product spins when dragged, and each one's key
 * ingredient label translates from Korean to English.
 */
export function GlassSkinHero() {
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [english, setEnglish] = useState(false);
  const swipeX = useRef<number | null>(null);
  const drag = useRef<{ x: number; moved: boolean } | null>(null);
  const [spin, setSpin] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [played, setPlayed] = useState(false);
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

  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrollY(Math.min(window.scrollY, 900)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reduce]);

  const endDrag = () => {
    setDragging(false);
    setSpin(0);
  };

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
      className="relative grid overflow-hidden bg-paper text-ink md:min-h-[660px] md:grid-cols-[0.95fr_1.05fr]"
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
        className="relative order-first h-[min(122vw,580px)] touch-pan-y select-none overflow-hidden bg-blush [--k:0.84] [container-type:size] md:order-none md:[--k:0.9] xl:[--k:1] md:m-5 md:h-auto md:rounded-[2rem]"
        aria-roledescription="carousel"
        aria-label="Korean bestsellers"
      >
        {SLIDES.map((s, i) => {
          const on = i === index;
          return (
            <div
              key={s.slug}
              aria-hidden={!on}
              className="absolute inset-0 transition-opacity duration-[900ms] ease-out"
              style={{ opacity: on ? 1 : 0, zIndex: on ? 1 : 0 }}
            >
              <div
                className="absolute"
                style={{
                  width: PLATE,
                  height: PLATE,
                  left: `calc((100cqw - ${PLATE}) / 2)`,
                  top: plateTop(s.pedestal),
                  transform: `translate3d(${tilt.x * -14}px, ${tilt.y * -10 + scrollY * 0.06}px, 0) scale(1.03)`,
                  transition: "transform 0.6s ease-out",
                }}
              >
                <img
                  src={s.plate}
                  alt=""
                  width={1000}
                  height={1000}
                  draggable={false}
                  fetchPriority={i === 0 ? "high" : "low"}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="h-full w-full object-cover"
                />
              </div>

              {on && !reduce ? (
                <span
                  key={index}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 rounded-[50%] border-[1.5px] border-white/80 opacity-0 motion-safe:animate-[sg-ripple_1.6s_0.45s_ease-out_forwards]"
                  style={{
                    top: pedestalY(s.pedestal),
                    width: `calc(${PLATE} * 0.5)`,
                    height: `calc(${PLATE} * 0.075)`,
                  }}
                />
              ) : null}

              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 rounded-[50%] bg-[rgba(58,38,32,0.32)] blur-[10px]"
                style={{
                  top: pedestalY(s.pedestal),
                  width: `calc(${s.size * s.body * 0.95} * var(--k) * 100cqh)`,
                  height: "3.2cqh",
                  transform: `translate(calc(-50% + ${tilt.x * -8}px), -50%)`,
                }}
              />

              <Link
                to="/product/$slug"
                params={{ slug: s.slug }}
                tabIndex={on ? 0 : -1}
                draggable={false}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  if (reduce) return;
                  drag.current = { x: e.clientX, moved: false };
                  setDragging(true);
                  e.currentTarget.setPointerCapture(e.pointerId);
                }}
                onPointerMove={(e) => {
                  if (!drag.current || !dragging) return;
                  const dx = e.clientX - drag.current.x;
                  if (Math.abs(dx) > 6 && !drag.current.moved) {
                    drag.current.moved = true;
                    setPlayed(true);
                    setPaused(true);
                  }
                  setSpin(spinFor(dx));
                }}
                onPointerUp={(e) => {
                  e.stopPropagation();
                  endDrag();
                }}
                onPointerCancel={endDrag}
                onClick={(e) => {
                  if (drag.current?.moved) {
                    e.preventDefault();
                    drag.current = null;
                    return;
                  }
                  drag.current = null;
                  trackUi("hero_product_click", { slide_id: s.slug });
                }}
                aria-label={`${s.brand} ${s.name}, ${s.price}`}
                className={`absolute touch-pan-y [perspective:1100px] ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
                style={{
                  width: `calc(${s.size} * var(--k) * 100cqh)`,
                  height: `calc(${s.size} * var(--k) * 100cqh)`,
                  left: `calc(50cqw - ${s.size / 2} * var(--k) * 100cqh)`,
                  top: `calc(${pedestalY(s.pedestal)} - ${s.size * (1 - s.foot)} * var(--k) * 100cqh)`,
                  pointerEvents: on ? "auto" : "none",
                }}
              >
                <span
                  key={on ? index : "off"}
                  className="block h-full w-full motion-safe:animate-[sg-settle_0.9s_cubic-bezier(.2,.9,.3,1)_both]"
                >
                  <span
                    className="relative block h-full w-full"
                    style={{
                      transform: `rotateY(${tilt.x * 18 + spin}deg) rotateX(${tilt.y * -6}deg)`,
                      transformOrigin: "50% 100%",
                      transformStyle: "preserve-3d",
                      transition: dragging ? "none" : "transform 0.9s cubic-bezier(.3,1.45,.5,1)",
                    }}
                  >
                    <img
                      src={s.image}
                      alt=""
                      draggable={false}
                      width={1400}
                      height={1400}
                      fetchPriority={i === 0 ? "high" : "low"}
                      className="h-full w-full object-contain drop-shadow-[0_18px_22px_rgba(58,38,32,0.22)]"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 mix-blend-soft-light"
                      style={{
                        background: `linear-gradient(${105 + tilt.x * 40 + spin}deg, rgba(255,255,255,0) ${30 + tilt.x * 30 + spin / 2}%, rgba(255,255,255,0.85) ${45 + tilt.x * 30 + spin / 2}%, rgba(255,255,255,0) ${60 + tilt.x * 30 + spin / 2}%)`,
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
                </span>
              </Link>
            </div>
          );
        })}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[-6%] z-[2] opacity-70 mix-blend-screen"
          style={{
            transform: `translate3d(${tilt.x * -40}px, ${tilt.y * -26 - scrollY * 0.14}px, 0)`,
            transition: "transform 0.5s ease-out",
          }}
        >
          <img
            src="/hero/bubbles-overlay.webp"
            alt=""
            width={1100}
            height={619}
            className="h-full w-full object-cover motion-safe:animate-[sg-drift_14s_ease-in-out_infinite]"
          />
        </div>

        <div className="absolute left-4 top-4 z-10 max-w-[64%] rounded-2xl bg-white/50 px-4 py-3 shadow-[0_10px_30px_rgba(58,38,32,0.08)] ring-1 ring-white/70 backdrop-blur-md md:left-7 md:top-7 md:max-w-[min(52%,320px)] md:px-5 md:py-4">
          <button
            type="button"
            onClick={() => setEnglish((v) => !v)}
            aria-label={`${slide.ko}: ${slide.en}`}
            className="mb-2.5 flex items-center gap-2 rounded-full bg-paper px-3 py-1.5 text-[12px] font-semibold text-ink shadow-sm transition-transform hover:scale-[1.04]"
          >
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-glaze" />
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
          <div aria-live="polite" className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink/60 md:text-[11px]">
              {slide.brand} · {slide.price}
            </p>
            <p className="mt-1 text-[17px] font-light leading-tight tracking-[-0.02em] md:text-xl">
              {slide.name}
            </p>
            <p className="mt-1 hidden text-sm text-ink/70 2xl:block">{slide.hook}</p>
            <p className="mt-1.5 text-[11px] font-semibold text-ink/80 md:text-xs">{slide.proof}</p>
          </div>
        </div>

        <div className="absolute right-4 top-4 z-10 flex flex-col gap-2 md:right-7 md:top-7">
          {SLIDES.map((s, i) => (
            <button
              key={s.slug}
              type="button"
              onClick={() => go(i)}
              aria-label={`Show ${s.brand} ${s.name}`}
              aria-pressed={i === index}
              className={`grid h-10 w-10 place-items-center rounded-full bg-white/60 p-1.5 ring-1 ring-white/80 backdrop-blur-md transition-all md:h-12 md:w-12 ${i === index ? "scale-110 bg-white/90 ring-2 ring-hanbok-deep" : "opacity-75 hover:opacity-100"}`}
            >
              <img src={s.image} alt="" className="h-full w-full object-contain" />
            </button>
          ))}
        </div>

        <p
          aria-hidden="true"
          className={`absolute bottom-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/55 px-3 py-1.5 text-[11px] font-semibold text-ink/70 backdrop-blur transition-opacity duration-500 md:bottom-5 ${played || reduce ? "opacity-0" : "opacity-100"}`}
        >
          drag to spin · swipe for more
        </p>
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
        Glass skin (물광), hydration (수분), barrier (장벽), cica calm (병풀), honey glow (꿀광).
      </p>
      <div
        aria-hidden="true"
        className="inline-block motion-safe:animate-[sg-marquee_32s_linear_infinite]"
      >
        {[0, 1].map((copy) => (
          <span key={copy}>
            {run.map((aisle, i) => (
              <span key={`${copy}-${i}`} className="mx-5 inline-flex items-center gap-3 align-middle">
                <span
                  className={`inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-[11px] font-semibold tabular-nums text-ink ${aisle.bg}`}
                >
                  {aisle.number}
                </span>
                <span className="text-[22px] font-light italic">{aisle.name}</span>
                <span className="font-[family-name:var(--font-hangul)] text-lg text-glaze">{aisle.ko}</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
