import { Sparkles, ArrowUpRight, Plus } from "lucide-react";
import { guideIngredient } from "@/lib/guide-ingredient";
import type { ShopProduct } from "@/lib/shop-catalog";
import centella from "@/assets/ingredients/tex-centella.jpg";
import niacinamide from "@/assets/ingredients/tex-niacinamide.jpg";
import propolis from "@/assets/ingredients/tex-propolis.webp";
import snail from "@/assets/ingredients/tex-snail-mucin.jpg";
import madecassoside from "@/assets/ingredients/tex-madecassoside.jpg";
import beta from "@/assets/ingredients/tex-beta-glucan.webp";

import hydration from "@/assets/ingredients/guide-hydration.jpg";
import emollient from "@/assets/ingredients/guide-emollient.jpg";
import mung from "@/assets/ingredients/guide-mung-bean.jpg";
import rice from "@/assets/ingredients/guide-rice.jpg";
import ginseng from "@/assets/ingredient-ginseng.webp";

const PHOTOS = {
  centella,
  niacinamide,
  propolis,
  snail,
  madecassoside,
  beta,
  hydration,
  emollient,
  mung,
  rice,
  ginseng,
};

export function IngredientSpotlight({ product }: { product: ShopProduct }) {
  const ingredient = guideIngredient(product);
  if (!ingredient) return null;
  const photo = ingredient.visual ? PHOTOS[ingredient.visual] : null;
  return (
    <aside
      aria-label="Ingredient spotlight"
      data-ingredient={ingredient.visual}
      className="guide-ingredient-play mx-5 mt-10 py-3 sm:mx-10"
    >
      <p className="mb-5 flex items-center gap-2 text-[13px] font-semibold text-[color:var(--aisle-deep)]">
        <Sparkles className="size-4" aria-hidden="true" /> A little ingredient gossip
      </p>
      <div className="grid grid-cols-[90px_minmax(0,1fr)] items-start gap-4 sm:grid-cols-[170px_minmax(0,1fr)] sm:gap-6">
        <figure className="pt-5">
          <img
            src={photo ?? hydration}
            alt={`Illustrative ingredient study: ${ingredient.name}; not the finished product`}
            loading="lazy"
            width={240}
            height={240}
            className="aspect-square w-full -rotate-6 rounded-[30%] object-cover"
          />
          <figcaption className="mt-3 text-center text-[10px] leading-snug text-muted-foreground">
            {ingredient.visual === "hydration" || ingredient.visual === "emollient"
              ? "Illustrative texture"
              : "Ingredient illustration"}
          </figcaption>
        </figure>
        <div className="min-w-0">
          <div className="ingredient-speech relative rounded-[24px_24px_24px_5px] bg-[color:var(--ingredient-bubble)] p-4 sm:p-6">
            <p className="relative mb-2 text-[11px] font-semibold uppercase text-[color:var(--aisle-deep)]">
              Did you know?
            </p>
            <h2 className="relative text-lg font-semibold leading-snug text-foreground sm:text-2xl">
              {ingredient.name}
            </h2>
            {ingredient.korean && (
              <p className="relative mt-1 break-words font-hangul text-xs text-[color:var(--aisle-deep)]">
                {ingredient.korean}
              </p>
            )}
            <p className="relative mt-3 text-sm leading-relaxed text-foreground">
              {ingredient.fact}
            </p>
          </div>
          {ingredient.culture && (
            <div className="ingredient-history relative mt-5 rounded-[22px_5px_22px_22px] bg-[color:var(--ingredient-pop)] p-4 text-[color:var(--ingredient-pop-ink)] sm:p-5">
              <p className="relative text-[11px] font-semibold uppercase">
                From the Joseon beauty diary…
              </p>
              <p className="relative mt-2 text-sm leading-relaxed">{ingredient.culture.text}</p>
            </div>
          )}
        </div>
      </div>
      <details className="group mt-7 border-t border-border pt-3 text-xs text-muted-foreground">
        <summary className="flex w-full cursor-pointer list-none items-center justify-between gap-4 rounded-sm py-1 font-medium text-foreground focus-visible:outline-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
          In this formula & source{" "}
          <Plus
            className="size-4 flex-none transition-transform group-open:rotate-45 motion-reduce:transition-none"
            aria-hidden="true"
          />
        </summary>
        <div className="mt-3 space-y-2 leading-relaxed">
          <p>Listed as: {ingredient.listedAs.join(", ")}.</p>
          <p>
            {ingredient.sourceName} · Ingredient record checked {ingredient.checkedOn}.
          </p>
          {ingredient.sourceNote && <p>{ingredient.sourceNote}</p>}
          {ingredient.sourceUrl && (
            <a
              href={ingredient.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-[color:var(--aisle-deep)] underline underline-offset-4"
            >
              View ingredient source <ArrowUpRight className="size-3" aria-hidden="true" />
            </a>
          )}
          {ingredient.culture && (
            <a
              href={ingredient.culture.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block font-medium text-[color:var(--aisle-deep)] underline underline-offset-4"
            >
              Culture source: {ingredient.culture.source}
            </a>
          )}
          <p>
            Ingredient presence does not establish concentration or results, and these ingredients
            are not exclusive to Korean skincare.
            {ingredient.culture &&
              " The history is a tradition, not proof of results or a DIY recipe."}
          </p>
        </div>
      </details>
    </aside>
  );
}
