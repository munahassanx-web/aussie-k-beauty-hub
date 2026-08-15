import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { useBuyNow } from "@/hooks/use-buy-now";
import { CompareDrawer, CompareModal, type CompareItem } from "@/components/product-compare";
import { SHOP_PRODUCTS, restockPriceIdFor, type Category } from "@/lib/shop-catalog";

const searchSchema = z.object({
  category: z.enum(["all", "cleanse", "tone", "treat", "moisturise", "protect", "masks"]).optional(),
  brand: z.string().optional(),
  concern: z.enum(["hydration", "acne", "pigmentation", "sensitivity", "anti-aging", "barrier"]).optional(),
});

export const Route = createFileRoute("/shop")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Shop — Skin Grocer" },
      { name: "description", content: "Browse authentic Korean skincare and premium imports — cleansers, serums, moisturisers, masks and SPF — locally stocked with next-day delivery." },
      { property: "og:title", content: "Shop — Skin Grocer" },
      { property: "og:description", content: "Authentic K-beauty, locally stocked in Australia." },
      { property: "og:url", content: "/shop" },
    ],
    links: [{ rel: "canonical", href: "/shop" }],
  }),
  component: Shop,
});

const items = SHOP_PRODUCTS;


const filters = ["all", "cleanse", "tone", "treat", "moisturise", "protect", "masks"] as const;
const filterLabels: Record<(typeof filters)[number], string> = {
  all: "All", cleanse: "Cleanse", tone: "Tone", treat: "Treat",
  moisturise: "Moisturise", protect: "Protect", masks: "Masks",
};
const catMap: Record<Exclude<(typeof filters)[number], "all">, Category> = {
  cleanse: "Cleanse", tone: "Tone", treat: "Treat",
  moisturise: "Moisturise", protect: "Protect", masks: "Masks",
};

function Shop() {
  const { category = "all", brand, concern } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { buy, modal } = useBuyNow();
  const [compare, setCompare] = useState<CompareItem[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);

  const toggleCompare = (p: (typeof items)[number]) => {
    setCompare((prev) => {
      if (prev.find((x) => x.priceId === p.priceId)) return prev.filter((x) => x.priceId !== p.priceId);
      if (prev.length >= 3) return prev;
      return [...prev, { priceId: p.priceId, name: p.name, brand: p.brand, price: p.price, image: p.image }];
    });
  };

  const visible = useMemo(() => {
    return items.filter((p) => {
      if (category !== "all" && p.category !== catMap[category as Exclude<(typeof filters)[number], "all">]) return false;
      if (brand && p.brand.toLowerCase() !== brand.toLowerCase()) return false;
      if (concern && !p.concerns.includes(concern)) return false;
      return true;
    });
  }, [category, brand, concern]);

  const activeLabels = [
    brand ? { label: `Brand: ${brand}`, clear: { brand: undefined } } : null,
    concern ? { label: `Concern: ${concern}`, clear: { concern: undefined } } : null,
  ].filter(Boolean) as { label: string; clear: Record<string, undefined> }[];


  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.2em] text-primary">The shop</p>
        <h1 className="mt-3 text-5xl text-foreground md:text-6xl">Carefully sourced. <em className="not-italic text-primary">Always authentic.</em></h1>
        <p className="mt-5 text-lg text-muted-foreground">
          Every product on Skin Grocer is sourced directly through verified
          brand partners and stocked here in Australia for next-day delivery to metro
          and most regional areas — remote postcodes may take 1–2 extra days.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        {filters.map((c) => {
          const isActive = c === category;
          return (
            <button
              key={c}
              onClick={() => navigate({ search: (prev: z.infer<typeof searchSchema>) => ({ ...prev, category: c === "all" ? undefined : c }) })}
              className={`rounded-full border px-5 py-2 text-sm transition-colors ${isActive ? "border-primary bg-primary text-primary-foreground" : "border-border text-foreground hover:bg-secondary"}`}
            >
              {filterLabels[c]}
            </button>
          );
        })}
      </div>

      {activeLabels.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {activeLabels.map((a) => (
            <button
              key={a.label}
              onClick={() => navigate({ search: (prev: z.infer<typeof searchSchema>) => ({ ...prev, ...a.clear }) })}
              className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs text-foreground hover:bg-secondary/80"
            >
              {a.label} <span className="text-muted-foreground">×</span>
            </button>
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <p className="mt-16 text-muted-foreground">No products match those filters. <button onClick={() => navigate({ search: {} })} className="text-primary underline">Clear filters</button>.</p>
      ) : (
        <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((p) => {
            const isSelected = compare.some((x) => x.priceId === p.priceId);
            const disabled = !isSelected && compare.length >= 3;
            return (
            <div key={p.name} className="group">
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary">
                <Link to="/product/$slug" params={{ slug: productSlug(p) }} aria-label={`View ${p.brand} ${p.name}`}>
                  <img src={p.image} alt={p.name} loading="lazy" width={1024} height={1024} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </Link>
                {p.tag && (
                  <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-primary backdrop-blur">{p.tag}</span>
                )}
                <label className={`absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground backdrop-blur ${disabled ? "opacity-40" : "cursor-pointer"}`}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    disabled={disabled}
                    onChange={() => toggleCompare(p)}
                    className="h-3.5 w-3.5 accent-primary"
                  />
                  Compare
                </label>
              </div>
              <div className="mt-4">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{p.brand}</p>
                <Link to="/product/$slug" params={{ slug: productSlug(p) }} className="mt-1 block font-display text-lg text-foreground hover:text-primary">{p.name}</Link>

                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-foreground">{p.price}</span>
                  <button
                    onClick={() => buy({ priceId: p.priceId, name: p.name, priceLabel: `${p.price} AUD` })}
                    className="text-xs font-medium uppercase tracking-wider text-primary hover:underline"
                  >
                    Add to basket →
                  </button>
                </div>
                {restockPriceIdFor(p.priceId) && (
                  <button
                    onClick={() => buy({ priceId: restockPriceIdFor(p.priceId)!, name: p.name, priceLabel: `${p.price} AUD` })}
                    className="mt-2 w-full rounded-full border border-border py-1.5 text-[11px] uppercase tracking-wider text-foreground hover:bg-secondary"
                  >
                    Subscribe & save 15%
                  </button>
                )}
              </div>
            </div>
            );
          })}
        </div>
      )}
      {modal}
      <CompareDrawer
        items={compare}
        onRemove={(id) => setCompare((prev) => prev.filter((x) => x.priceId !== id))}
        onClear={() => setCompare([])}
        onOpen={() => setCompareOpen(true)}
      />
      <CompareModal items={compare} open={compareOpen} onClose={() => setCompareOpen(false)} />


      <div className="mt-20 rounded-3xl bg-secondary/60 p-10 text-center md:p-16">
        <h2 className="text-3xl text-foreground md:text-4xl">Not sure where to start?</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Tell us a bit about your skin and we'll build a routine for you — from your first cleanse to your final SPF.
        </p>
        <Link to="/consultation" className="mt-6 inline-flex rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground hover:opacity-90">
          Take the 2-minute quiz
        </Link>
      </div>
    </div>
  );
}
