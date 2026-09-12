import { describe, expect, it } from 'vitest';
import { SHOP_PRODUCTS, contentInPreparation, isPurchasable } from '@/lib/shop-catalog';
import type { ShopProduct } from '@/lib/shop-catalog';
import { productSlug, routineStepLabel } from '@/lib/product-detail';

const MASK = 'bioheal_boh_panthecell_repair_cica_some_ampoule_mask_1p_onetime';
const CLEANSER = 'bioheal_boh_panthecell_repair_cica_soothing_cleanser_160ml_onetime';
const byId = (id: string) => SHOP_PRODUCTS.find((p) => p.priceId === id) as ShopProduct;

describe('Stage 2D1 — BIOHEAL BOH mask and cleanser', () => {
  it('keeps the mask identity, pack and stable direct URL', () => {
    const p = byId(MASK);
    expect(p.name).toBe('Panthecell Repair Cica-Some Ampoule Mask');
    expect(p.productType).toBe('sheet mask');
    expect(p.size).toBe('1P / one sheet mask');
    expect(routineStepLabel(p)).toBe('Weekly Treatment');
    expect(productSlug(p)).toBe('bioheal-boh-panthecell-repair-cica-some-ampoule-mask-1p');
    expect(p.verifiedUsageDirections).toContain('time printed on the received packaging');
    expect(p.verifiedUsageDirections).not.toMatch(/\b(?:10|15|20)\s*minutes?\b/i);
  });

  it('keeps the cleanser identity, size and routine position', () => {
    const p = byId(CLEANSER);
    expect(p.name).toBe('Panthecell Repair Cica Soothing Cleanser 160ml');
    expect(p.productType).toBe('water-based cleanser');
    expect(p.size).toBe('160ml');
    expect(routineStepLabel(p)).toBe('Step 1 — Cleanse');
    expect(p.verifiedUsageDirections).toContain('appropriate first cleanser');
  });

  it('keeps both full English ingredient lists pending with retailer provenance', () => {
    const mask = byId(MASK);
    const cleanser = byId(CLEANSER);
    for (const p of [mask, cleanser]) {
      expect(p.inci).toBeUndefined();
      expect(p.ingredientReviewStatus).toBe('pending');
      expect(p.packagingCheck).toBe('pending');
      expect(p.ingredientStatusNote).toBe(
        'Complete English ingredient list pending packaging verification.',
      );
      expect(p.officialSourceReviewedOn).toBe('2026-09-12');
      expect(p.officialSourceType).toBe('Major retailer');
    }
    expect(mask.officialSourceName).toBe('YesStyle product listing');
    expect(mask.officialSourceUrl).toBe(
      'https://www.yesstyle.com/en/bioheal-boh-panthecell-repair-cica-some-ampoule-mask-30g-x-1-sheet/info.html/pid.1136846548',
    );
    expect(cleanser.officialSourceName).toBe('OLIVE YOUNG Global product listing');
    expect(cleanser.officialSourceUrl).toBe(
      'https://global.oliveyoung.com/product/detail?prdtNo=GA250832675',
    );
  });

  it('keeps prohibited-claim rules internal and out of visible product copy', () => {
    for (const p of [byId(MASK), byId(CLEANSER)]) {
      const visible = [
        p.verifiedTemporaryDescription ?? '',
        p.verifiedUsageDirections ?? '',
        ...(p.verifiedUsageNotes ?? []),
        p.ingredientInformationSummary ?? '',
        p.ingredientStatusNote ?? '',
      ].join(' ');
      expect(visible).not.toMatch(
        /treats? (?:acne|eczema|dermatitis)|regenerates skin|hypoallergenic|irritation-free|safe for every|pregnancy|breastfeeding|fine dust|growth factors|deeply hydrates/i,
      );
      expect(p.internalClaimRestrictions?.length).toBeGreaterThan(0);
    }
  });

  it('keeps both Coming Soon, non-purchasable and excluded from recommendations', () => {
    for (const id of [MASK, CLEANSER]) {
      const p = byId(id);
      expect(contentInPreparation(p)).toBe(true);
      expect(p.purchasable).toBe(false);
      expect(isPurchasable(id)).toBe(false);
      expect(p.price).toBe('');
      expect(p.routineFinderEligible).toBe(false);
    }
  });

  it('leaves catalogue totals unchanged', () => {
    expect(SHOP_PRODUCTS).toHaveLength(77);
    expect(SHOP_PRODUCTS.filter(contentInPreparation)).toHaveLength(21);
    expect(SHOP_PRODUCTS.filter((p) => isPurchasable(p.priceId))).toHaveLength(52);
    expect(SHOP_PRODUCTS.filter((p) => contentInPreparation(p) && isPurchasable(p.priceId))).toHaveLength(0);
  });
});