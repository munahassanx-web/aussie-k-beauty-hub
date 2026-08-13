import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

type IngredientRow = {
  is_hero_ingredient: boolean;
  ingredients: {
    id: string;
    name_english: string;
    name_korean: string | null;
    name_chinese: string | null;
    what_it_does: string;
    good_for: string[];
  } | null;
};

async function fetchProductIngredients(productId: string) {
  const { data, error } = await supabase
    .from('product_ingredients')
    .select(
      'is_hero_ingredient, ingredients ( id, name_english, name_korean, name_chinese, what_it_does, good_for )',
    )
    .eq('product_id', productId)
    .order('is_hero_ingredient', { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as IngredientRow[];
}

export function ProductIngredients({ productId }: { productId: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['product-ingredients', productId],
    queryFn: () => fetchProductIngredients(productId),
    staleTime: 5 * 60_000,
  });

  return (
    <section className="mt-8 border-t border-border pt-6">
      <h4 className="font-display text-xl text-foreground">What's Actually In This</h4>

      {isLoading ? (
        <p className="mt-3 text-xs text-muted-foreground">Loading ingredients…</p>
      ) : isError || !data || data.length === 0 ? (
        <p className="mt-3 text-sm italic text-muted-foreground">
          Full ingredient breakdown coming soon.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {data.map((row) => {
            const ing = row.ingredients;
            if (!ing) return null;
            const hero = row.is_hero_ingredient;
            return (
              <li
                key={ing.id}
                className={
                  hero
                    ? 'rounded-2xl border-2 p-5 shadow-sm'
                    : 'rounded-xl border border-border bg-secondary/40 p-4'
                }
                style={hero ? { borderColor: '#3F7D62', backgroundColor: '#F1F8F4' } : undefined}
              >
                {hero && (
                  <p
                    className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em]"
                    style={{ color: '#3F7D62' }}
                  >
                    Hero Ingredient
                  </p>
                )}
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <p
                    className={
                      hero
                        ? 'font-display text-lg text-foreground'
                        : 'font-display text-base text-foreground'
                    }
                  >
                    {ing.name_english}
                  </p>
                  {(ing.name_korean || ing.name_chinese) && (
                    <p className="text-xs text-muted-foreground">
                      {[ing.name_korean, ing.name_chinese].filter(Boolean).join(' · ')}
                    </p>
                  )}
                </div>
                <p
                  className={
                    hero
                      ? 'mt-2 text-sm text-foreground/85'
                      : 'mt-1.5 text-sm text-muted-foreground'
                  }
                >
                  {ing.what_it_does}
                </p>
                {ing.good_for.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {ing.good_for.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border bg-background px-2.5 py-0.5 text-[11px] text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
