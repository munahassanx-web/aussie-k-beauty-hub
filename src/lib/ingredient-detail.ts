import { notFound } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { getCatalogEntry, ingredientSlug } from "@/lib/product-catalog";

export type IngredientDetail = {
  id: string;
  name_english: string;
  name_korean: string | null;
  name_chinese: string | null;
  category: string;
  what_it_does: string;
  good_for: string[];
  avoid_if: string[];
  how_to_use: string | null;
  pairs_well_with: string[];
  avoid_pairing_with: string[];
  science_note: string | null;
  common_myth: string | null;
  also_known_as: string[];
};

export async function fetchIngredientBySlug(slug: string) {
  const { data, error } = await supabase
    .from("ingredients")
    .select(
      "id, name_english, name_korean, name_chinese, category, what_it_does, good_for, avoid_if, how_to_use, pairs_well_with, avoid_pairing_with, science_note, common_myth, also_known_as",
    );
  if (error) throw error;

  const match = (data ?? []).find(
    (row) => ingredientSlug(row.name_english) === slug,
  ) as IngredientDetail | undefined;
  if (!match) throw notFound();

  const { data: links, error: linkErr } = await supabase
    .from("product_ingredients")
    .select("product_id, is_hero_ingredient")
    .eq("ingredient_id", match.id);
  if (linkErr) throw linkErr;

  return {
    ingredient: match,
    products: (links ?? []).map((r) => ({
      ...getCatalogEntry(r.product_id),
      isHero: r.is_hero_ingredient,
    })),
  };
}

