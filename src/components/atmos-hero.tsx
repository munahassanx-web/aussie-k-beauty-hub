import { useRef, useState, type KeyboardEvent } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
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

type Season = {
  id: "spring" | "summer" | "autumn" | "winter";
  name: string;
  label: string;
  headline: string;
  copy: string;
  cta: string;
  priceId: string | null;
  educationalTo?: string;
  image: string;
  imageAlt: string;
  backdrop: string;
  /** Seasonal colour kept inside the feature area only. */
  tint: string;
  accent: string;
};

const SEASONS: Season[] = [
  {
    id: "spring",
    name: "Spring",
    label: "Spring skin edit",
    headline: "A lighter routine for the change in season.",
    copy: "Explore lightweight hydration and thoughtful exfoliation selected for warmer Melbourne days.",
    cta: "Explore the spring edit",
    priceId: "beauty_of_joseon_glow_serum_propolis_plus_niacinamide_30ml_onetime",
    image: glowSerum,
    imageAlt: "Beauty of Joseon Glow Serum Propolis + Niacinamide bottle",
    backdrop: bgGlow,
    tint: "247 234 222",
    accent: "150 80 36",
  },
  {
    id: "summer",
    name: "Summer",
    label: "Summer skin edit",
    headline: "Daily sun protection, explained simply.",
    copy: "Learn how sunscreen fits into a simple morning routine.",
    cta: "Learn about daily protection",
    priceId: null,
    educationalTo: "/learn/hub",
    image: droplet,
    imageAlt: "",
    backdrop: bgSun,
    tint: "232 240 244",
    accent: "20 92 132",
  },
  {
    id: "autumn",
    name: "Autumn",
    label: "Autumn skin edit",
    headline: "A considered exfoliating step.",
    copy: "A gentle exfoliating toner for experienced users—introduce gradually.",
    cta: "Explore the autumn edit",
    priceId: "beauty_of_joseon_green_plum_refreshing_toner_150ml_onetime",
    image: plumToner,
    imageAlt: "Beauty of Joseon Green Plum Refreshing Toner bottle",
    backdrop: bgPlum,
    tint: "240 236 218",
    accent: "82 102 42",
  },
  {
    id: "winter",
    name: "Winter",
    label: "Winter skin edit",
    headline: "Keep the routine calm when the weather isn't.",
    copy: "A lightweight centella ampoule for a simpler cold-weather routine.",
    cta: "Explore the winter edit",
    priceId: "beplain_cicaful_ampoule_30ml_onetime",
    image: cicaAmpoule,
    imageAlt: "beplain Cicaful Ampoule bottle",
    backdrop: bgCica,
    tint: "232 240 232",
    accent: "44 98 72",
  },
];

/**
 * Homepage hero. The brand message (left) is fixed and never rotates.
 * The seasonal feature (right) changes only when a visitor picks a season.
 */
export function AtmosHero() {
  const [index, setIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const reduce = useReducedMotion();
  const season = SEASONS[index]!;
  const product = season.priceId
    ? SHOP_PRODUCTS.find((p) => p.priceId === season.priceId)
    : undefined;

  const select = (next: number, focus = false) => {
    const target = (next + SEASONS.length) % SEASONS.length;
    if (target !== index) {
      trackUi("hero_slide_change", {
        slide_id: SEASONS[target]!.id,
        slide_index: target + 1,
        change_reason: "manual",
      });
    }
    setIndex(target);
    if (focus) tabRefs.current[target]?.focus();
  };

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const map: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowDown: index + 1,
      ArrowLeft: index - 1,
      ArrowUp: index - 1,
      Home: 0,
      End: SEASONS.length - 1,
    };
    if (e.key in map) {
      e.preventDefault();
      select(map[e.key]!, true);
    }
  };

  const fade = reduce ? { duration: 0 } : { duration: 0.45, ease: "easeOut" as const };

  return (
    <section aria-labelledby="atmos-heading" className="bg-hero-paper text-hero-ink">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-8 px-6 py-8 md:px-12 md:py-12 lg:grid-cols-[1fr_1fr] lg:gap-14">
        {/* Fixed brand message */}
        <div className="max-w-[600px]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-hero-muted md:text-[12px]">
            Authentic Korean skincare · Stocked in Melbourne
          </p>
          <h1
            id="atmos-heading"
            className="mt-3 font-masthead text-[clamp(2.4rem,5vw,4rem)] font-black leading-[0.98] tracking-[-0.02em] text-hero-ink"
          >
            Korean skincare, made easier.
          </h1>
          <p className="mt-4 max-w-[46ch] text-[16px] leading-[1.6] text-hero-muted md:text-[18px]">
            Carefully selected Korean skincare, with clear guidance to help you choose and build a
            routine that makes sense.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/shop"
              onClick={() => trackUi("hero_shop_click", { slide_id: season.id })}
              className="group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-hero-ink px-8 py-3.5 text-[13px] font-bold uppercase tracking-[0.16em] text-hero-paper transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hero-ink focus-visible:ring-offset-2"
            >
              Shop the edit
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/consultation"
              search={{}}
              onClick={() => trackUi("hero_routine_finder_click", { slide_id: season.id })}
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-hero-ink px-8 py-3.5 text-[13px] font-bold uppercase tracking-[0.16em] text-hero-ink transition-colors hover:bg-hero-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hero-ink focus-visible:ring-offset-2"
            >
              Find my routine
            </Link>
          </div>
          <p className="mt-5 text-[13px] font-medium text-hero-muted">
            Verified sourcing · Melbourne stock · Clear routine guidance
          </p>
        </div>

        {/* Seasonal feature */}
        <div
          className="relative overflow-hidden rounded-3xl transition-colors duration-500"
          style={{ backgroundColor: `rgb(${season.tint})` }}
        >
          <AnimatePresence initial={false}>
            <motion.img
              key={season.backdrop}
              src={season.backdrop}
              alt=""
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.35 }}
              exit={{ opacity: 0 }}
              transition={fade}
              className="pointer-events-none absolute inset-0 h-full w-full object-cover mix-blend-multiply"
            />
          </AnimatePresence>

          <div className="relative grid gap-4 p-6 sm:grid-cols-[1fr_11rem] sm:items-center md:p-8">
            <div
              id={`season-panel-${season.id}`}
              role="tabpanel"
              aria-labelledby={`season-tab-${season.id}`}
              aria-live="polite"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={season.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={fade}
                >
                  <p
                    className="text-[11px] font-bold uppercase tracking-[0.2em]"
                    style={{ color: `rgb(${season.accent})` }}
                  >
                    {season.label}
                  </p>
                  <h2 className="mt-2 font-display text-[clamp(1.25rem,2.2vw,1.65rem)] font-semibold leading-[1.15] text-hero-ink">
                    {season.headline}
                  </h2>
                  <p className="mt-2 text-[14px] leading-[1.55] text-hero-ink/80">{season.copy}</p>
                  {product && (
                    <p className="mt-3 text-[12px] font-semibold text-hero-ink">
                      {product.brand} · {product.name}
                    </p>
                  )}
                  {product ? (
                    <Link
                      to="/product/$slug"
                      params={{ slug: productSlug(product) }}
                      onClick={() =>
                        trackUi("hero_seasonal_edit_click", { slide_id: season.id, destination: "product" })
                      }
                      className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-hero-paper px-5 py-2.5 text-[12px] font-bold uppercase tracking-[0.14em] text-hero-ink shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hero-ink"
                    >
                      {season.cta}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  ) : (
                    <Link
                      to={season.educationalTo ?? "/learn/hub"}
                      onClick={() =>
                        trackUi("hero_seasonal_edit_click", { slide_id: season.id, destination: "learn" })
                      }
                      className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-hero-paper px-5 py-2.5 text-[12px] font-bold uppercase tracking-[0.14em] text-hero-ink shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hero-ink"
                    >
                      {season.cta}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="relative mx-auto aspect-square w-40 sm:w-44">
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={season.image}
                  src={season.image}
                  alt={season.imageAlt}
                  aria-hidden={season.imageAlt ? undefined : true}
                  width={1024}
                  height={1024}
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={fade}
                  className="h-full w-full object-contain drop-shadow-[0_24px_30px_rgba(0,0,0,0.25)]"
                />
              </AnimatePresence>
            </div>
          </div>

          <div
            role="tablist"
            aria-label="Choose a season"
            className="relative flex flex-wrap gap-2 border-t border-hero-ink/10 bg-hero-paper/70 px-6 py-3 md:px-8"
          >
            {SEASONS.map((s, i) => (
              <button
                key={s.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                id={`season-tab-${s.id}`}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-controls={`season-panel-${s.id}`}
                tabIndex={i === index ? 0 : -1}
                onClick={() => select(i)}
                onKeyDown={onTabKey}
                className={`min-h-[40px] rounded-full px-4 text-[12px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hero-ink focus-visible:ring-offset-1 ${
                  i === index ? "bg-hero-ink text-hero-paper" : "text-hero-ink hover:bg-hero-cream"
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
