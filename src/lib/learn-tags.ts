// Tag derivation + search for Learn Hub filtering.
// Tags are matched against the full article text so filtering stays accurate
// as new articles are added, with no per-article tagging to maintain.

import { learnArticles, type LearnArticle } from "@/lib/learn-articles";

export type TagGroup = "Ingredient" | "Concern" | "Routine step";

type TagDef = { label: string; group: TagGroup; match: string[] };

const TAG_DEFS: TagDef[] = [
  // Ingredients
  { label: "PDRN", group: "Ingredient", match: ["pdrn", "polydeoxyribonucleotide"] },
  { label: "Centella (cica)", group: "Ingredient", match: ["centella", "cica", "madecassoside"] },
  { label: "Niacinamide", group: "Ingredient", match: ["niacinamide"] },
  { label: "Hyaluronic acid", group: "Ingredient", match: ["hyaluronic"] },
  { label: "Ginseng", group: "Ingredient", match: ["ginseng", "ginsenoside"] },
  { label: "Mugwort", group: "Ingredient", match: ["mugwort", "ssuk", "artemisia"] },
  { label: "Heartleaf", group: "Ingredient", match: ["heartleaf", "houttuynia", "eosuchou"] },
  { label: "Rice ferment", group: "Ingredient", match: ["rice ferment", "galactomyces", "ssal-tteumul", "fermentation"] },
  { label: "Snail mucin", group: "Ingredient", match: ["snail"] },
  { label: "Ceramides", group: "Ingredient", match: ["ceramide"] },
  { label: "Peptides", group: "Ingredient", match: ["peptide"] },
  { label: "Retinal", group: "Ingredient", match: ["retinal", "retinol", "retinoid"] },
  { label: "Vitamin C", group: "Ingredient", match: ["vitamin c", "ascorbic"] },
  { label: "AHA / BHA", group: "Ingredient", match: ["aha", "bha", "exfoliating acid", "salicylic", "glycolic"] },
  { label: "Exosomes", group: "Ingredient", match: ["exosome"] },
  // Concerns
  { label: "Barrier repair", group: "Concern", match: ["barrier"] },
  { label: "Sensitivity", group: "Concern", match: ["sensitive", "sensitivity", "irritat", "redness"] },
  { label: "Pigmentation", group: "Concern", match: ["pigmentation", "brightening", "dark spot", "even tone"] },
  { label: "Acne & congestion", group: "Concern", match: ["acne", "breakout", "congest", "pore"] },
  { label: "Ageing & firmness", group: "Concern", match: ["ageing", "aging", "firmness", "fine lines", "collagen"] },
  { label: "Dehydration", group: "Concern", match: ["dehydrat", "hydration", "humectant"] },
  { label: "Deeper skin tones", group: "Concern", match: ["deeper skin", "fitzpatrick", "white cast"] },
  // Routine steps
  { label: "Cleansing", group: "Routine step", match: ["cleanser", "cleansing", "double cleanse"] },
  { label: "Toner & essence", group: "Routine step", match: ["toner", "essence", "ampoule"] },
  { label: "Serum", group: "Routine step", match: ["serum"] },
  { label: "Moisturiser", group: "Routine step", match: ["moisturis", "cream"] },
  { label: "Sunscreen", group: "Routine step", match: ["sunscreen", "spf", "uv"] },
  { label: "Masks", group: "Routine step", match: ["mask", "sheet mask", "toner pad"] },
  { label: "Layering order", group: "Routine step", match: ["layering", "routine order", "thinnest to thickest", "what not to mix"] },
];

function corpus(a: LearnArticle): string {
  return [
    a.title,
    a.blurb,
    a.standfirst,
    a.meta,
    ...a.keyPoints,
    ...a.sections.map((s) => `${s.heading ?? ""} ${s.body}`),
  ]
    .join(" ")
    .toLowerCase();
}

const TAGS_BY_SLUG = new Map<string, string[]>(
  learnArticles.map((a) => {
    const text = corpus(a);
    return [a.slug, TAG_DEFS.filter((t) => t.match.some((m) => text.includes(m))).map((t) => t.label)];
  }),
);

export function tagsFor(a: LearnArticle): string[] {
  return TAGS_BY_SLUG.get(a.slug) ?? [];
}

/** Tag groups, keeping only tags that at least one article actually carries. */
export function tagGroups(): { group: TagGroup; tags: string[] }[] {
  const used = new Set([...TAGS_BY_SLUG.values()].flat());
  const groups: TagGroup[] = ["Ingredient", "Concern", "Routine step"];
  return groups.map((group) => ({
    group,
    tags: TAG_DEFS.filter((t) => t.group === group && used.has(t.label)).map((t) => t.label),
  }));
}

export function filterArticles(query: string, tag: string): LearnArticle[] {
  const q = query.trim().toLowerCase();
  return learnArticles.filter((a) => {
    if (tag && !tagsFor(a).includes(tag)) return false;
    if (!q) return true;
    return corpus(a).includes(q) || tagsFor(a).some((t) => t.toLowerCase().includes(q));
  });
}
