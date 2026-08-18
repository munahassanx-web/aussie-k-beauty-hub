// Account data reads. Everything returned here comes from rows the payments
// webhook actually wrote — nothing is inferred, estimated or invented.
//
// Truthfulness rules encoded here:
//  * Orders are read as the signed-in user through RLS (`requireSupabaseAuth`),
//    never through the admin client, so cross-user reads are impossible.
//  * `fulfillment_status` and `tracking_number` are surfaced only when the row
//    actually carries them. No fulfilment or delivery state is synthesised.
//  * No replenishment / "due to restock" timing is computed anywhere: we have
//    purchase dates, not usage data.

import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';

export type AccountOrderLine = {
  name: string;
  quantity: number;
  amountCents: number;
  /** Stripe price lookup key, stored on orders placed after Aug 2026. */
  lookupKey?: string | null;
};

export type AccountOrder = {
  id: string;
  createdAt: string;
  status: string;
  fulfillmentStatus: string | null;
  trackingNumber: string | null;
  amountCents: number;
  currency: string;
  isSubscriptionOrder: boolean;
  lineItems: AccountOrderLine[];
};

export type AccountOverview = {
  email: string | null;
  displayName: string | null;
  orders: AccountOrder[];
  /** Orders linked from a guest checkout to this account on sign-in. */
  claimedGuestOrders: number;
};

function toLine(raw: unknown): AccountOrderLine | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const name = typeof r['name'] === 'string' ? r['name'] : null;
  if (!name) return null;
  return {
    name,
    quantity: typeof r['quantity'] === 'number' ? r['quantity'] : 1,
    amountCents: typeof r['amountCents'] === 'number' ? r['amountCents'] : 0,
    lookupKey: typeof r['lookupKey'] === 'string' ? r['lookupKey'] : null,
  };
}

export const getAccountOverview = createServerFn({ method: 'GET' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AccountOverview> => {
    const { supabase, userId } = context;

    // Link any guest orders placed with this account's email before reading.
    const { data: claimed } = await supabase.rpc('claim_guest_orders');

    const [{ data: profile }, { data: orders }] = await Promise.all([
      supabase.from('profiles').select('email, display_name').eq('id', userId).maybeSingle(),
      supabase
        .from('orders')
        .select(
          'id, created_at, status, fulfillment_status, tracking_number, amount_cents, currency, is_subscription_order, line_items',
        )
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50),
    ]);

    return {
      email: (profile?.email as string | null) ?? null,
      displayName: (profile?.display_name as string | null) ?? null,
      claimedGuestOrders: typeof claimed === 'number' ? claimed : 0,
      orders: (orders ?? []).map((o) => ({
        id: o.id as string,
        createdAt: o.created_at as string,
        status: (o.status as string) ?? 'pending',
        fulfillmentStatus: (o.fulfillment_status as string | null) ?? null,
        trackingNumber: (o.tracking_number as string | null) ?? null,
        amountCents: (o.amount_cents as number) ?? 0,
        currency: ((o.currency as string) ?? 'aud').toUpperCase(),
        isSubscriptionOrder: Boolean(o.is_subscription_order),
        lineItems: (Array.isArray(o.line_items) ? o.line_items : [])
          .map(toLine)
          .filter((l): l is AccountOrderLine => l !== null),
      })),
    };
  });
