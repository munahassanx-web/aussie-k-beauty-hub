import { describe, expect, it } from 'vitest';
import {
  SHOP_PRODUCTS,
  isContentPending,
  isPurchasable,
  ingredientReviewRecordComplete,
} from '@/lib/shop-catalog';
import { temporaryProductTypeSentence } from '@/lib/product-detail';

const oil = SHOP_PRODUCTS.find(
  (p) => p.priceId === 'haruharu_wonder_black_rice_moisture_cleansing_oil_150ml_onetime',
)!;
const gel = SHOP_PRODUCTS.find(
  (p) => p.priceId === 'haruharu_wonder_black_rice_triple_aha_gentle_cleansing_gel_100ml_onetime',
)!;

describe('Stage 2B2 — HARUHARU cleanser records', () => {
  it('keeps both products Coming Soon and non-purchasable', () => {
    for (const p of [oil, gel]) {
      expect(isContentPending(p), p.name).toBe(true);
      expect(isPurchasable(p.priceId), p.name).toBe(false);
      expect(p.price, p.name).toBe('');
      expect(p.routineFinderEligible, p.name).toBe(false);
      expect(p.packagingCheck, p.name).toBe('pending');
    }
  });

  it('gives the cleansing oil exactly nine reviewed ingredients with a public brand source', () => {
    expect(oil.inci).toHaveLength(9);
    expect(oil.inci?.[0]).toBe('Oryza Sativa (Rice) Bran Oil');
    expect(oil.inci?.[8]).toBe('Ethylhexylglycerin');
    expect(oil.inciSource).toBe('brand');
    expect(oil.inciSourceName).toBe('HARUHARU WONDER official product page');
    expect(oil.inciSourceUrl).toBe(
      'https://haruharuwonder.com/products/haruharuwonder-black-rice-moisture-cleansing-oil',
    );
    expect(oil.inciCheckedOn).toBe('2026-09-11');
    expect(oil.ingredientReviewStatus).toBe('reviewed');
    expect(ingredientReviewRecordComplete(oil)).toBe(true);
  });

  it('starts the cleansing-oil directions on dry hands and a dry face', () => {
    expect(oil.verifiedUsageDirections).toMatch(/^Dispense onto dry hands and gently massage over a dry face\./);
    expect(oil.verifiedUsageDirections).not.toMatch(/wet skin/i);
    expect(temporaryProductTypeSentence(oil)).toBe(
      'A fragrance-free cleansing oil designed to remove makeup, sunscreen and daily buildup before a water-based cleanser.',
    );
  });

  it('publishes no ingredients, acids, claims or directions for the Triple AHA gel', () => {
    expect(gel.name).toBe('Black Rice Triple AHA Gentle Cleansing Gel 100ml');
    expect(gel.inci).toBeUndefined();
    expect(gel.ingredientReviewStatus).toBe('pending');
    expect(gel.verifiedUsageDirections).toBeUndefined();
    expect(ingredientReviewRecordComplete(gel)).toBe(false);
    expect(temporaryProductTypeSentence(gel)).toBe(
      'A water-based facial cleanser from HARUHARU WONDER. Its complete directions, ingredient list and product claims are being reviewed before launch.',
    );
    expect(gel.pendingContentNote).toBe(
      'Full ingredient and usage information will be added after the exact product packaging and supplier documentation have been verified.',
    );
    const text = JSON.stringify(gel).toLowerCase();
    for (const banned of ['glycolic', 'lactic', 'mandelic', 'exfoliating treatment', 'sensitive skin', 'daily']) {
      expect(text, banned).not.toContain(banned);
    }
  });

  it('leaves the catalogue shape unchanged', () => {
    expect(SHOP_PRODUCTS).toHaveLength(77);
    expect(SHOP_PRODUCTS.filter(isContentPending)).toHaveLength(21);
    expect(SHOP_PRODUCTS.filter((p) => isPurchasable(p.priceId))).toHaveLength(52);
  });

  it('only marks other records reviewed when their provenance record is complete', () => {
    for (const p of SHOP_PRODUCTS) {
      if (p.ingredientReviewStatus === 'reviewed') {
        expect(ingredientReviewRecordComplete(p), p.name).toBe(true);
      }
    }
  });
});
