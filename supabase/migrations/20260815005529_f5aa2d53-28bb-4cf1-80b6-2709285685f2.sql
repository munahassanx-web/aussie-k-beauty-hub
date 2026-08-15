CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) <= 100),
  email text NOT NULL CHECK (char_length(email) <= 255),
  topic text NOT NULL CHECK (topic IN ('Routine guidance', 'Order help', 'Vending machine partnerships', 'Something else')),
  message text NOT NULL CHECK (char_length(message) <= 2000),
  created_at timestamptz NOT NULL DEFAULT now(),
  source text NOT NULL DEFAULT 'website'
);

GRANT SELECT, INSERT ON public.contact_submissions TO authenticated;
GRANT ALL ON public.contact_submissions TO service_role;
GRANT INSERT ON public.contact_submissions TO anon;

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a contact form"
  ON public.contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Service role can read all submissions"
  ON public.contact_submissions
  FOR SELECT
  TO service_role
  USING (true);