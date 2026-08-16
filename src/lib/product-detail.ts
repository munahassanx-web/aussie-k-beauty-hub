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
      src: '/products/editorial/torriden/dive-in-serum-hero.png',
      alt: 'TORRIDEN DIVE-IN Low Molecular Hyaluronic Acid Serum 50ml bottle on a clean white studio backdrop',
    },
    {
      src: '/products/editorial/torriden/dive-in-serum-info.png',
      alt: 'Information panel listing the five hyaluronic acid forms in TORRIDEN DIVE-IN Serum: sodium hyaluronate, hydrolyzed hyaluronic acid, sodium acetylated hyaluronate, sodium hyaluronate crosspolymer and hydrolyzed sodium hyaluronate',
    },
    {
      src: '/products/editorial/torriden/dive-in-serum-apply.png',
      alt: 'Close-up of the watery serum being pressed into bare cheek skin with one hand',
    },
  ],
  torriden_dive_in_soothing_cream_onetime: [
    {
      src: '/products/editorial/torriden/dive-in-soothing-cream-hero.png',
      alt: 'TORRIDEN DIVE IN Soothing Cream jar on a clean white studio backdrop',
    },
    {
      src: '/products/editorial/torriden/dive-in-soothing-cream-info.png',
      alt: 'Key ingredients panel for TORRIDEN DIVE IN Soothing Cream: 5D hyaluronic acid complex, low molecular hyaluronic acid, panthenol, allantoin, fragrance-free and weakly acidic',
    },
    {
      src: '/products/editorial/torriden/dive-in-soothing-cream-apply.png',
      alt: 'Light blue gel-cream being smoothed onto the cheek with fingertips',
    },
  ],
  torriden_balanceful_cleansing_gel_onetime: [
    {
      src: '/products/editorial/torriden/balanceful-cleansing-gel-hero.png',
      alt: 'TORRIDEN BALANCEFUL Cleansing Gel pump bottle with a clear gel swatch on a white studio backdrop',
    },
    {
      src: '/products/editorial/torriden/balanceful-cleansing-gel-info.png',
      alt: 'Key ingredients panel for TORRIDEN BALANCEFUL Cleansing Gel: centella asiatica extract, madecassoside, panthenol, weakly acidic pH 5.5 and low-irritation fragrance-free formula',
    },
    {
      src: '/products/editorial/torriden/balanceful-cleansing-gel-apply.png',
      alt: 'Cleansing gel lathered into a soft foam in wet palms at the basin',
    },
  ],
  torriden_dive_in_mask_pack_1pc_onetime: [
    {
      src: '/products/editorial/torriden/dive-in-mask-pack-1pc-hero.png',
      alt: 'TORRIDEN DIVE IN Mask sheet mask sachet on a clean white studio backdrop',
    },
    {
      src: '/products/editorial/torriden/dive-in-mask-pack-1pc-info.png',
      alt: 'Key ingredients panel for TORRIDEN DIVE IN Mask: 5D hyaluronic acid, allantoin, panthenol, 27ml essence per sheet, fragrance-free',
    },
    {
      src: '/products/editorial/torriden/dive-in-mask-pack-1pc-apply.png',
      alt: 'Sheet mask being smoothed onto the cheek with fingertips',
    },
  ],
  torriden_dive_in_trial_kit_onetime: [
    {
      src: '/products/editorial/torriden/dive-in-trial-kit-hero.png',
      alt: 'TORRIDEN DIVE IN Trial Kit minis arranged in front of the box on a white studio backdrop',
    },
    {
      src: '/products/editorial/torriden/dive-in-trial-kit-info.png',
      alt: "What's inside the TORRIDEN DIVE IN Trial Kit: cleansing foam 30ml, toner 30ml, serum 10ml and soothing cream 20ml",
    },
    {
      src: '/products/editorial/torriden/dive-in-trial-kit-apply.png',
      alt: 'The four TORRIDEN DIVE IN travel sizes — Cleansing Foam, Toner, Serum and Soothing Cream — beside a linen travel pouch in soft window light',
    },
  ],
  torriden_balanceful_trial_kit_onetime: [
    {
      src: '/products/editorial/torriden/balanceful-trial-kit-hero.png',
      alt: 'TORRIDEN BALANCEFUL Trial Kit minis and toner pad sachet in front of the box on a white studio backdrop',
    },
    {
      src: '/products/editorial/torriden/balanceful-trial-kit-info.png',
      alt: "What's inside the TORRIDEN BALANCEFUL Trial Kit: cleansing gel mini, toner pad sachet, serum mini and cream mini with centella asiatica extract",
    },
    {
      src: '/products/editorial/torriden/balanceful-trial-kit-apply.png',
      alt: 'A toner pad being swept across the cheek with tweezers',
    },
  ],
  medicube_pdrn_pink_peptide_serum_30ml_onetime: [
    {
      src: '/products/editorial/medicube/pdrn-pink-peptide-serum-30ml-block.png',
      alt: 'MEDICUBE PDRN Pink Peptide Serum staged against a blush colour block on a white studio floor',
    },
    {
      src: '/products/editorial/medicube/pdrn-pink-peptide-serum-30ml-studio.png',
      alt: 'MEDICUBE PDRN Pink Peptide Serum with a serum droplet swatch on a clean white studio backdrop',
    },
    {
      src: '/products/editorial/medicube/pdrn-pink-peptide-serum-30ml-apply.png',
      alt: 'A dropper of MEDICUBE PDRN Pink Peptide Serum dispensing onto the back of a hand',
    },
  ],
  medicube_collagen_jelly_cream_110ml_onetime: [
    {
      src: '/products/editorial/medicube/collagen-jelly-cream-110ml-block.png',
      alt: 'MEDICUBE Collagen Jelly Cream jar staged against a pale sand colour block on a white studio floor',
    },
    {
      src: '/products/editorial/medicube/collagen-jelly-cream-110ml-studio.png',
      alt: 'MEDICUBE Collagen Jelly Cream open jar with the lid beside it, showing the glossy jelly cream inside on a clean white studio backdrop',
    },
    {
      src: '/products/editorial/medicube/collagen-jelly-cream-110ml-texture.png',
      alt: 'Macro swatch of the bouncy jelly cream texture of MEDICUBE Collagen Jelly Cream',
    },
  ],
  beauty_of_joseon_revive_eye_serum_ginseng_plus_retinal_30ml_onetime: [
    {
      src: '/products/editorial/beauty-of-joseon/revive-eye-serum-ginseng-plus-retinal-30ml-block.png',
      alt: 'Beauty of Joseon Revive Eye Serum staged against a blush-beige colour block on a white studio floor',
    },
    {
      src: '/products/editorial/beauty-of-joseon/revive-eye-serum-ginseng-plus-retinal-30ml-studio.png',
      alt: 'Beauty of Joseon Revive Eye Serum tube lying down with the cap off and a small amount of serum squeezed out, on a clean white studio backdrop',
    },
    {
      src: '/products/editorial/beauty-of-joseon/revive-eye-serum-ginseng-plus-retinal-30ml-apply.png',
      alt: 'Beauty of Joseon Revive Eye Serum being patted onto the back of a hand with a fingertip',
    },
  ],
  beauty_of_joseon_ginseng_cleansing_oil_210ml_onetime: [
    {
      src: '/products/editorial/beauty-of-joseon/ginseng-cleansing-oil-210ml-hero.png',
      alt: 'Beauty of Joseon Ginseng Cleansing Oil 210ml pump bottle with a droplet of amber oil on a clean white studio backdrop',
    },
    {
      src: '/products/editorial/beauty-of-joseon/ginseng-cleansing-oil-210ml-info.png',
      alt: 'Key ingredients panel for Beauty of Joseon Ginseng Cleansing Oil: soybean oil, ginseng seed oil, camellia seed oil, olive fruit oil and ginseng root and berry extract',
    },
    {
      src: '/products/editorial/beauty-of-joseon/ginseng-cleansing-oil-210ml-apply.png',
      alt: 'Cleansing oil being massaged over dry skin on the cheek and jawline before emulsifying with water',
    },
  ],
  beauty_of_joseon_green_plum_refreshing_toner_150ml_onetime: [
    {
      src: '/products/editorial/beauty-of-joseon/green-plum-refreshing-toner-150ml-hero.png',
      alt: 'Beauty of Joseon Green Plum Refreshing Toner 150ml frosted green bottle on a clean white studio backdrop with water droplets',
    },
    {
      src: '/products/editorial/beauty-of-joseon/green-plum-refreshing-toner-150ml-info.png',
      alt: 'Key ingredients panel for Beauty of Joseon Green Plum Refreshing Toner: green plum water, mung bean extract and a mild AHA + BHA complex',
    },
    {
      src: '/products/editorial/beauty-of-joseon/green-plum-refreshing-toner-150ml-apply.png',
      alt: 'Toner being swept across the cheek with a cotton pad after cleansing',
    },
  ],
  beauty_of_joseon_glow_serum_propolis_plus_niacinamide_30ml_onetime: [
    {
      src: '/products/editorial/beauty-of-joseon/glow-serum-propolis-niacinamide-30ml-hero.png',
      alt: 'Beauty of Joseon Glow Serum: Propolis + Niacinamide 30ml glass dropper bottle with a golden serum droplet on a clean white studio backdrop',
    },
    {
      src: '/products/editorial/beauty-of-joseon/glow-serum-propolis-niacinamide-30ml-info.png',
      alt: 'Key ingredients panel for Beauty of Joseon Glow Serum: propolis extract, niacinamide, sodium hyaluronate, centella asiatica and betaine salicylate',
    },
    {
      src: '/products/editorial/beauty-of-joseon/glow-serum-propolis-niacinamide-30ml-apply.png',
      alt: 'Drops of pale gold propolis serum being patted into the cheek for a dewy glass-skin finish',
    },
  ],
  beauty_of_joseon_dynasty_cream_50ml_onetime: [
    {
      src: '/products/editorial/beauty-of-joseon/dynasty-cream-50ml-hero.png',
      alt: 'Beauty of Joseon Dynasty Cream 50ml jar with a swirl of rich white cream beside it on a clean white studio backdrop',
    },
    {
      src: '/products/editorial/beauty-of-joseon/dynasty-cream-50ml-info.png',
      alt: 'Key ingredients panel for Beauty of Joseon Dynasty Cream: rice bran water, ginseng root extract, niacinamide and squalane',
    },
    {
      src: '/products/editorial/beauty-of-joseon/dynasty-cream-50ml-apply.png',
      alt: 'Rich white moisturiser being smoothed across the cheek with fingertips for a soft, well-fed finish',
    },
  ],
};


export function galleryFor(p: ShopProduct): GalleryImage[] {
  const editorial = EDITORIAL[p.priceId];
  // When a SKU has bespoke, product-accurate editorial imagery we show only
  // that — generic category lifestyle shots look random next to it.
  return [
    { src: p.image, alt: `${p.brand} ${p.name}` },
    ...(editorial ?? LIFESTYLE[p.category]),
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

/**
 * Verified, brand-sourced copy for individual SKUs. Anything listed here is
 * taken from the brand's own product information (or an authorised stockist)
 * rather than generated from category rules.
 */
type CopyOverride = {
  description: string;
  benefits?: string[];
  howToUse?: string[];
  texture?: string;
  fullInci?: string;
  ingredients?: HeroIngredient[];
};

const COPY: Record<string, CopyOverride> = {
  torriden_dive_in_serum_onetime: {
    description:
      'TORRIDEN DIVE-IN Low Molecular Hyaluronic Acid Serum is a lightweight, watery serum built around a 5D-Complex of five hyaluronic acid forms in different molecular weights, so hydration sits at more than one depth instead of just the surface. D-Panthenol, allantoin and madecassoside calm the skin as it absorbs, and the pale blue tint comes from naturally derived malachite extract — no added colourant. Suitable for all skin types, including reactive skin. Made in Korea. 50ml.',
    texture:
      'Thin, watery gel that spreads like an essence and sinks in within seconds with no tack or film.',
    benefits: [
      'Five hyaluronic acid forms (5D-Complex) hydrate at different depths',
      'D-Panthenol, allantoin and madecassoside soothe reactive, tight skin',
      'Weightless watery finish that layers under sunscreen or makeup',
      'Fragrance-free and suitable for all skin types',
      'Authentic Korean stock, shipped from our Melbourne warehouse',
    ],
    howToUse: [
      'After cleansing and toner, use the dropper to take 3–5 drops.',
      'Spread evenly over the whole face and press in with your palms.',
      'Layer a second application on drier areas for a stronger moisture effect.',
      'Follow with a moisturiser to seal it in — and SPF in the morning.',
    ],
    ingredients: [
      {
        name: '5D-Complex Hyaluronic Acid',
        korean: '히알루론산',
        what: 'Five hyaluronic acid forms — sodium hyaluronate, hydrolyzed hyaluronic acid (500 ppm), sodium acetylated hyaluronate, sodium hyaluronate crosspolymer and hydrolyzed sodium hyaluronate — at different molecular weights so water is held at several layers rather than only on the surface.',
        goodFor: ['Dehydration', 'Tightness', 'All skin types'],
      },
      {
        name: 'D-Panthenol & Allantoin',
        what: 'Provitamin B5 and allantoin work together to soften, calm and support the skin barrier, which is why the serum sits well on skin that stings easily.',
        goodFor: ['Sensitivity', 'Barrier support', 'Softness'],
      },
      {
        name: 'Madecassoside & Malachite Extract',
        korean: '병풀 · 공작석',
        what: 'Madecassoside is the calming fraction of centella asiatica; malachite extract is a mineral extract that gives the serum its natural pale blue colour and a fortifying finish.',
        goodFor: ['Redness', 'Calming', 'Barrier support'],
      },
    ],
    fullInci:
      'Purified Water, Butylene Glycol, Glycerin, Dipropylene Glycol, 1,2-Hexanediol, Panthenol, Sodium Hyaluronate, Hydrolyzed Hyaluronic Acid (500 ppm), Sodium Acetylated Hyaluronate, Sodium Hyaluronate Crosspolymer, Hydrolyzed Sodium Hyaluronate, Allantoin, Trehalose, Betaine, Propanediol, Portulaca Oleracea Extract, Hamamelis Virginiana (Witch Hazel) Extract, Madecassoside, Madecassic Acid, Ceramide NP, Beta-Glucan, Malachite Extract, Cholesterol, Pentylene Glycol, Glyceryl Acrylate/Acrylic Acid Copolymer, PVM/MA Copolymer, Polyglyceryl-10 Laurate, Xanthan Gum, Tromethamine, Carbomer, Ethylhexylglycerin, Scutellaria Baicalensis Root Extract, Paeonia Suffruticosa Root Extract',
  },
  beauty_of_joseon_ginseng_cleansing_oil_210ml_onetime: {
    description:
      'Beauty of Joseon Ginseng Cleansing Oil is the first step of a double cleanse — a comfortably lightweight oil that uses micellar technology to lift away sunscreen, makeup, sebum and daily grime, then emulsifies with water into a soft milky lather and rinses clean. Soybean oil dissolves impurities without clogging pores, while ginseng seed oil and ginseng root and berry extracts help keep skin feeling soft rather than stripped. Clinically tested to be non-sensitising (24-hour human repeated insult patch test, Korea Dermatology Research Institute, 51 subjects). Alcohol-free and plant-based. Made in Korea. 210ml.',
    texture:
      'Fluid, golden-amber oil with a subtly calming herbal scent; it turns milky white the moment water hits it and rinses off without a greasy film.',
    benefits: [
      'Micellar cleansing technology lifts dirt, sebum, makeup and sunscreen without scrubbing',
      'Soybean oil dissolves impurities without clogging pores',
      'Ginseng seed oil and ginseng root/berry extract soothe skin exposed to daily environmental stress',
      'Emulsifies cleanly with water — no heavy residue before your second cleanse',
      'Alcohol-free and clinically tested to be non-sensitising',
    ],
    howToUse: [
      'Pump 1–2 times onto dry hands and massage over dry skin, including sunscreen and makeup.',
      'Add a little lukewarm water and keep massaging until the oil turns milky and emulsifies.',
      'Rinse thoroughly with lukewarm water.',
      'Follow with a water-based cleanser. Use morning and night.',
    ],
    ingredients: [
      {
        name: 'Soybean Oil',
        korean: '대두유',
        what: 'The base oil of the formula. It dissolves sunscreen, makeup and hardened sebum without clogging pores, and carries naturally occurring vitamin E (tocopherol is also listed separately).',
        goodFor: ['Sunscreen removal', 'Congestion-prone skin', 'Daily cleansing'],
      },
      {
        name: 'Ginseng Seed Oil & Ginseng Extracts',
        korean: '인삼',
        what: 'Panax ginseng seed oil plus root, leaf/stem and berry extracts — the brand\'s signature hanbang ingredient, included to comfort skin exposed to daily environmental elements so cleansing does not leave it tight.',
        goodFor: ['Comfort', 'Environmental stress', 'Softness'],
      },
      {
        name: 'Camellia & Olive Fruit Oil',
        what: 'Lightweight plant oils that keep the slip long enough to massage properly, then rinse away with the micellar system instead of sitting on the skin.',
        goodFor: ['Slip', 'Dry skin', 'Clean rinse-off'],
      },
    ],
    fullInci:
      'Glycine Soja (Soybean) Oil, Cetyl Ethylhexanoate, Sorbeth-30 Tetraoleate, Isododecane, Olea Europaea (Olive) Fruit Oil, Camellia Japonica Seed Oil, Hydrogenated Coconut Oil, Octyldodecanol, Polybutene, Caprylic/Capric Triglyceride, Aqua, Tocopherol, Panax Ginseng Seed Oil, Salvia Officinalis (Sage) Oil, Artemisia Vulgaris Oil, Ocimum Basilicum (Basil) Oil, Camphor, Corylus Avellana (Hazelnut) Seed Oil, Nigella Sativa Seed Oil, Butylene Glycol, Panax Ginseng Berry Extract, Glycerin, 1,2-Hexanediol, Methylpropanediol, Panax Ginseng Root Extract, Ethyl Hexanediol, Panax Ginseng Extract, Panax Ginseng Leaf/Stem Extract, Ethylhexylglycerin',
  },
  beauty_of_joseon_green_plum_refreshing_toner_150ml_onetime: {
    description:
      "Beauty of Joseon Green Plum Refreshing Toner: AHA + BHA is a gentle daily exfoliating toner that sweeps away dead skin cells and clears congested pores without stripping the moisture barrier. Green plum (Prunus mume) fruit water sits at the top of the formula alongside a mild AHA (glycolic acid) and BHA (salicylic acid) complex, while mung bean (Vigna radiata) seed extract hydrates and soothes. Skin renews itself roughly every 28 days — this keeps that cycle moving so texture stays smooth and tone stays bright. Made in Korea. 150ml.",
    texture:
      'Clear, watery liquid that absorbs instantly with a faintly fresh, fruity scent — no sting, no tacky finish.',
    benefits: [
      'Green plum water gently exfoliates and resets a dull-looking complexion',
      'Mild AHA + BHA complex smooths rough texture and clears clogged pores',
      'Mung bean extract hydrates and helps soothe as it exfoliates',
      'Gentle enough for daily morning and night use on most skin types',
      'Authentic Korean stock, shipped from our Melbourne warehouse',
    ],
    howToUse: [
      'After cleansing, pour a few drops into your hands and press gently into the skin — or sweep with a cotton pad from the centre of the face outward.',
      'Follow with your serum and moisturiser while skin is still damp.',
      'Use morning and night. Start every second night if your skin is new to acids.',
      'Always wear sunscreen during the day — AHAs increase sun sensitivity for up to a week after use.',
    ],
    ingredients: [
      {
        name: 'Green Plum Water',
        korean: '청매실',
        what: 'Prunus mume fruit water, the second ingredient in the formula. The hanbang hero of the range — it refreshes and gently exfoliates so skin looks clearer and more even.',
        goodFor: ['Dullness', 'Rough texture', 'Daily use'],
      },
      {
        name: 'AHA + BHA Complex',
        what: 'Glycolic acid (AHA) loosens dead cells on the surface, while oil-soluble salicylic acid (BHA) works inside the pore to clear buildup. Kept at a mild level so it can be used daily.',
        goodFor: ['Clogged pores', 'Blackheads', 'Uneven texture'],
      },
      {
        name: 'Mung Bean Extract',
        korean: '녹두',
        what: 'Vigna radiata seed extract hydrates and helps soothe, offsetting the exfoliating acids so the moisture barrier stays comfortable.',
        goodFor: ['Hydration', 'Soothing', 'Barrier support'],
      },
    ],
    fullInci:
      'Water, Prunus Mume Fruit Water, Dipropylene Glycol, Glycerin, Glycolic Acid, Butylene Glycol, Tromethamine, 1,2-Hexanediol, Hydroxyacetophenone, Salicylic Acid, Ethylhexylglycerin, Vigna Radiata Seed Extract, Disodium EDTA, Melia Azadirachta Leaf Extract, Melia Azadirachta Flower Extract, Coccinia Indica Fruit Extract, Ocimum Sanctum Leaf Extract, Curcuma Longa (Turmeric) Root Extract, Aloe Barbadensis Flower Extract, Solanum Melongena (Eggplant) Fruit Extract, Corallina Officinalis Extract, C12-14 Pareth-12, Xanthan Gum, Octyldodeceth-16',
  },
  beauty_of_joseon_glow_serum_propolis_plus_niacinamide_30ml_onetime: {
    description:
      "Beauty of Joseon Glow Serum: Propolis + Niacinamide is a cushiony smoothing serum built around propolis extract — the first ingredient in the formula — paired with niacinamide to help refine the look of pores, hydrate and calm the skin for a glassy glow. Sodium hyaluronate holds water in the surface layers while centella asiatica, tea tree and turmeric root extracts keep things comfortable, and a touch of betaine salicylate helps skin feel smoother over time. The brand recommends it for dry and combination skin. Made in Korea. 30ml.",
    texture:
      'Slightly viscous, honey-toned serum that spreads into a cushiony film and settles to a soft dewy finish rather than a sticky one.',
    benefits: [
      'Propolis extract — the highest-listed ingredient — comforts skin and leaves a lit-from-within glow',
      'Niacinamide helps even out the look of tone and refine the appearance of pores',
      'Sodium hyaluronate draws in and holds hydration for a plumper surface',
      'Centella asiatica and tea tree extracts help keep reactive skin calm',
      'Recommended by the brand for dry and combination skin',
    ],
    howToUse: [
      'After toner, apply 2–3 drops to the face.',
      'Pat gently with your fingertips to help absorption — don\'t rub.',
      'Follow with moisturiser, and sunscreen in the morning.',
      'Use both day and night.',
    ],
    ingredients: [
      {
        name: 'Propolis Extract',
        korean: '프로폴리스',
        what: 'A bee-derived resin extract and the first ingredient on the INCI list. It gives the serum its honey-gold colour and its signature comforting, glow-boosting feel. Skip it if you have a bee-product allergy.',
        goodFor: ['Glow', 'Dry skin', 'Comfort'],
      },
      {
        name: 'Niacinamide',
        what: 'Vitamin B3 — one of the most studied brightening actives in K-beauty. It supports the barrier and helps the skin look more even in tone with a refined pore appearance.',
        goodFor: ['Uneven tone', 'Pore appearance', 'Barrier support'],
      },
      {
        name: 'Sodium Hyaluronate & Centella Asiatica',
        korean: '병풀',
        what: 'Sodium hyaluronate is the low-weight salt of hyaluronic acid, holding water in the upper layers; centella (cica) is the classic Korean soothing botanical for skin that flushes easily.',
        goodFor: ['Hydration', 'Redness', 'Sensitive skin'],
      },
    ],
    fullInci:
      'Propolis Extract, Dipropylene Glycol, Glycerin, Butylene Glycol, Water, Niacinamide, 1,2-Hexanediol, Melia Azadirachta Flower Extract, Melia Azadirachta Leaf Extract, Sodium Hyaluronate, Curcuma Longa (Turmeric) Root Extract, Ocimum Sanctum Leaf Extract, Theobroma Cacao (Cocoa) Seed Extract, Melaleuca Alternifolia (Tea Tree) Extract, Centella Asiatica Extract, Corallina Officinalis Extract, Lotus Corniculatus Seed Extract, Calophyllum Inophyllum Seed Oil, Betaine Salicylate, Sodium Polyacryloyldimethyl Taurate, Tromethamine, Polyglyceryl-10 Laurate, Caprylyl Glycol, Ethylhexylglycerin, Dextrin, Pentylene Glycol, Octanediol, Tocopherol, Xanthan Gum, Carbomer',
  },
  beauty_of_joseon_dynasty_cream_50ml_onetime: {
    description:
      "Beauty of Joseon Dynasty Cream is the range's richest moisturiser — a hanbang cream built on rice bran water and Panax ginseng root extract, the two ingredients the brand's Joseon-era formulas are known for. Niacinamide works on the look of tone and dullness while squalane and plant butters seal in moisture, so skin feels fed rather than coated. Best suited to dry, dehydrated or winter-stressed skin, and rich enough to use as a night cream year-round. Made in Korea. 50ml.",
    texture:
      'A dense, buttery cream that melts on contact with warm skin and finishes satin — not greasy, but noticeably more occlusive than a gel-cream.',
    benefits: [
      'Rice bran water and ginseng root extract — the brand\'s signature hanbang pairing — for comfort and glow',
      'Niacinamide helps skin look more even and less dull over time',
      'Squalane and plant butters cushion a dry, tight moisture barrier',
      'Rich enough for overnight repair, or for cold, dry Melbourne winters',
      'Layers well over the Glow Serum or any hydrating essence',
    ],
    howToUse: [
      'As the last step of your evening routine, warm a pea-to-almond-sized amount between your fingers.',
      'Press it over damp skin — straight after serum works best — rather than rubbing it in.',
      'Use a thinner layer in the morning under sunscreen if your skin runs dry.',
      'For very dry patches, pat a second layer over the cheeks and around the mouth.',
    ],
    ingredients: [
      {
        name: 'Rice Bran Water',
        korean: '쌀겨수',
        what: 'Oryza sativa bran water — the base of the formula instead of plain water. A staple of Korean hanbang skincare, valued for leaving skin soft, hydrated and less dull-looking.',
        goodFor: ['Dryness', 'Dullness', 'Daily use'],
      },
      {
        name: 'Ginseng Root Extract',
        korean: '인삼',
        what: 'Panax ginseng root — the ingredient Beauty of Joseon is built around. Traditionally used for skin that looks tired and depleted; here it gives the cream its warm, restorative character.',
        goodFor: ['Tired skin', 'Loss of bounce', 'Comfort'],
      },
      {
        name: 'Niacinamide & Squalane',
        what: 'Niacinamide (vitamin B3) supports the barrier and helps refine the look of tone; squalane is a lightweight emollient that keeps water from escaping without a heavy film.',
        goodFor: ['Uneven tone', 'Barrier support', 'Moisture retention'],
      },
    ],
  },
};


export function productTexture(p: ShopProduct): string | undefined {
  return COPY[p.priceId]?.texture;
}

export function productInci(p: ShopProduct): string | undefined {
  return COPY[p.priceId]?.fullInci;
}

export function howToUse(p: ShopProduct): string[] {
  return COPY[p.priceId]?.howToUse ?? CATEGORY_HOW_TO[p.category];
}

export function productDescription(p: ShopProduct): string {
  const override = COPY[p.priceId]?.description;
  if (override) return override;
  const concerns = p.concerns.map((c) => CONCERN_LABEL[c]);
  const list =
    concerns.length > 1
      ? `${concerns.slice(0, -1).join(', ')} and ${concerns[concerns.length - 1]}`
      : concerns[0] ?? 'everyday skin health';
  return `${p.brand}'s ${p.name} is a ${p.category.toLowerCase()} step formulated for ${list}. We stock it because it earns its place in a real Australian routine — a climate of hard water, air-conditioning and high UV. Sourced directly through verified brand channels and held in our Melbourne warehouse, so what lands on your doorstep is the same batch you'd buy in Seoul.`;
}

export function productBenefits(p: ShopProduct): string[] {
  const override = COPY[p.priceId]?.benefits;
  if (override) return override;
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
  const override = COPY[p.priceId]?.ingredients;
  if (override) return override;
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
