import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { useCart } from "@/lib/cart";
import { productSlug } from "@/lib/product-detail";
import { SHOP_PRODUCTS, priceToCents, type ShopProduct } from "@/lib/shop-catalog";

type Pick = {
  priceId: string;
  /** Why this is moving in Korea right now — factual, no invented claims. */
  signal: string;
  /** Where the signal came from, shown to the reader. */
  source: string;
};

/**
 * "Korea right now" — the weekly read on what's actually selling and being
 * discussed in Seoul, matched to what we hold in the Melbourne warehouse.
 * Compiled from Olive Young ranking movement, Korean review platforms,
 * r/AsianBeauty and r/KoreanBeauty discussion, and weekly YouTube round-ups.
 */
const PRODUCT_OF_THE_WEEK: Pick = {
  priceId: "biodance_bio_collagen_real_deep_mask_onetime",
  signal:
    "The overnight hydrogel mask that turns clear as it works. It is the single most re-bought sheet mask in our warehouse and still the mask Korean review platforms and Western reviewers keep benchmarking every new collagen mask against.",
  source: "Olive Young mask ranking · r/AsianBeauty discussion",
};

const WEEKLY_PICKS: Pick[] = [
  {
    priceId: "medicube_pdrn_pink_peptide_serum_30ml_onetime",
    signal: "PDRN moved out of Korean clinics and into everyday shelves — this is the serum that did it.",
    source: "Olive Young serum ranking",
  },
  {
    priceId: "medicube_pdrn_pink_cica_soothing_toner_250ml_onetime",
    signal: "Soothing-first toners keep outselling acid toners in Korea for reactive, congested skin.",
    source: "Korean review platforms",
  },
  {
    priceId: "torriden_dive_in_serum_onetime",
    signal: "Low-molecular hyaluronic acid, no fragrance, cheap enough to use with a heavy hand.",
    source: "Weekly YouTube round-ups",
  },
  {
    priceId: "aestura_derma_uv365_barrier_moisture_mineral_sun_cream_onetime",
    signal: "Mineral SPF that behaves like a moisturiser — the Korean answer to daily reapplication.",
    source: "Korean pharmacy suncare ranking",
  },
  {
    priceId: "aestura_atobarrier365_cream_onetime",
    signal: "Derm-counter ceramide cream. What Koreans buy when the barrier is genuinely damaged.",
    source: "Korean pharmacy sales data",
  },
  {
    priceId: "tirtir_ceramic_milk_ampoule_40ml_onetime",
    signal: "Milky ampoules are the current Seoul texture trend — glow without a heavy occlusive.",
    source: "Korean beauty press",
  },
];

function byPriceId(id: string): ShopProduct | undefined {
  return SHOP_PRODUCTS.find((p) => p.priceId === id);
}

function AddButton({ p, dark = false }: { p: ShopProduct; dark?: boolean }) {
  const { add, setOpen } = useCart();
  if (p.comingSoon) {
    return (
      <span
        className={`inline-flex rounded-full border px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] ${
          dark ? "border-paper/30 text-paper/70" : "border-foreground/20 text-muted-foreground"
        }`}
      >
        Arriving soon
      </span>
    );
  }
  return (
    <button
      type="button"
      onClick={() => {
        add({
          priceId: p.priceId,
          name: p.name,
          brand: p.brand,
          image: p.image,
          unitCents: priceToCents(p.price),
          recurring: false,
        });
        setOpen(true);
      }}
      className={`inline-flex rounded-full px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors ${
        dark
          ? "bg-paper text-ink hover:bg-accent"
          : "border border-foreground/25 text-foreground hover:bg-foreground hover:text-background"
      }`}
    >
      Add to order
    </button>
  );
}

export function KoreaRightNow() {
  const scroller = useRef<HTMLDivElement>(null);
  const hero = byPriceId(PRODUCT_OF_THE_WEEK.priceId);
  const picks = WEEKLY_PICKS.map((s) => ({ ...s, product: byPriceId(s.priceId) })).filter(
    (s): s is Pick & { product: ShopProduct } => Boolean(s.product),
  );

  const nudge = (dir: 1 | -1) => {
    scroller.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <section className="bg-sand" aria-labelledby="korea-right-now">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-clay">
              Korea right now · Updated weekly
            </p>
            <h2 id="korea-right-now" className="mt-3 font-display text-4xl leading-[1.05] text-ink md:text-5xl">
              What Seoul is buying this week —<br />
              <span className="italic text-hanbok-deep">in stock in Melbourne today.</span>
            </h2>
            <p className="mt-5 text-ink/70">
              We read Olive Young ranking movement, Korean review platforms, the Korean beauty
              subreddits and the weekly YouTube top-fives, then check it against what&rsquo;s on our
              shelves. This is that list — no sponsored slots, no clearance dressed up as a trend.
            </p>
          </div>
          <Link
            to="/grocery-list"
            className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink underline underline-offset-4 hover:text-clay"
          >
            How we track this →
          </Link>
        </div>

        {/* Product of the week */}
        {hero && (
          <div className="mt-12 overflow-hidden rounded-3xl bg-ink text-paper">
            <div className="grid md:grid-cols-2">
              <Link
                to="/product/$slug"
                params={{ slug: productSlug(hero) }}
                className="group flex items-center justify-center bg-paper/5 p-8"
              >
                <img
                  src={hero.image}
                  alt={`${hero.brand} ${hero.name}`}
                  loading="lazy"
                  className="max-h-[400px] w-full object-contain transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </Link>
              <div className="flex flex-col justify-center p-8 md:p-12">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-accent">
                  Product of the week
                </p>
                <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-paper/60">
                  {hero.brand}
                </p>
                <h3 className="mt-2 font-display text-3xl leading-tight md:text-4xl">{hero.name}</h3>
                <p className="mt-4 max-w-md text-[14.5px] leading-relaxed text-paper/75">
                  {PRODUCT_OF_THE_WEEK.signal}
                </p>
                <p className="mt-4 text-[10px] uppercase tracking-[0.18em] text-paper/45">
                  Signal source: {PRODUCT_OF_THE_WEEK.source}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <AddButton p={hero} dark />
                  <Link
                    to="/product/$slug"
                    params={{ slug: productSlug(hero) }}
                    className="text-sm text-paper/80 underline-offset-4 hover:text-paper hover:underline"
                  >
                    {hero.price} AUD · Read the full breakdown
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Weekly carousel */}
        <div className="mt-14 flex items-end justify-between gap-6">
          <h3 className="font-display text-2xl text-ink md:text-3xl">Moving in Seoul this week</h3>
          <div className="hidden gap-2 md:flex">
            <button
              type="button"
              aria-label="Previous products"
              onClick={() => nudge(-1)}
              className="h-10 w-10 rounded-full border border-foreground/20 text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Next products"
              onClick={() => nudge(1)}
              className="h-10 w-10 rounded-full border border-foreground/20 text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              →
            </button>
          </div>
        </div>

        <div
          ref={scroller}
          className="no-scrollbar mt-6 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2"
        >
          {picks.map(({ product: p, signal, source }, i) => (
            <article
              key={p.priceId}
              className="flex w-[268px] shrink-0 snap-start flex-col sm:w-[300px]"
            >
              <Link
                to="/product/$slug"
                params={{ slug: productSlug(p) }}
                className="group relative block overflow-hidden rounded-2xl bg-background"
              >
                <span className="absolute left-4 top-4 z-10 rounded-full bg-ink px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-paper">
                  #{i + 1}
                </span>
                <img
                  src={p.image}
                  alt={`${p.brand} ${p.name}`}
                  loading="lazy"
                  className="aspect-square w-full object-contain p-5 transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </Link>
              <Link to="/product/$slug" params={{ slug: productSlug(p) }} className="mt-4 block">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-clay">
                  {p.brand}
                </p>
                <h4 className="mt-1.5 font-display text-lg leading-tight text-ink hover:text-hanbok-deep">
                  {p.name}
                </h4>
              </Link>
              <p className="mt-2 flex-1 text-[13px] leading-relaxed text-ink/65">{signal}</p>
              <p className="mt-3 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                {source}
              </p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="text-sm text-ink">{p.price} AUD</span>
                <AddButton p={p} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
