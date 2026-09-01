// Per-SKU hero ingredients for the "What's actually in this" section.
//
// Every entry here is written from the brand's own published ingredient
// information for that specific product — no invented actives, no percentages
// unless the brand states them. SKUs with a full verified COPY override in
// product-detail.ts take priority over this map; anything not covered here
// falls back to the keyword rules.

import type { HeroIngredient } from '@/lib/product-detail';

const PANTHENOL: HeroIngredient = {
  name: 'Panthenol (Provitamin B5)',
  korean: '판테놀',
  what: 'A humectant that also helps skin repair itself — it softens rough patches and takes the sting out of skin that feels tight or over-cleansed.',
  goodFor: ['Barrier support', 'Soothing', 'Dehydration'],
};

const CENTELLA: HeroIngredient = {
  name: 'Centella Asiatica (Cica)',
  korean: '병풀',
  what: 'The classic Korean calming herb. Its madecassoside and asiaticoside fractions help settle visible redness and support the skin barrier while it recovers.',
  goodFor: ['Redness', 'Sensitivity', 'Barrier support'],
};

const HA_COMPLEX: HeroIngredient = {
  name: 'Hyaluronic Acid complex',
  korean: '히알루론산',
  what: 'Several molecular weights of hyaluronic acid so water is held at more than one depth — surface skin looks plump rather than just coated.',
  goodFor: ['Dehydration', 'Plumping', 'All skin types'],
};

const CERAMIDE_NP: HeroIngredient = {
  name: 'Ceramide NP',
  korean: '세라마이드',
  what: 'A skin-identical lipid. Your barrier is built from ceramides, cholesterol and fatty acids, so topping them up helps skin hold water instead of losing it through the day.',
  goodFor: ['Barrier repair', 'Dryness', 'Sensitivity'],
};

const PDRN: HeroIngredient = {
  name: 'PDRN (Polydeoxyribonucleotide)',
  korean: '피디알엔',
  what: 'Salmon-derived DNA fragments, the ingredient behind Korea\u2019s "salmon injection" trend, used topically here to support skin repair and a smoother, bouncier look over time.',
  goodFor: ['Repair', 'Firmness', 'Tired skin'],
};

const PEPTIDES: HeroIngredient = {
  name: 'Peptide complex',
  korean: '펩타이드',
  what: 'Short chains of amino acids that signal skin to behave like younger skin — used for firmness and fine-line smoothing without the irritation of retinoids.',
  goodFor: ['Firmness', 'Fine lines', 'Elasticity'],
};

const NIACINAMIDE: HeroIngredient = {
  name: 'Niacinamide',
  korean: '나이아신아마이드',
  what: 'Vitamin B3. Evens out post-blemish marks and dullness, helps regulate oil, and supports the barrier — one of the best-tolerated brighteners there is.',
  goodFor: ['Uneven tone', 'Post-blemish marks', 'Oil balance'],
};

const SQUALANE: HeroIngredient = {
  name: 'Squalane',
  korean: '스쿠알란',
  what: 'A lightweight, stable emollient close to skin\u2019s own sebum. It softens and seals in moisture without the heaviness of a butter or mineral oil.',
  goodFor: ['Dryness', 'Softness', 'Barrier support'],
};

const AMINO_SURFACTANT: HeroIngredient = {
  name: 'Amino-acid cleansing base',
  what: 'A weakly acidic, amino-acid-derived surfactant system that lifts sebum and sunscreen without the squeaky, stripped feeling of a high-pH foaming soap.',
  goodFor: ['Daily cleansing', 'Sensitivity', 'Barrier support'],
};

const HYDROGEL: HeroIngredient = {
  name: 'Dissolving hydrogel sheet',
  what: 'The mask itself is the treatment — a jelly-like sheet that slowly melts into the skin as you wear it, so the actives are delivered under occlusion instead of evaporating.',
  goodFor: ['Overnight hydration', 'Plumping', 'Pre-event glow'],
};

const COLLAGEN: HeroIngredient = {
  name: 'Hydrolysed Collagen',
  korean: '콜라겐',
  what: 'Collagen broken into smaller fragments so it can sit on skin as a water-binding film — it makes skin look immediately fuller and smoother, working from the surface.',
  goodFor: ['Plumping', 'Firmness look', 'Dryness'],
};

const MUNG_BEAN: HeroIngredient = {
  name: 'Mung Bean Extract',
  korean: '녹두',
  what: 'beplain\u2019s signature ingredient — a traditional Korean cleansing bean rich in amino acids, used to clear away residue and grime while keeping the skin\u2019s own moisture in place.',
  goodFor: ['Congestion', 'Gentle cleansing', 'Dull skin'],
};

const DOKDO_WATER: HeroIngredient = {
  name: '1025 Dokdo Deep-Sea Water',
  korean: '독도 해양심층수',
  what: 'Deep-sea water drawn off Dokdo island, rich in naturally occurring magnesium and other minerals. It is the water base of the whole 1025 line and gives it a light, mineral-hydration feel.',
  goodFor: ['Hydration', 'Sensitivity', 'All skin types'],
};

const BLACK_RICE: HeroIngredient = {
  name: 'Fermented Black Rice Extract',
  korean: '흑미 발효 추출물',
  what: 'HARUHARU WONDER\u2019s hero ingredient — naturally fermented black rice, a source of antioxidants and amino acids that leaves skin feeling nourished rather than coated.',
  goodFor: ['Dull skin', 'Antioxidant care', 'Hydration'],
};

const YAM_ROOT: HeroIngredient = {
  name: 'Yam Root Extract',
  korean: '마 뿌리 추출물',
  what: 'ISNTREE\u2019s vegan alternative to dairy-style milk textures — a naturally mucilaginous root extract that gives the milky slip and helps skin feel cushioned, not squeaky.',
  goodFor: ['Dryness', 'Sensitivity', 'Comfort'],
};

const WELLAGE_TONER_HA: HeroIngredient = {
  name: 'Hyaluronic-acid derivatives',
  korean: '히알루론산',
  what: 'The formula lists hydrolysed hyaluronic acid and several additional hyaluronic-acid derivatives. These ingredients primarily function as humectants within a cosmetic formula.',
  goodFor: ['Humectant', 'Surface hydration'],
  components: ['Hydrolyzed Hyaluronic Acid', 'Sodium Hyaluronate', 'Hyaluronic Acid'],
};

const WELLAGE_TONER_GLYCERIN: HeroIngredient = {
  name: 'Glycerin',
  korean: '글리세린',
  what: 'A widely used humectant that helps a cosmetic formula support surface hydration.',
  goodFor: ['Humectant'],
  components: ['Glycerin'],
};

const WELLAGE_TONER_BETAINE_PCA: HeroIngredient = {
  name: 'Betaine and Sodium PCA',
  what: 'Humectant ingredients commonly used to support moisture retention and a comfortable skin feel.',
  goodFor: ['Humectant', 'Moisture retention'],
  components: ['Betaine', 'Sodium PCA'],
};

const HERO_INGREDIENTS: Record<string, HeroIngredient[]> = {
  // ---------------------------------------------------------------- WELLAGE
  wellage_real_hyaluronic_toner_200ml_onetime: [
    WELLAGE_TONER_HA,
    WELLAGE_TONER_GLYCERIN,
    WELLAGE_TONER_BETAINE_PCA,
  ],
  wellage_real_hyaluronic_blue_100_ampoule_60ml_onetime: [
    {
      name: 'Hyaluronic Acid (Blue Solution)',
      korean: '히알루론산',
      what: 'The concentrated hyaluronic acid ampoule WELLAGE is known for — a high load of hyaluronic acid in a watery base, so it can be layered under anything without pilling.',
      goodFor: ['Dehydration', 'Plumping', 'Layering'],
    },
    PANTHENOL,
    {
      name: 'Trehalose & Betaine',
      what: 'Secondary humectants that hold onto water alongside hyaluronic acid, which keeps skin from drying out again in air conditioning or a dry winter flat.',
      goodFor: ['Long hydration', 'Tightness', 'Dry climates'],
    },
  ],
  wellage_real_hyaluronic_100_cream_80ml_onetime: [
    HA_COMPLEX,
    PANTHENOL,
    {
      name: 'Glycerin-rich emollient base',
      what: 'A gel-cream base built on glycerin and soft emollients: it seals the hyaluronic acid underneath so the water you just applied does not evaporate off.',
      goodFor: ['Moisture sealing', 'Dryness', 'Combination skin'],
    },
  ],
  wellage_real_hyaluronic_soothing_cream_80ml_onetime: [HA_COMPLEX, CENTELLA, PANTHENOL],
  wellage_hyper_pdrn_repair_ampoule_30ml_onetime: [PDRN, PEPTIDES, PANTHENOL],

  // --------------------------------------------------------------- MEDICUBE
  medicube_one_day_exosome_shot_pore_serum_2000_30ml_onetime: [
    {
      name: 'Exosome complex',
      korean: '엑소좀',
      what: 'The concentrated exosome complex the serum is named for — the ingredient class Korean clinics use post-procedure, formulated here for at-home use on visibly stretched pores.',
      goodFor: ['Pore appearance', 'Texture', 'Post-procedure care'],
    },
    NIACINAMIDE,
    {
      name: 'Salicylic Acid (BHA)',
      what: 'An oil-soluble exfoliant that gets inside the pore lining to clear the sebum and dead cells that make pores look larger.',
      goodFor: ['Blackheads', 'Congestion', 'Oily skin'],
    },
  ],
  medicube_pdrn_pink_peptide_serum_30ml_onetime: [PDRN, PEPTIDES, NIACINAMIDE],
  medicube_pdrn_pink_peptide_eye_cream_30ml_onetime: [
    PDRN,
    PEPTIDES,
    {
      name: 'Rich eye-area emollients',
      what: 'A denser cream base than the serum, designed for thin under-eye skin so it stays cushioned overnight rather than looking crepey by morning.',
      goodFor: ['Under-eye dryness', 'Fine lines', 'Overnight care'],
    },
  ],
  medicube_pdrn_pink_cica_soothing_toner_250ml_onetime: [PDRN, CENTELLA, PANTHENOL],
  medicube_pdrn_pink_niacinamide_whip_cleanser_120g_onetime: [
    PDRN,
    NIACINAMIDE,
    AMINO_SURFACTANT,
  ],
  medicube_collagen_jelly_cream_110ml_onetime: [
    COLLAGEN,
    PEPTIDES,
    {
      name: 'Jelly-textured moisture film',
      what: 'The bouncy jelly base is the point: it lays down a flexible moisture film that makes skin look taut and glassy straight after application.',
      goodFor: ['Glass-skin finish', 'Plumping', 'Makeup prep'],
    },
  ],

  // ----------------------------------------------------------------- TIRTIR
  tirtir_ceramic_milk_ampoule_40ml_onetime: [
    {
      name: 'Milky barrier complex',
      what: 'The "ceramic milk" texture — a soft white ampoule that leaves a smooth, even veil on skin, which is why it doubles as a makeup base.',
      goodFor: ['Smoothing', 'Makeup prep', 'Dull skin'],
    },
    NIACINAMIDE,
    CERAMIDE_NP,
  ],

  // -------------------------------------------------------- BEAUTY OF JOSEON
  beauty_of_joseon_revive_eye_serum_ginseng_plus_retinal_30ml_onetime: [
    {
      name: 'Ginseng Root Water',
      korean: '인삼',
      what: 'Beauty of Joseon\u2019s signature hanbang ingredient, used at the top of the formula in place of plain water for an antioxidant-rich, nourishing base.',
      goodFor: ['Antioxidant care', 'Tired skin', 'Nourishment'],
    },
    {
      name: 'Retinal (Retinaldehyde)',
      korean: '레티날',
      what: 'A vitamin A derivative one step closer to retinoic acid than retinol, so it works faster at a lower dose. Use it at night and always pair with SPF the next morning.',
      goodFor: ['Fine lines', 'Texture', 'Firmness'],
    },
    PEPTIDES,
  ],

  // ---------------------------------------------------------------- beplain
  beplain_cicaful_ampoule_30ml_onetime: [
    {
      name: 'Centella Asiatica Extract',
      korean: '병풀 추출물',
      what: 'The Cicaful line is built on a high load of centella asiatica — used here as the main calming active for skin that is flushed, reactive or recovering.',
      goodFor: ['Redness', 'Sensitivity', 'Barrier repair'],
    },
    PANTHENOL,
    {
      name: 'Madecassoside',
      what: 'The most studied of centella\u2019s calming fractions, isolated and added on top of the whole-plant extract for a stronger soothing effect.',
      goodFor: ['Irritation', 'Post-treatment skin', 'Calming'],
    },
  ],
  beplain_mung_bean_cleansing_oil_200ml_onetime: [
    MUNG_BEAN,
    {
      name: 'Light plant oil blend',
      what: 'A fluid vegetable oil base that dissolves sunscreen and makeup on dry skin, then emulsifies with water so it rinses off instead of leaving a film.',
      goodFor: ['Sunscreen removal', 'First cleanse', 'Congestion'],
    },
    {
      name: 'Weakly acidic finish (pH 5.5)',
      what: 'Cleansing at skin\u2019s own pH means the barrier is not left alkaline and vulnerable — the reason this one suits sensitive and blemish-prone skin.',
      goodFor: ['Sensitivity', 'Barrier support', 'Daily use'],
    },
  ],
  beplain_mung_bean_ph_balanced_cleansing_foam_80ml_onetime: [
    MUNG_BEAN,
    AMINO_SURFACTANT,
    PANTHENOL,
  ],
  beplain_mung_bean_pore_tight_up_soothing_cream_onetime: [MUNG_BEAN, CENTELLA, PANTHENOL],
  beplain_milk_ceramide_moisturizing_cream_onetime: [
    CERAMIDE_NP,
    {
      name: 'Milk protein extract',
      what: 'The "milk" in the name — a protein-rich extract that gives the cream its soft, nourishing slip on dry, flaky patches.',
      goodFor: ['Dryness', 'Flaking', 'Comfort'],
    },
    PANTHENOL,
  ],

  // -------------------------------------------------------------- ROUND LAB
  round_lab_1025_dokdo_toner_100ml_onetime: [
    DOKDO_WATER,
    PANTHENOL,
    {
      name: 'Sodium Hyaluronate',
      what: 'The salt form of hyaluronic acid, small enough to sink in quickly — it is what makes this toner feel like a hydrating step rather than a wipe-down.',
      goodFor: ['Dehydration', 'Layering', 'All skin types'],
    },
  ],
  round_lab_1025_dokdo_lotion_200ml_onetime: [DOKDO_WATER, PANTHENOL, SQUALANE],
  round_lab_1025_dokdo_cleanser_150ml_onetime: [DOKDO_WATER, AMINO_SURFACTANT, PANTHENOL],
  round_lab_1025_dokdo_toner_plus_lotion_special_set_onetime: [
    DOKDO_WATER,
    PANTHENOL,
    {
      name: 'Two-step pairing',
      what: 'The set is the full-size 1025 Dokdo toner plus lotion — the toner delivers the mineral water hydration, the lotion seals it with a light emulsion.',
      goodFor: ['Simple routine', 'Sensitivity', 'Everyday hydration'],
    },
  ],
  round_lab_1025_dokdo_trial_kit_onetime: [
    DOKDO_WATER,
    PANTHENOL,
    {
      name: 'Four-step travel set',
      what: 'Cleanser 30ml, toner 20ml, ampoule 10ml and cream 20ml — the whole 1025 Dokdo routine in travel sizes so you can trial the line before committing.',
      goodFor: ['Trialling', 'Travel', 'Full routine'],
    },
  ],
  round_lab_birch_juice_moisturizing_cream_80ml_onetime: [
    {
      name: 'Birch Sap (Betula Alba Juice)',
      korean: '자작나무 수액',
      what: 'Tapped birch tree sap replaces most of the water in the formula — it carries minerals and amino acids and is what gives the Birch Juice line its watery, non-greasy hydration.',
      goodFor: ['Dehydration', 'Lightweight moisture', 'Dull skin'],
    },
    HA_COMPLEX,
    PANTHENOL,
  ],

  // ---------------------------------------------------------------- ISNTREE
  isntree_hyaluronic_acid_water_essence_50ml_onetime: [
    {
      name: 'Multi-weight Hyaluronic Acid',
      korean: '히알루론산',
      what: 'ISNTREE\u2019s hyaluronic acid line uses a spread of molecular weights in one watery base, so hydration is not just sitting on the very top layer.',
      goodFor: ['Dehydration', 'Plumping', 'Oily-dehydrated skin'],
    },
    PANTHENOL,
    {
      name: 'Beta-Glucan',
      what: 'A mushroom- and grain-derived polysaccharide that holds water and calms — it is why this essence suits skin that is dehydrated and a bit reactive.',
      goodFor: ['Soothing', 'Hydration', 'Sensitivity'],
    },
  ],
  isntree_green_tea_fresh_toner_200ml_onetime: [
    {
      name: 'Jeju Green Tea Water',
      korean: '제주 녹차수',
      what: 'Green tea water from Jeju island makes up the bulk of the formula in place of plain water — antioxidant-rich and light, aimed at oily and congestion-prone skin.',
      goodFor: ['Oil balance', 'Antioxidant care', 'Refreshing'],
    },
    {
      name: 'Green tea polyphenols',
      what: 'The catechins in green tea leaf extract help settle the look of irritated, over-warm skin and are a natural fit for summer and post-sun days.',
      goodFor: ['Redness', 'Congestion', 'Hot weather'],
    },
    PANTHENOL,
  ],
  isntree_chestnut_bha_2_percent_clear_liquid_100ml_onetime: [
    {
      name: 'Betaine Salicylate 2% (BHA)',
      what: 'A gentler, naturally derived source of salicylic acid activity. It is oil-soluble, so it works inside the pore on blackheads and closed bumps rather than just on the surface.',
      goodFor: ['Blackheads', 'Congestion', 'Texture'],
    },
    {
      name: 'Chestnut Shell Extract',
      korean: '밤 껍질 추출물',
      what: 'The ingredient the product is named for — a plant extract used alongside the BHA to keep the exfoliating step from feeling harsh.',
      goodFor: ['Pore care', 'Smoothing', 'Balance'],
    },
    CENTELLA,
  ],
  isntree_yam_root_vegan_milk_cleanser_220ml_onetime: [YAM_ROOT, AMINO_SURFACTANT, PANTHENOL],
  isntree_yam_root_vegan_milk_toner_200ml_onetime: [
    YAM_ROOT,
    PANTHENOL,
    {
      name: 'Milky humectant base',
      what: 'A toner with the body of a light lotion — the milky texture means it hydrates and softens in one step, useful if a watery toner never feels like enough.',
      goodFor: ['Dry skin', 'Winter routines', 'Comfort'],
    },
  ],

  // ------------------------------------------------------- HARUHARU WONDER
  haruharu_wonder_black_rice_hyaluronic_toner_150ml_onetime: [BLACK_RICE, HA_COMPLEX, PANTHENOL],
  haruharu_wonder_black_rice_5_ceramide_barrier_moisturizing_cream_onetime: [
    {
      name: '5 Ceramides',
      korean: '5종 세라마이드',
      what: 'Five ceramide types rather than one, layered into the cream to rebuild the lipid mortar between skin cells so moisture stops escaping.',
      goodFor: ['Barrier repair', 'Dryness', 'Sensitivity'],
    },
    BLACK_RICE,
    PANTHENOL,
  ],

  // --------------------------------------------------------------- TORRIDEN
  torriden_dive_in_soothing_cream_onetime: [
    {
      name: '5D-Complex Hyaluronic Acid',
      korean: '히알루론산',
      what: 'The same five-weight hyaluronic acid complex as the DIVE-IN serum, carried in a gel-cream so the hydration is sealed rather than left open to the air.',
      goodFor: ['Dehydration', 'Plumping', 'All skin types'],
    },
    PANTHENOL,
    CERAMIDE_NP,
  ],
  torriden_dive_in_mask_pack_1pc_onetime: [
    {
      name: '5D-Complex Hyaluronic Acid',
      korean: '히알루론산',
      what: 'The DIVE-IN serum essence soaked into a sheet — 15 to 20 minutes under occlusion is the fastest way to get skin looking plump before an event.',
      goodFor: ['Instant hydration', 'Pre-event glow', 'Flights'],
    },
    PANTHENOL,
    {
      name: 'Madecassoside',
      what: 'Centella\u2019s calming fraction, included so the mask suits skin that is warm, tight or freshly exposed to sun and wind.',
      goodFor: ['Calming', 'Redness', 'Post-sun'],
    },
  ],
  torriden_dive_in_trial_kit_onetime: [
    {
      name: '5D-Complex Hyaluronic Acid',
      korean: '히알루론산',
      what: 'Travel sizes of the DIVE-IN routine, all built on the same five-weight hyaluronic acid complex — the easiest way to test the line before buying full size.',
      goodFor: ['Trialling', 'Travel', 'Dehydration'],
    },
    PANTHENOL,
    {
      name: 'Full DIVE-IN routine',
      what: 'Cleanser, toner, serum and cream in miniature, so you run the complete Torriden hydration routine rather than judging one product in isolation.',
      goodFor: ['Full routine', 'Travel', 'Gifting'],
    },
  ],
  torriden_balanceful_cleansing_gel_onetime: [
    CENTELLA,
    AMINO_SURFACTANT,
    PANTHENOL,
  ],
  torriden_balanceful_trial_kit_onetime: [
    CENTELLA,
    PANTHENOL,
    {
      name: 'Full Balanceful routine',
      what: 'Travel sizes of Torriden\u2019s cica line — cleanser, toner, serum and cream — for skin that runs red and reactive rather than simply dry.',
      goodFor: ['Trialling', 'Sensitivity', 'Travel'],
    },
  ],

  // --------------------------------------------------------------- BIODANCE
  biodance_bio_collagen_real_deep_mask_onetime: [COLLAGEN, HYDROGEL, NIACINAMIDE],
  biodance_hydro_cera_nol_real_deep_mask_onetime: [CERAMIDE_NP, HYDROGEL, PANTHENOL],
  biodance_refreshing_sea_kelp_real_deep_mask_onetime: [
    {
      name: 'Sea Kelp Extract',
      korean: '다시마 추출물',
      what: 'Marine algae extract rich in polysaccharides and minerals — the cooling, refreshing counterpart to the collagen mask, aimed at hot, tired-looking skin.',
      goodFor: ['Cooling', 'Dull skin', 'Post-sun'],
    },
    HYDROGEL,
    PANTHENOL,
  ],

  // ------------------------------------------------------------------- Dr.G
  dr_g_red_blemish_clear_soothing_foam_150ml_onetime: [
    {
      name: 'Cica Relief Complex (Centella)',
      korean: '병풀',
      what: 'Dr.G\u2019s R.E.D Blemish line is built on centella asiatica — in the cleanser it is there so the wash step does not aggravate skin that is already flushed and blemish-prone.',
      goodFor: ['Redness', 'Blemish-prone skin', 'Sensitivity'],
    },
    AMINO_SURFACTANT,
    PANTHENOL,
  ],
  dr_g_r_e_d_blemish_clear_soothing_cream_70ml_onetime: [
    {
      name: 'Cica Relief Complex (Centella)',
      korean: '병풀',
      what: 'The centella-based soothing complex the R.E.D Blemish range is known for, used at cream strength for skin that flares easily.',
      goodFor: ['Redness', 'Sensitivity', 'Flare-ups'],
    },
    {
      name: 'Madecassoside',
      what: 'Centella\u2019s most studied calming fraction, added on top of the extract so the cream works on visible redness rather than only on dryness.',
      goodFor: ['Irritation', 'Calming', 'Barrier repair'],
    },
    PANTHENOL,
  ],
  dr_g_black_snail_cream_50ml_onetime: [
    {
      name: 'Snail Secretion Filtrate',
      korean: '달팽이 점액 여과물',
      what: 'The black snail mucin the cream is named for — a naturally occurring mix of glycoproteins and hyaluronic acid that Korean formulators use for repair and bounce.',
      goodFor: ['Repair', 'Elasticity', 'Dryness'],
    },
    PEPTIDES,
    PANTHENOL,
  ],

  // ---------------------------------------------------------------- AESTURA
  aestura_atobarrier365_cream_onetime: [
    {
      name: 'Ceramide capsules',
      korean: '세라마이드',
      what: 'Atobarrier365 is AESTURA\u2019s dermatologist-backed barrier cream: ceramides encapsulated so they stay stable in the jar and release into skin on application.',
      goodFor: ['Barrier repair', 'Eczema-prone skin', 'Dryness'],
    },
    {
      name: 'Beta-Glucan',
      what: 'A soothing, water-binding polysaccharide used alongside the ceramides so the cream calms as well as seals.',
      goodFor: ['Soothing', 'Hydration', 'Sensitivity'],
    },
    PANTHENOL,
  ],
  aestura_atobarrier_365_hydro_soothing_cream_onetime: [CERAMIDE_NP, HA_COMPLEX, PANTHENOL],
  aestura_a_cica_moisture_toner_onetime: [CENTELLA, CERAMIDE_NP, PANTHENOL],
  aestura_derma_uv365_barrier_moisture_mineral_sun_cream_onetime: [
    {
      name: 'Mineral UV filters',
      what: 'A physical-filter sunscreen using mineral UV filters, which is why it suits reactive skin that stings with chemical sunscreens. Reapply every two hours outdoors.',
      goodFor: ['Sensitive skin', 'Daily SPF', 'Post-procedure'],
    },
    CERAMIDE_NP,
    PANTHENOL,
  ],

  // --------------------------------------------------------------- S.NATURE
  s_nature_aqua_oasis_toner_onetime: [
    HA_COMPLEX,
    {
      name: 'Glycerin & Betaine humectants',
      what: 'A simple, well-tolerated humectant pair that draws water into skin — the reason this toner works as a quick first hydration layer rather than a treatment step.',
      goodFor: ['Dehydration', 'Layering', 'All skin types'],
    },
    PANTHENOL,
  ],
  s_nature_aqua_oasis_moisturizing_gel_onetime: [
    HA_COMPLEX,
    {
      name: 'Water-gel base',
      what: 'An oil-light gel that hydrates and disappears — the sensible choice for humid Melbourne summers or skin that shines by midday.',
      goodFor: ['Oily skin', 'Summer', 'Lightweight moisture'],
    },
    PANTHENOL,
  ],
  s_nature_aqua_squalane_serum_onetime: [SQUALANE, HA_COMPLEX, PANTHENOL],
  s_nature_aqua_squalane_moisturizing_cream_onetime: [
    SQUALANE,
    HA_COMPLEX,
    {
      name: 'Softening emollient base',
      what: 'A richer cream base that locks the squalane and hyaluronic acid in place, aimed at skin that feels tight again an hour after moisturising.',
      goodFor: ['Dryness', 'Winter', 'Barrier support'],
    },
  ],
  s_nature_aqua_soy_yogurt_eye_cream_onetime: [
    {
      name: 'Fermented soy (soy yogurt) extract',
      korean: '발효 대두',
      what: 'The fermented soy extract the product is named for — fermentation breaks it into smaller, more skin-friendly fragments used here for nourishment around the eyes.',
      goodFor: ['Nourishment', 'Dry under-eyes', 'Softness'],
    },
    PEPTIDES,
    HA_COMPLEX,
  ],
};

export function bespokeHeroIngredients(priceId: string): HeroIngredient[] | undefined {
  return HERO_INGREDIENTS[priceId];
}
