/**
 * Composite → physical SKU mapping (single source of truth).
 *
 * A "composite" is any sellable Stripe price lookup key that is NOT itself one
 * physical warehouse SKU: the curated bundles, and the monthly Restock
 * subscription prices.
 *
 * Mapping evidence rules — deliberately strict, nothing is guessed:
 *  - Bundles: each `includes` label must resolve to EXACTLY ONE catalog product
 *    by exact normalised "BRAND Name" match. Fuzzy/marketing-name matching is
 *    never used here. Repeated labels increment quantity.
 *  - Restock subscriptions: mapped 1:1 from RESTOCK_PRICE_BY_PRODUCT, which is
 *    an explicit code-level mapping to the one-time SKU.
 *  - Circle membership prices ship no goods → classified `non_physical`.
 *  - Physical multi-item SKUs that the warehouse holds as one unit (trial kits,
 *    brand "special sets") are NOT composites: they are their own SKU.
 *
 * Anything that fails these rules is reported as `unmapped` and surfaced in the
 * admin inventory board — never silently skipped.
 */
import { SHOP_PRODUCTS, BUNDLE_DEFINITIONS, RESTOCK_PRICE_BY_PRODUCT } from '@/lib/shop-catalog';

export type ComponentDemand = { sku: string; quantity: number };

export type CompositeResolution =
  | { kind: 'physical'; sku: string }
  | { kind: 'composite'; components: ComponentDemand[] }
  | { kind: 'non_physical' }
  | { kind: 'unmapped'; reason: string; unresolvedLabels: string[] };

export const CIRCLE_PRICE_IDS = ['circle_monthly', 'circle_yearly'];

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

/** Exact-match only: a label must equal a catalog "BRAND Name". No fuzzy fallback. */
function strictCatalogSku(label: string): string | null {
  const n = norm(label);
  const hits = SHOP_PRODUCTS.filter((p) => norm(`${p.brand} ${p.name}`) === n);
  return hits.length === 1 ? hits[0].priceId : null;
}

function restockBaseSku(priceId: string): string | null {
  const entry = Object.entries(RESTOCK_PRICE_BY_PRODUCT).find(([, sub]) => sub === priceId);
  return entry ? entry[0] : null;
}

/** Resolves any sellable price id to what it actually removes from the shelf. */
export function resolveSellable(priceId: string): CompositeResolution {
  if (SHOP_PRODUCTS.some((p) => p.priceId === priceId)) return { kind: 'physical', sku: priceId };

  if (CIRCLE_PRICE_IDS.includes(priceId)) return { kind: 'non_physical' };

  const bundle = BUNDLE_DEFINITIONS.find((b) => b.priceId === priceId);
  if (bundle) {
    const counts = new Map<string, number>();
    const unresolved: string[] = [];
    for (const label of bundle.includes) {
      const sku = strictCatalogSku(label);
      if (!sku) unresolved.push(label);
      else counts.set(sku, (counts.get(sku) ?? 0) + 1);
    }
    if (unresolved.length) {
      return {
        kind: 'unmapped',
        reason: 'Bundle component label does not match exactly one catalog SKU',
        unresolvedLabels: unresolved,
      };
    }
    return { kind: 'composite', components: [...counts].map(([sku, quantity]) => ({ sku, quantity })) };
  }

  if (priceId.startsWith('restock_')) {
    const base = restockBaseSku(priceId);
    if (!base) {
      return {
        kind: 'unmapped',
        reason: 'Restock subscription price has no base SKU in RESTOCK_PRICE_BY_PRODUCT',
        unresolvedLabels: [priceId],
      };
    }
    return { kind: 'composite', components: [{ sku: base, quantity: 1 }] };
  }

  return { kind: 'unmapped', reason: 'Price id is not in the catalog', unresolvedLabels: [priceId] };
}

export type ExpandedDemand = {
  /** Aggregated component demand across the whole cart, one row per physical SKU. */
  demand: ComponentDemand[];
  /** Sellables that ship goods but could not be mapped to physical SKUs. */
  unmapped: Array<{ priceId: string; quantity: number; reason: string; unresolvedLabels: string[] }>;
};

/**
 * Expands a cart (or a paid order's lines) into aggregated physical-SKU demand.
 * Bundle x3 with A x1 + B x2 yields A x3 and B x6; an individual A x1 in the
 * same cart aggregates into A x4 — one row per SKU, which also keeps the
 * per-SKU idempotency reference unique per order.
 */
export function expandToComponentDemand(
  lines: Array<{ priceId: string; quantity: number }>,
): ExpandedDemand {
  const totals = new Map<string, number>();
  const unmapped: ExpandedDemand['unmapped'] = [];

  for (const line of lines) {
    const qty = Math.max(0, Math.trunc(Number(line.quantity) || 0));
    if (!line.priceId || qty <= 0) continue;
    const res = resolveSellable(line.priceId);
    if (res.kind === 'non_physical') continue;
    if (res.kind === 'physical') {
      totals.set(res.sku, (totals.get(res.sku) ?? 0) + qty);
    } else if (res.kind === 'composite') {
      for (const c of res.components) {
        totals.set(c.sku, (totals.get(c.sku) ?? 0) + c.quantity * qty);
      }
    } else {
      unmapped.push({
        priceId: line.priceId,
        quantity: qty,
        reason: res.reason,
        unresolvedLabels: res.unresolvedLabels,
      });
    }
  }

  return { demand: [...totals].map(([sku, quantity]) => ({ sku, quantity })), unmapped };
}

export type CompositeAudit = {
  priceId: string;
  name: string;
  type: 'bundle' | 'restock_subscription' | 'membership';
  status: 'mapped' | 'unmapped' | 'non_physical';
  components: ComponentDemand[];
  reason?: string;
  unresolvedLabels?: string[];
};

/** Deterministic audit of every composite sellable — powers the admin attention list. */
export function auditComposites(): CompositeAudit[] {
  const rows: CompositeAudit[] = [];

  for (const b of BUNDLE_DEFINITIONS) {
    const res = resolveSellable(b.priceId);
    rows.push({
      priceId: b.priceId,
      name: b.name,
      type: 'bundle',
      status: res.kind === 'composite' ? 'mapped' : 'unmapped',
      components: res.kind === 'composite' ? res.components : [],
      ...(res.kind === 'unmapped' ? { reason: res.reason, unresolvedLabels: res.unresolvedLabels } : {}),
    });
  }

  for (const [base, sub] of Object.entries(RESTOCK_PRICE_BY_PRODUCT)) {
    const product = SHOP_PRODUCTS.find((p) => p.priceId === base);
    const res = resolveSellable(sub);
    rows.push({
      priceId: sub,
      name: product ? `${product.brand} ${product.name} — monthly Restock` : sub,
      type: 'restock_subscription',
      status: res.kind === 'composite' ? 'mapped' : 'unmapped',
      components: res.kind === 'composite' ? res.components : [],
      ...(res.kind === 'unmapped' ? { reason: res.reason, unresolvedLabels: res.unresolvedLabels } : {}),
    });
  }

  for (const id of CIRCLE_PRICE_IDS) {
    rows.push({
      priceId: id,
      name: `Skin Grocer Circle (${id.replace('circle_', '')})`,
      type: 'membership',
      status: 'non_physical',
      components: [],
    });
  }

  return rows;
}

/** Composite price ids whose mapped components make one unit impossible to ship. */
export function compositesBlockedBy(soldOutSkus: Iterable<string>): string[] {
  const soldOut = new Set(soldOutSkus);
  if (soldOut.size === 0) return [];
  return auditComposites()
    .filter((c) => c.status === 'mapped' && c.components.some((comp) => soldOut.has(comp.sku)))
    .map((c) => c.priceId);
}
