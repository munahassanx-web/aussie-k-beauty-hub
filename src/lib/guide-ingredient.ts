import { contentInPreparation, ingredientReviewRecordComplete, type ShopProduct } from '@/lib/shop-catalog';
import { accordionIngredients, supplyRestricted } from '@/lib/product-detail';

const FACTS = [
  { match: /centella asiatica (extract|leaf extract|leaf water)/i, name: 'Centella asiatica · Cica', korean: '병풀', fact: 'Cica is another name for Centella asiatica, a botanical ingredient used in skin-conditioning formulas.', visual: 'centella' },
  { match: /phaseolus radiatus (seed powder|seed extract)/i, name: 'Mung bean', korean: '녹두', fact: 'Mung bean can appear on a cosmetic ingredient list as Phaseolus radiatus. The full cleansing formula—not one botanical alone—determines how it cleans.', visual: undefined },
  { match: /oryza sativa/i, name: 'Rice-derived ingredient', korean: '쌀', fact: 'Rice extract, rice bran oil and fermented rice are different ingredients. This formula’s ingredient list tells you which form is used.', visual: undefined },
  { match: /panax ginseng/i, name: 'Ginseng', korean: '인삼', fact: 'Ginseng appears in skincare under its botanical name, Panax ginseng. Here it is part of the complete skin-conditioning formula.', visual: undefined },
  { match: /^propolis extract$/i, name: 'Propolis', korean: '프로폴리스', fact: 'Propolis is a resinous material collected and processed by bees—not honey. It is used as a skin-conditioning ingredient; avoid it if you have a known allergy to bee-related products.', visual: 'propolis' },
  { match: /^snail secretion filtrate$/i, name: 'Snail secretion filtrate', korean: '달팽이 점액 여과물', fact: 'Often called snail mucin, this ingredient contains water-binding and skin-conditioning components. Its performance depends on the complete formula.', visual: 'snail' },
  { match: /^madecassoside$/i, name: 'Madecassoside', korean: '마데카소사이드', fact: 'Madecassoside is one of the components associated with Centella asiatica. A formula can list it separately from the whole plant extract.', visual: 'madecassoside' },
  { match: /^ceramide\b/i, name: 'Ceramides', korean: '세라마이드', fact: 'Ceramides are lipids also found in the skin barrier. In skincare, they sit alongside other moisturising ingredients—not as a replacement for the whole formula.', visual: undefined },
  { match: /hyaluron/i, name: 'Hyaluronic-acid family', korean: '히알루론산', fact: 'Sodium hyaluronate belongs to the hyaluronic-acid family. These ingredients are commonly used as humectants to support surface hydration.', visual: undefined },
  { match: /^niacinamide$/i, name: 'Niacinamide · Vitamin B3', korean: '나이아신아마이드', fact: 'Niacinamide is a form of vitamin B3 used in both Korean and Western skincare. A higher percentage is not automatically better for your skin.', visual: 'niacinamide' },
  { match: /^beta[ -]glucan$/i, name: 'Beta-glucan', korean: '베타글루칸', fact: 'Beta-glucan is a family of polysaccharides that can come from oats, yeast, fungi or other cereals. The name alone does not tell you its source.', visual: 'beta' },
  { match: /^panthenol$/i, name: 'Panthenol · Provitamin B5', korean: '판테놀', fact: 'Panthenol is also called provitamin B5. It is used alongside other ingredients in moisturising and skin-conditioning formulas.', visual: undefined },
  { match: /^squalane$/i, name: 'Squalane', korean: '스쿠알란', fact: 'Squalane is an emollient used to help skin feel soft. The ingredient name alone does not establish whether its source is plant or animal.', visual: undefined },
  { match: /^glycerin$/i, name: 'Glycerin', korean: '글리세린', fact: 'Glycerin is a humectant—a water-binding ingredient. Familiar ingredients like this contribute to hydration in both Korean and Western formulas.', visual: undefined },
] as const;

/** Presence comes only from a reviewed exact-SKU INCI, never its name or claims. */
export function guideIngredient(product: ShopProduct) {
  if (contentInPreparation(product) || supplyRestricted(product) || !ingredientReviewRecordComplete(product)) return null;
  const inci = product.inci ?? [];
  const heroes = accordionIngredients(product);
  const preferred = heroes.flatMap((hero) => hero.components ?? [hero.name]);
  const fact = FACTS.find((entry) => preferred.some((name) => entry.match.test(name)) && inci.some((name) => entry.match.test(name)))
    ?? FACTS.find((entry) => inci.some((name) => entry.match.test(name)));
  if (!fact) return null;
  return {
    ...fact,
    listedAs: inci.filter((name) => fact.match.test(name)),
    sourceName: product.inciSourceName,
    sourceUrl: product.inciSourceUrl,
    sourceNote: product.inciSourceNote,
    checkedOn: product.inciCheckedOn,
  };
}