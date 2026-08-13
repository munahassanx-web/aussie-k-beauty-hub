import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { ingredientSlug } from "@/lib/product-catalog";

type Row = {
  is_hero_ingredient: boolean;
  ingredients: { id: string; name_english: string; what_it_does: string } | null;
};




async function fetchHero(productId: string) {
  const { data, error } = await supabase
    .from("product_ingredients")
    .select("is_hero_ingredient, ingredients ( id, name_english, what_it_does )")
    .eq("product_id", productId)
    .eq("is_hero_ingredient", true);
  if (error) throw error;
  return (data ?? []) as unknown as Row[];
}

export function WhyThisIngredient({ productId }: { productId: string }) {
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["hero-ing", productId],
    queryFn: () => fetchHero(productId),
    enabled: open,
    staleTime: 5 * 60_000,
  });

  return (
    <div className="mt-2">
      <button
        onClick={() => setOpen((v) => !v)}
        className="text-[10px] uppercase tracking-wider text-primary hover:underline"
      >
        {open ? "Hide" : "Why this ingredient?"} {open ? "▲" : "▼"}
      </button>
      {open && (
        <div className="mt-2 border-l-2 pl-3" style={{ borderColor: "#3F7D62" }}>
          {isLoading ? (
            <p className="text-[11px] text-muted-foreground">Loading…</p>
          ) : !data || data.length === 0 ? (
            <p className="text-[11px] italic text-muted-foreground">Ingredient breakdown coming soon.</p>
          ) : (
            <ul className="space-y-2">
              {data.map((r) => {
                const ing = r.ingredients;
                if (!ing) return null;
                return (
                  <li key={ing.id}>
                    <p className="text-[11px] font-semibold text-ink">{ing.name_english}</p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{ing.what_it_does}</p>
                    <Link
                      to="/learn/$slug"
                      params={{ slug: ingredientSlug(ing.name_english) }}
                      className="mt-1 inline-block text-[10px] uppercase tracking-wider text-primary hover:underline"
                    >
                      Learn more →
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
