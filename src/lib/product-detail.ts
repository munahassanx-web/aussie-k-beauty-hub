// Product detail data layer: slugs, editorial copy, hero-ingredient breakdowns
// and lifestyle imagery for every SKU in the launch assortment.

import { SHOP_PRODUCTS, type ShopProduct, type Category, type Concern } from '@/lib/shop-catalog';

import ritualScene from '@/assets/ritual-scene.jpg';
import productFlatlay from '@/assets/product-flatlay.jpg';
import textureMacro from '@/assets/texture-macro.jpg';
import skinMacro from '@/assets/skin-macro.jpg';
import applyingSerumAsset from '@/assets/applying-serum.png.asset.json';
import learnFeatureSerum from '@/assets/learn-feature-serum.jpg';
import heroDewy from '@/assets/hero-dewy.jpg';
import glow from '@/assets/glow.jpg';
import categoryMasks from '@/assets/category-masks.jpg';
import maskSheet from '@/assets/mask-mediheal-sheet.jpg';

export type GalleryImage = { src: string; alt: string };

export function brandSlug(brand: string): string {
  return brand
    .toLowerCase()
    .replace(/\./g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Stable, unique, human-readable URL slug for a product. */
export function productSlug(p: ShopProduct): string {
  const file = p.image.split('/').pop()?.replace(/\.[a-z0-9]+$/i, '') ?? '';
  const base = file || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const brand = brandSlug(p.brand);
  return base.startsWith(brand) ? base : `${brand}-${base}`;
}

export function findProductBySlug(slug: string): ShopProduct | undefined {
  return SHOP_PRODUCTS.find((p) => productSlug(p) === slug);
}

export const ALL_PRODUCT_SLUGS = SHOP_PRODUCTS.map(productSlug);

// --- imagery ---------------------------------------------------------------

const LIFESTYLE: Record<Category, GalleryImage[]> = {
  Cleanse: [
    { src: ritualScene, alt: 'Cleansing step in a morning skincare ritual' },
    { src: productFlatlay, alt: 'Korean skincare flatlay on a neutral surface' },
  ],
  Tone: [
    { src: textureMacro, alt: 'Close-up of a watery toner texture' },
    { src: skinMacro, alt: 'Macro shot of hydrated, even-toned skin' },
  ],
  Treat: [
    { src: applyingSerumAsset.url, alt: 'Serum being pressed into the skin of a face' },
    { src: learnFeatureSerum, alt: 'Serum dropper held against soft daylight' },
  ],
  Moisturise: [
    { src: skinMacro, alt: 'Macro shot of plump, moisturised skin' },
    { src: productFlatlay, alt: 'Moisturiser styled with other routine steps' },
  ],
  Protect: [
    { src: heroDewy, alt: 'Dewy sun-protected skin in natural daylight' },
    { src: glow, alt: 'Glass-skin glow after sunscreen application' },
  ],
  Masks: [
    { src: categoryMasks, alt: 'K-beauty masks arranged on a vanity' },
    { src: maskSheet, alt: 'Sheet mask being applied to a face' },
  ],
};

/**
 * Bespoke editorial imagery generated from the real product shot.
 * Keyed by priceId; these sit right after the packshot in the gallery.
 */
const EDITORIAL: Record<string, GalleryImage[]> = {
  torriden_dive_in_serum_onetime: [
    {
      src: '/products/editorial/torriden/dive-in-serum-studio.png',
      alt: 'Torriden Dive In Serum on a clean white studio backdrop with a hydrating gel swatch',
    },
  ],
  medicube_pdrn_pink_peptide_serum_30ml_onetime: [
    {
      src: '/products/editorial/medicube/pdrn-pink-peptide-serum-30ml-studio.png',
      alt: 'MEDICUBE PDRN Pink Peptide Serum with a serum droplet swatch on a clean white studio backdrop',
    },
  ],
  medicube_collagen_jelly_cream_110ml_onetime: [
    {
      src: '/products/editorial/medicube/collagen-jelly-cream-110ml-studio.png',
      alt: 'MEDICUBE Collagen Jelly Cream jar with lid and a glossy jelly swatch on a clean white studio backdrop',
    },
  ],
  beauty_of_joseon_revive_eye_serum_ginseng_plus_retinal_30ml_onetime: [
    {
      src: '/products/editorial/beauty-of-joseon/revive-eye-serum-ginseng-plus-retinal-30ml-studio.png',
      alt: 'Beauty of Joseon Revive Eye Serum close-up on a clean white studio backdrop',
    },
  ],
};

export function galleryFor(p: ShopProduct): GalleryImage[] {
  return [
    { src: p.image, alt: `${p.brand} ${p.name}` },
    ...(EDITORIAL[p.priceId] ?? []),
    ...LIFESTYLE[p.category],
  ];
}

// --- editorial copy ---------------------------------------------------------

const CONCERN_LABEL: Record<Concern, string> = {
  hydration: 'dehydration and tightness',
  acne: 'congestion and breakouts',
  pigmentation: 'uneven tone and dark marks',
  sensitivity: 'redness and reactivity',
  'anti-aging': 'fine lines and loss of bounce',
  barrier: 'a compromised moisture barrier',
};

const CATEGORY_ROLE: Record<Category, string> = {
  Cleanse: 'Step 1 — cleanse',
  Tone: 'Step 2 — tone & prep',
  Treat: 'Step 3 — treat',
  Moisturise: 'Step 4 — moisturise',
  Protect: 'Step 5 — protect',
  Masks: 'Weekly treatment',
};

export function routineStepLabel(p: ShopProduct): string {
  return CATEGORY_ROLE[p.category];
}

const CATEGORY_HOW_TO: Record<Category, string[]> = {
  Cleanse: [
    'Warm a small amount between clean hands.',
    'Massage over damp skin for 30–60 seconds, avoiding the eyes.',
    'Rinse with lukewarm water and pat dry — never rub.',
  ],
  Tone: [
    'Decant 2–3 drops onto your palms straight after cleansing.',
    'Press into damp skin rather than swiping, so nothing evaporates.',
    'Follow immediately with your serum while skin is still tacky.',
  ],
  Treat: [
    'Use 2–3 drops on clean, slightly damp skin.',
    'Press outward from the centre of the face; skip the eye area unless stated.',
    'Wait 30 seconds before your moisturiser so it absorbs fully.',
  ],
  Moisturise: [
    'Warm a pea-to-almond sized amount between fingertips.',
    'Press over the face and down the neck in upward motions.',
    'Use morning and night — in Australian summer, go lighter in the AM.',
  ],
  Protect: [
    'Apply as the last step of your morning routine.',
    'Use two finger-lengths for full face and neck coverage.',
    'Reapply every two hours outdoors — non-negotiable under Australian UV.',
  ],
  Masks: [
    'Apply to clean, toned skin.',
    'Leave on for the recommended time (usually 10–20 minutes).',
    'Remove and press in the remaining essence — no need to rinse unless stated.',
  ],
};

export function howToUse(p: ShopProduct): string[] {
  return CATEGORY_HOW_TO[p.category];
}

export function productDescription(p: ShopProduct): string {
  const concerns = p.concerns.map((c) => CONCERN_LABEL[c]);
  const list =
    concerns.length > 1
      ? `${concerns.slice(0, -1).join(', ')} and ${concerns[concerns.length - 1]}`
      : concerns[0] ?? 'everyday skin health';
  return `${p.brand}'s ${p.name} is a ${p.category.toLowerCase()} step formulated for ${list}. We stock it because it earns its place in a real Australian routine — a climate of hard water, air-conditioning and high UV. Sourced directly through verified brand channels and held in our Melbourne warehouse, so what lands on your doorstep is the same batch you'd buy in Seoul.`;
}

export function productBenefits(p: ShopProduct): string[] {
  const base = p.concerns.map((c) => {
    switch (c) {
      case 'hydration':
        return 'Restores water content for a plumper, less tight feel';
      case 'acne':
        return 'Helps keep pores clear and calms active congestion';
      case 'pigmentation':
        return 'Works on uneven tone, post-blemish marks and dullness';
      case 'sensitivity':
        return 'Soothing, fragrance-conscious formula for reactive skin';
      case 'anti-aging':
        return 'Supports firmness and softens the look of fine lines';
      case 'barrier':
        return 'Rebuilds a stressed moisture barrier over time';
    }
  });
  return [...base, 'Authentic stock, shipped from our Melbourne warehouse'];
}

// --- hero ingredients -------------------------------------------------------

export type HeroIngredient = { name: string; korean?: string; what: string; goodFor: string[] };

const INGREDIENT_RULES: { match: RegExp; ing: HeroIngredient }[] = [
  {
    match: /hyaluronic|hyalu|dive in|water essence/i,
    ing: {
      name: 'Hyaluronic Acid',
      korean: '히알루론산',
      what: 'A humectant that holds many times its weight in water, pulling moisture into the upper layers of skin so it looks plump instead of tight.',
      goodFor: ['Dehydration', 'Fine lines', 'All skin types'],
    },
  },
  {
    match: /pdrn/i,
    ing: {
      name: 'PDRN (Polydeoxyribonucleotide)',
      what: 'A salmon-derived DNA fragment used widely in Korean clinics to support skin repair, elasticity and post-blemish recovery.',
      goodFor: ['Elasticity', 'Repair', 'Post-blemish marks'],
    },
  },
  {
    match: /cica|centella|madagascar|cicaful/i,
    ing: {
      name: 'Centella Asiatica (Cica)',
      korean: '병풀추출물',
      what: 'The calming workhorse of K-beauty. Madecassoside and asiaticoside help settle visible redness and support barrier recovery.',
      goodFor: ['Redness', 'Sensitivity', 'Barrier repair'],
    },
  },
  {
    match: /ceramide/i,
    ing: {
      name: 'Ceramides',
      what: 'The lipids your barrier is literally built from. Topping them up reduces water loss and that stinging feeling after cleansing.',
      goodFor: ['Barrier repair', 'Dryness', 'Sensitivity'],
    },
  },
  {
    match: /niacin|vita ?c|vitamin c|deep vita|tone brightening|brighten/i,
    ing: {
      name: 'Niacinamide / Vitamin C complex',
      what: 'Brightening actives that work on uneven tone, post-blemish marks and oil balance without the sting of stronger acids.',
      goodFor: ['Pigmentation', 'Dullness', 'Oil control'],
    },
  },
  {
    match: /bha|salicylic|chestnut|pore/i,
    ing: {
      name: 'BHA (Salicylic Acid)',
      what: 'An oil-soluble exfoliant that gets inside the pore lining to clear the build-up behind blackheads and closed comedones.',
      goodFor: ['Congestion', 'Blackheads', 'Oily skin'],
    },
  },
  {
    match: /collagen/i,
    ing: {
      name: 'Hydrolysed Collagen',
      what: 'Low-weight collagen peptides that sit on the surface and hold water, giving an immediate bouncy, filled-out finish.',
      goodFor: ['Plumpness', 'Fine lines', 'Overnight hydration'],
    },
  },
  {
    match: /retinal|retinol|revive eye/i,
    ing: {
      name: 'Retinal (Retinaldehyde)',
      what: 'A gentler, faster-acting cousin of retinol that supports cell turnover and firmness. Start twice a week, always with SPF.',
      goodFor: ['Fine lines', 'Texture', 'Firmness'],
    },
  },
  {
    match: /propolis|honey/i,
    ing: {
      name: 'Propolis Extract',
      what: 'Bee-derived, antioxidant-rich and quietly antibacterial — it gives that glazed finish while calming irritated skin.',
      goodFor: ['Glow', 'Blemish-prone skin', 'Antioxidants'],
    },
  },
  {
    match: /green tea|heartleaf|mugwort|houttuynia/i,
    ing: {
      name: 'Botanical soothing extract',
      what: 'Green tea, heartleaf and mugwort extracts are antioxidant-rich botanicals used to bring down visible heat and reactivity.',
      goodFor: ['Redness', 'Sensitivity', 'Antioxidants'],
    },
  },
  {
    match: /rice|black rice|birch|mung bean|yam root|sea kelp/i,
    ing: {
      name: 'Fermented plant extract',
      what: 'Rice, birch sap, mung bean and kelp ferments deliver amino acids and minerals for soft, quietly brightened skin.',
      goodFor: ['Brightening', 'Softness', 'Gentle care'],
    },
  },
  {
    match: /peptide/i,
    ing: {
      name: 'Peptide complex',
      what: 'Short amino-acid chains that signal the skin to behave younger — used for firmness and resilience over weeks, not days.',
      goodFor: ['Firmness', 'Elasticity', 'Anti-ageing'],
    },
  },
  {
    match: /sun|spf|uv365|suncream|sunscreen/i,
    ing: {
      name: 'Broad-spectrum UV filters',
      what: 'Modern Korean and mineral filters that block UVA and UVB without the heavy white cast of older Australian formulas.',
      goodFor: ['UV protection', 'Pigmentation prevention', 'Daily use'],
    },
  },
  {
    match: /exosome/i,
    ing: {
      name: 'Exosome technology',
      what: 'Cell-signalling vesicles used in clinical Korean skincare to accelerate visible repair and refine pore appearance.',
      goodFor: ['Pores', 'Repair', 'Texture'],
    },
  },
];

const CONCERN_FALLBACK: Record<Concern, HeroIngredient> = {
  hydration: INGREDIENT_RULES[0].ing,
  'anti-aging': INGREDIENT_RULES[11].ing,
  acne: INGREDIENT_RULES[5].ing,
  pigmentation: INGREDIENT_RULES[4].ing,
  sensitivity: INGREDIENT_RULES[2].ing,
  barrier: INGREDIENT_RULES[3].ing,
};

export function heroIngredients(p: ShopProduct): HeroIngredient[] {
  const haystack = `${p.brand} ${p.name}`;
  const found: HeroIngredient[] = [];
  for (const rule of INGREDIENT_RULES) {
    if (rule.match.test(haystack) && !found.some((f) => f.name === rule.ing.name)) {
      found.push(rule.ing);
    }
  }
  for (const c of p.concerns) {
    const fb = CONCERN_FALLBACK[c];
    if (found.length >= 3) break;
    if (!found.some((f) => f.name === fb.name)) found.push(fb);
  }
  return found.slice(0, 3);
}

/** Other products from the same brand or targeting the same concern. */
export function relatedProducts(p: ShopProduct, limit = 4): ShopProduct[] {
  const sameBrand = SHOP_PRODUCTS.filter((x) => x.brand === p.brand && x.priceId !== p.priceId);
  const sameConcern = SHOP_PRODUCTS.filter(
    (x) => x.priceId !== p.priceId && x.concerns.some((c) => p.concerns.includes(c)),
  );
  const seen = new Set<string>();
  return [...sameBrand, ...sameConcern]
    .filter((x) => (seen.has(x.priceId) ? false : (seen.add(x.priceId), true)))
    .slice(0, limit);
}
