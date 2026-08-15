// Maps Learn articles to real catalogue products so readers can shop what they
// just read about. Matching is derived from article text + derived tags, so new
// articles pick up product links automatically.

import { SHOP_PRODUCTS, type Concern, type ShopProduct } from "@/lib/shop-catalog";
import type { LearnArticle } from "@/lib/learn-articles";
import { tagsFor } from "@/lib/learn-tags";

/** Ingredient/format keywords that must appear in the product name or brand. */
const INGREDIENT_MATCHERS: Record<string, string[]> = {
  PDRN: ["pdrn"],
  "Centella (cica)": ["cica", "centella"],
  Niacinamide: ["niacinamide"],
  "Hyaluronic acid": ["hyaluronic", "dive in"],
  Ginseng: ["ginseng"],
  Mugwort: ["mugwort", "artemisia"],
  Heartleaf: ["heartleaf", "houttuynia"],
  "Rice ferment": ["rice"],
  "Snail mucin": ["snail"],
  Ceramides: ["ceramide"],
  Peptides: ["peptide", "collagen"],
  Retinal: ["retinal", "retinol"],
  "Vitamin C": ["vitamin c", "ascorbic", "glutathione"],
  "AHA / BHA": ["bha", "aha", "clear liquid"],
  Exosomes: ["exosome"],
};

const CONCERN_BY_TAG: Record<string, Concern> = {
  "Barrier repair": "barrier",
  Sensitivity: "sensitivity",
  Pigmentation: "pigmentation",
  "Acne & congestion": "acne",
  "Ageing & firmness": "anti-aging",
  Dehydration: "hydration",
};

const CATEGORY_BY_TAG: Record<string, ShopProduct["category"]> = {
  Cleansing: "Cleanse",
  "Toner & essence": "Tone",
  Serum: "Treat",
  Moisturiser: "Moisturise",
  Sunscreen: "Protect",
  Masks: "Masks",
};

function haystack(p: ShopProduct): string {
  return `${p.brand} ${p.name}`.toLowerCase();
}

export function priceCents(p: ShopProduct): number {
  return Math.round(parseFloat(p.price.replace(/[^0-9.]/g, "")) * 100);
}

/**
 * Products worth recommending alongside an article, best match first.
 * Ingredient hits weigh most, then concern overlap, then routine step.
 */
export function productsForArticle(article: LearnArticle, limit = 4): ShopProduct[] {
  const tags = tagsFor(article);
  const title = article.title.toLowerCase();

  const ingredientTerms = tags
    .filter((t) => t in INGREDIENT_MATCHERS)
    .flatMap((t) => INGREDIENT_MATCHERS[t]!.map((m) => ({ term: m, hero: title.includes(m) })));
  const concerns = tags.map((t) => CONCERN_BY_TAG[t]).filter(Boolean) as Concern[];
  const categories = tags.map((t) => CATEGORY_BY_TAG[t]).filter(Boolean) as ShopProduct["category"][];

  const scored = SHOP_PRODUCTS.map((p) => {
    const text = haystack(p);
    let score = 0;
    for (const { term, hero } of ingredientTerms) {
      if (text.includes(term)) score += hero ? 6 : 3;
    }
    score += p.concerns.filter((c) => concerns.includes(c)).length * 2;
    if (categories.includes(p.category)) score += 1;
    return { p, score };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || priceCents(a.p) - priceCents(b.p));

  // Keep the set varied: at most two products from the same routine step.
  const perCategory = new Map<string, number>();
  const picks: ShopProduct[] = [];
  for (const { p } of scored) {
    const used = perCategory.get(p.category) ?? 0;
    if (used >= 2) continue;
    perCategory.set(p.category, used + 1);
    picks.push(p);
    if (picks.length >= limit) break;
  }
  return picks;
}
