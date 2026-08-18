// Maps genuine order lines onto the CURRENT catalog.
//
// Mapping precedence (never guess when a stable id exists):
//   1. `lookupKey` — the Stripe price lookup key the webhook now stores. This
//      is the catalog `priceId`, so the match is exact.
//   2. Loose brand+name match, used only for orders placed before lookup keys
//      were recorded. Lines that don't resolve are reported as `unmatched`
//      rather than silently substituted with a different SKU.
//
// Nothing here estimates when a product will run out — we hold purchase dates,
// not usage data, so "due to restock" is never claimed.

import { SHOP_PRODUCTS, isPurchasable, priceToCents, type ShopProduct } from '@/lib/shop-catalog';
import { matchProductByReference } from '@/lib/guide-content';
import type { AccountOrder, AccountOrderLine } from '@/lib/account.functions';

export type ResolvedLine = {
  line: AccountOrderLine;
  product: ShopProduct | null;
};

export function resolveLine(line: AccountOrderLine): ShopProduct | null {
  if (line.lookupKey) {
    const exact = SHOP_PRODUCTS.find((p) => p.priceId === line.lookupKey);
    if (exact) return exact;
    // A lookup key that isn't a current single SKU (a bundle or a Restock
    // subscription price) must not fall back to a fuzzy name match.
    return null;
  }
  return matchProductByReference(line.name) ?? null;
}

export function resolveOrderLines(order: AccountOrder): ResolvedLine[] {
  return order.lineItems.map((line) => ({ line, product: resolveLine(line) }));
}

export type PurchasedProduct = {
  product: ShopProduct;
  /** ISO timestamp of the most recent order containing this product. */
  lastPurchasedAt: string;
  lastOrderId: string;
  timesPurchased: number;
  /** Current catalog price in cents — never the historical price paid. */
  currentCents: number;
  purchasable: boolean;
};

/**
 * Distinct current-catalog products the customer has actually bought, newest
 * purchase first. Orders that never reached `paid` are excluded.
 */
export function purchasedProducts(orders: AccountOrder[]): {
  items: PurchasedProduct[];
  unmatchedLines: number;
} {
  const byPriceId = new Map<string, PurchasedProduct>();
  let unmatched = 0;

  for (const order of orders) {
    if (order.status !== 'paid') continue;
    for (const line of order.lineItems) {
      const product = resolveLine(line);
      if (!product) {
        unmatched += 1;
        continue;
      }
      const existing = byPriceId.get(product.priceId);
      if (existing) {
        existing.timesPurchased += 1;
        if (order.createdAt > existing.lastPurchasedAt) {
          existing.lastPurchasedAt = order.createdAt;
          existing.lastOrderId = order.id;
        }
        continue;
      }
      byPriceId.set(product.priceId, {
        product,
        lastPurchasedAt: order.createdAt,
        lastOrderId: order.id,
        timesPurchased: 1,
        currentCents: priceToCents(product.price),
        purchasable: isPurchasable(product.priceId) && !product.comingSoon,
      });
    }
  }

  return {
    items: [...byPriceId.values()].sort((a, b) => b.lastPurchasedAt.localeCompare(a.lastPurchasedAt)),
    unmatchedLines: unmatched,
  };
}

export function formatOrderDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** Short human reference for an order — the uuid's first block, uppercased. */
export function orderReference(id: string): string {
  return id.split('-')[0]?.toUpperCase() ?? id;
}

/**
 * Only the statuses the webhook actually writes are given a label. Anything
 * else is shown verbatim rather than dressed up as a fulfilment stage.
 */
export function fulfilmentLabel(order: AccountOrder): string | null {
  if (order.status !== 'paid') return 'Payment pending';
  switch (order.fulfillmentStatus) {
    case 'processing':
      return 'Paid — preparing for dispatch';
    case 'awaiting_payment':
      return 'Awaiting payment';
    case 'shipped':
      return 'Shipped';
    case 'delivered':
      return 'Delivered';
    case null:
    case undefined:
      return 'Paid';
    default:
      return order.fulfillmentStatus;
  }
}
