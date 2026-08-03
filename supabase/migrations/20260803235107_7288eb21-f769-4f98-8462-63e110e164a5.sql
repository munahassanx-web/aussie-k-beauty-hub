CREATE TABLE public.products (
  id text PRIMARY KEY,
  brand text NOT NULL,
  name text NOT NULL,
  routine_step text NOT NULL,
  routine_order integer NOT NULL,
  amount_to_use text,
  how_to_apply text,
  frequency text,
  pro_tip text,
  pairs_well_with text[] NOT NULL DEFAULT '{}'::text[],
  suggested_bundle text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon, authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products readable by everyone" ON public.products FOR SELECT USING (true);
CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.tg_updated_at();

CREATE TABLE public.routine_bundles (
  id text PRIMARY KEY,
  name text NOT NULL,
  product_names text[] NOT NULL DEFAULT '{}'::text[],
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.routine_bundles TO anon, authenticated;
GRANT ALL ON public.routine_bundles TO service_role;
ALTER TABLE public.routine_bundles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "routine_bundles readable by everyone" ON public.routine_bundles FOR SELECT USING (true);
CREATE TRIGGER routine_bundles_updated_at BEFORE UPDATE ON public.routine_bundles FOR EACH ROW EXECUTE FUNCTION public.tg_updated_at();
