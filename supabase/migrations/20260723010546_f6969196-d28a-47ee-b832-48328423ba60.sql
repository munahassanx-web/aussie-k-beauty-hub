
-- Fix search_path on trigger function
CREATE OR REPLACE FUNCTION public.tg_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- Replace get_points_balance with a no-arg version that always uses auth.uid()
DROP FUNCTION IF EXISTS public.get_points_balance(UUID);
REVOKE ALL ON FUNCTION public.tg_updated_at() FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.my_points_balance()
RETURNS INTEGER
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(SUM(delta), 0)::INTEGER FROM public.points_ledger WHERE user_id = auth.uid();
$$;
REVOKE ALL ON FUNCTION public.my_points_balance() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.my_points_balance() TO authenticated;

-- Lock down the signup trigger function (only invoked by trigger, not API)
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
