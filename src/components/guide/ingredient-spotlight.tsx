import { FlaskConical, ArrowUpRight, Plus } from 'lucide-react';
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
    <aside aria-label="Ingredient spotlight" className="relative mt-10 overflow-hidden bg-ink px-5 py-7 text-background sm:px-10 sm:py-9">
      <div className="flex items-center justify-between gap-3 border-b border-background/25 pb-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em]">The ingredient file</p>
        <span className="font-mono text-[10px] uppercase text-background/60">Skin Grocer / 연구 노트</span>
      </div>
      <div className="grid items-center gap-6 pt-6 sm:grid-cols-[1fr_220px] sm:gap-8">
        <div className="order-2 min-w-0 sm:order-1">
          <p className="inline-block -rotate-3 border border-[color:var(--aisle)] px-3 py-1.5 text-[12px] font-medium text-[color:var(--aisle)]">Did you know?</p>
          <h2 className="mt-5 text-[26px] font-medium leading-tight">{ingredient.name}</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-background/85">{ingredient.fact}</p>
        </div>
        <figure className="relative order-1 mx-auto w-52 sm:order-2 sm:w-full">
          <div className="relative aspect-square rounded-full border border-background/40 p-2">
            {photo ? (
              <img src={photo} alt={`Illustrative ingredient study: ${ingredient.name}; not the finished product`} loading="lazy" width={240} height={240} className="h-full w-full rounded-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full bg-secondary text-foreground"><FlaskConical className="size-16" aria-hidden="true" /></div>
            )}
            <Plus className="absolute -left-1 top-1/2 size-4 -translate-y-1/2 bg-ink text-background/70" aria-hidden="true" />
            <Plus className="absolute -right-1 top-1/2 size-4 -translate-y-1/2 bg-ink text-background/70" aria-hidden="true" />
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap border border-background/40 bg-ink px-3 py-1 text-[11px] font-medium">{photo ? 'Ingredient study' : 'Formula note'}</span>
          </div>
          {ingredient.korean && <p className="mt-5 break-keep text-center font-hangul text-2xl font-medium leading-snug text-[color:var(--aisle)]">{ingredient.korean}</p>}
          {photo && <figcaption className="mt-2 text-center text-[10px] text-background/60">Illustration · not the finished formula</figcaption>}
        </figure>
      </div>
      <details className="group mt-7 border-t border-background/25 pt-3 text-xs text-background/75">
        <summary className="flex w-full cursor-pointer list-none items-center justify-between gap-4 rounded-sm py-1 font-medium text-background focus-visible:outline-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">In this formula & source <Plus className="size-4 flex-none transition-transform group-open:rotate-45 motion-reduce:transition-none" aria-hidden="true" /></summary>
        <div className="mt-3 space-y-2 leading-relaxed">
          <p>Listed as: {ingredient.listedAs.join(', ')}.</p>
          <p>{ingredient.sourceName} · Ingredient record checked {ingredient.checkedOn}.</p>
          {ingredient.sourceNote && <p>{ingredient.sourceNote}</p>}
          {ingredient.sourceUrl && <a href={ingredient.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-[color:var(--aisle)] underline underline-offset-4">View ingredient source <ArrowUpRight className="size-3" aria-hidden="true" /></a>}
          <p>Ingredient presence does not establish concentration or results. These ingredients are not exclusive to Korean skincare.</p>
        </div>
      </details>
    </aside>
  );
}