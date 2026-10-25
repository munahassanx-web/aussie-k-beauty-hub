// Hwahae Global Trending Ranking (review-based, updated daily) — snapshot,
// sourced from hwahae.com/en/rankings/global, a Korean cosmetics review
// platform. Ratings and review counts are Hwahae's own
// published figures; nothing here is invented.
//
// Update cadence: refresh RANKING_SNAPSHOT_DATE, RANKING_SNAPSHOT_ISO and the rows below whenever
// the ranking is re-checked.

import { SHOP_PRODUCTS, type ShopProduct } from '@/lib/shop-catalog';

export const RANKING_SOURCE = 'Hwahae Global Trending Ranking';
export const RANKING_SOURCE_URL = 'https://www.hwahae.com/en/rankings/global';
export const RANKING_SNAPSHOT_DATE = '25 October 2026';
/** Machine-readable form of RANKING_SNAPSHOT_DATE — keep the two in step. */
export const RANKING_SNAPSHOT_ISO = '2026-10-25';

export type RankedEntry = {
  rank: number;
  brand: string;
  name: string;
  /** Hwahae community rating out of 5. */
  rating: number;
  /** Number of Hwahae reviews behind that rating. */
  reviews: number;
  /** Size as published by Hwahae. */
  size: string;
  /** priceId of the matching Skin Grocer SKU, when we stock it. */
  priceId?: string;
  /** Packshot for watchlist (not-yet-stocked) entries. */
  image?: string;
  /** Why it's ranking — one factual line drawn from the Hwahae summary. */
  note: string;
};

export const KOREA_RANKING: RankedEntry[] = [
  {
    rank: 1,
    brand: 'AESTURA',
    name: 'Atobarrier365 Cream',
    rating: 4.68,
    reviews: 18999,
    size: '80ml',
    priceId: 'aestura_atobarrier365_cream_onetime',
    note: 'Ceramide moisturiser for dry, easily unsettled skin.',
  },
  {
    rank: 2,
    brand: 'beplain',
    name: 'Mung Bean pH-Balanced Cleansing Foam',
    rating: 4.63,
    reviews: 51229,
    size: '80ml',
    priceId: 'beplain_mung_bean_ph_balanced_cleansing_foam_80ml_onetime',
    note: 'Low-pH daily cleanser that rinses clean without tightness.',
  },
  {
    rank: 3,
    brand: 'TONYMOLY',
    name: 'Ceramide Mochi Toner',
    image: '/products/watchlist/tonymoly-ceramide-mochi-toner.jpg',
    rating: 4.72,
    reviews: 3297,
    size: '500ml',
    note: 'Ceramide toner with a bouncy mochi-style texture, sold in a large 500ml bottle.',
  },
  {
    rank: 4,
    brand: 'S.NATURE',
    name: 'Aqua Squalane Moisturizing Cream',
    rating: 4.58,
    reviews: 43818,
    size: '60ml',
    priceId: 's_nature_aqua_squalane_moisturizing_cream_onetime',
    note: 'Squalane cream summarised as suiting combination skin.',
  },
  {
    rank: 5,
    brand: 'S.NATURE',
    name: 'Aqua Oasis Toner',
    rating: 4.75,
    reviews: 29407,
    size: '210ml',
    priceId: 's_nature_aqua_oasis_toner_onetime',
    note: 'Layerable hydrating toner for sensitive and combination skin. Same formula, ranked in a different size.',
  },
  {
    rank: 8,
    brand: 'TORRIDEN',
    name: 'DIVE IN Soothing Cream',
    rating: 4.68,
    reviews: 27474,
    size: '100ml',
    priceId: 'torriden_dive_in_soothing_cream_onetime',
    note: 'Lightweight gel-cream, summarised as good for warmer weather.',
  },
  {
    rank: 9,
    brand: 'ROUND LAB',
    name: '1025 Dokdo Toner',
    rating: 4.43,
    reviews: 95383,
    size: '200ml',
    priceId: 'round_lab_1025_dokdo_toner_100ml_onetime',
    note: 'The most-reviewed product on the board at snapshot, with 95,000+ reviews. Same formula, ranked in a different size.',
  },
  {
    rank: 10,
    brand: 'ROUND LAB',
    name: 'Birch Moisture Sun Cream SPF50+ PA++++',
    image: '/products/watchlist/round-lab-birch-moisture-sun-cream.jpg',
    rating: 4.6,
    reviews: 30225,
    size: '50ml',
    note: 'Hydrating Korean sunscreen. Not stocked by Skin Grocer.',
  },
  {
    rank: 11,
    brand: 'Anua',
    name: 'PDRN Hyaluronic Acid Capsule 100 Serum',
    image: '/products/watchlist/anua-pdrn-capsule-serum.jpg',
    rating: 4.61,
    reviews: 12837,
    size: '30ml',
    note: 'Hyaluronic acid serum with PDRN, one of several PDRN products on the board.',
  },
  {
    rank: 12,
    brand: 'WELLAGE',
    name: 'Real Hyaluronic Soothing Cream',
    rating: 4.64,
    reviews: 3950,
    size: '80ml',
    priceId: 'wellage_real_hyaluronic_soothing_cream_80ml_onetime',
    note: 'Gel-cream hydration weighted for oily and combination skin.',
  },
  {
    rank: 18,
    brand: 'WELLAGE',
    name: 'Real Hyaluronic Blue Ampoule 100',
    rating: 4.65,
    reviews: 6197,
    size: '100ml',
    priceId: 'wellage_real_hyaluronic_blue_100_ampoule_60ml_onetime',
    note: 'Lightweight hydrating ampoule, made to be layered. Ranked in the 100ml size; we stock the 60ml.',
  },
  {
    rank: 20,
    brand: 'beplain',
    name: 'Mung Bean Cleansing Oil',
    rating: 4.65,
    reviews: 14058,
    size: '200ml',
    priceId: 'beplain_mung_bean_cleansing_oil_200ml_onetime',
    note: 'Water-light cleansing oil that lifts light makeup and sunscreen.',
  },
];

const BY_PRICE_ID = new Map(SHOP_PRODUCTS.map((p) => [p.priceId, p]));

export type StockedRank = { entry: RankedEntry; product: ShopProduct };

/** Ranked products we hold in the Epping warehouse right now. */
export const STOCKED_RANKING: StockedRank[] = KOREA_RANKING.flatMap((entry) => {
  const product = entry.priceId ? BY_PRICE_ID.get(entry.priceId) : undefined;
  return product ? [{ entry, product }] : [];
});

/** Ranked products we don't stock yet — the watchlist. */
export const WATCHLIST_RANKING: RankedEntry[] = KOREA_RANKING.filter(
  (e) => !e.priceId || !BY_PRICE_ID.has(e.priceId),
);
