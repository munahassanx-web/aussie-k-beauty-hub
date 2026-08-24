// Product detail data layer: slugs, editorial copy, hero-ingredient breakdowns
// and lifestyle imagery for every SKU in the launch assortment.

import { SHOP_PRODUCTS, type ShopProduct, type Category, type Concern } from '@/lib/shop-catalog';
import { bespokeHeroIngredients } from '@/lib/hero-ingredients';
import { applicationForSlug } from '@/lib/product-application-data';



import ritualScene from '@/assets/ritual-scene.webp';
import productFlatlay from '@/assets/product-flatlay.webp';
import textureMacro from '@/assets/texture-macro.webp';
import skinMacro from '@/assets/skin-macro.webp';
import applyingSerumAsset from '@/assets/applying-serum.png.asset.json';
import learnFeatureSerum from '@/assets/learn-feature-serum.webp';
import heroDewy from '@/assets/hero-dewy.webp';
import glow from '@/assets/glow.webp';
import categoryMasks from '@/assets/category-masks.webp';
import maskSheet from '@/assets/mask-mediheal-sheet.webp';

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
      src: '/products/editorial/torriden/dive-in-serum-hero.webp',
      alt: 'TORRIDEN DIVE-IN Low Molecular Hyaluronic Acid Serum 50ml bottle on a clean white studio backdrop',
    },
    {
      src: '/products/editorial/torriden/dive-in-serum-info.webp',
      alt: 'Information panel listing the five hyaluronic acid forms in TORRIDEN DIVE-IN Serum: sodium hyaluronate, hydrolyzed hyaluronic acid, sodium acetylated hyaluronate, sodium hyaluronate crosspolymer and hydrolyzed sodium hyaluronate',
    },
    {
      src: '/products/editorial/torriden/dive-in-serum-apply.webp',
      alt: 'Close-up of the watery serum being pressed into bare cheek skin with one hand',
    },
  ],
  torriden_dive_in_soothing_cream_onetime: [
    {
      src: '/products/editorial/torriden/dive-in-soothing-cream-hero.webp',
      alt: 'TORRIDEN DIVE IN Soothing Cream jar on a clean white studio backdrop',
    },
    {
      src: '/products/editorial/torriden/dive-in-soothing-cream-info.webp',
      alt: 'Key ingredients panel for TORRIDEN DIVE IN Soothing Cream: 5D hyaluronic acid complex, low molecular hyaluronic acid, panthenol, allantoin, fragrance-free and weakly acidic',
    },
    {
      src: '/products/editorial/torriden/dive-in-soothing-cream-apply.webp',
      alt: 'Light blue gel-cream being smoothed onto the cheek with fingertips',
    },
  ],
  torriden_balanceful_cleansing_gel_onetime: [
    {
      src: '/products/editorial/torriden/balanceful-cleansing-gel-hero.webp',
      alt: 'TORRIDEN BALANCEFUL Cleansing Gel pump bottle with a clear gel swatch on a white studio backdrop',
    },
    {
      src: '/products/editorial/torriden/balanceful-cleansing-gel-info.webp',
      alt: 'Key ingredients panel for TORRIDEN BALANCEFUL Cleansing Gel: centella asiatica extract, madecassoside, panthenol, weakly acidic pH 5.5 and low-irritation fragrance-free formula',
    },
    {
      src: '/products/editorial/torriden/balanceful-cleansing-gel-apply.webp',
      alt: 'Cleansing gel lathered into a soft foam in wet palms at the basin',
    },
  ],
  torriden_dive_in_mask_pack_1pc_onetime: [
    {
      src: '/products/editorial/torriden/dive-in-mask-pack-1pc-hero.webp',
      alt: 'TORRIDEN DIVE IN Mask sheet mask sachet on a clean white studio backdrop',
    },
    {
      src: '/products/editorial/torriden/dive-in-mask-pack-1pc-info.webp',
      alt: 'Key ingredients panel for TORRIDEN DIVE IN Mask: 5D hyaluronic acid, allantoin, panthenol, 27ml essence per sheet, fragrance-free',
    },
    {
      src: '/products/editorial/torriden/dive-in-mask-pack-1pc-apply.webp',
      alt: 'Sheet mask being smoothed onto the cheek with fingertips',
    },
  ],
  torriden_dive_in_trial_kit_onetime: [
    {
      src: '/products/editorial/torriden/dive-in-trial-kit-hero.webp',
      alt: 'TORRIDEN DIVE IN Trial Kit minis arranged in front of the box on a white studio backdrop',
    },
    {
      src: '/products/editorial/torriden/dive-in-trial-kit-info.webp',
      alt: "What's inside the TORRIDEN DIVE IN Trial Kit: cleansing foam 30ml, toner 30ml, serum 10ml and soothing cream 20ml",
    },
    {
      src: '/products/editorial/torriden/dive-in-trial-kit-apply.webp',
      alt: 'The four TORRIDEN DIVE IN travel sizes — Cleansing Foam, Toner, Serum and Soothing Cream — beside a linen travel pouch in soft window light',
    },
  ],
  torriden_balanceful_trial_kit_onetime: [
    {
      src: '/products/editorial/torriden/balanceful-trial-kit-hero.webp',
      alt: 'TORRIDEN BALANCEFUL Trial Kit minis and toner pad sachet in front of the box on a white studio backdrop',
    },
    {
      src: '/products/editorial/torriden/balanceful-trial-kit-info.webp',
      alt: "What's inside the TORRIDEN BALANCEFUL Trial Kit: cleansing gel mini, toner pad sachet, serum mini and cream mini with centella asiatica extract",
    },
    {
      src: '/products/editorial/torriden/balanceful-trial-kit-apply.webp',
      alt: 'A toner pad being swept across the cheek with tweezers',
    },
  ],
  medicube_pdrn_pink_peptide_serum_30ml_onetime: [
    {
      src: '/products/editorial/medicube/pdrn-pink-peptide-serum-30ml-hero.webp',
      alt: 'MEDICUBE PDRN Pink Peptide Serum 30ml pink glass dropper bottle on a soft blush studio backdrop',
    },
    {
      src: '/products/editorial/medicube/pdrn-pink-peptide-serum-30ml-info.webp',
      alt: 'Key ingredients in MEDICUBE PDRN Pink Peptide Serum: PDRN (Sodium DNA) 1%, 5 types peptide complex, niacinamide and panthenol, 30ml',
    },
    {
      src: '/products/editorial/medicube/pdrn-pink-peptide-serum-30ml-apply.webp',
      alt: 'A woman patting a few drops of serum into her cheek in soft studio light',
    },
  ],

  medicube_collagen_jelly_cream_110ml_onetime: [
    {
      src: '/products/editorial/medicube/collagen-jelly-cream-110ml-hero.webp',
      alt: 'MEDICUBE Collagen Jelly Cream 110ml pink frosted jar on a clean white studio backdrop',
    },
    {
      src: '/products/editorial/medicube/collagen-jelly-cream-110ml-info.webp',
      alt: 'Key ingredients panel for MEDICUBE Collagen Jelly Cream: collagen, peptides and a jelly moisture film',
    },
    {
      src: '/products/editorial/medicube/collagen-jelly-cream-110ml-apply.webp',
      alt: 'A woman smoothing bouncy pink jelly cream over her cheek with her fingertips',
    },
  ],
  medicube_pdrn_pink_cica_soothing_toner_250ml_onetime: [
    {
      src: '/products/editorial/medicube/pdrn-pink-cica-soothing-toner-250ml-hero.webp',
      alt: 'MEDICUBE PDRN Pink Cica Soothing Toner 250ml bottle on a clean studio backdrop',
    },
    {
      src: '/products/editorial/medicube/pdrn-pink-cica-soothing-toner-250ml-info.webp',
      alt: 'Key ingredients in MEDICUBE PDRN Pink Cica Soothing Toner: PDRN (salmon DNA), centella asiatica extract and sodium hyaluronate',
    },
    {
      src: '/products/editorial/medicube/pdrn-pink-cica-soothing-toner-250ml-apply.webp',
      alt: 'A watery toner being swept across the cheek with a cotton pad',
    },
  ],
  medicube_pdrn_pink_niacinamide_whip_cleanser_120g_onetime: [
    {
      src: '/products/editorial/medicube/pdrn-pink-niacinamide-whip-cleanser-120g-hero.webp',
      alt: 'MEDICUBE PDRN Pink Niacinamide Whip Cleanser 120g tube on a clean studio backdrop',
    },
    {
      src: '/products/editorial/medicube/pdrn-pink-niacinamide-whip-cleanser-120g-info.webp',
      alt: 'Key ingredients in MEDICUBE PDRN Pink Niacinamide Whip Cleanser: 99% high purity salmon PDRN and niacinamide in a weakly acidic whipped foam',
    },
    {
      src: '/products/editorial/medicube/pdrn-pink-niacinamide-whip-cleanser-120g-apply.webp',
      alt: 'Soft whipped cleansing foam lathered between two hands',
    },
  ],
  medicube_pdrn_pink_peptide_eye_cream_30ml_onetime: [
    {
      src: '/products/editorial/medicube/pdrn-pink-peptide-eye-cream-30ml-hero.webp',
      alt: 'MEDICUBE PDRN Pink Peptide Eye Cream 30ml tube on a clean studio backdrop',
    },
    {
      src: '/products/editorial/medicube/pdrn-pink-peptide-eye-cream-30ml-info.webp',
      alt: 'Key ingredients in MEDICUBE PDRN Pink Peptide Eye Cream: PDRN (sodium DNA), peptide complex and 5% niacinamide',
    },
    {
      src: '/products/editorial/medicube/pdrn-pink-peptide-eye-cream-30ml-apply.webp',
      alt: 'A ring finger patting pale pink eye cream along the under-eye area',
    },
  ],
  medicube_one_day_exosome_shot_pore_serum_2000_30ml_onetime: [
    {
      src: '/products/editorial/medicube/one-day-exosome-shot-pore-serum-2000-30ml-hero.webp',
      alt: 'MEDICUBE One Day Exosome Shot 2000 pore serum bottle on a clean studio backdrop',
    },
    {
      src: '/products/editorial/medicube/one-day-exosome-shot-pore-serum-2000-30ml-info.webp',
      alt: 'Key ingredients in MEDICUBE One Day Exosome Shot 2000: lacto exosome with AHA, BHA and PHA for pore and texture care',
    },
    {
      src: '/products/editorial/medicube/one-day-exosome-shot-pore-serum-2000-30ml-apply.webp',
      alt: 'Clear lightweight serum pressed into the cheek and nose area, showing refined pores',
    },
  ],
  beauty_of_joseon_revive_eye_serum_ginseng_plus_retinal_30ml_onetime: [
    {
      src: '/products/editorial/beauty-of-joseon/revive-eye-serum-ginseng-plus-retinal-30ml-hero.webp',
      alt: 'Beauty of Joseon Revive Eye Serum Ginseng + Retinal 30ml tube on a clean white studio backdrop',
    },
    {
      src: '/products/editorial/beauty-of-joseon/revive-eye-serum-ginseng-plus-retinal-30ml-info.webp',
      alt: 'Key ingredients panel for Beauty of Joseon Revive Eye Serum: ginseng root water, retinal and peptides',
    },
    {
      src: '/products/editorial/beauty-of-joseon/revive-eye-serum-ginseng-plus-retinal-30ml-apply.webp',
      alt: 'A mature woman patting eye serum along her under-eye with her ring finger',
    },
  ],
  beauty_of_joseon_ginseng_cleansing_oil_210ml_onetime: [
    {
      src: '/products/editorial/beauty-of-joseon/ginseng-cleansing-oil-210ml-hero.webp',
      alt: 'Beauty of Joseon Ginseng Cleansing Oil 210ml amber pump bottle on a soft warm-white studio backdrop',
    },
    {
      src: '/products/editorial/beauty-of-joseon/ginseng-cleansing-oil-210ml-info.webp',
      alt: 'Key ingredients panel for Beauty of Joseon Ginseng Cleansing Oil: ginseng root extract, ginseng seed oil and a plant oil base that melts SPF and makeup, 210ml',
    },
    {
      src: '/products/editorial/beauty-of-joseon/ginseng-cleansing-oil-210ml-apply.webp',
      alt: 'Cleansing oil being massaged over dry skin on the cheek and jawline before emulsifying with water',
    },
  ],
  beauty_of_joseon_green_plum_refreshing_toner_150ml_onetime: [
    {
      src: '/products/editorial/beauty-of-joseon/green-plum-refreshing-toner-150ml-hero.webp',
      alt: 'Beauty of Joseon Green Plum Refreshing Toner 150ml green bottle on a soft warm-white studio backdrop',
    },
    {
      src: '/products/editorial/beauty-of-joseon/green-plum-refreshing-toner-150ml-info.webp',
      alt: 'Key ingredients panel for Beauty of Joseon Green Plum Refreshing Toner: green plum extract, a mild AHA + BHA complex and betaine, fragrance-free, 150ml',
    },
    {
      src: '/products/editorial/beauty-of-joseon/green-plum-refreshing-toner-150ml-apply.webp',
      alt: 'Toner being swept across the cheek with a cotton pad after cleansing',
    },
  ],
  beauty_of_joseon_glow_serum_propolis_plus_niacinamide_30ml_onetime: [
    {
      src: '/products/editorial/beauty-of-joseon/glow-serum-propolis-niacinamide-30ml-hero.webp',
      alt: 'Beauty of Joseon Glow Serum: Propolis + Niacinamide 30ml glass dropper bottle with a golden serum droplet on a clean white studio backdrop',
    },
    {
      src: '/products/editorial/beauty-of-joseon/glow-serum-propolis-niacinamide-30ml-info.webp',
      alt: 'Key ingredients panel for Beauty of Joseon Glow Serum: propolis extract, niacinamide, sodium hyaluronate, centella asiatica and betaine salicylate',
    },
    {
      src: '/products/editorial/beauty-of-joseon/glow-serum-propolis-niacinamide-30ml-apply.webp',
      alt: 'Drops of pale gold propolis serum being patted into the cheek for a dewy glass-skin finish',
    },
  ],
  beauty_of_joseon_dynasty_cream_50ml_onetime: [
    {
      src: '/products/editorial/beauty-of-joseon/dynasty-cream-50ml-hero.webp',
      alt: 'Beauty of Joseon Dynasty Cream 50ml frosted glass jar on a soft warm-white studio backdrop',
    },
    {
      src: '/products/editorial/beauty-of-joseon/dynasty-cream-50ml-info.webp',
      alt: 'Key ingredients panel for Beauty of Joseon Dynasty Cream: rice bran water, ginseng root extract, niacinamide and squalane',
    },
    {
      src: '/products/editorial/beauty-of-joseon/dynasty-cream-50ml-apply.webp',
      alt: 'Rich white moisturiser being smoothed across the cheek with fingertips for a soft, well-fed finish',
    },
  ],
  wellage_real_hyaluronic_toner_200ml_onetime: [
    {
      src: '/products/editorial/wellage/real-hyaluronic-toner-200ml-hero.webp',
      alt: 'WELLAGE Real Hyaluronic Toner 200ml bottle on a cool blue-white studio backdrop',
    },
    {
      src: '/products/editorial/wellage/real-hyaluronic-toner-200ml-info.webp',
      alt: 'Key ingredients panel for WELLAGE Real Hyaluronic Toner: Real HA, HA Water 100 and panthenol in a mild 200ml formula',
    },
    {
      src: '/products/editorial/wellage/real-hyaluronic-toner-200ml-apply.webp',
      alt: 'A woman sweeping a toner-soaked cotton pad across her cheek in soft daylight',
    },
  ],
  wellage_hyper_pdrn_repair_ampoule_30ml_onetime: [
    {
      src: '/products/editorial/wellage/hyper-pdrn-repair-ampoule-30ml-hero.webp',
      alt: 'WELLAGE Hyper PDRN Repair Ampoule 30ml amber dropper bottle on a warm off-white studio backdrop',
    },
    {
      src: '/products/editorial/wellage/hyper-pdrn-repair-ampoule-30ml-info.webp',
      alt: 'Key ingredients panel for WELLAGE Hyper PDRN Repair Ampoule: PDRN (sodium DNA), Real HA and soluble collagen, 30ml',
    },
    {
      src: '/products/editorial/wellage/hyper-pdrn-repair-ampoule-30ml-apply.webp',
      alt: 'A woman patting a few drops of clear repair ampoule into her cheekbone',
    },
  ],
  wellage_real_hyaluronic_blue_100_ampoule_60ml_onetime: [
    {
      src: '/products/editorial/wellage/real-hyaluronic-blue-100-ampoule-60ml-hero.webp',
      alt: 'WELLAGE Real Hyaluronic Blue 100 Ampoule 60ml bottle on a cool white-blue studio backdrop',
    },
    {
      src: '/products/editorial/wellage/real-hyaluronic-blue-100-ampoule-60ml-info.webp',
      alt: 'Key ingredients panel for WELLAGE Real Hyaluronic Blue 100 Ampoule: Real HA, HA Water 100 and panthenol in a watery 60ml ampoule',
    },
    {
      src: '/products/editorial/wellage/real-hyaluronic-blue-100-ampoule-60ml-apply.webp',
      alt: 'A glass dropper releasing a clear watery droplet into an open palm',
    },
  ],
  wellage_real_hyaluronic_100_cream_80ml_onetime: [
    {
      src: '/products/editorial/wellage/real-hyaluronic-100-cream-80ml-hero.webp',
      alt: 'WELLAGE Real Hyaluronic 100 Cream 80ml tube on a pale grey-white studio backdrop',
    },
    {
      src: '/products/editorial/wellage/real-hyaluronic-100-cream-80ml-info.webp',
      alt: 'Key ingredients panel for WELLAGE Real Hyaluronic 100 Cream: Real HA, HA-Aminosome and ceramide, 80ml',
    },
    {
      src: '/products/editorial/wellage/real-hyaluronic-100-cream-80ml-apply.webp',
      alt: 'A woman smoothing a stripe of white moisturiser along her jawline',
    },
  ],
  wellage_real_hyaluronic_soothing_cream_80ml_onetime: [
    {
      src: '/products/editorial/wellage/real-hyaluronic-soothing-cream-80ml-hero.webp',
      alt: 'WELLAGE Real Hyaluronic Soothing Cream 80ml tube on a soft mint-white studio backdrop',
    },
    {
      src: '/products/editorial/wellage/real-hyaluronic-soothing-cream-80ml-info.webp',
      alt: 'Key ingredients panel for WELLAGE Real Hyaluronic Soothing Cream: Real HA, panthenol and centella asiatica in a cooling 80ml gel-cream',
    },
    {
      src: '/products/editorial/wellage/real-hyaluronic-soothing-cream-80ml-apply.webp',
      alt: 'A woman smoothing a cooling gel-cream over a slightly flushed cheek',
    },
  ],
  round_lab_1025_dokdo_toner_100ml_onetime: [
    {
      src: '/products/editorial/round-lab/1025-dokdo-toner-100ml-hero.webp',
      alt: 'ROUND LAB 1025 Dokdo Toner 100ml bottle on a clean white studio backdrop',
    },
    {
      src: '/products/editorial/round-lab/1025-dokdo-toner-100ml-info.webp',
      alt: 'Key ingredients panel for ROUND LAB 1025 Dokdo Toner: Ulleungdo deep sea water, panthenol and hyaluronic acid in a low pH 5.5, fragrance-free formula',
    },
    {
      src: '/products/editorial/round-lab/1025-dokdo-toner-100ml-apply.webp',
      alt: 'A woman pressing ROUND LAB 1025 Dokdo Toner into her cheek with a cotton pad in soft daylight',
    },
  ],
  round_lab_1025_dokdo_lotion_200ml_onetime: [
    {
      src: '/products/editorial/round-lab/1025-dokdo-lotion-200ml-hero.webp',
      alt: 'ROUND LAB 1025 Dokdo Lotion 200ml bottle on a clean white studio backdrop',
    },
    {
      src: '/products/editorial/round-lab/1025-dokdo-lotion-200ml-info.webp',
      alt: 'Key ingredients panel for ROUND LAB 1025 Dokdo Lotion: Ulleungdo deep sea water, squalane and panthenol in a lightweight milky texture',
    },
    {
      src: '/products/editorial/round-lab/1025-dokdo-lotion-200ml-apply.webp',
      alt: 'Fingertips patting a stripe of milky lotion into the cheek for a dewy finish',
    },
  ],
  round_lab_1025_dokdo_cleanser_150ml_onetime: [
    {
      src: '/products/editorial/round-lab/1025-dokdo-cleanser-150ml-hero.webp',
      alt: 'ROUND LAB 1025 Dokdo Cleanser 150ml tube on a clean white studio backdrop',
    },
    {
      src: '/products/editorial/round-lab/1025-dokdo-cleanser-150ml-info.webp',
      alt: 'Key ingredients panel for ROUND LAB 1025 Dokdo Cleanser: Ulleungdo deep sea water, panthenol and allantoin in a weakly acidic formula',
    },
    {
      src: '/products/editorial/round-lab/1025-dokdo-cleanser-150ml-apply.webp',
      alt: 'Cupped hands holding soft white cleansing foam above a basin',
    },
  ],
  round_lab_birch_juice_moisturizing_cream_80ml_onetime: [
    {
      src: '/products/editorial/round-lab/birch-juice-moisturizing-cream-80ml-hero.webp',
      alt: 'ROUND LAB Birch Juice Moisturizing Cream 80ml jar on a clean white studio backdrop',
    },
    {
      src: '/products/editorial/round-lab/birch-juice-moisturizing-cream-80ml-info.webp',
      alt: 'Key ingredients panel for ROUND LAB Birch Juice Moisturizing Cream: birch sap, hyaluronic acid and panthenol in a light gel-cream texture',
    },
    {
      src: '/products/editorial/round-lab/birch-juice-moisturizing-cream-80ml-apply.webp',
      alt: 'A woman smoothing a glossy gel-cream along her jawline for a hydrated glow',
    },
  ],
  round_lab_1025_dokdo_toner_plus_lotion_special_set_onetime: [
    {
      src: '/products/editorial/round-lab/1025-dokdo-toner-plus-lotion-special-set-hero.webp',
      alt: 'ROUND LAB 1025 Dokdo Toner and Lotion 200ml special set on a clean white studio backdrop',
    },
    {
      src: '/products/editorial/round-lab/1025-dokdo-toner-plus-lotion-special-set-info.webp',
      alt: 'Panel explaining the ROUND LAB 1025 Dokdo hydrating duo: 200ml toner followed by 200ml lotion, both built on Ulleungdo deep sea water',
    },
    {
      src: '/products/editorial/round-lab/1025-dokdo-toner-plus-lotion-special-set-apply.webp',
      alt: 'A woman pressing hydrating lotion into both cheeks with her palms',
    },
  ],
  round_lab_1025_dokdo_trial_kit_onetime: [
    {
      src: '/products/editorial/round-lab/1025-dokdo-trial-kit-hero.webp',
      alt: 'ROUND LAB 1025 Dokdo Trial Kit with cleanser 30ml, toner 20ml, ampoule 10ml and cream 20ml',
    },
    {
      src: '/products/editorial/round-lab/1025-dokdo-trial-kit-info.webp',
      alt: 'Panel showing the four-step ROUND LAB 1025 Dokdo trial routine: cleanser, toner, ampoule and cream in travel sizes',
    },
    {
      src: '/products/editorial/round-lab/1025-dokdo-trial-kit-apply.webp',
      alt: 'A woman pressing a drop of clear ampoule onto her cheekbone',
    },
  ],
  beplain_cicaful_ampoule_30ml_onetime: [
    {
      src: '/products/editorial/beplain/cicaful-ampoule-30ml-hero.webp',
      alt: 'beplain Cicaful Ampoule 30ml on a clean white studio backdrop',
    },
    {
      src: '/products/editorial/beplain/cicaful-ampoule-30ml-info.webp',
      alt: 'Key ingredients panel for beplain Cicaful Ampoule: Centella Asiatica extract, madecassoside and panthenol',
    },
    {
      src: '/products/editorial/beplain/cicaful-ampoule-30ml-apply.webp',
      alt: 'A woman pressing a few drops of clear watery ampoule into her cheek',
    },
  ],
  beplain_mung_bean_cleansing_oil_200ml_onetime: [
    {
      src: '/products/editorial/beplain/mung-bean-cleansing-oil-200ml-hero.webp',
      alt: 'beplain Mung Bean Cleansing Oil 200ml on a clean white studio backdrop',
    },
    {
      src: '/products/editorial/beplain/mung-bean-cleansing-oil-200ml-info.webp',
      alt: 'Key ingredients panel for beplain Mung Bean Cleansing Oil: mung bean seed extract and a plant-derived oil blend',
    },
    {
      src: '/products/editorial/beplain/mung-bean-cleansing-oil-200ml-apply.webp',
      alt: 'A woman massaging cleansing oil over dry skin with both hands',
    },
  ],
  beplain_mung_bean_ph_balanced_cleansing_foam_80ml_onetime: [
    {
      src: '/products/editorial/beplain/mung-bean-ph-balanced-cleansing-foam-80ml-hero.webp',
      alt: 'beplain Mung Bean pH-Balanced Cleansing Foam 80ml on a clean white studio backdrop',
    },
    {
      src: '/products/editorial/beplain/mung-bean-ph-balanced-cleansing-foam-80ml-info.webp',
      alt: 'Key ingredients panel for beplain Mung Bean Cleansing Foam: mung bean seed extract, weakly acidic pH 5.5, amino acid lather, fragrance-free',
    },
    {
      src: '/products/editorial/beplain/mung-bean-ph-balanced-cleansing-foam-80ml-apply.webp',
      alt: 'A woman lathering soft white cleansing foam across her cheeks',
    },
  ],
  beplain_mung_bean_pore_tight_up_soothing_cream_onetime: [
    {
      src: '/products/editorial/beplain/mung-bean-pore-tight-up-soothing-cream-hero.webp',
      alt: 'beplain Mung Bean Pore Tight-Up Soothing Cream on a clean white studio backdrop',
    },
    {
      src: '/products/editorial/beplain/mung-bean-pore-tight-up-soothing-cream-info.webp',
      alt: 'Key ingredients panel for beplain Pore Tight-Up Soothing Cream: mung bean peptide, centella asiatica and panthenol in a fresh gel-cream',
    },
    {
      src: '/products/editorial/beplain/mung-bean-pore-tight-up-soothing-cream-apply.webp',
      alt: 'A woman pressing a light gel-cream into her cheek and nose area',
    },
  ],
  beplain_milk_ceramide_moisturizing_cream_onetime: [
    {
      src: '/products/editorial/beplain/milk-ceramide-moisturizing-cream-hero.webp',
      alt: 'beplain Milk Ceramide Moisturizing Cream on a clean white studio backdrop',
    },
    {
      src: '/products/editorial/beplain/milk-ceramide-moisturizing-cream-info.webp',
      alt: 'Key ingredients panel for beplain Milk Ceramide Moisturizing Cream: ceramide NP, milk protein extract and panthenol',
    },
    {
      src: '/products/editorial/beplain/milk-ceramide-moisturizing-cream-apply.webp',
      alt: 'A mature woman smoothing a rich white cream along her jaw and cheek',
    },
  ],
  aestura_atobarrier365_cream_onetime: [
    {
      src: '/products/editorial/aestura/atobarrier365-cream-hero.webp',
      alt: 'AESTURA Atobarrier365 Cream on a clean white studio backdrop',
    },
    {
      src: '/products/editorial/aestura/atobarrier365-cream-info.webp',
      alt: 'Key ingredients panel for AESTURA Atobarrier365 Cream: ceramide NP, lipid complex and a fragrance-free formula',
    },
    {
      src: '/products/editorial/aestura/atobarrier365-cream-apply.webp',
      alt: 'A woman with pale, flushed cheeks smoothing a rich white barrier cream onto her cheek',
    },
  ],
  aestura_atobarrier_365_hydro_soothing_cream_onetime: [
    {
      src: '/products/editorial/aestura/atobarrier-365-hydro-soothing-cream-hero.webp',
      alt: 'AESTURA Atobarrier365 Hydro Soothing Cream on a clean white studio backdrop',
    },
    {
      src: '/products/editorial/aestura/atobarrier-365-hydro-soothing-cream-info.webp',
      alt: 'Key ingredients panel for AESTURA Atobarrier365 Hydro Soothing Cream: ceramide NP, hyaluronic acid and a soothing gel-cream base',
    },
    {
      src: '/products/editorial/aestura/atobarrier-365-hydro-soothing-cream-apply.webp',
      alt: 'A young East Asian woman patting a light gel-cream into her jawline',
    },
  ],
  aestura_a_cica_moisture_toner_onetime: [
    {
      src: '/products/editorial/aestura/a-cica-moisture-toner-hero.webp',
      alt: 'AESTURA A-Cica Moisture Toner 25ml on a clean white studio backdrop',
    },
    {
      src: '/products/editorial/aestura/a-cica-moisture-toner-info.webp',
      alt: 'Key ingredients panel for AESTURA A-Cica Moisture Toner: centella asiatica, hyaluronic acid and a pH 4.5 weakly acidic formula',
    },
    {
      src: '/products/editorial/aestura/a-cica-moisture-toner-apply.webp',
      alt: 'A woman in her forties sweeping toner across her cheek with a cotton round',
    },
  ],
  aestura_derma_uv365_barrier_moisture_mineral_sun_cream_onetime: [
    {
      src: '/products/editorial/aestura/derma-uv365-hero.webp',
      alt: 'AESTURA Derma UV365 Barrier Moisture Mineral Sun Cream 20ml on a clean white studio backdrop',
    },
    {
      src: '/products/editorial/aestura/derma-uv365-info.webp',
      alt: 'Key points panel for AESTURA Derma UV365: mineral UV filters at SPF50+ PA++++, ceramides and a low-sting eye-comfort finish',
    },
    {
      src: '/products/editorial/aestura/derma-uv365-apply.webp',
      alt: 'A woman with deep brown skin blending mineral sunscreen along her cheekbone in daylight',
    },
  ],

  isntree_hyaluronic_acid_water_essence_50ml_onetime: [
    {
      src: '/products/editorial/isntree/hyaluronic-acid-water-essence-50ml-hero.webp',
      alt: 'ISNTREE Hyaluronic Acid Water Essence 50ml on a clean white studio backdrop',
    },
    {
      src: '/products/editorial/isntree/hyaluronic-acid-water-essence-50ml-info.webp',
      alt: 'Key ingredients panel for ISNTREE Hyaluronic Acid Water Essence: 11 types of hyaluronic acid, lightweight watery texture, fragrance-free',
    },
    {
      src: '/products/editorial/isntree/hyaluronic-acid-water-essence-50ml-apply.webp',
      alt: 'A woman pressing a watery essence into her cheek with her fingertips',
    },
  ],
  isntree_green_tea_fresh_toner_200ml_onetime: [
    {
      src: '/products/editorial/isntree/green-tea-fresh-toner-200ml-hero.webp',
      alt: 'ISNTREE Green Tea Fresh Toner 200ml on a clean white studio backdrop',
    },
    {
      src: '/products/editorial/isntree/green-tea-fresh-toner-200ml-info.webp',
      alt: 'Key ingredients panel for ISNTREE Green Tea Fresh Toner: 80% Jeju green tea extract, green tea seed oil and a mildly acidic pH',
    },
    {
      src: '/products/editorial/isntree/green-tea-fresh-toner-200ml-apply.webp',
      alt: 'A woman sweeping toner across her cheek with a cotton pad',
    },
  ],
  isntree_chestnut_bha_2_percent_clear_liquid_100ml_onetime: [
    {
      src: '/products/editorial/isntree/chestnut-bha-2-percent-clear-liquid-100ml-hero.webp',
      alt: 'ISNTREE Chestnut BHA 2% Clear Liquid 100ml on a clean white studio backdrop',
    },
    {
      src: '/products/editorial/isntree/chestnut-bha-2-percent-clear-liquid-100ml-info.webp',
      alt: 'Key ingredients panel for ISNTREE Chestnut BHA 2% Clear Liquid: 2% betaine salicylate, chestnut shell extract, alcohol-free and fragrance-free',
    },
    {
      src: '/products/editorial/isntree/chestnut-bha-2-percent-clear-liquid-100ml-apply.webp',
      alt: 'A woman sweeping a clear exfoliating liquid over her nose and chin with a cotton pad',
    },
  ],
  isntree_yam_root_vegan_milk_cleanser_220ml_onetime: [
    {
      src: '/products/editorial/isntree/yam-root-vegan-milk-cleanser-220ml-hero.webp',
      alt: 'ISNTREE Yam Root Vegan Milk Cleanser 220ml on a clean white studio backdrop',
    },
    {
      src: '/products/editorial/isntree/yam-root-vegan-milk-cleanser-220ml-info.webp',
      alt: 'Key ingredients panel for ISNTREE Yam Root Vegan Milk Cleanser: yam root extract, pH 5.5 mild cleansing and a vegan formula',
    },
    {
      src: '/products/editorial/isntree/yam-root-vegan-milk-cleanser-220ml-apply.webp',
      alt: 'A woman massaging creamy milk cleanser over her cheeks with both hands',
    },
  ],
  dr_g_red_blemish_clear_soothing_foam_150ml_onetime: [
    {
      src: '/products/editorial/dr-g/red-blemish-clear-soothing-foam-150ml-hero.webp',
      alt: 'Dr.G R.E.D Blemish Clear Soothing Foam 150ml on a clean white studio backdrop',
    },
    {
      src: '/products/editorial/dr-g/red-blemish-clear-soothing-foam-150ml-info.webp',
      alt: 'Key ingredients panel for Dr.G R.E.D Blemish Clear Soothing Foam: 10-Cica complex, pH balancing formula and a low-irritation lather',
    },
    {
      src: '/products/editorial/dr-g/red-blemish-clear-soothing-foam-150ml-apply.webp',
      alt: 'A young Korean woman massaging white cleansing foam over her cheeks at a bright basin',
    },
  ],
  dr_g_r_e_d_blemish_clear_soothing_cream_70ml_onetime: [
    {
      src: '/products/editorial/dr-g/r-e-d-blemish-clear-soothing-cream-70ml-hero.webp',
      alt: 'Dr.G R.E.D Blemish Clear Soothing Cream 70ml on a clean white studio backdrop',
    },
    {
      src: '/products/editorial/dr-g/r-e-d-blemish-clear-soothing-cream-70ml-info.webp',
      alt: 'Key ingredients panel for Dr.G R.E.D Blemish Clear Soothing Cream: centella asiatica complex, panthenol and a fragrance-free gel-cream texture',
    },
    {
      src: '/products/editorial/dr-g/r-e-d-blemish-clear-soothing-cream-70ml-apply.webp',
      alt: 'A woman with fair, flushed skin patting a white gel-cream into her cheek',
    },
  ],
  dr_g_black_snail_cream_50ml_onetime: [
    {
      src: '/products/editorial/dr-g/black-snail-cream-50ml-hero.webp',
      alt: 'Dr.G Black Snail Cream 50ml on a clean white studio backdrop',
    },
    {
      src: '/products/editorial/dr-g/black-snail-cream-50ml-info.webp',
      alt: 'Key ingredients panel for Dr.G Black Snail Cream: black snail mucin, propolis extract and pearl powder',
    },
    {
      src: '/products/editorial/dr-g/black-snail-cream-50ml-apply.webp',
      alt: 'A Black woman in her forties smoothing a rich pearlescent cream along her cheekbone',
    },
  ],
  tirtir_ceramic_milk_ampoule_40ml_onetime: [
    {
      src: '/products/editorial/tirtir/ceramic-milk-ampoule-40ml-hero.webp',
      alt: 'TIRTIR Ceramic Milk Ampoule 40ml on a clean white studio backdrop',
    },
    {
      src: '/products/editorial/tirtir/ceramic-milk-ampoule-40ml-info.webp',
      alt: 'Key ingredients panel for TIRTIR Ceramic Milk Ampoule: ceramide complex, niacinamide and a lightweight milky ampoule texture',
    },
    {
      src: '/products/editorial/tirtir/ceramic-milk-ampoule-40ml-apply.webp',
      alt: 'A woman smoothing a milky white ampoule along her cheekbone with two fingers',
    },
  ],



  isntree_yam_root_vegan_milk_toner_200ml_onetime: [
    {
      src: '/products/editorial/isntree/yam-root-vegan-milk-toner-200ml-hero.webp',
      alt: 'ISNTREE Yam Root Vegan Milk Toner 200ml on a clean white studio backdrop',
    },
    {
      src: '/products/editorial/isntree/yam-root-vegan-milk-toner-200ml-info.webp',
      alt: 'Key ingredients panel for ISNTREE Yam Root Vegan Milk Toner: 80% yam root extract, milk-texture layering, vegan and fragrance-free',
    },
    {
      src: '/products/editorial/isntree/yam-root-vegan-milk-toner-200ml-apply.webp',
      alt: 'A mature woman patting milky toner into her cheeks with her palms',
    },
  ],

  biodance_bio_collagen_real_deep_mask_onetime: [
    {
      src: '/products/editorial/biodance/bio-collagen-real-deep-mask-hero.webp',
      alt: 'BIODANCE Bio Collagen Real Deep Mask box and sheet mask on a clean white studio backdrop',
    },
    {
      src: '/products/editorial/biodance/bio-collagen-real-deep-mask-info.webp',
      alt: 'Key ingredients panel for BIODANCE Bio Collagen Real Deep Mask: low molecular collagen, probiotics-galactomyces ferment filtrate and low molecular hyaluronic acid',
    },
    {
      src: '/products/editorial/biodance/bio-collagen-real-deep-mask-apply.webp',
      alt: 'A woman pressing a clear hydrogel sheet mask onto her cheek with her fingertips',
    },
  ],
  biodance_hydro_cera_nol_real_deep_mask_onetime: [
    {
      src: '/products/editorial/biodance/hydro-cera-nol-real-deep-mask-hero.webp',
      alt: 'BIODANCE Hydro Cera-Nol Real Deep Mask box and sheet mask on a clean white studio backdrop',
    },
    {
      src: '/products/editorial/biodance/hydro-cera-nol-real-deep-mask-info.webp',
      alt: 'Key ingredients panel for BIODANCE Hydro Cera-Nol Real Deep Mask: ceramide, glacier water and panthenol',
    },
    {
      src: '/products/editorial/biodance/hydro-cera-nol-real-deep-mask-apply.webp',
      alt: 'A woman smoothing the edge of a translucent hydrogel sheet mask along her jawline',
    },
  ],
  biodance_refreshing_sea_kelp_real_deep_mask_onetime: [
    {
      src: '/products/editorial/biodance/refreshing-sea-kelp-real-deep-mask-hero.webp',
      alt: 'BIODANCE Refreshing Sea Kelp Real Deep Mask box on a clean white studio backdrop',
    },
    {
      src: '/products/editorial/biodance/refreshing-sea-kelp-real-deep-mask-info.webp',
      alt: 'Key ingredients panel for BIODANCE Refreshing Sea Kelp Real Deep Mask: dasima sea kelp, kelp ferment filtrate and deep sea water',
    },
    {
      src: '/products/editorial/biodance/refreshing-sea-kelp-real-deep-mask-apply.webp',
      alt: 'A woman peeling back a clear hydrogel sheet mask from her cheek',
    },
  ],

  haruharu_wonder_black_rice_hyaluronic_toner_150ml_onetime: [
    {
      src: '/products/editorial/haruharu-wonder/black-rice-hyaluronic-toner-150ml-hero.webp',
      alt: 'HARUHARU WONDER Black Rice Hyaluronic Toner 150ml bottle on a clean white studio backdrop',
    },
    {
      src: '/products/editorial/haruharu-wonder/black-rice-hyaluronic-toner-150ml-info.webp',
      alt: 'Key ingredients panel for HARUHARU WONDER Black Rice Hyaluronic Toner: fermented black rice extract, hyaluronic acid complex and panthenol',
    },
    {
      src: '/products/editorial/haruharu-wonder/black-rice-hyaluronic-toner-150ml-apply.webp',
      alt: 'A woman pressing watery toner into her cheeks with both palms',
    },
  ],
  haruharu_wonder_black_rice_5_ceramide_barrier_moisturizing_cream_onetime: [
    {
      src: '/products/editorial/haruharu-wonder/black-rice-5-ceramide-barrier-moisturizing-cream-hero.webp',
      alt: 'HARUHARU WONDER Black Rice 5 Ceramide Barrier Moisturizing Cream jar on a clean white studio backdrop',
    },
    {
      src: '/products/editorial/haruharu-wonder/black-rice-5-ceramide-barrier-moisturizing-cream-info.webp',
      alt: 'Key ingredients panel for HARUHARU WONDER Black Rice 5 Ceramide Barrier Cream: five ceramides, fermented black rice extract and panthenol',
    },
    {
      src: '/products/editorial/haruharu-wonder/black-rice-5-ceramide-barrier-moisturizing-cream-apply.webp',
      alt: 'A mature woman smoothing a rich white barrier cream along her cheek',
    },
  ],
  s_nature_aqua_oasis_toner_onetime: [
    {
      src: '/products/editorial/s-nature/aqua-oasis-toner-hero.webp',
      alt: 'S.NATURE Aqua Oasis Toner bottle on a clean white studio backdrop',
    },
    {
      src: '/products/editorial/s-nature/aqua-oasis-toner-info.webp',
      alt: 'Key ingredients panel for S.NATURE Aqua Oasis Toner: 8-type hyaluronic acid, glycerin and betaine humectants, and panthenol',
    },
    {
      src: '/products/editorial/s-nature/aqua-oasis-toner-apply.webp',
      alt: 'A woman pressing watery toner into her cheek with her palm',
    },
  ],
  s_nature_aqua_squalane_serum_onetime: [
    {
      src: '/products/editorial/s-nature/aqua-squalane-serum-hero.webp',
      alt: 'S.NATURE Aqua Squalane Serum dropper bottle on a clean white studio backdrop',
    },
    {
      src: '/products/editorial/s-nature/aqua-squalane-serum-info.webp',
      alt: 'Key ingredients panel for S.NATURE Aqua Squalane Serum: squalane, hyaluronic acid complex and panthenol',
    },
    {
      src: '/products/editorial/s-nature/aqua-squalane-serum-apply.webp',
      alt: 'A woman smoothing clear serum along her cheekbone with her fingertips',
    },
  ],
  s_nature_aqua_squalane_moisturizing_cream_onetime: [
    {
      src: '/products/editorial/s-nature/aqua-squalane-moisturizing-cream-hero.webp',
      alt: 'S.NATURE Aqua Squalane Moisturizing Cream on a clean white studio backdrop',
    },
    {
      src: '/products/editorial/s-nature/aqua-squalane-moisturizing-cream-info.webp',
      alt: 'Key ingredients panel for S.NATURE Aqua Squalane Moisturizing Cream: squalane, hyaluronic acid complex and a softening emollient base',
    },
    {
      src: '/products/editorial/s-nature/aqua-squalane-moisturizing-cream-apply.webp',
      alt: 'A woman massaging a rich white moisturising cream into her cheek',
    },
  ],
  s_nature_aqua_oasis_moisturizing_gel_onetime: [
    {
      src: '/products/editorial/s-nature/aqua-oasis-moisturizing-gel-hero.webp',
      alt: 'S.NATURE Aqua Oasis Moisturizing Gel on a clean white studio backdrop',
    },
    {
      src: '/products/editorial/s-nature/aqua-oasis-moisturizing-gel-info.webp',
      alt: 'Key ingredients panel for S.NATURE Aqua Oasis Moisturizing Gel: 8-type hyaluronic acid, water-gel base and panthenol',
    },
    {
      src: '/products/editorial/s-nature/aqua-oasis-moisturizing-gel-apply.webp',
      alt: 'A woman patting a light water-gel moisturiser onto her jawline',
    },
  ],
  s_nature_aqua_soy_yogurt_eye_cream_onetime: [
    {
      src: '/products/editorial/s-nature/aqua-soy-yogurt-eye-cream-hero.webp',
      alt: 'S.NATURE Aqua Soy Yogurt Eye Cream on a clean white studio backdrop',
    },
    {
      src: '/products/editorial/s-nature/aqua-soy-yogurt-eye-cream-info.webp',
      alt: 'Key ingredients panel for S.NATURE Aqua Soy Yogurt Eye Cream: fermented soy yogurt extract, peptides and hyaluronic acid complex',
    },
    {
      src: '/products/editorial/s-nature/aqua-soy-yogurt-eye-cream-apply.webp',
      alt: 'A woman gently tapping eye cream along her under-eye with her ring finger',
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
  const verified = applicationForSlug(productSlug(p));
  if (verified && verified.steps.length > 0) return verified.steps;
  return COPY[p.priceId]?.howToUse ?? CATEGORY_HOW_TO[p.category];
}

/**
 * True only when this SKU has its own written directions in the project data.
 * When false, `howToUse` returns generic guidance for the routine step and the
 * UI must say so rather than presenting it as the brand's own directions.
 */
export function hasProductSpecificHowTo(p: ShopProduct): boolean {
  const verified = applicationForSlug(productSlug(p));
  if (verified && verified.steps.length > 0) return true;
  return Array.isArray(COPY[p.priceId]?.howToUse);
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
  const bespoke = bespokeHeroIngredients(p.priceId);
  if (bespoke) return bespoke;

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
