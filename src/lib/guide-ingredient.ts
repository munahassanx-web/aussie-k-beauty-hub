import { contentInPreparation, ingredientReviewRecordComplete, type ShopProduct } from '@/lib/shop-catalog';
import { accordionIngredients, supplyRestricted } from '@/lib/product-detail';

const FACTS = [
  { match: /centella asiatica (extract|leaf extract|leaf water)/i, name: 'Centella asiatica · Cica', korean: '병풀', fact: 'Cica is another name for Centella asiatica, a botanical ingredient used in skin-conditioning formulas.', visual: 'centella' },
  { match: /phaseolus radiatus (seed powder|seed extract)/i, name: 'Mung bean', korean: '녹두', fact: 'Meet mung bean! Look for Phaseolus radiatus on the ingredient list. It’s one part of the formula—not the whole cleansing crew.', visual: 'mung' },
  { match: /oryza sativa/i, name: 'Rice-derived ingredient', korean: '쌀', fact: 'Rice has more than one skincare identity: extract, bran oil and fermented rice are different ingredients. Check the list to meet the one in your formula.', visual: 'rice' },
  { match: /panax ginseng/i, name: 'Ginseng', korean: '인삼', fact: 'Ginseng has a botanical alias: Panax ginseng. Here it joins the rest of the skin-conditioning formula.', visual: 'ginseng' },
  { match: /^propolis extract$/i, name: 'Propolis', korean: '프로폴리스', fact: 'Propolis is a resinous material collected and processed by bees—not honey. It is used as a skin-conditioning ingredient; avoid it if you have a known allergy to bee-related products.', visual: 'propolis' },
  { match: /^snail secretion filtrate$/i, name: 'Snail secretion filtrate', korean: '달팽이 점액 여과물', fact: 'Often called snail mucin, this ingredient contains water-binding and skin-conditioning components. Its performance depends on the complete formula.', visual: 'snail' },
  { match: /^madecassoside$/i, name: 'Madecassoside', korean: '마데카소사이드', fact: 'Madecassoside is one of the components associated with Centella asiatica. A formula can list it separately from the whole plant extract.', visual: 'madecassoside' },
  { match: /^ceramide\b/i, name: 'Ceramides', korean: '세라마이드', fact: 'Your skin barrier knows these lipids already! In skincare, ceramides team up with other moisturising ingredients.', visual: 'emollient' },
  { match: /hyaluron/i, name: 'Hyaluronic-acid family', korean: '히알루론산', fact: 'Same family, different name! Sodium hyaluronate belongs to the hyaluronic-acid family—humectants used to support surface hydration.', visual: 'hydration' },
  { match: /^niacinamide$/i, name: 'Niacinamide · Vitamin B3', korean: '나이아신아마이드', fact: 'Niacinamide is a form of vitamin B3 used in both Korean and Western skincare. A higher percentage is not automatically better for your skin.', visual: 'niacinamide' },
  { match: /^beta[ -]glucan$/i, name: 'Beta-glucan', korean: '베타글루칸', fact: 'Beta-glucan is a family of polysaccharides that can come from oats, yeast, fungi or other cereals. The name alone does not tell you its source.', visual: 'beta' },
  { match: /^panthenol$/i, name: 'Panthenol · Provitamin B5', korean: '판테놀', fact: 'Panthenol’s other name? Provitamin B5! You’ll find it teaming up with other moisturising and skin-conditioning ingredients.', visual: 'hydration' },
  { match: /^squalane$/i, name: 'Squalane', korean: '스쿠알란', fact: 'A soft-skin teammate: squalane is an emollient. Its name alone doesn’t tell you whether it comes from plants or animals.', visual: 'emollient' },
  { match: /^glycerin$/i, name: 'Glycerin', korean: '글리세린', fact: 'Small name, familiar role! Glycerin is a water-binding humectant used in Korean and Western moisturising formulas.', visual: 'hydration' },
] as const;

const CULTURE = {
  rice: { text: 'Rice water before toner? Rice-rinsing water was used for face washing in Joseon-era Korea.', source: 'Korea Citation Index · Joseon face-washing history', url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART002109441' },
  mung: { text: 'Before cleansing balms, there was jodu: a Joseon-era washing powder made with beans, including mung beans.', source: 'The Korea Times · Joseon women’s skincare knowhow', url: 'https://www.koreatimes.co.kr/lifestyle/koreanheritage/20140530/joseon-womens-skincare-knowhow' },
};

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
    culture: fact.visual === 'rice' || fact.visual === 'mung' ? CULTURE[fact.visual] : null,
    listedAs: inci.filter((name) => fact.match.test(name)),
    sourceName: product.inciSourceName,
    sourceUrl: product.inciSourceUrl,
    sourceNote: product.inciSourceNote,
    checkedOn: product.inciCheckedOn,
  };
}