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
export const RANKING_SNAPSHOT_DATE = '12 October 2026';
/** Machine-readable form of RANKING_SNAPSHOT_DATE — keep the two in step. */
export const RANKING_SNAPSHOT_ISO = '2026-10-12';

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
    reviews: 18832,
    size: '80ml',
    priceId: 'aestura_atobarrier365_cream_onetime',
    note: 'Ceramide moisturiser for dry, easily unsettled skin.',
  },
  {
    rank: 3,
    brand: 'TONYMOLY',
    name: 'Ceramide Mochi Toner',
    image: '/products/watchlist/tonymoly-ceramide-mochi-toner.jpg',
    rating: 4.73,
    reviews: 3100,
    size: '500ml',
    note: 'Ceramide toner with a bouncy mochi-style texture, sold in a large 500ml bottle.',
  },
  {
    rank: 4,
    brand: 'beplain',
    name: 'Mung Bean pH-Balanced Cleansing Foam',
    rating: 4.63,
    reviews: 51021,
    size: '80ml',
    priceId: 'beplain_mung_bean_ph_balanced_cleansing_foam_80ml_onetime',
    note: 'Low-pH daily cleanser that rinses clean without tightness.',
  },
  {
    rank: 6,
    brand: 'S.NATURE',
    name: 'Aqua Squalane Moisturizing Cream',
    rating: 4.58,
    reviews: 43624,
    size: '60ml',
    priceId: 's_nature_aqua_squalane_moisturizing_cream_onetime',
    note: 'Squalane cream that sits well under makeup.',
  },
  {
    rank: 8,
    brand: 'S.NATURE',
    name: 'Aqua Oasis Toner',
    rating: 4.75,
    reviews: 29223,
    size: '210ml',
    priceId: 's_nature_aqua_oasis_toner_onetime',
    note: 'Layerable hydrating toner for sensitive and combination skin. Same formula, ranked in a different size.',
  },
  {
    rank: 10,
    brand: 'ROUND LAB',
    name: 'Birch Moisture Sun Cream SPF50+ PA++++',
    image: '/products/watchlist/round-lab-birch-moisture-sun-cream.jpg',
    rating: 4.6,
    reviews: 30149,
    size: '50ml',
    note: 'Hydrating Korean sunscreen. Not stocked by Skin Grocer.',
  },
  {
    rank: 11,
    brand: 'ROUND LAB',
    name: '1025 Dokdo Toner',
    rating: 4.43,
    reviews: 95340,
    size: '200ml',
    priceId: 'round_lab_1025_dokdo_toner_100ml_onetime',
    note: 'The most-reviewed product on the board at snapshot, with 95,000+ reviews. Same formula, ranked in a different size.',
  },
  {
    rank: 12,
    brand: 'TORRIDEN',
    name: 'DIVE IN Soothing Cream',
    rating: 4.68,
    reviews: 27363,
    size: '100ml',
    priceId: 'torriden_dive_in_soothing_cream_onetime',
    note: 'Light gel-cream that finishes the DIVE-IN routine.',
  },
  {
    rank: 14,
    brand: 'Anua',
    name: 'PDRN Hyaluronic Acid Capsule 100 Serum',
    image: '/products/watchlist/anua-pdrn-capsule-serum.jpg',
    rating: 4.61,
    reviews: 12765,
    size: '30ml',
    note: 'Hyaluronic acid serum with PDRN, one of several PDRN products on the board.',
  },
  {
    rank: 20,
    brand: 'WELLAGE',
    name: 'Real Hyaluronic Soothing Cream',
    rating: 4.64,
    reviews: 3929,
    size: '80ml',
    priceId: 'wellage_real_hyaluronic_soothing_cream_80ml_onetime',
    note: 'Gel-cream hydration weighted for oily and combination skin.',
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
