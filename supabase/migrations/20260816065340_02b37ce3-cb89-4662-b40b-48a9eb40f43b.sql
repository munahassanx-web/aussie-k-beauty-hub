DROP POLICY IF EXISTS "Users can write their own reviews" ON public.reviews;
CREATE POLICY "Users can write their own reviews"
  ON public.reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    customer_id = auth.uid()
    AND approved = false
    AND is_published = false
    AND verified_purchase = false
    AND rating BETWEEN 1 AND 5
  );