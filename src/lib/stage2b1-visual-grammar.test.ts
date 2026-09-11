import { describe, expect, it } from 'vitest';
import { galleryFor, productDescription } from '@/lib/product-detail';
import { SHOP_PRODUCTS, contentInPreparation, isPurchasable } from '@/lib/shop-catalog';
import type { ShopProduct } from '@/lib/shop-catalog';

const byId = (id: string) => SHOP_PRODUCTS.find((p) => p.priceId === id) as ShopProduct;

const COMING_SOON: Array<{ id: string; sentence: string }> = [
  {
    id: 'haruharu_wonder_rose_pdrn_firming_serum_30ml_onetime',
    sentence: 'A serum or essence',
  },
  {
    id: 'haruharu_wonder_black_rice_triple_aha_gentle_cleansing_gel_100ml_onetime',
    sentence: 'A cleanser',
  },
  {
    id: 'haruharu_wonder_centella_4_txa_gel_serum_30ml_onetime',
    sentence: 'A serum or essence',
  },
  {
    id: 'haruharu_wonder_black_rice_facial_oil_10ml_onetime',
    sentence: 'A facial oil',
  },
  {
    id: 'haruharu_wonder_black_rice_10_hyaluronic_cream_unscented_50ml_onetime',
    sentence: 'A moisturiser',
  },
  {
    id: 'haruharu_wonder_black_rice_night_knight_retinol_serum_20ml_onetime',
    sentence: 'A serum or essence',
  },
  {
    id: 'haruharu_wonder_centella_phyto_5_peptide_concentrate_cream_30ml_onetime',
    sentence: 'A moisturiser',
  },
  {
    id: 'haruharu_wonder_black_rice_bakuchiol_eye_cream_20ml_onetime',
    sentence: 'An eye cream',
  },
  {
    id: 'haruharu_wonder_black_rice_moisture_cleansing_oil_150ml_onetime',
    sentence: 'A cleanser',
  },
  {
    id: 'biodance_collagen_mask_to_foam_cleanser_150ml_onetime',
    sentence: 'A cleanser',
  },
];

describe('Stage 2B1 visual correction — placeholder gallery', () => {
  it('shows exactly one placeholder image per Coming Soon HARUHARU record', () => {
    for (const { id } of COMING_SOON) {
      const p = byId(id);
      const gallery = galleryFor(p);
      expect(gallery, id).toHaveLength(1);
      expect(gallery[0]!.src).toBe('/products/placeholder.webp');
      expect(new Set(gallery.map((g) => g.src)).size).toBe(1);
    }
  });

  it('uses the approved coming-soon alt text', () => {
    for (const { id } of COMING_SOON) {
      const p = byId(id);
      expect(galleryFor(p)[0]!.alt).toBe(
        `${p.brand} ${p.name} — verified product imagery coming soon`,
      );
    }
  });
});

describe('Stage 2B1 grammar correction — temporary product copy', () => {
  it('uses grammatically correct product-type sentences', () => {
    for (const { id, sentence } of COMING_SOON) {
      const p = byId(id);
      expect(productDescription(p), id).toBe(
        `${sentence} from HARUHARU WONDER. Full product information is being reviewed before launch.`,
      );
    }
  });

  it('never produces the rejected ungrammatical phrases', () => {
    for (const p of SHOP_PRODUCTS.filter(contentInPreparation)) {
      const description = productDescription(p);
      expect(description).not.toMatch(/A moisturise from/);
      expect(description).not.toMatch(/A masks from/);
      expect(description).not.toMatch(/A cleanse from/);
      expect(description).not.toMatch(/A treat from/);
    }
  });
});

describe('Stage 2B1 safeguards — purchase gates unchanged', () => {
  it('keeps all nine Coming Soon records non-purchasable and ineligible', () => {
    for (const { id } of COMING_SOON) {
      const p = byId(id);
      expect(p.purchasable, id).toBe(false);
      expect(p.priceStatus, id).toBe('pending');
      expect(p.price, id).toBe('');
      expect(p.ingredientReviewStatus, id).toBe('pending');
      expect(p.routineFinderEligible, id).toBe(false);
      expect(p.bundleEligible, id).toBe(false);
      expect(p.quickAddEligible, id).toBe(false);
      expect(isPurchasable(id), id).toBe(false);
    }
    expect(
      SHOP_PRODUCTS.filter((p) => p.brand === 'HARUHARU WONDER' && contentInPreparation(p)),
    ).toHaveLength(9);
  });

  it('leaves the two existing purchasable HARUHARU products unchanged', () => {
    const toner = byId('haruharu_wonder_black_rice_hyaluronic_toner_150ml_onetime');
    const cream = byId(
      'haruharu_wonder_black_rice_5_ceramide_barrier_moisturizing_cream_onetime',
    );
    expect(isPurchasable(toner.priceId)).toBe(true);
    expect(isPurchasable(cream.priceId)).toBe(true);
    expect(toner.price).toBe('$28');
    expect(cream.price).toBe('$38');
    // Purchasable products keep their normal galleries and descriptions.
    expect(galleryFor(toner).length).toBeGreaterThan(1);
    expect(productDescription(cream)).not.toContain(
      'Full product information is being reviewed before launch.',
    );
  });

  it('leaves catalogue totals unchanged', () => {
    expect(SHOP_PRODUCTS.length).toBe(77);
    expect(SHOP_PRODUCTS.filter((p) => isPurchasable(p.priceId))).toHaveLength(52);
    expect(SHOP_PRODUCTS.filter(contentInPreparation)).toHaveLength(21);
  });
});
