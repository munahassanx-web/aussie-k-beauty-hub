import { describe, expect, it } from 'vitest';
import { isContentPending, isPurchasable, SHOP_PRODUCTS } from '@/lib/shop-catalog';
import {
  accordionIngredients,
  findProductBySlug,
  howToUse,
  productOverview,
  routinePosition,
} from '@/lib/product-detail';

function product(slug: string) {
  const result = findProductBySlug(slug);
  expect(result).toBeDefined();
  if (!result) throw new Error(`Missing fixture: ${slug}`);
  return result;
}

describe('product information accordions', () => {
  it('uses cleanser guidance and Step 1 placement for the DR.G foam', () => {
    const item = product('dr-g-red-blemish-clear-soothing-foam-150ml');
    expect(howToUse(item)).toEqual([
      'Dispense a small amount into wet hands and work into a lather. Massage gently over damp facial skin, avoiding direct contact with the eyes. Rinse thoroughly with lukewarm water and pat dry. Follow with the remaining steps in your routine.',
    ]);
    expect(routinePosition(item)).toBe(
      'Use as the cleansing step. Follow with toner or essence if used, then treatment products and moisturiser.',
    );
    expect([productOverview(item), howToUse(item), accordionIngredients(item)].flat(2).join(' ')).not.toMatch(
      /congestion|reactive skin|low-irritation|cotton pad|after cleansing/i,
    );
  });

  it('uses neutral Step 3 guidance and no unsupported PDRN ingredient cards', () => {
    const item = product('wellage-hyper-pdrn-repair-ampoule-30ml');
    expect(howToUse(item)).toEqual([
      'After cleansing and toner or essence, apply an appropriate amount over the face, avoiding the immediate eye area unless the product is intended for it. Follow with moisturiser.',
    ]);
    expect(routinePosition(item)).toBe(
      'Use after cleansing and toner or essence, and before moisturiser.',
    );
    expect(accordionIngredients(item)).toEqual([]);
    expect([productOverview(item), howToUse(item), accordionIngredients(item)].flat(2).join(' ')).not.toMatch(
      /salmon injection|younger skin|skin repair|30 seconds/i,
    );
  });

  it('uses moisturiser guidance and Step 4 placement for the DR.G cream', () => {
    const item = product('dr-g-r-e-d-blemish-clear-soothing-cream-70ml');
    expect(howToUse(item)).toEqual([
      'Apply an appropriate amount after toner, essence and treatment products. Spread gently over the face and neck, avoiding the immediate eye area. Use sunscreen as the final step of the morning routine.',
    ]);
    expect(routinePosition(item)).toBe(
      'Use after toner, essence and treatment products as the final moisturising step. In the morning, follow with sunscreen.',
    );
    expect([productOverview(item), howToUse(item), accordionIngredients(item)].flat(2).join(' ')).not.toMatch(
      /upward motion|Australian summer|acne|congestion|reactive skin/i,
    );
  });

  it('never generates ingredient highlights without a complete reviewed record', () => {
    const item = SHOP_PRODUCTS.find((entry) => !isContentPending(entry) && !entry.inci?.length);
    expect(item).toBeDefined();
    if (!item) return;
    expect(accordionIngredients(item)).toEqual([]);
  });

  it('preserves catalogue and purchasing safeguards', () => {
    expect(SHOP_PRODUCTS).toHaveLength(77);
    const comingSoon = SHOP_PRODUCTS.filter(isContentPending);
    expect(comingSoon).toHaveLength(21);
    expect(SHOP_PRODUCTS.filter((item) => isPurchasable(item.priceId))).toHaveLength(52);
    expect(comingSoon.filter((item) => isPurchasable(item.priceId))).toHaveLength(0);
  });
});