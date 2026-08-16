ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS guest_email TEXT;
CREATE INDEX IF NOT EXISTS orders_guest_email_idx ON public.orders (lower(guest_email)) WHERE guest_email IS NOT NULL;
-- Guests can later claim their orders when they sign up with the same email.
CREATE OR REPLACE FUNCTION public.claim_guest_orders()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  claimed integer;
  email text;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN 0;
  END IF;
  SELECT u.email INTO email FROM auth.users u WHERE u.id = auth.uid();
  IF email IS NULL THEN
    RETURN 0;
  END IF;
  UPDATE public.orders
     SET user_id = auth.uid()
   WHERE user_id IS NULL
     AND guest_email IS NOT NULL
     AND lower(guest_email) = lower(email);
  GET DIAGNOSTICS claimed = ROW_COUNT;
  RETURN claimed;
END;
$$;
REVOKE ALL ON FUNCTION public.claim_guest_orders() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_guest_orders() TO authenticated;