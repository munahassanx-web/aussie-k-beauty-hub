import { describe, expect, it } from 'vitest';
import { SHOP_PRODUCTS, contentInPreparation, isPurchasable } from '@/lib/shop-catalog';
import type { ShopProduct } from '@/lib/shop-catalog';
import { routineStepLabel } from '@/lib/product-detail';

const COLLAGEN = 'bioheal_boh_probioderm_collagen_remodeling_cream_50ml_onetime';
const LIFTING = 'bioheal_boh_probioderm_3d_lifting_cream_50ml_onetime';
const byId = (id: string) => SHOP_PRODUCTS.find((p) => p.priceId === id) as ShopProduct;

describe('Stage 2D2 — BIOHEAL BOH creams', () => {
  it('keeps both exact 50ml identities at Step 4 — Moisturise', () => {
    expect(byId(COLLAGEN).name).toBe('Probioderm Collagen Remodeling Cream 50ml');
    expect(byId(LIFTING).name).toBe('Probioderm 3D Lifting Cream 50ml');
    for (const p of [byId(COLLAGEN), byId(LIFTING)]) {
      expect(p.size).toBe('50ml');
      expect(routineStepLabel(p)).toBe('Step 4 — Moisturise');
    }
  });

  it('stores the complete retailer-reviewed Collagen Remodeling record', () => {
    const p = byId(COLLAGEN);
    expect(p.inci).toHaveLength(67);
    expect(p.inci).toContain('Capryloyl Salicylic Acid');
    expect(p.inci?.at(-1)).toBe('Fragrance');
    expect(p.verifiedCustomerGuidance).toContain('Contains added fragrance');
    expect(p.verifiedCustomerGuidance).toContain('Contains Capryloyl Salicylic Acid');
    expect(p.inciSourceName).toBe('OLIVE YOUNG US product listing');
    expect(p.inciSourceDisplayType).toBe('Major retailer');
    expect(p.inciCheckedOn).toBe('2026-09-15');
    expect(p.inciSourceUrl).toBe('https://us.oliveyoung.com/products/UA29860176');
  });

  it('stores the complete retailer-reviewed 3D Lifting record', () => {
    const p = byId(LIFTING);
    expect(p.inci).toHaveLength(80);
    expect(p.inci).toContain('Butyrospermum Parkii (Shea) Butter');
    expect(p.inci?.at(-1)).toBe('Fragrance');
    expect(p.verifiedCustomerGuidance).toContain('Contains added fragrance');
    expect(p.verifiedCustomerGuidance).toContain('Contains shea butter');
    expect(p.inciSourceName).toBe('OLIVE YOUNG US product listing');
    expect(p.inciSourceDisplayType).toBe('Major retailer');
    expect(p.inciCheckedOn).toBe('2026-09-15');
    expect(p.inciSourceUrl).toBe('https://us.oliveyoung.com/products/UA35435218');
  });

  it('keeps prohibited claims internal and out of visible product copy', () => {
    for (const p of [byId(COLLAGEN), byId(LIFTING)]) {
      const visible = [p.verifiedTemporaryDescription ?? '', p.verifiedUsageDirections ?? '', ...(p.verifiedUsageNotes ?? []), ...(p.verifiedCustomerGuidance ?? [])].join(' ');
      expect(visible).not.toMatch(/rebuilds? collagen|remodels? living skin|physically lifts|facelift|reverses sagging|shrinks? pores|tightens? pores|treats? wrinkles|treats? acne|pregnancy|breastfeeding|clinically proven/i);
      expect(p.internalClaimRestrictions?.length).toBeGreaterThan(0);
    }
  });

  it('keeps both Coming Soon, packaging-pending and non-purchasable', () => {
    for (const id of [COLLAGEN, LIFTING]) {
      const p = byId(id);
      expect(contentInPreparation(p)).toBe(true);
      expect(p.purchasable).toBe(false);
      expect(isPurchasable(id)).toBe(false);
      expect(p.price).toBe('');
      expect(p.packagingCheck).toBe('pending');
      expect(p.routineFinderEligible).toBe(false);
      expect(p.ingredientReviewStatus).toBe('reviewed');
    }
  });

  it('leaves catalogue totals unchanged', () => {
    expect(SHOP_PRODUCTS).toHaveLength(77);
    expect(SHOP_PRODUCTS.filter(contentInPreparation)).toHaveLength(21);
    expect(SHOP_PRODUCTS.filter((p) => isPurchasable(p.priceId))).toHaveLength(52);
    expect(SHOP_PRODUCTS.filter((p) => contentInPreparation(p) && isPurchasable(p.priceId))).toHaveLength(0);
  });
});