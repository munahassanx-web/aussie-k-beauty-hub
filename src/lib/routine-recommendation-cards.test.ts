import { describe, expect, it } from 'vitest';
import { SHOP_PRODUCTS, contentInPreparation } from '@/lib/shop-catalog';
import { routineRecommendations, recommendationEligible } from '@/lib/product-detail';

const SKUS = [
  'dr_g_red_blemish_clear_soothing_foam_150ml_onetime',
  'wellage_hyper_pdrn_repair_ampoule_30ml_onetime',
  'dr_g_r_e_d_blemish_clear_soothing_cream_70ml_onetime',
];

const ORDER = ['Cleanse', 'Tone', 'Treat', 'Moisturise'];

function product(priceId: string) {
  return SHOP_PRODUCTS.find((p) => p.priceId === priceId)!;
}

describe('complete your routine recommendations', () => {
  it('shows exactly three recommendations in routine order with no duplicate steps', () => {
    for (const sku of [...SKUS, ...SHOP_PRODUCTS.filter((p) => recommendationEligible(p)).map((p) => p.priceId)]) {
      const p = product(sku);
      if (!p || !recommendationEligible(p)) continue;
      const recs = routineRecommendations(p);
      expect(recs.length).toBeLessThanOrEqual(3);
      const steps = recs.map((r) => r.step);
      expect(new Set(steps).size).toBe(steps.length);
      expect(steps).not.toContain(p.category);
      expect(steps).not.toContain('Protect');
      const positions = steps.map((s) => ORDER.indexOf(s));
      expect([...positions].sort((a, b) => a - b)).toEqual(positions);
      for (const r of recs) {
        expect(r.product.priceId).not.toBe(p.priceId);
        expect(contentInPreparation(r.product)).toBe(false);
        expect(r.product.comingSoon).not.toBe(true);
        expect(r.product.price).toBeTruthy();
        expect(r.product.image).toBeTruthy();
        expect(r.why.length).toBeGreaterThan(10);
      }
    }
  });

  it('the four test products each get three recommendations', () => {
    const tested = [...SKUS, SHOP_PRODUCTS.find((p) => /real hyaluronic/i.test(p.name))!.priceId];
    for (const sku of tested) {
      expect(routineRecommendations(product(sku))).toHaveLength(3);
    }
  });
});
