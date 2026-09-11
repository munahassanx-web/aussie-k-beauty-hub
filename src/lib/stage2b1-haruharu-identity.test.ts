import { describe, expect, it } from 'vitest';
import {
  SHOP_PRODUCTS,
  CONTENT_PREPARATION_LABEL,
  availabilityLabelFor,
  contentInPreparation,
  isPurchasable,
} from '@/lib/shop-catalog';
import type { ShopProduct } from '@/lib/shop-catalog';

const byId = (id: string) => SHOP_PRODUCTS.find((p) => p.priceId === id) as ShopProduct;

const EXPECTED: Array<{ id: string; name: string; identity: string; suppliers: string[] }> = [
  {
    id: 'haruharu_wonder_rose_pdrn_firming_serum_30ml_onetime',
    name: 'Rose PDRN Firming Serum 30ml',
    identity: 'packaging_check_required',
    suppliers: ['UMMA'],
  },
  {
    id: 'haruharu_wonder_black_rice_triple_aha_gentle_cleansing_gel_100ml_onetime',
    name: 'Black Rice Triple AHA Gentle Cleansing Gel 100ml',
    identity: 'online_identity_supported',
    suppliers: ['UMMA'],
  },
  {
    id: 'haruharu_wonder_centella_4_txa_gel_serum_30ml_onetime',
    name: 'Centella 4% TXA Gel Serum 30ml',
    identity: 'packaging_check_required',
    suppliers: ['UMMA'],
  },
  {
    id: 'haruharu_wonder_black_rice_facial_oil_10ml_onetime',
    name: 'Black Rice Facial Oil 10ml',
    identity: 'online_identity_supported',
    suppliers: ['UMMA'],
  },
  {
    id: 'haruharu_wonder_black_rice_10_hyaluronic_cream_unscented_50ml_onetime',
    name: 'Black Rice 10 Hyaluronic Cream / Unscented 50ml',
    identity: 'online_identity_supported',
    suppliers: ['UMMA'],
  },
  {
    id: 'haruharu_wonder_black_rice_night_knight_retinol_serum_20ml_onetime',
    name: 'Black Rice Night Knight Retinol Serum 20ml',
    identity: 'online_identity_supported',
    suppliers: ['Seoul4PM'],
  },
  {
    id: 'haruharu_wonder_centella_phyto_5_peptide_concentrate_cream_30ml_onetime',
    name: 'Centella Phyto & 5 Peptide Concentrate Cream 30ml',
    identity: 'online_identity_supported',
    suppliers: ['Seoul4PM'],
  },
  {
    id: 'haruharu_wonder_black_rice_bakuchiol_eye_cream_20ml_onetime',
    name: 'Black Rice Bakuchiol Eye Cream / Unscented 20ml',
    identity: 'online_identity_supported',
    suppliers: ['Seoul4PM'],
  },
  {
    id: 'haruharu_wonder_black_rice_moisture_cleansing_oil_150ml_onetime',
    name: 'Black Rice Moisture Cleansing Oil / Unscented 150ml',
    identity: 'online_identity_supported',
    suppliers: ['UMMA', 'Seoul4PM'],
  },
];

describe('Stage 2B1 — HARUHARU WONDER identity and source verification', () => {
  it('keeps exactly nine HARUHARU coming-soon records with the approved names', () => {
    const coming = SHOP_PRODUCTS.filter(
      (p) => p.brand === 'HARUHARU WONDER' && contentInPreparation(p),
    );
    expect(coming).toHaveLength(9);
    for (const expected of EXPECTED) {
      const product = byId(expected.id);
      expect(product, expected.id).toBeTruthy();
      expect(product.name).toBe(expected.name);
      expect(product.identityVerificationStatus).toBe(expected.identity);
      expect(product.suppliers).toEqual(expected.suppliers);
      expect(product.packagingCheck).toBe('pending');
    }
  });

  it('records an internal packaging-check note for the two disputed identities', () => {
    expect(byId(EXPECTED[0]!.id).internalIdentityNote).toBe(
      'Possible naming or formula variation: Firming Serum versus Soothing Serum. Physical carton verification required.',
    );
    expect(byId(EXPECTED[2]!.id).internalIdentityNote).toBe(
      'Possible renewed name or packaging. Confirm exact carton name, barcode and formula before publication.',
    );
  });

  it('keeps the two Black Rice creams as separate records', () => {
    const hyaluronic = byId(EXPECTED[4]!.id);
    const ceramide = SHOP_PRODUCTS.find(
      (p) => p.priceId === 'haruharu_wonder_black_rice_5_ceramide_barrier_moisturizing_cream_onetime',
    );
    expect(ceramide).toBeTruthy();
    expect(hyaluronic.priceId).not.toBe(ceramide!.priceId);
    expect(hyaluronic.image).not.toBe(ceramide!.image);
  });

  it('holds one cleansing-oil record covering both suppliers', () => {
    const oils = SHOP_PRODUCTS.filter(
      (p) => p.brand === 'HARUHARU WONDER' && /Moisture (Deep )?Cleansing Oil/.test(p.name),
    );
    expect(oils).toHaveLength(1);
    expect(oils[0]!.supplierReconciliationStatus).toBe('matched_both');
    expect(oils[0]!.acceptedNameVariants).toContain('Black Rice Moisture Deep Cleansing Oil');
  });

  it('publishes no price, no purchase path and no routine eligibility', () => {
    for (const { id } of EXPECTED) {
      const p = byId(id);
      expect(p.price).toBe('');
      expect(p.priceStatus).toBe('pending');
      expect(p.purchasable).toBe(false);
      expect(isPurchasable(id)).toBe(false);
      expect(p.routineFinderEligible).toBe(false);
      expect(p.bundleEligible).toBe(false);
      expect(p.quickAddEligible).toBe(false);
      expect(p.websiteStatus).toBe('content_in_preparation');
      expect(availabilityLabelFor(p)).toBe(CONTENT_PREPARATION_LABEL);
    }
  });

  it('marks no ingredient list as reviewed and uses only the neutral placeholder image', () => {
    for (const { id } of EXPECTED) {
      const p = byId(id);
      expect(p.ingredientReviewStatus).toBe('pending');
      expect(p.inci ?? []).toHaveLength(0);
      expect(p.image).toBe('/products/placeholder.webp');
    }
  });

  it('stores exact product-page sources, never a homepage, and labels retailers separately', () => {
    for (const { id } of EXPECTED) {
      const sources = byId(id).identitySources ?? [];
      expect(sources.length).toBeGreaterThan(0);
      for (const source of sources) {
        expect(source.sourceReviewedDate).toBe('2026-09-10');
        expect(source.sourceVerificationStatus).toBe('online_reference_reviewed');
        expect(source.sourceUrl).toMatch(/^https:\/\/[^/]+\/.+/);
        if (source.sourceType === 'official_brand') {
          expect(source.sourceName).toBe('HARUHARU WONDER');
          expect(source.sourceUrl).toContain('haruharuwonder.com/products/');
        } else {
          expect(source.sourceType).toBe('authorised_or_major_retailer');
          expect(source.sourceName).not.toBe('HARUHARU WONDER');
        }
      }
    }
  });

  it('leaves the purchasable catalogue unchanged', () => {
    expect(SHOP_PRODUCTS.length).toBe(77);
    expect(SHOP_PRODUCTS.filter((p) => isPurchasable(p.priceId)).length).toBe(52);
    expect(SHOP_PRODUCTS.filter(contentInPreparation).length).toBe(21);
  });
});
