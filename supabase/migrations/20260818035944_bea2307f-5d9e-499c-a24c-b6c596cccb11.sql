CREATE TABLE public.order_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('order_confirmation','dispatch','delivery')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','not_configured','queued','sent','failed','skipped')),
  provider text NOT NULL DEFAULT 'none',
  recipient_masked text,
  subject text,
  error text,
  attempts integer NOT NULL DEFAULT 0,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  sent_at timestamptz,
  UNIQUE (order_id, kind)
);

GRANT SELECT ON public.order_notifications TO authenticated;
GRANT ALL ON public.order_notifications TO service_role;

ALTER TABLE public.order_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Fulfilment staff can read order notifications"
ON public.order_notifications FOR SELECT TO authenticated
USING (public.is_fulfillment_staff(auth.uid()));

CREATE TRIGGER trg_order_notifications_updated
BEFORE UPDATE ON public.order_notifications
FOR EACH ROW EXECUTE FUNCTION public.tg_updated_at();

CREATE INDEX idx_order_notifications_order ON public.order_notifications(order_id);