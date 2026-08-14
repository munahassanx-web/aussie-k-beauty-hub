ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS shipping_name text,
  ADD COLUMN IF NOT EXISTS shipping_phone text,
  ADD COLUMN IF NOT EXISTS shipping_line1 text,
  ADD COLUMN IF NOT EXISTS shipping_line2 text,
  ADD COLUMN IF NOT EXISTS shipping_city text,
  ADD COLUMN IF NOT EXISTS shipping_state text,
  ADD COLUMN IF NOT EXISTS shipping_postcode text,
  ADD COLUMN IF NOT EXISTS shipping_country text,
  ADD COLUMN IF NOT EXISTS shipping_cents integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS shipping_method text,
  ADD COLUMN IF NOT EXISTS stripe_invoice_id text;

CREATE UNIQUE INDEX IF NOT EXISTS orders_stripe_session_id_key
  ON public.orders (stripe_session_id) WHERE stripe_session_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS orders_stripe_invoice_id_key
  ON public.orders (stripe_invoice_id) WHERE stripe_invoice_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS orders_user_created_idx
  ON public.orders (user_id, created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS points_ledger_order_reason_key
  ON public.points_ledger (order_id, reason) WHERE order_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS points_ledger_user_created_idx
  ON public.points_ledger (user_id, created_at DESC);