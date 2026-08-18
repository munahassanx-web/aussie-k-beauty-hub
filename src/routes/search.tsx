import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { ProductCard } from "@/components/product-card";
import { ConsultationNudge } from "@/components/product-search";
import { Reveal } from "@/components/reveal";
import { CATALOG_SIZE, isBroadIntent, searchCatalog } from "@/lib/product-search";
import { sortProducts, SORT_OPTIONS, type SortValue } from "@/lib/collection-filters";

const searchSchema = z.object({
  q: z.string().optional(),
  sort: z.string().optional(),
});

const SORTS = [{ value: "relevance", label: "Relevance" }, ...SORT_OPTIONS.filter((o) => o.value !== "featured")];

export const Route = createFileRoute("/search")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Search — Skin Grocer" },
      {
        name: "description",
        content:
          "Search the full Skin Grocer range of authentic Korean skincare by product, brand, routine step or skin concern. Locally stocked in Australia, dispatched from Melbourne.",
      },
      { property: "og:title", content: "Search — Skin Grocer" },
      { property: "og:description", content: "Find the right Korean skincare by name, brand, step or concern." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:url", content: "https://skingrocer.com.au/search" },
      // Query URLs are personal navigation state, not indexable pages.
      { name: "robots", content: "noindex, follow" },
    ],
    links: [{ rel: "canonical", href: "https://skingrocer.com.au/search" }],
  }),
  component: SearchPage,
});

function SearchPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const query = (search.q ?? "").slice(0, 120);
  const sort = SORTS.some((s) => s.value === search.sort) ? (search.sort as string) : "relevance";

  const [draft, setDraft] = useState(query);

  const results = useMemo(() => searchCatalog(query), [query]);

  const products = useMemo(() => {
    const list = results.map((r) => r.product);
    return sort === "relevance" ? list : sortProducts(list, sort as SortValue);
  }, [results, sort]);

  const contextBySlug = useMemo(
    () => new Map(results.map((r) => [r.product.priceId, r.context])),
    [results],
  );

  const broad = isBroadIntent(query);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
      <Reveal>
        <header>
          <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Search</p>
          <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3rem)] leading-tight text-foreground">
            {query ? <>Results for “{query}”</> : <>Search the range</>}
          </h1>

          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ search: (prev) => ({ ...prev, q: draft.trim() || undefined }) });
            }}
            className="mt-6 flex max-w-xl items-center gap-3 border-b border-border pb-2"
          >
            <label htmlFor="search-q" className="sr-only">
              Search products
            </label>
            <input
              id="search-q"
              type="search"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              enterKeyHint="search"
              placeholder="Product, brand, step or concern…"
              className="min-h-11 w-full bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground/70"
            />
            <button
              type="submit"
              className="min-h-11 shrink-0 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary underline-offset-4 hover:underline"
            >
              Search
            </button>
          </form>
        </header>
      </Reveal>

      <div
        role="status"
        aria-live="polite"
        className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4"
      >
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {query
            ? `${products.length} ${products.length === 1 ? "product" : "products"}`
            : `${CATALOG_SIZE} products in the range`}
        </p>
        {products.length > 1 && (
          <label className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            <span className="uppercase tracking-[0.18em]">Sort</span>
            <select
              value={sort}
              onChange={(e) =>
                navigate({ search: (prev) => ({ ...prev, sort: e.target.value }) })
              }
              className="min-h-11 border-b border-border bg-transparent py-1 pr-6 text-sm text-foreground outline-none focus-visible:border-primary"
            >
              {SORTS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {query === "" ? (
        <EmptyState
          title="Start with a product, a brand or how your skin feels"
          body="Try “Torriden”, “sunscreen”, “dry skin” or “breakouts”."
        />
      ) : products.length === 0 ? (
        <EmptyState
          title={`Nothing in the range matched “${query}”`}
          body="Everything we stock is listed below — or let the consultation narrow it down for you."
        />
      ) : (
        <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
          {products.map((p, i) => (
            <li key={p.priceId}>
              <ProductCard product={p} eager={i < 4} />
              <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                {contextBySlug.get(p.priceId)}
              </p>
            </li>
          ))}
        </ul>
      )}

      {(broad || products.length === 0) && (
        <div className="mt-12 overflow-hidden rounded-2xl border border-border">
          <ConsultationNudge />
        </div>
      )}
    </div>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="mt-10 border-t border-border pt-10">
      <h2 className="font-display text-2xl text-foreground">{title}</h2>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">{body}</p>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:gap-8">
        <Link
          to="/shop"
          className="inline-flex min-h-11 items-center border-b border-border text-sm text-foreground hover:border-primary hover:text-primary"
        >
          Shop all {CATALOG_SIZE} products
        </Link>
        <Link
          to="/skin-concerns"
          className="inline-flex min-h-11 items-center border-b border-border text-sm text-foreground hover:border-primary hover:text-primary"
        >
          Shop by concern
        </Link>
        <Link
          to="/consultation"
          className="inline-flex min-h-11 items-center border-b border-border text-sm text-foreground hover:border-primary hover:text-primary"
        >
          Take the skin consultation
        </Link>
      </div>
    </div>
  );
}
