// Server-only inventory helpers. Never imported by client code.
import { SHOP_PRODUCTS } from '@/lib/shop-catalog';

export type StockLine = { priceId: string; quantity: number };

/**
 * Blocks checkout for SKUs that are genuinely out of stock or short.
 *
 * Only SKUs with a real opening count AND tracking enabled are enforced —
 * uncounted SKUs (and bundle/subscription price ids that aren't single SKUs)
 * pass through untouched, so stock data can be entered gradually without ever
 * silently blocking a sale.
 */
export async function assertLinesInStock(lines: StockLine[]): Promise<void> {
  const skus = lines.map((l) => l.priceId);
  if (skus.length === 0) return;
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
  const { data, error } = await supabaseAdmin
    .from('inventory')
    .select('sku, on_hand, track_inventory, opening_stock_set_at')
    .in('sku', skus);
  // A read failure must not block paying customers; stock is corrected by the
  // audited movement log, not by refusing orders on an infra blip.
  if (error || !data) return;

  const problems: string[] = [];
  for (const row of data) {
    if (!row.opening_stock_set_at || !row.track_inventory) continue;
    const wanted = lines.filter((l) => l.priceId === row.sku).reduce((s, l) => s + l.quantity, 0);
    const available = Number(row.on_hand ?? 0);
    if (available <= 0 || available < wanted) {
      const product = SHOP_PRODUCTS.find((p) => p.priceId === row.sku);
      const label = product ? `${product.brand} ${product.name}` : row.sku;
      problems.push(available <= 0 ? `${label} is out of stock` : `${label}: only ${available} left`);
    }
  }
  if (problems.length) {
    throw new Error(`${problems.join('. ')}. Please update your bag and try again.`);
  }
}

/**
 * Decrements stock once per paid order line. Idempotent: the RPC keys each
 * movement on `order:<orderId>:<sku>` so Stripe webhook retries are no-ops.
 * Lines whose lookup key isn't a tracked SKU (bundles, subscriptions) are
 * skipped rather than guessed at.
 */
export async function recordOrderStockSale(
  orderId: string,
  lines: Array<{ lookupKey?: string | null; quantity?: number | null }>,
): Promise<void> {
  const payload = lines
    .map((l) => ({ sku: l.lookupKey ?? '', quantity: Number(l.quantity ?? 1) }))
    .filter((l) => l.sku && l.quantity > 0);
  if (!payload.length) return;
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
  const { error } = await supabaseAdmin.rpc('record_order_stock_sale', {
    _order_id: orderId,
    _lines: payload,
  });
  if (error) console.error('[inventory] stock sale not recorded', orderId, error.message);
}
