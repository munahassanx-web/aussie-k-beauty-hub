import { Link } from '@tanstack/react-router';
import { useBuyNow } from '@/hooks/use-buy-now';
import { WishlistButton } from '@/components/wishlist-button';
import { productSlug, routineStepLabel } from '@/lib/product-detail';
import type { ShopProduct } from '@/lib/shop-catalog';

/** Pack size printed in the product name, when the brand states one. */
export function productSize(p: ShopProduct): string | null {
  return p.name.match(/\b\d+(?:\.\d+)?\s?(?:ml|g|pcs?|pads?)\b/i)?.[0] ?? null;
}

/** Product name with the trailing size stripped, so the card can show it separately. */
function displayName(p: ShopProduct): string {
  const size = productSize(p);
  if (!size) return p.name;
  return p.name.replace(new RegExp(`\\s*${size.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}\\s*$`, 'i'), '').trim() || p.name;
}

type Props = {
  product: ShopProduct;
  /** Optional slot rendered under the image (e.g. a compare control). */
  overlay?: React.ReactNode;
  /** Hide the quick-add row — used in tight cross-sell grids. */
  compact?: boolean;
  eager?: boolean;
};

/**
 * The single product card used across shop, brand, concern and cross-sell grids.
 * Only shows attributes that genuinely exist in the catalog: brand, name, size,
 * routine step, price and the brand-supplied tag.
 */
export function ProductCard({ product: p, overlay, compact = false, eager = false }: Props) {
  const { buy } = useBuyNow();
  const size = productSize(p);
  const slug = productSlug(p);

  return (
    <article className="group relative flex h-full flex-col">
      <div className="relative overflow-hidden bg-secondary">
        <Link
          to="/product/$slug"
          params={{ slug }}
          tabIndex={-1}
          aria-hidden="true"
          className="block aspect-square"
        >
          <img
            src={p.image}
            alt={`${p.brand} ${p.name}`}
            loading={eager ? 'eager' : 'lazy'}
            width={1024}
            height={1024}
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
          />
        </Link>

        {p.tag && (
          <span className="absolute left-0 top-0 bg-background/92 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-foreground backdrop-blur">
            {p.tag}
          </span>
        )}
        {p.comingSoon && (
          <span className="absolute left-0 bottom-0 bg-background/92 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground backdrop-blur">
            Arriving soon
          </span>
        )}

        <WishlistButton
          productId={p.priceId}
          productName={`${p.brand} ${p.name}`}
          className="absolute right-2 top-2 z-10"
        />
        {overlay}
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{p.brand}</p>
        <h3 className="mt-1.5 font-display text-[1.05rem] leading-snug text-foreground">
          <Link
            to="/product/$slug"
            params={{ slug }}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:underline focus-visible:underline-offset-4"
          >
            {displayName(p)}
          </Link>
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          {routineStepLabel(p)}
          {size ? ` · ${size}` : ''}
        </p>

        <div className="mt-4 flex items-baseline justify-between gap-3 border-t border-border/70 pt-3">
          <span className="text-sm tabular-nums text-foreground">{p.price}</span>
          {!compact &&
            (p.comingSoon ? (
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Not yet orderable
              </span>
            ) : (
              <button
                type="button"
                onClick={() => buy({ priceId: p.priceId, name: p.name, priceLabel: `${p.price} AUD` })}
                aria-label={`Add ${p.brand} ${p.name} to basket`}
                className="relative z-10 -my-1 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-primary underline-offset-4 transition-opacity hover:underline focus-visible:underline"
              >
                Add to basket
              </button>
            ))}
        </div>
      </div>
    </article>
  );
}
