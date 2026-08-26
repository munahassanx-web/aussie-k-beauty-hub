import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, ShieldCheck, Truck, Clock3 } from "lucide-react";
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

/**
 * "Atmos" hero — a cinematic 3D ingredient stage.
 *
 * The star is the Korean botanical, not the bottle: a dark studio void with a
 * volumetric cone, the active ingredient rendered on a lit pedestal with a
 * mirrored reflection, an orbiting ring of the other three, layered parallax
 * on pointer + scroll, and kinetic type that re-rises on each cycle. All
 * motion is disabled under prefers-reduced-motion.
 */
export function AtmosHero() {
  const featured = SHOP_PRODUCTS.find((p) => p.priceId === FEATURED_PRICE_ID);
  const stageRef = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const active = INGREDIENTS[index]!;

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = stage.getBoundingClientRect();
        const p = Math.min(Math.max(-rect.top / Math.max(rect.height, 1), 0), 1);
        stage.style.setProperty("--s", String(p));
      });
    };
    const onPointer = (e: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      stage.style.setProperty("--mx", String(x));
      stage.style.setProperty("--my", String(y));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    stage.addEventListener("pointermove", onPointer);
    return () => {
      window.removeEventListener("scroll", onScroll);
      stage.removeEventListener("pointermove", onPointer);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (paused) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setIndex((i) => (i + 1) % INGREDIENTS.length), 6000);
    return () => window.clearInterval(t);
  }, [paused]);

  return (
    <section
      ref={stageRef}
      aria-labelledby="atmos-heading"
      className="relative isolate overflow-hidden bg-hanbok-deep text-paper [--mx:0] [--my:0] [--s:0]"
    >
      {/* Layer 1 — cinematic backdrop plate */}
      <img
        src={stageBackdrop}
        alt=""
        aria-hidden="true"
        width={1920}
        height={1280}
        style={{
          transform:
            "translate3d(calc(var(--mx) * -26px), calc(var(--my) * -18px + var(--s) * 6%), 0) scale(1.12)",
        }}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-70 transition-transform duration-700 ease-out will-change-transform"
      />
      {/* Layer 2 — palette wash */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_18%,color-mix(in_oklab,var(--hanbok)_55%,transparent)_0%,transparent_62%),linear-gradient(180deg,color-mix(in_oklab,var(--hanbok-deep)_55%,transparent)_0%,transparent_38%,color-mix(in_oklab,var(--hanbok-deep)_92%,transparent)_100%)]"
      />
      {/* Layer 3 — volumetric spotlight cone */}
      <div
        aria-hidden="true"
        style={{ transform: "translate3d(calc(var(--mx) * 18px), 0, 0)" }}
        className="absolute left-1/2 top-0 h-[70%] w-[52rem] -translate-x-1/2 bg-[conic-gradient(from_180deg_at_50%_0%,transparent_0deg,color-mix(in_oklab,var(--grocer-butter)_22%,transparent)_172deg,color-mix(in_oklab,var(--grocer-butter)_22%,transparent)_188deg,transparent_360deg)] blur-2xl transition-transform duration-700 ease-out"
      />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-16 px-6 pb-24 pt-24 md:px-12 md:pb-32 md:pt-32 lg:grid-cols-12 lg:items-center">
        {/* Kinetic type */}
        <div className="lg:col-span-6">
          <p className="flex items-center gap-3 overflow-hidden text-[10px] font-semibold uppercase tracking-[0.32em] text-grocer-butter">
            <span className="h-px w-8 bg-grocer-butter" />
            <span className="animate-[rise_0.7s_ease-out_both]">The Korean ingredient shelf</span>
          </p>

          <h1
            id="atmos-heading"
            className="mt-8 font-masthead text-[clamp(2.7rem,7vw,6rem)] leading-[0.92] tracking-tight [text-shadow:0_24px_60px_rgba(0,0,0,0.45)]"
          >
            <span className="block overflow-hidden">
              <span key={active.id} className="block animate-[rise_0.8s_ease-out_both]">
                {active.headline}
              </span>
            </span>
            <span className="block overflow-hidden">
              <span className="block animate-[rise_0.9s_ease-out_0.1s_both] italic text-grocer-butter">
                bottled in Seoul.
              </span>
            </span>
          </h1>

          <p
            key={`${active.id}-note`}
            className="mt-7 max-w-md animate-[rise_0.7s_ease-out_both] text-[15px] font-light leading-relaxed text-paper/75"
          >
            {active.note}
          </p>

          {/* Ingredient selector */}
          <ul
            className="mt-8 flex flex-wrap gap-2"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {INGREDIENTS.map((ing, i) => (
              <li key={ing.id}>
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-pressed={i === index}
                  className={`rounded-full border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] transition ${
                    i === index
                      ? "border-grocer-butter bg-grocer-butter/15 text-grocer-butter"
                      : "border-paper/20 text-paper/60 hover:border-paper/45 hover:text-paper"
                  }`}
                >
                  <span className="mr-2 font-display normal-case tracking-normal">{ing.hangul}</span>
                  {ing.name}
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex animate-[rise_0.9s_ease-out_0.34s_both] flex-wrap items-center gap-5">
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
          </div>

          <dl className="mt-12 grid max-w-lg animate-[rise_0.9s_ease-out_0.44s_both] grid-cols-3 gap-px overflow-hidden rounded-2xl bg-paper/10 text-center ring-1 ring-paper/10">
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
          </dl>
        </div>

        {/* 3D ingredient stage */}
        <div className="relative lg:col-span-6">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md [perspective:1200px]">
            {/* Pedestal glow */}
            <div
              aria-hidden="true"
              style={{ transform: "translate3d(calc(var(--mx) * -30px), calc(var(--my) * -16px), 0)" }}
              className="absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-grocer-butter/25 blur-[90px] transition-transform duration-700 ease-out"
            />
            {/* Halo rings */}
            <div
              aria-hidden="true"
              style={{
                transform:
                  "translate(-50%, -50%) rotateX(72deg) rotateZ(calc(var(--s) * 60deg + var(--mx) * 20deg))",
              }}
              className="absolute left-1/2 top-[62%] h-[22rem] w-[22rem] rounded-full border border-paper/25 [transform-style:preserve-3d]"
            />
            <div
              aria-hidden="true"
              style={{
                transform: "translate(-50%, -50%) rotateX(72deg) rotateZ(calc(var(--s) * -90deg))",
              }}
              className="absolute left-1/2 top-[62%] h-[15rem] w-[15rem] rounded-full border border-grocer-butter/40"
            />

            {/* Drifting glass droplets */}
            {[
              { c: "left-2 top-10 w-14", d: 1.4 },
              { c: "right-4 top-24 w-9", d: -1.1 },
              { c: "left-8 bottom-24 w-7", d: 0.8 },
            ].map((o) => (
              <img
                key={o.c}
                src={droplet}
                alt=""
                aria-hidden="true"
                loading="lazy"
                width={768}
                height={768}
                style={{
                  transform: `translate3d(calc(var(--mx) * ${40 * o.d}px), calc(var(--my) * ${30 * o.d}px), 0)`,
                }}
                className={`absolute ${o.c} animate-float-slow opacity-70 mix-blend-screen transition-transform duration-700 ease-out`}
              />
            ))}

            {/* Hero ingredient — cross-fades, tilts in 3D, casts a reflection */}
            <div
              style={{
                transform:
                  "translate3d(calc(var(--mx) * -46px), calc(var(--my) * -26px + var(--s) * -8%), 0) rotateY(calc(var(--mx) * 18deg)) rotateX(calc(var(--my) * -14deg))",
              }}
              className="absolute inset-x-0 top-[6%] mx-auto w-[62%] transition-transform duration-500 ease-out will-change-transform [transform-style:preserve-3d]"
            >
              <div className="relative aspect-square">
                {INGREDIENTS.map((ing, i) => (
                  <div
                    key={ing.id}
                    className={`absolute inset-0 transition-all duration-[1200ms] ease-out ${
                      i === index
                        ? "scale-100 opacity-100 blur-0"
                        : "pointer-events-none scale-90 opacity-0 blur-md"
                    }`}
                  >
                    <img
                      src={ing.image}
                      alt={`${ing.name} — ${ing.latin}`}
                      width={1024}
                      height={1024}
                      loading={i === 0 ? "eager" : "lazy"}
                      className="w-full animate-float-slow drop-shadow-[0_50px_70px_rgba(0,0,0,0.65)]"
                    />
                    <img
                      src={ing.image}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      className="absolute inset-x-0 top-full w-full -scale-y-100 opacity-20 blur-[3px] [mask-image:linear-gradient(to_bottom,black_0%,transparent_55%)]"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* The bottle it lives in — small, orbiting the ingredient */}
            {featured && (
              <Link
                to="/product/$slug"
                params={{ slug: productSlug(featured) }}
                style={{
                  transform:
                    "translate3d(calc(var(--mx) * 28px), calc(var(--my) * 18px), 0) rotateY(calc(var(--mx) * -14deg))",
                }}
                className="group absolute bottom-[30%] right-[0%] w-[22%] transition-transform duration-500 ease-out [transform-style:preserve-3d]"
                aria-label={`${featured.brand} ${featured.name}`}
              >
                <img
                  src={tonerCutout}
                  alt={`${featured.brand} ${featured.name}`}
                  width={600}
                  height={900}
                  loading="lazy"
                  className="w-full animate-float-slow drop-shadow-[0_40px_50px_rgba(0,0,0,0.6)] transition-transform duration-500 group-hover:-translate-y-2"
                />
              </Link>
            )}

            {/* Ingredient caption plate */}
            <div
              key={`${active.id}-plate`}
              className="absolute inset-x-4 bottom-2 animate-[rise_0.7s_ease-out_both] rounded-2xl border border-paper/15 bg-hanbok-deep/60 px-5 py-4 backdrop-blur-md"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-grocer-butter">
                {active.hangul} · On the stage
              </p>
              <p className="mt-1.5 font-display text-sm uppercase tracking-[0.1em]">{active.name}</p>
              <p className="mt-1 text-[11px] font-light italic text-paper/55">{active.latin}</p>
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
        <div className="h-px w-1/3 animate-[hero-sweep_5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-grocer-butter to-transparent" />
      </div>
    </section>
  );
}
