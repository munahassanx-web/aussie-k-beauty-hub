import { describe, expect, it } from 'vitest';
import { isContentPending, isPurchasable, SHOP_PRODUCTS } from '@/lib/shop-catalog';
import { findProductBySlug, productDescription } from '@/lib/product-detail';

describe('premium product-page purchase area', () => {
  it('uses the approved DR.G moisturiser description', () => {
    const product = findProductBySlug('dr-g-r-e-d-blemish-clear-soothing-cream-70ml');
    expect(product).toBeDefined();
    if (!product) return;
    expect(productDescription(product)).toBe(
      'A lightweight moisturising cream from Dr.G, selected as the final moisturising step in a considered skincare routine. Review the product details and ingredient information before introducing it.',
    );
  });

  it('never produces broken category grammar in generic descriptions', () => {
    for (const product of SHOP_PRODUCTS.filter((entry) => !isContentPending(entry))) {
      expect(productDescription(product)).not.toMatch(/A (moisturise|cleanse|treat) from/i);
    }
  });

  it('preserves catalogue and purchasing safeguards', () => {
    expect(SHOP_PRODUCTS).toHaveLength(77);
    const comingSoon = SHOP_PRODUCTS.filter(isContentPending);
    expect(comingSoon).toHaveLength(21);
    expect(SHOP_PRODUCTS.filter((product) => isPurchasable(product.priceId))).toHaveLength(52);
    expect(comingSoon.filter((product) => isPurchasable(product.priceId))).toHaveLength(0);
  });
});