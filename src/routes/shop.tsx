import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { CompareDrawer, CompareModal, type CompareItem } from "@/components/product-compare";
import { ProductCard } from "@/components/product-card";
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
  CATEGORY_VALUES,
  PRICE_BANDS,
  SORT_OPTIONS,
  type Filters,
  type SortValue,
} from "@/lib/collection-filters";
import { SHOP_PRODUCTS } from "@/lib/shop-catalog";
import { Reveal } from "@/components/reveal";

import { FaqSection } from "@/components/faq-section";
import { SHOP_FAQS, faqJsonLd } from "@/lib/faqs";

const searchSchema = z.object({
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
    scripts: [faqJsonLd(SHOP_FAQS)],
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
  const filters: Filters = useMemo(
    () => ({
      category: CATEGORY_VALUES.includes(search.category as never)
        ? (search.category as Filters["category"])
        : undefined,
      brand: SHOP_PRODUCTS.some((p) => p.brand.toLowerCase() === search.brand?.toLowerCase())
        ? search.brand
        : undefined,
      concern: CONCERN_KEYS.includes(search.concern ?? "")
        ? (search.concern as Filters["concern"])
        : undefined,
      ingredient: search.ingredient,
      price: PRICE_BANDS.some((b) => b.value === search.price)
        ? (search.price as Filters["price"])
        : undefined,
    }),
    [search.category, search.brand, search.concern, search.ingredient, search.price],
  );

  const sort: SortValue = SORT_OPTIONS.some((o) => o.value === search.sort)
    ? (search.sort as SortValue)
    : "featured";

  const facets = useMemo(() => buildFacets(SHOP_PRODUCTS, filters), [filters]);
  const visible = useMemo(
    () => sortProducts(SHOP_PRODUCTS.filter((p) => matchesFilters(p, filters)), sort),
    [filters, sort],
  );

  const patch = (next: Partial<Record<keyof Filters, string | undefined>>) =>
    navigate({ search: (prev) => ({ ...prev, ...next }) });
  const clearAll = () => navigate({ search: (prev) => ({ sort: prev.sort }) });

  const toggleCompare = (p: (typeof SHOP_PRODUCTS)[number]) => {
    setCompare((prev) => {
      if (prev.find((x) => x.priceId === p.priceId)) return prev.filter((x) => x.priceId !== p.priceId);
      if (prev.length >= 3) return prev;
      return [...prev, { priceId: p.priceId, name: p.name, brand: p.brand, price: p.price, image: p.image }];
    });
  };

  const filterProps = {
    facets,
    filters,
    sort,
    total: visible.length,
    onChange: patch,
    onSort: (s: SortValue) => navigate({ search: (prev) => ({ ...prev, sort: s === "featured" ? undefined : s }) }),
    onClear: clearAll,
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <header className="max-w-2xl">
        <p className="eyebrow eyebrow-rule">The skin edit</p>
        <h1 className="display-section mt-4 text-foreground">
          Carefully sourced. <em className="not-italic text-primary">Always authentic.</em>
        </h1>
        <p className="lede mt-5">
          Every product is sourced through verified brand channels and held in our Melbourne
          warehouse — filter by routine step, concern or ingredient to narrow the range.
        </p>
      </header>

      {/* Toolbar */}
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-y border-border py-4">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground" aria-live="polite">
          {visible.length} {visible.length === 1 ? "product" : "products"}
        </p>
        <div className="flex items-center gap-6">
          <FilterSheet {...filterProps} />
          <div className="hidden lg:block">
            <SortSelect sort={sort} onSort={filterProps.onSort} />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <AppliedFilters facets={facets} filters={filters} onChange={patch} onClear={clearAll} />
      </div>

      <div className="mt-8 grid gap-x-12 lg:grid-cols-[220px_1fr]">
        <FilterSidebar {...filterProps} />

        <div>
          {visible.length === 0 ? (
            <div className="border border-border px-8 py-16 text-center">
              <h2 className="font-display text-2xl text-foreground">Nothing matches that combination</h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
                Try removing one of your filters — the range is small and deliberately curated.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <AppliedFilters facets={facets} filters={filters} onChange={patch} onClear={clearAll} />
              </div>
              <button
                type="button"
                onClick={clearAll}
                className="mt-6 inline-flex min-h-11 items-center border border-foreground px-6 text-xs uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-secondary"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map((p, i) => {
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

      <FaqSection
        id="shopping-faq"
        eyebrow="Buying guide"
        title="What to buy, in what order, and what not to mix."
        intro="Everything you need to choose between a toner, an essence and an ampoule — and how to layer them safely."
        items={SHOP_FAQS}
      />
    </div>
  );
}
