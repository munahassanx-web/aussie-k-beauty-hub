import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import type { StripeEnv } from '@/lib/stripe.server';
import { inviteUrl, normaliseReferralCode, REFERRER_CREDIT_CENTS } from '@/lib/referrals';

function validEnv(env: unknown): StripeEnv {
  if (env !== 'sandbox' && env !== 'live') throw new Error('Invalid environment');
  return env;
}

export type MyReferral = {
  code: string;
  url: string;
  friendsOrdered: number;
  creditCents: number;
  spentCents: number;
};

/** The signed-in customer's share link and what it has earned so far. */
export const getMyReferral = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { environment: StripeEnv }) => ({ environment: validEnv(data.environment) }))
  .handler(async ({ data, context }): Promise<MyReferral> => {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { getOrCreateReferralCode, referralSummary } = await import('@/lib/referrals.server');
    const db = supabaseAdmin as any;
    const { data: profile } = await db
      .from('profiles')
      .select('display_name')
      .eq('id', context.userId)
      .maybeSingle();
    const code = await getOrCreateReferralCode(db, context.userId, profile?.display_name ?? null);
    const summary = await referralSummary(db, context.userId, data.environment);
    return { code, url: inviteUrl(code), ...summary };
  });

/** Public: is this invite code real, and whose is it (first name only). */
export const lookupInvite = createServerFn({ method: 'GET' })
  .inputValidator((data: { code: string }) => ({ code: normaliseReferralCode(data.code) }))
  .handler(async ({ data }): Promise<{ valid: boolean; firstName: string | null }> => {
    if (!data.code) return { valid: false, firstName: null };
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { findReferrer } = await import('@/lib/referrals.server');
    const referrer = await findReferrer(supabaseAdmin as any, data.code);
    return { valid: Boolean(referrer), firstName: referrer?.firstName ?? null };
  });

export type CheckoutReferralPreview = {
  friendDiscountCents: number;
  /** Why a stored invite won't apply, so the summary can say so plainly. */
  friendReason: 'invalid' | 'own_code' | 'not_first_order' | 'below_minimum' | null;
  creditCount: number;
  creditCents: number;
};

/**
 * Signed-in preview for the order summary. Display only: the checkout
 * session re-checks everything against the live basket and order history.
 */
export const previewCheckoutReferral = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { code?: string | null; subtotalCents: number; environment: StripeEnv }) => {
    if (!Number.isInteger(data.subtotalCents) || data.subtotalCents < 0) throw new Error('Invalid subtotal');
    return { code: data.code ?? null, subtotalCents: data.subtotalCents, environment: validEnv(data.environment) };
  })
  .handler(async ({ data, context }): Promise<CheckoutReferralPreview> => {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { resolveFriendReferral, earnedCreditIds } = await import('@/lib/referrals.server');
    const { creditsToApply } = await import('@/lib/referrals');
    const db = supabaseAdmin as any;
    const { data: userRes } = await context.supabase.auth.getUser();
    let friendDiscountCents = 0;
    let friendReason: CheckoutReferralPreview['friendReason'] = null;
    if (data.code) {
      const friend = await resolveFriendReferral(db, {
        code: data.code,
        buyerUserId: context.userId,
        buyerEmail: userRes.user?.email ?? null,
        env: data.environment,
        subtotalCents: data.subtotalCents,
      });
      if (friend.ok) friendDiscountCents = friend.discountCents;
      else friendReason = friend.reason;
    }
    const credits = await earnedCreditIds(db, context.userId, data.environment);
    const creditCount = creditsToApply(credits.length, data.subtotalCents, friendDiscountCents);
    return { friendDiscountCents, friendReason, creditCount, creditCents: creditCount * REFERRER_CREDIT_CENTS };
  });
