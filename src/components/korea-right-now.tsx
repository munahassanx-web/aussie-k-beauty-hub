import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { useCart } from "@/lib/cart";
import { productSlug } from "@/lib/product-detail";
import { SHOP_PRODUCTS, priceToCents, type ShopProduct } from "@/lib/shop-catalog";

type Pick = {
  priceId: string;
  /** Short editorial reason this sits on our radar — no ranking or trend claims. */
  note: string;
};

/**
 * "The Seoul Edit" — a quiet editorial feature: one considered pick, then a
 * short shortlist from the cabinet. Editorial first, commerce second.
 */
const FEATURED: Pick = {
  priceId: "medicube_pdrn_pink_peptide_serum_30ml_onetime",
  note: "PDRN has moved from the treatment room into everyday Korean skincare. This peptide serum is our entry point into the category: a focused formula for anyone curious about the ingredient without turning their routine upside down.",
};

const SHORTLIST: Pick[] = [
  {
    priceId: "beplain_mung_bean_ph_balanced_cleansing_foam_80ml_onetime",
    note: "A low-pH mung bean foam for anyone who finds cleansing leaves their skin tight.",
  },
  {
    priceId: "aestura_atobarrier365_cream_onetime",
    note: "A plain, ceramide-led cream — the one we reach for when the barrier needs quiet.",
  },
  {
    priceId: "torriden_dive_in_serum_onetime",
    note: "Low-molecular hyaluronic acid, kept simple. Hydration without any weight.",
  },
  {
    priceId: "round_lab_1025_dokdo_toner_100ml_onetime",
    note: "Uncomplicated, fragrance-light hydration — an easy first step in a routine.",
  },
  {
    priceId: "s_nature_aqua_oasis_toner_onetime",
    note: "Water-first and unfussy, for skin that reacts to a heavier formula.",
  },
  {
    priceId: "biodance_bio_collagen_real_deep_mask_onetime",
    note: "The overnight hydrogel mask that turns clear as it works. A ritual more than a step.",
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
        className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${
          dark ? "text-paper/60" : "text-muted-foreground"
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
      className={`border-b pb-1 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors ${
        dark
          ? "border-paper/40 text-paper hover:border-paper"
          : "border-foreground/30 text-foreground hover:border-foreground"
      }`}
    >
      Add to order
    </button>
  );
}

export function KoreaRightNow() {
  const scroller = useRef<HTMLDivElement>(null);
  const hero = byPriceId(FEATURED.priceId);
  const picks = SHORTLIST.map((s) => ({ ...s, product: byPriceId(s.priceId) })).filter(
    (s): s is Pick & { product: ShopProduct } => Boolean(s.product),
  );

  const nudge = (dir: 1 | -1) => {
    scroller.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <section className="bg-sand" aria-labelledby="the-seoul-edit">
      <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-clay">
              The Seoul Edit
            </p>
            <h2
              id="the-seoul-edit"
              className="mt-4 font-display text-4xl leading-[1.05] text-ink md:text-5xl"
            >
              What&rsquo;s worth knowing now.
            </h2>
            <p className="mt-5 max-w-xl text-ink/70">
              New formulas, ingredients and Korean skincare discoveries on our radar — edited down
              to what&rsquo;s actually worth your attention.
            </p>
          </div>
          <Link
            to="/blog"
            className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink underline underline-offset-4 hover:text-clay"
          >
            Explore the journal →
          </Link>
        </div>

        {/* Editor's note */}
        {hero && (
          <div className="mt-16 border-t border-foreground/15 pt-12">
            <div className="grid items-center gap-12 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <Link
                to="/product/$slug"
                params={{ slug: productSlug(hero) }}
                className="group flex items-center justify-center bg-paper p-10 md:p-14"
              >
                <img
                  src={hero.image}
                  alt={`${hero.brand} ${hero.name}`}
                  loading="lazy"
                  className="max-h-[380px] w-full object-contain"
                />
              </Link>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-clay">
                  The Editor&rsquo;s Note
                </p>
                <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/60">
                  {hero.brand}
                </p>
                <h3 className="mt-2 font-display text-3xl leading-tight text-ink md:text-4xl">
                  {hero.name}
                </h3>
                <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-ink/75">
                  {FEATURED.note}
                </p>
                <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-foreground/15 pt-6">
                  <Link
                    to="/product/$slug"
                    params={{ slug: productSlug(hero) }}
                    className="text-sm text-ink underline-offset-4 hover:underline"
                  >
                    Read the full breakdown
                  </Link>
                  <span className="text-sm text-ink/70">{hero.price} AUD</span>
                  <AddButton p={hero} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* On our radar */}
        <div className="mt-20 flex items-end justify-between gap-6 border-t border-foreground/15 pt-10">
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-ink">
              On our radar
            </h3>
            <p className="mt-2 text-sm text-ink/65">
              A considered shortlist from the SkinGrocer cabinet.
            </p>
          </div>
          <div className="hidden gap-2 md:flex">
            <button
              type="button"
              aria-label="Previous products"
              onClick={() => nudge(-1)}
              className="h-9 w-9 border border-foreground/20 text-sm text-foreground transition-colors hover:border-foreground"
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Next products"
              onClick={() => nudge(1)}
              className="h-9 w-9 border border-foreground/20 text-sm text-foreground transition-colors hover:border-foreground"
            >
              →
            </button>
          </div>
        </div>

        <div
          ref={scroller}
          className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-8 overflow-x-auto pb-2"
        >
          {picks.map(({ product: p, note }) => (
            <article key={p.priceId} className="flex w-[260px] shrink-0 snap-start flex-col sm:w-[290px]">
              <Link
                to="/product/$slug"
                params={{ slug: productSlug(p) }}
                className="block bg-paper"
              >
                <img
                  src={p.image}
                  alt={`${p.brand} ${p.name}`}
                  loading="lazy"
                  className="aspect-square w-full object-contain p-6"
                />
              </Link>
              <Link to="/product/$slug" params={{ slug: productSlug(p) }} className="mt-5 block">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-clay">
                  {p.brand}
                </p>
                <h4 className="mt-1.5 font-display text-lg leading-tight text-ink hover:text-hanbok-deep">
                  {p.name}
                </h4>
              </Link>
              <p className="mt-2.5 flex-1 text-[13px] leading-relaxed text-ink/65">{note}</p>
              <div className="mt-5 flex items-center justify-between gap-3 border-t border-foreground/15 pt-4">
                <span className="text-sm text-ink/70">{p.price} AUD</span>
                <AddButton p={p} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
