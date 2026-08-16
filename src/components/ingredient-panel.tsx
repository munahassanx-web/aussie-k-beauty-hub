import type { HeroIngredient } from '@/lib/product-detail';

/**
 * Reusable "key ingredients" panel template.
 *
 * Every product page renders its hero ingredients through this component, so
 * any new SKU automatically inherits the same modern formatting: numbered
 * cards, an eyebrow label, product name in display type and benefit chips.
 * Only real, brand-sourced ingredient facts should be passed in.
 */
export function IngredientPanel({
  ingredients,
  eyebrow = 'Science-backed, skin-loving',
  title = "What's actually in this",
  subtitle,
  className = '',
}: {
  ingredients: HeroIngredient[];
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  className?: string;
}) {
  if (ingredients.length === 0) return null;

  return (
    <div className={className}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-display text-2xl leading-tight text-foreground md:text-3xl">
        {title}
      </h2>
      {subtitle && <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>}

      <ul className="mt-6 grid gap-3 md:grid-cols-3">
        {ingredients.map((ing, i) => (
          <li
            key={ing.name}
            className="group relative flex flex-col rounded-3xl border border-border bg-card p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-shadow duration-300 hover:shadow-[0_12px_30px_-18px_rgba(0,0,0,0.35)]"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-secondary text-xs font-semibold tabular-nums text-foreground/70">
              {String(i + 1).padStart(2, '0')}
            </span>
            <p className="mt-4 font-display text-lg leading-snug text-foreground">{ing.name}</p>
            {ing.korean && (
              <p className="mt-1 text-xs tracking-wide text-muted-foreground">{ing.korean}</p>
            )}
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{ing.what}</p>
            {ing.goodFor.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5 border-t border-border pt-4">
                {ing.goodFor.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-secondary px-2.5 py-1 text-[11px] text-foreground/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
