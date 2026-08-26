import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Transition,
} from "motion/react";
import { Button } from "@/components/ui/button";
import { SHOP_PRODUCTS } from "@/lib/shop-catalog";
import { productSlug } from "@/lib/product-detail";
import stageBackdrop from "@/assets/hero-3d-stage.jpg";
import droplet from "@/assets/hero-3d-droplet.png";
import glowSerum from "@/assets/hero-chapter-glow.png";
import diveSerum from "@/assets/hero-chapter-dive.png";
import pdrnSerum from "@/assets/hero-chapter-pdrn.png";
import dynastyCream from "@/assets/hero-chapter-dynasty.png";

const CYCLE_MS = 7000;

type Chapter = {
  id: string;
  act: string;
  hangul: string;
  /** Aggressive, imperative headline — line one plain, line two accented. */
  title: [string, string];
  subtitle: string;
  /** The transformation promise — what you look and feel like after. */
  becoming: string;
  ingredient: string;
  cta: string;
  priceId: string;
  image: string;
  /** Per-chapter colour theme, painted as local CSS variables. */
  theme: { accent: string; deep: string; glow: string; ink: string };
};

/**
 * The hero's journey, four acts. Each act is a real SKU from the shelf with
 * its own colour grade, so the stage repaints as the story advances.
 */
const CHAPTERS: Chapter[] = [
  {
    id: "call",
    act: "Act I · The call",
    hangul: "광채",
    title: ["Stop hiding", "behind filters."],
    subtitle:
      "Propolis and niacinamide, whipped in Seoul into the serum Korean women reach for the week before they need to be photographed.",
    becoming: "Day 14 — you catch your own reflection in a shop window and don't look away.",
    ingredient: "Propolis extract 60% · Niacinamide 2%",
    cta: "Begin with glow",
    priceId: "beauty_of_joseon_glow_serum_propolis_plus_niacinamide_30ml_onetime",
    image: glowSerum,
    theme: {
      accent: "255 197 92",
      deep: "36 24 9",
      glow: "255 176 63",
      ink: "255 244 226",
    },
  },
  {
    id: "descent",
    act: "Act II · The descent",
    hangul: "수분",
    title: ["Melbourne air", "is stealing your skin."],
    subtitle:
      "Five weights of hyaluronic acid sink past the surface and hold. Built for a city that swings from heater to southerly in one afternoon.",
    becoming: "Night 3 — you press a cheek and it presses back, plump and quiet.",
    ingredient: "5D Complex Hyaluronic Acid · Panthenol",
    cta: "Drown the dryness",
    priceId: "torriden_dive_in_serum_onetime",
    image: diveSerum,
    theme: {
      accent: "126 205 236",
      deep: "6 27 43",
      glow: "84 179 224",
      ink: "233 248 255",
    },
  },
  {
    id: "trial",
    act: "Act III · The trial",
    hangul: "재생",
    title: ["Rebuild what", "the years took."],
    subtitle:
      "PDRN — the salmon-DNA fragment Korean clinics inject — bottled at 1% with a peptide complex, so the repair keeps running while you sleep.",
    becoming: "Week 6 — the fine lines under your eyes stop being the first thing you check.",
    ingredient: "PDRN (Sodium DNA) 1% · Peptide complex",
    cta: "Take the clinic home",
    priceId: "medicube_pdrn_pink_peptide_serum_30ml_onetime",
    image: pdrnSerum,
    theme: {
      accent: "247 168 187",
      deep: "40 15 26",
      glow: "236 132 163",
      ink: "255 238 243",
    },
  },
  {
    id: "return",
    act: "Act IV · The return",
    hangul: "왕조",
    title: ["Walk in like", "you were born glowing."],
    subtitle:
      "A Joseon-dynasty recipe of rice bran, ginseng and orchid, sealed as the last step so nothing you built during the night escapes.",
    becoming: "Month 3 — people ask what you're doing differently. You just smile.",
    ingredient: "Rice bran · Ginseng root · Orchid extract",
    cta: "Seal the routine",
    priceId: "beauty_of_joseon_dynasty_cream_50ml_onetime",
    image: dynastyCream,
    theme: {
      accent: "196 214 178",
      deep: "16 30 24",
      glow: "160 196 150",
      ink: "240 249 236",
    },
  },
];

const EASE_OUT: Transition = { duration: 0.8, ease: [0.16, 1, 0.3, 1] };
const SPRING = { stiffness: 120, damping: 22, mass: 0.6 };

/**
 * "Atmos" hero — a cinematic, four-act product story that stays above the fold.
 *
 * Each act repaints the stage with its own colour grade, swaps in a real SKU
 * cutout on a spotlit pedestal, and lands an imperative headline with a
 * transformation promise. Motion: spring pointer parallax across five depth
 * layers, scroll-linked camera recede, AnimatePresence act swaps, kinetic type
 * and an SVG orbit. Everything flattens under prefers-reduced-motion.
 */
export function AtmosHero() {
  const stageRef = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const act = CHAPTERS[index]!;
  const product = SHOP_PRODUCTS.find((p) => p.priceId === act.priceId);
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const mx = useSpring(px, SPRING);
  const my = useSpring(py, SPRING);

  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start start", "end start"],
  });
  const camY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 90]);
  const camScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.08]);
  const camFade = useTransform(scrollYProgress, [0, 0.85], [1, reduce ? 1 : 0.25]);
  const ringSpin = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 140]);

  const depth = (n: number) => ({
    x: useTransform(mx, (v) => v * n),
    y: useTransform(my, (v) => v * n * 0.7),
  });

  const bgDepth = depth(-26);
  const coneDepth = depth(18);
  const glowDepth = depth(-30);
  const heroDepth = depth(-46);
  const heroTiltY = useTransform(mx, (v) => v * 18);
  const heroTiltX = useTransform(my, (v) => v * -14);
  const dropA = { x: useTransform(mx, (v) => v * 56), y: useTransform(my, (v) => v * 42) };
  const dropB = { x: useTransform(mx, (v) => v * -44), y: useTransform(my, (v) => v * -30) };
  const dropC = { x: useTransform(mx, (v) => v * 32), y: useTransform(my, (v) => v * 24) };

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || reduce) return;
    const onPointer = (e: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      px.set((e.clientX - rect.left) / rect.width - 0.5);
      py.set((e.clientY - rect.top) / rect.height - 0.5);
    };
    const onLeave = () => {
      px.set(0);
      py.set(0);
    };
    stage.addEventListener("pointermove", onPointer);
    stage.addEventListener("pointerleave", onLeave);
    return () => {
      stage.removeEventListener("pointermove", onPointer);
      stage.removeEventListener("pointerleave", onLeave);
    };
  }, [px, py, reduce]);

  useEffect(() => {
    if (paused || reduce) return;
    const t = window.setInterval(() => setIndex((i) => (i + 1) % CHAPTERS.length), CYCLE_MS);
    return () => window.clearInterval(t);
  }, [paused, reduce]);

  const themeVars = {
    "--act-accent": act.theme.accent,
    "--act-deep": act.theme.deep,
    "--act-glow": act.theme.glow,
    "--act-ink": act.theme.ink,
  } as React.CSSProperties;

  return (
    <section
      ref={stageRef}
      aria-labelledby="atmos-heading"
      style={themeVars}
      className="relative isolate flex min-h-[calc(100svh-8.5rem)] items-center overflow-hidden transition-[background-color] duration-1000 ease-out"
    >
      {/* Colour-graded ground for the current act */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 transition-colors duration-1000"
        style={{ backgroundColor: `rgb(var(--act-deep))` }}
      />

      {/* Layer 1 — cinematic backdrop plate */}
      <motion.img
        src={stageBackdrop}
        alt=""
        aria-hidden="true"
        width={1920}
        height={1280}
        style={{ x: bgDepth.x, y: camY, scale: camScale, opacity: camFade }}
        className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover opacity-40 mix-blend-luminosity will-change-transform"
      />

      {/* Layer 2 — act colour wash */}
      <div
        aria-hidden="true"
        className="absolute inset-0 transition-[background] duration-1000"
        style={{
          background: `radial-gradient(85% 65% at 62% 30%, rgb(var(--act-glow) / 0.28) 0%, transparent 62%), linear-gradient(180deg, rgb(var(--act-deep) / 0.35) 0%, transparent 34%, rgb(var(--act-deep) / 0.95) 100%)`,
        }}
      />

      {/* Layer 3 — volumetric spotlight cone */}
      <motion.div
        aria-hidden="true"
        style={{
          x: coneDepth.x,
          background: `conic-gradient(from 180deg at 50% 0%, transparent 0deg, rgb(var(--act-accent) / 0.2) 172deg, rgb(var(--act-accent) / 0.2) 188deg, transparent 360deg)`,
        }}
        animate={reduce ? undefined : { opacity: [0.5, 0.95, 0.5], scaleY: [1, 1.05, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[62%] top-0 h-[75%] w-[46rem] origin-top -translate-x-1/2 blur-2xl"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-10 px-6 py-12 md:px-12 md:py-14 lg:grid-cols-12 lg:gap-8">
        {/* Kinetic type column */}
        <div className="lg:col-span-6">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={`${act.id}-act`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.32em]"
              style={{ color: `rgb(var(--act-accent))` }}
            >
              <span className="h-px w-8" style={{ backgroundColor: `rgb(var(--act-accent))` }} />
              {act.act}
              <span className="font-display text-sm tracking-normal">{act.hangul}</span>
            </motion.p>
          </AnimatePresence>

          <h1
            id="atmos-heading"
            className="mt-5 font-masthead text-[clamp(2.4rem,5.6vw,4.6rem)] leading-[0.92] tracking-tight [text-shadow:0_24px_60px_rgba(0,0,0,0.5)]"
            style={{ color: `rgb(var(--act-ink))` }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={`${act.id}-title`} className="block">
                <span className="block overflow-hidden">
                  <motion.span
                    className="block"
                    initial={{ y: "110%", rotateX: -55, opacity: 0 }}
                    animate={{ y: "0%", rotateX: 0, opacity: 1 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {act.title[0]}
                  </motion.span>
                </span>
                <span className="block overflow-hidden">
                  <motion.span
                    className="block italic"
                    style={{ color: `rgb(var(--act-accent))` }}
                    initial={{ y: "110%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {act.title[1]}
                  </motion.span>
                </span>
              </motion.span>
            </AnimatePresence>
          </h1>

          <div className="mt-5 min-h-[5.5rem] max-w-xl">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${act.id}-copy`}
                initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
                transition={{ duration: 0.55, ease: "easeOut" }}
              >
                <p
                  className="text-[15px] font-light leading-relaxed"
                  style={{ color: `rgb(var(--act-ink) / 0.78)` }}
                >
                  {act.subtitle}
                </p>
                <p
                  className="mt-3 border-l pl-4 text-[13px] font-light italic leading-relaxed"
                  style={{
                    color: `rgb(var(--act-ink) / 0.62)`,
                    borderColor: `rgb(var(--act-accent) / 0.5)`,
                  }}
                >
                  {act.becoming}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Calls to action */}
          <motion.div
            initial={false}
            animate={mounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={{ ...EASE_OUT, delay: 0.25 }}
            className="mt-7 flex flex-wrap items-center gap-5"
          >
            {product && (
              <Button
                asChild
                className="rounded-full px-8 py-6 text-[11px] font-semibold uppercase tracking-[0.22em] shadow-[0_20px_50px_-18px_rgba(0,0,0,0.85)] transition-transform hover:-translate-y-0.5"
                style={{ backgroundColor: `rgb(var(--act-accent))`, color: `rgb(var(--act-deep))` }}
              >
                <Link to="/product/$slug" params={{ slug: productSlug(product) }}>
                  {act.cta} — {product.price} <ArrowRight />
                </Link>
              </Button>
            )}
            <Link
              to="/consultation"
              search={{}}
              className="group inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] transition"
              style={{ color: `rgb(var(--act-ink) / 0.75)` }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Get my free skin report
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>

          {/* Act selector — chapter markers with cycle timer */}
          <ul
            className="mt-8 flex flex-wrap gap-2"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {CHAPTERS.map((c, i) => (
              <li key={c.id}>
                <motion.button
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-pressed={i === index}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 400, damping: 26 }}
                  className="relative overflow-hidden rounded-full border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors"
                  style={
                    i === index
                      ? { borderColor: `rgb(var(--act-accent))`, color: `rgb(var(--act-accent))` }
                      : { borderColor: `rgb(var(--act-ink) / 0.22)`, color: `rgb(var(--act-ink) / 0.6)` }
                  }
                >
                  {i === index && (
                    <motion.span
                      aria-hidden="true"
                      className="absolute inset-y-0 left-0 -z-10"
                      style={{ backgroundColor: `rgb(var(--act-accent) / 0.2)` }}
                      initial={{ width: "0%" }}
                      animate={{ width: paused || reduce ? "100%" : ["0%", "100%"] }}
                      transition={{ duration: paused || reduce ? 0.3 : CYCLE_MS / 1000, ease: "linear" }}
                    />
                  )}
                  <span className="mr-2 font-display normal-case tracking-normal">{c.hangul}</span>
                  {`0${i + 1}`}
                </motion.button>
              </li>
            ))}
          </ul>
        </div>

        {/* 3D product stage */}
        <div className="relative lg:col-span-6">
          <div className="relative mx-auto aspect-square w-full max-w-[26rem] [perspective:1200px]">
            <motion.div
              aria-hidden="true"
              style={{
                x: glowDepth.x,
                y: glowDepth.y,
                backgroundColor: `rgb(var(--act-glow) / 0.3)`,
              }}
              animate={reduce ? undefined : { scale: [1, 1.08, 1], opacity: [0.75, 1, 0.75] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-1/2 top-1/2 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[90px]"
            />

            {/* SVG orbit */}
            <motion.svg
              aria-hidden="true"
              viewBox="0 0 400 400"
              style={{ rotate: ringSpin, color: `rgb(var(--act-accent))` }}
              className="absolute left-1/2 top-[62%] h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 [transform:rotateX(72deg)]"
            >
              <motion.circle
                cx="200"
                cy="200"
                r="180"
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.3"
                strokeWidth="1"
                strokeDasharray="6 14"
                animate={reduce ? undefined : { strokeDashoffset: [0, -200] }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              />
              <motion.circle
                cx="200"
                cy="200"
                r="120"
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.5"
                strokeWidth="1.5"
                strokeDasharray="300 460"
                animate={reduce ? undefined : { rotate: -360 }}
                transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                style={{ originX: "200px", originY: "200px" }}
              />
            </motion.svg>

            {/* Drifting glass droplets */}
            {[
              { c: "left-0 top-8 w-12", d: dropA, dur: 8 },
              { c: "right-2 top-20 w-8", d: dropB, dur: 9.6 },
              { c: "left-6 bottom-16 w-7", d: dropC, dur: 11 },
            ].map((o, i) => (
              <motion.img
                key={o.c}
                src={droplet}
                alt=""
                aria-hidden="true"
                loading="lazy"
                width={768}
                height={768}
                style={{ x: o.d.x, y: o.d.y }}
                animate={reduce ? undefined : { y: [0, -14, 0] }}
                transition={{ duration: o.dur, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
                className={`absolute ${o.c} opacity-60 mix-blend-screen`}
              />
            ))}

            {/* The product — swap with a cinematic dissolve, 3D tilt, reflection */}
            <motion.div
              style={{
                x: heroDepth.x,
                y: heroDepth.y,
                rotateY: heroTiltY,
                rotateX: heroTiltX,
                transformStyle: "preserve-3d",
              }}
              className="absolute inset-x-0 top-[4%] mx-auto w-[58%] will-change-transform"
            >
              <div className="relative aspect-square">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={act.id}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 0.86, filter: "blur(14px)", rotate: -7 }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)", rotate: 0 }}
                    exit={{ opacity: 0, scale: 1.08, filter: "blur(16px)", rotate: 6 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <motion.img
                      src={act.image}
                      alt={product ? `${product.brand} ${product.name}` : act.ingredient}
                      width={1024}
                      height={1024}
                      animate={reduce ? undefined : { y: [0, -16, 0] }}
                      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                      className="w-full drop-shadow-[0_50px_70px_rgba(0,0,0,0.7)]"
                    />
                    <img
                      src={act.image}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      className="absolute inset-x-0 top-full w-full -scale-y-100 opacity-20 blur-[3px] [mask-image:linear-gradient(to_bottom,black_0%,transparent_55%)]"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Product plate */}
            <div
              className="absolute inset-x-2 bottom-0 overflow-hidden rounded-2xl border px-5 py-4 backdrop-blur-md"
              style={{
                borderColor: `rgb(var(--act-ink) / 0.16)`,
                backgroundColor: `rgb(var(--act-deep) / 0.6)`,
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`${act.id}-plate`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p
                    className="text-[10px] font-semibold uppercase tracking-[0.24em]"
                    style={{ color: `rgb(var(--act-accent))` }}
                  >
                    {product?.brand ?? "Skin Grocer"} · {product?.price ?? ""}
                  </p>
                  <p
                    className="mt-1.5 font-display text-sm uppercase tracking-[0.1em]"
                    style={{ color: `rgb(var(--act-ink))` }}
                  >
                    {product?.name ?? act.title[0]}
                  </p>
                  <p
                    className="mt-1 text-[11px] font-light italic"
                    style={{ color: `rgb(var(--act-ink) / 0.6)` }}
                  >
                    {act.ingredient}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Specular sweep across the bottom edge */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 z-10 h-px overflow-hidden"
        style={{ backgroundColor: `rgb(var(--act-ink) / 0.12)` }}
      >
        <motion.div
          className="h-px w-1/3"
          style={{
            background: `linear-gradient(90deg, transparent, rgb(var(--act-accent)), transparent)`,
          }}
          animate={reduce ? undefined : { x: ["-100%", "300%"] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </section>
  );
}
