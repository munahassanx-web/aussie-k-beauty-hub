ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS photo_paths text[] NOT NULL DEFAULT '{}';

CREATE POLICY "Customers upload own review photos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'review-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Customers read own review photos"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'review-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Customers delete own review photos"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'review-photos' AND (storage.foldername(name))[1] = auth.uid()::text);