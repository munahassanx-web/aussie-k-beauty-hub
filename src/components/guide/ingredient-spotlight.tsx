import { FlaskConical, Sparkles, ArrowUpRight } from 'lucide-react';
import { guideIngredient } from '@/lib/guide-ingredient';
import type { ShopProduct } from '@/lib/shop-catalog';
import centella from '@/assets/ingredients/tex-centella.jpg';
import niacinamide from '@/assets/ingredients/tex-niacinamide.jpg';
import propolis from '@/assets/ingredients/tex-propolis.jpg';
import snail from '@/assets/ingredients/tex-snail-mucin.jpg';
import madecassoside from '@/assets/ingredients/tex-madecassoside.jpg';
import beta from '@/assets/ingredients/tex-beta-glucan.jpg';

const PHOTOS = { centella, niacinamide, propolis, snail, madecassoside, beta };

export function IngredientSpotlight({ product }: { product: ShopProduct }) {
  const ingredient = guideIngredient(product);
  if (!ingredient) return null;
  const photo = ingredient.visual ? PHOTOS[ingredient.visual] : null;
  return (
    <aside aria-label="Ingredient spotlight" className="mx-5 mt-10 border-y border-border py-6 sm:mx-10">
      <div className="flex items-start gap-4 sm:gap-6">
        {photo ? (
          <figure className="w-24 flex-none sm:w-32">
            <img src={photo} alt={`Illustrative ingredient study: ${ingredient.name}; not the finished product`} loading="lazy" width={128} height={128} className="aspect-square w-full rounded-full object-cover" />
            <figcaption className="mt-2 text-center text-[10px] text-muted-foreground">Ingredient illustration</figcaption>
          </figure>
        ) : (
          <span aria-hidden="true" className="flex size-16 flex-none items-center justify-center rounded-full bg-secondary text-[color:var(--aisle-deep)] sm:size-24"><FlaskConical className="size-7 sm:size-9" /></span>
        )}
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase text-[color:var(--aisle-deep)]"><Sparkles className="size-3.5" aria-hidden="true" /> Did you know?</p>
          <h2 className="mt-2 text-xl font-semibold leading-tight text-foreground">{ingredient.name}</h2>
          {ingredient.korean && <p className="mt-1 font-hangul text-xs text-muted-foreground">{ingredient.korean}</p>}
          <p className="mt-3 text-sm leading-relaxed text-foreground">{ingredient.fact}</p>
        </div>
      </div>
      <details className="mt-4 text-xs text-muted-foreground">
        <summary className="w-fit cursor-pointer rounded-sm py-1 font-medium focus-visible:outline-2 focus-visible:outline-ring">In this formula & source</summary>
        <div className="mt-2 space-y-2 leading-relaxed">
          <p>Listed as: {ingredient.listedAs.join(', ')}.</p>
          <p>{ingredient.sourceName} · Ingredient record checked {ingredient.checkedOn}.</p>
          {ingredient.sourceNote && <p>{ingredient.sourceNote}</p>}
          {ingredient.sourceUrl && <a href={ingredient.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-[color:var(--aisle-deep)] underline underline-offset-4">View ingredient source <ArrowUpRight className="size-3" aria-hidden="true" /></a>}
          <p>Ingredient presence does not establish concentration or results. These ingredients are not exclusive to Korean skincare.</p>
        </div>
      </details>
    </aside>
  );
}