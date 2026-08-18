import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  BRAND_SHORTCUTS,
  CATALOG_SIZE,
  CATEGORY_SHORTCUTS,
  CONCERN_SHORTCUTS,
  isBroadIntent,
  searchCatalog,
} from "@/lib/product-search";

type Props = {
  open: boolean;
  onClose: () => void;
};

const PREVIEW_LIMIT = 6;

/**
 * Global search overlay.
 *
 * Matching lives in `@/lib/product-search` so the overlay and the `/search`
 * results page can never disagree. Before typing, the overlay shows real
 * catalog shortcuts (category / concern / brand with live counts) rather than
 * invented "popular" searches.
 */
export function ProductSearchOverlay({ open, onClose }: Props) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    setQuery("");
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    // Lock the page behind the overlay without shifting layout.
    const { overflow, paddingRight } = document.body.style;
    const gutter = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (gutter > 0) document.body.style.paddingRight = `${gutter}px`;
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [open, onClose]);

  const trimmed = query.trim();
  const all = useMemo(() => (trimmed ? searchCatalog(trimmed) : []), [trimmed]);
  const results = all.slice(0, PREVIEW_LIMIT);
  const broad = trimmed ? isBroadIntent(trimmed) : false;

  const goToResults = useCallback(() => {
    if (!trimmed) return;
    onClose();
    navigate({ to: "/search", search: { q: trimmed, sort: "relevance" } });
  }, [navigate, onClose, trimmed]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Search products">
      <button
        type="button"
        aria-label="Close search"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-ink/50 backdrop-blur-sm"
      />
      <div className="relative mx-auto mt-[8vh] w-[94vw] max-w-2xl overflow-hidden rounded-2xl border border-border bg-background shadow-[0_40px_80px_-30px_rgba(0,0,0,0.4)]">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            goToResults();
          }}
          className="flex items-center gap-3 border-b border-border px-5 py-4"
        >
          <SearchGlyph />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="search"
            enterKeyHint="search"
            autoComplete="off"
            placeholder="Search products, brands or concerns…"
            aria-label="Search products"
            className="min-h-11 w-full bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground/70"
          />
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 shrink-0 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-primary"
          >
            Close
          </button>
        </form>

        <p className="sr-only" role="status" aria-live="polite">
          {trimmed
            ? `${all.length} ${all.length === 1 ? "product matches" : "products match"} ${trimmed}`
            : ""}
        </p>

        <div className="max-h-[70vh] overflow-y-auto overscroll-contain">
          {trimmed === "" ? (
            <div className="space-y-6 px-5 py-6">
              <Shortcuts
                title="Shop by step"
                items={CATEGORY_SHORTCUTS}
                onNavigate={onClose}
              />
              <Shortcuts title="Shop by concern" items={CONCERN_SHORTCUTS} onNavigate={onClose} />
              <Shortcuts title="Brands we stock" items={BRAND_SHORTCUTS} onNavigate={onClose} />
              <p className="border-t border-border/70 pt-4 text-xs text-muted-foreground">
                Or type anything — {CATALOG_SIZE} products, searchable by name, brand, step or how
                your skin feels.
              </p>
            </div>
          ) : all.length === 0 ? (
            <ZeroResults query={trimmed} onNavigate={onClose} />
          ) : (
            <>
              <ul className="divide-y divide-border/70">
                {results.map((r) => (
                  <li key={r.product.priceId}>
                    <Link
                      to="/product/$slug"
                      params={{ slug: r.slug }}
                      onClick={onClose}
                      className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-secondary"
                    >
                      <img
                        src={r.product.image}
                        alt=""
                        loading="lazy"
                        width={56}
                        height={56}
                        className="h-14 w-14 shrink-0 rounded-lg bg-secondary object-cover"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-clay">
                          {r.product.brand}
                        </span>
                        <span className="block truncate text-sm text-foreground">{r.product.name}</span>
                        <span className="block text-xs text-muted-foreground">
                          {r.context}
                          {r.product.comingSoon ? " · Arriving soon" : ""}
                        </span>
                      </span>
                      <span className="shrink-0 text-sm tabular-nums text-foreground">
                        {r.product.price}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="border-t border-border px-5 py-4">
                <button
                  type="button"
                  onClick={goToResults}
                  className="min-h-11 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary underline-offset-4 hover:underline"
                >
                  View all {all.length} {all.length === 1 ? "result" : "results"}
                </button>
              </div>

              {broad && <ConsultationNudge onNavigate={onClose} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Shortcuts({
  title,
  items,
  onNavigate,
}: {
  title: string;
  items: Array<{ label: string; count: number; search: Record<string, string> }>;
  onNavigate: () => void;
}) {
  return (
    <div>
      <h2 className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{title}</h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item.label}>
            <Link
              to="/shop"
              search={item.search as never}
              onClick={onNavigate}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-sm text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {item.label}
              <span className="text-xs tabular-nums text-muted-foreground">{item.count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ZeroResults({ query, onNavigate }: { query: string; onNavigate: () => void }) {
  return (
    <div className="px-5 py-8">
      <p className="font-display text-xl text-foreground">Nothing matched “{query}”</p>
      <p className="mt-2 text-sm text-muted-foreground">
        Try a brand, a product type like “serum”, or describe your skin — “dry”, “breakouts”,
        “redness”.
      </p>
      <div className="mt-5 flex flex-col gap-2">
        <Link
          to="/shop"
          onClick={onNavigate}
          className="inline-flex min-h-11 items-center border-b border-border text-sm text-foreground hover:border-primary hover:text-primary"
        >
          Shop all {CATALOG_SIZE} products
        </Link>
        <Link
          to="/skin-concerns"
          onClick={onNavigate}
          className="inline-flex min-h-11 items-center border-b border-border text-sm text-foreground hover:border-primary hover:text-primary"
        >
          Shop by concern
        </Link>
        <Link
          to="/consultation"
          onClick={onNavigate}
          className="inline-flex min-h-11 items-center border-b border-border text-sm text-foreground hover:border-primary hover:text-primary"
        >
          Take the skin consultation
        </Link>
      </div>
    </div>
  );
}

export function ConsultationNudge({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="border-t border-border bg-cream/50 px-5 py-4">
      <p className="text-sm text-foreground">Not sure what your skin actually needs?</p>
      <Link
        to="/consultation"
        onClick={onNavigate}
        className="mt-1 inline-flex min-h-11 items-center text-[11px] font-semibold uppercase tracking-[0.18em] text-primary underline-offset-4 hover:underline"
      >
        Take the skin consultation
      </Link>
    </div>
  );
}

function SearchGlyph() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
      className="shrink-0 text-muted-foreground"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}
