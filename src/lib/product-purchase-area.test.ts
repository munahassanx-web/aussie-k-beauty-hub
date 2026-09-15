import { describe, expect, it } from 'vitest';
import { isContentPending, isPurchasable, SHOP_PRODUCTS } from '@/lib/shop-catalog';
import { findProductBySlug, galleryFor, productDescription } from '@/lib/product-detail';

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

  it('keeps both DR.G galleries to three verified non-human images', () => {
    const cases = [
      {
        slug: 'dr-g-r-e-d-blemish-clear-soothing-cream-70ml',
        infoAlt: 'Ingredient information panel for Dr.G R.E.D Blemish Clear Soothing Cream 70ml',
      },
      {
        slug: 'dr-g-red-blemish-clear-soothing-foam-150ml',
        infoAlt: 'Ingredient information panel for Dr.G Red Blemish Clear Soothing Foam 150ml',
      },
    ];

    for (const { slug, infoAlt } of cases) {
      const product = findProductBySlug(slug);
      expect(product).toBeDefined();
      if (!product) continue;
      const gallery = galleryFor(product);
      expect(gallery).toHaveLength(3);
      expect(gallery.map((image) => image.alt)).toContain(infoAlt);
      expect(gallery.some((image) => /woman|girl|person|face|cheek/i.test(image.alt))).toBe(false);
      expect(gallery.every((image) => Boolean(image.src))).toBe(true);
    }
  });

  it('keeps audited gallery alt text free from marketing and suitability claims', () => {
    const prohibited = /fragrance-free|low-irritation|hypoallergenic|sensitive-skin safe|clinically proven|pore-clearing|acne-treating|barrier-repairing|brightening results/i;
    for (const product of SHOP_PRODUCTS) {
      for (const image of galleryFor(product)) expect(image.alt).not.toMatch(prohibited);
    }
  });
});