import { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { toast } from "sonner";
import { SHOP_PRODUCTS } from "@/lib/shop-catalog";
import { productSlug } from "@/lib/product-detail";
import { useBuyNow } from "@/hooks/use-buy-now";
import { useSoldOutSkus } from "@/hooks/use-stock";
import { WishlistButton } from "@/components/wishlist-button";
import { trackUi } from "@/lib/analytics";

/**
 * "A considered starting shelf" — a curated six-product edit directly beneath
 * the hero. Each card carries routine step, suitability, texture, price and an
 * inline "why we chose it" panel, plus quick add to bag. Customer-controlled
 * horizontal movement only; no auto-advancing carousel.
 */

type EditEntry = {
  priceId: string;
  step: string;
  bestFor: string;
  texture: string;
  /** Max three short points, factual: formulation, routine fit, selection note. */
  why: string[];
};

const EDIT: EditEntry[] = [
  {
    priceId: "beplain_mung_bean_cleansing_oil_200ml_onetime",
    step: "Step 1 · Cleanse",
    bestFor: "Removing makeup, sunscreen and the day's buildup",
    texture: "Light oil · Rinses clean",
    why: [
      "A mung bean-based cleansing oil that dissolves sunscreen and makeup as the first cleanse.",
      "Chosen as an easy opening step for anyone new to double cleansing.",
      "Selected because it rinses without the heavy film that puts people off oil cleansers.",
    ],
  },
  {
    priceId: "haruharu_wonder_black_rice_hyaluronic_toner_150ml_onetime",
    step: "Step 2 · Prepare",
    bestFor: "Routines that need a simple hydrating first layer",
    texture: "Watery · Absorbs quickly",
    why: [
      "A black rice ferment and hyaluronic acid toner formulated as a hydrating preparation step.",
      "Sits between cleansing and serum without adding an active to the routine.",
      "Selected as the least complicated way to add hydration before everything else.",
    ],
  },
  {
    priceId: "torriden_dive_in_serum_onetime",
    step: "Step 3 · Hydrate",
    bestFor: "Dehydrated, dull-looking skin",
    texture: "Light gel · Weightless finish",
    why: [
      "A low-molecular hyaluronic acid serum built purely for hydration rather than actives.",
      "Layers under any moisturiser, so it fits an existing routine without rearranging it.",
      "Selected as a hydration step that suits oily and dry skin equally.",
    ],
  },
  {
    priceId: "medicube_pdrn_pink_peptide_serum_30ml_onetime",
    step: "Step 3 · Treat",
    bestFor: "Routines focused on firmness and smoother-looking skin",
    texture: "Silky serum · Non-greasy",
    why: [
      "A PDRN and peptide serum, the targeted treatment step of this edit.",
      "Used after hydration and before moisturiser, once a routine is established.",
      "Selected as the one concentrated step worth adding rather than several at once.",
    ],
  },
  {
    priceId: "aestura_atobarrier365_cream_onetime",
    step: "Step 4 · Moisturise",
    bestFor: "Dry or easily unsettled skin",
    texture: "Rich cream · Comfortable finish",
    why: [
      "Ceramide-led moisturiser for routines that need more comfort.",
      "Richer than a gel cream without becoming a complicated treatment step.",
      "Selected as a barrier-focused option for customers who find lightweight moisturisers insufficient.",
    ],
  },
  {
    priceId: "biodance_bio_collagen_real_deep_mask_onetime",
    step: "Optional · Mask",
    bestFor: "An occasional hydration-focused ritual",
    texture: "Hydrogel mask · Becomes more transparent as it wears",
    why: [
      "A hydrogel mask worn overnight rather than a ten-minute sheet mask.",
      "An occasional addition, not a step that replaces anything in the routine.",
      "Selected as the specialist product in the edit for customers who like a weekly ritual.",
    ],
  },
];

const CARDS = EDIT.map((entry) => {
  const product = SHOP_PRODUCTS.find((p) => p.priceId === entry.priceId);
  return product ? { ...entry, product } : null;
}).filter((c): c is EditEntry & { product: (typeof SHOP_PRODUCTS)[number] } => Boolean(c));

export function ProductShelf() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [firstVisible, setFirstVisible] = useState(0);
  const [perPage, setPerPage] = useState(3);
  const [openWhy, setOpenWhy] = useState<string | null>(null);
  const [pending, setPending] = useState<string | null>(null);
  const [added, setAdded] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const whyButtons = useRef<Record<string, HTMLButtonElement | null>>({});
  const timers = useRef<number[]>([]);

  useEffect(
    () => () => {
      timers.current.forEach((t) => window.clearTimeout(t));
    },
    [],
  );

  const { buy } = useBuyNow();
  const { isSoldOut } = useSoldOutSkus();

  const closeWhy = useCallback((priceId: string) => {
    setOpenWhy(null);
    whyButtons.current[priceId]?.focus();
  }, []);


  const updateState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
    const card = el.querySelector<HTMLElement>("[data-shelf-card]");
    const step = card ? card.offsetWidth + 24 : 320;
    setPerPage(Math.max(1, Math.round(el.clientWidth / step)));
    setFirstVisible(Math.min(CARDS.length - 1, Math.round(el.scrollLeft / step)));
  }, []);

  useEffect(() => {
    updateState();
    const el = trackRef.current;
    el?.addEventListener("scroll", updateState, { passive: true });
    window.addEventListener("resize", updateState);
    return () => {
      el?.removeEventListener("scroll", updateState);
      window.removeEventListener("resize", updateState);
    };
  }, [updateState]);

  // One view event per product, when it first becomes visible.
  useEffect(() => {
    const el = trackRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const seen = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const id = (e.target as HTMLElement).dataset["priceId"];
          if (e.isIntersecting && id && !seen.has(id)) {
            seen.add(id);
            trackUi("homepage_edit_product_view", { item_id: id });
          }
        }
      },
      { threshold: 0.5 },
    );
    el.querySelectorAll("[data-shelf-card]").forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  const page = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-shelf-card]");
    const step = card ? card.offsetWidth + 24 : 320;
    const visible = Math.max(1, Math.round(el.clientWidth / step));
    el.scrollBy({ left: dir * step * visible, behavior: "smooth" });
  };

  const handleAdd = (card: (typeof CARDS)[number], soldOut: boolean) => {
    if (soldOut || pending === card.priceId) return;
    setPending(card.priceId);
    trackUi("homepage_edit_quick_add", { item_id: card.priceId });
    try {
      buy({
        priceId: card.priceId,
        name: card.product.name,
        priceLabel: `${card.product.price} AUD`,
        brand: card.product.brand,
        image: card.product.image,
      });
      setAdded(card.priceId);
      setAnnouncement(`${card.product.brand} ${card.product.name} added to your bag.`);
      toast.success("Added to your bag.");
      timers.current.push(
        window.setTimeout(() => {
          setAdded((cur) => (cur === card.priceId ? null : cur));
        }, 2000),
      );
    } catch (err) {
      console.error("[product-shelf] add to bag failed", card.priceId, err);
      setAnnouncement("We couldn't add this product. Please try again.");
      toast.error("We couldn't add this product. Please try again.");
    } finally {
      timers.current.push(window.setTimeout(() => setPending(null), 400));
    }
  };


  const last = Math.min(firstVisible + perPage, CARDS.length);

  return (
    <>
      <section
        aria-labelledby="shelf-heading"
        className="border-b border-border/60 bg-paper text-ink"
      >
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-12 md:py-24">
          {/* Header row */}
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-clay">
                <span className="h-px w-8 bg-clay" />
                The edit
              </p>
              <h2
                id="shelf-heading"
                className="mt-4 font-masthead text-[clamp(1.9rem,3.6vw,2.9rem)] leading-[1.05] tracking-tight"
              >
                A considered starting shelf.
              </h2>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink/70 md:text-base">
                Six Korean skincare essentials selected for their formulation, customer
                relevance and place in a real routine. Start with what your skin needs—not
                what is making the most noise.
              </p>
              <Link
                to="/about"
                className="mt-4 inline-flex items-center gap-2 border-b border-ink/30 pb-0.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
              >
                How the Skin Grocer edit works →
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink/60" aria-live="polite">
                {firstVisible + 1}–{last} of {CARDS.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => page(-1)}
                  disabled={!canPrev}
                  aria-label="Show previous products"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 text-ink transition hover:border-ink disabled:opacity-30 disabled:hover:border-ink/20"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => page(1)}
                  disabled={!canNext}
                  aria-label="Show next products"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 text-ink transition hover:border-ink disabled:opacity-30 disabled:hover:border-ink/20"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Shelf */}
          <div
            ref={trackRef}
            className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {CARDS.map((card, i) => {
              const p = card.product;
              const soldOut = isSoldOut(p.priceId) || Boolean(p.comingSoon);
              const isOpen = openWhy === p.priceId;
              const slug = productSlug(p);
              return (
                <article
                  key={p.priceId}
                  data-shelf-card
                  data-price-id={p.priceId}
                  className="flex w-[80vw] shrink-0 snap-start flex-col border border-border/70 bg-background p-5 sm:w-[60vw] md:w-[46vw] lg:w-[calc((100%-3rem)/3)]"
                >
                  <Link
                    to="/product/$slug"
                    params={{ slug }}
                    onClick={() => trackUi("homepage_edit_product_click", { item_id: p.priceId })}
                    className="group block bg-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
                  >
                    <img
                      src={p.image}
                      alt={`${p.brand} ${p.name}`}
                      loading={i < 3 ? "eager" : "lazy"}
                      width={640}
                      height={640}
                      className="aspect-square w-full object-contain p-5 transition-transform duration-500 ease-out group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                  </Link>

                  <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.24em] text-clay">
                    {p.brand}
                  </p>
                  <h3 className="mt-1.5 font-display text-[1.15rem] leading-snug text-ink">
                    <Link
                      to="/product/$slug"
                      params={{ slug }}
                      onClick={() => trackUi("homepage_edit_product_click", { item_id: p.priceId })}
                      className="focus-visible:underline focus-visible:underline-offset-4 focus-visible:outline-none"
                    >
                      {p.name}
                    </Link>
                  </h3>

                  <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/60">
                    {card.step}
                  </p>
                  <p className="mt-2 text-[13px] leading-relaxed text-ink/75">
                    <span className="text-ink/55">Best for:</span> {card.bestFor}
                  </p>
                  <p className="text-[13px] leading-relaxed text-ink/75">
                    <span className="text-ink/55">Texture:</span> {card.texture}
                  </p>

                  <p className="mt-4 text-[15px] tabular-nums text-ink">{p.price} AUD</p>

                  <div className="mt-4 border-t border-border/70 pt-4">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`why-${p.priceId}`}
                      onClick={() => {
                        const next = isOpen ? null : p.priceId;
                        setOpenWhy(next);
                        if (next) trackUi("homepage_edit_why_chosen_open", { item_id: p.priceId });
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Escape") setOpenWhy(null);
                      }}
                      className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
                    >
                      {isOpen ? "Hide why we chose it" : "Why we chose it →"}
                    </button>

                    {isOpen && (
                      <div
                        id={`why-${p.priceId}`}
                        onKeyDown={(e) => {
                          if (e.key === "Escape") setOpenWhy(null);
                        }}
                        className="mt-3 border border-border/70 bg-secondary/50 p-4"
                      >
                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink/60">
                          Why it made the edit
                        </p>
                        <ul className="mt-2 space-y-2 text-[13px] leading-relaxed text-ink/80">
                          {card.why.map((line) => (
                            <li key={line}>{line}</li>
                          ))}
                        </ul>
                        <Link
                          to="/product/$slug"
                          params={{ slug }}
                          onClick={() => trackUi("homepage_edit_product_click", { item_id: p.priceId })}
                          className="mt-3 inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-ink underline underline-offset-4"
                        >
                          View full product →
                        </Link>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto flex items-center gap-3 pt-5">
                    {soldOut ? (
                      <span className="inline-flex min-h-11 flex-1 items-center justify-center border border-border bg-secondary/60 px-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Sold out
                      </span>
                    ) : (
                      <button
                        type="button"
                        disabled={pending === p.priceId}
                        onClick={() => handleAdd(card, soldOut)}
                        aria-label={`Add ${p.brand} ${p.name} to bag`}
                        className="inline-flex min-h-11 flex-1 items-center justify-center bg-ink px-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-paper transition-opacity hover:opacity-90 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
                      >
                        {pending === p.priceId ? "Adding…" : "Add to bag"}
                      </button>
                    )}
                    <span onClick={() => trackUi("homepage_edit_wishlist", { item_id: p.priceId })}>
                      <WishlistButton
                        productId={p.priceId}
                        productName={`${p.brand} ${p.name}`}
                      />
                    </span>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-8">
            <Link
              to="/shop"
              onClick={() => trackUi("homepage_edit_shop_all_click")}
              className="inline-flex items-center gap-2 border-b border-ink/30 pb-0.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
            >
              Shop the full edit →
            </Link>
          </div>
        </div>

        <p className="sr-only" role="status" aria-live="polite">
          {announcement}
        </p>
      </section>
    </>
  );
}
