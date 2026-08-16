// Skin Grocer launch assortment — 52 SKUs across 13 K-beauty brands.
// Product photography lives in public/products/<brand-slug>/<product-slug>.png

export type Category = "Cleanse" | "Tone" | "Treat" | "Moisturise" | "Protect" | "Masks";
export type Concern = "hydration" | "acne" | "pigmentation" | "sensitivity" | "anti-aging" | "barrier";

export type ShopProduct = {
  name: string;
  brand: string;
  price: string;
  priceId: string;
  tag: string | null;
  category: Category;
  image: string;
  concerns: Concern[];
  /** Landed stock not yet in the Epping warehouse — shown but not purchasable. */
  comingSoon?: boolean;
};

export const SHOP_PRODUCTS: ShopProduct[] = [
  { name: "Real Hyaluronic Toner 200ml", brand: "WELLAGE", price: "$28", priceId: "wellage_real_hyaluronic_toner_200ml_onetime", tag: null, category: "Tone", image: "/products/wellage/real-hyaluronic-toner-200ml.png", concerns: ["hydration","pigmentation"] },
  { name: "Red Blemish Clear Soothing Foam 150ml", brand: "Dr.G", price: "$32", priceId: "dr_g_red_blemish_clear_soothing_foam_150ml_onetime", tag: null, category: "Cleanse", image: "/products/dr-g/red-blemish-clear-soothing-foam-150ml.png", concerns: ["acne","sensitivity"] },
  { name: "Hyper PDRN Repair Ampoule 30ml", brand: "WELLAGE", price: "$40", priceId: "wellage_hyper_pdrn_repair_ampoule_30ml_onetime", tag: null, category: "Treat", image: "/products/wellage/hyper-pdrn-repair-ampoule-30ml.png", concerns: ["anti-aging"] },
  { name: "Real Hyaluronic Blue 100 Ampoule 60ml", brand: "WELLAGE", price: "$34", priceId: "wellage_real_hyaluronic_blue_100_ampoule_60ml_onetime", tag: null, category: "Treat", image: "/products/wellage/real-hyaluronic-blue-100-ampoule-60ml.png", concerns: ["hydration"] },
  { name: "Real Hyaluronic 100 Cream 80ml", brand: "WELLAGE", price: "$30", priceId: "wellage_real_hyaluronic_100_cream_80ml_onetime", tag: null, category: "Moisturise", image: "/products/wellage/real-hyaluronic-100-cream-80ml.png", concerns: ["hydration"] },
  { name: "One Day Exosome Shot Pore Serum 2000 30ml", brand: "MEDICUBE", price: "$40", priceId: "medicube_one_day_exosome_shot_pore_serum_2000_30ml_onetime", tag: null, category: "Treat", image: "/products/medicube/one-day-exosome-shot-pore-serum-2000-30ml.png", concerns: ["acne"] },
  { name: "PDRN Pink Peptide Serum 30ml", brand: "MEDICUBE", price: "$40", priceId: "medicube_pdrn_pink_peptide_serum_30ml_onetime", tag: null, category: "Treat", image: "/products/medicube/pdrn-pink-peptide-serum-30ml.png", concerns: ["anti-aging"] },
  { name: "PDRN Pink Niacinamide Whip Cleanser 120g", brand: "MEDICUBE", price: "$36", priceId: "medicube_pdrn_pink_niacinamide_whip_cleanser_120g_onetime", tag: null, category: "Cleanse", image: "/products/medicube/pdrn-pink-niacinamide-whip-cleanser-120g.png", concerns: ["anti-aging","pigmentation"] },
  { name: "Ceramic Milk Ampoule 40ml", brand: "TIRTIR", price: "$50", priceId: "tirtir_ceramic_milk_ampoule_40ml_onetime", tag: null, category: "Treat", image: "/products/tirtir/ceramic-milk-ampoule-40ml.png", concerns: ["hydration"] },
  { name: "Collagen Jelly Cream 110ml", brand: "MEDICUBE", price: "$40", priceId: "medicube_collagen_jelly_cream_110ml_onetime", tag: null, category: "Moisturise", image: "/products/medicube/collagen-jelly-cream-110ml.png", concerns: ["barrier","anti-aging"] },
  { name: "PDRN Pink Peptide Eye Cream 30ml", brand: "MEDICUBE", price: "$38", priceId: "medicube_pdrn_pink_peptide_eye_cream_30ml_onetime", tag: null, category: "Moisturise", image: "/products/medicube/pdrn-pink-peptide-eye-cream-30ml.png", concerns: ["anti-aging"] },
  { name: "PDRN Pink Cica Soothing Toner 250ml", brand: "MEDICUBE", price: "$36", priceId: "medicube_pdrn_pink_cica_soothing_toner_250ml_onetime", tag: null, category: "Tone", image: "/products/medicube/pdrn-pink-cica-soothing-toner-250ml.png", concerns: ["sensitivity","anti-aging","pigmentation"] },
  { name: "Revive Eye Serum: Ginseng + Retinal 30ml", brand: "Beauty of Joseon", price: "$34", priceId: "beauty_of_joseon_revive_eye_serum_ginseng_plus_retinal_30ml_onetime", tag: null, category: "Treat", image: "/products/beauty-of-joseon/revive-eye-serum-ginseng-plus-retinal-30ml.png", concerns: ["anti-aging"] },
  { name: "Real Hyaluronic Soothing Cream 80ml", brand: "WELLAGE", price: "$38", priceId: "wellage_real_hyaluronic_soothing_cream_80ml_onetime", tag: null, category: "Moisturise", image: "/products/wellage/real-hyaluronic-soothing-cream-80ml.png", concerns: ["hydration","sensitivity"] },
  { name: "Cicaful Ampoule 30ml", brand: "beplain", price: "$38", priceId: "beplain_cicaful_ampoule_30ml_onetime", tag: null, category: "Treat", image: "/products/beplain/cicaful-ampoule-30ml.png", concerns: ["sensitivity"] },
  { name: "Mung Bean Cleansing Oil 200ml", brand: "beplain", price: "$35", priceId: "beplain_mung_bean_cleansing_oil_200ml_onetime", tag: null, category: "Cleanse", image: "/products/beplain/mung-bean-cleansing-oil-200ml.png", concerns: ["sensitivity"] },
  { name: "Mung Bean pH-Balanced Cleansing Foam 80ml", brand: "beplain", price: "$24", priceId: "beplain_mung_bean_ph_balanced_cleansing_foam_80ml_onetime", tag: null, category: "Cleanse", image: "/products/beplain/mung-bean-ph-balanced-cleansing-foam-80ml.png", concerns: ["sensitivity"] },
  { name: "1025 Dokdo Toner 100ml", brand: "ROUND LAB", price: "$18", priceId: "round_lab_1025_dokdo_toner_100ml_onetime", tag: null, category: "Tone", image: "/products/round-lab/1025-dokdo-toner-100ml.png", concerns: ["pigmentation"] },
  { name: "1025 Dokdo Lotion 200ml", brand: "ROUND LAB", price: "$36", priceId: "round_lab_1025_dokdo_lotion_200ml_onetime", tag: null, category: "Moisturise", image: "/products/round-lab/1025-dokdo-lotion-200ml.png", concerns: ["hydration"] },
  { name: "1025 Dokdo Cleanser 150ml", brand: "ROUND LAB", price: "$24", priceId: "round_lab_1025_dokdo_cleanser_150ml_onetime", tag: null, category: "Cleanse", image: "/products/round-lab/1025-dokdo-cleanser-150ml.png", concerns: ["hydration"] },
  { name: "1025 Dokdo Toner + Lotion Special Set (200ml + 200ml)", brand: "ROUND LAB", price: "$45", priceId: "round_lab_1025_dokdo_toner_plus_lotion_special_set_onetime", tag: null, category: "Tone", image: "/products/round-lab/1025-dokdo-toner-plus-lotion-special-set.png", concerns: ["hydration","pigmentation"] },
  { name: "Birch Juice Moisturizing Cream 80ml", brand: "ROUND LAB", price: "$35", priceId: "round_lab_birch_juice_moisturizing_cream_80ml_onetime", tag: null, category: "Moisturise", image: "/products/round-lab/birch-juice-moisturizing-cream-80ml.png", concerns: ["hydration","barrier"] },
  { name: "1025 Dokdo Trial Kit (Cleanser 30ml + Toner 20ml + Ampule 10ml + Cream 20ml)", brand: "ROUND LAB", price: "$30", priceId: "round_lab_1025_dokdo_trial_kit_onetime", tag: null, category: "Treat", image: "/products/round-lab/1025-dokdo-trial-kit.png", concerns: ["pigmentation"] },
  { name: "Hyaluronic Acid Water Essence 50ml", brand: "ISNTREE", price: "$40", priceId: "isntree_hyaluronic_acid_water_essence_50ml_onetime", tag: null, category: "Treat", image: "/products/isntree/hyaluronic-acid-water-essence-50ml.png", concerns: ["hydration"] },
  { name: "Green Tea Fresh Toner 200ml", brand: "ISNTREE", price: "$26", priceId: "isntree_green_tea_fresh_toner_200ml_onetime", tag: null, category: "Tone", image: "/products/isntree/green-tea-fresh-toner-200ml.png", concerns: ["sensitivity","pigmentation"] },
  { name: "Chestnut BHA 2% Clear Liquid 100ml", brand: "ISNTREE", price: "$36", priceId: "isntree_chestnut_bha_2_percent_clear_liquid_100ml_onetime", tag: null, category: "Treat", image: "/products/isntree/chestnut-bha-2-percent-clear-liquid-100ml.png", concerns: ["acne"] },
  { name: "Yam Root Vegan Milk Cleanser 220ml", brand: "ISNTREE", price: "$38", priceId: "isntree_yam_root_vegan_milk_cleanser_220ml_onetime", tag: null, category: "Cleanse", image: "/products/isntree/yam-root-vegan-milk-cleanser-220ml.png", concerns: ["hydration"] },
  { name: "Yam Root Vegan Milk Toner 200ml", brand: "ISNTREE", price: "$32", priceId: "isntree_yam_root_vegan_milk_toner_200ml_onetime", tag: null, category: "Tone", image: "/products/isntree/yam-root-vegan-milk-toner-200ml.png", concerns: ["hydration","pigmentation"] },
  { name: "Black Rice Hyaluronic Toner 150ml", brand: "HARUHARU WONDER", price: "$28", priceId: "haruharu_wonder_black_rice_hyaluronic_toner_150ml_onetime", tag: null, category: "Tone", image: "/products/haruharu-wonder/black-rice-hyaluronic-toner-150ml.png", concerns: ["hydration","pigmentation"] },
  { name: "Black Rice 5 Ceramide Barrier Moisturizing Cream", brand: "HARUHARU WONDER", price: "$38", priceId: "haruharu_wonder_black_rice_5_ceramide_barrier_moisturizing_cream_onetime", tag: null, category: "Moisturise", image: "/products/haruharu-wonder/black-rice-5-ceramide-barrier-moisturizing-cream.png", concerns: ["hydration","barrier","pigmentation"] },
  { name: "Dive In Serum", brand: "TORRIDEN", price: "$38", priceId: "torriden_dive_in_serum_onetime", tag: null, category: "Treat", image: "/products/torriden/dive-in-serum.png", concerns: ["hydration"] },
  { name: "Dive In Soothing Cream", brand: "TORRIDEN", price: "$40", priceId: "torriden_dive_in_soothing_cream_onetime", tag: null, category: "Moisturise", image: "/products/torriden/dive-in-soothing-cream.png", concerns: ["hydration","sensitivity"] },
  { name: "Balanceful Cleansing Gel", brand: "TORRIDEN", price: "$34", priceId: "torriden_balanceful_cleansing_gel_onetime", tag: null, category: "Cleanse", image: "/products/torriden/balanceful-cleansing-gel.png", concerns: ["barrier"] },
  { name: "Dive In Mask Pack 1pc", brand: "TORRIDEN", price: "$10", priceId: "torriden_dive_in_mask_pack_1pc_onetime", tag: null, category: "Masks", image: "/products/torriden/dive-in-mask-pack-1pc.png", concerns: ["hydration"] },
  { name: "Balanceful Trial Kit (Global)", brand: "TORRIDEN", price: "$35", priceId: "torriden_balanceful_trial_kit_onetime", tag: null, category: "Treat", image: "/products/torriden/balanceful-trial-kit.png", concerns: ["barrier"] },
  { name: "Dive In Trial Kit (Global)", brand: "TORRIDEN", price: "$35", priceId: "torriden_dive_in_trial_kit_onetime", tag: null, category: "Treat", image: "/products/torriden/dive-in-trial-kit.png", concerns: ["hydration"] },
  { name: "Refreshing Sea Kelp Real Deep Mask", brand: "BIODANCE", price: "$38", priceId: "biodance_refreshing_sea_kelp_real_deep_mask_onetime", tag: null, category: "Masks", image: "/products/biodance/refreshing-sea-kelp-real-deep-mask.png", concerns: ["sensitivity"] },
  { name: "Bio Collagen Real Deep Mask", brand: "BIODANCE", price: "$38", priceId: "biodance_bio_collagen_real_deep_mask_onetime", tag: null, category: "Masks", image: "/products/biodance/bio-collagen-real-deep-mask.png", concerns: ["barrier","anti-aging"] },
  { name: "Hydro Cera-Nol Real Deep Mask", brand: "BIODANCE", price: "$38", priceId: "biodance_hydro_cera_nol_real_deep_mask_onetime", tag: null, category: "Masks", image: "/products/biodance/hydro-cera-nol-real-deep-mask.png", concerns: ["hydration","barrier"] },
  { name: "R.E.D Blemish Clear Soothing Cream 70ml", brand: "Dr.G", price: "$45", priceId: "dr_g_r_e_d_blemish_clear_soothing_cream_70ml_onetime", tag: null, category: "Moisturise", image: "/products/dr-g/r-e-d-blemish-clear-soothing-cream-70ml.png", concerns: ["acne","sensitivity"] },
  { name: "Black Snail Cream 50ml", brand: "Dr.G", price: "$38", priceId: "dr_g_black_snail_cream_50ml_onetime", tag: null, category: "Moisturise", image: "/products/dr-g/black-snail-cream-50ml.png", concerns: ["acne"] },
  { name: "Atobarrier365 Cream (2nd Generation)", brand: "AESTURA", price: "$55", priceId: "aestura_atobarrier365_cream_onetime", tag: null, category: "Moisturise", image: "/products/aestura/atobarrier365-cream.png", concerns: ["sensitivity","barrier"] },
  { name: "Derma UV365 Barrier Moisture Mineral Sun Cream", brand: "AESTURA", price: "$38", priceId: "aestura_derma_uv365_barrier_moisture_mineral_sun_cream_onetime", tag: null, category: "Protect", image: "/products/aestura/derma-uv365-barrier-moisture-mineral-sun-cream.png", concerns: ["hydration","barrier","pigmentation"] },
  { name: "A-Cica Moisture Toner", brand: "AESTURA", price: "$34", priceId: "aestura_a_cica_moisture_toner_onetime", tag: null, category: "Tone", image: "/products/aestura/a-cica-moisture-toner.png", concerns: ["hydration","sensitivity","pigmentation"] },
  { name: "Atobarrier 365 Hydro Soothing Cream", brand: "AESTURA", price: "$60", priceId: "aestura_atobarrier_365_hydro_soothing_cream_onetime", tag: null, category: "Moisturise", image: "/products/aestura/atobarrier-365-hydro-soothing-cream.png", concerns: ["hydration","sensitivity","barrier"] },
  { name: "Aqua Oasis Toner", brand: "S.NATURE", price: "$40", priceId: "s_nature_aqua_oasis_toner_onetime", tag: null, category: "Tone", image: "/products/s-nature/aqua-oasis-toner.png", concerns: ["hydration","pigmentation"] },
  { name: "Aqua Squalane Serum", brand: "S.NATURE", price: "$34", priceId: "s_nature_aqua_squalane_serum_onetime", tag: null, category: "Treat", image: "/products/s-nature/aqua-squalane-serum.png", concerns: ["hydration"] },
  { name: "Aqua Squalane Moisturizing Cream", brand: "S.NATURE", price: "$35", priceId: "s_nature_aqua_squalane_moisturizing_cream_onetime", tag: null, category: "Moisturise", image: "/products/s-nature/aqua-squalane-moisturizing-cream.png", concerns: ["hydration"] },
  { name: "Aqua Oasis Moisturizing Gel", brand: "S.NATURE", price: "$40", priceId: "s_nature_aqua_oasis_moisturizing_gel_onetime", tag: null, category: "Moisturise", image: "/products/s-nature/aqua-oasis-moisturizing-gel.png", concerns: ["hydration"] },
  { name: "Aqua Soy Yogurt Eye Cream", brand: "S.NATURE", price: "$35", priceId: "s_nature_aqua_soy_yogurt_eye_cream_onetime", tag: null, category: "Moisturise", image: "/products/s-nature/aqua-soy-yogurt-eye-cream.png", concerns: ["hydration","anti-aging"] },
  { name: "Mung Bean Pore Tight-Up Soothing Cream", brand: "beplain", price: "$28", priceId: "beplain_mung_bean_pore_tight_up_soothing_cream_onetime", tag: null, category: "Moisturise", image: "/products/beplain/mung-bean-pore-tight-up-soothing-cream.png", concerns: ["acne","sensitivity"] },
  { name: "Milk Ceramide Moisturizing Cream", brand: "beplain", price: "$35", priceId: "beplain_milk_ceramide_moisturizing_cream_onetime", tag: null, category: "Moisturise", image: "/products/beplain/milk-ceramide-moisturizing-cream.png", concerns: ["hydration","barrier"] },
  { name: "Ginseng Cleansing Oil 210ml", brand: "Beauty of Joseon", price: "$30", priceId: "beauty_of_joseon_ginseng_cleansing_oil_210ml_onetime", tag: "Coming soon", category: "Cleanse", image: "/products/beauty-of-joseon/ginseng-cleansing-oil-210ml.png", concerns: ["hydration"], comingSoon: true },
  { name: "Green Plum Refreshing Toner: AHA + BHA 150ml", brand: "Beauty of Joseon", price: "$32", priceId: "beauty_of_joseon_green_plum_refreshing_toner_150ml_onetime", tag: "Coming soon", category: "Tone", image: "/products/beauty-of-joseon/green-plum-refreshing-toner-aha-bha-150ml.png", concerns: ["acne"], comingSoon: true },
  { name: "Glow Serum: Propolis + Niacinamide 30ml", brand: "Beauty of Joseon", price: "$34", priceId: "beauty_of_joseon_glow_serum_propolis_plus_niacinamide_30ml_onetime", tag: "Coming soon", category: "Treat", image: "/products/beauty-of-joseon/glow-serum-propolis-plus-niacinamide-30ml.png", concerns: ["hydration","pigmentation"], comingSoon: true },
  { name: "Dynasty Cream 50ml", brand: "Beauty of Joseon", price: "$36", priceId: "beauty_of_joseon_dynasty_cream_50ml_onetime", tag: "Coming soon", category: "Moisturise", image: "/products/beauty-of-joseon/dynasty-cream-50ml.png", concerns: ["hydration","barrier"], comingSoon: true },
];

/** Numeric price (AUD) for a catalog product. */
export function productPrice(p: ShopProduct): number {
  return Number(p.price.replace(/[^0-9.]/g, ""));
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

/** Find a catalog product from a "BRAND Product Name" label. */
export function findCatalogProduct(label: string): ShopProduct | undefined {
  const n = norm(label);
  return SHOP_PRODUCTS.find((p) => n === norm(`${p.brand} ${p.name}`))
    ?? SHOP_PRODUCTS.find((p) => n.includes(norm(p.name)) && n.includes(norm(p.brand)))
    ?? SHOP_PRODUCTS.find((p) => n.includes(norm(p.name)));
}

/**
 * Live bundle maths: sums the CURRENT catalog price of each included product,
 * so displayed "individual total" / "save" figures can never drift from the catalog.
 */
export function bundleMath(includes: string[], bundlePrice: number) {
  const original = includes.reduce((sum, label) => {
    const p = findCatalogProduct(label);
    return sum + (p ? productPrice(p) : 0);
  }, 0);
  const save = Math.max(0, original - bundlePrice);
  return {
    original,
    save,
    percent: original > 0 ? Math.round((save / original) * 100) : 0,
  };
}

export type BundleProduct = { img: string; alt: string };

export type BundleDefinition = {
  priceId: string;
  tag: string;
  name: string;
  desc: string;
  includes: string[];
  products: BundleProduct[];
  price: number;
  featured: boolean;
};

/** Canonical bundle definitions — single source of truth for both landing promos and the bundle grid. */
export const BUNDLE_DEFINITIONS: BundleDefinition[] = [
  {
    priceId: "bundle_glass_skin_starter_onetime",
    tag: "Starter Ritual",
    name: "The Glass Skin Starter",
    desc: "A 4-step intro to Korean skincare — cleanse, tone, hydrate, protect.",
    includes: [
      "ROUND LAB 1025 Dokdo Cleanser 150ml",
      "WELLAGE Real Hyaluronic Toner 200ml",
      "TORRIDEN Dive In Serum",
      "AESTURA Derma UV365 Barrier Moisture Mineral Sun Cream",
    ],
    products: [
      { img: "/products/round-lab/1025-dokdo-cleanser-150ml.png", alt: "ROUND LAB 1025 Dokdo Cleanser 150ml" },
      { img: "/products/wellage/real-hyaluronic-toner-200ml.png", alt: "WELLAGE Real Hyaluronic Toner 200ml" },
      { img: "/products/torriden/dive-in-serum.png", alt: "TORRIDEN Dive In Serum" },
      { img: "/products/aestura/derma-uv365-barrier-moisture-mineral-sun-cream.png", alt: "AESTURA Derma UV365 Barrier Moisture Mineral Sun Cream" },
    ],
    price: 79,
    featured: false,
  },
  {
    priceId: "bundle_complete_glow_onetime",
    tag: "Best Value · Save 25%",
    name: "The Complete Glow Edit",
    desc: "Our most-loved ritual, advisor-built. A full month of glass-skin results.",
    includes: [
      "MEDICUBE PDRN Pink Niacinamide Whip Cleanser 120g",
      "MEDICUBE PDRN Pink Cica Soothing Toner 250ml",
      "MEDICUBE PDRN Pink Peptide Serum 30ml",
      "MEDICUBE Collagen Jelly Cream 110ml",
      "BIODANCE Bio Collagen Real Deep Mask",
    ],
    products: [
      { img: "/products/medicube/pdrn-pink-niacinamide-whip-cleanser-120g.png", alt: "MEDICUBE PDRN Pink Niacinamide Whip Cleanser 120g" },
      { img: "/products/medicube/pdrn-pink-cica-soothing-toner-250ml.png", alt: "MEDICUBE PDRN Pink Cica Soothing Toner 250ml" },
      { img: "/products/medicube/pdrn-pink-peptide-serum-30ml.png", alt: "MEDICUBE PDRN Pink Peptide Serum 30ml" },
      { img: "/products/medicube/collagen-jelly-cream-110ml.png", alt: "MEDICUBE Collagen Jelly Cream 110ml" },
      { img: "/products/biodance/bio-collagen-real-deep-mask.png", alt: "BIODANCE Bio Collagen Real Deep Mask" },
    ],
    price: 142,
    featured: true,
  },
  {
    priceId: "bundle_calm_clear_onetime",
    tag: "Concern Kit",
    name: "Calm & Clear Bundle",
    desc: "For breakout-prone, sensitive skin. Cica, BHA and barrier repair.",
    includes: [
      "Dr.G Red Blemish Clear Soothing Foam 150ml",
      "ISNTREE Chestnut BHA 2% Clear Liquid 100ml",
      "beplain Cicaful Ampoule 30ml",
      "AESTURA Atobarrier365 Cream (2nd Generation)",
    ],
    products: [
      { img: "/products/dr-g/red-blemish-clear-soothing-foam-150ml.png", alt: "Dr.G Red Blemish Clear Soothing Foam 150ml" },
      { img: "/products/isntree/chestnut-bha-2-percent-clear-liquid-100ml.png", alt: "ISNTREE Chestnut BHA 2% Clear Liquid 100ml" },
      { img: "/products/beplain/cicaful-ampoule-30ml.png", alt: "beplain Cicaful Ampoule 30ml" },
      { img: "/products/aestura/atobarrier365-cream.png", alt: "AESTURA Atobarrier365 Cream" },
    ],
    price: 128,
    featured: false,
  },
];

/** Live aggregate savings across all bundles — for promos, tickers, and hero banners. */
export function bundleSavingsSummary() {
  const computed = BUNDLE_DEFINITIONS.map((b) => bundleMath(b.includes, b.price));
  const maxSave = Math.max(...computed.map((c) => c.save));
  const maxPercent = Math.max(...computed.map((c) => c.percent));
  return { maxSave, maxPercent };
}

// ---------------------------------------------------------------------------
// Checkout helpers — resolving a price id to cart line data.
// ---------------------------------------------------------------------------

/** "$35" | "A$35" -> 3500 */
export function priceToCents(price: string): number {
  const n = Number(String(price).replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
}

/** Routine staples available as a monthly Restock subscription (15% off). */
export const RESTOCK_PRICE_BY_PRODUCT: Record<string, string> = {
  beplain_mung_bean_cleansing_oil_200ml_onetime: 'restock_beplain_mung_bean_cleansing_oil_200ml_monthly',
  beplain_mung_bean_ph_balanced_cleansing_foam_80ml_onetime: 'restock_beplain_mung_bean_ph_balanced_cleansing_foam_80ml_monthly',
  round_lab_1025_dokdo_toner_100ml_onetime: 'restock_round_lab_1025_dokdo_toner_100ml_monthly',
  round_lab_birch_juice_moisturizing_cream_80ml_onetime: 'restock_round_lab_birch_juice_moisturizing_cream_80ml_monthly',
  wellage_real_hyaluronic_toner_200ml_onetime: 'restock_wellage_real_hyaluronic_toner_200ml_monthly',
  isntree_hyaluronic_acid_water_essence_50ml_onetime: 'restock_isntree_hyaluronic_acid_water_essence_50ml_monthly',
  aestura_atobarrier365_cream_onetime: 'restock_aestura_atobarrier365_cream_monthly',
  aestura_derma_uv365_barrier_moisture_mineral_sun_cream_onetime: 'restock_aestura_derma_uv365_mineral_sun_cream_monthly',
};

export const RESTOCK_DISCOUNT_PERCENT = 15;

export function restockPriceIdFor(oneTimePriceId: string): string | null {
  return RESTOCK_PRICE_BY_PRODUCT[oneTimePriceId] ?? null;
}

export function restockCentsFor(oneTimeCents: number): number {
  return Math.round((oneTimeCents * (100 - RESTOCK_DISCOUNT_PERCENT)) / 100 / 5) * 5;
}

export type CatalogEntry = {
  priceId: string;
  name: string;
  brand: string;
  image: string;
  unitCents: number;
};

/** Look up any purchasable price id — product, bundle, or Restock subscription. */
export function catalogEntryFor(priceId: string): CatalogEntry | null {
  const product = SHOP_PRODUCTS.find((p) => p.priceId === priceId);
  if (product) {
    return {
      priceId,
      name: product.name,
      brand: product.brand,
      image: product.image,
      unitCents: priceToCents(product.price),
    };
  }
  const bundle = BUNDLE_DEFINITIONS.find((b) => b.priceId === priceId);
  if (bundle) {
    return {
      priceId,
      name: bundle.name,
      brand: 'Skin Grocer',
      image: bundle.products[0]?.img ?? '/products/placeholder.png',
      unitCents: bundle.price * 100,
    };
  }
  const restockSource = Object.entries(RESTOCK_PRICE_BY_PRODUCT).find(([, sub]) => sub === priceId);
  if (restockSource) {
    const base = SHOP_PRODUCTS.find((p) => p.priceId === restockSource[0]);
    if (base) {
      return {
        priceId,
        name: `${base.name} — monthly Restock`,
        brand: base.brand,
        image: base.image,
        unitCents: restockCentsFor(priceToCents(base.price)),
      };
    }
  }
  return null;
}
