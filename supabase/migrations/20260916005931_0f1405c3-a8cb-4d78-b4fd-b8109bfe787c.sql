ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS title text,
  ADD COLUMN IF NOT EXISTS skin_type text,
  ADD COLUMN IF NOT EXISTS time_used text,
  ADD COLUMN IF NOT EXISTS order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS moderation_reason text,
  ADD COLUMN IF NOT EXISTS moderated_at timestamptz,
  ADD COLUMN IF NOT EXISTS moderated_by uuid,
  ADD COLUMN IF NOT EXISTS response_text text,
  ADD COLUMN IF NOT EXISTS response_at timestamptz,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

DO $$ BEGIN
  ALTER TABLE public.reviews ADD CONSTRAINT reviews_status_check
    CHECK (status IN ('pending','approved','rejected','removed'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.reviews ADD CONSTRAINT reviews_skin_type_check
    CHECK (skin_type IS NULL OR skin_type IN ('dry','oily','combination','balanced','unspecified'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.reviews ADD CONSTRAINT reviews_time_used_check
    CHECK (time_used IS NULL OR time_used IN ('first_impressions','under_2_weeks','2_6_weeks','over_6_weeks'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

UPDATE public.reviews SET status = CASE WHEN approved THEN 'approved' ELSE 'pending' END
WHERE status = 'pending' AND approved = true;

CREATE OR REPLACE FUNCTION public.sync_review_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.approved := (NEW.status = 'approved');
  NEW.is_published := (NEW.status = 'approved');
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS reviews_sync_status ON public.reviews;
CREATE TRIGGER reviews_sync_status
BEFORE INSERT OR UPDATE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.sync_review_status();

CREATE UNIQUE INDEX IF NOT EXISTS reviews_active_unique
  ON public.reviews (product_id, customer_id)
  WHERE status IN ('pending','approved');

CREATE INDEX IF NOT EXISTS reviews_product_status_idx ON public.reviews (product_id, status);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT SELECT ON public.reviews TO anon;
GRANT ALL ON public.reviews TO service_role;