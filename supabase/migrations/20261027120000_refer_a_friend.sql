-- Refer a friend: one shareable code per account, and one row per friend's
-- first paid order (the sharer's A$10 credit). Written only by the server
-- (service role); customers read their own code and see totals via server code.

CREATE TABLE IF NOT EXISTS public.referral_codes (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE CHECK (code ~ '^[A-Z0-9]{4,16}$'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  -- The friend's first order. Unique, so webhook retries never earn twice.
  order_id UUID NOT NULL UNIQUE REFERENCES public.orders(id) ON DELETE CASCADE,
  referred_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  referred_email TEXT,
  friend_discount_cents INTEGER NOT NULL DEFAULT 1000,
  reward_cents INTEGER NOT NULL DEFAULT 1000,
  status TEXT NOT NULL DEFAULT 'earned' CHECK (status IN ('earned', 'redeemed', 'reversed')),
  redeemed_order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  environment TEXT NOT NULL DEFAULT 'live',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS referrals_referrer_status_idx ON public.referrals (referrer_id, environment, status);
CREATE INDEX IF NOT EXISTS referrals_redeemed_order_idx ON public.referrals (redeemed_order_id);

ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.referral_codes TO authenticated;
GRANT ALL ON public.referral_codes TO service_role;
GRANT ALL ON public.referrals TO service_role;

DROP POLICY IF EXISTS "own referral code read" ON public.referral_codes;
CREATE POLICY "own referral code read" ON public.referral_codes
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
-- No customer policy on referrals: rows hold the friend's email, so the
-- account page reads only counts and totals through the server.
