// Server-only inventory helpers. Never imported by client code.
import { SHOP_PRODUCTS } from '@/lib/shop-catalog';
import { expandToComponentDemand } from '@/lib/inventory-mapping';

export type StockLine = { priceId: string; quantity: number };

function labelFor(sku: string): string {
  const p = SHOP_PRODUCTS.find((x) => x.priceId === sku);
  return p ? `${p.brand} ${p.name}` : sku;
}

/**
 * Blocks checkout for component SKUs that are genuinely out of stock or short.
 *
 * Cart lines are first expanded to physical component demand (bundles and
 * Restock subscriptions resolve to their component SKUs; a mixed cart
 * aggregates individual + bundle demand per SKU before checking).
 *
 * Only SKUs with a real opening count AND tracking enabled are enforced —
 * uncounted SKUs pass through untouched, so stock data can be entered
 * gradually without ever silently blocking a sale.
 */
export async function assertLinesInStock(lines: StockLine[]): Promise<void> {
  const { demand, unmapped } = expandToComponentDemand(lines);
  if (unmapped.length) {
    // Never guessed at, never silently skipped — logged for the attention list.
    console.warn('[inventory] unmapped composite at checkout', JSON.stringify(unmapped));
  }
  if (demand.length === 0) return;

  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
  const { data, error } = await supabaseAdmin
    .from('inventory')
    .select('sku, on_hand, track_inventory, opening_stock_set_at')
    .in('sku', demand.map((d) => d.sku));
  // A read failure must not block paying customers; stock is corrected by the
  // audited movement log, not by refusing orders on an infra blip.
  if (error || !data) return;

  const problems: string[] = [];
  for (const row of data) {
    if (!row.opening_stock_set_at || !row.track_inventory) continue;
    const wanted = demand.find((d) => d.sku === row.sku)?.quantity ?? 0;
    if (wanted <= 0) continue;
    const available = Number(row.on_hand ?? 0);
    if (available <= 0 || available < wanted) {
      const label = labelFor(row.sku);
      problems.push(available <= 0 ? `${label} is out of stock` : `${label}: only ${available} left`);
    }
  }
  if (problems.length) {
    throw new Error(`${problems.join('. ')}. Please update your bag and try again.`);
  }
}

/**
 * Decrements stock once per paid order, at component level.
 *
 * Order lines are expanded through the composite mapping and aggregated per
 * physical SKU, so a bundle x3 removes each component x3 and a cart holding
 * both the bundle and the same product individually produces exactly ONE
 * movement per SKU. The RPC keys each movement on `sale:<orderId>:<sku>`, so
 * Stripe webhook retries are no-ops and the aggregation keeps that reference
 * unique and complete.
 *
 * Lines that cannot be reliably mapped are never guessed at: they are reported
 * back so the caller can flag them for warehouse attention. A paid order is
 * never blocked.
 */
export async function recordOrderStockSale(
  orderId: string,
  lines: Array<{ lookupKey?: string | null; quantity?: number | null }>,
): Promise<{ unmapped: Array<{ priceId: string; quantity: number; reason: string }> }> {
  const { demand, unmapped } = expandToComponentDemand(
    lines
      .map((l) => ({ priceId: l.lookupKey ?? '', quantity: Number(l.quantity ?? 1) }))
      .filter((l) => l.priceId && l.quantity > 0),
  );

  if (unmapped.length) {
    console.error(
      '[inventory] paid order contains unmapped sellables — stock NOT decremented for these',
      orderId,
      JSON.stringify(unmapped),
    );
  }

  if (demand.length) {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { error } = await supabaseAdmin.rpc('record_order_stock_sale', {
      _order_id: orderId,
      _lines: demand.map((d) => ({ sku: d.sku, quantity: d.quantity })),
    });
    if (error) console.error('[inventory] stock sale not recorded', orderId, error.message);
  }

  return { unmapped: unmapped.map((u) => ({ priceId: u.priceId, quantity: u.quantity, reason: u.reason })) };
}
