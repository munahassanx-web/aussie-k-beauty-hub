import { describe, expect, it } from 'vitest';
import {
  SHOP_PRODUCTS,
  isContentPending,
  isPurchasable,
  ingredientReviewRecordComplete,
} from '@/lib/shop-catalog';
import { routineStepLabel, temporaryProductTypeSentence } from '@/lib/product-detail';

const oil = SHOP_PRODUCTS.find(
  (p) => p.priceId === 'haruharu_wonder_black_rice_facial_oil_10ml_onetime',
)!;
const cream = SHOP_PRODUCTS.find(
  (p) => p.priceId === 'haruharu_wonder_black_rice_10_hyaluronic_cream_unscented_50ml_onetime',
)!;

describe('Stage 2B4 — HARUHARU facial oil', () => {
  it('is a 10ml travel-size leave-on Step 5 product', () => {
    expect(oil.name).toBe('Black Rice Facial Oil 10ml');
    expect(oil.size).toBe('10ml · Travel size');
    expect(routineStepLabel(oil)).toBe('Step 5 — seal');
    expect(oil.productType).toBe('leave-on facial oil');
  });

  it('publishes the verified description and directions', () => {
    expect(temporaryProductTypeSentence(oil)).toBe(
      'A leave-on facial oil made with rice bran, sunflower, camellia, jojoba/macadamia and sweet almond-derived oils.',
    );
    expect(oil.verifiedUsageDirections).toMatch(/^Apply a small amount as the final leave-on step/);
    expect(oil.verifiedUsageNotes).toContain(
      'This is a leave-on oil, not the Black Rice Moisture Cleansing Oil.',
    );
  });

  it('lists the eleven reviewed ingredients with brand provenance', () => {
    expect(oil.inci).toHaveLength(11);
    expect(oil.inci?.[0]).toBe('Oryza Sativa (Rice) Bran Oil');
    expect(oil.inci).toContain('Lavandula Angustifolia (Lavender) Oil');
    expect(oil.inci?.[10]).toBe('Tocopherol');
    expect(oil.inciSourceUrl).toBe(
      'https://haruharuwonder.com/products/haruharuwonder-black-rice-facial-oil',
    );
    expect(oil.inciCheckedOn).toBe('2026-09-11');
    expect(ingredientReviewRecordComplete(oil)).toBe(true);
  });

  it('carries no prohibited claim', () => {
    const text = JSON.stringify({ ...oil, verifiedUsageNotes: [] }).toLowerCase();
    for (const banned of [
      'fragrance-free',
      'unscented',
      'non-comedogenic',
      'makeup remover',
      'cleansing oil',
      'every skin type',
    ]) {
      expect(text, banned).not.toContain(banned);
    }
  });
});

describe('Stage 2B4 — HARUHARU 10 Hyaluronic Cream', () => {
  it('keeps its own identity, distinct from the 5 Ceramide cream', () => {
    const ceramide = SHOP_PRODUCTS.find(
      (p) =>
        p.priceId === 'haruharu_wonder_black_rice_5_ceramide_barrier_moisturizing_cream_onetime',
    )!;
    expect(cream.name).toBe('Black Rice 10 Hyaluronic Cream / Unscented 50ml');
    expect(cream.priceId).not.toBe(ceramide.priceId);
    expect(cream.image).not.toBe(ceramide.image);
    expect(routineStepLabel(cream)).toBe('Step 4 — moisturise');
  });

  it('publishes no INCI list, only the pending statement and official source', () => {
    expect(cream.inci).toBeUndefined();
    expect(cream.ingredientReviewStatus).toBe('pending');
    expect(cream.ingredientStatusNote).toBe(
      'Complete ingredient list pending packaging verification.',
    );
    expect(cream.officialSourceLinkLabel).toBe('View official product information');
    expect(cream.officialSourceUrl).toBe(
      'https://haruharuwonder.com/products/haruharuwonder-black-rice-10-hyaluronic-cream-50ml-unscented',
    );
    expect(cream.officialSourceReviewedOn).toBe('2026-09-11');
    expect(ingredientReviewRecordComplete(cream)).toBe(false);
    const text = JSON.stringify(cream).toLowerCase();
    for (const banned of [
      'bamboo shoot',
      'safflower',
      'evening primrose',
      'barrier repair',
      'brighter skin',
      'elasticity',
    ]) {
      expect(text, banned).not.toContain(banned);
    }
  });

  it('publishes the approved description and directions', () => {
    expect(temporaryProductTypeSentence(cream)).toBe(
      'An unscented moisturising cream from HARUHARU WONDER. The exact full ingredient list is being confirmed against the product packaging before launch.',
    );
    expect(cream.verifiedUsageDirections).toMatch(/^Apply after toner and any treatment products\./);
  });
});

describe('Stage 2B4 — safeguards', () => {
  it('keeps both records Coming Soon and non-purchasable', () => {
    for (const p of [oil, cream]) {
      expect(isContentPending(p), p.name).toBe(true);
      expect(isPurchasable(p.priceId), p.name).toBe(false);
      expect(p.price, p.name).toBe('');
      expect(p.packagingCheck, p.name).toBe('pending');
      expect(p.routineFinderEligible, p.name).toBe(false);
      expect(p.bundleEligible, p.name).toBe(false);
      expect(p.quickAddEligible, p.name).toBe(false);
    }
  });

  it('leaves catalogue totals unchanged', () => {
    expect(SHOP_PRODUCTS).toHaveLength(77);
    expect(SHOP_PRODUCTS.filter(isContentPending)).toHaveLength(21);
    expect(SHOP_PRODUCTS.filter((p) => isPurchasable(p.priceId))).toHaveLength(52);
  });
});
