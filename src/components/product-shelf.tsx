import { useRef, useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { SHOP_PRODUCTS } from "@/lib/shop-catalog";
import { productSlug } from "@/lib/product-detail";

/**
 * Rhode-style editorial product shelf: a quiet horizontal carousel of
 * curated products on a warm neutral ground, each card linking to its
 * product page. Drag/scroll natively, or use the arrow controls.
 */

const SHELF_PRICE_IDS = [
  "haruharu_wonder_black_rice_hyaluronic_toner_150ml_onetime",
  "medicube_pdrn_pink_peptide_serum_30ml_onetime",
  "beauty_of_joseon_revive_eye_serum_ginseng_plus_retinal_30ml_onetime",
  "round_lab_1025_dokdo_toner_100ml_onetime",
  "tirtir_ceramic_milk_ampoule_40ml_onetime",
  "aestura_atobarrier365_cream_onetime",
  "wellage_real_hyaluronic_toner_200ml_onetime",
  "beplain_mung_bean_cleansing_oil_200ml_onetime",
  "medicube_collagen_jelly_cream_110ml_onetime",
  "torriden_dive_in_serum_50ml_onetime",
  "isntree_hyaluronic_acid_watery_sun_gel_50ml_onetime",
  "biodance_bio_collagen_real_deep_mask_onetime",
];

export function ProductShelf() {
  const products = SHELF_PRICE_IDS.map((id) =>
    SHOP_PRODUCTS.find((p) => p.priceId === id),
  ).filter((p): p is NonNullable<typeof p> => Boolean(p));

  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateArrows = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

  useEffect(() => {
    updateArrows();
    const el = trackRef.current;
    el?.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el?.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-shelf-card]");
    const step = card ? card.offsetWidth + 20 : 320;
    el.scrollBy({ left: dir * step * 2, behavior: "smooth" });
  };

  return (
    <section
      aria-labelledby="shelf-heading"
      className="border-t border-[#2B2118]/10 bg-[#F3EDE4] text-[#2B2118]"
    >
      <div className="mx-auto max-w-7xl px-6 py-20 md:px-12 md:py-28">
        {/* Header row */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-lg">
            <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#7A6A58]">
              <span className="h-px w-8 bg-[#7A6A58]" />
              The edit
            </p>
            <h2
              id="shelf-heading"
              className="mt-4 font-masthead text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.02] tracking-tight"
            >
              From the shelf,
              <span className="block italic text-[#9A6B4F]">straight from Seoul.</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              disabled={!canPrev}
              aria-label="Scroll products left"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#2B2118]/20 text-[#2B2118] transition hover:border-[#2B2118] disabled:opacity-30 disabled:hover:border-[#2B2118]/20"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              disabled={!canNext}
              aria-label="Scroll products right"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#2B2118]/20 text-[#2B2118] transition hover:border-[#2B2118] disabled:opacity-30 disabled:hover:border-[#2B2118]/20"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Horizontal shelf */}
        <div
          ref={trackRef}
          className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((p) => (
            <Link
              key={p.priceId}
              data-shelf-card
              to="/product/$slug"
              params={{ slug: productSlug(p) }}
              className="group w-[240px] shrink-0 snap-start md:w-[264px]"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[#EAE1D3]">
                <img
                  src={p.image}
                  alt={`${p.brand} ${p.name}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#F6F1E9]/90 opacity-0 shadow-sm backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
                  <ArrowUpRight className="h-3.5 w-3.5 text-[#2B2118]" />
                </span>
              </div>
              <div className="mt-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#7A6A58]">
                  {p.brand}
                </p>
                <p className="mt-1.5 font-masthead text-[15px] italic leading-snug">
                  {p.name}
                </p>
                <p className="mt-2 text-sm font-semibold">{p.price}</p>
              </div>
            </Link>
          ))}

          {/* End card — link to full shop */}
          <Link
            to="/shop"
            className="group flex w-[240px] shrink-0 snap-start flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-[#2B2118]/25 text-center transition hover:border-[#2B2118] md:w-[264px]"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2B2118] text-[#F6F1E9] transition-transform duration-300 group-hover:scale-110">
              <ArrowRight className="h-4 w-4" />
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#2B2118]/80 group-hover:text-[#2B2118]">
              Shop the full shelf
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
