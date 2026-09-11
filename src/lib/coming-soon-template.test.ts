import { describe, expect, it } from 'vitest';
import {
  SHOP_PRODUCTS,
  isContentPending,
  isPurchasable,
  sunscreenSupplyRestricted,
} from '@/lib/shop-catalog';
import { temporaryProductTypeSentence } from '@/lib/product-detail';

const pending = SHOP_PRODUCTS.filter(isContentPending);

describe('Coming Soon records', () => {
  it('has the expected catalogue shape', () => {
    expect(SHOP_PRODUCTS).toHaveLength(77);
    expect(pending).toHaveLength(21);
    expect(SHOP_PRODUCTS.filter((p) => isPurchasable(p.priceId))).toHaveLength(52);
  });

  it('never carries a price or a purchase path', () => {
    for (const p of pending) {
      expect(p.price, p.name).toBe('');
      expect(isPurchasable(p.priceId), p.name).toBe(false);
      expect(p.routineFinderEligible, p.name).toBe(false);
      expect(p.quickAddEligible, p.name).toBe(false);
      expect(p.bundleEligible, p.name).toBe(false);
      expect(p.cartRestorationEligible, p.name).toBe(false);
    }
  });

  it('uses one static placeholder image', () => {
    for (const p of pending) expect(p.image, p.name).toBe('/products/placeholder.webp');
  });

  it('keeps AESTURA sunscreen restricted', () => {
    const aestura = SHOP_PRODUCTS.find((p) => /Derma UV365/i.test(p.name))!;
    expect(sunscreenSupplyRestricted(aestura)).toBe(true);
    expect(isPurchasable(aestura.priceId)).toBe(false);
  });

  it('describes each product by its explicit product type', () => {
    const expected: Record<string, string> = {
      'Skin-Glow Essence Cream 50ml': 'A moisturiser',
      'Panthecell Repair Cica-Some Ampoule Mask 1P': 'A mask',
      'Bifida Biome Ampoule Toner 210ml': 'A toner',
      'Galac Niacin 3.0 Essence 60ml': 'A serum or essence',
      'Brightening Peeling Gel 120g': 'An exfoliating gel',
    };
    for (const [name, subject] of Object.entries(expected)) {
      const p = SHOP_PRODUCTS.find((x) => x.name === name)!;
      expect(temporaryProductTypeSentence(p), name).toBe(
        `${subject} from ${p.brand}. Full product information is being reviewed before launch.`,
      );
    }
  });
});
