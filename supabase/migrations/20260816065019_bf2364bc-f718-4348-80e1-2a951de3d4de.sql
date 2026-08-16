ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS customer_name text,
  ADD COLUMN IF NOT EXISTS verified_purchase boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS approved boolean NOT NULL DEFAULT false;

UPDATE public.reviews SET approved = true WHERE is_published = true;

DROP POLICY IF EXISTS "Anyone can read published reviews" ON public.reviews;
CREATE POLICY "Anyone can read approved reviews"
  ON public.reviews FOR SELECT
  TO anon, authenticated
  USING (approved = true);

DROP POLICY IF EXISTS "Users can write their own reviews" ON public.reviews;
CREATE POLICY "Users can write their own reviews"
  ON public.reviews FOR INSERT
  TO authenticated
  WITH CHECK (customer_id = auth.uid() AND approved = false AND rating BETWEEN 1 AND 5);

DROP POLICY IF EXISTS "Admins manage reviews" ON public.reviews;
CREATE POLICY "Admins manage reviews"
  ON public.reviews FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT SELECT ON public.reviews TO anon;
GRANT ALL ON public.reviews TO service_role;