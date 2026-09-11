import { describe, expect, it } from 'vitest';
import {
  SHOP_PRODUCTS,
  contentInPreparation,
  isPurchasable,
} from '@/lib/shop-catalog';
import type { ShopProduct } from '@/lib/shop-catalog';
import { routineStepLabel } from '@/lib/product-detail';

const byId = (id: string) => SHOP_PRODUCTS.find((p) => p.priceId === id) as ShopProduct;

const RETINOL = 'haruharu_wonder_black_rice_night_knight_retinol_serum_20ml_onetime';
const PEPTIDE = 'haruharu_wonder_centella_phyto_5_peptide_concentrate_cream_30ml_onetime';
const EYE = 'haruharu_wonder_black_rice_bakuchiol_eye_cream_20ml_onetime';

describe('Stage 2B5 — HARUHARU treatment verification', () => {
  it('keeps the three retinoid-family identities distinct', () => {
    const retinol = byId(RETINOL);
    const retinal = byId('haruharu_wonder_rose_pdrn_firming_serum_30ml_onetime');
    expect(retinol.name).toBe('Black Rice Night Knight Retinol Serum / Unscented 20ml');
    expect(retinol.verifiedTemporaryDescription).toContain('0.08% retinol');
    expect(retinol.verifiedTemporaryDescription).not.toContain('retinal');
    expect(retinol.inci).toContain('Retinol (0.08%)');
    expect(retinal.verifiedTemporaryDescription).toContain('retinal');
    expect(retinal.verifiedTemporaryDescription).not.toContain('0.08%');
    // Retinol record carries the retinoid pregnancy guidance.
    expect(
      retinol.verifiedUsageNotes!.some((n) => /pregnancy|breastfeeding/i.test(n)),
    ).toBe(true);
    // Concentrations never transfer between the retinol and retinal records.
    expect(retinol.inci!.join(' ')).not.toContain('Retinal');
    expect((retinal.inci ?? []).join(' ')).not.toContain('Retinol (0.08%)');
  });

  it('displays all retinol cautions prominently', () => {
    const notes = byId(RETINOL).verifiedUsageNotes!;
    expect(notes).toHaveLength(11);
    expect(notes.join(' ')).toContain('Evening use only.');
    expect(notes.join(' ')).toContain('broad-spectrum sunscreen');
    expect(notes.join(' ')).toContain('Do not use in the same routine as another retinoid.');
    expect(notes.join(' ')).toContain('AHA, BHA or PHA');
    expect(notes.join(' ')).toContain('Store away from direct sunlight.');
    expect(byId(RETINOL).verifiedTemporaryDescription).not.toMatch(/no purging/i);
  });

  it('labels the peptide cream 30ml and Step 4', () => {
    const p = byId(PEPTIDE);
    expect(p.name).toBe('Centella Phyto & 5 Peptide Concentrate Cream 30ml');
    expect(routineStepLabel(p)).toBe('Step 4 — moisturise');
    expect(p.inci).toHaveLength(45);
    expect(p.inci).toContain('Copper Tripeptide-1');
    expect(p.inci).toContain('Palmitoyl Pentapeptide-4');
    expect(p.verifiedTemporaryDescription).not.toMatch(/collagen production|lifting|firming/i);
  });

  it('labels the eye cream 20ml and Optional — Eye care', () => {
    const p = byId(EYE);
    expect(p.name).toBe('Black Rice Bakuchiol Eye Cream / Unscented 20ml');
    expect(routineStepLabel(p)).toBe('Optional — Eye care');
    expect(p.inci).toHaveLength(42);
    expect(p.inci).toContain('Bakuchiol');
    // Bakuchiol is never presented as retinol or its equal.
    expect(p.verifiedTemporaryDescription).not.toMatch(/retinol/i);
    expect(p.verifiedUsageNotes!.join(' ')).toContain('not retinol');
    expect(p.verifiedUsageNotes!.join(' ')).toContain('not claimed to be equally effective as retinol');
  });

  it('stores complete official source provenance with new-tab links for all three', () => {
    const urls: Record<string, string> = {
      [RETINOL]:
        'https://haruharuwonder.com/products/haruharuwonder-black-rice-night-knight-retinol-serum-20ml',
      [PEPTIDE]:
        'https://haruharuwonder.com/products/haruharuwonder-centella-phyto-5-peptide-concentrate-cream',
      [EYE]:
        'https://haruharuwonder.com/products/haruharuwonder-black-rice-bakuchiol-eye-cream-20ml',
    };
    for (const [id, url] of Object.entries(urls)) {
      const p = byId(id);
      expect(p.ingredientReviewStatus, id).toBe('reviewed');
      expect(p.inciSource, id).toBe('brand');
      expect(p.inciSourceName, id).toBe('HARUHARU WONDER official product page');
      expect(p.inciSourceUrl, id).toBe(url);
      expect(p.inciCheckedOn, id).toBe('2026-09-11');
      expect(p.packagingCheck, id).toBe('pending');
    }
  });

  it('keeps all three Coming Soon, non-purchasable and Routine Finder-ineligible', () => {
    for (const id of [RETINOL, PEPTIDE, EYE]) {
      const p = byId(id);
      expect(contentInPreparation(p), id).toBe(true);
      expect(p.purchasable, id).toBe(false);
      expect(isPurchasable(id), id).toBe(false);
      expect(p.price, id).toBe('');
      expect(p.priceStatus, id).toBe('pending');
      expect(p.routineFinderEligible, id).toBe(false);
      expect(p.bundleEligible, id).toBe(false);
      expect(p.quickAddEligible, id).toBe(false);
    }
  });

  it('leaves catalogue totals unchanged', () => {
    expect(SHOP_PRODUCTS).toHaveLength(77);
    expect(SHOP_PRODUCTS.filter(contentInPreparation)).toHaveLength(21);
    expect(SHOP_PRODUCTS.filter((p) => isPurchasable(p.priceId))).toHaveLength(52);
  });
});
