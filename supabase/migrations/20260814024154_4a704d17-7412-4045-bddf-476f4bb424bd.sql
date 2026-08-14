CREATE TABLE public.newsletter_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'homepage',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX newsletter_subscribers_email_key
  ON public.newsletter_subscribers (lower(email));

GRANT INSERT ON public.newsletter_subscribers TO anon, authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe"
  ON public.newsletter_subscribers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    source = ANY (ARRAY['homepage'::text, 'footer'::text])
    AND length(email) BETWEEN 5 AND 255
    AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  );

CREATE POLICY "No client reads of subscribers"
  ON public.newsletter_subscribers
  FOR SELECT
  TO anon, authenticated
  USING (false);