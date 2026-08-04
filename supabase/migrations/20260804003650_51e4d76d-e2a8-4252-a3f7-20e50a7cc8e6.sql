REVOKE SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES ON public.guide_views FROM anon, authenticated;
GRANT INSERT ON public.guide_views TO anon, authenticated;
GRANT ALL ON public.guide_views TO service_role;
ALTER TABLE public.guide_views ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "No client reads of guide analytics" ON public.guide_views;
CREATE POLICY "No client reads of guide analytics" ON public.guide_views FOR SELECT TO anon, authenticated USING (false);
COMMENT ON TABLE public.guide_views IS 'Write-only analytics log. Clients may only append rows; reads are restricted to trusted server-side/service-role access. Do not add a permissive SELECT policy.';