
-- Ingredients library
CREATE TABLE public.ingredients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_english text NOT NULL UNIQUE,
  name_korean text,
  name_chinese text,
  category text NOT NULL,
  what_it_does text NOT NULL,
  good_for text[] NOT NULL DEFAULT '{}',
  avoid_if text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.ingredients TO anon, authenticated;
GRANT ALL ON public.ingredients TO service_role;

ALTER TABLE public.ingredients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ingredients readable by everyone"
  ON public.ingredients FOR SELECT
  USING (true);

CREATE TRIGGER ingredients_updated_at
  BEFORE UPDATE ON public.ingredients
  FOR EACH ROW EXECUTE FUNCTION public.tg_updated_at();

-- Product ↔ ingredient join
-- Note: no products table exists yet; product_id stores the shop's product code
-- (matches the priceId strings in src/routes/shop.tsx) so this can link to a
-- future products table.
CREATE TABLE public.product_ingredients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text NOT NULL,
  ingredient_id uuid NOT NULL REFERENCES public.ingredients(id) ON DELETE CASCADE,
  is_hero_ingredient boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_id, ingredient_id)
);

CREATE INDEX product_ingredients_product_idx ON public.product_ingredients(product_id);
CREATE INDEX product_ingredients_ingredient_idx ON public.product_ingredients(ingredient_id);

GRANT SELECT ON public.product_ingredients TO anon, authenticated;
GRANT ALL ON public.product_ingredients TO service_role;

ALTER TABLE public.product_ingredients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "product_ingredients readable by everyone"
  ON public.product_ingredients FOR SELECT
  USING (true);

-- Seed 15 common K-beauty ingredients
INSERT INTO public.ingredients (name_english, name_korean, name_chinese, category, what_it_does, good_for, avoid_if) VALUES
('Centella Asiatica (Cica)', '병풀 추출물', '積雪草', 'soothing',
 'A calming plant extract that helps quiet redness and support skin as it heals from irritation or breakouts.',
 ARRAY['sensitivity','redness','acne','barrier repair'], ARRAY[]::text[]),
('Niacinamide', '나이아신아마이드', '菸鹼醯胺', 'brightening',
 'A form of vitamin B3 that helps even out skin tone, soften the look of pores and strengthen the skin over time.',
 ARRAY['dullness','pigmentation','large pores','oiliness'], ARRAY[]::text[]),
('Snail Mucin', '달팽이 점액 여과물', '蝸牛分泌濾液', 'barrier repair',
 'A slippery, protein-rich filtrate that deeply hydrates and helps skin bounce back from dryness and marks left by blemishes.',
 ARRAY['dehydration','post-blemish marks','barrier repair','dullness'], ARRAY[]::text[]),
('Propolis', '프로폴리스', '蜂膠', 'soothing',
 'A bee-made resin that adds a nourishing, slightly comforting layer to skin — great for calming and giving a healthy glow.',
 ARRAY['dryness','dullness','sensitivity'], ARRAY['bee allergy']),
('Heartleaf (Houttuynia Cordata)', '어성초', '魚腥草', 'soothing',
 'A gentle herbal extract that cools down heated, reactive skin and helps balance oil around breakouts.',
 ARRAY['redness','sensitivity','acne','oiliness'], ARRAY[]::text[]),
('Hyaluronic Acid', '히알루론산', '玻尿酸', 'hydrator',
 'A moisture magnet that pulls water into the skin so it feels plump, soft and less tight.',
 ARRAY['dehydration','fine lines','dullness'], ARRAY[]::text[]),
('PDRN', '피디알엔', 'PDRN', 'barrier repair',
 'A salmon-derived ingredient that supports the skin''s own repair process, helping tired or stressed skin look fresher.',
 ARRAY['dullness','fine lines','post-blemish marks','barrier repair'], ARRAY[]::text[]),
('Ceramides', '세라마이드', '神經醯胺', 'barrier repair',
 'Fat-like building blocks that live in your skin naturally — topping them up helps lock in moisture and keep irritation out.',
 ARRAY['dryness','sensitivity','barrier repair','eczema-prone skin'], ARRAY[]::text[]),
('Rice Extract', '쌀 추출물', '大米萃取', 'brightening',
 'A soft, milky extract that adds gentle hydration and a subtle glow, especially nice for dull or tired skin.',
 ARRAY['dullness','dehydration','uneven tone'], ARRAY[]::text[]),
('Green Tea Extract', '녹차 추출물', '綠茶萃取', 'soothing',
 'An antioxidant-rich extract that helps defend skin from daily stressors like pollution while calming visible redness.',
 ARRAY['sensitivity','oiliness','environmental stress','dullness'], ARRAY[]::text[]),
('Salicylic Acid (BHA)', '살리실산', '水楊酸', 'exfoliant',
 'An oil-loving exfoliant that gets inside pores to clear out gunk that leads to blackheads and breakouts.',
 ARRAY['acne','blackheads','oiliness','large pores'], ARRAY['very reactive skin','pregnancy']),
('Glycolic Acid (AHA)', '글리콜산', '甘醇酸', 'exfoliant',
 'A water-loving exfoliant that lifts away dull surface cells to reveal smoother, brighter skin underneath.',
 ARRAY['dullness','uneven texture','pigmentation','fine lines'], ARRAY['very reactive skin','compromised barrier']),
('Collagen', '콜라겐', '膠原蛋白', 'hydrator',
 'A large hydrating protein that sits on top of skin to smooth the surface and give an immediate soft, cushiony feel.',
 ARRAY['dehydration','fine lines','dullness'], ARRAY[]::text[]),
('Peptides', '펩타이드', '胜肽', 'anti-aging',
 'Tiny protein messengers that gently encourage skin to look firmer, bouncier and more even over time.',
 ARRAY['fine lines','loss of firmness','dullness'], ARRAY[]::text[]),
('Vitamin C', '비타민 C', '維他命 C', 'brightening',
 'A brightening antioxidant that helps fade dark spots, even out tone and add glow with regular use.',
 ARRAY['dullness','pigmentation','uneven tone','environmental stress'], ARRAY['very reactive skin']);
