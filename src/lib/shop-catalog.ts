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
  /**
   * Verified pack size / quantity for the exact SKU we buy, e.g. "50ml",
   * "4 sheets", or a full trial-kit breakdown. Omitted only when the size is
   * already stated at the end of `name` — `productSizeFor()` is the single
   * source of truth for display everywhere.
   */
  size?: string;
  /** Landed stock not yet in the Epping warehouse — shown but not purchasable. */
  comingSoon?: boolean;
  // --- content governance -------------------------------------------------
  /** Official brand product name, exactly as published by the brand. */
  officialProductName?: string;
  /** Directions transcribed from the brand's own published instructions. */
  usageDirections?: string[];
  /** Where `usageDirections` came from (brand site, packaging, etc.). */
  usageSource?: string;
  /** Neutral, non-therapeutic description of what the product does. */
  cosmeticRole?: string[];
  /** Where `cosmeticRole` came from. */
  cosmeticRoleSource?: string;
  /** Product-specific answer to "What is this good for?" — overrides generated copy. */
  goodFor?: string;
  /** ISO date the sourced fields above were last checked. */
  lastReviewed?: string;
  /**
   * Complete INCI list for THIS exact SKU, transcribed in printed order.
   * Never merged from another size, another product in the line, or an older
   * formula. Key-ingredient cards are validated against this list.
   */
  inci?: string[];
  /**
   * What kind of source the list came from.
   *  - `packaging`            — transcribed from the carton in our own hands.
   *  - `brand`                — the brand's own official product page.
   *  - `authorised-retailer`  — a named retailer's product page for this SKU.
   *  - `supplier`             — a named supply partner's published listing.
   *  - `internal-supplier-record` — a private record from our supply partner.
   *    NOT an independently verifiable public source, and never presented as one.
   */
  inciSource?: InciSourceType;
  /** Exact name of the source, e.g. "ROUND LAB official product page". */
  inciSourceName?: string;
  /** Direct link to the exact page the list was read from. Never a homepage. */
  inciSourceUrl?: string;
  /** ISO date the INCI list above was checked against its source. */
  inciCheckedOn?: string;
  /**
   * ISO date the online INCI list was verified against the physical product
   * packaging in hand. Set ONLY after the Melbourne team has compared it with
   * actual stock — while absent, the ingredient panel shows the list as
   * pending packaging verification.
   */
  inciPackagingVerifiedOn?: string;
  /**
   * Optional customer-facing note explaining the source of an internal or
   * supply-partner record. Use it to name the partner and clarify that the
   * supporting record is private and cannot be independently checked online.
   */
  inciSourceNote?: string;
  /**
   * Sunscreens are therapeutic goods in Australia, not ordinary cosmetics.
   * A Protect SKU is only purchasable, recommendable and allowed to carry SPF
   * or UV-protection guidance once every field below is documented.
   */
  sunscreenCompliance?: SunscreenCompliance;
  // --- supplier reconciliation (Stage 1) -----------------------------------
  /**
   * Where this SKU sits in the supplier-cart reconciliation. `unmatched` means
   * the product could not be found in any documented supplier cart, so it may
   * not be sold, recommended or bundled. Similarity to another product is
   * never evidence of supply.
   */
  supplierReconciliationStatus?: SupplierReconciliationStatus;
  /** True only when the SKU has been located in a documented supplier record. */
  supplierMatchConfirmed?: boolean;
  /** Explicit override — false blocks every purchase path for this SKU. */
  purchasable?: boolean;
  // --- Stage 2A: supplier-ordered records awaiting content ------------------
  /** True once an internal product record exists for a supplier-ordered SKU. */
  productRecordCreated?: boolean;
  /**
   * `content_in_preparation` — the SKU is confirmed in a supplier order, but its
   * pack size, ingredient list, price, imagery and guidance are not yet verified.
   * It is viewable, never priced, never purchasable and never recommended.
   */
  websiteStatus?: 'live' | 'content_in_preparation';
  /** Physical packaging check against stock in hand. */
  packagingCheck?: 'pending' | 'confirmed';
  /** Ingredient-list review state. */
  ingredientReviewStatus?: 'pending' | 'reviewed';
  /** Australian retail price confirmation state. */
  priceStatus?: 'pending' | 'confirmed';
  /** Explicit approval for Routine Finder inclusion. */
  routineFinderEligible?: boolean;
};

export type SupplierReconciliationStatus =
  | 'matched_umma'
  | 'matched_seoul4pm'
  | 'matched_both'
  | 'other_documented_supplier'
  | 'unmatched'
  | 'verification_pending';

export type InciSourceType =
  | 'packaging'
  | 'brand'
  | 'authorised-retailer'
  | 'supplier'
  | 'internal-supplier-record';

export type SunscreenCompliance = {
  /** Plain-language supply status, e.g. "Under verification — not offered for sale". */
  australianSupplyStatus: string;
  /** Confirmed entry in the Australian Register of Therapeutic Goods. */
  artgEntryConfirmed: boolean;
  /** AUST L / AUST R number exactly as it appears on the ARTG entry. */
  artgNumber?: string;
  /** Australian sponsor or importer of record. */
  australianSponsor?: string;
  /** Australian-compliant packaging and labelling checked against stock in hand. */
  packagingVerified: boolean;
  /** Link or document reference supporting the fields above. */
  evidenceUrl?: string;
  /** ISO date the compliance record was last reviewed. */
  complianceReviewedOn: string;
};


export const SHOP_PRODUCTS: ShopProduct[] = [
  {
    name: "Real Hyaluronic 100 Toner 200ml",
    officialProductName: "Real Hyaluronic 100 Toner 200ml",
    brand: "WELLAGE",
    price: "$28",
    priceId: "wellage_real_hyaluronic_toner_200ml_onetime",
    tag: null,
    category: "Tone",
    image: "/products/wellage/real-hyaluronic-toner-200ml.webp",
    concerns: ["hydration"],
    goodFor:
      "This is a lightweight hydrating toner used after cleansing. Its humectant-rich formula is designed to add surface hydration and prepare the skin for the products that follow. Individual suitability and results vary; review the full ingredient list and introduce one new product at a time.",
    cosmeticRole: [
      "A hydrating toner designed to add a light water-based layer after cleansing.",
      "The formula contains hyaluronic-acid derivatives and other humectant ingredients that support cosmetic surface hydration.",
      "It can be applied with clean hands or a cotton pad according to your routine preference.",
    ],
    cosmeticRoleSource:
      "WELLAGE official brand product page for Real Hyaluronic 100 Toner (wellage.co.kr), product name and cosmetic role verified 1 September 2026.",
    usageDirections: [
      "After cleansing, dispense an appropriate amount into clean hands or onto a cotton pad.",
      "Gently apply across the face and neck, avoiding direct contact with the eyes. Do not scrub or drag the skin.",
      "Pat lightly until absorbed, then continue with your serum, treatment or moisturiser.",
    ],
    usageSource:
      "WELLAGE official brand product page for Real Hyaluronic 100 Toner (wellage.co.kr), directions verified 1 September 2026.",
    lastReviewed: "2026-09-01",
    // Transcribed in printed order from the WELLAGE Real Hyaluronic 100 Toner
    // 200ml listing supplied by our Korean wholesale supply partner. Nothing
    // here is merged from the ampoule, cream or any other size.
    inci: [
      "Hydrolyzed Hyaluronic Acid",
      "Glycerin",
      "Propanediol",
      "Hydrogenated Lecithin",
      "Sodium Hyaluronate",
      "1,2-Hexanediol",
      "Arginine",
      "Benzyl Glycol",
      "Betaine",
      "Butylene Glycol",
      "Caprylic/Capric Triglyceride",
      "Citric Acid",
      "Dimethylsilanol Hyaluronate",
      "Disodium EDTA",
      "Ethylhexylglycerin",
      "Glycine",
      "Histidine",
      "Hyaluronic Acid",
      "Hydrolyzed Glycosaminoglycans",
      "Hydrolyzed Sodium Hyaluronate",
      "Hydroxypropyltrimonium Hyaluronate",
      "Lysolecithin",
      "Potassium Hyaluronate",
      "Serine",
      "Sodium Acetylated Hyaluronate",
      "Sodium Citrate",
      "Sodium Hyaluronate Crosspolymer",
      "Sodium Hyaluronate Dimethylsilanol",
      "Sodium PCA",
      "Sodium Stearoyl Glutamate",
      "Sucrose Laurate",
      "Tocopherol",
      "Water",
      "Xanthan Gum",
    ],
    inciSource: "internal-supplier-record",
    inciSourceName: "Skin Grocer internal supply-partner ingredient record",
    inciCheckedOn: "2026-09-01",
  },

  { name: "Red Blemish Clear Soothing Foam 150ml", brand: "Dr.G", price: "$32", priceId: "dr_g_red_blemish_clear_soothing_foam_150ml_onetime", tag: null, category: "Cleanse", image: "/products/dr-g/red-blemish-clear-soothing-foam-150ml.webp", concerns: ["acne","sensitivity"] },
  { name: "Hyper PDRN Repair Ampoule 30ml", brand: "WELLAGE", price: "$40", priceId: "wellage_hyper_pdrn_repair_ampoule_30ml_onetime", tag: null, category: "Treat", image: "/products/wellage/hyper-pdrn-repair-ampoule-30ml.webp", concerns: ["anti-aging"] },
  { name: "Real Hyaluronic Blue 100 Ampoule 60ml", brand: "WELLAGE", price: "$34", priceId: "wellage_real_hyaluronic_blue_100_ampoule_60ml_onetime", tag: null, category: "Treat", image: "/products/wellage/real-hyaluronic-blue-100-ampoule-60ml.webp", concerns: ["hydration"] },
  { name: "Real Hyaluronic 100 Cream 80ml", brand: "WELLAGE", price: "$30", priceId: "wellage_real_hyaluronic_100_cream_80ml_onetime", tag: null, category: "Moisturise", image: "/products/wellage/real-hyaluronic-100-cream-80ml.webp", concerns: ["hydration"] },
  { name: "One Day Exosome Shot Pore Serum 2000 30ml", brand: "MEDICUBE", price: "$40", priceId: "medicube_one_day_exosome_shot_pore_serum_2000_30ml_onetime", tag: null, category: "Treat", image: "/products/medicube/one-day-exosome-shot-pore-serum-2000-30ml.webp", concerns: ["acne"] },
  { name: "PDRN Pink Peptide Serum 30ml", brand: "MEDICUBE", price: "$40", priceId: "medicube_pdrn_pink_peptide_serum_30ml_onetime", tag: null, category: "Treat", image: "/products/medicube/pdrn-pink-peptide-serum-30ml.webp", concerns: ["anti-aging"] },
  { name: "PDRN Pink Niacinamide Whip Cleanser 120g", brand: "MEDICUBE", price: "$36", priceId: "medicube_pdrn_pink_niacinamide_whip_cleanser_120g_onetime", tag: null, category: "Cleanse", image: "/products/medicube/pdrn-pink-niacinamide-whip-cleanser-120g.webp", concerns: ["anti-aging","pigmentation"] },
  { name: "Ceramic Milk Ampoule 40ml", brand: "TIRTIR", price: "$50", priceId: "tirtir_ceramic_milk_ampoule_40ml_onetime", tag: null, category: "Treat", image: "/products/tirtir/ceramic-milk-ampoule-40ml.webp", concerns: ["hydration"] },
  { name: "Collagen Jelly Cream 110ml", brand: "MEDICUBE", price: "$40", priceId: "medicube_collagen_jelly_cream_110ml_onetime", tag: null, category: "Moisturise", image: "/products/medicube/collagen-jelly-cream-110ml.webp", concerns: ["barrier","anti-aging"] },
  { name: "PDRN Pink Peptide Eye Cream 30ml", brand: "MEDICUBE", price: "$38", priceId: "medicube_pdrn_pink_peptide_eye_cream_30ml_onetime", tag: null, category: "Moisturise", image: "/products/medicube/pdrn-pink-peptide-eye-cream-30ml.webp", concerns: ["anti-aging"] },
  {
    name: "PDRN Pink Cica Soothing Toner 250ml",
    brand: "MEDICUBE",
    price: "$36",
    priceId: "medicube_pdrn_pink_cica_soothing_toner_250ml_onetime",
    tag: null,
    category: "Tone",
    image: "/products/medicube/pdrn-pink-cica-soothing-toner-250ml.webp",
    concerns: ["sensitivity","anti-aging","pigmentation"],
    // INCI transcribed in printed order from the Cult Beauty retail listing for this exact 250ml SKU, checked 9 September 2026.
    inci: [
      "Water",
      "Butylene Glycol",
      "Glycerin",
      "Niacinamide",
      "1,2-Hexanediol",
      "Xylitol",
      "Sodium Citrate",
      "Ethylhexylglycerin",
      "Allantoin",
      "Caprylyl Glycol",
      "Citric Acid",
      "Adenosine",
      "Polyglyceryl-10 Laurate",
      "Disodium EDTA",
      "Polyglyceryl-4 Laurate",
      "Caprylyl/Capryl Glucoside",
      "Cyanocobalamin",
      "Rosa Damascena Extract",
      "Sodium DNA",
      "Gluconolactone",
      "Prunus Mume Fruit Extract",
      "Pyrus Malus (Apple) Fruit Extract",
      "Carica Papaya (Papaya) Fruit Extract",
      "Vitis Vinifera (Grape) Fruit Extract",
      "Centella Asiatica Leaf Extract",
      "Centella Asiatica Extract",
      "Sodium Hyaluronate",
      "Zea Mays (Corn) Leaf Extract",
      "Copper Tripeptide-1",
      "Acetyl Hexapeptide-8",
      "Palmitoyl Pentapeptide-4",
      "Palmitoyl Tetrapeptide-7",
      "Palmitoyl Tripeptide-1",
      "Glycine",
      "Glutamic Acid",
      "Arginine",
    ],
    inciSource: "authorised-retailer",
    inciSourceName: "Cult Beauty \u2014 MEDICUBE PDRN Pink Cica Soothing Toner 250ml product page",
    inciSourceUrl: "https://www.cultbeauty.co.uk/p/medicube-pdrn-pink-cica-soothing-toner-250ml/17753009/",
    inciCheckedOn: "2026-09-09",
  },
  { name: "Revive Eye Serum: Ginseng + Retinal 30ml", brand: "Beauty of Joseon", price: "$34", priceId: "beauty_of_joseon_revive_eye_serum_ginseng_plus_retinal_30ml_onetime", tag: null, category: "Treat", image: "/products/beauty-of-joseon/revive-eye-serum-ginseng-plus-retinal-30ml.webp", concerns: ["anti-aging"] },
  { name: "Real Hyaluronic Soothing Cream 80ml", brand: "WELLAGE", price: "$38", priceId: "wellage_real_hyaluronic_soothing_cream_80ml_onetime", tag: null, category: "Moisturise", image: "/products/wellage/real-hyaluronic-soothing-cream-80ml.webp", concerns: ["hydration","sensitivity"] },
  { name: "Cicaful Ampoule 30ml", brand: "beplain", price: "$38", priceId: "beplain_cicaful_ampoule_30ml_onetime", tag: null, category: "Treat", image: "/products/beplain/cicaful-ampoule-30ml.webp", concerns: ["sensitivity"] },
  { name: "Mung Bean Cleansing Oil 200ml", brand: "beplain", price: "$35", priceId: "beplain_mung_bean_cleansing_oil_200ml_onetime", tag: null, category: "Cleanse", image: "/products/beplain/mung-bean-cleansing-oil-200ml.webp", concerns: ["sensitivity"] },
  {
    name: "Mung Bean pH-Balanced Cleansing Foam 80ml",
    brand: "beplain",
    price: "$24",
    priceId: "beplain_mung_bean_ph_balanced_cleansing_foam_80ml_onetime",
    tag: null,
    category: "Cleanse",
    image: "/products/beplain/mung-bean-ph-balanced-cleansing-foam-80ml.webp",
    concerns: ["sensitivity"],
    // INCI supplied by UMMA (Skin Grocer's Korean wholesale partner) and checked
    // against the physical stock received in Melbourne on 9 September 2026.
    inci: [
      "Water",
      "1,2-Hexanediol",
      "Hydroxypropyl Starch Phosphate",
      "Phaseolus Radiatus Seed Powder",
      "Lauryl Betaine",
      "Hydroxyacetophenone",
      "Ethylhexylglycerin",
      "Phellodendron Amurense Bark Extract",
      "Sodium Chloride",
      "Chamomilla Recutita Flower Extract",
      "Betaine",
      "Polyquaternium-39",
      "Melia Azadirachta Leaf Extract",
      "Melia Azadirachta Flower Extract",
      "Dextrin",
      "Theobroma Cacao Seed Extract",
      "Coccinia Indica Fruit Extract",
      "Allantoin",
      "Aloe Barbadensis Flower Extract",
      "Solanum Melongena Fruit Extract",
      "Centella Asiatica Extract",
      "Ficus Carica Fruit Extract",
      "Ocimum Sanctum Leaf Extract",
      "Corallina Officinalis Extract",
      "Curcuma Longa Root Extract",
      "Hydrogenated Lecithin",
      "Ceramide NP",
      "Sodium Hyaluronate",
      "Camellia Sinensis Leaf Powder",
      "Glycyrrhiza Uralensis Root Extract",
      "Camellia Sinensis Leaf Extract",
      "Anthemis Nobilis Flower Extract",
      "Phaseolus Lunatus Seed Extract",
      "Butylene Glycol",
      "Cetyl Hydroxyethylcellulose",
      "Rutin",
      "Palmitoyl Tetrapeptide-7",
      "Palmitoyl Tripeptide-1",
      "Hydrolyzed Hyaluronic Acid",
      "Sodium Acetylated Hyaluronate",
    ],
    inciSource: "internal-supplier-record",
    inciSourceName: "UMMA — PRIVATE B2B SUPPLY-PARTNER INGREDIENT RECORD",
    inciCheckedOn: "2026-09-09",
    inciPackagingVerifiedOn: "2026-09-09",
    inciSourceNote:
      "This ingredient list was supplied through Skin Grocer's Korean wholesale partner, UMMA. The supporting record is private and cannot be independently checked through a public link.",
  },
  { name: "1025 Dokdo Toner 100ml", brand: "ROUND LAB", price: "$18", priceId: "round_lab_1025_dokdo_toner_100ml_onetime", tag: null, category: "Tone", image: "/products/round-lab/1025-dokdo-toner-100ml.webp", concerns: ["pigmentation"] },
  { name: "1025 Dokdo Lotion 200ml", brand: "ROUND LAB", price: "$36", priceId: "round_lab_1025_dokdo_lotion_200ml_onetime", tag: null, category: "Moisturise", image: "/products/round-lab/1025-dokdo-lotion-200ml.webp", concerns: ["hydration"] },
  { name: "1025 Dokdo Cleanser 150ml", brand: "ROUND LAB", price: "$24", priceId: "round_lab_1025_dokdo_cleanser_150ml_onetime", tag: null, category: "Cleanse", image: "/products/round-lab/1025-dokdo-cleanser-150ml.webp", concerns: ["hydration"] },
  { name: "1025 Dokdo Toner + Lotion Special Set (200ml + 200ml)", brand: "ROUND LAB", price: "$45", priceId: "round_lab_1025_dokdo_toner_plus_lotion_special_set_onetime", size: "Toner 200ml + Lotion 200ml", tag: null, category: "Tone", image: "/products/round-lab/1025-dokdo-toner-plus-lotion-special-set.webp", concerns: ["hydration","pigmentation"] },
  {
    name: "Birch Juice Moisturizing Cream 80ml",
    brand: "ROUND LAB",
    price: "$35",
    priceId: "round_lab_birch_juice_moisturizing_cream_80ml_onetime",
    tag: null,
    category: "Moisturise",
    image: "/products/round-lab/birch-juice-moisturizing-cream-80ml.webp",
    concerns: ["hydration","barrier"],
    // INCI transcribed in printed order from the ROUND LAB official product page (roundlab.com), checked 9 September 2026.
    inci: [
      "Water",
      "Glycerin",
      "Isononyl Isononanoate",
      "Isododecane",
      "1,2-Hexanediol",
      "Pentylene Glycol",
      "Polydecene",
      "Betula Platyphylla Japonica Juice",
      "Jojoba Esters",
      "Panthenol",
      "Glyceryl Glucoside",
      "Acacia Senegal Gum",
      "Hydrolyzed Hibiscus Esculentus Extract",
      "Sodium Hyaluronate",
      "Hyaluronic Acid",
      "Lupinus Albus Seed Extract",
      "Moringa Oleifera Seed Extract",
      "Melia Azadirachta Leaf Extract",
      "Melia Azadirachta Flower Extract",
      "Coccinia Indica Fruit Extract",
      "Aloe Barbadensis Flower Extract",
      "Solanum Melongena (Eggplant) Fruit Extract",
      "Ocimum Sanctum Leaf Extract",
      "Corallina Officinalis Extract",
      "Curcuma Longa (Turmeric) Root Extract",
      "Ascorbic Acid",
      "Pentaerythrityl Tetraethylhexanoate",
      "Ammonium Acryloyldimethyltaurate/VP Copolymer",
      "Polyglyceryl-3 Methylglucose Distearate",
      "Acrylates/C10-30 Alkyl Acrylate Crosspolymer",
      "Tromethamine",
      "Glyceryl Acrylate/Acrylic Acid Copolymer",
      "Ethylhexylglycerin",
      "Agar",
      "Dipotassium Glycyrrhizate",
      "Glyceryl Caprylate",
      "Butylene Glycol",
      "Disodium EDTA",
    ],
    inciSource: "brand",
    inciSourceName: "ROUND LAB official product page \u2014 Birch Juice Moisturizing Cream",
    inciSourceUrl: "https://roundlab.com/products/birch-moisturizing-cream",
    inciCheckedOn: "2026-09-09",
  },
  { name: "1025 Dokdo Trial Kit (Cleanser 30ml + Toner 20ml + Ampule 10ml + Cream 20ml)", brand: "ROUND LAB", price: "$30", priceId: "round_lab_1025_dokdo_trial_kit_onetime", size: "Cleanser 30ml + Toner 20ml + Ampoule 10ml + Cream 20ml", tag: null, category: "Treat", image: "/products/round-lab/1025-dokdo-trial-kit.webp", concerns: ["pigmentation"] },
  { name: "Hyaluronic Acid Water Essence 50ml", brand: "ISNTREE", price: "$40", priceId: "isntree_hyaluronic_acid_water_essence_50ml_onetime", tag: null, category: "Treat", image: "/products/isntree/hyaluronic-acid-water-essence-50ml.webp", concerns: ["hydration"] },
  {
    name: "Green Tea Fresh Toner 200ml",
    brand: "ISNTREE",
    price: "$26",
    priceId: "isntree_green_tea_fresh_toner_200ml_onetime",
    tag: null,
    category: "Tone",
    image: "/products/isntree/green-tea-fresh-toner-200ml.webp",
    concerns: ["sensitivity","pigmentation"],
    // INCI transcribed in printed order from the Soko Glam retail listing for this exact 200ml SKU, checked 9 September 2026.
    inci: [
      "Camellia Sinensis Leaf Extract",
      "Water",
      "Ginkgo Biloba Leaf Extract",
      "Centella Asiatica Extract",
      "Salix Alba (Willow) Bark Extract",
      "Vaccinium Angustifolium (Blueberry) Fruit Extract",
      "Pinus Palustris Leaf Extract",
      "Ulmus Davidiana Root Extract",
      "Oenothera Biennis (Evening Primrose) Flower Extract",
      "Pueraria Lobata Root Extract",
      "Hydrolyzed Hyaluronic Acid",
      "Ammonium Acryloyldimethyltaurate/VP Copolymer",
      "Allantoin",
      "Dipotassium Glycyrrhizate",
      "Beta-Glucan",
      "Disodium EDTA",
      "Hydroxyacetophenone",
    ],
    inciSource: "authorised-retailer",
    inciSourceName: "Soko Glam \u2014 ISNTREE Green Tea Fresh Toner 200ml product page",
    inciSourceUrl: "https://sokoglam.com/products/isntree-green-tea-fresh-toner",
    inciCheckedOn: "2026-09-09",
  },
  { name: "Chestnut BHA 2% Clear Liquid 100ml", brand: "ISNTREE", price: "$36", priceId: "isntree_chestnut_bha_2_percent_clear_liquid_100ml_onetime", tag: null, category: "Treat", image: "/products/isntree/chestnut-bha-2-percent-clear-liquid-100ml.webp", concerns: ["acne"], supplierReconciliationStatus: "unmatched", supplierMatchConfirmed: false, purchasable: false },
  { name: "Yam Root Vegan Milk Cleanser 220ml", brand: "ISNTREE", price: "$38", priceId: "isntree_yam_root_vegan_milk_cleanser_220ml_onetime", tag: null, category: "Cleanse", image: "/products/isntree/yam-root-vegan-milk-cleanser-220ml.webp", concerns: ["hydration"] },
  { name: "Yam Root Vegan Milk Toner 200ml", brand: "ISNTREE", price: "$32", priceId: "isntree_yam_root_vegan_milk_toner_200ml_onetime", tag: null, category: "Tone", image: "/products/isntree/yam-root-vegan-milk-toner-200ml.webp", concerns: ["hydration","pigmentation"], supplierReconciliationStatus: "unmatched", supplierMatchConfirmed: false, purchasable: false },
  { name: "Black Rice Hyaluronic Toner 150ml", brand: "HARUHARU WONDER", price: "$28", priceId: "haruharu_wonder_black_rice_hyaluronic_toner_150ml_onetime", tag: null, category: "Tone", image: "/__l5e/assets-v1/5c2e77da-7082-420c-809a-9005bdb6aef8/haruharu-wonder-black-rice-hyaluronic-toner-150ml.png", concerns: ["hydration","pigmentation"] },
  { name: "Black Rice 5 Ceramide Barrier Moisturizing Cream", brand: "HARUHARU WONDER", price: "$38", priceId: "haruharu_wonder_black_rice_5_ceramide_barrier_moisturizing_cream_onetime", size: "50ml", tag: null, category: "Moisturise", image: "/products/haruharu-wonder/black-rice-5-ceramide-barrier-moisturizing-cream.webp", concerns: ["hydration","barrier","pigmentation"] },
  { name: "Dive In Serum", brand: "TORRIDEN", price: "$38", priceId: "torriden_dive_in_serum_onetime", size: "50ml", tag: null, category: "Treat", image: "/products/torriden/dive-in-serum.webp", concerns: ["hydration"] },
  {
    name: "Dive In Soothing Cream",
    brand: "TORRIDEN",
    price: "$40",
    priceId: "torriden_dive_in_soothing_cream_onetime",
    size: "100ml",
    tag: null,
    category: "Moisturise",
    image: "/products/torriden/dive-in-soothing-cream.webp",
    concerns: ["hydration","sensitivity"],
    // INCI transcribed in printed order from the TORRIDEN official product page (torriden.us), checked 9 September 2026.
    inci: [
      "Water",
      "Butylene Glycol",
      "Glycerin",
      "1,2-Hexanediol",
      "Hydrogenated Didecene",
      "Allantoin",
      "Trehalose",
      "Hamamelis Virginiana (Witch Hazel) Extract",
      "Panthenol",
      "Hydrolyzed Hyaluronic Acid",
      "Sodium Hyaluronate",
      "Sodium Hyaluronate Crosspolymer",
      "Sodium Acetylated Hyaluronate",
      "Hydrolyzed Sodium Hyaluronate",
      "Glyceryl Acrylate/Acrylic Acid Copolymer",
      "PVM/MA Copolymer",
      "Hydroxyethyl Acrylate/Sodium Acryloyldimethyl Taurate Copolymer",
      "2,3-Butanediol",
      "Cetearyl Alcohol",
      "C14-22 Alcohols",
      "C12-20 Alkyl Glucoside",
      "Pentylene Glycol",
      "Sorbitan Isostearate",
      "Caprylic/Capric Triglyceride",
      "Melia Azadirachta Leaf Extract",
      "Melia Azadirachta Flower Extract",
      "Coccinia Indica Fruit Extract",
      "Solanum Melongena (Eggplant) Fruit Extract",
      "Ocimum Sanctum Leaf Extract",
      "Curcuma Longa (Turmeric) Root Extract",
      "Corallina Officinalis Extract",
      "Salvia Sclarea (Clary) Extract",
      "Lavandula Angustifolia (Lavender) Flower Extract",
      "Hyacinthus Orientalis (Hyacinth) Extract",
      "Chamomilla Recutita (Matricaria) Flower Extract",
      "Centaurea Cyanus Flower Extract",
      "Borago Officinalis Extract",
      "Disodium EDTA",
      "Carbomer",
      "Tromethamine",
      "Xanthan Gum",
      "Glutathione",
      "Malachite Extract",
      "Ethylhexylglycerin",
    ],
    inciSource: "brand",
    inciSourceName: "TORRIDEN official product page \u2014 DIVE-IN Soothing Cream",
    inciSourceUrl: "https://torriden.us/products/dive-in-soothing-cream",
    inciCheckedOn: "2026-09-09",
  },
  {
    name: "Balanceful Cleansing Gel",
    brand: "TORRIDEN",
    price: "$34",
    priceId: "torriden_balanceful_cleansing_gel_onetime",
    size: "200ml",
    tag: null,
    category: "Cleanse",
    image: "/products/torriden/balanceful-cleansing-gel.webp",
    concerns: ["barrier"],
    // INCI transcribed in printed order from the TORRIDEN official product page (torriden.us), checked 9 September 2026.
    inci: [
      "Water",
      "Glycerin",
      "Sodium Cocoyl Alaninate",
      "Lauryl Glucoside",
      "Lauryl Hydroxysultaine",
      "Coco-Betaine",
      "Disodium Cocoamphodiacetate",
      "Centella Asiatica Extract",
      "Madecassoside",
      "Asiaticoside",
      "Asiatic Acid",
      "Madecassic Acid",
      "Panthenol",
      "Capryloyl Salicylic Acid",
      "Ceramide NP",
      "Allantoin",
      "Hamamelis Virginiana (Witch Hazel) Extract",
      "Althaea Rosea Flower Extract",
      "Nymphaea Caerulea Flower Extract",
      "Swertia Japonica Extract",
      "Lactobacillus Ferment",
      "Glycine Soja (Soybean) Seed Extract",
      "Quillaja Saponaria Bark Extract",
      "Aloe Ferox Leaf Extract",
      "Butylene Glycol",
      "Pentylene Glycol",
      "Hexylene Glycol",
      "Coco-Glucoside",
      "Sodium Chloride",
      "Sodium Cocoyl Isethionate",
      "Caprylyl Glycol",
      "Caprylic/Capric Triglyceride",
      "Octanediol",
      "Acrylates/C10-30 Alkyl Acrylate Crosspolymer",
      "Hydrogenated Lecithin",
      "Melia Azadirachta Leaf Extract",
      "Melia Azadirachta Flower Extract",
      "Dipotassium Glycyrrhizate",
      "Citric Acid",
      "1,2-Hexanediol",
      "Rosmarinus Officinalis (Rosemary) Leaf Oil",
      "Ethylhexylglycerin",
    ],
    inciSource: "brand",
    inciSourceName: "TORRIDEN official product page \u2014 Balanceful Cica Cleansing Gel",
    inciSourceUrl: "https://torriden.us/products/balanceful-cleansing-gel",
    inciCheckedOn: "2026-09-09",
  },
  { name: "Dive In Mask Pack 1pc", brand: "TORRIDEN", price: "$10", priceId: "torriden_dive_in_mask_pack_1pc_onetime", size: "1 sheet", tag: null, category: "Masks", image: "/products/torriden/dive-in-mask-pack-1pc.webp", concerns: ["hydration"] },
  { name: "Balanceful Trial Kit (Global)", brand: "TORRIDEN", price: "$35", priceId: "torriden_balanceful_trial_kit_onetime", size: "Cleansing Gel 30ml + Toner Pads 6 pads + Serum 10ml + Cream 20ml", tag: null, category: "Treat", image: "/products/torriden/balanceful-trial-kit.webp", concerns: ["barrier"] },
  { name: "Dive In Trial Kit (Global)", brand: "TORRIDEN", price: "$35", priceId: "torriden_dive_in_trial_kit_onetime", size: "Cleansing Foam 30ml + Toner 50ml + Serum 20ml + Cream 20ml", tag: null, category: "Treat", image: "/products/torriden/dive-in-trial-kit.webp", concerns: ["hydration"] },
  { name: "Refreshing Sea Kelp Real Deep Mask", brand: "BIODANCE", price: "$38", priceId: "biodance_refreshing_sea_kelp_real_deep_mask_onetime", size: "4 sheets", tag: null, category: "Masks", image: "/products/biodance/refreshing-sea-kelp-real-deep-mask.webp", concerns: ["sensitivity"], supplierReconciliationStatus: "unmatched", supplierMatchConfirmed: false, purchasable: false },
  {
    name: "Bio Collagen Real Deep Mask",
    brand: "BIODANCE",
    price: "$38",
    priceId: "biodance_bio_collagen_real_deep_mask_onetime",
    size: "4 sheets",
    tag: null,
    category: "Masks",
    image: "/products/biodance/bio-collagen-real-deep-mask.webp",
    concerns: ["barrier","anti-aging"],
    // INCI transcribed in printed order from the Soko Glam retail listing for this exact SKU, checked 9 September 2026.
    inci: [
      "Water",
      "Glycerin",
      "Acrylates Copolymer",
      "Niacinamide",
      "Ceratonia Siliqua (Carob) Gum",
      "Chondrus Crispus Extract",
      "Dipropylene Glycol",
      "Betaine",
      "Algin",
      "Agar",
      "Hydroxyacetophenone",
      "1,2-Hexanediol",
      "Potassium Chloride",
      "Caprylyl Glycol",
      "Sucrose",
      "Allantoin",
      "Polyglyceryl-10 Laurate",
      "Ethylhexylglycerin",
      "Galactomyces Ferment Filtrate",
      "Adenosine",
      "Disodium EDTA",
      "Pyrus Communis (Pear) Fruit Extract",
      "Rosa Damascena Flower Water",
      "Collagen Extract",
      "Iris Florentina Root Extract",
      "Cucumis Melo (Melon) Fruit Extract",
      "Hedera Helix (Ivy) Leaf/Stem Extract",
      "Butylene Glycol",
      "Dipotassium Glycyrrhizate",
      "Hydrolyzed Hyaluronic Acid",
      "Lactobacillus Ferment",
      "Bifida Ferment Filtrate",
      "Lactobacillus Ferment Lysate",
      "Tocopherol",
    ],
    inciSource: "authorised-retailer",
    inciSourceName: "Soko Glam \u2014 BIODANCE Bio-Collagen Real Deep Mask product page",
    inciSourceUrl: "https://sokoglam.com/products/bio-collagen-real-deep-mask",
    inciCheckedOn: "2026-09-09",
  },
  { name: "Hydro Cera-Nol Real Deep Mask", brand: "BIODANCE", price: "$38", priceId: "biodance_hydro_cera_nol_real_deep_mask_onetime", size: "4 sheets", tag: null, category: "Masks", image: "/products/biodance/hydro-cera-nol-real-deep-mask.webp", concerns: ["hydration","barrier"] },
  { name: "R.E.D Blemish Clear Soothing Cream 70ml", brand: "Dr.G", price: "$45", priceId: "dr_g_r_e_d_blemish_clear_soothing_cream_70ml_onetime", tag: null, category: "Moisturise", image: "/products/dr-g/r-e-d-blemish-clear-soothing-cream-70ml.webp", concerns: ["acne","sensitivity"] },
  { name: "Black Snail Cream 50ml", brand: "Dr.G", price: "$38", priceId: "dr_g_black_snail_cream_50ml_onetime", tag: null, category: "Moisturise", image: "/products/dr-g/black-snail-cream-50ml.webp", concerns: ["acne"] },
  {
    name: "Atobarrier365 Cream (2nd Generation)",
    brand: "AESTURA",
    price: "$55",
    priceId: "aestura_atobarrier365_cream_onetime",
    size: "80ml",
    tag: null,
    category: "Moisturise",
    image: "/products/aestura/atobarrier365-cream.webp",
    concerns: ["sensitivity","barrier"],
    // INCI transcribed in printed order from the AESTURA official international product page (int.aestura.com), checked 9 September 2026.
    inci: [
      "Water",
      "Butylene Glycol",
      "Glycerin",
      "Butylene Glycol Dicaprylate/Dicaprate",
      "Cetyl Ethylhexanoate",
      "Squalane",
      "Pentaerythrityl Tetraisostearate",
      "Dicaprylyl Carbonate",
      "Behenyl Alcohol",
      "Dimethicone",
      "Hydroxypropyl Bispalmitamide MEA",
      "Stearic Acid",
      "Betaine",
      "Mannitol",
      "C14-22 Alcohols",
      "Palmitic Acid",
      "Hydroxypropyl Bislauramide MEA",
      "Arachidyl Alcohol",
      "Cholesterol",
      "Polyacrylate-13",
      "C12-20 Alkyl Glucoside",
      "Allantoin",
      "Arachidyl Glucoside",
      "Niacinamide",
      "Ceramide NP",
      "Glyceryl Caprylate",
      "Ethylhexylglycerin",
      "Hydrogenated Polyisobutene",
      "Carbomer",
      "Tromethamine",
      "Dimethiconol",
      "Polyglyceryl-10 Laurate",
      "Hydrogenated Lecithin",
      "Ethylhexyl Palmitate",
      "Acrylates/Ammonium Methacrylate Copolymer",
      "Sorbitan Isostearate",
      "Silica",
      "Phytosphingosine",
      "Sphingolipids",
      "Arachidic Acid",
      "Tocopherol",
      "Oleic Acid",
    ],
    inciSource: "brand",
    inciSourceName: "AESTURA official product page \u2014 Atobarrier365 Cream",
    inciSourceUrl: "https://int.aestura.com/products/atobarrier365-cream",
    inciCheckedOn: "2026-09-09",
  },
  {
    name: "Derma UV365 Barrier Moisture Mineral Sun Cream 20ml",
    brand: "AESTURA",
    price: "$10",
    priceId: "aestura_derma_uv365_barrier_moisture_mineral_sun_cream_onetime",
    tag: null,
    category: "Protect",
    image: "/products/aestura/derma-uv365-barrier-moisture-mineral-sun-cream.webp",
    concerns: ["hydration","barrier","pigmentation"],
    // INCI transcribed in printed order from the AESTURA official international product page (int.aestura.com), checked 9 September 2026.
    inci: [
      "Water",
      "Zinc Oxide (Nano)",
      "Cyclohexasiloxane",
      "Propanediol",
      "Butyloctyl Salicylate",
      "Propylheptyl Caprylate",
      "Isododecane",
      "Polyglyceryl-3 Polydimethylsiloxyethyl Dimethicone",
      "Caprylyl Methicone",
      "Disiloxane",
      "Disteardimonium Hectorite",
      "Magnesium Sulfate",
      "Triethoxycaprylylsilane",
      "1,2-Hexanediol",
      "Polymethylsilsesquioxane",
      "Polyglyceryl-2 Dipolyhydroxystearate",
      "Lauryl Polyglyceryl-3 Polydimethylsiloxyethyl Dimethicone",
      "Allantoin",
      "Caprylyl Glycol",
      "Glyceryl Caprylate",
      "Ethylhexylglycerin",
      "Sodium Hyaluronate",
      "Ceramide NP",
      "Tocopherol",
      "Sodium Acetylated Hyaluronate",
      "Hydrolyzed Hyaluronic Acid",
    ],
    inciSource: "brand",
    inciSourceName: "AESTURA official product page \u2014 Derma UV365 Barrier Hydro Mineral Sunscreen",
    inciSourceUrl: "https://int.aestura.com/products/derma-uv365-barrier-hydro-mineral-sunscreen",
    inciCheckedOn: "2026-09-09",
    // Sunscreens are therapeutic goods in Australia. Nothing here is confirmed
    // yet, so the SKU is not purchasable, not recommended, and carries no SPF
    // or UV-protection guidance anywhere on the site.
    sunscreenCompliance: {
      australianSupplyStatus: "Australian availability being verified — not offered for sale",
      artgEntryConfirmed: false,
      packagingVerified: false,
      complianceReviewedOn: "2026-09-09",
    },
  },
  { name: "A-Cica Moisture Toner 25ml", brand: "AESTURA", price: "$10", priceId: "aestura_a_cica_moisture_toner_onetime", tag: null, category: "Tone", image: "/products/aestura/a-cica-moisture-toner.webp", concerns: ["hydration","sensitivity","pigmentation"] },
  { name: "Atobarrier 365 Hydro Soothing Cream", brand: "AESTURA", price: "$60", priceId: "aestura_atobarrier_365_hydro_soothing_cream_onetime", size: "60ml", tag: null, category: "Moisturise", image: "/products/aestura/atobarrier-365-hydro-soothing-cream.webp", concerns: ["hydration","sensitivity","barrier"] },
  { name: "Aqua Oasis Toner", brand: "S.NATURE", price: "$40", priceId: "s_nature_aqua_oasis_toner_onetime", size: "300ml", tag: null, category: "Tone", image: "/products/s-nature/aqua-oasis-toner.webp", concerns: ["hydration","pigmentation"] },
  { name: "Aqua Squalane Serum", brand: "S.NATURE", price: "$34", priceId: "s_nature_aqua_squalane_serum_onetime", size: "50ml", tag: null, category: "Treat", image: "/products/s-nature/aqua-squalane-serum.webp", concerns: ["hydration"] },
  { name: "Aqua Squalane Moisturizing Cream", brand: "S.NATURE", price: "$35", priceId: "s_nature_aqua_squalane_moisturizing_cream_onetime", size: "60ml", tag: null, category: "Moisturise", image: "/products/s-nature/aqua-squalane-moisturizing-cream.webp", concerns: ["hydration"] },
  { name: "Aqua Oasis Moisturizing Gel", brand: "S.NATURE", price: "$40", priceId: "s_nature_aqua_oasis_moisturizing_gel_onetime", size: "80ml", tag: null, category: "Moisturise", image: "/products/s-nature/aqua-oasis-moisturizing-gel.webp", concerns: ["hydration"] },
  { name: "Aqua Soy Yogurt Eye Cream", brand: "S.NATURE", price: "$35", priceId: "s_nature_aqua_soy_yogurt_eye_cream_onetime", size: "25ml", tag: null, category: "Moisturise", image: "/products/s-nature/aqua-soy-yogurt-eye-cream.webp", concerns: ["hydration","anti-aging"] },
  { name: "Mung Bean Pore Tight-Up Soothing Cream", brand: "beplain", price: "$28", priceId: "beplain_mung_bean_pore_tight_up_soothing_cream_onetime", size: "60ml", tag: null, category: "Moisturise", image: "/products/beplain/mung-bean-pore-tight-up-soothing-cream.webp", concerns: ["acne","sensitivity"] },
  {
    name: "Milk Ceramide Moisturizing Cream",
    brand: "beplain",
    price: "$35",
    priceId: "beplain_milk_ceramide_moisturizing_cream_onetime",
    size: "50ml",
    tag: null,
    category: "Moisturise",
    image: "/products/beplain/milk-ceramide-moisturizing-cream.webp",
    concerns: ["hydration","barrier"],
    // INCI supplied by UMMA (Skin Grocer's Korean wholesale partner) and checked
    // against the physical stock received in Melbourne on 9 September 2026.
    inci: [
      "Aqua",
      "Caprylic/Capric Triglyceride",
      "Cyclohexasiloxane",
      "Butylene Glycol",
      "Glycerin",
      "Dipropylene Glycol",
      "Behenyl Alcohol",
      "1,2-Hexanediol",
      "Phenyl Trimethicone",
      "Arachidyl Alcohol",
      "Glyceryl Stearate SE",
      "Betaine",
      "Sodium Acrylate/Sodium Acryloyldimethyl Taurate Copolymer",
      "Arachidyl Glucoside",
      "Dimethicone",
      "Isohexadecane",
      "Bis-Diglyceryl Polyacyladipate-2",
      "Hydrogenated Lecithin",
      "Panthenol",
      "Xanthan Gum",
      "Acrylates/C10-30 Alkyl Acrylate Crosspolymer",
      "Ethylhexylglycerin",
      "Arginine",
      "Ceramide NP",
      "Polysorbate 80",
      "Dimethicone/Vinyl Dimethicone Crosspolymer",
      "Triethylhexanoin",
      "Sorbitan Olivate",
      "Cetearyl Olivate",
      "Hydrogenated Polydecene",
      "Cetearyl Alcohol",
      "Squalane",
      "Sorbitan Oleate",
      "Phospholipids",
      "Disodium EDTA",
      "Cholesterol",
      "Phytosphingosine",
      "Lactobacillus/Soymilk Ferment Filtrate",
      "Niacinamide",
      "Allantoin",
      "Tocopherol",
      "Ceramide AP",
      "Ceramide NG",
      "Glyceryl Stearate",
      "Ceramide EOP",
      "Ceramide AS",
      "Centella Asiatica Extract",
      "Stearic Acid",
      "Beta-Glucan",
      "Tetraacetylphytosphingosine",
      "Glycosphingolipids",
    ],
    inciSource: "internal-supplier-record",
    inciSourceName: "UMMA — PRIVATE B2B SUPPLY-PARTNER INGREDIENT RECORD",
    inciCheckedOn: "2026-09-09",
    inciPackagingVerifiedOn: "2026-09-09",
    inciSourceNote:
      "This ingredient list was supplied through Skin Grocer's Korean wholesale partner, UMMA. The supporting record is private and cannot be independently checked through a public link.",
  },
  { name: "Ginseng Cleansing Oil 210ml", brand: "Beauty of Joseon", price: "$30", priceId: "beauty_of_joseon_ginseng_cleansing_oil_210ml_onetime", tag: "New", category: "Cleanse", image: "/__l5e/assets-v1/ee718186-6443-43e5-847d-47725b187889/boj-ginseng-cleansing-oil.webp", concerns: ["hydration"] },
  { name: "Green Plum Refreshing Toner: AHA + BHA 150ml", brand: "Beauty of Joseon", price: "$32", priceId: "beauty_of_joseon_green_plum_refreshing_toner_150ml_onetime", tag: "New", category: "Tone", image: "/products/beauty-of-joseon/green-plum-refreshing-toner-aha-bha-150ml.webp", concerns: ["acne"] },
  { name: "Glow Serum: Propolis + Niacinamide 30ml", brand: "Beauty of Joseon", price: "$34", priceId: "beauty_of_joseon_glow_serum_propolis_plus_niacinamide_30ml_onetime", tag: "New", category: "Treat", image: "/__l5e/assets-v1/bab0fc3b-47f9-4850-b1d1-11c47b6d023d/boj-glow-serum-propolis.webp", concerns: ["hydration","pigmentation"] },
  {
    name: "Dynasty Cream 50ml",
    brand: "Beauty of Joseon",
    price: "$36",
    priceId: "beauty_of_joseon_dynasty_cream_50ml_onetime",
    tag: "New",
    category: "Moisturise",
    image: "/products/beauty-of-joseon/dynasty-cream-50ml.webp",
    concerns: ["hydration","barrier"],
    // INCI transcribed in printed order from the Jolse retail listing for this exact 50ml SKU (jolse.com), checked 9 September 2026.
    inci: [
      "Water",
      "Oryza Sativa (Rice) Bran Water",
      "Glycerin",
      "Panax Ginseng Root Water",
      "Hydrogenated Polydecene",
      "1,2-Hexanediol",
      "Niacinamide",
      "Squalane",
      "Butylene Glycol",
      "Propanediol",
      "Dicaprylate/Dicaprate",
      "Cetearyl Olivate",
      "Sorbitan Olivate",
      "Ammonium Acryloyldimethyltaurate/VP Copolymer",
      "Xanthan Gum",
      "Acrylates/C10-30 Alkyl Acrylate Crosspolymer",
      "Tromethamine",
      "Carthamus Tinctorius (Safflower) Seed Oil",
      "Hydrogenated Coconut Oil",
      "Glyceryl Acrylate/Acrylic Acid Copolymer",
      "Ethylhexylglycerin",
      "Adenosine",
      "Caprylic/Capric Triglyceride",
      "Disodium EDTA",
      "Hyaluronic Acid",
      "Hydrolyzed Hyaluronic Acid",
      "Sodium Hyaluronate",
      "Honey Extract",
      "Ceramide NP",
      "Hydrogenated Lecithin",
      "Coptis Japonica Root Extract",
      "Raphanus Sativus (Radish) Seed Extract",
      "Lycium Chinense Fruit Extract",
      "Theobroma Cacao (Cocoa) Seed Extract",
      "Phellinus Linteus Extract",
      "Dextrin",
      "Scutellaria Baicalensis Root Extract",
    ],
    inciSource: "authorised-retailer",
    inciSourceName: "Jolse \u2014 Beauty of Joseon Dynasty Cream 50ml product page",
    inciSourceUrl: "https://jolse.com/product/beauty-of-joseon-dynasty-cream-50ml/37118/",
    inciCheckedOn: "2026-09-09",
  },

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
    desc: "A 4-step intro to Korean skincare — cleanse, tone, treat, moisturise.",
    includes: [
      "ROUND LAB 1025 Dokdo Cleanser 150ml",
      "WELLAGE Real Hyaluronic 100 Toner 200ml",
      "TORRIDEN Dive In Serum",
      "TORRIDEN Dive In Soothing Cream",
    ],
    products: [
      { img: "/products/round-lab/1025-dokdo-cleanser-150ml.webp", alt: "ROUND LAB 1025 Dokdo Cleanser 150ml" },
      { img: "/products/wellage/real-hyaluronic-toner-200ml.webp", alt: "WELLAGE Real Hyaluronic 100 Toner 200ml" },
      { img: "/products/torriden/dive-in-serum.webp", alt: "TORRIDEN Dive In Serum" },
      { img: "/products/torriden/dive-in-soothing-cream.webp", alt: "TORRIDEN Dive In Soothing Cream" },
    ],
    price: 98,
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
      { img: "/products/medicube/pdrn-pink-niacinamide-whip-cleanser-120g.webp", alt: "MEDICUBE PDRN Pink Niacinamide Whip Cleanser 120g" },
      { img: "/products/medicube/pdrn-pink-cica-soothing-toner-250ml.webp", alt: "MEDICUBE PDRN Pink Cica Soothing Toner 250ml" },
      { img: "/products/medicube/pdrn-pink-peptide-serum-30ml.webp", alt: "MEDICUBE PDRN Pink Peptide Serum 30ml" },
      { img: "/products/medicube/collagen-jelly-cream-110ml.webp", alt: "MEDICUBE Collagen Jelly Cream 110ml" },
      { img: "/products/biodance/bio-collagen-real-deep-mask.webp", alt: "BIODANCE Bio Collagen Real Deep Mask" },
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
      { img: "/products/dr-g/red-blemish-clear-soothing-foam-150ml.webp", alt: "Dr.G Red Blemish Clear Soothing Foam 150ml" },
      { img: "/products/isntree/chestnut-bha-2-percent-clear-liquid-100ml.webp", alt: "ISNTREE Chestnut BHA 2% Clear Liquid 100ml" },
      { img: "/products/beplain/cicaful-ampoule-30ml.webp", alt: "beplain Cicaful Ampoule 30ml" },
      { img: "/products/aestura/atobarrier365-cream.webp", alt: "AESTURA Atobarrier365 Cream" },
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
  /** Same central size value shown on cards and product pages. */
  size?: string | null;
};


// --- compliance and provenance safeguards ---------------------------------

/** Sunscreens are regulated separately from ordinary cosmetics in Australia. */
export function isSunscreen(p: ShopProduct): boolean {
  return p.category === 'Protect';
}

/**
 * A sunscreen may only be sold, recommended, or presented with SPF and
 * UV-protection guidance once every Australian compliance field is documented.
 * Missing record = not verified. There is no partial pass.
 */
export function australianSupplyVerified(p: ShopProduct): boolean {
  if (!isSunscreen(p)) return true;
  const c = p.sunscreenCompliance;
  return Boolean(
    c &&
      c.artgEntryConfirmed &&
      c.artgNumber &&
      c.australianSponsor &&
      c.packagingVerified &&
      c.evidenceUrl &&
      c.complianceReviewedOn,
  );
}

/**
 * An ingredient list only counts as reviewed when its provenance is complete:
 * source name, source type and review date, plus a link to the exact page for
 * any publicly citable source. An internal supply-partner record is allowed
 * without a link, but is never described as independently verified.
 */
export function ingredientReviewed(p: ShopProduct): boolean {
  if (!p.inci?.length) return false;
  if (!p.inciSource || !p.inciSourceName || !p.inciCheckedOn) return false;
  if (p.inciSource === 'internal-supplier-record' || p.inciSource === 'packaging') return true;
  return Boolean(p.inciSourceUrl);
}

/**
 * Supplier-cart reconciliation gate. A SKU that could not be located in a
 * documented supplier record is kept in the catalogue and remains viewable,
 * but is never sold, priced, recommended or bundled. This is NOT a sold-out
 * state: no incoming or previously available stock has been established, so
 * no restock date or replacement is ever implied.
 */
export function supplierMatchPending(p: ShopProduct): boolean {
  return (
    p.purchasable === false ||
    p.supplierMatchConfirmed === false ||
    p.supplierReconciliationStatus === 'unmatched' ||
    p.supplierReconciliationStatus === 'verification_pending'
  );
}

/** Customer-facing message shown wherever an unmatched product's price would be. */
export const AVAILABILITY_PENDING_LABEL = 'Availability being confirmed';

/** True when a bundle contains a SKU still awaiting supplier reconciliation. */
export function bundleSupplyPending(includes: string[]): boolean {
  return includes.some((entry) =>
    SHOP_PRODUCTS.some(
      (p) => supplierMatchPending(p) && entry.toLowerCase().includes(p.name.toLowerCase()),
    ),
  );
}

/** True when a price id can actually be charged (exists in the catalog and is in stock). */
export function isPurchasable(priceId: string): boolean {
  const product = SHOP_PRODUCTS.find((p) => p.priceId === priceId);
  if (product)
    return !product.comingSoon && australianSupplyVerified(product) && !supplierMatchPending(product);
  const bundle = BUNDLE_DEFINITIONS.find((b) => b.priceId === priceId);
  if (bundle) return !bundleSupplyPending(bundle.includes);
  const restockSource = Object.entries(RESTOCK_PRICE_BY_PRODUCT).find(([, sub]) => sub === priceId);
  if (!restockSource) return false;
  const base = SHOP_PRODUCTS.find((p) => p.priceId === restockSource[0]);
  return Boolean(
    base && !base.comingSoon && australianSupplyVerified(base) && !supplierMatchPending(base),
  );
}

if (import.meta.env?.DEV) {
  for (const p of SHOP_PRODUCTS) {
    if (p.inci?.length && !ingredientReviewed(p)) {
      console.warn(
        `[catalog] ${p.brand} ${p.name}: ingredient list is missing source name, type, URL or review date.`,
      );
    }
    if (isSunscreen(p) && !australianSupplyVerified(p)) {
      console.warn(
        `[catalog] ${p.brand} ${p.name}: sunscreen without complete Australian compliance record — not purchasable.`,
      );
    }
  }
}


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
      size: productSizeFor(product),
    };
  }
  const bundle = BUNDLE_DEFINITIONS.find((b) => b.priceId === priceId);
  if (bundle) {
    return {
      priceId,
      name: bundle.name,
      brand: 'Skin Grocer',
      image: bundle.products[0]?.img ?? '/products/placeholder.webp',
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
        size: productSizeFor(base),
      };
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Size / quantity — single source of truth for cards, product pages, bag,
// checkout and order records.
// ---------------------------------------------------------------------------

/** Size printed at the end of the product name, when the brand states one there. */
function sizeFromName(name: string): string | null {
  return name.match(/\b\d+(?:\.\d+)?\s?(?:ml|g|pcs?|pads?|sheets?)\b\s*$/i)?.[0]?.trim() ?? null;
}

/**
 * The verified pack size for a catalogue product. Explicit `size` wins; the
 * fallback only reads a size the brand already states in the product name.
 * Never returns a guess — missing data returns null and fails validation.
 */
export function productSizeFor(p: ShopProduct): string | null {
  const explicit = p.size?.trim();
  if (explicit) return explicit;
  return sizeFromName(p.name);
}

export type CatalogSizeIssue = { name: string; brand: string; sku: string };

/** Active sellable products with no verified size/quantity. */
export function catalogSizeIssues(): CatalogSizeIssue[] {
  return SHOP_PRODUCTS.filter((p) => !p.comingSoon && !productSizeFor(p)).map((p) => ({
    name: p.name,
    brand: p.brand,
    sku: p.priceId,
  }));
}

/** A sellable product cannot be active without a size/quantity. */
export function isSellableActive(p: ShopProduct): boolean {
  return !p.comingSoon && Boolean(productSizeFor(p));
}

if (import.meta.env?.DEV) {
  for (const issue of catalogSizeIssues()) {
    console.error(
      `[catalog] Missing size/quantity — "${issue.brand} ${issue.name}" (SKU: ${issue.sku}). ` +
        'A sellable product cannot be active without a verified size.',
    );
  }
}

/** Central size lookup by price/SKU id — used by the bag, checkout and order records. */
export function sizeForPriceId(priceId: string): string | null {
  return catalogEntryFor(priceId)?.size ?? null;
}
