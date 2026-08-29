import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from "motion/react";
import { Button } from "@/components/ui/button";
import { SHOP_PRODUCTS } from "@/lib/shop-catalog";
import { productSlug } from "@/lib/product-detail";
import { trackUi } from "@/lib/analytics";
import bgPlum from "@/assets/hero-bg-plum.jpg";
import bgCica from "@/assets/hero-bg-cica.jpg";
import bgSun from "@/assets/hero-bg-sun.jpg";
import bgGlow from "@/assets/hero-bg-glow.jpg";
import droplet from "@/assets/hero-3d-droplet.png";
import plumToner from "@/assets/hero-spring-plum.png";
import cicaAmpoule from "@/assets/hero-spring-cica.png";
import glowSerum from "@/assets/hero-spring-glow.png";

const CYCLE_MS = 7000;

type Chapter = {
  id: string;
  /** Bilingual campaign label — Korean plus its English meaning. */
  hangul: string;
  hangulEnglish: string;
  headline: string;
  copy: string;
  /** Optional extra qualifying line beneath the campaign copy. */
  note?: string;
  /** Optional plain-language caution shown with the action. */
  caution?: string;
  ingredient: string;
  /** Campaign action label. */
  cta: string;
  /** A stocked SKU, or null for an educational-only act. */
  priceId: string | null;
  /** Where the campaign action goes when there is no product. */
  educationalTo?: string;
  image: string;
  imageAlt: string;
  backdrop: string;
  theme: { accent: string; deep: string; glow: string; ink: string };
};

/**
 * Four-act seasonal campaign. It is a supporting storytelling layer — the
 * permanent Skin Grocer positioning above it is the primary brand message and
 * never changes when an act rotates.
 */
const CHAPTERS: Chapter[] = [
  {
    id: "shed",
    hangul: "각질",
    hangulEnglish: "Exfoliation",
    headline: "Shed the winter you're still wearing.",
    copy: "Green plum, AHA and BHA combine in a gentle exfoliating toner designed to lift away surface buildup without turning your routine into an acid schedule.",
    note: "For experienced exfoliant users who want a considered weekly step—not an everyday shortcut.",
    caution:
      "Introduce gradually. Avoid layering with other strong exfoliants or retinal in the same routine.",
    ingredient: "Green plum extract · AHA + BHA",
    cta: "Explore the reset — $32",
    priceId: "beauty_of_joseon_green_plum_refreshing_toner_150ml_onetime",
    image: plumToner,
    imageAlt: "Beauty of Joseon Green Plum Refreshing Toner bottle",
    backdrop: bgPlum,
    theme: { accent: "104 128 58", deep: "240 234 216", glow: "203 216 150", ink: "46 40 31" },
  },
  {
    id: "calm",
    hangul: "진정",
    hangulEnglish: "Calming",
    headline: "When Melbourne turns unpredictable, keep the routine calm.",
    copy: "Centella asiatica and madecassoside in a lightweight ampoule for skin that feels easily unsettled by wind, changing temperatures or an overcomplicated routine.",
    ingredient: "Centella asiatica · Madecassoside",
    cta: "Explore the calming edit — $38",
    priceId: "beplain_cicaful_ampoule_30ml_onetime",
    image: cicaAmpoule,
    imageAlt: "beplain Cicaful Ampoule bottle",
    backdrop: bgCica,
    theme: { accent: "62 122 92", deep: "240 236 222", glow: "186 216 186", ink: "46 40 31" },
  },
  {
    id: "shield",
    hangul: "자외선",
    hangulEnglish: "UV protection",
    headline: "The UV index doesn't wait for summer.",
    copy: "Daily sun protection matters throughout the year. Learn how sunscreen fits into a simple morning routine and how to choose an appropriate product available for lawful Australian supply.",
    ingredient: "Daily UV habits · Educational guide",
    cta: "Learn about daily protection",
    priceId: null,
    educationalTo: "/learn/hub",
    image: droplet,
    imageAlt: "",
    backdrop: bgSun,
    theme: { accent: "26 118 168", deep: "234 233 231", glow: "168 216 236", ink: "38 38 45" },
  },
  {
    id: "bloom",
    hangul: "수분광",
    hangulEnglish: "Hydration & glow",
    headline: "Step into spring with hydration, not hype.",
    copy: "A considered hydration step for skin that feels dull or depleted—selected for texture, routine compatibility and everyday wear.",
    ingredient: "Propolis extract · Niacinamide",
    cta: "Explore the hydration edit",
    priceId: "beauty_of_joseon_glow_serum_propolis_plus_niacinamide_30ml_onetime",
    image: glowSerum,
    imageAlt: "Beauty of Joseon Glow Serum Propolis + Niacinamide bottle",
    backdrop: bgGlow,
    theme: { accent: "192 108 52", deep: "247 234 222", glow: "246 200 158", ink: "48 34 32" },
  },
];

const EASE_OUT: Transition = { duration: 0.5, ease: [0.16, 1, 0.3, 1] };
/** One restrained treatment: a soft texture reveal, well under 1.2s. */
const REVEAL: Transition = { duration: 1.1, ease: [0.16, 1, 0.3, 1] };

/**
 * Homepage hero.
 *
 * Zone one (left) carries the permanent Skin Grocer positioning, which stays
 * on screen through every campaign change. Zone two (right) is the seasonal
 * product theatre. Motion is a single soft reveal plus slow ambient drift;
 * rotation pauses on hover, focus, interaction and when the tab is hidden.
 */
export function AtmosHero() {
  const stageRef = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [interacting, setInteracting] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const reduce = useReducedMotion();

  const act = CHAPTERS[index]!;
  const product = act.priceId
    ? SHOP_PRODUCTS.find((p) => p.priceId === act.priceId)
    : undefined;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const goTo = useCallback((next: number, reason: "auto" | "manual") => {
    setIndex((cur) => {
      const target = (next + CHAPTERS.length) % CHAPTERS.length;
      if (target !== cur) {
        trackUi("hero_slide_change", {
          slide_id: CHAPTERS[target]!.id,
          slide_index: target + 1,
          change_reason: reason,
        });
      }
      return target;
    });
  }, []);

  const running = !reduce && !interacting && !tabHidden && !userPaused;

  useEffect(() => {
    if (!running) return;
    const t = window.setInterval(() => {
      setIndex((i) => {
        const next = (i + 1) % CHAPTERS.length;
        trackUi("hero_slide_change", {
          slide_id: CHAPTERS[next]!.id,
          slide_index: next + 1,
          change_reason: "auto",
        });
        return next;
      });
    }, CYCLE_MS);
    return () => window.clearInterval(t);
  }, [running]);

  const themeVars = {
    "--act-accent": act.theme.accent,
    "--act-deep": act.theme.deep,
    "--act-glow": act.theme.glow,
    "--act-ink": act.theme.ink,
  } as React.CSSProperties;

  const seasonalTo = product
    ? { to: "/product/$slug" as const, params: { slug: productSlug(product) } }
    : { to: "/shop" as const };

  return (
    <section
      ref={stageRef}
      aria-labelledby="atmos-heading"
      aria-roledescription="carousel"
      aria-label="Seasonal Korean skincare campaign"
      style={themeVars}
      className="relative isolate overflow-hidden transition-[background-color] duration-700 ease-out"
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
      onFocusCapture={() => setInteracting(true)}
      onBlurCapture={() => setInteracting(false)}
    >
      {/* Colour-graded ground for the current act */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 transition-colors duration-700"
        style={{ backgroundColor: `rgb(var(--act-deep))` }}
      />

      {/* Ambient macro texture backdrop */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <AnimatePresence initial={false}>
          <motion.img
            key={act.id}
            src={act.backdrop}
            alt=""
            width={1920}
            height={1280}
            fetchPriority={index === 0 ? "high" : "low"}
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 0.9, scale: reduce ? 1.02 : 1.04 }}
            exit={{ opacity: 0 }}
            transition={reduce ? { duration: 0.2 } : { duration: 8, ease: "easeOut" }}
            className="absolute inset-0 h-full w-full object-cover mix-blend-multiply"
          />
        </AnimatePresence>
      </div>

      {/* Reading panel — guarantees legible text over any campaign image */}
      <div
        aria-hidden="true"
        className="absolute inset-0 transition-[background] duration-700"
        style={{
          background: `linear-gradient(180deg, rgb(var(--act-deep) / 0.9) 0%, rgb(var(--act-deep) / 0.62) 46%, rgb(var(--act-deep) / 0.86) 100%)`,
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden md:block"
        style={{
          background: `linear-gradient(100deg, rgb(var(--act-deep) / 0.95) 0%, rgb(var(--act-deep) / 0.82) 46%, rgb(var(--act-deep) / 0.25) 78%, transparent 100%)`,
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8 md:px-12 md:py-10 lg:grid lg:grid-cols-[52fr_48fr] lg:grid-rows-[auto_auto_auto] lg:gap-x-12 lg:gap-y-0">
        {/* Zone 1 — permanent Skin Grocer positioning (desktop: left, row 1) */}
        <motion.div
          initial={false}
          animate={mounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={EASE_OUT}
          className="order-1 max-w-[600px] lg:col-start-1 lg:row-start-1"
        >
          <p
            className="text-[12px] font-semibold uppercase tracking-[0.22em]"
            style={{ color: `rgb(var(--act-accent))` }}
          >
            Melbourne · Authentic Korean skincare
          </p>
          <h1
            id="atmos-heading"
            className="mt-3 font-masthead text-[clamp(2.1rem,4.2vw,3.4rem)] font-black leading-[0.98] tracking-[-0.02em]"
            style={{ color: `rgb(var(--act-ink))` }}
          >
            Korean skincare, chosen with more care.
          </h1>
          <p
            className="mt-4 max-w-[56ch] text-[16px] leading-[1.55] md:text-[17px]"
            style={{ color: `rgb(var(--act-ink) / 0.92)` }}
          >
            Products Koreans genuinely use—selected with Australian climate and
            real routines in mind. Stocked in Melbourne and explained without the hype.
          </p>

          <div className="mt-6">
            <Button
              asChild
              className="group h-auto min-h-[48px] w-full rounded-full px-8 py-4 text-[13px] font-bold uppercase tracking-[0.16em] shadow-[0_20px_50px_-20px_var(--pop)] transition-transform duration-200 hover:-translate-y-0.5 sm:w-auto"
              style={{ backgroundColor: "var(--pop)", color: "var(--pop-foreground)" }}
            >
              <Link
                to="/consultation"
                search={{}}
                onClick={() => trackUi("hero_routine_finder_click", { slide_id: act.id })}
              >
                Find my routine
                <ArrowRight className="ml-2.5 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Zone 2 — seasonal product theatre (desktop: right, spanning rows 1–2) */}
        <div className="order-2 lg:col-start-2 lg:row-start-1 lg:row-span-2">
          <div className="relative mx-auto aspect-square w-full max-w-[24rem] lg:max-w-[27rem]">
            <motion.div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 h-[16rem] w-[16rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[90px]"
              style={{ backgroundColor: `rgb(var(--act-glow) / 0.3)` }}
              animate={reduce ? undefined : { scale: [1, 1.06, 1], opacity: [0.75, 1, 0.75] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            />
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={act.id}
                className="absolute inset-0 flex items-center justify-center"
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.01, filter: "blur(8px)" }}
                transition={reduce ? { duration: 0.25 } : REVEAL}
              >
                <motion.img
                  src={act.image}
                  alt={act.imageAlt}
                  aria-hidden={act.imageAlt ? undefined : true}
                  width={1024}
                  height={1024}
                  fetchPriority={index === 0 ? "high" : "low"}
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                  animate={reduce ? undefined : { y: [0, -10, 0] }}
                  transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                  className="h-full w-full object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.35)]"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Product summary — sits directly beneath the product image */}
          <div
            className="mx-auto mt-2 max-w-[24rem] rounded-2xl border px-5 py-3.5 backdrop-blur-md lg:max-w-[27rem]"
            style={{
              borderColor: `rgb(var(--act-ink) / 0.16)`,
              backgroundColor: `rgb(var(--act-deep) / 0.78)`,
            }}
          >
            <p
              className="text-[11px] font-bold uppercase tracking-[0.2em]"
              style={{ color: `rgb(var(--act-accent))` }}
            >
              {product ? `${product.brand} · ${product.price}` : "Sun protection · Education"}
            </p>
            <p
              className="mt-1 font-display text-[15px] font-semibold leading-snug"
              style={{ color: `rgb(var(--act-ink))` }}
            >
              {product?.name ?? "How daily sun protection fits a morning routine"}
            </p>
            <p className="mt-1 text-[13px]" style={{ color: `rgb(var(--act-ink) / 0.82)` }}>
              {act.ingredient}
            </p>
          </div>
        </div>

        {/* Campaign story — compact supporting layer (desktop: left, row 2) */}
        <div
          className="order-3 max-w-[600px] border-t pt-5 lg:col-start-1 lg:row-start-2 lg:mt-6"
          style={{ borderColor: `rgb(var(--act-ink) / 0.16)` }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={act.id}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
              transition={reduce ? { duration: 0.2 } : { duration: 0.55, ease: "easeOut" }}
              aria-roledescription="slide"
              aria-label={`Slide ${index + 1} of ${CHAPTERS.length}`}
            >
              <p
                className="flex flex-wrap items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.2em]"
                style={{ color: `rgb(var(--act-accent))` }}
              >
                <span className="font-display text-[14px] tracking-normal normal-case">
                  {act.hangul}
                </span>
                <span aria-hidden="true">·</span>
                {act.hangulEnglish}
              </p>
              <h2
                className="mt-2 font-display text-[clamp(1.15rem,2vw,1.6rem)] font-semibold leading-[1.15]"
                style={{ color: `rgb(var(--act-ink))` }}
              >
                {act.headline}
              </h2>
              <p
                className="mt-2 max-w-[56ch] text-[14px] leading-[1.55]"
                style={{ color: `rgb(var(--act-ink) / 0.88)` }}
              >
                {act.copy}
              </p>
              {act.note && (
                <p
                  className="mt-1.5 max-w-[56ch] text-[13px] leading-[1.55]"
                  style={{ color: `rgb(var(--act-ink) / 0.78)` }}
                >
                  {act.note}
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
                {product ? (
                  <Link
                    to="/product/$slug"
                    params={{ slug: productSlug(product) }}
                    onClick={() =>
                      trackUi("hero_seasonal_edit_click", {
                        slide_id: act.id,
                        destination: "product",
                      })
                    }
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-full border px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] transition-colors"
                    style={{
                      borderColor: `rgb(var(--act-accent))`,
                      color: `rgb(var(--act-accent))`,
                    }}
                  >
                    {act.cta}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                ) : (
                  <Link
                    to={act.educationalTo ?? "/learn/hub"}
                    onClick={() =>
                      trackUi("hero_seasonal_edit_click", {
                        slide_id: act.id,
                        destination: "learn",
                      })
                    }
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-full border px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] transition-colors"
                    style={{
                      borderColor: `rgb(var(--act-accent))`,
                      color: `rgb(var(--act-accent))`,
                    }}
                  >
                    {act.cta}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}

                {product && (
                  <span
                    className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] font-semibold"
                    style={{ color: `rgb(var(--act-ink) / 0.72)` }}
                  >
                    {[
                      { label: "Full details", hash: "suits", event: "hero_full_details_click" },
                      { label: "Key ingredients", hash: "ingredients", event: "hero_key_ingredients_click" },
                      { label: "How to use", hash: "how", event: "hero_how_to_use_click" },
                    ].map((item) => (
                      <Link
                        key={item.hash}
                        to="/product/$slug"
                        params={{ slug: productSlug(product) }}
                        hash={item.hash}
                        onClick={() => trackUi(item.event, { slide_id: act.id })}
                        className="underline-offset-4 hover:underline"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </span>
                )}
              </div>

              {act.caution && (
                <p
                  className="mt-3 max-w-[56ch] text-[13px] leading-[1.55]"
                  style={{ color: `rgb(var(--act-ink) / 0.8)` }}
                >
                  {act.caution}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide controls — desktop: right, row 3; mobile: beneath the campaign action */}
        <div className="order-4 flex items-center justify-between gap-4 lg:col-start-2 lg:row-start-3 lg:mt-4 lg:max-w-[27rem] lg:self-start">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => goTo(index - 1, "manual")}
              aria-label="Previous campaign slide"
              className="flex h-11 w-11 items-center justify-center rounded-full border transition-colors"
              style={{ borderColor: `rgb(var(--act-ink) / 0.3)`, color: `rgb(var(--act-ink))` }}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setUserPaused((p) => {
                  trackUi("hero_pause_animation", { paused: !p, slide_id: act.id });
                  return !p;
                });
              }}
              aria-label={userPaused ? "Play campaign slideshow" : "Pause campaign slideshow"}
              aria-pressed={userPaused}
              className="flex h-11 w-11 items-center justify-center rounded-full border transition-colors"
              style={{ borderColor: `rgb(var(--act-ink) / 0.3)`, color: `rgb(var(--act-ink))` }}
            >
              {userPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1, "manual")}
              aria-label="Next campaign slide"
              className="flex h-11 w-11 items-center justify-center rounded-full border transition-colors"
              style={{ borderColor: `rgb(var(--act-ink) / 0.3)`, color: `rgb(var(--act-ink))` }}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {CHAPTERS.map((c, i) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => goTo(i, "manual")}
                  aria-label={`Show slide ${i + 1}: ${c.hangulEnglish}`}
                  aria-current={i === index}
                  className="flex h-11 items-center"
                >
                  <span
                    className={`block h-[3px] rounded-full transition-all duration-500 ${
                      i === index ? "w-9" : "w-5"
                    }`}
                    style={{
                      backgroundColor:
                        i === index
                          ? `rgb(var(--act-accent))`
                          : `rgb(var(--act-ink) / 0.25)`,
                    }}
                  />
                </button>
              ))}
            </div>
            <span
              className="font-display text-[12px] font-medium tracking-[0.14em]"
              style={{ color: `rgb(var(--act-ink) / 0.75)` }}
            >
              {String(index + 1).padStart(2, "0")} / {String(CHAPTERS.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Trust reassurance — desktop: left, row 3; mobile: last */}
        <p
          className="order-5 text-[13px] font-medium lg:col-start-1 lg:row-start-3 lg:mt-4 lg:self-start"
          style={{ color: `rgb(var(--act-ink) / 0.75)` }}
        >
          Authentic Korean stock · Melbourne dispatch · Guidance with every order
        </p>
      </div>
    </section>
  );
}
