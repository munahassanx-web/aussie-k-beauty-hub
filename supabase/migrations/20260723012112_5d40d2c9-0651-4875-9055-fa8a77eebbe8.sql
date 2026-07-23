
-- Order status tracking
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS fulfillment_status text NOT NULL DEFAULT 'processing',
  ADD COLUMN IF NOT EXISTS tracking_number text,
  ADD COLUMN IF NOT EXISTS points_earned integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS points_redeemed integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS discount_cents integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS line_items jsonb;

ALTER TABLE public.orders
  DROP CONSTRAINT IF EXISTS orders_fulfillment_status_check;
ALTER TABLE public.orders
  ADD CONSTRAINT orders_fulfillment_status_check
  CHECK (fulfillment_status IN ('processing','dispatched','delivered','cancelled'));

-- Idempotency for points earned per order
CREATE UNIQUE INDEX IF NOT EXISTS points_ledger_order_earn_unique
  ON public.points_ledger (order_id)
  WHERE reason = 'order_earn';

-- Idempotency for redemption per order
CREATE UNIQUE INDEX IF NOT EXISTS points_ledger_order_redeem_unique
  ON public.points_ledger (order_id)
  WHERE reason = 'redeem';
