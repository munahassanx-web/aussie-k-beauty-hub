import { Link } from "@tanstack/react-router";

import imgHydration from "@/assets/concerns/notice-hydration.webp";
import imgAcne from "@/assets/concerns/notice-acne.webp";
import imgPigmentation from "@/assets/concerns/notice-pigmentation.webp";
import imgSensitivity from "@/assets/concerns/notice-sensitivity.webp";
import imgFirmness from "@/assets/concerns/notice-firmness.webp";
import imgBarrier from "@/assets/concerns/notice-barrier.webp";

type ConcernSlug =
  | "hydration"
  | "acne"
  | "pigmentation"
  | "sensitivity"
  | "anti-aging"
  | "barrier";

type ConcernCard = {
  slug: ConcernSlug;
  title: string;
  desc: string;
  cue: string;
  img: string;
  alt: string;
};

/** Customer-facing copy only — the slug remains the internal shop filter value. */
const CONCERN_CARDS: ConcernCard[] = [
  {
    slug: "hydration",
    title: "Hydration & Glow",
    desc: "For skin that often feels dry, tight or less comfortable than usual.",
    cue: "Explore lightweight hydration and moisture support.",
    img: imgHydration,
    alt: "Close editorial crop of naturally textured skin beside a clear water-gel skincare texture in soft daylight.",
  },
  {
    slug: "acne",
    title: "Blemish-Prone",
    desc: "For skin that frequently looks congested, shiny or blemish-prone.",
    cue: "Explore simpler routines and carefully selected exfoliating options.",
    img: imgAcne,
    alt: "Natural, unretouched skin texture photographed in daylight alongside a lightweight clear gel texture on pale stone.",
  },
  {
    slug: "pigmentation",
    title: "Uneven-Looking Tone",
    desc: "For routines focused on a brighter, more even-looking finish.",
    cue: "Explore daily hydration and targeted tone-support products.",
    img: imgPigmentation,
    alt: "Real skin texture in warm daylight next to a translucent amber, rice-inspired serum texture on a ceramic dish.",
  },
  {
    slug: "sensitivity",
    title: "Easily Unsettled",
    desc: "For skin that prefers fewer products and gentler-feeling formulas.",
    cue: "Explore calm, uncomplicated routine choices.",
    img: imgSensitivity,
    alt: "Quiet still life of fresh centella leaves and a soft white cream texture on linen beside calm, naturally textured skin.",
  },
  {
    slug: "anti-aging",
    title: "Firmness & Fine Lines",
    desc: "For routines centred on hydration and a smoother-looking finish.",
    cue: "Explore moisturising and well-ageing routine support.",
    img: imgFirmness,
    alt: "Portrait of a confident woman in her fifties with natural skin texture and expression lines, photographed in soft window light.",
  },
  {
    slug: "barrier",
    title: "Barrier-Focused",
    desc: "For skin that feels dry, overworked or uncomfortable after a complicated routine.",
    cue: "Explore moisture-first, low-complexity choices.",
    img: imgBarrier,
    alt: "Macro composition of a rich white moisturising cream texture with layered peaks on warm neutral stone and linen.",
  },
];

function ConcernTile({
  card,
  feature = false,
  eager = false,
  className = "",
}: {
  card: ConcernCard;
  feature?: boolean;
  eager?: boolean;
  className?: string;
}) {
  return (
    <Link
      to="/shop"
      search={{ concern: card.slug }}
      aria-label={`${card.title} — explore the edit`}
      className={`group relative isolate flex min-h-[220px] flex-col justify-end overflow-hidden rounded-2xl border border-border/60 bg-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hanbok-deep ${className}`}
    >
      <img
        src={card.img}
        alt={card.alt}
        width={1280}
        height={1600}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.04] motion-reduce:transform-none motion-reduce:transition-none"
      />
      <div
        aria-hidden="true"
        className={`absolute inset-0 -z-10 bg-gradient-to-t transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none ${feature ? "from-black/85 via-black/50 to-black/15 opacity-90" : "from-black/85 via-black/70 to-black/55 opacity-95"}`}
      />

      <div className={feature ? "p-8 md:p-10" : "p-6 md:p-7"}>
        <h3
          className={`font-display text-white ${feature ? "text-3xl md:text-4xl" : "text-xl md:text-2xl"}`}
        >
          {card.title}
        </h3>
        <p
          className={`mt-2 max-w-md leading-relaxed text-white/85 ${feature ? "text-base" : "text-sm"}`}
        >
          {card.desc}
        </p>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70 transition-colors duration-300 group-hover:text-white group-focus-visible:text-white">
          {card.cue}
        </p>
        <span className="mt-5 inline-flex min-h-11 items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white underline decoration-white/40 underline-offset-8 transition-[text-decoration-color] duration-300 group-hover:decoration-white group-focus-visible:decoration-white">
          Explore the edit
          <span
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none"
          >
            →
          </span>
        </span>
      </div>
    </Link>
  );
}

export function ConcernNavigator() {
  const [feature, ...rest] = CONCERN_CARDS;

  return (
    <section className="bg-paper" aria-labelledby="shop-by-what-you-notice">
      <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">
            SHOP BY WHAT YOU NOTICE
          </p>
          <h2 id="shop-by-what-you-notice" className="display-section mt-4 text-ink">
            Start with what you notice—not what is trending.
          </h2>
          <p className="mt-5 max-w-2xl text-ink/70">
            You don&rsquo;t need to diagnose your skin or understand every ingredient. Choose what
            feels most familiar, then explore products selected for that routine goal.
          </p>
          <p className="mt-4 max-w-2xl text-xs leading-relaxed text-ink/55">
            Cosmetic guidance only. Persistent, painful or changing skin concerns should be
            discussed with a qualified health professional.
          </p>
        </div>

        {/* Desktop: editorial feature tile + asymmetrical grid */}
        <div className="mt-14 hidden gap-5 lg:grid lg:grid-cols-3 lg:grid-rows-[minmax(260px,1fr)_minmax(260px,1fr)_minmax(240px,1fr)]">
          <ConcernTile card={feature} feature eager className="lg:row-span-2" />
          <ConcernTile card={rest[0]} />
          <ConcernTile card={rest[1]} />
          <ConcernTile card={rest[2]} />
          <ConcernTile card={rest[3]} />
          <ConcernTile card={rest[4]} className="lg:col-span-3" />
        </div>

        {/* Mobile / tablet: feature card, then a swipeable rail */}
        <div className="mt-12 lg:hidden">
          <ConcernTile card={feature} feature eager className="min-h-[380px]" />

          <ul
            className="-mx-6 mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="More skin concerns"
          >
            {rest.map((c) => (
              <li key={c.slug} className="w-[78vw] max-w-[340px] shrink-0 snap-start">
                <ConcernTile card={c} className="min-h-[300px]" />
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-ink/45">
            Swipe for more →
          </p>
        </div>
      </div>
    </section>
  );
}
