// Facet + sort logic for the collection pages. Every facet is derived from real
// catalog data — nothing here invents attributes a product doesn't have.

import { SHOP_PRODUCTS, productPrice, type Concern, type ShopProduct } from '@/lib/shop-catalog';
import { heroIngredients } from '@/lib/product-detail';

export const CATEGORY_VALUES = ['cleanse', 'tone', 'treat', 'moisturise', 'protect', 'masks'] as const;
export type CategoryValue = (typeof CATEGORY_VALUES)[number];

export const CATEGORY_LABELS: Record<CategoryValue, string> = {
  cleanse: 'Cleanse',
  tone: 'Tone',
  treat: 'Treat',
  moisturise: 'Moisturise',
  protect: 'Protect',
  masks: 'Masks',
};

export const CONCERN_LABELS: Record<Concern, string> = {
  hydration: 'Dryness & dehydration',
  acne: 'Blemish-prone',
  pigmentation: 'Uneven tone',
  sensitivity: 'Easily unsettled',
  'anti-aging': 'Firmness & fine lines',
  barrier: 'Barrier-focused',
};

export const PRICE_BANDS = [
  { value: 'under-30', label: 'Under $30', test: (n: number) => n < 30 },
  { value: '30-40', label: '$30 – $40', test: (n: number) => n >= 30 && n <= 40 },
  { value: 'over-40', label: 'Over $40', test: (n: number) => n > 40 },
] as const;
export type PriceBand = (typeof PRICE_BANDS)[number]['value'];

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'brand', label: 'Brand: A–Z' },
  { value: 'name', label: 'Name: A–Z' },
] as const;
export type SortValue = (typeof SORT_OPTIONS)[number]['value'];

/** Key ingredients we actually hold editorial data for, per product. */
const INGREDIENTS_BY_PRICE_ID = new Map<string, string[]>(
  SHOP_PRODUCTS.map((p) => [p.priceId, heroIngredients(p).map((i) => i.name)]),
);

export function ingredientsFor(p: ShopProduct): string[] {
  return INGREDIENTS_BY_PRICE_ID.get(p.priceId) ?? [];
}

export type Filters = {
  category?: CategoryValue;
  brand?: string;
  concern?: Concern;
  ingredient?: string;
  price?: PriceBand;
};

export function matchesFilters(p: ShopProduct, f: Filters): boolean {
  if (f.category && CATEGORY_LABELS[f.category] !== p.category) return false;
  if (f.brand && p.brand.toLowerCase() !== f.brand.toLowerCase()) return false;
  if (f.concern && !p.concerns.includes(f.concern)) return false;
  if (f.ingredient && !ingredientsFor(p).includes(f.ingredient)) return false;
  if (f.price) {
    const band = PRICE_BANDS.find((b) => b.value === f.price);
    if (band && !band.test(productPrice(p))) return false;
  }
  return true;
}

export function sortProducts(list: ShopProduct[], sort: SortValue): ShopProduct[] {
  const copy = [...list];
  switch (sort) {
    case 'price-asc':
      return copy.sort((a, b) => productPrice(a) - productPrice(b));
    case 'price-desc':
      return copy.sort((a, b) => productPrice(b) - productPrice(a));
    case 'brand':
      return copy.sort((a, b) => a.brand.localeCompare(b.brand) || a.name.localeCompare(b.name));
    case 'name':
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return copy;
  }
}

export type FacetOption = { value: string; label: string; count: number };

/**
 * Counts every facet option against the products that match the OTHER active
 * filters, so a facet never offers a combination that returns nothing.
 */
export function buildFacets(base: ShopProduct[], f: Filters) {
  const without = (key: keyof Filters) => {
    const rest = { ...f };
    delete rest[key];
    return base.filter((p) => matchesFilters(p, rest));
  };

  const count = <T,>(list: ShopProduct[], values: readonly T[], has: (p: ShopProduct, v: T) => boolean) =>
    values
      .map((v) => ({ value: String(v), count: list.filter((p) => has(p, v)).length }))
      .filter((o) => o.count > 0);

  const categoryPool = without('category');
  const brandPool = without('brand');
  const concernPool = without('concern');
  const ingredientPool = without('ingredient');
  const pricePool = without('price');

  const brands = Array.from(new Set(base.map((p) => p.brand))).sort((a, b) => a.localeCompare(b));
  const ingredientNames = Array.from(new Set(base.flatMap(ingredientsFor))).sort((a, b) =>
    a.localeCompare(b),
  );

  return {
    category: count(categoryPool, CATEGORY_VALUES, (p, v) => p.category === CATEGORY_LABELS[v]).map(
      (o) => ({ ...o, label: CATEGORY_LABELS[o.value as CategoryValue] }),
    ) as FacetOption[],
    brand: count(brandPool, brands, (p, v) => p.brand === v).map((o) => ({
      ...o,
      label: o.value,
    })) as FacetOption[],
    concern: count(
      concernPool,
      Object.keys(CONCERN_LABELS) as Concern[],
      (p, v) => p.concerns.includes(v),
    ).map((o) => ({ ...o, label: CONCERN_LABELS[o.value as Concern] })) as FacetOption[],
    ingredient: count(ingredientPool, ingredientNames, (p, v) => ingredientsFor(p).includes(v)).map(
      (o) => ({ ...o, label: o.value }),
    ) as FacetOption[],
    price: PRICE_BANDS.map((b) => ({
      value: b.value,
      label: b.label,
      count: pricePool.filter((p) => b.test(productPrice(p))).length,
    })).filter((o) => o.count > 0) as FacetOption[],
  };
}
