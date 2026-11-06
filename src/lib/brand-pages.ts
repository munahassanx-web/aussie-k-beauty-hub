import { SHOP_PRODUCTS, type ShopProduct } from "@/lib/shop-catalog";

export type BrandInfo = {
  name: string;
  slug: string;
  /** Short factual description of the range Skin Grocer stocks. */
  tag: string;
  hero: string;
};

export const BRANDS: BrandInfo[] = [
  { name: "AESTURA", tag: "Ceramide-focused moisturisers and cleansers for the moisturise step", hero: "/products/aestura/atobarrier365-cream.webp" },
  { name: "BIODANCE", tag: "Hydrogel sheet masks and mask-focused formats", hero: "/products/biodance/bio-collagen-real-deep-mask.webp" },
  { name: "Beauty of Joseon", tag: "Ginseng and rice-based formulas across toners, serums and creams", hero: "/products/beauty-of-joseon/revive-eye-serum-ginseng-plus-retinal-30ml.webp" },
  { name: "Dr.G", tag: "Foaming cleansers and lightweight creams for the cleanse and moisturise steps", hero: "/products/dr-g/red-blemish-clear-soothing-foam-150ml.webp" },
  { name: "HARUHARU WONDER", tag: "Fermented black rice formulas across cleansing oils, toners and serums", hero: "/__l5e/assets-v1/5c2e77da-7082-420c-809a-9005bdb6aef8/haruharu-wonder-black-rice-hyaluronic-toner-150ml.png" },
  { name: "ISNTREE", tag: "Watery toners and essences, plus exfoliating acid formats", hero: "/products/isntree/hyaluronic-acid-water-essence-50ml.webp" },
  { name: "MEDICUBE", tag: "Serums and creams formulated with PDRN and peptide ingredients", hero: "/products/medicube/pdrn-pink-peptide-serum-30ml.webp" },
  { name: "ROUND LAB", tag: "The 1025 Dokdo line — simple toners, cleansers and creams", hero: "/products/round-lab/1025-dokdo-toner-100ml.webp" },
  { name: "S.NATURE", tag: "Squalane and botanical-based serums with a lightweight texture", hero: "/products/s-nature/aqua-squalane-serum.webp" },
  { name: "TIRTIR", tag: "Milky ceramide ampoules and creams", hero: "/products/tirtir/ceramic-milk-ampoule-40ml.webp" },
  { name: "TORRIDEN", tag: "Low-molecular hyaluronic acid serums, toners and gels", hero: "/products/torriden/dive-in-serum.webp" },
  { name: "WELLAGE", tag: "Hyaluronic acid and PDRN ampoules, toners and creams", hero: "/products/wellage/real-hyaluronic-blue-100-ampoule-60ml.webp" },
  { name: "beplain", tag: "Mung bean cleansing oils and foams, plus pH-balanced basics", hero: "/products/beplain/mung-bean-cleansing-oil-200ml.webp" },
].map((b) => ({ ...b, slug: brandSlug(b.name) }));

export function brandSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function findBrand(slug: string): BrandInfo | undefined {
  return BRANDS.find((b) => b.slug === slug);
}

export function productsForBrand(name: string): ShopProduct[] {
  return SHOP_PRODUCTS.filter((p) => p.brand.toLowerCase() === name.toLowerCase());
}
