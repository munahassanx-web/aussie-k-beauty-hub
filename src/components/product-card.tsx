import { Link } from '@tanstack/react-router';
import { useBuyNow } from '@/hooks/use-buy-now';
import { useSoldOutSkus } from '@/hooks/use-stock';
import { WishlistButton } from '@/components/wishlist-button';
import { productSlug, routineStepLabel } from '@/lib/product-detail';
import { productPrice } from '@/lib/shop-catalog';
import type { ShopProduct } from '@/lib/shop-catalog';
import { track } from '@/lib/analytics';

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
  /** Optional secondary control rendered under the card (e.g. compare). */
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
  const { isSoldOut } = useSoldOutSkus();
  const soldOut = isSoldOut(p.priceId);
  const size = productSize(p);
  const slug = productSlug(p);
  const unavailable = p.comingSoon || soldOut;
  // One badge only — availability outranks the brand-supplied tag.
  const badge = p.comingSoon ? 'Arriving soon' : soldOut ? 'Out of stock' : p.tag || null;

  return (
    <article className="group relative flex h-full flex-col">
      <div className="relative overflow-hidden bg-secondary">
        <Link
          to="/product/$slug"
          params={{ slug }}
          tabIndex={-1}
          aria-hidden="true"
          className="block aspect-square p-8 sm:p-10"
        >
          <img
            src={p.image}
            alt={`${p.brand} ${p.name}`}
            loading={eager ? 'eager' : 'lazy'}
            width={1024}
            height={1024}
            className="h-full w-full object-contain transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
          />
        </Link>

        {badge && (
          <span
            className={`absolute left-3 top-3 bg-background px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.2em] ${
              unavailable ? 'text-muted-foreground' : 'text-foreground'
            }`}
          >
            {badge}
          </span>
        )}

        <WishlistButton
          productId={p.priceId}
          productName={`${p.brand} ${p.name}`}
          className="absolute right-2 top-2 z-10"
        />
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{p.brand}</p>
        <h3 className="mt-1.5 font-display text-[1.05rem] leading-snug text-foreground">
          <Link
            to="/product/$slug"
            params={{ slug }}
            onClick={() =>
              track('select_item', {
                currency: 'AUD',
                items: [
                  {
                    item_id: p.priceId,
                    item_name: p.name,
                    item_brand: p.brand,
                    item_category: p.category,
                    price: productPrice(p),
                  },
                ],
              })
            }
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:underline focus-visible:underline-offset-4"
          >
            {displayName(p)}
          </Link>
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          {routineStepLabel(p)}
          {size ? ` · ${size}` : ''}
        </p>

        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between gap-3 border-t border-border/70 pt-3">
            <span className="text-sm tabular-nums text-foreground">{p.price}</span>
            {!compact &&
              (unavailable ? (
                <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {p.comingSoon ? 'Not yet orderable' : 'Out of stock'}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => buy({ priceId: p.priceId, name: p.name, priceLabel: `${p.price} AUD` })}
                  aria-label={`Add ${p.brand} ${p.name} to bag`}
                  className="relative z-10 inline-flex min-h-9 items-center rounded-[2px] border border-foreground px-3.5 text-[10px] font-medium uppercase tracking-[0.18em] text-foreground transition-colors duration-200 hover:bg-foreground hover:text-background focus-visible:bg-foreground focus-visible:text-background"
                >
                  Add to bag
                </button>
              ))}
          </div>
          {overlay && <div className="relative z-10 pt-2.5">{overlay}</div>}
        </div>
      </div>
    </article>
  );
}

