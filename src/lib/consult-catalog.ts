// Shared product set used by the Skin Consultation. Keyed by priceId so the
// AI consultant can reference products by a stable id and the client can map
// straight back to imagery + checkout.

import maskMedihealSheet from "@/assets/mask-mediheal-sheet.jpg";
import maskDynastyCream from "@/assets/mask-dynasty-cream.jpg";
import maskNumbuzinEye from "@/assets/mask-numbuzin-eye.jpg";
import maskSomeByMiClay from "@/assets/mask-somebymi-clay.jpg";
import maskAbibSleeping from "@/assets/mask-abib-sleeping.jpg";
import maskAnuaHeartleaf from "@/assets/mask-anua-heartleaf.jpg";
import maskSkin1004Centella from "@/assets/mask-skin1004-centella.jpg";
import productSnail from "@/assets/product-snail-essence.jpg";
import productCentellaToner from "@/assets/product-centella-toner.jpg";
import productVitC from "@/assets/product-vitc-serum.jpg";
import productRice from "@/assets/product-rice-cleanser.jpg";
import productReliefSun from "@/assets/product-relief-sun.jpg";
import productCicaCream from "@/assets/product-cica-cream.jpg";
import productHeartleaf from "@/assets/product-heartleaf-ampoule.jpg";

export type ConsultProduct = {
  priceId: string;
  name: string;
  brand: string;
  price: string;
  image: string;
  step: string;
  heroIngredients: string;
  bestFor: string;
};

export const CONSULT_PRODUCTS: ConsultProduct[] = [
  {
    priceId: "rice_cleanser_onetime",
    name: "Rice Probiotics Cleansing Foam",
    brand: "I'm From",
    price: "$30",
    image: productRice,
    step: "Cleanse",
    heroIngredients: "Rice extract, probiotics",
    bestFor: "dullness, dehydration, gentle daily cleansing for dry or normal skin",
  },
  {
    priceId: "centella_toner_onetime",
    name: "Centella Calming Toner",
    brand: "SKIN1004",
    price: "$28",
    image: productCentellaToner,
    step: "Tone / Prep",
    heroIngredients: "Centella asiatica (cica)",
    bestFor: "redness, reactive skin, post-cleanse rebalancing, breakout-prone skin",
  },
  {
    priceId: "snail_essence_onetime",
    name: "Hydrating Snail Mucin Essence",
    brand: "COSRX",
    price: "$32",
    image: productSnail,
    step: "Essence",
    heroIngredients: "96% snail secretion filtrate",
    bestFor: "dehydration, early fine lines, barrier repair, air-conditioned environments",
  },
  {
    priceId: "vitc_serum_onetime",
    name: "Vitamin C Brightening Serum",
    brand: "Beauty of Joseon",
    price: "$36",
    image: productVitC,
    step: "Treat",
    heroIngredients: "Vitamin C, niacinamide",
    bestFor: "dullness, uneven tone, sun-related pigmentation — not ideal for very reactive skin",
  },
  {
    priceId: "heartleaf_ampoule_onetime",
    name: "Heartleaf Soothing Ampoule",
    brand: "Anua",
    price: "$38",
    image: productHeartleaf,
    step: "Treat",
    heroIngredients: "Houttuynia cordata (heartleaf)",
    bestFor: "redness, sensitivity, hormonal or inflamed breakouts, calming actives",
  },
  {
    priceId: "cica_cream_onetime",
    name: "Cica Recovery Cream",
    brand: "Anua",
    price: "$34",
    image: productCicaCream,
    step: "Moisturise",
    heroIngredients: "Centella, ceramides",
    bestFor: "barrier repair, redness, dehydration, all skin types",
  },
  {
    priceId: "mask_abib_sleeping_onetime",
    name: "Pep-Talk Peptide Sleeping Mask",
    brand: "Abib",
    price: "$34",
    image: maskAbibSleeping,
    step: "Moisturise",
    heroIngredients: "Peptides",
    bestFor: "fine lines, firmness, overnight hydration in heated or dry indoor air",
  },
  {
    priceId: "mask_mediheal_sheet_onetime",
    name: "Real Ferment Micro Essence Sheet Mask",
    brand: "Mediheal",
    price: "$6",
    image: maskMedihealSheet,
    step: "Weekly treatment",
    heroIngredients: "Fermented essence complex",
    bestFor: "dullness, dehydration, a fast weekly glow reset",
  },
  {
    priceId: "mask_dynasty_cream_onetime",
    name: "Dynasty Cream Mask",
    brand: "Beauty of Joseon",
    price: "$5",
    image: maskDynastyCream,
    step: "Weekly treatment",
    heroIngredients: "Rice, ginseng",
    bestFor: "dry, tight skin and dull tone",
  },
  {
    priceId: "mask_numbuzin_eye_onetime",
    name: "Bakuchiol Retinol Eye Mask",
    brand: "Numbuzin",
    price: "$32",
    image: maskNumbuzinEye,
    step: "Targeted care",
    heroIngredients: "Bakuchiol, retinol",
    bestFor: "fine lines around the eyes, a gentler retinol entry point",
  },
  {
    priceId: "mask_somebymi_clay_onetime",
    name: "AHA-BHA-PHA Miracle Clay Mask",
    brand: "Some By Mi",
    price: "$28",
    image: maskSomeByMiClay,
    step: "Weekly treatment",
    heroIngredients: "AHA, BHA, PHA, clay",
    bestFor: "congestion, breakouts, oily and combination skin — too strong for very sensitive skin",
  },
  {
    priceId: "mask_anua_heartleaf_onetime",
    name: "Heartleaf 77% Soothing Sheet Mask",
    brand: "Anua",
    price: "$6",
    image: maskAnuaHeartleaf,
    step: "Weekly treatment",
    heroIngredients: "Heartleaf",
    bestFor: "flare-ups, redness, post-sun calming",
  },
  {
    priceId: "relief_sun_onetime",
    name: "Relief Sun SPF50+",
    brand: "Beauty of Joseon",
    price: "$22",
    image: productReliefSun,
    step: "Protect",
    heroIngredients: "Rice bran, grain extracts, SPF50+ PA++++",
    bestFor: "daily high-UV protection in Australia, wears well under makeup",
  },
  {
    priceId: "mask_skin1004_centella_onetime",
    name: "Centella Hyalu-Cica Water-Fit Sun Mask",
    brand: "SKIN1004",
    price: "$8",
    image: maskSkin1004Centella,
    step: "Protect",
    heroIngredients: "Centella, hyaluronic acid, SPF50+",
    bestFor: "lightweight reapplication for outdoor days, sensitive skin",
  },
];

export const CONSULT_PRODUCT_MAP: Record<string, ConsultProduct> = Object.fromEntries(
  CONSULT_PRODUCTS.map((p) => [p.priceId, p]),
);
