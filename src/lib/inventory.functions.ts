import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { SHOP_PRODUCTS } from '@/lib/shop-catalog';
import { auditComposites, compositesBlockedBy, type CompositeAudit } from '@/lib/inventory-mapping';


/**
 * Single-warehouse inventory.
 *
 * Source of truth for stock is `public.inventory`, keyed by the catalog
 * `priceId` (the Stripe price lookup key stored on every order line), which is
 * the only stable SKU identifier shared by catalog, cart, Stripe and orders.
 *
 * Every mutation goes through a SECURITY DEFINER RPC that authorises via
 * `is_fulfillment_staff()` and writes an immutable `inventory_movements` row —
 * quantities are never edited directly from the client.
 *
 * Launch-safe default: a SKU with no opening count is treated as *untracked*
 * and stays purchasable. Only SKUs with a genuine opening count can go
 * out of stock.
 */

export const MOVEMENT_REASONS = [
  'initial_stock',
  'purchase_received',
  'sale',
  'return_to_stock',
  'manual_adjustment',
  'damage_writeoff',
] as const;
export type MovementReason = (typeof MOVEMENT_REASONS)[number];

export type InventoryStatus = 'not_counted' | 'out_of_stock' | 'low' | 'healthy' | 'untracked';

export type InventoryRow = {
  sku: string;
  name: string;
  brand: string;
  image: string;
  comingSoon: boolean;
  counted: boolean;
  trackInventory: boolean;
  onHand: number | null;
  lowStockThreshold: number;
  status: InventoryStatus;
  updatedAt: string | null;
};

export type InventoryMovement = {
  id: string;
  sku: string;
  delta: number;
  reason: MovementReason;
  note: string | null;
  orderId: string | null;
  resultingOnHand: number;
  actor: string | null;
  createdAt: string;
};

async function assertStaff(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc('is_fulfillment_staff', { _user_id: context.userId });
  if (error || data !== true) throw new Error('Unauthorized: fulfilment staff only');
}

function statusFor(row: { counted: boolean; trackInventory: boolean; onHand: number | null; lowStockThreshold: number }): InventoryStatus {
  if (!row.counted) return 'not_counted';
  if (!row.trackInventory) return 'untracked';
  const q = row.onHand ?? 0;
  if (q <= 0) return 'out_of_stock';
  if (q <= row.lowStockThreshold) return 'low';
  return 'healthy';
}

/** Full inventory board: every current catalog SKU, joined to its stock row. */
export const listInventory = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ rows: InventoryRow[]; counts: Record<string, number> }> => {
    await assertStaff(context);
    const { data, error } = await context.supabase
      .from('inventory')
      .select('sku, on_hand, low_stock_threshold, track_inventory, opening_stock_set_at, updated_at');
    if (error) throw new Error(error.message);

    const bySku = new Map<string, any>((data ?? []).map((r: any) => [r.sku, r]));
    const rows: InventoryRow[] = SHOP_PRODUCTS.map((p) => {
      const r = bySku.get(p.priceId);
      const base = {
        counted: Boolean(r?.opening_stock_set_at),
        trackInventory: r ? Boolean(r.track_inventory) : true,
        onHand: r ? Number(r.on_hand) : null,
        lowStockThreshold: r ? Number(r.low_stock_threshold) : 3,
      };
      return {
        sku: p.priceId,
        name: p.name,
        brand: p.brand,
        image: p.image,
        comingSoon: Boolean(p.comingSoon),
        ...base,
        status: statusFor(base),
        updatedAt: (r?.updated_at as string | null) ?? null,
      };
    });

    const counts: Record<string, number> = { all: rows.length };
    for (const r of rows) counts[r.status] = (counts[r.status] ?? 0) + 1;
    return { rows, counts };
  });

export const getInventoryHistory = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { sku: string }) => {
    if (!/^[a-z0-9_]+$/.test(data.sku)) throw new Error('Invalid sku');
    return data;
  })
  .handler(async ({ data, context }): Promise<InventoryMovement[]> => {
    await assertStaff(context);
    const { data: rows, error } = await context.supabase
      .from('inventory_movements')
      .select('id, sku, delta, reason, note, order_id, resulting_on_hand, actor, created_at')
      .eq('sku', data.sku)
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return (rows ?? []).map((r: any) => ({
      id: r.id,
      sku: r.sku,
      delta: Number(r.delta),
      reason: r.reason,
      note: r.note ?? null,
      orderId: r.order_id ?? null,
      resultingOnHand: Number(r.resulting_on_hand),
      actor: r.actor ?? null,
      createdAt: r.created_at,
    }));
  });

/** First real count for a SKU. Records an `initial_stock` movement. */
export const setOpeningStock = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { sku: string; quantity: number; lowStockThreshold?: number; note?: string }) => {
    if (!/^[a-z0-9_]+$/.test(data.sku)) throw new Error('Invalid sku');
    if (!Number.isInteger(data.quantity) || data.quantity < 0 || data.quantity > 100000) {
      throw new Error('Opening count must be a whole number between 0 and 100000');
    }
    if (
      data.lowStockThreshold !== undefined &&
      (!Number.isInteger(data.lowStockThreshold) || data.lowStockThreshold < 0 || data.lowStockThreshold > 1000)
    ) {
      throw new Error('Invalid low-stock threshold');
    }
    return data;
  })
  .handler(async ({ data, context }) => {
    await assertStaff(context);
    const product = SHOP_PRODUCTS.find((p) => p.priceId === data.sku);
    if (!product) throw new Error('Unknown SKU — not in the current catalog');
    const { data: onHand, error } = await context.supabase.rpc('set_opening_stock', {
      _sku: data.sku,
      _qty: data.quantity,
      _product_name: product.name,
      _brand: product.brand,
      _low_stock_threshold: data.lowStockThreshold ?? undefined,
      _note: data.note?.slice(0, 500) ?? undefined,
    });
    if (error) throw new Error(error.message);
    return { onHand: Number(onHand) };
  });

/** Receive / adjust / write-off / return-to-stock — always audited. */
export const adjustStock = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (data: {
      sku: string;
      delta: number;
      reason: 'purchase_received' | 'return_to_stock' | 'manual_adjustment' | 'damage_writeoff';
      note?: string;
      orderId?: string;
    }) => {
      if (!/^[a-z0-9_]+$/.test(data.sku)) throw new Error('Invalid sku');
      if (!Number.isInteger(data.delta) || data.delta === 0 || Math.abs(data.delta) > 100000) {
        throw new Error('Enter a non-zero whole quantity');
      }
      if (!['purchase_received', 'return_to_stock', 'manual_adjustment', 'damage_writeoff'].includes(data.reason)) {
        throw new Error('Invalid reason');
      }
      if ((data.reason === 'damage_writeoff' || data.reason === 'manual_adjustment') && !data.note?.trim()) {
        throw new Error('A short note is required for adjustments and write-offs');
      }
      if (data.orderId && !/^[0-9a-f-]{36}$/i.test(data.orderId)) throw new Error('Invalid orderId');
      return data;
    },
  )
  .handler(async ({ data, context }) => {
    await assertStaff(context);
    // Write-offs and returns are always signed by the caller's intent, not by
    // the sign the client happened to send.
    const delta =
      data.reason === 'damage_writeoff'
        ? -Math.abs(data.delta)
        : data.reason === 'purchase_received' || data.reason === 'return_to_stock'
          ? Math.abs(data.delta)
          : data.delta;

    const { data: onHand, error } = await context.supabase.rpc('apply_inventory_movement', {
      _sku: data.sku,
      _delta: delta,
      _reason: data.reason,
      _note: data.note?.slice(0, 500) ?? undefined,
      _order_id: data.orderId ?? undefined,
      _reference:
        data.reason === 'return_to_stock' && data.orderId ? `return:${data.orderId}:${data.sku}` : undefined,
    });
    if (error) throw new Error(error.message);
    return { onHand: Number(onHand) };
  });

export const setInventorySettings = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { sku: string; lowStockThreshold: number; trackInventory: boolean }) => {
    if (!/^[a-z0-9_]+$/.test(data.sku)) throw new Error('Invalid sku');
    if (!Number.isInteger(data.lowStockThreshold) || data.lowStockThreshold < 0 || data.lowStockThreshold > 1000) {
      throw new Error('Invalid low-stock threshold');
    }
    return data;
  })
  .handler(async ({ data, context }) => {
    await assertStaff(context);
    const { error } = await context.supabase.rpc('set_inventory_settings', {
      _sku: data.sku,
      _low_stock_threshold: data.lowStockThreshold,
      _track_inventory: data.trackInventory,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/**
 * Public availability. Returns only the SKUs that are genuinely sold out —
 * never quantities. Uninitialised SKUs are absent, so they stay purchasable.
 *
 * Composite sellables (bundles, Restock subscriptions) are appended when a
 * reliably mapped component with a real opening count cannot cover one unit.
 * Unmappable composites are never marked sold out here — they are flagged for
 * the warehouse instead.
 */
export const listSoldOutSkus = createServerFn({ method: 'GET' }).handler(async (): Promise<string[]> => {
  const { createClient } = await import('@supabase/supabase-js');
  const key = process.env['SUPABASE_PUBLISHABLE_KEY']!;
  const client = createClient(process.env['SUPABASE_URL']!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input: any, init: any) => {
        const h = new Headers(init?.headers);
        if (key.startsWith('sb_') && h.get('Authorization') === `Bearer ${key}`) h.delete('Authorization');
        h.set('apikey', key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
  const { data, error } = await client.rpc('sold_out_skus');
  if (error) return [];
  const skus = ((data ?? []) as Array<{ sku: string }>).map((r) => r.sku);
  return [...new Set([...skus, ...compositesBlockedBy(skus)])];
});

/** Composite mapping audit for the warehouse board. Staff only. */
export const listCompositeAudit = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<CompositeAudit[]> => {
    await assertStaff(context);
    return auditComposites();
  });

