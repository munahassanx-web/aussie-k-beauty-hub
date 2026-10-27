// Refer a friend, server side. Every function takes the service-role client
// so the checkout, the webhook and the tests share one implementation.
//
// Rules:
//  * A friend's A$10 applies only to their first paid order, on a one-off
//    basket of at least A$40, and never with the sharer's own code or email.
//  * The sharer's A$10 credit is earned when the friend's order is paid, and
//    taken back if that order is fully refunded before the credit is spent.
//  * A credit spent on an order that is later fully refunded is given back.

import {
  FRIEND_DISCOUNT_CENTS,
  REFERRER_CREDIT_CENTS,
  firstNameOf,
  friendDiscountFor,
  makeReferralCode,
  normaliseReferralCode,
} from '@/lib/referrals';

type Db = any;
type Env = 'sandbox' | 'live';

/** Orders that count as "already a customer". Pending or failed checkouts don't. */
const COUNTED_STATUSES = ['paid', 'refunded', 'partially_refunded'];

/** Case-insensitive exact match: escape ilike wildcards (an email may contain "_"). */
function exactIlike(value: string): string {
  return value.replace(/[\\%_]/g, (c) => `\\${c}`);
}

export async function getOrCreateReferralCode(db: Db, userId: string, displayName: string | null): Promise<string> {
  const { data: existing } = await db.from('referral_codes').select('code').eq('user_id', userId).maybeSingle();
  if (existing?.code) return existing.code as string;
  for (let attempt = 0; attempt < 6; attempt++) {
    const code = makeReferralCode(displayName);
    const { error } = await db.from('referral_codes').insert({ user_id: userId, code });
    if (!error) return code;
    // A concurrent request may have created this user's code first.
    const { data: raced } = await db.from('referral_codes').select('code').eq('user_id', userId).maybeSingle();
    if (raced?.code) return raced.code as string;
  }
  throw new Error('Could not create a referral code');
}

export type Referrer = { userId: string; email: string | null; firstName: string | null };

export async function findReferrer(db: Db, rawCode: unknown): Promise<Referrer | null> {
  const code = normaliseReferralCode(rawCode);
  if (!code) return null;
  const { data: row } = await db.from('referral_codes').select('user_id').eq('code', code).maybeSingle();
  if (!row?.user_id) return null;
  const { data: profile } = await db
    .from('profiles')
    .select('email, display_name')
    .eq('id', row.user_id)
    .maybeSingle();
  return {
    userId: row.user_id as string,
    email: typeof profile?.email === 'string' ? profile.email.toLowerCase() : null,
    firstName: firstNameOf(profile?.display_name),
  };
}

/** True when neither this account nor this email has a paid order yet. */
export async function isFirstOrder(db: Db, buyer: { userId?: string | null; email: string | null }, env: Env) {
  if (buyer.userId) {
    const { data } = await db
      .from('orders')
      .select('id')
      .eq('user_id', buyer.userId)
      .eq('environment', env)
      .in('status', COUNTED_STATUSES)
      .limit(1);
    if (data?.length) return false;
  }
  if (buyer.email) {
    const email = buyer.email.toLowerCase();
    const { data: guest } = await db
      .from('orders')
      .select('id')
      .ilike('guest_email', exactIlike(email))
      .eq('environment', env)
      .in('status', COUNTED_STATUSES)
      .limit(1);
    if (guest?.length) return false;
    // An account with this email that has ordered, while the buyer checks out as a guest.
    if (!buyer.userId) {
      const { data: profile } = await db.from('profiles').select('id').ilike('email', exactIlike(email)).maybeSingle();
      if (profile?.id) return isFirstOrder(db, { userId: profile.id as string, email: null }, env);
    }
  }
  return true;
}

export type FriendReferral =
  | { ok: true; code: string; referrerId: string; discountCents: number }
  | { ok: false; reason: 'invalid' | 'own_code' | 'not_first_order' | 'below_minimum' };

export async function resolveFriendReferral(
  db: Db,
  input: { code: unknown; buyerUserId?: string | null; buyerEmail: string | null; env: Env; subtotalCents: number },
): Promise<FriendReferral> {
  const code = normaliseReferralCode(input.code);
  const referrer = code ? await findReferrer(db, code) : null;
  if (!code || !referrer) return { ok: false, reason: 'invalid' };
  const buyerEmail = input.buyerEmail?.toLowerCase() ?? null;
  if (referrer.userId === input.buyerUserId || (buyerEmail && referrer.email === buyerEmail)) {
    return { ok: false, reason: 'own_code' };
  }
  const discountCents = friendDiscountFor(input.subtotalCents);
  if (!discountCents) return { ok: false, reason: 'below_minimum' };
  if (!(await isFirstOrder(db, { userId: input.buyerUserId, email: buyerEmail }, input.env))) {
    return { ok: false, reason: 'not_first_order' };
  }
  return { ok: true, code, referrerId: referrer.userId, discountCents };
}

/** Ids of this person's earned, unspent A$10 credits, oldest first. */
export async function earnedCreditIds(db: Db, userId: string, env: Env): Promise<string[]> {
  const { data } = await db
    .from('referrals')
    .select('id')
    .eq('referrer_id', userId)
    .eq('environment', env)
    .eq('status', 'earned')
    .order('created_at', { ascending: true })
    .limit(20);
  return (data ?? []).map((r: { id: string }) => r.id);
}

export type ReferralSummary = { friendsOrdered: number; creditCents: number; spentCents: number };

export async function referralSummary(db: Db, userId: string, env: Env): Promise<ReferralSummary> {
  const { data } = await db
    .from('referrals')
    .select('status, reward_cents')
    .eq('referrer_id', userId)
    .eq('environment', env);
  const rows = (data ?? []) as Array<{ status: string; reward_cents: number }>;
  const sum = (status: string) => rows.filter((r) => r.status === status).reduce((s, r) => s + r.reward_cents, 0);
  return {
    friendsOrdered: rows.filter((r) => r.status !== 'reversed').length,
    creditCents: sum('earned'),
    spentCents: sum('redeemed'),
  };
}

/**
 * Called by the webhook once a checkout is paid. Records the friend's order
 * (earning the sharer's credit) and marks any credits this order spent.
 * Unique order_id keeps Stripe retries from earning twice.
 */
export async function settleReferralsForPaidOrder(
  db: Db,
  input: {
    orderId: string;
    env: Env;
    buyerUserId: string | null;
    buyerEmail: string | null;
    metadata: Record<string, string | undefined> | null | undefined;
  },
): Promise<{ earned: boolean; redeemed: number }> {
  const meta = input.metadata ?? {};
  let earned = false;
  const referrerId = meta['referrerId'];
  const code = normaliseReferralCode(meta['referralCode']);
  if (referrerId && code && referrerId !== input.buyerUserId) {
    const { error } = await db.from('referrals').upsert(
      {
        referrer_id: referrerId,
        code,
        order_id: input.orderId,
        referred_user_id: input.buyerUserId,
        referred_email: input.buyerEmail?.toLowerCase() ?? null,
        friend_discount_cents: FRIEND_DISCOUNT_CENTS,
        reward_cents: REFERRER_CREDIT_CENTS,
        environment: input.env,
      },
      { onConflict: 'order_id', ignoreDuplicates: true },
    );
    earned = !error;
  }

  let redeemed = 0;
  const creditIds = (meta['referralCreditIds'] ?? '').split(',').filter((id) => /^[0-9a-f-]{36}$/.test(id));
  if (creditIds.length && input.buyerUserId) {
    const { data } = await db
      .from('referrals')
      .update({ status: 'redeemed', redeemed_order_id: input.orderId, updated_at: new Date().toISOString() })
      .in('id', creditIds)
      .eq('referrer_id', input.buyerUserId)
      .eq('status', 'earned')
      .select('id');
    redeemed = data?.length ?? 0;
  }
  return { earned, redeemed };
}

/** Full refund: take back an unspent credit this order earned; give back credits it spent. */
export async function reverseReferralsForRefund(db: Db, orderId: string): Promise<void> {
  const now = new Date().toISOString();
  await db
    .from('referrals')
    .update({ status: 'reversed', updated_at: now })
    .eq('order_id', orderId)
    .eq('status', 'earned');
  await db
    .from('referrals')
    .update({ status: 'earned', redeemed_order_id: null, updated_at: now })
    .eq('redeemed_order_id', orderId)
    .eq('status', 'redeemed');
}
