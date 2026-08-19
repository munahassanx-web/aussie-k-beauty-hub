ALTER TABLE public.order_notifications DROP CONSTRAINT IF EXISTS order_notifications_kind_check;
ALTER TABLE public.order_notifications ADD CONSTRAINT order_notifications_kind_check
  CHECK (kind = ANY (ARRAY['order_confirmation','dispatch','delivery','cancellation']));