import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, ShieldCheck, Truck, Clock3 } from "lucide-react";
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
import tonerCutout from "@/assets/haruharu-toner-cutout.png";
import stageBackdrop from "@/assets/hero-3d-stage.jpg";
import droplet from "@/assets/hero-3d-droplet.png";
import ginseng from "@/assets/ingredient-ginseng.png";
import mugwort from "@/assets/ingredient-mugwort.png";
import blackRice from "@/assets/ingredient-black-rice.png";
import centella from "@/assets/ingredient-centella.png";

const FEATURED_PRICE_ID = "haruharu_wonder_black_rice_hyaluronic_toner_150ml_onetime";
const CYCLE_MS = 6000;

type Ingredient = {
  id: string;
  hangul: string;
  name: string;
  latin: string;
  headline: string;
  note: string;
  image: string;
};

/** Four ingredients Korean formulators reach for that Western shelves rarely carry. */
const INGREDIENTS: Ingredient[] = [
  {
    id: "black-rice",
    hangul: "흑미",
    name: "Black rice ferment",
    latin: "Oryza sativa extract",
    headline: "Black rice,",
    note: "Fermented rice bran — the quiet brightener behind Korea's glass-skin toners.",
    image: blackRice,
  },
  {
    id: "ginseng",
    hangul: "인삼",
    name: "Red ginseng",
    latin: "Panax ginseng root",
    headline: "Red ginseng,",
    note: "Six-year-root ginsenosides, used in Korea for firmness and warmth in the skin.",
    image: ginseng,
  },
  {
    id: "mugwort",
    hangul: "쑥",
    name: "Mugwort",
    latin: "Artemisia princeps",
    headline: "Ganghwa mugwort,",
    note: "Steeped like tea and poured into ampoules to settle heat and reactivity.",
    image: mugwort,
  },
  {
    id: "centella",
    hangul: "병풀",
    name: "Centella asiatica",
    latin: "Madecassoside · asiaticoside",
    headline: "Centella,",
    note: "Korea's cica leaf — the barrier-repair standard in post-procedure care.",
    image: centella,
  },
];

const EASE_OUT: Transition = { duration: 0.8, ease: [0.16, 1, 0.3, 1] };
const SPRING = { stiffness: 120, damping: 22, mass: 0.6 };

/**
 * "Atmos" hero — a motion-graphics driven cinematic ingredient stage.
 *
 * Motion is orchestrated with the `motion` library: spring-tracked pointer
 * parallax across five depth layers, scroll-linked camera drift, an
 * AnimatePresence ingredient swap, per-word kinetic type, an SVG orbit with an
 * animated dash trace, and an SVG progress ring that draws down the 6s cycle.
 * Everything collapses to a static composition under prefers-reduced-motion.
 */
export function AtmosHero() {
  const featured = SHOP_PRODUCTS.find((p) => p.priceId === FEATURED_PRICE_ID);
  const stageRef = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const active = INGREDIENTS[index]!;
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Pointer parallax — raw values, spring-smoothed so nothing snaps.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const mx = useSpring(px, SPRING);
  const my = useSpring(py, SPRING);

  // Scroll-linked camera: the stage recedes as the shelf comes up.
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
  const bottleDepth = depth(28);
  const heroTiltY = useTransform(mx, (v) => v * 18);
  const heroTiltX = useTransform(my, (v) => v * -14);

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
    const t = window.setInterval(() => setIndex((i) => (i + 1) % INGREDIENTS.length), CYCLE_MS);
    return () => window.clearInterval(t);
  }, [paused, reduce]);

  return (
    <section
      ref={stageRef}
      aria-labelledby="atmos-heading"
      className="relative isolate overflow-hidden bg-hanbok-deep text-paper"
    >
      {/* Layer 1 — cinematic backdrop plate, scroll + pointer driven */}
      <motion.img
        src={stageBackdrop}
        alt=""
        aria-hidden="true"
        width={1920}
        height={1280}
        style={{ x: bgDepth.x, y: camY, scale: camScale, opacity: camFade }}
        className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover opacity-70 will-change-transform"
      />
      {/* Layer 2 — palette wash */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_18%,color-mix(in_oklab,var(--hanbok)_55%,transparent)_0%,transparent_62%),linear-gradient(180deg,color-mix(in_oklab,var(--hanbok-deep)_55%,transparent)_0%,transparent_38%,color-mix(in_oklab,var(--hanbok-deep)_92%,transparent)_100%)]"
      />
      {/* Layer 3 — volumetric spotlight cone, breathing */}
      <motion.div
        aria-hidden="true"
        style={{ x: coneDepth.x }}
        animate={reduce ? undefined : { opacity: [0.55, 0.95, 0.55], scaleY: [1, 1.05, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 top-0 h-[70%] w-[52rem] origin-top -translate-x-1/2 bg-[conic-gradient(from_180deg_at_50%_0%,transparent_0deg,color-mix(in_oklab,var(--grocer-butter)_22%,transparent)_172deg,color-mix(in_oklab,var(--grocer-butter)_22%,transparent)_188deg,transparent_360deg)] blur-2xl"
      />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-16 px-6 pb-24 pt-24 md:px-12 md:pb-32 md:pt-32 lg:grid-cols-12 lg:items-center">
        {/* Kinetic type */}
        <motion.div className="lg:col-span-6">
          <motion.p
            initial={false}
            animate={mounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={EASE_OUT}
            className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-grocer-butter"
          >
            <motion.span
              className="h-px w-8 origin-left bg-grocer-butter"
              initial={false}
              animate={mounted ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ ...EASE_OUT, delay: 0.2 }}
            />
            The Korean ingredient shelf
          </motion.p>

          <h1
            id="atmos-heading"
            className="mt-8 font-masthead text-[clamp(2.7rem,7vw,6rem)] leading-[0.92] tracking-tight [text-shadow:0_24px_60px_rgba(0,0,0,0.45)]"
          >
            <span className="block overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={active.id}
                  className="block"
                  initial={{ y: "110%", rotateX: -55, opacity: 0 }}
                  animate={{ y: "0%", rotateX: 0, opacity: 1 }}
                  exit={{ y: "-90%", rotateX: 35, opacity: 0 }}
                  transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                >
                  {active.headline}
                </motion.span>
              </AnimatePresence>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                className="block italic text-grocer-butter"
                initial={false}
                animate={mounted ? { y: "0%" } : { y: "110%" }}
                transition={{ duration: 0.95, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                bottled in Seoul.
              </motion.span>
            </span>
          </h1>

          <div className="mt-7 min-h-[3.5rem] max-w-md">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={`${active.id}-note`}
                initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="text-[15px] font-light leading-relaxed text-paper/75"
              >
                {active.note}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Ingredient selector — each pill carries its own cycle timer ring */}
          <ul
            className="mt-8 flex flex-wrap gap-2"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {INGREDIENTS.map((ing, i) => (
              <li key={ing.id}>
                <motion.button
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-pressed={i === index}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 400, damping: 26 }}
                  className={`relative overflow-hidden rounded-full border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                    i === index
                      ? "border-grocer-butter text-grocer-butter"
                      : "border-paper/20 text-paper/60 hover:border-paper/45 hover:text-paper"
                  }`}
                >
                  {i === index && (
                    <motion.span
                      aria-hidden="true"
                      className="absolute inset-y-0 left-0 -z-10 bg-grocer-butter/20"
                      initial={{ width: "0%" }}
                      animate={{ width: paused || reduce ? "100%" : ["0%", "100%"] }}
                      transition={{ duration: paused || reduce ? 0.3 : CYCLE_MS / 1000, ease: "linear" }}
                    />
                  )}
                  <span className="mr-2 font-display normal-case tracking-normal">{ing.hangul}</span>
                  {ing.name}
                </motion.button>
              </li>
            ))}
          </ul>

          <motion.div
            initial={false}
            animate={mounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={{ ...EASE_OUT, delay: 0.35 }}
            className="mt-10 flex flex-wrap items-center gap-5"
          >
            <Button
              asChild
              className="rounded-full bg-grocer-butter px-9 py-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-hanbok-deep shadow-[0_20px_50px_-18px_rgba(0,0,0,0.8)] transition-transform hover:-translate-y-0.5 hover:bg-paper"
            >
              <Link to="/consultation" search={{}}>
                Match me to my ingredients <Sparkles />
              </Link>
            </Button>
            <Link
              to="/learn"
              className="group inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-paper/70 transition hover:text-paper"
            >
              Read the ingredient library
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>

          <motion.dl
            initial={false}
            animate={mounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
            transition={{ ...EASE_OUT, delay: 0.45 }}
            className="mt-12 grid max-w-lg grid-cols-3 gap-px overflow-hidden rounded-2xl bg-paper/10 text-center ring-1 ring-paper/10"
          >
            {[
              { icon: ShieldCheck, k: "Authentic", v: "Checked in Seoul" },
              { icon: Truck, k: "Next day", v: "Melbourne dispatch" },
              { icon: Clock3, k: "24 hours", v: "Consult reply" },
            ].map((s) => (
              <div key={s.k} className="bg-hanbok-deep/70 px-3 py-5 backdrop-blur-sm">
                <s.icon className="mx-auto h-4 w-4 text-grocer-butter" />
                <dt className="mt-2 font-display text-xs uppercase tracking-[0.16em]">{s.k}</dt>
                <dd className="mt-1 text-[10px] uppercase tracking-[0.14em] text-paper/50">{s.v}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        {/* 3D ingredient stage */}
        <div className="relative lg:col-span-6">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md [perspective:1200px]">
            {/* Pedestal glow — pulses with the cycle */}
            <motion.div
              aria-hidden="true"
              style={{ x: glowDepth.x, y: glowDepth.y }}
              animate={reduce ? undefined : { scale: [1, 1.08, 1], opacity: [0.75, 1, 0.75] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-grocer-butter/25 blur-[90px]"
            />

            {/* SVG orbit graphics — a traced dash ring plus a counter-rotating ring */}
            <motion.svg
              aria-hidden="true"
              viewBox="0 0 400 400"
              style={{ rotate: ringSpin }}
              className="absolute left-1/2 top-[60%] h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 [transform:rotateX(72deg)]"
            >
              <motion.circle
                cx="200"
                cy="200"
                r="180"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-paper/25"
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
                strokeWidth="1.5"
                className="text-grocer-butter/45"
                strokeDasharray="300 460"
                animate={reduce ? undefined : { rotate: -360 }}
                transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                style={{ originX: "200px", originY: "200px" }}
              />
            </motion.svg>

            {/* Drifting glass droplets */}
            {[
              { c: "left-2 top-10 w-14", d: 1.4 },
              { c: "right-4 top-24 w-9", d: -1.1 },
              { c: "left-8 bottom-24 w-7", d: 0.8 },
            ].map((o, i) => (
              <motion.img
                key={o.c}
                src={droplet}
                alt=""
                aria-hidden="true"
                loading="lazy"
                width={768}
                height={768}
                style={{ x: useTransform(mx, (v) => v * 40 * o.d), y: useTransform(my, (v) => v * 30 * o.d) }}
                animate={reduce ? undefined : { y: [0, -14, 0], rotate: [0, o.d * 6, 0] }}
                transition={{ duration: 8 + i * 1.6, repeat: Infinity, ease: "easeInOut" }}
                className={`absolute ${o.c} opacity-70 mix-blend-screen`}
              />
            ))}

            {/* Hero ingredient — AnimatePresence swap, 3D tilt, mirrored reflection */}
            <motion.div
              style={{
                x: heroDepth.x,
                y: heroDepth.y,
                rotateY: heroTiltY,
                rotateX: heroTiltX,
                transformStyle: "preserve-3d",
              }}
              className="absolute inset-x-0 top-[6%] mx-auto w-[62%] will-change-transform"
            >
              <div className="relative aspect-square">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={active.id}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 0.86, filter: "blur(12px)", rotate: -8 }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)", rotate: 0 }}
                    exit={{ opacity: 0, scale: 1.08, filter: "blur(14px)", rotate: 6 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <motion.img
                      src={active.image}
                      alt={`${active.name} — ${active.latin}`}
                      width={1024}
                      height={1024}
                      animate={reduce ? undefined : { y: [0, -16, 0] }}
                      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                      className="w-full drop-shadow-[0_50px_70px_rgba(0,0,0,0.65)]"
                    />
                    <img
                      src={active.image}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      className="absolute inset-x-0 top-full w-full -scale-y-100 opacity-20 blur-[3px] [mask-image:linear-gradient(to_bottom,black_0%,transparent_55%)]"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* The bottle it lives in — small, orbiting the ingredient */}
            {featured && (
              <motion.div
                style={{ x: bottleDepth.x, y: bottleDepth.y }}
                whileHover={{ scale: 1.06, y: -10 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="absolute bottom-[30%] right-0 w-[22%]"
              >
                <Link
                  to="/product/$slug"
                  params={{ slug: productSlug(featured) }}
                  aria-label={`${featured.brand} ${featured.name}`}
                >
                  <motion.img
                    src={tonerCutout}
                    alt={`${featured.brand} ${featured.name}`}
                    width={600}
                    height={900}
                    loading="lazy"
                    animate={reduce ? undefined : { y: [0, -10, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                    className="w-full drop-shadow-[0_40px_50px_rgba(0,0,0,0.6)]"
                  />
                </Link>
              </motion.div>
            )}

            {/* Ingredient caption plate */}
            <div className="absolute inset-x-4 bottom-2 overflow-hidden rounded-2xl border border-paper/15 bg-hanbok-deep/60 px-5 py-4 backdrop-blur-md">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`${active.id}-plate`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-grocer-butter">
                    {active.hangul} · On the stage
                  </p>
                  <p className="mt-1.5 font-display text-sm uppercase tracking-[0.1em]">{active.name}</p>
                  <p className="mt-1 text-[11px] font-light italic text-paper/55">{active.latin}</p>
                </motion.div>
              </AnimatePresence>
              {featured && (
                <Link
                  to="/product/$slug"
                  params={{ slug: productSlug(featured) }}
                  className="group mt-3 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-paper/70 transition hover:text-paper"
                >
                  Shop the formula
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Specular sweep across the bottom edge */}
      <div aria-hidden="true" className="relative z-10 h-px w-full overflow-hidden bg-paper/10">
        <motion.div
          className="h-px w-1/3 bg-gradient-to-r from-transparent via-grocer-butter to-transparent"
          animate={reduce ? undefined : { x: ["-100%", "300%"] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </section>
  );
}
