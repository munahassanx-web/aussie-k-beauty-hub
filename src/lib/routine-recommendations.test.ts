import { describe, expect, it } from 'vitest';
import { SHOP_PRODUCTS, isContentPending, sunscreenSupplyRestricted } from '@/lib/shop-catalog';
import {
  routineCompanions,
  routineRoleSentence,
  routineDirectionSentence,
  recommendationEligible,
  SUNSCREEN_EDUCATIONAL_NOTE,
  productSlug,
} from '@/lib/product-detail';

const bySlug = (slug: string) => {
  const p = SHOP_PRODUCTS.find((x) => productSlug(x) === slug);
  if (!p) throw new Error(`missing product: ${slug}`);
  return p;
};

describe('product-page routine recommendations', () => {
  it('A. Dr.G R.E.D Blemish Clear Soothing Cream is a Step 4 moisturiser', () => {
    const p = bySlug('dr-g-r-e-d-blemish-clear-soothing-cream-70ml');
    expect(p.category).toBe('Moisturise');
    expect(routineRoleSentence(p)).toBe('This moisturiser is your Step 4.');
    expect(routineDirectionSentence(p)).toBe(
      'If your routine needs more, choose earlier steps according to your skin, current routine and ingredient suitability.',
    );
    expect(routineRoleSentence(p)).not.toMatch(/toner/i);
    const groups = routineCompanions(p);
    // No pending sunscreen card; educational wording only if Protect is shown.
    for (const g of groups) {
      for (const r of g.products) expect(sunscreenSupplyRestricted(r)).toBe(false);
    }
    const protect = groups.find((g) => g.stepLabel === 'Protect');
    if (protect) {
      expect(protect.products).toHaveLength(0);
      expect(protect.educationalNote).toBe(SUNSCREEN_EDUCATIONAL_NOTE);
    }
    // Step order for a moisturiser: cleanse first among the earlier steps.
    const earlier = groups.filter((g) => g.stepLabel !== 'Protect').map((g) => g.stepLabel);
    expect(earlier).toEqual(['Cleanse', 'Tone', 'Treat'].slice(0, earlier.length));
    expect(groups.some((g) => g.stepLabel === 'Moisturise')).toBe(false);
  });

  it('B. a Step 1 cleanser is described as a cleanser and recommends later steps first', () => {
    const p = SHOP_PRODUCTS.find((x) => x.category === 'Cleanse' && recommendationEligible(x))!;
    expect(routineRoleSentence(p)).toBe('This cleanser is your Step 1.');
    const groups = routineCompanions(p);
    expect(groups[0].stepLabel).not.toBe('Cleanse');
    expect(['Tone', 'Treat', 'Moisturise', 'Protect']).toContain(groups[0].stepLabel);
  });

  it('C. a Step 3 treatment is not described as a toner or moisturiser', () => {
    const p = SHOP_PRODUCTS.find((x) => x.category === 'Treat' && recommendationEligible(x))!;
    const sentence = routineRoleSentence(p);
    expect(sentence).toBe('This treatment is your Step 3.');
    expect(sentence).not.toMatch(/toner|moisturiser/i);
  });

  it('only shows purchasable, complete, non-pending products in every group', () => {
    for (const p of SHOP_PRODUCTS.filter(recommendationEligible)) {
      for (const g of routineCompanions(p)) {
        for (const r of g.products) {
          expect(r.priceId).not.toBe(p.priceId);
          expect(r.comingSoon).not.toBe(true);
          expect(isContentPending(r)).toBe(false);
          expect(sunscreenSupplyRestricted(r)).toBe(false);
          expect(recommendationEligible(r)).toBe(true);
          expect(r.category).toBe(g.stepLabel);
        }
      }
    }
  });

  it('D. catalogue totals are unchanged', () => {
    expect(SHOP_PRODUCTS).toHaveLength(77);
    const coming = SHOP_PRODUCTS.filter(isContentPending);
    expect(coming).toHaveLength(21);
    expect(coming.filter(recommendationEligible)).toHaveLength(0);
    expect(SHOP_PRODUCTS.filter(recommendationEligible)).toHaveLength(52);
  });
});
