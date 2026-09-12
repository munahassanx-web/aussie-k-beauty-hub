import { describe, expect, it } from 'vitest';
import {
  SHOP_PRODUCTS,
  contentInPreparation,
  isPurchasable,
} from '@/lib/shop-catalog';
import type { ShopProduct } from '@/lib/shop-catalog';
import { routineStepLabel } from '@/lib/product-detail';

const byId = (id: string) => SHOP_PRODUCTS.find((p) => p.priceId === id) as ShopProduct;

const MASK = 'biodance_radiant_vita_niacinamide_real_deep_mask_onetime';
const CLEANSER = 'biodance_collagen_mask_to_foam_cleanser_150ml_onetime';

describe('Stage 2C2 — BIODANCE mask and cleanser', () => {
  it('labels the mask 1 box (4 × 34g masks) and Weekly Treatment', () => {
    const p = byId(MASK);
    expect(p.name).toBe('Radiant Vita Niacinamide Real Deep Mask');
    expect(p.size).toBe('1 box (4 × 34g masks)');
    expect(routineStepLabel(p)).toBe('Weekly Treatment');
  });

  it('stores the mask daytime and overnight directions', () => {
    const p = byId(MASK);
    expect(p.verifiedUsageOptions).toHaveLength(2);
    expect(p.verifiedUsageOptions![0]!.label).toBe('Daytime');
    expect(p.verifiedUsageOptions![0]!.text).toContain('3–4 hours');
    expect(p.verifiedUsageOptions![1]!.label).toBe('Overnight');
    expect(p.verifiedUsageOptions![1]!.text).toContain('following morning');
  });

  it('stores the complete 46-item official mask INCI with brand provenance', () => {
    const p = byId(MASK);
    expect(p.inci).toHaveLength(46);
    expect(p.inci).toContain('Ananas Sativus (Pineapple) Fruit Water');
    expect(p.inci).toContain('Glutathione');
    expect(p.inci![45]).toBe('Potassium Hyaluronate');
    expect(p.ingredientReviewStatus).toBe('reviewed');
    expect(p.inciSource).toBe('brand');
    expect(p.inciSourceName).toBe('BIODANCE official product page');
    expect(p.inciSourceUrl).toBe(
      'https://biodance.com/products/radiant-vita-niacinamide-real-deep-mask',
    );
    expect(p.inciCheckedOn).toBe('2026-09-12');
  });

  it('labels the cleanser 150ml and Step 1 — Cleanse', () => {
    const p = byId(CLEANSER);
    expect(p.name).toBe('Collagen Mask to Foam Cleanser 150ml');
    expect(p.size).toBe('150ml');
    expect(routineStepLabel(p)).toBe('Step 1 — Cleanse');
  });

  it('explains both daily-cleanser and short-contact-mask use', () => {
    const p = byId(CLEANSER);
    expect(p.verifiedUsageOptions).toHaveLength(2);
    expect(p.verifiedUsageOptions![0]!.label).toBe('As a daily foam cleanser');
    expect(p.verifiedUsageOptions![0]!.text).toContain('coin-sized');
    expect(p.verifiedUsageOptions![1]!.label).toBe('As a short-contact cleansing mask');
    expect(p.verifiedUsageOptions![1]!.text).toContain('1–3 minutes');
    expect(p.verifiedUsageDirections).toBe(
      'Do not allow the cleansing mask to dry completely on the skin.',
    );
    expect(p.verifiedTemporaryDescription).toContain('rinse-off cleanser');
    expect(p.verifiedTemporaryDescription).not.toMatch(/leave-on/i);
  });

  it('stores the complete 37-item official cleanser INCI with brand provenance', () => {
    const p = byId(CLEANSER);
    expect(p.inci).toHaveLength(37);
    expect(p.inci).toContain('Sodium Cocoyl Glycinate');
    expect(p.inci).toContain('Kaolin');
    expect(p.inci![36]).toBe('Palmitoyl Tripeptide-5');
    expect(p.inciSourceUrl).toBe(
      'https://biodance.com/products/collagen-mask-to-foam-cleanser',
    );
    expect(p.inciCheckedOn).toBe('2026-09-12');
  });

  it('keeps prohibited-claim rules internal, never as customer-facing copy', () => {
    const visible = [MASK, CLEANSER]
      .flatMap((id) => {
        const p = byId(id);
        return [
          p.verifiedTemporaryDescription ?? '',
          p.verifiedUsageDirections ?? '',
          ...(p.verifiedUsageNotes ?? []),
          ...(p.verifiedUsageOptions ?? []).flatMap((o) => [o.label, o.text]),
        ];
      })
      .join(' ');
    expect(visible).not.toMatch(
      /melasma|hyperpigmentation|dark spots|tightens pores|unclogs|shrinks|penetrates deeply|150 hours|166%|hypoallergenic|allergen-free|non-toxic|pregnancy|guaranteed|clinically proven|elasticity|treats acne|irritation-free/i,
    );
    expect(byId(MASK).internalClaimRestrictions).toHaveLength(10);
    expect(byId(CLEANSER).internalClaimRestrictions).toHaveLength(8);
  });

  it('keeps both Coming Soon, non-purchasable and packaging-pending', () => {
    for (const id of [MASK, CLEANSER]) {
      const p = byId(id);
      expect(contentInPreparation(p), id).toBe(true);
      expect(p.purchasable, id).toBe(false);
      expect(isPurchasable(id), id).toBe(false);
      expect(p.price, id).toBe('');
      expect(p.packagingCheck, id).toBe('pending');
      expect(p.routineFinderEligible, id).toBe(false);
    }
  });

  it('leaves catalogue totals unchanged', () => {
    expect(SHOP_PRODUCTS).toHaveLength(77);
    expect(SHOP_PRODUCTS.filter(contentInPreparation)).toHaveLength(21);
    expect(SHOP_PRODUCTS.filter((p) => isPurchasable(p.priceId))).toHaveLength(52);
  });
});
