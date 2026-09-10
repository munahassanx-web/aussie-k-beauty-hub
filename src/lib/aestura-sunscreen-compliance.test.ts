import { describe, expect, it } from 'vitest';
import {
  SHOP_PRODUCTS,
  SUNSCREEN_VERIFICATION_LABEL,
  availabilityLabelFor,
  contentInPreparation,
  isPurchasable,
  isSunscreen,
  sunscreenSupplyRestricted,
  australianSupplyVerified,
} from '@/lib/shop-catalog';

const AESTURA_SUN = 'aestura_derma_uv365_barrier_moisture_mineral_sun_cream_onetime';
const product = SHOP_PRODUCTS.find((p) => p.priceId === AESTURA_SUN)!;

describe('AESTURA Derma UV365 sunscreen restriction', () => {
  it('is recorded as blocked pending Australian compliance', () => {
    expect(product.purchasable).toBe(false);
    expect(product.price).toBe('');
    expect(product.priceStatus).toBe('blocked_pending_compliance');
    expect(product.routineFinderEligible).toBe(false);
    expect(product.bundleEligible).toBe(false);
    expect(product.quickAddEligible).toBe(false);
    expect(product.cartRestorationEligible).toBe(false);
  });

  it('is never purchasable through any surface, including a stale cart', () => {
    expect(isPurchasable(AESTURA_SUN)).toBe(false);
    expect(sunscreenSupplyRestricted(product)).toBe(true);
  });

  it('shows the Australian verification wording wherever a price would be', () => {
    expect(availabilityLabelFor(product)).toBe(SUNSCREEN_VERIFICATION_LABEL);
  });

  it('keeps supplier-cart presence from making any sunscreen purchasable', () => {
    for (const p of SHOP_PRODUCTS.filter(isSunscreen)) {
      if (!australianSupplyVerified(p)) expect(isPurchasable(p.priceId)).toBe(false);
    }
  });

  it('leaves the rest of the catalogue intact', () => {
    expect(SHOP_PRODUCTS.length).toBe(77);
    expect(SHOP_PRODUCTS.filter(contentInPreparation).length).toBe(21);
    expect(SHOP_PRODUCTS.filter((p) => isPurchasable(p.priceId)).length).toBe(52);
  });
});
