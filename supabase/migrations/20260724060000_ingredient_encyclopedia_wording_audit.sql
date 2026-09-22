
-- Ingredient encyclopedia wording audit (Priority 7).
-- Removes medical/biological/overly-certain claims from ingredient copy and
-- replaces them with restrained cosmetic language. Also adds structured
-- fields for evidence-review date, source links and limitations so the
-- encyclopedia can honestly say "Not yet reviewed" instead of fabricating
-- dates or citations that do not exist in this codebase.

ALTER TABLE public.ingredients
  ADD COLUMN IF NOT EXISTS evidence_reviewed_at TEXT NOT NULL DEFAULT 'Not yet reviewed',
  ADD COLUMN IF NOT EXISTS source_links TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS limitations TEXT,
  ADD COLUMN IF NOT EXISTS caution_notes TEXT;

-- ---------------------------------------------------------------------------
-- Reworded what_it_does (removes "heals", "supports the skin's own repair
-- process", "keeps irritation out", "defends skin from pollution",
-- "encourages skin to become firmer", "clear out gunk" style certainty).
-- ---------------------------------------------------------------------------

UPDATE public.ingredients SET
  what_it_does = 'A botanical extract commonly used in cosmetic formulations to help calm the visible look of redness and support a more comfortable-looking complexion.',
  limitations = 'Evidence is limited to cosmetic-level studies on individual compounds such as madecassoside and asiaticoside; it is not a treatment for rosacea, eczema or dermatitis.',
  caution_notes = 'People with a known sensitivity to plant extracts may want to patch test first.'
WHERE name_english = 'Centella Asiatica (Cica)';

UPDATE public.ingredients SET
  what_it_does = 'A form of vitamin B3 commonly used in cosmetic formulations to help even out the look of skin tone, support the appearance of pores and contribute to a more comfortable-feeling barrier.',
  limitations = 'Available evidence reasonably supports cosmetic-level tone and oil-balance benefits at commonly used concentrations; it does not permanently change pore size.',
  caution_notes = 'A minority of users report temporary flushing at higher percentages.'
WHERE name_english = 'Niacinamide';

UPDATE public.ingredients SET
  what_it_does = 'A filtrate rich in glycoproteins, hyaluronic acid and peptides, commonly used in cosmetic formulations for surface hydration and a smoother-feeling texture.',
  limitations = 'Evidence is limited and largely formulation-specific; claims about fading marks or "repairing" skin go beyond what current cosmetic evidence supports.',
  caution_notes = 'May not suit people avoiding animal-derived ingredients.'
WHERE name_english = 'Snail Mucin';

UPDATE public.ingredients SET
  what_it_does = 'A bee-derived resin commonly used in cosmetic formulations as a conditioning ingredient, intended to add a nourishing feel and support overall comfort.',
  limitations = 'Evidence for propolis specifically (versus its individual antioxidant components) is limited.',
  caution_notes = 'Avoid if you have a known allergy to bee products.'
WHERE name_english = 'Propolis';

UPDATE public.ingredients SET
  what_it_does = 'A traditional Korean herbal extract commonly used in cosmetic formulations intended to help calm the look of reactive, warm-feeling skin and support a more balanced-looking complexion.',
  limitations = 'Evidence is mostly limited to laboratory and small cosmetic studies of its quercetin content; it is not a substitute for medical treatment of active skin conditions.',
  caution_notes = 'People with active or diagnosed skin conditions should consult a dermatologist rather than rely on this ingredient alone.'
WHERE name_english = 'Heartleaf (Houttuynia Cordata)';

UPDATE public.ingredients SET
  what_it_does = 'A humectant that draws and holds water at the skin''s surface, commonly used in cosmetic formulations to support a plumper, more comfortable feel.',
  limitations = 'Hydration effects are generally well supported and short-term; it does not "plump wrinkles from below."',
  caution_notes = 'Applying to dry skin without sealing with a moisturiser may draw moisture out in low-humidity conditions.'
WHERE name_english = 'Hyaluronic Acid';

UPDATE public.ingredients SET
  what_it_does = 'A salmon-derived ingredient used topically in some cosmetic formulations. Interest in topical PDRN is emerging in Korean skincare, but this is distinct from injectable, in-clinic PDRN, for which more clinical evidence exists.',
  limitations = 'Clinical evidence for topical PDRN specifically is limited compared with the in-clinic injectable form; brand and marketing claims about topical PDRN often outpace the available evidence. Treat "designed to support the look of tired or stressed skin" as a formulation intention, not a proven outcome.',
  caution_notes = 'People with fish or seafood allergies may want to avoid salmon-derived ingredients.'
WHERE name_english = 'PDRN';

UPDATE public.ingredients SET
  what_it_does = 'Fat-like lipids that occur naturally in skin. Ceramides are commonly added to cosmetic formulations to help support the skin barrier and reduce the feeling of moisture loss.',
  limitations = 'Well-supported as a barrier-support ingredient class in cosmetic science, though results depend on the full formulation and ratio with cholesterol and fatty acids, not the presence of ceramides alone.',
  caution_notes = 'Generally well tolerated, including on eczema-prone skin, but is not a substitute for prescribed treatment.'
WHERE name_english = 'Ceramides';

UPDATE public.ingredients SET
  what_it_does = 'A fermented or plain rice-derived extract commonly used in cosmetic formulations for its amino acid and B-vitamin content, intended to support hydration and a brighter-looking complexion.',
  limitations = 'Evidence is largely traditional-use and formulation-based rather than robust clinical data; it does not lighten skin by bleaching.',
  caution_notes = null
WHERE name_english = 'Rice Extract';

UPDATE public.ingredients SET
  what_it_does = 'An antioxidant-rich plant extract commonly used in cosmetic formulations, intended to help support skin against everyday environmental exposure and to calm the look of redness.',
  limitations = 'Antioxidant activity of EGCG is documented in laboratory studies; topical cosmetic-concentration evidence in humans is more limited, and it does not "defend" skin from pollution in an absolute sense.',
  caution_notes = null
WHERE name_english = 'Green Tea Extract';

UPDATE public.ingredients SET
  what_it_does = 'An oil-soluble exfoliant commonly used in cosmetic formulations to help clear the sebum and dead-skin buildup inside pores, which is associated with the look of blackheads and congestion.',
  limitations = 'Well-supported as a cosmetic exfoliant at typical over-the-counter concentrations; it does not guarantee clear pores and results vary by skin type and routine.',
  caution_notes = 'May not suit very reactive skin; caution advised during pregnancy — check with a doctor.'
WHERE name_english = 'Salicylic Acid (BHA)';

UPDATE public.ingredients SET
  what_it_does = 'A water-soluble exfoliant commonly used in cosmetic formulations to help loosen the bonds between surface dead skin cells for a smoother, more even-looking texture.',
  limitations = 'Evidence for surface exfoliation and short-term texture and tone improvement is reasonably established; it is not a treatment for diagnosed pigmentation conditions.',
  caution_notes = 'May not suit very reactive skin or a compromised skin barrier.'
WHERE name_english = 'Glycolic Acid (AHA)';

UPDATE public.ingredients SET
  what_it_does = 'A large hydrating protein, usually used in hydrolysed form so it can sit on the skin''s surface as a water-binding film that may temporarily smooth its look and feel.',
  limitations = 'The collagen molecule is generally considered too large to penetrate deeply; topical collagen is not shown to increase the skin''s own collagen production the way some marketing implies.',
  caution_notes = null
WHERE name_english = 'Collagen';

UPDATE public.ingredients SET
  what_it_does = 'Short chains of amino acids commonly used in cosmetic formulations intended to support the look of firmness and a more even, smoother-looking surface over time.',
  limitations = 'Evidence quality varies widely by the specific peptide used and its concentration; "peptides" on a label alone is not a reliable indicator of an effect.',
  caution_notes = null
WHERE name_english = 'Peptides';

UPDATE public.ingredients SET
  what_it_does = 'An antioxidant commonly used in cosmetic formulations intended to help support a brighter, more even-looking tone with regular use.',
  limitations = 'Evidence is strongest for stable, well-formulated forms at effective concentrations; results vary and are not guaranteed for any individual.',
  caution_notes = 'May not suit very reactive skin, particularly at higher concentrations.'
WHERE name_english = 'Vitamin C';

-- ---------------------------------------------------------------------------
-- Reworded science_note / common_myth fields that carried the same
-- overly-certain phrasing.
-- ---------------------------------------------------------------------------

UPDATE public.ingredients SET
  science_note = 'A plant extract containing madecassoside and asiaticoside — compounds studied at the cosmetic level for a calming effect on the look of redness and for supporting a more comfortable-looking barrier.'
WHERE name_english = 'Centella Asiatica (Cica)';

UPDATE public.ingredients SET
  science_note = 'A form of Vitamin B3 studied for helping regulate the look of oil, support even-looking post-blemish marks, and contribute to a more comfortable-feeling skin barrier.'
WHERE name_english = 'Niacinamide';

UPDATE public.ingredients SET
  science_note = 'A filtrate containing glycoproteins, hyaluronic acid and peptides, studied at a cosmetic-formulation level for surface hydration; independent clinical evidence for broader claims remains limited.'
WHERE name_english = 'Snail Mucin';

UPDATE public.ingredients SET
  science_note = 'A bee-derived resin containing flavonoids and antioxidants, traditionally associated with a calming, nourishing feel in cosmetic use.'
WHERE name_english = 'Propolis';

UPDATE public.ingredients SET
  science_note = 'A traditional Korean herb (eodoksae) containing quercetin, studied at a cosmetic level for helping calm the visible look of redness and support the barrier.'
WHERE name_english = 'Heartleaf (Houttuynia Cordata)';

UPDATE public.ingredients SET
  science_note = 'A humectant able to hold many times its weight in water. Different molecular weights are formulated to hydrate at different depths of the skin''s surface layers.'
WHERE name_english = 'Hyaluronic Acid';

UPDATE public.ingredients SET
  science_note = 'A DNA fragment typically derived from salmon. In-clinic, injectable PDRN has more established clinical study behind it than the topical, cosmetic form; topical PDRN skincare is an area of emerging formulation interest rather than an established clinical treatment.'
WHERE name_english = 'PDRN';

UPDATE public.ingredients SET
  science_note = 'Lipids that make up a significant portion of the outer skin barrier. Replenishing them in a formulation is associated with reduced visible water loss and reactivity.'
WHERE name_english = 'Ceramides';

UPDATE public.ingredients SET
  science_note = 'Fermented rice water contains amino acids, ferulic acid and B vitamins, and has long been used in Korean skincare formulations aimed at softness and a brighter-looking complexion.'
WHERE name_english = 'Rice Extract';

UPDATE public.ingredients SET
  science_note = 'Rich in EGCG, a polyphenol studied in laboratory settings for antioxidant activity; topical, cosmetic-concentration human evidence is more limited.'
WHERE name_english = 'Green Tea Extract';

UPDATE public.ingredients SET
  science_note = 'An oil-soluble beta-hydroxy acid studied for its ability to dissolve the sebum-and-dead-skin mix inside pores at typical cosmetic concentrations.'
WHERE name_english = 'Salicylic Acid (BHA)';

UPDATE public.ingredients SET
  science_note = 'An alpha-hydroxy acid studied for loosening the bonds between dead surface cells so they shed more evenly at typical cosmetic concentrations.'
WHERE name_english = 'Glycolic Acid (AHA)';

UPDATE public.ingredients SET
  science_note = 'The collagen molecule is generally too large to penetrate deeply, but hydrolysed collagen is formulated to act as a surface humectant.'
WHERE name_english = 'Collagen';

UPDATE public.ingredients SET
  science_note = 'Short amino-acid chains studied for signalling specific skin functions; different peptides are associated with different intended roles (firmness, calming, and so on), and evidence quality varies by peptide.'
WHERE name_english = 'Peptides';

UPDATE public.ingredients SET
  science_note = 'L-Ascorbic Acid is the most-studied form of topical Vitamin C — effective in some studies but chemically unstable. Derivatives (SAP, MAP, THD) are generally more stable, with somewhat more limited direct evidence.'
WHERE name_english = 'Vitamin C';

UPDATE public.ingredients SET
  common_myth = 'It is not a medical or steroid alternative. Any calming effect on the look of redness tends to build gradually with consistent use, not overnight.'
WHERE name_english = 'Centella Asiatica (Cica)';

UPDATE public.ingredients SET
  common_myth = 'It does not shrink pores permanently — regulating the look of oil can make pores appear less prominent, which is a different thing.'
WHERE name_english = 'Niacinamide';

UPDATE public.ingredients SET
  common_myth = 'It is not "slug slime" scraped off snails; reputable suppliers collect the filtrate without harming the animal. It also is not a proven treatment for scarring.'
WHERE name_english = 'Snail Mucin';

UPDATE public.ingredients SET
  common_myth = 'Not all propolis extracts are equivalent — concentration and formulation matter more than the word "propolis" on a label.'
WHERE name_english = 'Propolis';

UPDATE public.ingredients SET
  common_myth = 'Being gentle does not mean it works instantly — any visible change is generally associated with weeks of consistent use, not a single application.'
WHERE name_english = 'Heartleaf (Houttuynia Cordata)';

UPDATE public.ingredients SET
  common_myth = 'It does not plump wrinkles from below — it hydrates the surface layers, which can soften the temporary look of fine lines caused by dehydration.'
WHERE name_english = 'Hyaluronic Acid';

UPDATE public.ingredients SET
  common_myth = 'Topical PDRN skincare is not the same as an in-clinic PDRN injection, and should not be assumed to work the same way or produce comparable results.'
WHERE name_english = 'PDRN';

UPDATE public.ingredients SET
  common_myth = 'Using more ceramide-containing products is not automatically better — formulation ratio with cholesterol and fatty acids is considered more relevant than raw ceramide content.'
WHERE name_english = 'Ceramides';

UPDATE public.ingredients SET
  common_myth = 'It is not a skin-lightening or bleaching ingredient; any brightening association relates to overall complexion appearance, not pigment removal.'
WHERE name_english = 'Rice Extract';

UPDATE public.ingredients SET
  common_myth = 'Drinking green tea is not equivalent to applying it topically — the concentration and formulation used on skin differ from what is ingested.'
WHERE name_english = 'Green Tea Extract';

UPDATE public.ingredients SET
  common_myth = 'It is not only relevant for teenage skin — adult hormonal breakouts and congestion may also respond to it, though results vary.'
WHERE name_english = 'Salicylic Acid (BHA)';

UPDATE public.ingredients SET
  common_myth = 'A tingling sensation is not proof of effectiveness — mild sensation can be typical, but stinging or burning suggests reducing frequency or concentration and, if it persists, checking with a dermatologist.'
WHERE name_english = 'Glycolic Acid (AHA)';

UPDATE public.ingredients SET
  common_myth = 'Topical collagen is not shown to "boost your own collagen production" in the way peptides may be formulated to support.'
WHERE name_english = 'Collagen';

UPDATE public.ingredients SET
  common_myth = 'The word "peptide" on a label means little on its own without knowing which peptide is used and at what concentration.'
WHERE name_english = 'Peptides';

UPDATE public.ingredients SET
  common_myth = 'A higher percentage is not automatically better — form, pH and formulation stability matter more than percentage alone.'
WHERE name_english = 'Vitamin C';
