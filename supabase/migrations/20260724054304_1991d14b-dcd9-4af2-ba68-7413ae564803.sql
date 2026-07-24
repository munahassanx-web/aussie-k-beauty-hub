
ALTER TABLE public.ingredients
  ADD COLUMN IF NOT EXISTS how_to_use TEXT,
  ADD COLUMN IF NOT EXISTS pairs_well_with TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS avoid_pairing_with TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS science_note TEXT,
  ADD COLUMN IF NOT EXISTS common_myth TEXT,
  ADD COLUMN IF NOT EXISTS also_known_as TEXT[] NOT NULL DEFAULT '{}';

UPDATE public.ingredients SET
  how_to_use = 'Apply a pea-sized amount to clean, dry skin morning and/or evening after toner and before moisturiser. Start 2–3 nights a week and build up as your skin tolerates it.',
  pairs_well_with = ARRAY['Hyaluronic Acid','Ceramides','Panthenol'],
  avoid_pairing_with = ARRAY['Strong AHAs on the same night','High-strength Vitamin C'],
  science_note = 'A soothing plant extract rich in madecassoside and asiaticoside — compounds studied for calming redness and supporting the skin barrier after irritation.',
  common_myth = 'It is not a "steroid alternative." It calms redness gently over weeks, not overnight.',
  also_known_as = ARRAY['Cica','Tiger grass','Gotu kola']
WHERE name_english = 'Centella Asiatica (Cica)';

UPDATE public.ingredients SET
  how_to_use = 'Use morning and night after cleansing and toning. Safe daily at 2–5%. Higher percentages (10%+) can trigger flushing in sensitive skin — start lower.',
  pairs_well_with = ARRAY['Hyaluronic Acid','Peptides','Zinc','Retinol'],
  avoid_pairing_with = ARRAY['High-strength L-Ascorbic Acid at the same step'],
  science_note = 'A form of Vitamin B3 that helps regulate oil, fade post-blemish marks, and strengthen the skin barrier by supporting ceramide production.',
  common_myth = 'It does not "shrink pores" permanently — it reduces oil so pores look less stretched.',
  also_known_as = ARRAY['Vitamin B3','Nicotinamide']
WHERE name_english = 'Niacinamide';

UPDATE public.ingredients SET
  how_to_use = 'Apply a few drops to damp skin after toner, before heavier serums. Best used AM and PM. Layer under moisturiser to lock hydration in.',
  pairs_well_with = ARRAY['Hyaluronic Acid','Peptides','Niacinamide'],
  avoid_pairing_with = ARRAY['Strong exfoliating acids in the same layer'],
  science_note = 'Filtered secretion rich in glycoproteins, hyaluronic acid and peptides — studied for supporting skin repair and hydration.',
  common_myth = 'It is not "slug slime" scraped off snails; reputable Korean labs collect it ethically without harming the animal.',
  also_known_as = ARRAY['Snail Secretion Filtrate','SSF']
WHERE name_english = 'Snail Mucin';

UPDATE public.ingredients SET
  how_to_use = 'Layer a serum or ampoule under moisturiser AM and PM. Great during seasonal change when skin looks dull or feels reactive.',
  pairs_well_with = ARRAY['Niacinamide','Vitamin C','Hyaluronic Acid'],
  avoid_pairing_with = ARRAY['Strong AHAs in the same routine step'],
  science_note = 'A bee-derived resin rich in flavonoids and antioxidants — traditionally used for its calming and glow-boosting properties.',
  common_myth = 'Not all propolis is created equal — extract percentage matters more than the "propolis" label alone.',
  also_known_as = ARRAY['Bee glue']
WHERE name_english = 'Propolis';

UPDATE public.ingredients SET
  how_to_use = 'Use as a toner, essence or serum morning and night, especially when skin feels hot, itchy or reactive.',
  pairs_well_with = ARRAY['Centella Asiatica (Cica)','Panthenol','Hyaluronic Acid'],
  avoid_pairing_with = ARRAY['Strong retinoids on already-inflamed skin'],
  science_note = 'A traditional Korean herb (eodoksae) rich in quercetin — studied for calming visible redness and supporting the barrier.',
  common_myth = 'Being "gentle" does not mean weak — heartleaf works best used consistently across weeks, not once.',
  also_known_as = ARRAY['Houttuynia Cordata','Eodoksae']
WHERE name_english = 'Heartleaf (Houttuynia Cordata)';

UPDATE public.ingredients SET
  how_to_use = 'Apply to damp skin, then immediately seal with moisturiser. On dry skin it can actually pull moisture out of your face.',
  pairs_well_with = ARRAY['Ceramides','Niacinamide','Panthenol','Snail Mucin'],
  avoid_pairing_with = ARRAY['(No known incompatibilities)'],
  science_note = 'A humectant that holds up to 1000× its weight in water. Different molecular weights hydrate at different depths.',
  common_myth = 'It does not "plump wrinkles from below" — it hydrates the surface layers, which softens the look of fine lines.',
  also_known_as = ARRAY['Sodium Hyaluronate','HA']
WHERE name_english = 'Hyaluronic Acid';

UPDATE public.ingredients SET
  how_to_use = 'Best in a serum or ampoule at night, on freshly cleansed skin. Give it 8–12 weeks of consistent use.',
  pairs_well_with = ARRAY['Peptides','Ceramides','Panthenol'],
  avoid_pairing_with = ARRAY['Strong AHAs/BHAs in the same routine step'],
  science_note = 'A DNA fragment derived (typically) from salmon, studied for supporting skin regeneration and elasticity.',
  common_myth = 'It is not a needle-only ingredient — topical PDRN skincare works differently to in-clinic injections.',
  also_known_as = ARRAY['Polydeoxyribonucleotide','Salmon DNA']
WHERE name_english = 'PDRN';

UPDATE public.ingredients SET
  how_to_use = 'Look for it in your moisturiser or cream — apply as the last hydrating step, AM and PM.',
  pairs_well_with = ARRAY['Cholesterol','Fatty acids','Niacinamide','Hyaluronic Acid'],
  avoid_pairing_with = ARRAY['(No known incompatibilities)'],
  science_note = 'Lipids that make up ~50% of the outer skin barrier. Replenishing them helps reduce water loss and reactivity.',
  common_myth = 'More ceramides is not automatically better — the 3:1:1 ratio with cholesterol and fatty acids matters more.',
  also_known_as = ARRAY['Ceramide NP','Ceramide AP']
WHERE name_english = 'Ceramides';

UPDATE public.ingredients SET
  how_to_use = 'Use as a toner, essence or sheet mask. Layer 2–3 times if skin feels rough or dull ("7-skin" style).',
  pairs_well_with = ARRAY['Niacinamide','Hyaluronic Acid','Snail Mucin'],
  avoid_pairing_with = ARRAY['(No known incompatibilities)'],
  science_note = 'Fermented rice water is rich in amino acids, ferulic acid and B vitamins — a staple in Korean skincare for softness and glow.',
  common_myth = 'It does not lighten skin — it evens tone by supporting a healthy barrier, not by bleaching.',
  also_known_as = ARRAY['Rice Ferment','Sake Extract']
WHERE name_english = 'Rice Extract';

UPDATE public.ingredients SET
  how_to_use = 'Great in an AM serum before sunscreen for antioxidant protection, or as a soothing toner after sun exposure.',
  pairs_well_with = ARRAY['Vitamin C','Niacinamide','SPF'],
  avoid_pairing_with = ARRAY['(No known incompatibilities)'],
  science_note = 'Rich in EGCG, a polyphenol studied for antioxidant activity and calming visible irritation.',
  common_myth = 'Drinking green tea is not the same as applying it — topical concentration is what does the work on skin.',
  also_known_as = ARRAY['Camellia Sinensis','EGCG']
WHERE name_english = 'Green Tea Extract';

UPDATE public.ingredients SET
  how_to_use = 'Use PM only, 2–3 nights a week to start. Apply after cleansing, before hydrating layers. Sunscreen the next morning is non-negotiable.',
  pairs_well_with = ARRAY['Niacinamide','Ceramides','Hyaluronic Acid'],
  avoid_pairing_with = ARRAY['Retinol on the same night','AHAs on the same night','Strong Vitamin C on the same night'],
  science_note = 'An oil-soluble beta-hydroxy acid that dissolves the sebum-plus-dead-skin mix inside pores.',
  common_myth = 'It is not just for teens — adult hormonal breakouts and clogged pores respond just as well.',
  also_known_as = ARRAY['BHA','Salicylic Acid']
WHERE name_english = 'Salicylic Acid (BHA)';

UPDATE public.ingredients SET
  how_to_use = 'Use PM only, 1–3 nights a week. Layer hydrating serums after. Always SPF the next day.',
  pairs_well_with = ARRAY['Niacinamide','Hyaluronic Acid','Ceramides','Peptides'],
  avoid_pairing_with = ARRAY['BHA on the same night','Retinol on the same night','Strong Vitamin C on the same night'],
  science_note = 'An alpha-hydroxy acid that loosens the bonds between dead surface cells so they shed more evenly.',
  common_myth = 'Tingling is not proof it "works" — mild sting is okay, actual burning means dial the strength back.',
  also_known_as = ARRAY['AHA']
WHERE name_english = 'Glycolic Acid (AHA)';

UPDATE public.ingredients SET
  how_to_use = 'Look for it in creams and sheet masks. Best used PM as the final hydrating layer.',
  pairs_well_with = ARRAY['Hyaluronic Acid','Peptides','Ceramides'],
  avoid_pairing_with = ARRAY['(No known incompatibilities)'],
  science_note = 'The collagen molecule is too large to penetrate deeply, but hydrolysed collagen acts as an effective humectant on the surface.',
  common_myth = 'Topical collagen does not "boost your own collagen" — peptides do that job better.',
  also_known_as = ARRAY['Hydrolysed Collagen','Marine Collagen']
WHERE name_english = 'Collagen';

UPDATE public.ingredients SET
  how_to_use = 'Great in serums, essences or eye creams, AM and PM. Give it 8–12 weeks to see visible firmness change.',
  pairs_well_with = ARRAY['Niacinamide','Hyaluronic Acid','Ceramides','Retinol (in a separate routine)'],
  avoid_pairing_with = ARRAY['Strong AHAs/BHAs in the same step (can destabilise some peptides)'],
  science_note = 'Short chains of amino acids that signal specific skin functions — different peptides do different jobs (repair, firmness, calming).',
  common_myth = '"Peptide" on a label means little without knowing which peptide and at what concentration.',
  also_known_as = ARRAY['Signal Peptides','Copper Peptides','Matrixyl']
WHERE name_english = 'Peptides';

UPDATE public.ingredients SET
  how_to_use = 'Best in an AM serum before sunscreen. Store away from light and heat — brown or oxidised Vitamin C has lost its potency.',
  pairs_well_with = ARRAY['Vitamin E','Ferulic Acid','SPF','Hyaluronic Acid'],
  avoid_pairing_with = ARRAY['High-strength Niacinamide in the same layer','AHAs/BHAs on the same morning'],
  science_note = 'L-Ascorbic Acid is the most-studied form — potent but unstable. Derivatives (SAP, MAP, THD) are gentler and more stable.',
  common_myth = '10% is not automatically "better" than 5% — form and pH matter more than percentage alone.',
  also_known_as = ARRAY['L-Ascorbic Acid','Ascorbyl Glucoside','THD Ascorbate']
WHERE name_english = 'Vitamin C';
