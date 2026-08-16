// Canonical template for the generated "key ingredients" gallery image.
//
// Every product's ingredient panel image must be generated with this prompt
// builder so the whole catalogue shares one modern, Nudie Glow-inspired
// formatting: warm cream ground, soft peach accents, bold sans headline and
// rounded ingredient cards with thin-line icons.
//
// Only real, brand-sourced ingredient facts may be passed in.

import type { ShopProduct } from '@/lib/shop-catalog';
import { brandSlug } from '@/lib/product-detail';

export type PanelRow = {
  /** Ingredient or property name, e.g. "CERAMIDE COMPLEX". */
  label: string;
  /** Short factual benefit, e.g. "reinforces the skin barrier". */
  benefit: string;
};

export const INGREDIENT_PANEL_STYLE = [
  'Modern minimal Korean skincare ingredient infographic.',
  'Soft warm cream background with subtle peach and sand organic accent shapes in the corners.',
  'Bold contemporary sans-serif headline "KEY INGREDIENTS" in charcoal,',
  'small letter-spaced eyebrow line "SCIENCE-BACKED, SKIN-LOVING" above it.',
  'Ingredient rows as rounded white cards with a soft shadow, generous spacing,',
  'each with a simple thin-line icon inside a pale peach circle on the left.',
  'Crisp legible typography, lots of white space, editorial e-commerce design,',
  'no product bottle, no photography, no people.',
].join(' ');

/** Builds the image prompt for a product's ingredient panel. */
export function ingredientPanelPrompt(rows: PanelRow[]): string {
  const body = rows
    .map((r) => `"${r.label.toUpperCase()}" with subtext "${r.benefit}"`)
    .join('; ');
  return `${INGREDIENT_PANEL_STYLE} ${rows.length} cards stacked vertically: ${body}.`;
}

/** Convention for where a SKU's editorial images live. */
export function editorialPaths(p: ShopProduct) {
  const base = p.image.split('/').pop()?.replace(/\.[a-z0-9]+$/i, '') ?? '';
  const dir = `/products/editorial/${brandSlug(p.brand)}`;
  return {
    hero: `${dir}/${base}-hero.png`,
    info: `${dir}/${base}-info.png`,
    apply: `${dir}/${base}-apply.png`,
  };
}

/** Square canvas every panel image is generated at. */
export const INGREDIENT_PANEL_SIZE = { width: 1024, height: 1024 } as const;
