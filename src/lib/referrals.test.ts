import { describe, expect, it } from 'vitest';
import {
  creditsToApply,
  firstNameOf,
  friendDiscountFor,
  makeReferralCode,
  normaliseReferralCode,
} from '@/lib/referrals';
import {
  isFirstOrder,
  resolveFriendReferral,
  reverseReferralsForRefund,
  settleReferralsForPaidOrder,
} from '@/lib/referrals.server';

// Minimal in-memory stand-in for the Supabase query builder: enough for
// select/insert/upsert/update with eq/in/ilike filters.
type Row = Record<string, any>;
function fakeDb(tables: Record<string, Row[]>) {
  const like = (pattern: string) =>
    new RegExp(
      '^' + pattern.replace(/\\([\\%_])|([%_])|([.*+?^${}()|[\]])/g, (_m, esc, wild, re) =>
        esc ? `\\${esc}` : wild === '%' ? '.*' : wild === '_' ? '.' : `\\${re}`,
      ) + '$',
      'i',
    );
  function query(table: string) {
    const rows = (tables[table] ??= []);
    const filters: Array<(r: Row) => boolean> = [];
    let op: { kind: 'select' } | { kind: 'update'; patch: Row } = { kind: 'select' };
    let limit = Infinity;
    const run = () => {
      const hit = rows.filter((r) => filters.every((f) => f(r))).slice(0, limit);
      if (op.kind === 'update') for (const r of hit) Object.assign(r, op.patch);
      return hit;
    };
    const builder: any = {
      select: () => builder,
      eq: (k: string, v: unknown) => (filters.push((r) => r[k] === v), builder),
      in: (k: string, vs: unknown[]) => (filters.push((r) => vs.includes(r[k])), builder),
      ilike: (k: string, p: string) => (filters.push((r) => typeof r[k] === 'string' && like(p).test(r[k])), builder),
      order: () => builder,
      limit: (n: number) => ((limit = n), builder),
      update: (patch: Row) => ((op = { kind: 'update', patch }), builder),
      maybeSingle: async () => ({ data: run()[0] ?? null, error: null }),
      then: (resolve: (v: unknown) => void) => resolve({ data: run(), error: null }),
      insert: async (row: Row) => {
        if (table === 'referral_codes' && rows.some((r) => r.code === row.code || r.user_id === row.user_id)) {
          return { error: { message: 'duplicate' } };
        }
        rows.push({ ...row });
        return { error: null };
      },
      upsert: async (row: Row, opts: { onConflict: string }) => {
        if (rows.some((r) => r[opts.onConflict] === row[opts.onConflict])) return { error: null };
        rows.push({ id: `00000000-0000-4000-8000-${String(rows.length).padStart(12, '0')}`, status: 'earned', ...row });
        return { error: null };
      },
    };
    return builder;
  }
  return { from: query, tables };
}

const MUNA = 'aaaaaaaa-0000-4000-8000-000000000001';
const FRIEND = 'bbbbbbbb-0000-4000-8000-000000000002';

function baseTables() {
  return {
    referral_codes: [{ user_id: MUNA, code: 'MUNA7K3Q' }],
    profiles: [
      { id: MUNA, email: 'muna@example.com', display_name: 'Muna Hassan' },
      { id: FRIEND, email: 'friend_one@example.com', display_name: 'Ava' },
    ],
    orders: [] as Row[],
    referrals: [] as Row[],
  };
}

describe('referral rules', () => {
  it('normalises codes and rejects junk', () => {
    expect(normaliseReferralCode(' muna7k3q ')).toBe('MUNA7K3Q');
    expect(normaliseReferralCode('MU-NA')).toBeNull();
    expect(normaliseReferralCode(42)).toBeNull();
  });

  it('builds a readable code from the first name', () => {
    expect(makeReferralCode('Muna Hassan', () => 0)).toBe('MUNAAAAA');
    expect(makeReferralCode('  ', () => 0.99)).toMatch(/^GLOW[A-Z2-9]{4}$/);
    expect(makeReferralCode('Zoë-Anne', () => 0)).toBe('ZOEAAAA');
  });

  it('gives the friend A$10 only from A$40', () => {
    expect(friendDiscountFor(3999)).toBe(0);
    expect(friendDiscountFor(4000)).toBe(1000);
  });

  it('spends whole A$10 credits without taking the order below A$1', () => {
    expect(creditsToApply(3, 2500)).toBe(2);
    expect(creditsToApply(3, 2500, 1000)).toBe(1);
    expect(creditsToApply(2, 1000)).toBe(0);
    expect(creditsToApply(30, 100000)).toBe(10);
  });

  it('shows a first name only', () => {
    expect(firstNameOf('Muna Hassan')).toBe('Muna');
    expect(firstNameOf('muna@example.com')).toBeNull();
    expect(firstNameOf(null)).toBeNull();
  });
});

describe('friend referral at checkout', () => {
  it('applies to a new customer with a A$40 basket', async () => {
    const db = fakeDb(baseTables());
    const result = await resolveFriendReferral(db, {
      code: 'muna7k3q',
      buyerUserId: FRIEND,
      buyerEmail: 'friend_one@example.com',
      env: 'live',
      subtotalCents: 4500,
    });
    expect(result).toEqual({ ok: true, code: 'MUNA7K3Q', referrerId: MUNA, discountCents: 1000 });
  });

  it('refuses the sharer’s own code, by account or by email', async () => {
    const db = fakeDb(baseTables());
    const byAccount = await resolveFriendReferral(db, {
      code: 'MUNA7K3Q', buyerUserId: MUNA, buyerEmail: null, env: 'live', subtotalCents: 9000,
    });
    const byEmail = await resolveFriendReferral(db, {
      code: 'MUNA7K3Q', buyerUserId: null, buyerEmail: 'MUNA@example.com', env: 'live', subtotalCents: 9000,
    });
    expect(byAccount).toEqual({ ok: false, reason: 'own_code' });
    expect(byEmail).toEqual({ ok: false, reason: 'own_code' });
  });

  it('refuses anyone who has already ordered, including as a guest', async () => {
    const tables = baseTables();
    tables.orders.push({ id: 'o1', guest_email: 'Friend_One@example.com', status: 'paid', environment: 'live' });
    const db = fakeDb(tables);
    expect(await isFirstOrder(db, { userId: FRIEND, email: 'friend_one@example.com' }, 'live')).toBe(false);
    // Sandbox test orders don't count against a live first order.
    expect(await isFirstOrder(db, { userId: FRIEND, email: 'friend_one@example.com' }, 'sandbox')).toBe(true);
  });

  it('treats "_" in an email literally', async () => {
    const tables = baseTables();
    tables.orders.push({ id: 'o1', guest_email: 'friendXone@example.com', status: 'paid', environment: 'live' });
    const db = fakeDb(tables);
    expect(await isFirstOrder(db, { userId: null, email: 'friend_one@example.com' }, 'live')).toBe(true);
  });

  it('a guest using an email whose account has ordered is not new', async () => {
    const tables = baseTables();
    tables.orders.push({ id: 'o1', user_id: FRIEND, status: 'refunded', environment: 'live' });
    const db = fakeDb(tables);
    const result = await resolveFriendReferral(db, {
      code: 'MUNA7K3Q', buyerUserId: null, buyerEmail: 'friend_one@example.com', env: 'live', subtotalCents: 9000,
    });
    expect(result).toEqual({ ok: false, reason: 'not_first_order' });
  });

  it('ignores unknown codes and small baskets', async () => {
    const db = fakeDb(baseTables());
    expect(
      await resolveFriendReferral(db, { code: 'NOPE1234', buyerEmail: null, env: 'live', subtotalCents: 9000 }),
    ).toEqual({ ok: false, reason: 'invalid' });
    expect(
      await resolveFriendReferral(db, { code: 'MUNA7K3Q', buyerEmail: null, env: 'live', subtotalCents: 3000 }),
    ).toEqual({ ok: false, reason: 'below_minimum' });
  });
});

describe('settling rewards from the webhook', () => {
  it('earns the sharer one credit per friend order, even on retries', async () => {
    const db = fakeDb(baseTables());
    const input = {
      orderId: 'order-friend',
      env: 'live' as const,
      buyerUserId: FRIEND,
      buyerEmail: 'Friend_One@example.com',
      metadata: { referrerId: MUNA, referralCode: 'MUNA7K3Q' },
    };
    await settleReferralsForPaidOrder(db, input);
    await settleReferralsForPaidOrder(db, input);
    expect(db.tables.referrals).toHaveLength(1);
    expect(db.tables.referrals[0]).toMatchObject({
      referrer_id: MUNA,
      status: 'earned',
      reward_cents: 1000,
      referred_email: 'friend_one@example.com',
    });
  });

  it('marks spent credits, only the buyer’s own', async () => {
    const tables = baseTables();
    const mine = '11111111-0000-4000-8000-000000000001';
    const someoneElses = '22222222-0000-4000-8000-000000000002';
    tables.referrals.push(
      { id: mine, referrer_id: MUNA, status: 'earned', environment: 'live', order_id: 'f1' },
      { id: someoneElses, referrer_id: FRIEND, status: 'earned', environment: 'live', order_id: 'f2' },
    );
    const db = fakeDb(tables);
    const outcome = await settleReferralsForPaidOrder(db, {
      orderId: 'muna-order',
      env: 'live',
      buyerUserId: MUNA,
      buyerEmail: 'muna@example.com',
      metadata: { referralCreditIds: `${mine},${someoneElses}` },
    });
    expect(outcome.redeemed).toBe(1);
    expect(tables.referrals.find((r) => r.id === mine)).toMatchObject({ status: 'redeemed', redeemed_order_id: 'muna-order' });
    expect(tables.referrals.find((r) => r.id === someoneElses)?.status).toBe('earned');
  });

  it('a full refund removes an unspent credit and returns a spent one', async () => {
    const tables = baseTables();
    tables.referrals.push(
      { id: 'r1', referrer_id: MUNA, status: 'earned', order_id: 'refunded-order' },
      { id: 'r2', referrer_id: MUNA, status: 'redeemed', order_id: 'f2', redeemed_order_id: 'refunded-order' },
      { id: 'r3', referrer_id: MUNA, status: 'redeemed', order_id: 'f3', redeemed_order_id: 'other' },
    );
    await reverseReferralsForRefund(fakeDb(tables), 'refunded-order');
    expect(tables.referrals.map((r) => r.status)).toEqual(['reversed', 'earned', 'redeemed']);
  });
});
