-- Operational fulfilment fields on orders
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS shipping_carrier text,
  ADD COLUMN IF NOT EXISTS packed_at timestamptz,
  ADD COLUMN IF NOT EXISTS shipped_at timestamptz,
  ADD COLUMN IF NOT EXISTS fulfillment_updated_at timestamptz,
  ADD COLUMN IF NOT EXISTS fulfillment_updated_by uuid,
  ADD COLUMN IF NOT EXISTS ops_notes text;

DROP TRIGGER IF EXISTS trg_orders_updated ON public.orders;
CREATE TRIGGER trg_orders_updated BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.tg_updated_at();

-- Fulfilment staff = admin or moderator (warehouse role), least privilege:
-- read orders and update fulfilment only. No insert/delete.
CREATE OR REPLACE FUNCTION public.is_fulfillment_staff(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin','moderator')
  )
$$;

DROP POLICY IF EXISTS "staff read orders" ON public.orders;
CREATE POLICY "staff read orders" ON public.orders
  FOR SELECT TO authenticated
  USING (public.is_fulfillment_staff(auth.uid()));

DROP POLICY IF EXISTS "staff update order fulfilment" ON public.orders;
CREATE POLICY "staff update order fulfilment" ON public.orders
  FOR UPDATE TO authenticated
  USING (public.is_fulfillment_staff(auth.uid()))
  WITH CHECK (public.is_fulfillment_staff(auth.uid()));

GRANT SELECT, UPDATE ON public.orders TO authenticated;

-- Staff need the account holder's email for order contact
DROP POLICY IF EXISTS "staff read profiles" ON public.profiles;
CREATE POLICY "staff read profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (public.is_fulfillment_staff(auth.uid()));