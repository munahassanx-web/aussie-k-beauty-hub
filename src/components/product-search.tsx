import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { SHOP_PRODUCTS } from "@/lib/shop-catalog";
import { productSlug } from "@/lib/product-detail";

type Props = {
  open: boolean;
  onClose: () => void;
};

/**
 * Full-catalog product search overlay.
 * Matches on product name, brand and category as the user types.
 */
export function ProductSearchOverlay({ open, onClose }: Props) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const terms = q.split(/\s+/);
    return SHOP_PRODUCTS.filter((p) => {
      const haystack = `${p.brand} ${p.name} ${p.category}`.toLowerCase();
      return terms.every((t) => haystack.includes(t));
    }).slice(0, 24);
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Search products">
      <button
        type="button"
        aria-label="Close search"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-ink/50 backdrop-blur-sm"
      />
      <div className="relative mx-auto mt-[10vh] w-[92vw] max-w-2xl overflow-hidden rounded-2xl border border-border bg-background shadow-[0_40px_80px_-30px_rgba(0,0,0,0.4)]">
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="shrink-0 text-muted-foreground">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="search"
            placeholder="Search products, brands or categories…"
            aria-label="Search products"
            className="w-full bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground/70"
          />
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground hover:text-primary"
          >
            Close
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {query.trim() === "" ? (
            <p className="px-5 py-8 text-sm text-muted-foreground">
              Start typing to search all {SHOP_PRODUCTS.length} products — try “Torriden”, “sunscreen” or “toner”.
            </p>
          ) : results.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="font-display text-xl text-foreground">No results found</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Nothing matches “{query.trim()}”. Try a brand name, a product type, or{" "}
                <Link to="/shop" onClick={onClose} className="text-primary underline underline-offset-4">
                  browse the full shop
                </Link>
                .
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border/70">
              {results.map((p) => (
                <li key={p.priceId}>
                  <Link
                    to="/product/$slug"
                    params={{ slug: productSlug(p) }}
                    onClick={onClose}
                    className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-secondary"
                  >
                    <img
                      src={p.image}
                      alt={`${p.brand} ${p.name}`}
                      loading="lazy"
                      className="h-14 w-14 shrink-0 rounded-lg bg-secondary object-cover"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-clay">{p.brand}</span>
                      <span className="block truncate text-sm text-foreground">{p.name}</span>
                      <span className="block text-xs text-muted-foreground">{p.category}</span>
                    </span>
                    <span className="shrink-0 text-sm font-medium text-foreground">{p.price}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
