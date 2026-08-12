import featureSerum from "@/assets/learn-feature-serum.jpg";
import petri from "@/assets/learn-petri.jpg";
import portraitDeep from "@/assets/learn-portrait-deep.jpg";
import routineFlatlay from "@/assets/learn-routine-flatlay.jpg";

export type ArticleSection = { heading?: string; body: string };

export type LearnArticle = {
  slug: string;
  pillar: "ingredients" | "concerns" | "routines" | "seoul";
  meta: string;
  title: string;
  blurb: string;
  read: string;
  cover: string;
  coverAlt: string;
  standfirst: string;
  sections: ArticleSection[];
  keyPoints: string[];
  sources: { label: string; href: string }[];
  related: string[];
};

const SOURCE_HWAHAE = {
  label: "Hwahae (화해) — Korea's largest beauty review platform, 2026 trend report",
  href: "https://business.hwahae.co.kr/insight/trendreport-2026-the-new-edition/",
};
const SOURCE_OY_INGREDIENTS = {
  label: "Olive Young 2026 top ingredient benefit groups (Korean consumer purchase behaviour)",
  href: "https://kessence.kr/olive-young-2026-top-ingredients/",
};
const SOURCE_CLINIC = {
  label: "Trendier AI — PDRN reviews +103%, exosome reviews +229% on Olive Young",
  href: "https://blog.trendier.ai/pdrn-exosomes-clinic-skincare-kbeauty-2026/",
};
const SOURCE_KBS = {
  label: "Cosmo Beauty Seoul 2026 K-Beauty Trend Report (4,700+ products analysed)",
  href: "https://en.thekbs.co.kr/news/articleView.html?idxno=16154",
};
const SOURCE_RANKINGS = {
  label: "Daily best-seller tracking across Olive Young Korea, Hwahae, Olive Young Global",
  href: "https://coreaskincare.com/blog/k-beauty-ranking-data-what-actually-sells",
};
const SOURCE_TGA = {
  label: "TGA — Australian Regulatory Guidelines for Sunscreens (ARGS)",
  href: "https://www.tga.gov.au/resources/resource/guidance/australian-regulatory-guidelines-sunscreens-args",
};
const SOURCE_ARPANSA = {
  label: "ARPANSA — UV Index and sun protection times for Australia",
  href: "https://www.arpansa.gov.au/our-services/monitoring/ultraviolet-radiation-monitoring",
};
const SOURCE_BOM = {
  label: "Bureau of Meteorology — Australian climate and humidity averages",
  href: "http://www.bom.gov.au/climate/averages/",
};

export const learnArticles: LearnArticle[] = [
  /* ---------------------------------------------------------------- CONCERNS */
  {
    slug: "deeper-skin-tones-k-beauty",
    pillar: "concerns",
    meta: "Concern · Tone",
    title: "K-Beauty On Deeper Skin: What Actually Translates",
    blurb: "Cast, brightening claims and pigmentation, honestly assessed for Australian skin.",
    read: "8 min read",
    cover: portraitDeep,
    coverAlt: "Portrait of a woman with deep skin tone and healthy, even complexion",
    standfirst:
      "Most K-beauty marketing was written for a domestic market where the average shopper sits in a narrow band of skin tones. Australia is not that market. Here is what carries across, what needs adjusting, and what to ignore entirely.",
    sections: [
      {
        heading: "The honest starting point",
        body: "Korean formulations are developed and tested primarily on Fitzpatrick types II–IV. That doesn't make them unsuitable for deeper skin — the barrier science is universal — but it does mean three things are frequently mismatched: sunscreen cast, the language around 'brightening', and the assumed baseline for irritation risk. Australia's population spans the full Fitzpatrick range, so we assess every product we stock against that reality rather than the Seoul default.",
      },
      {
        heading: "White cast is a filter problem, not a K-beauty problem",
        body: "Cast comes from inorganic UV filters — zinc oxide and titanium dioxide — sitting on the surface and scattering visible light. Korean sunscreens are frequently chemical-filter or hybrid formulas using filters approved in Korea and the EU, which are far less likely to cast than a high-zinc Australian formula. In practice, deeper skin often gets a *better* cosmetic result from a Korean chemical or hybrid sunscreen than from a local zinc-heavy one. If a Korean sunscreen does cast, the label will say '무기자차' (inorganic/mineral) — that's your tell.",
      },
      {
        heading: "'Brightening' does not mean 'lightening'",
        body: "The Korean functional-cosmetic category 미백 is usually translated as 'whitening', which lands badly in English and describes something different from what the formula does. These products work on excess melanin production triggered by inflammation or UV — niacinamide, tranexamic acid, alpha-arbutin, vitamin C. They target unevenness. They do not, and cannot, change your baseline skin tone. If a brand implies otherwise, that's a marketing failure, not chemistry.",
      },
      {
        heading: "Post-inflammatory hyperpigmentation is the real conversation",
        body: "For deeper skin, the most common pigment concern isn't sun spots — it's PIH: the brown mark left behind after a pimple, an ingrown, a scratch, or an over-aggressive exfoliation. PIH is an inflammation response, which means the most effective strategy is preventative, not corrective. Calm the inflammation early (centella, panthenol, madecassoside), protect daily with SPF so the mark doesn't darken further, and only then layer a pigment-specific active. Reversing the order is why so many people spend months on vitamin C and see nothing.",
      },
      {
        heading: "Where over-exfoliation does the most damage",
        body: "Melanin-rich skin is not 'tougher'. It's more reactive in one specific way: any injury that triggers inflammation is more likely to leave visible pigment. That makes the TikTok pattern of daily acid toners plus a retinal plus a scrub genuinely risky here. Our standing guidance is chemical exfoliation no more than twice a week, one active introduced at a time, with a minimum two-week gap between additions.",
      },
      {
        heading: "What we do about it",
        body: "Every sunscreen we stock is swatched on multiple skin tones before it goes on the shelf, and we say plainly in the listing whether there's a cast. We translate 미백 as 'tone-evening', not 'whitening'. And where a product's Korean marketing leans on language that doesn't translate, we rewrite it rather than paste it.",
      },
    ],
    keyPoints: [
      "Cast comes from mineral filters — most Korean chemical/hybrid sunscreens don't cast on deeper skin.",
      "'Brightening' in Korean cosmetics means evening excess pigment, never lightening your natural tone.",
      "For deeper skin, preventing post-inflammatory pigment beats treating it — calm inflammation first.",
      "Cap chemical exfoliation at twice weekly and add one active at a time.",
    ],
    sources: [SOURCE_OY_INGREDIENTS, SOURCE_TGA, SOURCE_RANKINGS],
    related: ["australian-barrier-climate", "pigmentation-language", "tga-vs-korean-sunscreen"],
  },
  {
    slug: "australian-barrier-climate",
    pillar: "concerns",
    meta: "Concern · Sensitivity",
    title: "Why Australian Skin Barriers Struggle More Than Korean Skin",
    blurb: "Aircon, harder water and extreme UV — the climate case, with numbers.",
    read: "6 min read",
    cover: featureSerum,
    coverAlt: "Glass test tubes and a gold dropper filled with serum",
    standfirst:
      "A routine that keeps skin comfortable in Seoul can leave the same person tight, flaky and reactive in Melbourne. It isn't the products failing. It's four environmental variables nobody accounts for when they copy a Korean routine wholesale.",
    sections: [
      {
        heading: "1. UV load, not UV season",
        body: "Seoul's summer UV index peaks around 8–9 for a few weeks. Large parts of Australia sit at extreme UV for months, and even a Melbourne winter records damaging UV on clear days. Chronic UV exposure degrades the lipid matrix that holds your barrier together — so the same barrier repair routine has to work harder here simply to hold ground. This is the single strongest argument for treating sunscreen as a barrier product, not a cosmetic one.",
      },
      {
        heading: "2. Air conditioning, which is effectively a dehumidifier",
        body: "Korean apartments run humidified heating through winter; Australian offices, cars and homes run refrigerated cooling for months. Air conditioning strips ambient humidity, and transepidermal water loss rises with the humidity gradient. Humectant-heavy Korean essences — glycerin, hyaluronic acid, panthenol — actually pull water *from* your skin in a dry, air-conditioned room unless you seal them with an occlusive. This is the most common mistake we see: the right products, applied in an environment they weren't designed for, with the last step skipped.",
      },
      {
        heading: "3. Water hardness",
        body: "Adelaide, Perth and parts of regional Queensland and Victoria have noticeably harder water than Seoul's supply. Calcium and magnesium ions react with cleanser surfactants to leave a residue film and raise skin pH after washing, which slows barrier recovery. If your skin feels squeaky and tight for twenty minutes after cleansing, the water is contributing. A low-pH, low-foam cleanser and a hydrating toner immediately after washing does more here than any serum.",
      },
      {
        heading: "4. Climate swing within a single day",
        body: "Melbourne can move 15°C between morning and evening. Rapid temperature change causes vasodilation and flushing, and repeated flushing is a genuine driver of persistent redness and sensitivity. Skin that behaves in a stable climate can become reactive here without any change in products.",
      },
      {
        heading: "The Australian adjustment",
        body: "Keep the Korean logic — thin, layered hydration and soothing actives — and change three things. Always seal humectants with a cream or lipid-rich moisturiser, especially indoors. Drop actives back to alternating nights during barrier flare-ups instead of pushing through. And treat SPF as the load-bearing step, not the optional last one. Koreans reapply sunscreen because they're protecting an investment in skin health; here you're protecting against far more UV, for far more of the year.",
      },
      {
        heading: "Signs your barrier is actually compromised",
        body: "Stinging from products that never stung before. Redness that stays after a hot shower. Tightness within minutes of cleansing. Flaking on top of oiliness. If you have two or more of these, stop every active for fourteen days and run cleanser, hydrating toner, a cica or ceramide moisturiser, and SPF. Nothing else. Most barriers recover in two to four weeks — but only if you stop poking them.",
      },
    ],
    keyPoints: [
      "Australian UV load is higher and near year-round — SPF is a barrier product here, not a cosmetic.",
      "Air conditioning makes humectant-only layering counterproductive; always seal with an occlusive.",
      "Hard water raises post-cleanse pH — use low-pH cleansers and tone immediately.",
      "Two or more barrier warning signs means fourteen days with zero actives.",
    ],
    sources: [SOURCE_ARPANSA, SOURCE_BOM, SOURCE_OY_INGREDIENTS],
    related: ["deeper-skin-tones-k-beauty", "humid-summer-layering", "prevention-over-repair"],
  },
  {
    slug: "pigmentation-language",
    pillar: "concerns",
    meta: "Concern · Pigmentation",
    title: "Uneven Tone, Not \u201CWhitening\u201D: Getting The Language Right",
    blurb: "What the Korean label actually claims, and what to look for when you want brightness.",
    read: "5 min read",
    cover: petri,
    coverAlt: "Laboratory petri dishes with botanical ingredient textures",
    standfirst:
      "Korea regulates 'whitening' as a functional cosmetic claim with a defined mechanism. Translated straight into English, it says something the product doesn't do — and it puts people off ingredients that would genuinely help them.",
    sections: [
      {
        heading: "What the Korean claim legally means",
        body: "Under Korea's functional cosmetics framework, a 미백 claim requires an approved active at an approved concentration, tested for a specific effect: inhibiting melanin synthesis or supporting the turnover of already-pigmented cells. The approved list is narrow — niacinamide, arbutin, ascorbic acid derivatives, adenosine-adjacent actives. It is a claim about melanin *overproduction*, not about your constitutional skin colour.",
      },
      {
        heading: "Why the English translation is wrong",
        body: "'Whitening' implies a change of baseline tone. No topical does that, and no reputable Korean formulator claims it does in a clinical brief. We translate the category as tone-evening, and we'd rather lose the search traffic than repeat language that misdescribes the product and carries a history we want no part of.",
      },
      {
        heading: "The four actives worth your money",
        body: "Niacinamide (2–5%) interrupts the transfer of pigment into skin cells; it's the best tolerated option and the reason it appears in almost everything on Olive Young shelves. Alpha-arbutin (1–2%) is a gentler, more stable relative of hydroquinone chemistry. Tranexamic acid targets the inflammation-driven pathway — the most relevant one for post-acne marks and melasma. Vitamin C, in a stable derivative or a well-packaged L-ascorbic acid, works on existing oxidation and adds daytime antioxidant protection. Pick one or two. Stacking all four is how people end up with irritation and, ironically, more pigment.",
      },
      {
        heading: "What actually determines your result",
        body: "Sunscreen. Every published protocol for pigmentation improvement assumes daily broad-spectrum protection, because UV re-triggers the exact pathway your active is trying to interrupt. Without it, you are bailing water with the tap running. Realistic timelines with consistent SPF: post-acne marks eight to twelve weeks; sun-driven unevenness three to six months; melasma is a management condition, not a fixable one, and warrants a dermatologist.",
      },
      {
        heading: "The Korean approach to pigment is preventative",
        body: "In Korea, the pigment conversation happens before the mark appears — anti-inflammatory care after a breakout, immediate sun avoidance after any procedure, and gentle handling rather than aggressive brightening. That's the part worth importing. Prevention is a far higher-yield strategy than trying to erase a mark that took years to form.",
      },
    ],
    keyPoints: [
      "Korean 'whitening' is a regulated claim about excess melanin — we call it tone-evening.",
      "Niacinamide, alpha-arbutin, tranexamic acid and vitamin C are the actives with real evidence.",
      "Pick one or two actives. Stacking causes irritation, which causes more pigment.",
      "Without daily SPF, no pigment routine works. Marks take 8 weeks to 6 months.",
    ],
    sources: [SOURCE_OY_INGREDIENTS, SOURCE_TGA, SOURCE_HWAHAE],
    related: ["deeper-skin-tones-k-beauty", "prevention-over-repair", "acids-frequency"],
  },

  /* ------------------------------------------------------------- INGREDIENTS */
  {
    slug: "pdrn-explained",
    pillar: "ingredients",
    meta: "Ingredient · Active",
    title: "PDRN: What Salmon DNA Actually Does For Your Skin",
    blurb: "The clinic ingredient that moved onto retail shelves — and where to start with it.",
    read: "6 min read",
    cover: featureSerum,
    coverAlt: "Macro shot of a serum dropper and glass vials",
    standfirst:
      "PDRN reviews on Olive Young grew 103% in six months. It arrived from dermatology clinics, not from social media — which is exactly why it's worth understanding properly.",
    sections: [
      {
        heading: "Where it came from",
        body: "Polydeoxyribonucleotide is a fragmented DNA chain, most commonly sourced from salmon milt because its nucleotide sequence is highly compatible with human DNA. In Korea it entered skincare sideways: it was already used in injectable skin-booster treatments (the ones marketed as 'salmon DNA' facials) before brands began formulating it into serums. That clinic-to-shelf pathway is the defining K-beauty pattern of 2025–26, alongside exosomes and spicules.",
      },
      {
        heading: "What it plausibly does topically",
        body: "In injectable form, PDRN activates adenosine A2A receptors, which supports fibroblast activity and modulates inflammation. Topically, the picture is more modest: the molecule is large, penetration is limited, and most retail formulas are supplying a hydrating, soothing, film-forming benefit alongside whatever receptor activity is achieved. Users consistently report plumpness, calmer redness and better bounce over four to eight weeks. What you should not expect is an injectable result from a $40 serum — and the better Korean brands don't claim one.",
      },
      {
        heading: "How Korean shoppers actually use it",
        body: "Not as a hero-of-everything. PDRN sits in the 'maintenance and recovery' slot: after a procedure, during barrier repair, or as an early-thirties preventative step before visible laxity appears. It's typically layered under a ceramide cream at night, and it is not stacked with strong acids on the same evening.",
      },
      {
        heading: "Who it suits",
        body: "Skin that is fatigued, dehydrated, post-procedure, or in that early stage where firmness is starting to shift. It's well tolerated by sensitive skin, which is part of the appeal. If you're dealing with active cystic acne or a badly damaged barrier, fix that first — PDRN is a maintenance ingredient, not a rescue one.",
      },
      {
        heading: "How to read the label",
        body: "Look for PDRN or sodium DNA reasonably high in the INCI list, not as the last ingredient before the preservative. Note whether the brand states a percentage or a source. And check the rest of the formula — a good PDRN serum earns its keep through the supporting cast (panthenol, ceramides, peptides) as much as the headline active.",
      },
    ],
    keyPoints: [
      "PDRN crossed over from injectable skin boosters — clinic first, retail second.",
      "Topically it's a hydration, soothing and recovery ingredient, not an injectable substitute.",
      "Best used as maintenance: post-procedure, barrier recovery, early firmness care.",
      "Don't pair with strong acids on the same night.",
    ],
    sources: [SOURCE_CLINIC, SOURCE_RANKINGS, SOURCE_KBS],
    related: ["centella-everywhere", "prevention-over-repair", "seoul-vs-tiktok"],
  },
  {
    slug: "centella-everywhere",
    pillar: "ingredients",
    meta: "Ingredient · Barrier",
    title: "Centella Asiatica: Why It's In Almost Everything We Stock",
    blurb: "Cica isn't a trend in Korea — it's the default baseline for daily skin insurance.",
    read: "5 min read",
    cover: petri,
    coverAlt: "Petri dishes containing green botanical extracts",
    standfirst:
      "Soothing ingredients now lead Olive Young's top-performing categories — and centella is the reason. Korean shoppers don't buy it to treat a problem. They buy it as insurance.",
    sections: [
      {
        heading: "What's actually in it",
        body: "Centella asiatica extract contains four notable compounds: madecassoside, asiaticoside, madecassic acid and asiatic acid — collectively 'TECA' or centella asiatica triterpenes. Madecassoside is the most studied for calming inflammation; asiaticoside is associated with wound-healing support and collagen signalling. When a Korean label says 'Cica' it may mean the whole extract or a specific isolate, and the isolates are typically the more expensive, more targeted option.",
      },
      {
        heading: "Why it dominates Korean shelves",
        body: "Three structural reasons, all of which apply to Australia. High rates of in-clinic procedures among people in their twenties to forties, so recovery products are constantly needed. A previous cycle of over-exfoliation and active overuse, leaving widespread reactive skin. And environmental stress — fine dust in Korea, UV and air conditioning here. Centella became the default not because it's exciting, but because it's the one ingredient almost nobody reacts to.",
      },
      {
        heading: "What to expect, honestly",
        body: "Reduced redness, faster settling after irritation, and a general sense of comfort rather than any dramatic transformation. It won't clear acne, fade pigment or firm skin. It makes everything else you're doing more tolerable, which is what allows the rest of a routine to work over months rather than being abandoned after a flare-up.",
      },
      {
        heading: "How to slot it in",
        body: "A centella ampoule after toner, or a cica cream as your final night step, or both during a barrier reset. It layers with virtually everything, including retinal and acids, and it's the ingredient we most often recommend to people whose skin has become unpredictable. If you own one 'insurance' product, make it this.",
      },
    ],
    keyPoints: [
      "Madecassoside and asiaticoside are the compounds doing the work.",
      "Korean shoppers buy centella as insurance, not treatment.",
      "It calms and stabilises — it won't clear acne or fade pigment.",
      "Layers safely with almost everything, including retinal.",
    ],
    sources: [SOURCE_OY_INGREDIENTS, SOURCE_HWAHAE],
    related: ["australian-barrier-climate", "pdrn-explained", "prevention-over-repair"],
  },
  {
    slug: "tga-vs-korean-sunscreen",
    pillar: "ingredients",
    meta: "Ingredient · Regulation",
    title: "TGA vs Korean Sunscreen Standards, Decoded",
    blurb: "Filters, testing and water resistance, compared side by side — and why labels differ.",
    read: "7 min read",
    cover: routineFlatlay,
    coverAlt: "Flat-lay of skincare bottles and sunscreen on a neutral surface",
    standfirst:
      "Australia regulates sunscreen as a therapeutic good. Korea regulates it as a functional cosmetic. Same bottle, two different legal universes — and it explains almost every confusing thing on a Korean SPF label.",
    sections: [
      {
        heading: "Two regulators, two philosophies",
        body: "In Australia, primary sunscreens fall under the TGA and must comply with AS/NZS 2604, including listing on the ARTG and adherence to an approved list of UV filters. In Korea, sunscreen is a 기능성화장품 — a functional cosmetic — regulated by the MFDS. Korea's approved filter list is broader and includes modern filters that have never been submitted for Australian approval, which is a paperwork and commercial issue, not a safety verdict.",
      },
      {
        heading: "Why Korean textures are better",
        body: "This is the honest answer to 'why does Korean sunscreen feel so much nicer'. Filters like uvinul A Plus, tinosorb S and tinosorb M are photostable, work at lower concentrations and dissolve well in cosmetically elegant bases. Australian formulas lean harder on zinc oxide, which is heavier, chalkier and more likely to cast. It's a formulation-freedom difference, not a diligence difference.",
      },
      {
        heading: "The rating systems, translated",
        body: "SPF measures UVB protection and reads the same in both markets. UVA is where they diverge: Australia uses a broad-spectrum test against AS/NZS 2604, while Korea uses PA+ through PA++++, based on persistent pigment darkening. PA++++ is the highest grade and roughly corresponds to strong UVA protection. Water resistance in Australia must be substantiated in defined 4-hour terms; Korean labels use their own claims and frequently make none at all — which matters at an Australian beach.",
      },
      {
        heading: "What this means for what you buy",
        body: "A Korean sunscreen is an excellent daily-wear product: superb texture, high compliance, minimal cast. For a full day outdoors — beach, sport, work site — an Australian-tested, water-resistant SPF50+ remains the right tool, because water resistance is the variable Korean labels rarely substantiate. Many of our customers run both, and we think that's the correct answer rather than a compromise.",
      },
      {
        heading: "How we handle it",
        body: "We list the filter system for every sunscreen we stock, state the PA grade, and say plainly whether it has substantiated water resistance. Where a Korean SPF is best used as a daily-wear product rather than a beach product, we say so on the listing instead of letting the SPF50+ number do the talking.",
      },
    ],
    keyPoints: [
      "Australia: therapeutic good under the TGA. Korea: functional cosmetic under the MFDS.",
      "Korea's broader approved filter list is why textures are lighter and cast is lower.",
      "PA++++ is Korea's highest UVA grade; Australia uses broad-spectrum testing instead.",
      "For long outdoor exposure, use an Australian water-resistant SPF50+.",
    ],
    sources: [SOURCE_TGA, SOURCE_ARPANSA, SOURCE_KBS],
    related: ["deeper-skin-tones-k-beauty", "humid-summer-layering", "prevention-over-repair"],
  },

  /* ---------------------------------------------------------------- ROUTINES */
  {
    slug: "humid-summer-layering",
    pillar: "routines",
    meta: "Routine · Order",
    title: "The Correct Layering Order For Humid Australian Summers",
    blurb: "When Korean seven-step logic breaks down at 35°C, and what to do instead.",
    read: "5 min read",
    cover: routineFlatlay,
    coverAlt: "Skincare bottles arranged on a warm neutral flat-lay",
    standfirst:
      "Layering order is not a ritual. It's a physics problem: thinnest to thickest, water before oil, with the environment deciding how much of the last step you actually need.",
    sections: [
      {
        heading: "The rule that always holds",
        body: "Water-based before oil-based, thin before thick. Anything with a heavier occlusive load will block what comes after it, so the sequence is cleanse, hydrate, treat, seal, protect. Everything else is negotiable.",
      },
      {
        heading: "The Brisbane summer version",
        body: "Water cleanser (oil cleanser only at night). Hydrating toner, pressed in with hands rather than a cotton pad. One lightweight serum. A gel moisturiser — small amount, but do not skip it, because your humectants still need a lid. SPF. Five steps. In genuine humidity, the mistake isn't too many steps; it's a moisturiser that's too heavy, which traps sweat and sebum and produces the congestion people blame on 'K-beauty being too rich'.",
      },
      {
        heading: "The Melbourne winter version",
        body: "Same skeleton, heavier back half. Oil cleanser plus a low-pH water cleanser at night, a more emollient toner or essence, your treatment, then a ceramide cream — and on very dry weeks a thin slugging layer over the top. Indoor heating is as dehydrating as air conditioning, so winter is when the occlusive step earns its keep.",
      },
      {
        heading: "Where to put the actives",
        body: "Retinal and strong acids at night only, never together, and never on a night your skin already feels tender. Vitamin C in the morning under sunscreen, where its antioxidant effect is useful. Everything else — hydrators, soothing ampoules, peptides, PDRN — can go either time of day.",
      },
      {
        heading: "The wait-time question",
        body: "You do not need to wait sixty seconds between layers. You need each layer to stop being wet, so the next one spreads rather than pills. In humid weather that's slower; run fewer, better-chosen layers instead of standing in the bathroom waiting.",
      },
    ],
    keyPoints: [
      "Thin to thick, water before oil — everything else is optional.",
      "Humid climate: lighter moisturiser, never no moisturiser.",
      "Cold or heated indoor air: add the occlusive back in.",
      "Actives at night, vitamin C in the morning, never acids plus retinal together.",
    ],
    sources: [SOURCE_BOM, SOURCE_ARPANSA, SOURCE_OY_INGREDIENTS],
    related: ["acids-frequency", "climate-zone-routines", "australian-barrier-climate"],
  },
  {
    slug: "acids-frequency",
    pillar: "routines",
    meta: "Routine · Acids",
    title: "How Often Melanin-Rich Skin Should Actually Use Acids",
    blurb: "Frequency guidance by skin type and concern — and the pigment risk nobody mentions.",
    read: "6 min read",
    cover: portraitDeep,
    coverAlt: "Close portrait showing even, healthy skin texture",
    standfirst:
      "The exfoliation advice circulating online was largely written for skin that doesn't pigment in response to irritation. For melanin-rich skin, the calculus is different.",
    sections: [
      {
        heading: "The core risk",
        body: "Deeper skin isn't more fragile, but its melanocytes are more responsive to inflammatory signals. Any irritation — chemical burn, over-exfoliation, aggressive scrub — can trigger post-inflammatory hyperpigmentation that outlasts the original problem by months. So the exfoliation question isn't 'what can my skin tolerate today', it's 'what won't leave a mark in six weeks'.",
      },
      {
        heading: "A frequency schedule that works",
        body: "Dry or sensitive skin: a low-strength PHA or lactic acid once weekly, maximum. Normal or combination: a mid-strength AHA once or twice weekly. Oily or congested: BHA (salicylic acid) two to three times weekly, applied only where you're congested rather than across the whole face. Actively breaking out or barrier-compromised: none, until it settles. Nobody needs a daily acid toner, regardless of what the bottle suggests.",
      },
      {
        heading: "Choose the acid for the job",
        body: "Salicylic acid is oil-soluble and gets into pores — the right choice for blackheads and congestion. Glycolic penetrates fastest and carries the highest irritation risk; it's the one most likely to leave PIH. Lactic and mandelic are larger, slower and gentler, and mandelic in particular is often recommended for deeper skin. PHAs (gluconolactone, lactobionic acid) are the gentlest and also humectant, which suits sensitive skin.",
      },
      {
        heading: "The Korean pattern",
        body: "Korean routines lean toward frequent gentle care over occasional aggressive care — low-concentration daily-safe formulas, enzyme powders, or a weekly pad rather than a monthly peel. Combined with rigorous sun protection, that's the lower-risk model for anyone who pigments easily.",
      },
      {
        heading: "Non-negotiables",
        body: "Sunscreen every single day you exfoliate and for the days after. One new active at a time, with a two-week gap. Stop immediately at stinging, tightness or new redness — pushing through is how a two-week problem becomes a six-month one.",
      },
    ],
    keyPoints: [
      "Irritation on melanin-rich skin often ends as pigment — frequency matters more than strength.",
      "Weekly for dry/sensitive, 1–2× for normal, 2–3× BHA for oily. Never daily.",
      "Mandelic, lactic and PHAs are lower-risk than glycolic.",
      "SPF on every exfoliation day and the days after — no exceptions.",
    ],
    sources: [SOURCE_OY_INGREDIENTS, SOURCE_ARPANSA, SOURCE_HWAHAE],
    related: ["pigmentation-language", "deeper-skin-tones-k-beauty", "humid-summer-layering"],
  },
  {
    slug: "climate-zone-routines",
    pillar: "routines",
    meta: "Routine · Climate",
    title: "Rebuilding Your Routine For Melbourne Winter vs Brisbane Summer",
    blurb: "How a routine should shift across Australian climate zones — without rebuying everything.",
    read: "7 min read",
    cover: featureSerum,
    coverAlt: "Serum bottles and droppers on a soft neutral backdrop",
    standfirst:
      "Most Australians need two routines a year, not two shelves of product. Here's the smallest set of changes that covers the full climate range.",
    sections: [
      {
        heading: "The three variables that matter",
        body: "Ambient humidity, indoor air conditioning or heating, and UV load. Everything else — temperature, wind, altitude — is secondary. If you can name where you sit on those three, you can adjust a routine in about four minutes.",
      },
      {
        heading: "Humid subtropical: Brisbane, Darwin, coastal NSW",
        body: "High humidity, high UV, heavy air-con use indoors. Go lighter on occlusives, keep hydration high, and don't over-cleanse to chase the shine — stripping oil in humidity triggers rebound production. Gel moisturiser, fluid or hybrid sunscreen, blotting rather than rewashing. If you're in air conditioning eight hours a day, treat those hours as a dry climate and keep a hydrating mist and a small cream at your desk.",
      },
      {
        heading: "Temperate with big swings: Melbourne, Adelaide, Canberra",
        body: "This is the hardest environment to build for, because you may need both routines in a single week. Keep two moisturisers on the shelf — one gel, one ceramide cream — and choose in the morning based on how your skin feels rather than the calendar. Adelaide's harder water also argues for a low-pH cleanser and a toner immediately after washing.",
      },
      {
        heading: "Dry heat: Perth summer, inland and regional",
        body: "Low humidity plus extreme UV is the most barrier-hostile combination in the country. Humectants alone will backfire — layer hydration then seal it every time. SPF reapplication is not optional here; if you're outdoors, treat it as a scheduled task rather than an intention.",
      },
      {
        heading: "Cool and heated: Hobart, alpine, southern winter",
        body: "Indoor heating dries skin as effectively as air conditioning. Richer cleanser, an emollient essence, ceramide cream, and occasional overnight occlusion. UV is lower but not zero — clear winter days still deliver damaging UV, so SPF stays in the routine year-round.",
      },
      {
        heading: "The seasonal swap list",
        body: "Change these four things and leave the rest alone: cleanser richness, moisturiser weight, whether you add an occlusive final step, and active frequency. Keep your cleanser type, your treatment serum and your sunscreen constant so you can actually tell what's working. Consistency is what produces results — the seasonal adjustment just stops your routine fighting the weather.",
      },
    ],
    keyPoints: [
      "Only three variables matter: humidity, indoor air, UV load.",
      "Two moisturisers beat two full routines — choose by feel each morning.",
      "Air-conditioned offices count as a dry climate, even in Brisbane.",
      "Swap cleanser richness, moisturiser weight, occlusive step and active frequency. Nothing else.",
    ],
    sources: [SOURCE_BOM, SOURCE_ARPANSA, SOURCE_TGA],
    related: ["humid-summer-layering", "australian-barrier-climate", "prevention-over-repair"],
  },

  /* ------------------------------------------------------------ SEOUL SIGNAL */
  {
    slug: "prevention-over-repair",
    pillar: "seoul",
    meta: "Seoul Signal · Philosophy",
    title: "미리 관리: Korea's Prevention-First Skincare Philosophy",
    blurb: "The idea that reframes everything — fix it before it becomes a problem.",
    read: "7 min read",
    cover: portraitDeep,
    coverAlt: "Portrait showing calm, healthy, well-maintained skin",
    standfirst:
      "Ask a Korean shopper what they want from skincare and the answer is rarely 'glass skin'. It's 관리 — management. Skin kept healthy, calm and unbothered, so that nothing ever needs correcting.",
    sections: [
      {
        heading: "The mistranslation at the centre of Western K-beauty",
        body: "Glass skin (유리 피부) is a photographic description that Western media turned into a goal. Inside Korea it functions the way 'good hair day' does in English — a nice outcome, not a life plan. The organising idea is 피부 관리: skin management. Ongoing, unglamorous, preventative. Twice-yearly reassessment rather than a new hero product every month.",
      },
      {
        heading: "What prevention-first looks like in practice",
        body: "Sun protection framed as anti-ageing rather than burn prevention, and reapplied. Soothing ingredients bought as insurance, not as treatment — which is why centella now leads Olive Young's top-performing categories rather than sitting in a sensitive-skin niche. Actives introduced early at low strength and maintained for years, rather than started at high strength once damage is visible. And a strong cultural aversion to irritation: if a product stings, it's the wrong product, full stop.",
      },
      {
        heading: "The data behind it",
        body: "Hwahae, Korea's largest review platform, sits on more than ten million reviews across roughly 430,000 products, and Olive Young holds over 85% of the domestic health-and-beauty retail market. Korean shoppers arrive at the shelf having already read ingredient breakdowns and review histories; the 2026 Olive Young pattern shows purchases clustering around soothing, barrier and recovery benefits rather than around whatever is trending internationally. The buying behaviour matches the philosophy.",
      },
      {
        heading: "Why this matters more in Australia than in Korea",
        body: "Our UV load is dramatically higher, our indoor air is drier, and our access to Korean products has historically lagged the domestic market by twelve to eighteen months. Prevention-first is not a lifestyle aesthetic here — it's the rational strategy for the environment. And it happens to be far cheaper than corrective skincare.",
      },
      {
        heading: "How to apply it this week",
        body: "Pick a sunscreen you like enough to reapply. Add one soothing product as a permanent fixture, not a rescue. Cut your active count until every product has a job you can name. Then leave it alone for eight weeks. Prevention is undramatic by design, which is precisely why it doesn't do well on social media — and why it works.",
      },
    ],
    keyPoints: [
      "The Korean goal is 관리 — management — not glass skin.",
      "Soothing products are bought as insurance, before problems appear.",
      "Low-strength actives maintained for years beat high-strength rescue attempts.",
      "If it stings, it's the wrong product.",
    ],
    sources: [SOURCE_HWAHAE, SOURCE_OY_INGREDIENTS, SOURCE_RANKINGS],
    related: ["seoul-vs-tiktok", "centella-everywhere", "australian-barrier-climate"],
  },
  {
    slug: "seoul-vs-tiktok",
    pillar: "seoul",
    meta: "Seoul Signal · Data",
    title: "What's Actually Selling In Seoul (And What's Only Big On TikTok)",
    blurb: "The gap between domestic Korean demand and the global K-beauty feed, in numbers.",
    read: "6 min read",
    cover: petri,
    coverAlt: "Laboratory dishes with ingredient samples on a clean surface",
    standfirst:
      "There is a measurable gap between what Korean women buy and what the internet says Korean women buy. Reading the domestic data instead of the feed is the single most useful thing an Australian shopper can do.",
    sections: [
      {
        heading: "The local-versus-global gap is real and documented",
        body: "Some brands with enormous international visibility barely register in Korean domestic rankings; the reverse is also true. It's common enough that Korean beauty platforms now publish guidance on how to check whether a brand is genuinely used at home, and r/KoreanBeauty threads asking 'is this actually popular in Korea?' appear constantly. The mechanism is simple: a brand can build a global-first business on export marketing without ever winning a Seoul shelf.",
      },
      {
        heading: "How to check for yourself",
        body: "Three domestic signals. Hwahae ranking and review volume — Korean-language reviews, not translated ones. Olive Young Korea's category best-sellers, which are transaction-driven rather than editorial. And whether the brand holds physical shelf space in Olive Young stores at all, since roughly 85% of the domestic market runs through them. A brand strong on all three is genuinely used at home.",
      },
      {
        heading: "What the domestic data is showing right now",
        body: "Clinic-derived actives are the defining movement: PDRN product counts up around 43% with reviews up 103%, and exosome reviews up 229% over six months on Olive Young. Soothing and barrier categories continue to lead overall purchase volume. Sunscreen, serums and ampoules remain the strongest categories in trend reporting. Notably, skincare accounted for around 60% of exhibitor submissions at Cosmo Beauty Seoul 2026 — the market is still fundamentally a skincare market, not a makeup one.",
      },
      {
        heading: "What travels badly",
        body: "Ten-step maximalism, which most Korean shoppers abandoned years ago. Aggressive daily exfoliation, which runs directly counter to the prevention-first norm. And single-product miracle framing, which the Korean market's ingredient-literate shoppers largely ignore. When a routine goes viral internationally, it's worth checking whether anyone in Seoul is actually doing it.",
      },
      {
        heading: "Where Australia sits",
        body: "Historically we've received the global-marketing version of K-beauty twelve to eighteen months after Korean shelves — filtered through whichever products were easiest to export. Our sourcing brief is the opposite: track the domestic rankings, cross-check Hwahae review volume, then bring in what Korean women are actually repurchasing. Not what's trending in a fifteen-second video.",
      },
    ],
    keyPoints: [
      "Global visibility and Korean domestic sales are frequently unrelated.",
      "Check Hwahae reviews, Olive Young Korea rankings and physical shelf space.",
      "Clinic-derived actives (PDRN, exosomes) are the current domestic movement.",
      "Ten-step maximalism and daily acids are largely a Western export artefact.",
    ],
    sources: [SOURCE_HWAHAE, SOURCE_CLINIC, SOURCE_RANKINGS, SOURCE_KBS],
    related: ["prevention-over-repair", "pdrn-explained", "centella-everywhere"],
  },
];

export function getLearnArticle(slug: string) {
  return learnArticles.find((a) => a.slug === slug);
}

export function articlesByPillar(pillar: LearnArticle["pillar"]) {
  return learnArticles.filter((a) => a.pillar === pillar);
}
