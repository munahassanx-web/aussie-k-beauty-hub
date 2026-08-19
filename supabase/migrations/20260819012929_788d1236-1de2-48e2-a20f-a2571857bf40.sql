ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_fulfillment_status_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_fulfillment_status_check
  CHECK (fulfillment_status = ANY (ARRAY['processing','packed','shipped','dispatched','delivered','cancelled']));
GRANT UPDATE (cancelled_at, delivered_at) ON public.orders TO authenticated;