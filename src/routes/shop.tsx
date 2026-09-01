import { PageHero } from "@/components/page-hero";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { CompareDrawer, CompareModal, type CompareItem } from "@/components/product-compare";
import { ProductCard } from "@/components/product-card";
import { track, centsToAud } from "@/lib/analytics";
import { productPrice } from "@/lib/shop-catalog";
import {
  AppliedFilters,
  FilterSheet,
  FilterSidebar,
  SortSelect,
} from "@/components/collection-filters";
import {
  buildFacets,
  matchesFilters,
  sortProducts,
  parseParam,
  serialiseParam,
  CATEGORY_VALUES,
  PRICE_BANDS,
  SORT_OPTIONS,
  type Filters,
  type SortValue,
} from "@/lib/collection-filters";
import { SHOP_PRODUCTS } from "@/lib/shop-catalog";

import { Reveal } from "@/components/reveal";
import { KoreaBestsellers } from "@/components/korea-bestsellers";
import { KoreaWatchlist } from "@/components/korea-watchlist";



import { FaqSection } from "@/components/faq-section";
import { SHOP_FAQS, faqJsonLd } from "@/lib/faqs";
import { breadcrumbJsonLd } from "@/lib/breadcrumbs";

const searchSchema = z.object({
  step: z.string().optional(),
  // Keep accepting previously shared URLs while writing the canonical `step` key.
  category: z.string().optional(),
  brand: z.string().optional(),
  concern: z.string().optional(),
  ingredient: z.string().optional(),
  price: z.string().optional(),
  sort: z.string().optional(),
});

export const Route = createFileRoute("/shop")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Shop — Skin Grocer" },
      { name: "description", content: "Browse authentic Korean skincare and premium imports — cleansers, serums, moisturisers, masks and SPF — locally stocked in Australia and dispatched from Melbourne." },
      { property: "og:title", content: "Shop — Skin Grocer" },
      { property: "og:description", content: "Authentic K-beauty, locally stocked in Australia." },
      { property: "og:url", content: "https://skingrocer.com.au/shop" },
    ],
    links: [{ rel: "canonical", href: "https://skingrocer.com.au/shop" }],
    scripts: [
      faqJsonLd(SHOP_FAQS),
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Shop", path: "/shop" },
      ]),
    ],
  }),
  component: Shop,
});

const CONCERN_KEYS = ["hydration", "acne", "pigmentation", "sensitivity", "anti-aging", "barrier"];

function Shop() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [compare, setCompare] = useState<CompareItem[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);

  // Only accept values the catalog actually supports; anything else is ignored.
  const activeFilters: Filters = useMemo(() => {
    const brands = new Set(SHOP_PRODUCTS.map((p) => p.brand.toLowerCase()));
    return {
      category: parseParam(search.step ?? search.category).filter((v) =>
        CATEGORY_VALUES.includes(v as never),
      ) as Filters["category"],
      brand: parseParam(search.brand).filter((v) => brands.has(v.toLowerCase())),
      concern: parseParam(search.concern).filter((v) =>
        CONCERN_KEYS.includes(v),
      ) as Filters["concern"],
      ingredient: parseParam(search.ingredient),
      price: parseParam(search.price).filter((v) =>
        PRICE_BANDS.some((b) => b.value === v),
      ) as Filters["price"],
    };
  }, [search.step, search.category, search.brand, search.concern, search.ingredient, search.price]);

  const sort: SortValue = SORT_OPTIONS.some((o) => o.value === search.sort)
    ? (search.sort as SortValue)
    : "featured";

  const facets = useMemo(() => buildFacets(SHOP_PRODUCTS, activeFilters), [activeFilters]);
  const filteredProducts = useMemo(
    () => SHOP_PRODUCTS.filter((product) => matchesFilters(product, activeFilters)),
    [activeFilters],
  );
  const visibleProducts = useMemo(
    () => sortProducts(filteredProducts, sort),
    [filteredProducts, sort],
  );

  // view_item_list — catalogue attributes only, capped to the first screenful.
  useEffect(() => {
    if (visibleProducts.length === 0) return;
    track("view_item_list", {
      item_list_name: "Shop",
      currency: "AUD",
      items: visibleProducts.slice(0, 24).map((p, index) => ({
        item_id: p.priceId,
        item_name: p.name,
        item_brand: p.brand,
        item_category: p.category,
        price: productPrice(p),
        item_list_name: "Shop",
        index,
      })),
    });
  }, [visibleProducts]);

  const applyFilters = (next: Filters) =>
    navigate({
      search: (prev) => ({
        ...prev,
        step: serialiseParam(next.category),
        category: undefined,
        brand: serialiseParam(next.brand),
        concern: serialiseParam(next.concern),
        ingredient: serialiseParam(next.ingredient),
        price: serialiseParam(next.price),
      }),
    });
  const toggleFilter = (group: keyof Filters, value: string) => {
    const currentValues: readonly string[] = activeFilters[group];
    const nextValues = currentValues.includes(value)
      ? currentValues.filter((current) => current !== value)
      : [...currentValues, value];
    applyFilters({
      ...activeFilters,
      [group]: nextValues,
    } as Filters);
  };
  const clearAll = () =>
    navigate({
      search: (prev) => ({
        step: undefined,
        category: undefined,
        brand: undefined,
        concern: undefined,
        ingredient: undefined,
        price: undefined,
        sort: prev.sort,
      }),
    });
  const countFor = (f: Filters) => SHOP_PRODUCTS.filter((p) => matchesFilters(p, f)).length;

  const toggleCompare = (p: (typeof SHOP_PRODUCTS)[number]) => {
    setCompare((prev) => {
      if (prev.find((x) => x.priceId === p.priceId)) return prev.filter((x) => x.priceId !== p.priceId);
      if (prev.length >= 3) return prev;
      return [...prev, { priceId: p.priceId, name: p.name, brand: p.brand, price: p.price, image: p.image }];
    });
  };

  const filterProps = {
    facets,
    filters: activeFilters,
    sort,
    total: filteredProducts.length,
    countFor,
    onToggle: toggleFilter,
    onChange: applyFilters,
    onSort: (s: SortValue) => navigate({ search: (prev) => ({ ...prev, sort: s === "featured" ? undefined : s }) }),
    onClear: clearAll,
  };


  return (
    <div className="pb-12">
      <PageHero
        eyebrow="The skin edit"
        hangul="컬렉션"
        title="Carefully sourced."
        titleAccent="Clearly verified."
        lede="Premium Korean skincare sourced through established Korean wholesale supply partners, documented by our Melbourne team and made easier to explore by routine step, concern or ingredient."
        cta={{ label: "Find my routine", to: "/consultation" }}
        tone="sage"
        index="01"
        ghost="The Edit"
      />
      <div className="mx-auto max-w-7xl px-6 pt-12">
      <KoreaBestsellers />


      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-y border-border py-4">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground" aria-live="polite">
          {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
        </p>
        <div className="flex items-center gap-6">
          <FilterSheet {...filterProps} />
          <div className="hidden lg:block">
            <SortSelect sort={sort} onSort={filterProps.onSort} />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <AppliedFilters facets={facets} filters={activeFilters} onChange={applyFilters} onClear={clearAll} />
      </div>

      <div className="mt-8 grid gap-x-12 lg:grid-cols-[220px_1fr]">
        <FilterSidebar {...filterProps} />

        <div>
          {filteredProducts.length === 0 ? (
            <div className="border border-border px-8 py-16 text-center">
              <h2 className="font-display text-2xl text-foreground">No products match those filters.</h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
                Remove one or more filters, or use the Routine Finder for a simpler starting point.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <button
                  type="button"
                  onClick={clearAll}
                  className="inline-flex min-h-11 items-center border border-foreground px-6 text-xs uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-secondary"
                >
                  Clear all filters
                </button>
                <Link
                  to="/consultation"
                  className="inline-flex min-h-11 items-center bg-primary px-6 text-xs uppercase tracking-[0.18em] text-primary-foreground"
                >
                  Use the Routine Finder
                </Link>
              </div>

            </div>
          ) : (
            <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
              {visibleProducts.map((p, i) => {
                const isSelected = compare.some((x) => x.priceId === p.priceId);
                const disabled = !isSelected && compare.length >= 3;
                return (
                  <Reveal key={p.priceId} delay={(i % 3) * 60}>
                    <ProductCard
                      product={p}
                      eager={i < 3}
                      overlay={
                        <label
                          className={`inline-flex min-h-9 items-center gap-2 text-[10px] uppercase tracking-[0.18em] ${
                            disabled ? 'opacity-40' : 'cursor-pointer'
                          } ${isSelected ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            disabled={disabled}
                            onChange={() => toggleCompare(p)}
                            className="h-3.5 w-3.5 accent-primary"
                          />
                          Compare
                        </label>
                      }
                    />
                  </Reveal>
                );
              })}
            </div>

          )}
        </div>
      </div>

      <CompareDrawer
        items={compare}
        onRemove={(id) => setCompare((prev) => prev.filter((x) => x.priceId !== id))}
        onClear={() => setCompare([])}
        onOpen={() => setCompareOpen(true)}
      />
      <CompareModal items={compare} open={compareOpen} onClose={() => setCompareOpen(false)} />

      <KoreaWatchlist />

      <FaqSection
        id="shopping-faq"
        eyebrow="Buying guide"
        title="What to buy, in what order, and what not to mix."
        intro="Everything you need to choose between a toner, an essence and an ampoule — and how to layer them safely."
        items={SHOP_FAQS}
      />
    </div>
    </div>
  );
}
