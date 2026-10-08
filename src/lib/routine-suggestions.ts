import { SHOP_PRODUCTS, isPurchasable, supplierMatchPending, type Category, type ShopProduct } from '@/lib/shop-catalog';

/** The core routine steps, in the order they are applied. */
const CORE_STEPS: Category[] = ['Cleanse', 'Tone', 'Treat', 'Moisturise', 'Protect'];

/**
 * "Complete your routine" picks for the bag: one product for each core step the
 * bag is missing, preferring products that share a skin concern with what is
 * already in the bag. Only orderable, in-stock catalogue products are returned.
 */
export function completeRoutineSuggestions(
  cartPriceIds: readonly string[],
  isSoldOut: (priceId: string) => boolean,
  limit = 3,
): ShopProduct[] {
  const inCart = new Set(cartPriceIds);
  const cartProducts = SHOP_PRODUCTS.filter((p) => inCart.has(p.priceId));
  if (cartProducts.length === 0) return [];

  const haveSteps = new Set(cartProducts.map((p) => p.category));
  const cartConcerns = new Set(cartProducts.flatMap((p) => p.concerns));
  const cartBrands = new Set(cartProducts.map((p) => p.brand));

  const picks: ShopProduct[] = [];
  for (const step of CORE_STEPS) {
    if (picks.length >= limit) break;
    if (haveSteps.has(step)) continue;
    const best = SHOP_PRODUCTS.filter(
      (p) =>
        p.category === step &&
        !inCart.has(p.priceId) &&
        !p.comingSoon &&
        !supplierMatchPending(p) &&
        isPurchasable(p.priceId) &&
        !isSoldOut(p.priceId),
    )
      .map((p) => ({
        p,
        score:
          p.concerns.filter((c) => cartConcerns.has(c)).length * 2 + (cartBrands.has(p.brand) ? 1 : 0),
      }))
      .sort((a, b) => b.score - a.score)[0];
    if (best) picks.push(best.p);
  }
  return picks;
}
