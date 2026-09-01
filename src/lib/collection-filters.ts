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
  category: CategoryValue[];
  brand: string[];
  concern: Concern[];
  ingredient: string[];
  price: PriceBand[];
};

export const EMPTY_FILTERS: Filters = {
  category: [],
  brand: [],
  concern: [],
  ingredient: [],
  price: [],
};

export const FILTER_KEYS = ['category', 'brand', 'concern', 'ingredient', 'price'] as const;

/** Comma-separated, human-readable query params: ?category=cleanse,tone */
export function parseParam(raw: string | undefined): string[] {
  if (!raw) return [];
  return Array.from(new Set(raw.split(',').map((s) => s.trim()).filter(Boolean)));
}

export function serialiseParam(values: string[]): string | undefined {
  return values.length ? values.join(',') : undefined;
}

export function toggleValue(values: string[], value: string): string[] {
  return values.includes(value) ? values.filter((v) => v !== value) : [...values, value];
}

export function activeFilterCount(f: Filters): number {
  return FILTER_KEYS.reduce((n, k) => n + f[k].length, 0);
}

// OR within a group, AND across groups.
export function matchesFilters(p: ShopProduct, f: Filters): boolean {
  if (f.category.length && !f.category.some((c) => CATEGORY_LABELS[c] === p.category)) return false;
  if (f.brand.length && !f.brand.some((b) => b.toLowerCase() === p.brand.toLowerCase())) return false;
  if (f.concern.length && !f.concern.some((c) => p.concerns.includes(c))) return false;
  if (f.ingredient.length && !f.ingredient.some((i) => ingredientsFor(p).includes(i))) return false;
  if (f.price.length) {
    const price = productPrice(p);
    const ok = f.price.some((v) => PRICE_BANDS.find((b) => b.value === v)?.test(price));
    if (!ok) return false;
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
  const without = (key: keyof Filters) =>
    base.filter((p) => matchesFilters(p, { ...f, [key]: [] }));

  const count = <T,>(
    list: ShopProduct[],
    values: readonly T[],
    has: (p: ShopProduct, v: T) => boolean,
    selected: string[],
  ) =>
    values
      .map((v) => ({ value: String(v), count: list.filter((p) => has(p, v)).length }))
      .filter((o) => o.count > 0 || selected.includes(o.value));

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
    category: count(
      categoryPool,
      CATEGORY_VALUES,
      (p, v) => p.category === CATEGORY_LABELS[v],
      f.category,
    ).map((o) => ({ ...o, label: CATEGORY_LABELS[o.value as CategoryValue] })) as FacetOption[],
    brand: count(brandPool, brands, (p, v) => p.brand === v, f.brand).map((o) => ({
      ...o,
      label: o.value,
    })) as FacetOption[],
    concern: count(
      concernPool,
      Object.keys(CONCERN_LABELS) as Concern[],
      (p, v) => p.concerns.includes(v),
      f.concern,
    ).map((o) => ({ ...o, label: CONCERN_LABELS[o.value as Concern] })) as FacetOption[],
    // Only ingredients shared by a few products are useful as a facet — a
    // one-product ingredient is noise, not navigation.
    ingredient: (count(
      ingredientPool,
      ingredientNames,
      (p, v) => ingredientsFor(p).includes(v),
      f.ingredient,
    )
      .filter((o) => o.count >= 3 || f.ingredient.includes(o.value))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map((o) => ({ ...o, label: o.value })) as FacetOption[])
      .sort((a, b) => a.label.localeCompare(b.label)),
    price: PRICE_BANDS.map((b) => ({
      value: b.value,
      label: b.label,
      count: pricePool.filter((p) => b.test(productPrice(p))).length,
    })).filter((o) => o.count > 0 || f.price.includes(o.value)) as FacetOption[],
  };

}
