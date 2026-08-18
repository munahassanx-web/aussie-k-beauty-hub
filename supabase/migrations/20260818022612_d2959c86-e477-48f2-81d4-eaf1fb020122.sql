ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS shipping_service text,
  ADD COLUMN IF NOT EXISTS shipment_id text,
  ADD COLUMN IF NOT EXISTS label_status text NOT NULL DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS label_url text,
  ADD COLUMN IF NOT EXISTS label_reference text,
  ADD COLUMN IF NOT EXISTS shipping_provider text NOT NULL DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS shipping_cost_actual_cents integer,
  ADD COLUMN IF NOT EXISTS dispatched_at timestamptz;

COMMENT ON COLUMN public.orders.label_status IS 'none | requested | ready | failed | void — set by a shipping provider adapter, manual workflow leaves it at none';
COMMENT ON COLUMN public.orders.shipping_provider IS 'manual | auspost_mypost | auspost_api | partner_<name> — which adapter produced the shipment';
COMMENT ON COLUMN public.orders.shipping_cost_actual_cents IS 'What the label actually cost the business, entered manually or returned by a provider';