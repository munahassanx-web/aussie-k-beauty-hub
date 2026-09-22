ALTER TABLE public.ingredients
  ADD COLUMN IF NOT EXISTS evidence_reviewed_at TEXT NOT NULL DEFAULT 'Not yet reviewed',
  ADD COLUMN IF NOT EXISTS source_links TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS limitations TEXT,
  ADD COLUMN IF NOT EXISTS caution_notes TEXT;