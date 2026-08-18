// Resolution + content assembly for the product "How to apply" guides.
//
// Truthfulness rules encoded here:
//  * Step-by-step directions come from the project's own product copy
//    (`howToUse`) — flagged as product-specific only when that SKU has its own
//    written directions. Otherwise the UI must present them as general
//    guidance for the routine step.
//  * Amount / frequency / pro tip are only ever surfaced from the stored
//    `products` rows in the database. Nothing here invents them.

import { SHOP_PRODUCTS, type Category, type ShopProduct } from '@/lib/shop-catalog';
import {
  hasProductSpecificHowTo,
  howToUse,
  productSlug,
  routineStepLabel,
} from '@/lib/product-detail';
import type { ProductGuide } from '@/lib/application-guides';

/** Public, stable guide URL for a product (human-readable slug). */
export function guideUrlFor(p: ShopProduct): string {
  return `/guide/${productSlug(p)}`;
}

export function absoluteGuideUrl(p: ShopProduct): string {
  return `https://skingrocer.com.au${guideUrlFor(p)}`;
}

function normalise(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .filter((t) => t.length > 1 && !['the', 'and', 'for'].includes(t));
}

/**
 * Resolve a `/guide/:param` value to a catalog product.
 * Accepts, in order: the canonical slug, a Stripe price id (legacy QR links),
 * a legacy database product id, then a loose brand+name match.
 */
export function resolveGuideParam(param: string): ShopProduct | undefined {
  if (!param) return undefined;
  const raw = decodeURIComponent(param).trim();
  const bySlug = SHOP_PRODUCTS.find((p) => productSlug(p) === raw);
  if (bySlug) return bySlug;

  const byPriceId = SHOP_PRODUCTS.find((p) => p.priceId === raw);
  if (byPriceId) return byPriceId;

  const loose = raw.replace(/_onetime$/i, '').replace(/_/g, '-').toLowerCase();
  const byLoose = SHOP_PRODUCTS.find((p) => productSlug(p) === loose);
  if (byLoose) return byLoose;

  return matchProductByReference(raw);
}

/** Loose token match — used for legacy ids and order line-item names. */
export function matchProductByReference(reference: string): ShopProduct | undefined {
  const ref = normalise(reference);
  if (ref.length === 0) return undefined;
  let best: { product: ShopProduct; score: number } | undefined;
  for (const product of SHOP_PRODUCTS) {
    const target = new Set(normalise(`${product.brand} ${product.name}`));
    let score = 0;
    for (const token of ref) if (target.has(token)) score += 1;
    const ratio = score / ref.length;
    if (ratio >= 0.7 && (!best || score > best.score)) best = { product, score };
  }
  return best?.product;
}

// --- routine ladder ---------------------------------------------------------

export const ROUTINE_LADDER: Array<{ category: Category; label: string }> = [
  { category: 'Cleanse', label: 'Cleanse' },
  { category: 'Tone', label: 'Tone & prep' },
  { category: 'Treat', label: 'Treat' },
  { category: 'Moisturise', label: 'Moisturise' },
  { category: 'Protect', label: 'Protect (AM)' },
];

export function ladderIndexFor(p: ShopProduct): number {
  return ROUTINE_LADDER.findIndex((s) => s.category === p.category);
}

// --- assembled guide --------------------------------------------------------

export type GuideContent = {
  product: ShopProduct;
  slug: string;
  url: string;
  routineStep: string;
  /** Step-by-step directions. */
  steps: string[];
  /** True when the directions belong to this SKU rather than its routine step. */
  stepsAreProductSpecific: boolean;
  /** Verified extras, only when a stored product row matched. */
  amountToUse?: string;
  frequency?: string;
  proTip?: string;
};

/**
 * Strict stored-row match. Legacy Supabase `products` rows may describe SKUs we
 * no longer stock, so fuzzy matching must never enrich a current product.
 * Both directions must agree on every meaningful token.
 */
export function strictStoredMatch(
  product: ShopProduct,
  guides: ProductGuide[],
): ProductGuide | null {
  const mine = new Set(normalise(`${product.brand} ${product.name}`));
  for (const guide of guides) {
    const theirs = new Set(normalise(`${guide.brand} ${guide.name}`));
    if (mine.size !== theirs.size) continue;
    let same = true;
    for (const token of mine) if (!theirs.has(token)) same = false;
    if (same) return guide;
  }
  return null;
}

export function buildGuide(product: ShopProduct, stored?: ProductGuide | null): GuideContent {
  const verified = applicationForSlug(productSlug(product));
  return {
    product,
    slug: productSlug(product),
    url: guideUrlFor(product),
    routineStep: routineStepLabel(product),
    steps: howToUse(product),
    stepsAreProductSpecific: hasProductSpecificHowTo(product),
    amountToUse: verified?.amount ?? stored?.amount_to_use ?? undefined,
    frequency: verified?.frequency ?? stored?.frequency ?? undefined,
    proTip: verified?.note ?? stored?.pro_tip ?? undefined,
  };
}


/** Every product that can be linked from a QR code. */
export function allGuideTargets(): Array<{
  product: ShopProduct;
  slug: string;
  url: string;
  absoluteUrl: string;
  productSpecific: boolean;
}> {
  return SHOP_PRODUCTS.map((product) => ({
    product,
    slug: productSlug(product),
    url: guideUrlFor(product),
    absoluteUrl: absoluteGuideUrl(product),
    productSpecific: hasProductSpecificHowTo(product),
  })).sort((a, b) =>
    `${a.product.brand} ${a.product.name}`.localeCompare(`${b.product.brand} ${b.product.name}`),
  );
}
