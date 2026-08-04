CREATE TABLE public.guide_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text NOT NULL,
  bundle_id text,
  source text NOT NULL DEFAULT 'web',
  referrer text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX guide_views_product_idx ON public.guide_views (product_id, created_at DESC);
CREATE INDEX guide_views_source_idx ON public.guide_views (source, created_at DESC);

GRANT INSERT ON public.guide_views TO anon, authenticated;
GRANT ALL ON public.guide_views TO service_role;

ALTER TABLE public.guide_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can record a guide view" ON public.guide_views
  FOR INSERT TO anon, authenticated
  WITH CHECK (source IN ('qr','web','email','routine'));