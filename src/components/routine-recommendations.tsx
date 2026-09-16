import { useEffect, useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { WishlistButton } from '@/components/wishlist-button';
import { useBuyNow } from '@/hooks/use-buy-now';
import { useSoldOutSkus } from '@/hooks/use-stock';
import { formatAud, useCart } from '@/lib/cart';
import { catalogEntryFor, isPurchasable, priceToCents } from '@/lib/shop-catalog';
import type { ShopProduct } from '@/lib/shop-catalog';
import {
  ROUTINE_STEP_NAME,
  ROUTINE_STEP_NUMBER,
  ROUTINE_SUNSCREEN_NOTE,
  productSlug,
  routineRecommendations,
} from '@/lib/product-detail';

/**
 * Recommendation-card buy control. Uses the same shared cart action
 * (`useBuyNow` → `useCart`) as the primary product-page button; there is no
 * second cart implementation and no visual-only state.
 */
function RecommendationAddButton({
  product,
  outOfStock,
}: {
  product: ShopProduct;
  outOfStock: boolean;
}) {
  const { buy } = useBuyNow();
  const cart = useCart();
  const [busy, setBusy] = useState(false);
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const sellable = isPurchasable(product.priceId) && !outOfStock;
  const disabled = !sellable || !cart.ready || busy || added;

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (disabled) return;
    setBusy(true);
    const didAdd = buy({
      priceId: product.priceId,
      name: product.name,
      priceLabel: `${product.price} AUD`,
      brand: product.brand,
      image: product.image,
    });
    setBusy(false);
    if (!didAdd) return;
    setAdded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1800);
  }

  if (!isPurchasable(product.priceId)) return null;

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        aria-label={`Add ${product.brand} ${product.name} to bag`}
        aria-busy={busy}
        className="min-h-11 w-full rounded-[2px] bg-foreground px-4 text-[11px] font-medium uppercase tracking-[0.18em] text-background transition-colors hover:bg-foreground/85 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60"
      >
        {outOfStock ? 'Out of stock' : !cart.ready ? 'Loading…' : added ? 'Added' : 'Add to bag'}
      </button>
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {added ? `${product.brand} ${product.name} added to bag` : ''}
      </span>
    </>
  );
}

/**
 * "Complete your routine" — at most three complementary products, one per
 * routine step, shown in chronological routine order. Never recommends the
 * current product, a second product from the same step, or a sunscreen.
 */
export function RoutineRecommendations({ product }: { product: ShopProduct }) {
  const { isSoldOut } = useSoldOutSkus();
  const { buy } = useBuyNow();
  const cart = useCart();
  const trackRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(0);
  const [bundleBusy, setBundleBusy] = useState(false);
  const [bundleAdded, setBundleAdded] = useState(false);
  const [bundleError, setBundleError] = useState('');

  const recommendations = routineRecommendations(product).filter(
    (r) => !isSoldOut(r.product.priceId),
  );
  if (recommendations.length === 0) return null;

  const currentStepNumber = ROUTINE_STEP_NUMBER[product.category];
  const currentStepName = ROUTINE_STEP_NAME[product.category];

  // Canonical catalogue records, resolved by stable price/SKU id — the same
  // records the cart itself uses.
  const bundleEntries = recommendations.map((r) => ({
    product: r.product,
    entry: catalogEntryFor(r.product.priceId),
  }));
  const allInStock =
    recommendations.length === 3 &&
    bundleEntries.every(
      ({ product: p, entry }) =>
        Boolean(entry) &&
        isPurchasable(p.priceId) &&
        !isSoldOut(p.priceId) &&
        (entry?.unitCents || priceToCents(p.price ?? '')) > 0,
    );
  const totalCents = bundleEntries.reduce(
    (sum, { product: p, entry }) => sum + (entry?.unitCents || priceToCents(p.price ?? '')),
    0,
  );

  function onScroll() {
    const el = trackRef.current;
    if (!el) return;
    const width = el.clientWidth || 1;
    setVisible(Math.min(recommendations.length - 1, Math.round(el.scrollLeft / width)));
  }

  function addAllThree(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (bundleBusy || bundleAdded || !cart.ready) return;
    setBundleError('');
    // Resolve and check everything before adding anything, so a problem can
    // never leave a half-filled bag.
    const resolvable = bundleEntries.every(
      ({ product: p, entry }) =>
        Boolean(entry) && isPurchasable(p.priceId) && !isSoldOut(p.priceId),
    );
    if (!resolvable) {
      setBundleError('Sorry, one of these steps is no longer available. Nothing was added to your bag.');
      return;
    }
    setBundleBusy(true);
    const added = bundleEntries.map(({ product: p }) =>
      buy({
        priceId: p.priceId,
        name: p.name,
        priceLabel: `${p.price} AUD`,
        brand: p.brand,
        image: p.image,
      }),
    );
    setBundleBusy(false);
    if (added.some((ok) => !ok)) {
      setBundleError('Sorry, we could not add every step just now. Please check your bag.');
      return;
    }
    setBundleAdded(true);
    window.setTimeout(() => {
      setBundleAdded(false);
    }, 2000);
  }

  return (
    <section
      aria-labelledby="complete-routine-heading"
      className="mt-14 border-t border-border pt-10"
    >
      <h2 id="complete-routine-heading" className="font-display text-2xl text-foreground">
        Complete your routine
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Build around this product with only the steps your routine still needs. Start simply—you do
        not need every possible step.
      </p>
      {currentStepNumber && (
        <p className="mt-3 inline-block border border-border px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          You’re viewing: Step {currentStepNumber} — {currentStepName}
        </p>
      )}

      <div
        ref={trackRef}
        onScroll={onScroll}
        className="mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible"
      >
        {recommendations.map((r) => {
          const p = r.product;
          const outOfStock = isSoldOut(p.priceId);
          return (
            <article
              key={p.priceId}
              className="flex w-[85vw] max-w-sm shrink-0 snap-center flex-col border border-border bg-background p-4 sm:w-auto sm:max-w-none"
            >
              <Link
                to="/product/$slug"
                params={{ slug: productSlug(p) }}
                className="block bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <img
                  src={p.image}
                  alt={`${p.brand} ${p.name} product packaging`}
                  loading="lazy"
                  width={600}
                  height={600}
                  className="aspect-square w-full object-contain p-4"
                />
              </Link>
              <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Step {r.stepNumber} — {r.stepName}
              </p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                {p.brand}
              </p>
              <h3 className="mt-1 text-sm leading-snug text-foreground">{p.name}</h3>
              <p className="mt-2 text-sm tabular-nums text-foreground">{p.price} AUD</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {outOfStock ? '✕ Out of stock' : '✓ In stock'}
              </p>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{r.why}</p>

              <div className="mt-auto pt-4">
                <AddToBagButton
                  priceId={p.priceId}
                  name={p.name}
                  priceLabel={`${p.price} AUD`}
                  unavailable={outOfStock}
                  accessibleName={`Add ${p.brand} ${p.name} to bag`}
                  className="min-h-11 w-full rounded-[2px] bg-foreground px-4 text-[11px] font-medium uppercase tracking-[0.18em] text-background hover:bg-foreground/85 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60"
                />
                <div className="mt-3 flex items-center justify-between gap-3">
                  <Link
                    to="/product/$slug"
                    params={{ slug: productSlug(p) }}
                    className="text-xs underline underline-offset-4 hover:text-foreground"
                    aria-label={`View details for ${p.brand} ${p.name}`}
                  >
                    View details
                  </Link>
                  <WishlistButton productId={p.priceId} productName={`${p.brand} ${p.name}`} />
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {recommendations.length > 1 && (
        <p className="mt-3 text-xs text-muted-foreground sm:hidden" aria-live="polite">
          {visible + 1} of {recommendations.length}
        </p>
      )}

      {allInStock && (
        <div className="mt-6">
          <button
            type="button"
            onClick={addAllThree}
            aria-label={`Add these 3 steps to bag, total ${formatAud(totalCents)} AUD`}
            className="min-h-11 w-full border border-foreground px-5 text-[11px] font-medium uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-auto"
          >
            {bundleAdded ? 'Added' : `Add these 3 steps to bag — ${formatAud(totalCents)} AUD total`}
          </button>
          <p className="mt-2 text-xs text-muted-foreground">
            Total shown excludes the product you are viewing.
          </p>
        </div>
      )}

      <p className="mt-6 text-sm text-muted-foreground">{ROUTINE_SUNSCREEN_NOTE}</p>
    </section>
  );
}
