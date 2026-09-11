import { describe, expect, it } from 'vitest';
import {
  SHOP_PRODUCTS,
  isContentPending,
  isPurchasable,
  ingredientReviewRecordComplete,
} from '@/lib/shop-catalog';
import { temporaryProductTypeSentence } from '@/lib/product-detail';

const rose = SHOP_PRODUCTS.find(
  (p) => p.priceId === 'haruharu_wonder_rose_pdrn_firming_serum_30ml_onetime',
)!;
const centella = SHOP_PRODUCTS.find(
  (p) => p.priceId === 'haruharu_wonder_centella_4_txa_gel_serum_30ml_onetime',
)!;

describe('Stage 2B3 — HARUHARU serum records', () => {
  it('names the Rose serum as the retinal formula, distinct from the Soothing Serum', () => {
    expect(rose.name).toBe('Rose PDRN Firming Serum with Retinal 0.1% 30ml');
    expect(rose.name).toContain('Firming Serum with Retinal 0.1%');
    // Customer-facing copy only; the internal packaging-check note may still
    // reference the other product by name.
    const text = [
      rose.name,
      rose.verifiedTemporaryDescription ?? '',
      rose.verifiedUsageDirections ?? '',
      ...(rose.verifiedUsageNotes ?? []),
      ...(rose.inci ?? []),
    ]
      .join(' ')
      .toLowerCase();
    expect(text).not.toContain('soothing serum');
    expect(text).not.toContain('azelaic');
  });

  it('publishes the verified retinal description, directions and cautions', () => {
    expect(temporaryProductTypeSentence(rose)).toBe(
      'An evening serum formulated with 0.1% retinal, niacinamide, peptides, panthenol, ceramide NP and sodium DNA.',
    );
    expect(rose.verifiedUsageDirections).toMatch(/^In the evening, apply an appropriate amount/);
    const notes = rose.verifiedUsageNotes ?? [];
    expect(notes).toContain('Evening use only.');
    expect(notes).toContain('Use a broad-spectrum sunscreen during the day.');
    expect(notes.some((n) => /pregnancy or breastfeeding/i.test(n))).toBe(true);
    expect(rose.inci).toHaveLength(42);
    expect(rose.inci?.[0]).toBe('Water');
    expect(rose.inci).toContain('Retinal');
    expect(rose.inciSourceUrl).toBe(
      'https://haruharuwonder.com/products/haruharuwonder-rose-pdrn-firming-serum-30ml',
    );
    expect(rose.inciCheckedOn).toBe('2026-09-11');
    expect(ingredientReviewRecordComplete(rose)).toBe(true);
  });

  it('carries no prohibited claims on the Rose serum', () => {
    const text = JSON.stringify(rose).toLowerCase();
    for (const banned of [
      'suitable for everyone',
      'acne treatment',
      'clinically proven',
      'boost collagen',
      'shrink pores',
      'professional treatment',
    ]) {
      expect(text, banned).not.toContain(banned);
    }
  });

  it('records the Centella serum with 4% TXA and 4% niacinamide', () => {
    expect(centella.name).toBe('Centella 4% TXA Gel Serum / Unscented 30ml');
    expect(temporaryProductTypeSentence(centella)).toBe(
      'A lightweight, fragrance-free gel serum formulated with 4% tranexamic acid, 4% niacinamide, vitamin C derivatives and a Centella complex.',
    );
    expect(centella.inci).toContain('Niacinamide (4%)');
    expect(centella.inci).toContain('Tranexamic Acid (4%)');
    expect(centella.inci).toHaveLength(17);
    expect(centella.inciSourceUrl).toBe(
      'https://haruharuwonder.com/products/haruharuwonder-centella-4-txa-gel-serum-30ml',
    );
    expect(centella.inciCheckedOn).toBe('2026-09-11');
    expect(ingredientReviewRecordComplete(centella)).toBe(true);
    const text = JSON.stringify(centella).toLowerCase();
    for (const banned of ['removes pigmentation', 'prevents dark spots', 'medical treatment']) {
      expect(text, banned).not.toContain(banned);
    }
  });

  it('keeps both serums Coming Soon, unpriced and packaging-pending', () => {
    for (const p of [rose, centella]) {
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
