-- Reviews
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id text not null,
  customer_id uuid references auth.users(id) on delete set null,
  rating int not null check (rating between 1 and 5),
  review_text text,
  sentiment_score numeric(3,2),
  tags text[] not null default '{}',
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);
grant select, insert on public.reviews to authenticated;
grant select on public.reviews to anon;
grant all on public.reviews to service_role;
alter table public.reviews enable row level security;
create index if not exists idx_reviews_created_at on public.reviews(created_at);
create index if not exists idx_reviews_product_id on public.reviews(product_id);
create policy "Anyone can read published reviews" on public.reviews for select using (is_published = true);
create policy "Users can read their own reviews" on public.reviews for select to authenticated using (customer_id = auth.uid());
create policy "Users can write their own reviews" on public.reviews for insert to authenticated with check (customer_id = auth.uid());

-- Quiz responses
create table if not exists public.quiz_responses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references auth.users(id) on delete set null,
  email text,
  source text not null default 'pre_launch',
  skin_type text,
  skin_concerns text[] not null default '{}',
  current_routine_gaps text[] not null default '{}',
  budget_band text,
  recommended_products text[] not null default '{}',
  marketing_consent boolean not null default false,
  created_at timestamptz not null default now()
);
grant insert on public.quiz_responses to anon;
grant select, insert on public.quiz_responses to authenticated;
grant all on public.quiz_responses to service_role;
alter table public.quiz_responses enable row level security;
create unique index if not exists idx_quiz_email on public.quiz_responses(email) where customer_id is null;
create index if not exists idx_quiz_created_at on public.quiz_responses(created_at);
create policy "Anyone can submit a quiz response" on public.quiz_responses for insert to anon, authenticated with check (true);
create policy "Users can read their own quiz responses" on public.quiz_responses for select to authenticated using (customer_id = auth.uid());

-- Support signals (internal only)
create table if not exists public.support_signals (
  id uuid primary key default gen_random_uuid(),
  theme text not null,
  frequency int not null default 1,
  week_starting date not null,
  created_at timestamptz not null default now()
);
grant all on public.support_signals to service_role;
alter table public.support_signals enable row level security;

-- Newsletter log (internal only)
create table if not exists public.newsletter_log (
  id uuid primary key default gen_random_uuid(),
  send_date date not null,
  theme text not null,
  topic text not null,
  subject_line text,
  created_at timestamptz not null default now()
);
grant all on public.newsletter_log to service_role;
alter table public.newsletter_log enable row level security;