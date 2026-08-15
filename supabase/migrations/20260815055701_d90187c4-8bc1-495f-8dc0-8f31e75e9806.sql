DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin','moderator','user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

DROP POLICY IF EXISTS "Users can read own roles" ON public.user_roles;
CREATE POLICY "Users can read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

CREATE TABLE IF NOT EXISTS public.signal_items (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  source_url text not null,
  title text not null,
  excerpt text,
  brand text,
  ingredient text,
  topic text,
  score numeric not null default 0,
  mentions integer not null default 1,
  published_at timestamptz,
  harvested_at timestamptz not null default now(),
  raw jsonb,
  unique (source, source_url)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.signal_items TO authenticated;
GRANT ALL ON public.signal_items TO service_role;
ALTER TABLE public.signal_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage signal items" ON public.signal_items
  FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE IF NOT EXISTS public.newsletter_drafts (
  id uuid primary key default gen_random_uuid(),
  issue_number text,
  slug text,
  title text not null,
  theme text,
  status text not null default 'draft',
  content jsonb not null default '{}'::jsonb,
  factcheck jsonb,
  cover_url text,
  source_signal_ids uuid[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  approved_at timestamptz
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.newsletter_drafts TO authenticated;
GRANT ALL ON public.newsletter_drafts TO service_role;
ALTER TABLE public.newsletter_drafts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage newsletter drafts" ON public.newsletter_drafts
  FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE INDEX IF NOT EXISTS signal_items_score_idx ON public.signal_items (score DESC, harvested_at DESC);
CREATE INDEX IF NOT EXISTS newsletter_drafts_status_idx ON public.newsletter_drafts (status, created_at DESC);