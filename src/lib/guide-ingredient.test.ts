import { describe, expect, it } from 'vitest';
import { SHOP_PRODUCTS } from '@/lib/shop-catalog';
import { guideIngredient } from './guide-ingredient';

const base = SHOP_PRODUCTS[0];
if (!base) throw new Error('Catalogue is empty');
const reviewed = { ...base, comingSoon: false, ingredientReviewStatus: 'reviewed' as const, inci: ['Water', 'Niacinamide'], inciSource: 'brand' as const, inciSourceName: 'Brand ingredient list', inciSourceUrl: 'https://example.com/exact-product', inciCheckedOn: '2026-10-27' };

describe('guide ingredient evidence', () => {
  it('uses actual listed niacinamide, not an ingredient guessed from the product name', () => {
    const spotlight = guideIngredient({ ...reviewed, name: 'Centella cream' });
    expect(spotlight?.name).toBe('Niacinamide · Vitamin B3');
    expect(spotlight?.listedAs).toEqual(['Niacinamide']);
  });
  it('hides a spotlight when the review source is incomplete', () => {
    expect(guideIngredient({ ...reviewed, inciCheckedOn: undefined })).toBeNull();
  });
  it('hides spotlights on pending content', () => {
    expect(guideIngredient({ ...reviewed, ingredientReviewStatus: 'pending' })).toBeNull();
  });
  it('does not invent a highlight for an unrecognised ingredient', () => {
    expect(guideIngredient({ ...reviewed, inci: ['Water'] })).toBeNull();
  });
});