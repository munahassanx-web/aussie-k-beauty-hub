// Lightweight catalog of products that have ingredient tags in the
// product_ingredients table. Keyed by the `product_id` text code stored on
// each product_ingredients row. Used by the /learn ingredient encyclopedia
// to list "Shop products with this ingredient". When the shop grows to
// include the rest of these products, wire real priceIds / images here.

import productReliefSun from "@/assets/product-relief-sun.jpg";

export type CatalogEntry = {
  productId: string;
  name: string;
  brand: string;
  image?: string;
  priceLabel?: string;
  priceId?: string; // present when the product is buyable via useBuyNow
};

export const PRODUCT_CATALOG: Record<string, CatalogEntry> = {
  relief_sun_onetime: {
    productId: "relief_sun_onetime",
    name: "Relief Sun SPF50+",
    brand: "Beauty of Joseon",
    image: productReliefSun,
    priceLabel: "$22 AUD",
    priceId: "relief_sun_onetime",
  },
  anua_heartleaf_cleansing_oil: {
    productId: "anua_heartleaf_cleansing_oil",
    name: "Heartleaf Pore Control Cleansing Oil",
    brand: "Anua",
  },
  cosrx_ahabha_toner: {
    productId: "cosrx_ahabha_toner",
    name: "AHA/BHA Clarifying Treatment Toner",
    brand: "COSRX",
  },
  boj_glow_serum: {
    productId: "boj_glow_serum",
    name: "Glow Serum: Propolis + Niacinamide",
    brand: "Beauty of Joseon",
  },
  biodance_collagen_mask: {
    productId: "biodance_collagen_mask",
    name: "Bio-Collagen Real Deep Mask",
    brand: "BIODANCE",
  },
  torriden_divein_serum: {
    productId: "torriden_divein_serum",
    name: "DIVE-IN Low Molecular Hyaluronic Acid Serum",
    brand: "Torriden",
  },
  roundlab_1025_dokdo_cream: {
    productId: "roundlab_1025_dokdo_cream",
    name: "1025 Dokdo Cream",
    brand: "Round Lab",
  },
  skin1004_centella_ampoule: {
    productId: "skin1004_centella_ampoule",
    name: "Madagascar Centella Ampoule",
    brand: "SKIN1004",
  },
  numbuzin_no3_softening_serum: {
    productId: "numbuzin_no3_softening_serum",
    name: "No.3 Skin Softening Serum",
    brand: "Numbuzin",
  },
};

export function getCatalogEntry(productId: string): CatalogEntry {
  return (
    PRODUCT_CATALOG[productId] ?? {
      productId,
      name: productId,
      brand: "",
    }
  );
}

export function ingredientSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
