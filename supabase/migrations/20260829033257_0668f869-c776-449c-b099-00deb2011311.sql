CREATE TABLE public.stock_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  email TEXT NOT NULL,
  name TEXT,
  product_brand TEXT,
  product_name TEXT NOT NULL,
  note TEXT,
  source TEXT NOT NULL DEFAULT 'shop_watchlist',
  confirmation_status TEXT NOT NULL DEFAULT 'pending',
  confirmation_error TEXT,
  confirmed_at TIMESTAMPTZ
);

GRANT INSERT ON public.stock_requests TO anon, authenticated;
GRANT ALL ON public.stock_requests TO service_role;

ALTER TABLE public.stock_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a stock request"
  ON public.stock_requests FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE INDEX stock_requests_created_at_idx ON public.stock_requests (created_at DESC);