/**
 * Verified, product-specific ratings sourced from the official brand websites.
 * ONLY products with a confirmed public rating on the brand's own site appear here.
 * Never add a product to this list without a real, checkable source.
 */
export type BrandRatingBadge = {
  /** Star average out of 5 — omit when the brand site does not publish one. */
  rating?: number;
  /** Published review count — omit when not available. */
  count?: number;
  /** Domain shown to customers and used as the source link. */
  sourceDomain: string;
  sourceUrl: string;
};

export const BRAND_REVIEW_BADGES: Record<string, BrandRatingBadge> = {
  beauty_of_joseon_dynasty_cream_50ml_onetime: {
    rating: 4.9,
    count: 3931,
    sourceDomain: 'beautyofjoseon.com',
    sourceUrl: 'https://beautyofjoseon.com',
  },
  beauty_of_joseon_revive_eye_serum_ginseng_plus_retinal_30ml_onetime: {
    rating: 4.8,
    count: 2487,
    sourceDomain: 'beautyofjoseon.com',
    sourceUrl: 'https://beautyofjoseon.com',
  },
  beauty_of_joseon_glow_serum_propolis_plus_niacinamide_30ml_onetime: {
    rating: 4.9,
    count: 1892,
    sourceDomain: 'beautyofjoseon.com',
    sourceUrl: 'https://beautyofjoseon.com',
  },
  biodance_bio_collagen_real_deep_mask_onetime: {
    rating: 4.8,
    sourceDomain: 'biodance.com',
    sourceUrl: 'https://biodance.com',
  },
  round_lab_1025_dokdo_cleanser_150ml_onetime: {
    count: 466,
    sourceDomain: 'roundlab.com',
    sourceUrl: 'https://roundlab.com',
  },
  torriden_dive_in_serum_onetime: {
    rating: 5,
    count: 18,
    sourceDomain: 'torriden.com',
    sourceUrl: 'https://torriden.com',
  },
};

export function brandBadgeFor(priceId: string): BrandRatingBadge | undefined {
  return BRAND_REVIEW_BADGES[priceId];
}
