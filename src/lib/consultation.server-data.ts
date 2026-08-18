// Catalogue context handed to the consultant model. Built straight from the
// live shop catalog so the AI can never reference a product we don't stock.

import { SHOP_PRODUCTS, isPurchasable } from '@/lib/shop-catalog';

export function consultantCatalogBlock(): string {
  return SHOP_PRODUCTS.filter((p) => isPurchasable(p.priceId))
    .map(
      (p) =>
        `- ${p.brand} ${p.name} (${p.price} AUD) | step: ${p.category} | tagged for: ${p.concerns.join(', ')}`,
    )
    .join('\n');
}
