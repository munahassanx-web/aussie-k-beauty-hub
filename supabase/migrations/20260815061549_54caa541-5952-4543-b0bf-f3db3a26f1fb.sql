ALTER TABLE public.newsletter_drafts
  ADD COLUMN IF NOT EXISTS cover_url text,
  ADD COLUMN IF NOT EXISTS cover_alt text,
  ADD COLUMN IF NOT EXISTS published_at timestamptz;

GRANT SELECT ON public.newsletter_drafts TO anon;

DROP POLICY IF EXISTS "Published issues are public" ON public.newsletter_drafts;
CREATE POLICY "Published issues are public"
ON public.newsletter_drafts
FOR SELECT
TO anon, authenticated
USING (status = 'published');