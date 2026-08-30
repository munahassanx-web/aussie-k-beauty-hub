import { useEffect, useId, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { trackUi } from "@/lib/analytics";
import { SHOP_PRODUCTS } from "@/lib/shop-catalog";
import { ingredientsFor } from "@/lib/collection-filters";

import texSnail from "@/assets/ingredients/tex-snail-mucin.jpg";
import texCentella from "@/assets/ingredients/tex-centella.jpg";
import texNiacinamide from "@/assets/ingredients/tex-niacinamide.jpg";
import texPropolis from "@/assets/ingredients/tex-propolis.jpg";
import texBetaGlucan from "@/assets/ingredients/tex-beta-glucan.jpg";
import texMadecassoside from "@/assets/ingredients/tex-madecassoside.jpg";

type Evidence = "ESTABLISHED" | "PROMISING" | "FORMULA-DEPENDENT";

type Chapter = {
  n: string;
  name: string;
  category: string;
  evidence: Evidence;
  what: string;
  why: string;
  may: string;
  mind: string;
  image: string;
  alt: string;
  /** Accent field colour drawn from the ingredient's own material palette. */
  tint: string;
  /** Exact shop facet value — every one returns real, stocked products. */
  shopIngredient: string;
  learn?: { slug: string; label: string };
};

const CHAPTERS: Chapter[] = [
  {
    n: "01",
    name: "Snail mucin",
    category: "HYDRATION + COMFORT",
    evidence: "FORMULA-DEPENDENT",
    what: "Usually listed as snail secretion filtrate, it is a cosmetic ingredient containing a mixture of water-binding and skin-conditioning components.",
    why: "It works well in lightweight essences and serums designed to layer without feeling heavy.",
    may: "Supporting hydration, softness and a temporarily plumper appearance.",
    mind: "Independent clinical evidence for major skin transformation remains limited. Patch test, particularly if your skin is reactive.",
    image: texSnail,
    alt: "Macro study of a translucent pearl-toned skincare gel with soft blue highlights.",
    tint: "#e8eef4",
    shopIngredient: "Snail Secretion Filtrate",
  },
  {
    n: "02",
    name: "Centella asiatica",
    category: "SOOTHING SUPPORT",
    evidence: "PROMISING",
    what: "A botanical extract also known as cica, containing components including asiaticoside and madecassoside.",
    why: "It suits Korea’s preference for calming, layerable formulas that support comfortable everyday routines.",
    may: "Reducing the feeling of discomfort and supporting skin that looks temporarily unsettled.",
    mind: "Benefits depend on the extract, concentration and complete formula. It is not a treatment for rosacea, eczema or dermatitis.",
    image: texCentella,
    alt: "Macro photograph of green botanical leaves holding clear water droplets.",
    tint: "#e4ece1",
    shopIngredient: "Centella Asiatica (Cica)",
    learn: { slug: "centella-everywhere", label: "Read the centella article" },
  },
  {
    n: "03",
    name: "Niacinamide",
    category: "BARRIER + UNEVEN-LOOKING TONE",
    evidence: "ESTABLISHED",
    what: "A topical form of vitamin B3 used across both Korean and Western skincare.",
    why: "It is versatile, works in many lightweight formulations and pairs with a wide range of routine steps.",
    may: "Supporting the skin barrier, improving the appearance of uneven tone and helping regulate the look of excess oil.",
    mind: "Higher percentages are not automatically better and may irritate some customers.",
    image: texNiacinamide,
    alt: "Macro study of an ivory cream swirl with a single raspberry-toned ribbon folded through it.",
    tint: "#f5eee6",
    shopIngredient: "Niacinamide",
    learn: { slug: "pigmentation-language", label: "Read about tone and pigment language" },
  },
  {
    n: "04",
    name: "Propolis",
    category: "HYDRATION + COMFORT",
    evidence: "FORMULA-DEPENDENT",
    what: "A resinous material collected and processed by bees, used in skincare as a conditioning ingredient.",
    why: "It works well in glow-focused ampoules, toners and serums with nourishing textures.",
    may: "Supporting hydration and helping skin feel more comfortable.",
    mind: "Avoid if you have a known allergy to bee-related products. Cosmetic evidence is less established than the popularity of the ingredient may suggest.",
    image: texPropolis,
    alt: "Macro study of warm amber, honey-gold translucent resin.",
    tint: "#f7ecd8",
    shopIngredient: "Propolis Extract",
  },
  {
    n: "05",
    name: "Beta-glucan",
    category: "HUMECTANT HYDRATION",
    evidence: "PROMISING",
    what: "A family of polysaccharides that can come from sources including oats, yeast, fungi and cereals.",
    why: "It offers hydration and comfort without requiring a heavy or greasy texture.",
    may: "Water retention, softness and supporting a comfortable moisturising routine.",
    mind: "Its performance depends on ingredient source, formulation and the other moisturising components around it.",
    image: texBetaGlucan,
    alt: "Macro study of oat-toned milky liquid swirling with soft cloud-blue shadows.",
    tint: "#f2ece0",
    shopIngredient: "Beta-Glucan",
  },
  {
    n: "06",
    name: "Madecassoside",
    category: "SOOTHING SUPPORT",
    evidence: "PROMISING",
    what: "One of the better-known components associated with Centella asiatica.",
    why: "It is commonly incorporated into products positioned for gentle, barrier-conscious and comfort-focused routines.",
    may: "Supporting skin comfort and reducing the appearance of temporary irritation.",
    mind: "It should not be presented as a medical treatment. Results depend on the complete product and the reason the skin appears irritated.",
    image: texMadecassoside,
    alt: "Macro study of pale sage-green water rippling over mineral white.",
    tint: "#e7edea",
    shopIngredient: "Madecassoside",
    learn: { slug: "centella-everywhere", label: "Read the centella article" },
  },
];

/** Real catalogue counts — a link is only shown when the filter has stock. */
const PRODUCT_COUNTS = new Map<string, number>(
  CHAPTERS.map((c) => [
    c.shopIngredient,
    SHOP_PRODUCTS.filter((p) => ingredientsFor(p).includes(c.shopIngredient)).length,
  ]),
);


const PRINCIPLES = [
  { n: "01", title: "COMPLETE FORMULA", line: "Not one hero ingredient in isolation." },
  { n: "02", title: "CLEAR ROUTINE ROLE", line: "The product must have a reason to exist." },
  { n: "03", title: "REALISTIC EVIDENCE", line: "Popularity and proof are not the same thing." },
  {
    n: "04",
    title: "USABILITY",
    line: "Texture, layering and the likelihood that customers will actually finish it.",
  },
  {
    n: "05",
    title: "CUSTOMER FIT",
    line: "Who it may suit—and who should approach it carefully.",
  },
];

const EVIDENCE_NOTE =
  "Evidence ratings reflect the quality and relevance of available research for topical cosmetic use. They do not guarantee an individual result.";

function EvidenceBadge({ level }: { level: Evidence }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/70">
      <span
        aria-hidden="true"
        className={
          level === "ESTABLISHED"
            ? "size-1.5 rounded-full bg-ink"
            : level === "PROMISING"
              ? "size-1.5 rounded-full bg-ink/50"
              : "size-1.5 rounded-full border border-ink/50"
        }
      />
      {level}
    </span>
  );
}

function Field({ label, children }: { label: string; children: string }) {
  return (
    <div className="grid gap-1 md:grid-cols-[10.5rem_1fr] md:gap-6">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/60">{label}</dt>
      <dd className="max-w-[62ch] text-[15px] leading-[1.62] text-ink/85 md:text-[16px]">
        {children}
      </dd>
    </div>
  );
}

function ChapterPanel({
  chapter,
  open,
  onToggle,
  hasProducts,
}: {
  chapter: Chapter;
  open: boolean;
  onToggle: () => void;
  hasProducts: boolean;
}) {
  const uid = useId();
  const panelId = `ing-panel-${uid}`;
  const buttonId = `ing-button-${uid}`;

  return (
    <article
      className="group relative border-b border-border transition-colors"
      style={open ? { backgroundColor: chapter.tint } : undefined}
    >
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={`${open ? "Collapse" : "Expand"} information about ${chapter.name}`}
          onClick={onToggle}
          className="flex min-h-[44px] w-full items-center gap-5 px-4 py-6 text-left transition-colors hover:bg-ink/[0.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink md:min-h-[128px] md:gap-8 md:px-8 md:py-7"
        >
          <span className="font-display text-xs italic text-ink/50 tabular-nums">{chapter.n}</span>
          <span className="min-w-0 flex-1">
            <span className="block font-display text-[clamp(1.6rem,4vw,2.75rem)] leading-[1.06] text-ink">
              {chapter.name}
            </span>
            <span className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/60">
                {chapter.category}
              </span>
              <EvidenceBadge level={chapter.evidence} />
            </span>
          </span>
          <span
            aria-hidden="true"
            className="shrink-0 text-2xl font-light leading-none text-ink/50 transition-colors group-hover:text-ink"
          >
            {open ? "−" : "+"}
          </span>
        </button>
      </h3>

      <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!open}>
        <div className="grid items-start gap-8 px-4 pb-10 md:min-h-[480px] md:grid-cols-[40%_1fr] md:gap-12 md:px-12 md:pb-14 md:pt-2">
          <div
            className="overflow-hidden rounded-[1.5rem]"
            style={{ backgroundColor: chapter.tint }}
          >
            <img
              src={chapter.image}
              alt={chapter.alt}
              width={1024}
              height={1024}
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] w-full object-cover transition-transform duration-500 ease-out hover:scale-[1.02] motion-reduce:transition-none motion-reduce:hover:scale-100 md:aspect-[4/5]"
            />
          </div>

          <dl className="space-y-6">
            <Field label="What it is">{chapter.what}</Field>
            <Field label="Why it’s in K-beauty">{chapter.why}</Field>
            <Field label="What it may help with">{chapter.may}</Field>
            <Field label="Keep in mind">{chapter.mind}</Field>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-2">
              {hasProducts && (
                <Link
                  to="/shop"
                  search={{ ingredient: chapter.shopIngredient }}
                  onClick={() =>
                    trackUi("ingredient_library_products", { ingredient: chapter.name })
                  }
                  className="group/link inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink"
                >
                  <span className="border-b border-ink/30 pb-0.5 transition-colors group-hover/link:border-ink">
                    View products with this ingredient
                  </span>
                  <span className="transition-transform duration-300 group-hover/link:translate-x-1 motion-reduce:transition-none">
                    →
                  </span>
                </Link>
              )}
              {chapter.learn && (
                <Link
                  to="/learn/article/$slug"
                  params={{ slug: chapter.learn.slug }}
                  onClick={() => trackUi("ingredient_library_learn", { ingredient: chapter.name })}
                  className="text-[11px] font-semibold uppercase tracking-[0.18em] text-clay underline-offset-4 hover:underline"
                >
                  {chapter.learn.label} →
                </Link>
              )}
            </div>
          </dl>
        </div>
      </div>
    </article>
  );
}

export function IngredientLibrary() {
  const [openIndex, setOpenIndex] = useState(0);
  const seen = useRef(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !seen.current) {
            seen.current = true;
            trackUi("ingredient_library_view", {});
            io.disconnect();
          }
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="border-b border-border bg-paper"
      aria-labelledby="ingredient-library-heading"
    >
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="eyebrow eyebrow-rule text-clay">THE INGREDIENT LIBRARY</p>
            <h2
              id="ingredient-library-heading"
              className="mt-4 font-display text-[clamp(2rem,4.6vw,3.25rem)] leading-[1.08] text-ink"
            >
              An ingredient can start the conversation.{" "}
              <span className="italic">The whole formula decides.</span>
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="text-[15px] leading-relaxed text-ink/70">
              Korean skincare is known for thoughtful textures and ingredient combinations—not
              miracle extracts. Learn what familiar ingredients may contribute, where the evidence
              is stronger and why the complete formula matters.
            </p>
            <Link
              to="/learn"
              onClick={() => trackUi("ingredient_library_cta", { target: "/learn" })}
              className="group mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink"
            >
              <span className="border-b border-ink/30 pb-0.5 transition-colors group-hover:border-ink">
                Explore the ingredient library
              </span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>

        {/* Evidence key */}
        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-5 md:flex-row md:items-center md:justify-between">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/60">
            <span className="text-ink">Evidence guide</span>
            <span aria-hidden="true" className="text-ink/25">
              ·
            </span>
            <span>Established · Promising · Formula-dependent</span>
          </p>
          <p className="max-w-xl text-[12px] leading-relaxed text-ink/55">{EVIDENCE_NOTE}</p>
        </div>

        <div className="mt-4 border-t border-border">
          {CHAPTERS.map((c, i) => (
            <ChapterPanel
              key={c.name}
              chapter={c}
              hasProducts={PRODUCT_COUNTS.get(c.shopIngredient) ? true : false}
              open={openIndex === i}
              onToggle={() => {
                setOpenIndex((prev) => (prev === i ? -1 : i));
                trackUi("ingredient_library_open", { ingredient: c.name });
              }}
            />
          ))}
        </div>

        {/* Curation principle */}
        <div className="mt-16 rounded-[2rem] bg-hanbok-deep px-6 py-12 text-paper md:px-12 md:py-16">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-paper/60">
                HOW WE READ A FORMULA
              </p>
              <h3 className="mt-4 font-display text-3xl leading-tight md:text-4xl">
                A trending ingredient is not enough.
              </h3>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-paper/75">
                Before a product reaches the Skin Grocer shelf, we consider the complete ingredient
                list, formula format, packaging, routine role, available evidence and who it is
                realistically suited to.
              </p>
              <Link
                to="/about"
                onClick={() => trackUi("ingredient_library_curation", { target: "/about" })}
                className="group mt-8 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-paper"
              >
                <span className="border-b border-paper/40 pb-0.5 transition-colors group-hover:border-paper">
                  Read how we curate
                </span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>

            <ul className="md:col-span-7 md:border-t md:border-paper/20">
              {PRINCIPLES.map((p) => (
                <li
                  key={p.n}
                  className="grid gap-1 border-b border-paper/15 py-5 md:grid-cols-[3rem_1fr] md:gap-8"
                >
                  <span className="font-display text-sm italic text-paper/55">{p.n}</span>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-paper">
                      {p.title}
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-paper/70">{p.line}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
