import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Transition,
} from "motion/react";
import { Button } from "@/components/ui/button";
import { useStaffAccess } from "@/hooks/use-staff-access";
import { SHOP_PRODUCTS } from "@/lib/shop-catalog";
import { productSlug } from "@/lib/product-detail";
import {
  DEFAULT_HERO_MOTION_STYLE,
  HERO_MOTION_STORAGE_KEY,
  HERO_MOTION_STYLES,
  shardsFor,
  fragmentsFor,
} from "@/lib/hero-motion-styles";
import bgPlum from "@/assets/hero-bg-plum.jpg";
import bgCica from "@/assets/hero-bg-cica.jpg";
import bgSun from "@/assets/hero-bg-sun.jpg";
import bgGlow from "@/assets/hero-bg-glow.jpg";
import droplet from "@/assets/hero-3d-droplet.png";
import plumToner from "@/assets/hero-spring-plum.png";
import cicaAmpoule from "@/assets/hero-spring-cica.png";
import sunCream from "@/assets/hero-spring-sun.png";
import glowSerum from "@/assets/hero-spring-glow.png";

const CYCLE_MS = 5200;

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
  /** Macro gel backdrop graded to the product's own colour. */
  backdrop: string;
  /** Per-chapter colour theme, painted as local CSS variables. */
  theme: { accent: string; deep: string; glow: string; ink: string };
};

/**
 * The hero's journey, four acts. Each act is a real SKU from the shelf with
 * its own colour grade, so the stage repaints as the story advances.
 */
const CHAPTERS: Chapter[] = [
  {
    id: "shed",
    act: "Act I · The thaw",
    hangul: "각질",
    title: ["Shed the winter", "you're still wearing."],
    subtitle:
      "Green plum with AHA and BHA lifts the dull, heater-dried layer months of Melbourne cold left behind — gently, on a toner pad's worth of acid.",
    becoming: "Day 5 — makeup stops sitting in patches and starts sitting on skin.",
    ingredient: "Green plum extract · AHA + BHA",
    cta: "Start the reset",
    priceId: "beauty_of_joseon_green_plum_refreshing_toner_150ml_onetime",
    image: plumToner,
    backdrop: bgPlum,
    theme: {
      accent: "104 128 58",
      deep: "240 234 216",
      glow: "203 216 150",
      ink: "46 40 31",
    },
  },
  {
    id: "calm",
    act: "Act II · The pollen",
    hangul: "진정",
    title: ["Spring hits back.", "Calm it down."],
    subtitle:
      "Centella asiatica at ampoule strength for the September weeks when pollen, wind and warm afternoons turn every cheek pink.",
    becoming: "Night 2 — the sting after cleansing simply isn't there anymore.",
    ingredient: "Centella asiatica 76% · Madecassoside",
    cta: "Soothe the flare",
    priceId: "beplain_cicaful_ampoule_30ml_onetime",
    image: cicaAmpoule,
    backdrop: bgCica,
    theme: {
      accent: "62 122 92",
      deep: "240 236 222",
      glow: "186 216 186",
      ink: "46 40 31",
    },
  },
  {
    id: "shield",
    act: "Act III · The sun returns",
    hangul: "자외선",
    title: ["The UV index", "doesn't wait for summer."],
    subtitle:
      "A mineral SPF50+ PA++++ built on barrier ceramides — light enough for spring commutes, serious enough for an Australian October.",
    becoming: "Week 4 — the freckles you were bracing for never arrive.",
    ingredient: "Mineral SPF50+ PA++++ · Ceramide barrier complex",
    cta: "Shield the skin",
    priceId: "aestura_derma_uv365_barrier_moisture_mineral_sun_cream_onetime",
    image: sunCream,
    backdrop: bgSun,
    theme: {
      accent: "26 118 168",
      deep: "234 233 231",
      glow: "168 216 236",
      ink: "38 38 45",
    },
  },
  {
    id: "bloom",
    act: "Act IV · The bloom",
    hangul: "광채",
    title: ["Step into spring", "already glowing."],
    subtitle:
      "Propolis and niacinamide, whipped in Seoul into the serum Korean women reach for the week before they need to be photographed.",
    becoming: "Day 14 — you catch your own reflection in a shop window and don't look away.",
    ingredient: "Propolis extract 60% · Niacinamide 2%",
    cta: "Finish with glow",
    priceId: "beauty_of_joseon_glow_serum_propolis_plus_niacinamide_30ml_onetime",
    image: glowSerum,
    backdrop: bgGlow,
    theme: {
      accent: "192 108 52",
      deep: "247 234 222",
      glow: "246 200 158",
      ink: "48 34 32",
    },
  },
];


const EASE_OUT: Transition = { duration: 0.45, ease: [0.16, 1, 0.3, 1] };
const SPRING = { stiffness: 260, damping: 18, mass: 0.4 };

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
  const [styleId, setStyleId] = useState(DEFAULT_HERO_MOTION_STYLE);
  const [replayKey, setReplayKey] = useState(0);
  const [isLovablePreview, setIsLovablePreview] = useState(false);
  const { isStaff } = useStaffAccess();
  useEffect(() => {
    setMounted(true);
    const hostname = window.location.hostname;
    setIsLovablePreview(
      hostname === "localhost" ||
        hostname.includes("-preview--") ||
        hostname.endsWith("-dev.lovable.app"),
    );
    const saved = window.localStorage.getItem(HERO_MOTION_STORAGE_KEY);
    if (saved && HERO_MOTION_STYLES.some((s) => s.id === saved)) setStyleId(saved);
  }, []);
  const showPreviewTools = isStaff || isLovablePreview;
  const motionStyle = HERO_MOTION_STYLES.find((s) => s.id === styleId) ?? HERO_MOTION_STYLES[0]!;
  const shards = shardsFor(motionStyle);
  const fragments = fragmentsFor(motionStyle);
  /** Same act, new choreography — force a fresh entrance so the pick is visible. */
  const swapKey = `${act.id}-${motionStyle.id}-${replayKey}`;
  const pickStyle = (id: string) => {
    setStyleId(id);
    window.localStorage.setItem(HERO_MOTION_STORAGE_KEY, id);
    setReplayKey((k) => k + 1);
  };


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

  // Impact: every act change slams the stage per the selected motion style.
  const impact = useAnimationControls();
  useEffect(() => {
    if (reduce) return;
    impact.set({ x: 0, y: 0, rotate: 0, scale: 1 });
    void impact.start(motionStyle.impact);
  }, [swapKey, impact, reduce, motionStyle]);

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

      {/* Layer 1 — cinematic backdrop plate, regraded per act */}
      <motion.div
        aria-hidden="true"
        style={{ x: bgDepth.x, y: camY, scale: camScale, opacity: camFade }}
        className="pointer-events-none absolute inset-0 will-change-transform"
      >
        <AnimatePresence initial={false}>
          <motion.img
            key={act.id}
            src={act.backdrop}
            alt=""
            width={1920}
            height={1280}
            initial={{ opacity: 0, scale: 1.16, filter: "blur(12px)" }}
            animate={{ opacity: 0.95, scale: 1.05, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.02, filter: "blur(10px)" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 h-full w-full object-cover mix-blend-multiply"
          />
        </AnimatePresence>
      </motion.div>

      {/* Layer 2 — act colour wash */}
      <div
        aria-hidden="true"
        className="absolute inset-0 transition-[background] duration-1000"
        style={{
          background: `radial-gradient(75% 60% at 68% 32%, rgb(var(--act-glow) / 0.35) 0%, transparent 65%), linear-gradient(100deg, rgb(var(--act-deep) / 0.94) 0%, rgb(var(--act-deep) / 0.7) 42%, transparent 78%), linear-gradient(180deg, transparent 55%, rgb(var(--act-deep) / 0.55) 100%)`,
        }}
      />

      {/* Layer 3 — volumetric spotlight cone */}
      <motion.div
        aria-hidden="true"
        style={{
          x: coneDepth.x,
          background: `conic-gradient(from 180deg at 50% 0%, transparent 0deg, rgb(var(--act-accent) / 0.12) 172deg, rgb(var(--act-accent) / 0.12) 188deg, transparent 360deg)`,
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
              className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.34em]"
              style={{ color: `rgb(var(--act-accent))` }}
            >
              <span className="h-px w-8" style={{ backgroundColor: `rgb(var(--act-accent))` }} />
              {act.act}
              <span className="font-display text-sm tracking-normal">{act.hangul}</span>
            </motion.p>
          </AnimatePresence>

<h1
            id="atmos-heading"
            className="mt-5 font-masthead text-[clamp(3.1rem,7.4vw,6.2rem)] font-black leading-[0.85] tracking-[-0.03em] mix-blend-multiply [text-shadow:0_18px_44px_rgba(255,255,255,0.5)]"
            style={{ color: `rgb(var(--act-ink))` }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={`${act.id}-title`} className="block">
                <span className="block overflow-hidden">
                  <motion.span
                    className="block"
                    initial={{ y: "110%", rotateX: -55, opacity: 0 }}
                    animate={{ y: "0%", rotateX: 0, opacity: 1 }}
                    transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
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
                    transition={{ duration: 0.4, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
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
                  className="max-w-[46ch] text-[17px] font-medium leading-[1.55]"
                  style={{ color: `rgb(var(--act-ink) / 0.94)` }}
                >
                  {act.subtitle}
                </p>
                <p
                  className="mt-3 border-l-2 pl-4 text-[14px] font-semibold italic leading-relaxed"
                  style={{
                    color: `rgb(var(--act-ink) / 0.82)`,
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
            transition={{ ...EASE_OUT, delay: 0.12 }}
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

          {/* Deep links into the act's real product page */}
          {product && (
            <motion.div
              initial={false}
              animate={mounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ ...EASE_OUT, delay: 0.18 }}
              className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-semibold uppercase tracking-[0.2em]"
              style={{ color: `rgb(var(--act-ink) / 0.6)` }}
            >
              {[
                { label: "Full details", hash: "suits" },
                { label: "Key ingredients", hash: "ingredients" },
                { label: "How to use", hash: "how" },
              ].map((item, i) => (
                <span key={item.hash} className="flex items-center gap-4">
                  {i > 0 && <span aria-hidden="true" className="opacity-40">·</span>}
                  <Link
                    to="/product/$slug"
                    params={{ slug: productSlug(product) }}
                    hash={item.hash}
                    className="underline-offset-4 transition hover:underline"
                  >
                    {item.label}
                  </Link>
                </span>
              ))}
            </motion.div>
          )}


          {/* Act selector — available to staff and inside the private Lovable preview. */}
          {showPreviewTools && (
            <ul
              className="fixed bottom-[6.25rem] left-1/2 z-[180] flex max-w-[calc(100vw-2rem)] -translate-x-1/2 flex-wrap justify-center gap-2 rounded-md border border-border bg-background/95 p-2 shadow-xl backdrop-blur"
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
                        : { borderColor: `rgb(var(--act-ink) / 0.22)`, color: `rgb(var(--act-ink) / 0.8)` }
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
          )}

          {/* Entrance style switcher — hidden from shoppers on the published site. */}
          {showPreviewTools && mounted && !reduce && (
            <div className="fixed bottom-4 left-1/2 z-[180] w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-md border border-border bg-background/95 p-3 shadow-xl backdrop-blur">
              <p
                className="text-center text-[9px] font-semibold uppercase tracking-[0.26em]"
                style={{ color: `rgb(var(--act-ink) / 0.45)` }}
              >
                Preview animation · {motionStyle.blurb}
              </p>
              <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                {HERO_MOTION_STYLES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => pickStyle(s.id)}
                    aria-pressed={s.id === motionStyle.id}
                    title={s.blurb}
                    className="rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors"
                    style={
                      s.id === motionStyle.id
                        ? {
                            borderColor: `rgb(var(--act-accent))`,
                            backgroundColor: `rgb(var(--act-accent) / 0.14)`,
                            color: `rgb(var(--act-accent))`,
                          }
                        : {
                            borderColor: `rgb(var(--act-ink) / 0.18)`,
                            color: `rgb(var(--act-ink) / 0.55)`,
                          }
                    }
                  >
                    {s.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setReplayKey((k) => k + 1)}
                  className="rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] underline underline-offset-4"
                  style={{ color: `rgb(var(--act-ink) / 0.5)` }}
                >
                  Replay
                </button>
              </div>
            </div>
          )}
        </div>


        {/* 3D product stage */}
        <div className="relative lg:col-span-6">
          <motion.div
            animate={impact}
            className="relative mx-auto aspect-square w-full max-w-[42rem] [perspective:1200px]"
          >
            {/* Impact flash */}
            {!reduce && motionStyle.flash && (
              <AnimatePresence initial={false}>
                <motion.span
                  key={`${swapKey}-flash`}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-20 rounded-full blur-3xl"
                  style={{
                    background: `radial-gradient(circle at 50% 55%, rgb(255 255 255 / 0.9) 0%, rgb(var(--act-glow) / 0.7) 38%, transparent 70%)`,
                  }}
                  initial={{ opacity: motionStyle.flash.from, scale: 0.5 }}
                  animate={{ opacity: 0, scale: motionStyle.flash.to }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: motionStyle.flash.duration, ease: "easeOut" }}
                />
              </AnimatePresence>
            )}

            {/* Shards flung outward on impact */}
            {!reduce && shards.length > 0 && (
              <AnimatePresence initial={false}>
                {shards.map((sh, i) => (
                  <motion.span
                    key={`${swapKey}-shard-${i}`}
                    aria-hidden="true"
                    className="pointer-events-none absolute left-1/2 top-[56%] z-20 rounded-full"
                    style={{
                      width: sh.size,
                      height: sh.size,
                      backgroundColor: `rgb(var(--act-accent) / 0.65)`,
                    }}
                    initial={{ x: 0, y: 0, opacity: 0.9, scale: 1 }}
                    animate={{
                      x: Math.cos(sh.angle) * sh.dist,
                      y: Math.sin(sh.angle) * sh.dist + sh.gravity,
                      opacity: 0,
                      scale: 0.3,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: sh.duration, ease: [0.12, 0.8, 0.3, 1] }}
                  />
                ))}
              </AnimatePresence>
            )}
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
              className="absolute inset-x-0 top-[2%] mx-auto w-[88%] will-change-transform"
            >
              <div className="relative aspect-square">
                {/* Shockwave burst on each act change */}
                {!reduce && motionStyle.waves && (
                  <AnimatePresence initial={false}>
                    {Array.from({ length: motionStyle.waves.count }, (_, w) => (
                      <motion.span
                        key={`${swapKey}-wave-${w}`}
                        aria-hidden="true"
                        className="pointer-events-none absolute left-1/2 top-[58%] h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
                        style={{ borderColor: `rgb(var(--act-accent) / 0.7)` }}
                        initial={{ scale: 0.2, opacity: 0.75 }}
                        animate={{ scale: motionStyle.waves!.scale, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: motionStyle.waves!.duration,
                          delay: w * motionStyle.waves!.stagger,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      />
                    ))}
                  </AnimatePresence>
                )}
                <AnimatePresence initial={false}>
                  <motion.div
                    key={swapKey}
                    className="absolute inset-0"
                    initial={reduce ? { opacity: 0 } : motionStyle.product.initial}
                    animate={motionStyle.product.animate}
                    exit={reduce ? { opacity: 0 } : motionStyle.product.exit}
                    transition={reduce ? { duration: 0.3 } : motionStyle.product.transition}
                  >
                    {fragments.length > 0 && !reduce ? (
                      <motion.div
                        className="relative w-full"
                        animate={{ y: [0, -14, 0] }}
                        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        {/* Invisible sizer keeps layout identical to the whole bottle */}
                        <img
                          src={act.image}
                          alt={product ? `${product.brand} ${product.name}` : act.ingredient}
                          width={1024}
                          height={1024}
                          className="w-full opacity-0"
                        />
                        {fragments.map((f, i) => (
                          <motion.img
                            key={`${swapKey}-frag-${i}`}
                            src={act.image}
                            alt=""
                            aria-hidden="true"
                            width={1024}
                            height={1024}
                            className="absolute inset-0 w-full drop-shadow-[0_50px_70px_rgba(0,0,0,0.7)]"
                            style={{ clipPath: f.clip, WebkitClipPath: f.clip }}
                            initial={{ x: f.dx, y: f.dy, rotate: f.rot, opacity: 0, scale: 1.25, filter: "blur(10px)" }}
                            animate={{ x: 0, y: 0, rotate: 0, opacity: 1, scale: 1, filter: "blur(0px)" }}
                            exit={{ x: f.dx * 1.3, y: f.dy * 1.3 + 60, rotate: f.rot * 1.4, opacity: 0, scale: 1.1 }}
                            transition={{
                              type: "spring",
                              stiffness: motionStyle.fragment?.stiffness ?? 420,
                              damping: motionStyle.fragment?.damping ?? 18,
                              mass: 0.7,
                              delay: f.delay,
                              opacity: { duration: 0.18, delay: f.delay },
                              filter: { duration: 0.3, delay: f.delay },
                            }}
                          />
                        ))}
                      </motion.div>
                    ) : (
                      <motion.img
                        src={act.image}
                        alt={product ? `${product.brand} ${product.name}` : act.ingredient}
                        width={1024}
                        height={1024}
                        animate={reduce ? undefined : { y: [0, -14, 0] }}
                        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                        className="w-full drop-shadow-[0_50px_70px_rgba(0,0,0,0.7)]"
                      />
                    )}

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
                backgroundColor: `rgb(var(--act-deep) / 0.74)`,
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`${act.id}-plate`}
                  initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p
                    className="text-[11px] font-bold uppercase tracking-[0.24em]"
                    style={{ color: `rgb(var(--act-accent))` }}
                  >
                    {product?.brand ?? "Skin Grocer"} · {product?.price ?? ""}
                  </p>
                  <p
                    className="mt-1.5 font-display text-base font-semibold uppercase tracking-[0.09em]"
                    style={{ color: `rgb(var(--act-ink))` }}
                  >
                    {product?.name ?? act.title[0]}
                  </p>
                  <p
                    className="mt-1 text-[12px] font-medium italic"
                    style={{ color: `rgb(var(--act-ink) / 0.8)` }}
                  >
                    {act.ingredient}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
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
