import type { CSSProperties } from 'react';
import type { ShopProduct } from '@/lib/shop-catalog';
import type { GuideContent } from '@/lib/guide-content';
import { ROUTINE_LADDER, ladderIndexFor } from '@/lib/guide-content';
import { galleryFor } from '@/lib/product-detail';
import { productPrice } from '@/lib/shop-catalog';
import { productSize } from '@/components/product-card';
import { applyPhoto, aisleKey, guideAisle, guideDirections } from '@/lib/guide-steps';

/** Everything either guide layout needs, worked out once. */
export function guideView(product: ShopProduct, guide: GuideContent) {
  const aisle = guideAisle(product);
  const key = aisleKey(aisle);
  const directions = guideDirections(product);
  const ladderIndex = ladderIndexFor(product);
  const colours = {
    '--aisle': `var(--aisle-${key})`,
    '--aisle-deep': `var(--aisle-${key}-deep)`,
    '--art-ink': `var(--aisle-${key}-deep)`,
    '--art-fill': `var(--aisle-${key})`,
  } as CSSProperties;
  return {
    product,
    guide,
    aisle,
    colours,
    directions,
    ladder: ROUTINE_LADDER,
    ladderIndex,
    photo: applyPhoto(galleryFor(product)),
    size: productSize(product),
    price: productPrice(product),
    /** Show the hands-or-pad choice only when the brand hasn't said which. */
    showToneChoice: product.category === 'Tone' && !directions.fromBrand,
  };
}

export type GuideView = ReturnType<typeof guideView>;

export const GUIDE_CAUTION =
  'This guide gives general cosmetic-use guidance based on the product type and the product information available to us. Always follow the directions and warnings printed on the pack you received. Introduce new products gradually and stop use if significant irritation develops.';

export const GUIDE_SOURCING =
  'Skin Grocer sources through established Korean wholesale supply partners and stocks products locally in Melbourne. Incoming stock is documented through our batch-verification process.';
