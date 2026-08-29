// Weekly Korean bestseller ranking, sourced from the Hwahae Global Trending
// Ranking (hwahae.com/en/rankings/global) — Korea's largest independent
// cosmetics review platform. Ratings and review counts are Hwahae's own
// published figures; nothing here is invented.
//
// Update cadence: refresh RANKING_SNAPSHOT_DATE and the rows below whenever
// the ranking is re-checked.

import { SHOP_PRODUCTS, type ShopProduct } from '@/lib/shop-catalog';

export const RANKING_SOURCE = 'Hwahae Global Trending Ranking';
export const RANKING_SOURCE_URL = 'https://www.hwahae.com/en/rankings/global';
export const RANKING_SNAPSHOT_DATE = '28 August 2026';

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
  /** Why it's ranking — one factual line drawn from the Hwahae summary. */
  note: string;
};

export const KOREA_RANKING: RankedEntry[] = [
  {
    rank: 1,
    brand: 'AESTURA',
    name: 'Atobarrier365 Cream',
    rating: 4.68,
    reviews: 18193,
    size: '80ml',
    priceId: 'aestura_atobarrier365_cream_onetime',
    note: 'Barrier-repairing moisturiser built for dry, easily unsettled skin.',
  },
  {
    rank: 2,
    brand: 'beplain',
    name: 'Mung Bean pH-Balanced Cleansing Foam',
    rating: 4.63,
    reviews: 50296,
    size: '80ml',
    priceId: 'beplain_mung_bean_ph_balanced_cleansing_foam_80ml_onetime',
    note: 'Low-pH daily cleanser that rinses clean without tightness.',
  },
  {
    rank: 3,
    brand: 'TORRIDEN',
    name: 'DIVE IN Low Molecular Hyaluronic Acid Serum',
    rating: 4.61,
    reviews: 85457,
    size: '50ml',
    priceId: 'torriden_dive_in_serum_onetime',
    note: 'Lightweight hyaluronic hydration with no stickiness.',
  },
  {
    rank: 4,
    brand: 'TONYMOLY',
    name: 'Ceramide Mochi Toner',
    rating: 4.72,
    reviews: 22563,
    size: '500ml',
    note: 'Ceramide-rich mochi-texture toner — the value buy of the moment in Seoul.',
  },
  {
    rank: 5,
    brand: 'WELLAGE',
    name: 'Real Hyaluronic Soothing Cream',
    rating: 4.64,
    reviews: 43859,
    size: '80ml',
    priceId: 'wellage_real_hyaluronic_soothing_cream_80ml_onetime',
    note: 'Gel-cream hydration weighted for oily and combination skin.',
  },
  {
    rank: 6,
    brand: 'ROUND LAB',
    name: 'Birch Moisture Sun Cream SPF50+ PA++++',
    rating: 4.6,
    reviews: 29902,
    size: '50ml',
    note: 'Hydrating, makeup-friendly SPF — Korea\u2019s most-reviewed sunscreen this week.',
  },
  {
    rank: 7,
    brand: 'S.NATURE',
    name: 'Aqua Oasis Toner',
    rating: 4.75,
    reviews: 28590,
    size: '210ml',
    priceId: 's_nature_aqua_oasis_toner_onetime',
    note: 'Highest-rated toner in the top ten, for sensitive and combination skin.',
  },
  {
    rank: 9,
    brand: 'S.NATURE',
    name: 'Aqua Squalane Moisturizing Cream',
    rating: 4.58,
    reviews: 43025,
    size: '60ml',
    priceId: 's_nature_aqua_squalane_moisturizing_cream_onetime',
    note: 'Non-comedogenic squalane cream that sits well under makeup.',
  },
  {
    rank: 11,
    brand: 'ROUND LAB',
    name: '1025 Dokdo Toner',
    rating: 4.43,
    reviews: 95136,
    size: '200ml',
    priceId: 'round_lab_1025_dokdo_toner_100ml_onetime',
    note: 'The most-reviewed product on the entire board — 95,000 verified reviews.',
  },
  {
    rank: 12,
    brand: 'ILLIYOON',
    name: 'Ceramide Ato 6.0 Top to Toe Wash',
    rating: 4.7,
    reviews: 11357,
    size: '500ml',
    note: 'Fragrance-free ceramide body and face wash, a Korean household staple.',
  },
  {
    rank: 13,
    brand: 'Anua',
    name: 'PDRN Hyaluronic Acid Capsule 100 Serum',
    rating: 4.61,
    reviews: 12468,
    size: '30ml',
    note: 'Biggest climber of the week — PDRN is the ingredient story of 2026.',
  },
  {
    rank: 14,
    brand: 'TORRIDEN',
    name: 'DIVE IN Soothing Cream',
    rating: 4.68,
    reviews: 26938,
    size: '100ml',
    priceId: 'torriden_dive_in_soothing_cream_onetime',
    note: 'Cooling gel-cream — the summer half of the DIVE IN routine.',
  },
  {
    rank: 15,
    brand: 'TORRIDEN',
    name: 'DIVE IN Low Molecular Hyaluronic Acid Toner',
    rating: 4.71,
    reviews: 35843,
    size: '300ml',
    note: 'Completes the DIVE IN layering routine ahead of the serum.',
  },
  {
    rank: 17,
    brand: 'MEDIHEAL',
    name: 'Madecassoside Essential Mask (Blemish Repair)',
    rating: 4.7,
    reviews: 7376,
    size: '10 sheets',
    note: 'Madecassoside sheet mask for redness and post-blemish repair.',
  },
  {
    rank: 18,
    brand: 'make p:rem',
    name: 'Safe Me. Relief Moisture Cleansing Milk',
    rating: 4.66,
    reviews: 8982,
    size: '200ml',
    note: 'New entry — a milk cleanser gentle enough to take off mineral SPF.',
  },
  {
    rank: 20,
    brand: 'beplain',
    name: 'Mung Bean Cleansing Oil',
    rating: 4.65,
    reviews: 13862,
    size: '200ml',
    priceId: 'beplain_mung_bean_cleansing_oil_200ml_onetime',
    note: 'Water-light first cleanse that dissolves SPF without a film.',
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
