import { describe, expect, it } from 'vitest';
import {
  BUNDLE_DEFINITIONS,
  SHOP_PRODUCTS,
  contentInPreparation,
  isPurchasable,
  supplierMatchPending,
  sunscreenSupplyRestricted,
} from '@/lib/shop-catalog';
import { buildRoutine, type QuizAnswers } from '@/lib/routine-matching';
import {
  productBenefits,
  productDescription,
} from '@/lib/product-detail';

const UNMATCHED = [
  'isntree_chestnut_bha_2_percent_clear_liquid_100ml_onetime',
  'isntree_yam_root_vegan_milk_toner_200ml_onetime',
  'biodance_refreshing_sea_kelp_real_deep_mask_onetime',
];

describe('Stage 1 supplier reconciliation', () => {
  it('keeps the three records in the catalogue so they remain viewable', () => {
    for (const id of UNMATCHED) {
      const p = SHOP_PRODUCTS.find((x) => x.priceId === id);
      expect(p, id).toBeDefined();
      expect(p!.supplierReconciliationStatus).toBe('unmatched');
      expect(p!.supplierMatchConfirmed).toBe(false);
      expect(p!.purchasable).toBe(false);
      expect(supplierMatchPending(p!)).toBe(true);
    }
  });

  it('never allows an unmatched product to be purchased', () => {
    for (const id of UNMATCHED) expect(isPurchasable(id), id).toBe(false);
  });

  it('uses neutral copy without stock, fulfilment or authenticity claims', () => {
    for (const id of UNMATCHED) {
      const product = SHOP_PRODUCTS.find((item) => item.priceId === id);
      expect(product).toBeDefined();
      if (!product) continue;
      expect(productDescription(product)).not.toMatch(
        /authentic|stocked|dispatched|shipped from (?:our )?Melbourne/i,
      );
      expect(productBenefits(product).join(' ')).not.toMatch(
        /authentic|stocked|dispatched|shipped from (?:our )?Melbourne/i,
      );
    }
  });

  it('never includes an unmatched product in a purchasable bundle', () => {
    for (const bundle of BUNDLE_DEFINITIONS) {
      const hasUnmatched = bundle.includes.some((entry) =>
        SHOP_PRODUCTS.some(
          (p) => supplierMatchPending(p) && entry.toLowerCase().includes(p.name.toLowerCase()),
        ),
      );
      if (hasUnmatched) expect(isPurchasable(bundle.priceId), bundle.priceId).toBe(false);
    }
  });

  it('never recommends an unmatched product in the Routine Finder', () => {
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
          expect(UNMATCHED, `${primaryConcern}/${skinFeel}`).not.toContain(item.product.priceId);
        }
      }
    }
  });

  it('leaves every other product untouched', () => {
    // Stage 2A records (content in preparation) and the restricted sunscreen
    // are pending for different reasons, so they are excluded here.
    const flagged = SHOP_PRODUCTS.filter(
      (p) => supplierMatchPending(p) && !contentInPreparation(p) && !sunscreenSupplyRestricted(p),
    )
      .map((p) => p.priceId)
      .sort();
    expect(flagged).toEqual([...UNMATCHED].sort());
  });
});
