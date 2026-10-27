import type { CSSProperties } from "react";
import type { ShopProduct } from "@/lib/shop-catalog";
import type { GuideContent } from "@/lib/guide-content";
import { ROUTINE_LADDER, ladderIndexFor } from "@/lib/guide-content";
import { routineCompanions, ROUTINE_STEP_NAME, ROUTINE_STEP_NUMBER } from "@/lib/product-detail";
import { contentInPreparation, isPurchasable, productPrice } from "@/lib/shop-catalog";
import { productSize } from "@/components/product-card";
import { aisleKey, guideAisle, guideDirections } from "@/lib/guide-steps";

/** Everything the guide page needs, worked out once. */
export function guideView(product: ShopProduct, guide: GuideContent) {
  const aisle = guideAisle(product);
  const key = aisleKey(aisle);
  const directions = guideDirections(product);
  const ladderIndex = ladderIndexFor(product);
  const colours = {
    "--aisle": `var(--aisle-${key})`,
    "--aisle-deep": `var(--aisle-${key}-deep)`,
    "--art-ink": `var(--aisle-${key}-deep)`,
    "--art-fill": `var(--aisle-${key})`,
  } as CSSProperties;
  return {
    product,
    guide,
    aisle,
    colours,
    directions,
    ladder: ROUTINE_LADDER,
    ladderIndex,
    size: productSize(product),
    price: productPrice(product),
    /** Can this product be bought from the guide right now (stock aside)? */
    sellable: isPurchasable(product.priceId) && !contentInPreparation(product),
    /** One product per neighbouring routine step, as on the product page. */
    companions: routineCompanions(product)
      .filter((g) => g.products.length > 0)
      .map((g) => ({
        step: ROUTINE_STEP_NAME[g.stepLabel] ?? g.stepLabel,
        product: g.products[0]!,
      }))
      .slice(0, 3)
      .sort(
        (a, b) =>
          (ROUTINE_STEP_NUMBER[a.product.category] ?? 9) -
          (ROUTINE_STEP_NUMBER[b.product.category] ?? 9),
      ),
    /** Show the hands-or-pad choice only when the brand hasn't said which. */
    showToneChoice: product.category === "Tone" && !directions.fromBrand,
  };
}

export type GuideView = ReturnType<typeof guideView>;

export const GUIDE_CAUTION =
  "This guide gives general cosmetic-use guidance based on the product type and the product information available to us. Always follow the directions and warnings printed on the pack you received. Introduce new products gradually and stop use if significant irritation develops.";

export const GUIDE_SOURCING =
  "Skin Grocer sources through established Korean wholesale supply partners and stocks products locally in Melbourne. Incoming stock is documented through our batch-verification process.";
