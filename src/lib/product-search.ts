// Centralised, auditable search logic for the live SkinGrocer catalog.
//
// Rules encoded here:
//  * SHOP_PRODUCTS is the only product source — nothing else is searchable.
//  * Synonyms only ever map customer language onto catalog facts that already
//    exist (a Concern or a Category). Nothing here invents benefits, claims,
//    ingredients or popularity.
//  * Ranking is deterministic: identical queries always produce identical
//    ordering, and ties break on brand + name so results never shuffle.

import {
  SHOP_PRODUCTS,
  productPrice,
  type Category,
  type Concern,
  type ShopProduct,
} from '@/lib/shop-catalog';
import { CATEGORY_LABELS, CONCERN_LABELS, type CategoryValue } from '@/lib/collection-filters';
import { productSlug, routineStepLabel } from '@/lib/product-detail';

// ---------------------------------------------------------------------------
// Vocabulary
// ---------------------------------------------------------------------------

/**
 * Customer language → catalog facets. Every right-hand value must be a real
 * `Concern` or `Category`; add new phrasings here rather than in components.
 */
type SynonymTarget = { concerns?: Concern[]; categories?: Category[] };

export const SEARCH_SYNONYMS: Record<string, SynonymTarget> = {
  // --- hydration ---
  dry: { concerns: ['hydration'] },
  dryness: { concerns: ['hydration'] },
  dehydrated: { concerns: ['hydration'] },
  dehydration: { concerns: ['hydration'] },
  thirsty: { concerns: ['hydration'] },
  tight: { concerns: ['hydration'] },
  flaky: { concerns: ['hydration'] },
  hydration: { concerns: ['hydration'] },
  hydrating: { concerns: ['hydration'] },
  moisture: { concerns: ['hydration'] },
  glow: { concerns: ['hydration'] },
  dull: { concerns: ['hydration', 'pigmentation'] },
  dullness: { concerns: ['hydration', 'pigmentation'] },
  'glass skin': { concerns: ['hydration'] },

  // --- acne / congestion ---
  acne: { concerns: ['acne'] },
  spots: { concerns: ['acne'] },
  spot: { concerns: ['acne'] },
  pimples: { concerns: ['acne'] },
  pimple: { concerns: ['acne'] },
  breakout: { concerns: ['acne'] },
  breakouts: { concerns: ['acne'] },
  blemish: { concerns: ['acne'] },
  blemishes: { concerns: ['acne'] },
  congestion: { concerns: ['acne'] },
  congested: { concerns: ['acne'] },
  blackheads: { concerns: ['acne'] },
  pores: { concerns: ['acne'] },
  pore: { concerns: ['acne'] },
  oily: { concerns: ['acne'] },
  oil: { concerns: ['acne'] },
  shiny: { concerns: ['acne'] },

  // --- pigmentation ---
  pigmentation: { concerns: ['pigmentation'] },
  'dark marks': { concerns: ['pigmentation'] },
  'dark spots': { concerns: ['pigmentation'] },
  marks: { concerns: ['pigmentation'] },
  brightening: { concerns: ['pigmentation'] },
  brighten: { concerns: ['pigmentation'] },
  'uneven tone': { concerns: ['pigmentation'] },
  uneven: { concerns: ['pigmentation'] },
  tone: { concerns: ['pigmentation'] },
  melasma: { concerns: ['pigmentation'] },
  'sun damage': { concerns: ['pigmentation'] },

  // --- sensitivity ---
  sensitive: { concerns: ['sensitivity'] },
  sensitivity: { concerns: ['sensitivity'] },
  redness: { concerns: ['sensitivity'] },
  red: { concerns: ['sensitivity'] },
  reactive: { concerns: ['sensitivity'] },
  irritation: { concerns: ['sensitivity'] },
  irritated: { concerns: ['sensitivity'] },
  calming: { concerns: ['sensitivity'] },
  soothing: { concerns: ['sensitivity'] },
  stinging: { concerns: ['sensitivity'] },
  rosacea: { concerns: ['sensitivity'] },

  // --- anti-aging ---
  ageing: { concerns: ['anti-aging'] },
  aging: { concerns: ['anti-aging'] },
  'anti aging': { concerns: ['anti-aging'] },
  'anti ageing': { concerns: ['anti-aging'] },
  wrinkles: { concerns: ['anti-aging'] },
  wrinkle: { concerns: ['anti-aging'] },
  'fine lines': { concerns: ['anti-aging'] },
  lines: { concerns: ['anti-aging'] },
  firmness: { concerns: ['anti-aging'] },
  firming: { concerns: ['anti-aging'] },
  elasticity: { concerns: ['anti-aging'] },
  sagging: { concerns: ['anti-aging'] },
  plump: { concerns: ['anti-aging'] },

  // --- barrier ---
  barrier: { concerns: ['barrier'] },
  damaged: { concerns: ['barrier'] },
  stressed: { concerns: ['barrier'] },
  compromised: { concerns: ['barrier'] },
  'skin barrier': { concerns: ['barrier'] },
  repair: { concerns: ['barrier'] },
  eczema: { concerns: ['barrier', 'sensitivity'] },

  // --- category / routine-step language ---
  cleanser: { categories: ['Cleanse'] },
  cleansers: { categories: ['Cleanse'] },
  cleanse: { categories: ['Cleanse'] },
  cleansing: { categories: ['Cleanse'] },
  wash: { categories: ['Cleanse'] },
  facewash: { categories: ['Cleanse'] },
  foam: { categories: ['Cleanse'] },
  'double cleanse': { categories: ['Cleanse'] },
  toner: { categories: ['Tone'] },
  toners: { categories: ['Tone'] },
  essence: { categories: ['Tone', 'Treat'] },
  serum: { categories: ['Treat'] },
  serums: { categories: ['Treat'] },
  ampoule: { categories: ['Treat'] },
  ampoules: { categories: ['Treat'] },
  treatment: { categories: ['Treat'] },
  treat: { categories: ['Treat'] },
  moisturiser: { categories: ['Moisturise'] },
  moisturizer: { categories: ['Moisturise'] },
  moisturisers: { categories: ['Moisturise'] },
  moisturizers: { categories: ['Moisturise'] },
  cream: { categories: ['Moisturise'] },
  creams: { categories: ['Moisturise'] },
  lotion: { categories: ['Moisturise'] },
  gel: { categories: ['Moisturise'] },
  sunscreen: { categories: ['Protect'] },
  suncream: { categories: ['Protect'] },
  sunblock: { categories: ['Protect'] },
  spf: { categories: ['Protect'] },
  sun: { categories: ['Protect'] },
  uv: { categories: ['Protect'] },
  mask: { categories: ['Masks'] },
  masks: { categories: ['Masks'] },
  'sheet mask': { categories: ['Masks'] },
  'eye cream': { categories: ['Moisturise'] },
};

/**
 * Queries that mean "help me decide" rather than "find this product". These
 * surface a secondary path into the deterministic consultation — they never
 * replace product results.
 */
const BROAD_INTENT = [
  'routine',
  'routines',
  'what do i need',
  'what should i use',
  "i don't know",
  'i dont know',
  'not sure',
  'help',
  'advice',
  'recommend',
  'recommendation',
  'recommendations',
  'quiz',
  'consultation',
  'consult',
  'where to start',
  'beginner',
  'starter',
  'skin type',
];

export function isBroadIntent(query: string): boolean {
  const q = normalise(query);
  if (!q) return false;
  return BROAD_INTENT.some((phrase) => q === phrase || q.includes(phrase));
}

// ---------------------------------------------------------------------------
// Text utilities
// ---------------------------------------------------------------------------

export function normalise(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9%+]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const STOP_WORDS = new Set(['for', 'the', 'and', 'with', 'my', 'a', 'an', 'of', 'to', 'skin', 'best']);

function tokenise(query: string): string[] {
  return normalise(query)
    .split(' ')
    .filter((t) => t.length > 0 && !STOP_WORDS.has(t));
}

/** Bounded Levenshtein — returns `max + 1` as soon as the budget is exceeded. */
function editDistance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    let best = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      const value = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + cost);
      row.push(value);
      if (value < best) best = value;
    }
    if (best > max) return max + 1;
    prev = row;
  }
  return prev[b.length];
}

/** Typo budget: none for short words, 1 from 4 chars, 2 from 8 chars. */
function typoBudget(token: string): number {
  if (token.length >= 8) return 2;
  if (token.length >= 4) return 1;
  return 0;
}

function fuzzyHit(token: string, words: string[]): boolean {
  const budget = typoBudget(token);
  if (budget === 0) return false;
  return words.some((w) => w.length >= 4 && editDistance(token, w, budget) <= budget);
}

// ---------------------------------------------------------------------------
// Query interpretation
// ---------------------------------------------------------------------------

export type QueryIntent = {
  raw: string;
  normalised: string;
  tokens: string[];
  concerns: Concern[];
  categories: Category[];
  /** Synonym phrases that actually matched, for "why this matched" context. */
  matchedTerms: string[];
};

export function interpretQuery(query: string): QueryIntent {
  const normalised = normalise(query);
  const tokens = tokenise(query);
  const concerns = new Set<Concern>();
  const categories = new Set<Category>();
  const matchedTerms: string[] = [];

  for (const [term, target] of Object.entries(SEARCH_SYNONYMS)) {
    const hit = term.includes(' ')
      ? normalised.includes(term)
      : tokens.some((t) => t === term || fuzzyHit(t, [term]));
    if (!hit) continue;
    matchedTerms.push(term);
    target.concerns?.forEach((c) => concerns.add(c));
    target.categories?.forEach((c) => categories.add(c));
  }

  return {
    raw: query,
    normalised,
    tokens,
    concerns: [...concerns],
    categories: [...categories],
    matchedTerms,
  };
}

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------

export type SearchResult = {
  product: ShopProduct;
  slug: string;
  score: number;
  /** Short, factual reason shown under the result (never a claim). */
  context: string;
};

type Indexed = {
  product: ShopProduct;
  slug: string;
  brand: string;
  name: string;
  full: string;
  words: string[];
};

const INDEX: Indexed[] = SHOP_PRODUCTS.map((p) => {
  const brand = normalise(p.brand);
  const name = normalise(p.name);
  const full = `${brand} ${name} ${normalise(p.category)}`;
  return { product: p, slug: productSlug(p), brand, name, full, words: full.split(' ') };
});

/** Every brand in the live catalog, normalised for exact-brand detection. */
const BRANDS = Array.from(new Set(SHOP_PRODUCTS.map((p) => p.brand)));

function contextFor(p: ShopProduct, intent: QueryIntent): string {
  const step = routineStepLabel(p);
  const concernHit = p.concerns.find((c) => intent.concerns.includes(c));
  if (concernHit) return `${step} · ${CONCERN_LABELS[concernHit]}`;
  return step;
}

/**
 * Rank the catalog against a query.
 *
 * Ordering, highest weight first:
 *  1. exact / prefix match on the full product title or brand
 *  2. every token present in brand + name
 *  3. partial token matches on name, then brand
 *  4. typo-tolerant token matches
 *  5. category matches inferred from the query
 *  6. concern matches inferred from the query
 * Coming-soon products are never boosted above orderable ones at equal score.
 */
export function searchCatalog(query: string, limit?: number): SearchResult[] {
  const intent = interpretQuery(query);
  if (!intent.normalised) return [];

  const exactBrand = BRANDS.find((b) => normalise(b) === intent.normalised);

  const scored: SearchResult[] = [];
  for (const entry of INDEX) {
    let score = 0;

    const title = `${entry.brand} ${entry.name}`;
    if (title === intent.normalised || entry.name === intent.normalised) score += 220;
    else if (title.startsWith(intent.normalised) || entry.name.startsWith(intent.normalised)) score += 150;
    else if (entry.name.includes(intent.normalised)) score += 110;

    if (exactBrand && entry.product.brand === exactBrand) score += 120;
    else if (intent.normalised.length >= 3 && entry.brand.includes(intent.normalised)) score += 70;

    let tokenHits = 0;
    for (const token of intent.tokens) {
      if (entry.name.includes(token)) {
        score += 28;
        tokenHits += 1;
      } else if (entry.brand.includes(token)) {
        score += 22;
        tokenHits += 1;
      } else if (fuzzyHit(token, entry.words)) {
        score += 14;
        tokenHits += 1;
      }
    }
    // Everything the customer typed appears somewhere in the title.
    if (intent.tokens.length > 1 && tokenHits === intent.tokens.length) score += 40;

    for (const category of intent.categories) {
      if (entry.product.category === category) score += 34;
    }
    for (const concern of intent.concerns) {
      if (entry.product.concerns.includes(concern)) score += 26;
    }

    if (score <= 0) continue;
    if (entry.product.comingSoon) score -= 5;

    scored.push({ product: entry.product, slug: entry.slug, score, context: contextFor(entry.product, intent) });
  }

  scored.sort(
    (a, b) =>
      b.score - a.score ||
      Number(Boolean(a.product.comingSoon)) - Number(Boolean(b.product.comingSoon)) ||
      productPrice(a.product) - productPrice(b.product) ||
      `${a.product.brand} ${a.product.name}`.localeCompare(`${b.product.brand} ${b.product.name}`),
  );

  return typeof limit === 'number' ? scored.slice(0, limit) : scored;
}

// ---------------------------------------------------------------------------
// Pre-typing discovery — derived from the catalog, never from invented data
// ---------------------------------------------------------------------------

export type Shortcut = { label: string; count: number; search: Record<string, string> };

function countBy(predicate: (p: ShopProduct) => boolean): number {
  return SHOP_PRODUCTS.filter(predicate).length;
}

export const CATEGORY_SHORTCUTS: Shortcut[] = (
  Object.keys(CATEGORY_LABELS) as CategoryValue[]
).map((value) => ({
  label: CATEGORY_LABELS[value],
  count: countBy((p) => p.category === CATEGORY_LABELS[value]),
  search: { category: value },
})).filter((s) => s.count > 0);

export const CONCERN_SHORTCUTS: Shortcut[] = (Object.keys(CONCERN_LABELS) as Concern[])
  .map((value) => ({
    label: CONCERN_LABELS[value],
    count: countBy((p) => p.concerns.includes(value)),
    search: { concern: value },
  }))
  .filter((s) => s.count > 0);

export const BRAND_SHORTCUTS: Shortcut[] = BRANDS.map((brand) => ({
  label: brand,
  count: countBy((p) => p.brand === brand),
  search: { brand },
})).sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

export const CATALOG_SIZE = SHOP_PRODUCTS.length;
