-- 1. Restrict direct execution of the signup-handling SECURITY DEFINER function.
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- has_role() must stay executable by authenticated because RLS policies invoke it
-- as the calling role; it is read-only and takes explicit arguments.
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

-- 2. Explicit storage policies for the private 'newsletter-covers' bucket.
DROP POLICY IF EXISTS "Admins can read newsletter covers" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload newsletter covers" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update newsletter covers" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete newsletter covers" ON storage.objects;

CREATE POLICY "Admins can read newsletter covers"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'newsletter-covers' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can upload newsletter covers"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'newsletter-covers' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update newsletter covers"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'newsletter-covers' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'newsletter-covers' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete newsletter covers"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'newsletter-covers' AND public.has_role(auth.uid(), 'admin'));