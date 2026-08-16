CREATE TABLE public.wishlist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);

GRANT SELECT, INSERT, DELETE ON public.wishlist_items TO authenticated;
GRANT ALL ON public.wishlist_items TO service_role;

ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own wishlist read" ON public.wishlist_items
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own wishlist insert" ON public.wishlist_items
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own wishlist delete" ON public.wishlist_items
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX wishlist_items_user_idx ON public.wishlist_items (user_id);