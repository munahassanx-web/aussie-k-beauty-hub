import { describe, expect, it } from 'vitest';
import {
  CONTENT_PREPARATION_LABEL,
  SHOP_PRODUCTS,
  availabilityLabelFor,
  contentInPreparation,
  isPurchasable,
} from '@/lib/shop-catalog';
import { buildRoutine, type QuizAnswers } from '@/lib/routine-matching';

const NEW_SKUS = [
  'haruharu_wonder_rose_pdrn_firming_serum_30ml_onetime',
  'haruharu_wonder_black_rice_triple_aha_gentle_cleansing_gel_100ml_onetime',
  'haruharu_wonder_centella_4_txa_gel_serum_30ml_onetime',
  'haruharu_wonder_black_rice_facial_oil_10ml_onetime',
  'haruharu_wonder_black_rice_10_hyaluronic_cream_unscented_50ml_onetime',
  'biodance_radiant_vita_niacinamide_real_deep_mask_onetime',
  'biodance_first_synergy_toner_150ml_onetime',
  'biodance_collagen_mask_to_foam_cleanser_150ml_onetime',
  'biodance_skin_glow_essence_cream_50ml_onetime',
  'bioheal_boh_panthecell_repair_cica_some_ampoule_mask_1p_onetime',
  'bioheal_boh_panthecell_repair_cica_soothing_cleanser_160ml_onetime',
  'bioheal_boh_probioderm_collagen_remodeling_cream_50ml_onetime',
  'bioheal_boh_probioderm_3d_lifting_cream_50ml_onetime',
  'dr_g_brightening_peeling_gel_120g_onetime',
  'haruharu_wonder_black_rice_night_knight_retinol_serum_20ml_onetime',
  'haruharu_wonder_centella_phyto_5_peptide_concentrate_cream_30ml_onetime',
  'haruharu_wonder_black_rice_bakuchiol_eye_cream_20ml_onetime',
  'manyo_bifida_biome_ampoule_toner_210ml_onetime',
  'manyo_pure_soybean_cleansing_oil_200ml_onetime',
  'manyo_galac_niacin_3_0_essence_60ml_onetime',
  'haruharu_wonder_black_rice_moisture_cleansing_oil_150ml_onetime',
];

describe('Stage 2A supplier-ordered records', () => {
  it('creates 21 distinct new records', () => {
    expect(new Set(NEW_SKUS).size).toBe(21);
    for (const id of NEW_SKUS) {
      expect(SHOP_PRODUCTS.filter((p) => p.priceId === id).length, id).toBe(1);
    }
  });

  it('has no duplicate price ids anywhere in the catalogue', () => {
    const ids = SHOP_PRODUCTS.map((p) => p.priceId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('lists the HARUHARU cleansing oil only once, under matched_both', () => {
    const oils = SHOP_PRODUCTS.filter(
      (p) => p.brand === 'HARUHARU WONDER' && /Moisture (Deep )?Cleansing Oil/.test(p.name),
    );
    expect(oils).toHaveLength(1);
    expect(oils[0]!.supplierReconciliationStatus).toBe('matched_both');
  });

  it('marks every new record as content in preparation with pending checks', () => {
    for (const id of NEW_SKUS) {
      const p = SHOP_PRODUCTS.find((x) => x.priceId === id)!;
      expect(p, id).toBeDefined();
      expect(contentInPreparation(p), id).toBe(true);
      expect(p.productRecordCreated).toBe(true);
      expect(p.supplierMatchConfirmed).toBe(true);
      expect(p.purchasable).toBe(false);
      expect(p.packagingCheck).toBe('pending');
      // Stage 2B2/2B3: some ingredient lists are source reviewed; their
      // packaging checks stay pending.
      const sourceReviewed = [
        'haruharu_wonder_black_rice_moisture_cleansing_oil_150ml_onetime',
        'haruharu_wonder_rose_pdrn_firming_serum_30ml_onetime',
        'haruharu_wonder_centella_4_txa_gel_serum_30ml_onetime',
        'haruharu_wonder_black_rice_facial_oil_10ml_onetime',
      ];
      if (!sourceReviewed.includes(id)) expect(p.ingredientReviewStatus).toBe('pending');
      expect(p.priceStatus).toBe('pending');
      expect(p.routineFinderEligible).toBe(false);
      expect(availabilityLabelFor(p)).toBe(CONTENT_PREPARATION_LABEL);
    }
  });

  it('invents no price, ingredient list or imagery', () => {
    for (const id of NEW_SKUS) {
      const p = SHOP_PRODUCTS.find((x) => x.priceId === id)!;
      expect(p.price, id).toBe('');
      const sourceReviewed = [
        'haruharu_wonder_black_rice_moisture_cleansing_oil_150ml_onetime',
        'haruharu_wonder_rose_pdrn_firming_serum_30ml_onetime',
        'haruharu_wonder_centella_4_txa_gel_serum_30ml_onetime',
        'haruharu_wonder_black_rice_facial_oil_10ml_onetime',
      ];
      if (!sourceReviewed.includes(id)) expect(p.inci, id).toBeUndefined();
      expect(p.image, id).toBe('/products/placeholder.webp');
      expect(p.tag, id).toBeNull();
    }
  });

  it('never allows a new record to be purchased', () => {
    for (const id of NEW_SKUS) expect(isPurchasable(id), id).toBe(false);
  });

  it('never recommends a new record in the Routine Finder', () => {
    const feels = ['dry', 'oily', 'combination', 'balanced', 'sensitive'] as const;
    const concerns = [
      'hydration',
      'acne',
      'pigmentation',
      'sensitivity',
      'anti-aging',
      'barrier',
      'unsure',
    ] as const;
    for (const skinFeel of feels) {
      for (const primaryConcern of concerns) {
        const outcome = buildRoutine({
          skinFeel,
          primaryConcern,
          secondaryConcern: 'none',
          reactivity: 'rarely',
          experience: 'confident',
          depth: 'full',
          texture: 'either',
        } as QuizAnswers);
        for (const item of outcome.items) {
          expect(NEW_SKUS, `${primaryConcern}/${skinFeel}`).not.toContain(item.product.priceId);
        }
      }
    }
  });

  it('keeps the restricted AESTURA sunscreen and three unmatched records unavailable', () => {
    const restricted = SHOP_PRODUCTS.filter(
      (p) => p.brand === 'AESTURA' && /Derma UV365/i.test(p.name),
    );
    expect(restricted.length).toBeGreaterThan(0);
    for (const p of restricted) expect(isPurchasable(p.priceId), p.priceId).toBe(false);

    for (const id of [
      'isntree_chestnut_bha_2_percent_clear_liquid_100ml_onetime',
      'isntree_yam_root_vegan_milk_toner_200ml_onetime',
      'biodance_refreshing_sea_kelp_real_deep_mask_onetime',
    ]) {
      const p = SHOP_PRODUCTS.find((x) => x.priceId === id)!;
      expect(p.supplierReconciliationStatus, id).toBe('unmatched');
      expect(isPurchasable(id), id).toBe(false);
    }
  });
});
