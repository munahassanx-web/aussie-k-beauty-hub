import { describe, expect, it } from 'vitest';
import {
  SHOP_PRODUCTS,
  contentInPreparation,
  isPurchasable,
} from '@/lib/shop-catalog';
import type { ShopProduct } from '@/lib/shop-catalog';
import { routineStepLabel } from '@/lib/product-detail';

const byId = (id: string) => SHOP_PRODUCTS.find((p) => p.priceId === id) as ShopProduct;

const TONER = 'biodance_first_synergy_toner_150ml_onetime';
const CREAM = 'biodance_skin_glow_essence_cream_50ml_onetime';

describe('Stage 2C1 — BIODANCE toner and essence cream', () => {
  it('labels the toner 150ml and Step 2 — Prepare', () => {
    const p = byId(TONER);
    expect(p.name).toBe('First Synergy Toner 150ml');
    expect(p.size).toBe('150ml');
    expect(routineStepLabel(p)).toBe('Step 2 — Prepare');
  });

  it('publishes no guessed or translated English INCI for the toner', () => {
    const p = byId(TONER);
    expect(p.inci ?? []).toHaveLength(0);
    expect(p.ingredientReviewStatus).toBe('pending');
    expect(p.ingredientStatusNote).toBe(
      'Complete English ingredient list pending packaging verification.',
    );
  });

  it('stores both toner sources with new-tab link labels', () => {
    const p = byId(TONER);
    expect(p.officialSourceName).toBe('BIODANCE official Korean product page');
    expect(p.officialSourceUrl).toContain('biodance.co.kr');
    expect(p.officialSourceReviewedOn).toBe('2026-09-12');
    expect(p.officialSourceLinkLabel).toBe('View official Korean ingredient disclosure');
    expect(p.officialSource2Name).toBe('BIODANCE official international product guide');
    expect(p.officialSource2Url).toBe('https://biodance.com/pages/first-synergy-toner');
    expect(p.officialSource2LinkLabel).toBe('View official product information');
  });

  it('labels the cream 50ml, Step 4 — Moisturise, with no hyphen in Skin Glow', () => {
    const p = byId(CREAM);
    expect(p.name).toBe('Skin Glow Essence Cream 50ml');
    expect(p.name).not.toContain('Skin-Glow');
    expect(p.size).toBe('50ml');
    expect(routineStepLabel(p)).toBe('Step 4 — Moisturise');
  });

  it('stores the complete 47-item official cream INCI with brand provenance', () => {
    const p = byId(CREAM);
    expect(p.inci).toHaveLength(47);
    expect(p.inci).toContain('Niacinamide');
    expect(p.inci).toContain('Ceramide EOP');
    expect(p.inci![44]).toBe('Tocopherol');
    expect(p.ingredientReviewStatus).toBe('reviewed');
    expect(p.inciSource).toBe('brand');
    expect(p.inciSourceName).toBe('BIODANCE official product page');
    expect(p.inciSourceUrl).toBe(
      'https://biodance.com/products/biodance-skin-glow-essence-cream-50ml',
    );
    expect(p.inciCheckedOn).toBe('2026-09-12');
  });

  it('keeps prohibited-claim rules internal, never as customer-facing notes', () => {
    const visible = [TONER, CREAM].flatMap((id) => {
      const p = byId(id);
      return [
        p.verifiedTemporaryDescription ?? '',
        p.verifiedUsageDirections ?? '',
        ...(p.verifiedUsageNotes ?? []),
      ];
    }).join(' ');
    expect(visible).not.toMatch(/2\.4|pH 5\.5|96%|hypoallergenic|microbiome|glass skin|penetrates deeply|toxins|guaranteed makeup/i);
    expect(byId(TONER).internalClaimRestrictions).toHaveLength(6);
    expect(byId(CREAM).internalClaimRestrictions).toHaveLength(6);
  });

  it('keeps both Coming Soon, non-purchasable and packaging-pending', () => {
    for (const id of [TONER, CREAM]) {
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
