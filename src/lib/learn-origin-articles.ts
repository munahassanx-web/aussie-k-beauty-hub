// Long-form Learn content: plant/ingredient origin stories, a new-launch
// watchlist, and "what not to use" guides. Written to be extractable by AI
// answer engines — self-contained sections, plain claims, cited sources.

import featureSerum from "@/assets/learn-feature-serum.jpg";
import petri from "@/assets/learn-petri.jpg";
import portraitDeep from "@/assets/learn-portrait-deep.jpg";
import routineFlatlay from "@/assets/learn-routine-flatlay.jpg";
import type { LearnArticle } from "@/lib/learn-articles";

const SRC_HWAHAE = {
  label: "Hwahae (화해) — Korea's largest beauty review platform, 2026 trend report",
  href: "https://business.hwahae.co.kr/insight/trendreport-2026-the-new-edition/",
};
const SRC_OY = {
  label: "Olive Young 2026 top ingredient benefit groups (Korean consumer purchase behaviour)",
  href: "https://kessence.kr/olive-young-2026-top-ingredients/",
};
const SRC_KBS = {
  label: "Cosmo Beauty Seoul 2026 K-Beauty Trend Report (4,700+ products analysed)",
  href: "https://en.thekbs.co.kr/news/articleView.html?idxno=16154",
};
const SRC_CLINIC = {
  label: "Trendier AI — PDRN reviews +103%, exosome reviews +229% on Olive Young",
  href: "https://blog.trendier.ai/pdrn-exosomes-clinic-skincare-kbeauty-2026/",
};
const SRC_TGA = {
  label: "TGA — Australian Regulatory Guidelines for Sunscreens (ARGS)",
  href: "https://www.tga.gov.au/resources/resource/guidance/australian-regulatory-guidelines-sunscreens-args",
};
const SRC_KFDA = {
  label: "Korean MFDS — functional cosmetics ingredient framework (기능성화장품)",
  href: "https://www.mfds.go.kr/eng/index.do",
};

export const originArticles: LearnArticle[] = [
  /* ------------------------------------------------ INGREDIENT ORIGIN STORIES */
  {
    slug: "ginseng-origin-story",
    pillar: "ingredients",
    meta: "Origin story · Ginseng",
    title: "Ginseng: A Thousand Years Of Korean Cultivation, Now In A Serum",
    blurb: "Where Korean red ginseng came from, what it does topically, and who it suits.",
    read: "7 min read",
    cover: featureSerum,
    coverAlt: "Amber-toned serum bottle on a warm neutral surface",
    standfirst:
      "Ginseng (인삼) is the oldest ingredient in Korean skincare and the one most loaded with cultural weight. Here is the honest version: where it comes from, what the topical extract actually does, and when it is worth paying for.",
    sections: [
      {
        heading: "Where it comes from",
        body: "Panax ginseng has been cultivated on the Korean peninsula for well over a thousand years, with Goryeo-era records describing it as a tribute good and Joseon-era medical texts prescribing it for depletion and fatigue. The plant takes four to six years in the ground before harvest, which is why it has always been expensive. 'Red ginseng' (홍삼) is the same root, steamed and dried — a preservation method that also changes its chemistry, concentrating a group of saponins called ginsenosides.",
      },
      {
        heading: "What it does on skin",
        body: "Topically, ginseng extract is used as an antioxidant and circulation-supporting ingredient. Ginsenosides are the active fraction of interest, and formulas usually pair them with humectants so the result feels firming and plumped rather than tightening. In practical terms: it is a comfort-and-radiance ingredient for dull, tired, dehydrated or mature skin. It is not an exfoliant, not a pigment inhibitor, and not a replacement for retinal.",
      },
      {
        heading: "Why Korean brands use it so heavily",
        body: "Two reasons, and only one is scientific. Ginseng carries enormous domestic trust — it is what a Korean grandmother recommends — so it anchors 'heritage' lines the way rose does in French skincare. It also genuinely performs as a sensorially rich antioxidant base that suits the prevention-first Korean approach: something you use daily for years, not a corrective active you cycle.",
      },
      {
        heading: "How to use it in Australia",
        body: "Use ginseng products in the evening, after your hydrating layer and before moisturiser, or in the morning under sunscreen if the texture is light enough. Ginseng formulas made for Korean winters can feel heavy in Brisbane or Darwin humidity — choose a serum or ampoule texture rather than a balm-cream if you live somewhere sticky. It layers safely with niacinamide, peptides, hyaluronic acid and PDRN.",
      },
      {
        heading: "Who should skip it",
        body: "Anyone with a known reaction to Araliaceae plants, and anyone whose priority right now is active acne — ginseng formulas are often rich, and richness is the wrong lever for congestion. If your main concern is barrier damage or stinging, start with centella or ceramides and add ginseng once the skin is calm.",
      },
    ],
    keyPoints: [
      "Panax ginseng has been cultivated in Korea for 1,000+ years; roots are harvested at 4–6 years.",
      "Red ginseng is steamed and dried, which concentrates ginsenosides.",
      "Topically it is an antioxidant, radiance and comfort ingredient — not an exfoliant or pigment inhibitor.",
      "Best for dull, dehydrated or mature skin; choose light textures in humid Australian climates.",
      "Layers safely with niacinamide, peptides, hyaluronic acid and PDRN.",
    ],
    sources: [SRC_OY, SRC_HWAHAE, SRC_KFDA],
    related: ["prevention-over-repair", "pdrn-explained", "centella-everywhere"],
  },
  {
    slug: "mugwort-origin-story",
    pillar: "ingredients",
    meta: "Origin story · Mugwort",
    title: "Mugwort (쑥): From Korean Founding Myth To Calming Ampoule",
    blurb: "Why ssuk is in every Korean soothing line, and what it can and can't do.",
    read: "6 min read",
    cover: petri,
    coverAlt: "Laboratory dishes holding plant extract samples",
    standfirst:
      "Mugwort — ssuk (쑥) — appears in Korea's founding myth, in bathhouse steam rooms, in rice cakes and now in about half the country's soothing skincare. The tradition is real. So is the limit of what it does.",
    sections: [
      {
        heading: "Where it comes from",
        body: "Artemisia is woven through Korean daily life: the Dangun founding myth has a bear eating mugwort and garlic to become human; ssuk-tteok (mugwort rice cake) is eaten seasonally; and ssuk steam baths (좌훈) have been used for generations. Skincare inherited it directly from that folk-medicine context, and the best-known modern versions use mugwort grown on Ganghwa Island, prized domestically for its potency.",
      },
      {
        heading: "What it does on skin",
        body: "Mugwort extract is used as a soothing and antioxidant ingredient. Its useful fractions include flavonoids and chlorogenic acid, and it is typically formulated at high percentages in essences, ampoules and masks aimed at visibly reactive, red or post-breakout skin. It calms the look of irritation and supports a comfortable barrier. It does not treat eczema, rosacea or dermatitis — those are medical conditions and belong with a doctor.",
      },
      {
        heading: "Mugwort versus centella",
        body: "They overlap but are not interchangeable. Centella (cica) is the better-studied barrier-recovery ingredient and the safer default for compromised skin. Mugwort is the more astringent, slightly more 'active-feeling' soother, often preferred by oily and congested skin because the textures are usually lighter and less occlusive. If your skin is stinging and broken, start with centella. If your skin is oily, reactive and congested, mugwort suits better.",
      },
      {
        heading: "How to use it in Australia",
        body: "Evening, after cleansing, as a first hydrating layer or a treatment ampoule. Mugwort products are often fragrance-light and low-pH, which makes them useful during Australian summer when heat rash and post-sun redness are common. Do not use a mugwort essence as your only moisturiser — it soothes, it does not seal.",
      },
      {
        heading: "Who should skip it",
        body: "Mugwort is in the Asteraceae family alongside ragweed and chamomile. If you have hay fever triggered by ragweed or a known daisy-family allergy, patch test on the inner forearm for three days first.",
      },
    ],
    keyPoints: [
      "Mugwort (ssuk) comes from Korean folk medicine, steam baths and the Dangun founding myth.",
      "Used as a soothing, antioxidant ingredient for reactive, oily and post-breakout skin.",
      "Centella is the safer default for damaged barriers; mugwort suits oily reactive skin.",
      "Asteraceae family — patch test if you react to ragweed or chamomile.",
    ],
    sources: [SRC_HWAHAE, SRC_OY],
    related: ["centella-everywhere", "australian-barrier-climate", "heartleaf-origin-story"],
  },
  {
    slug: "heartleaf-origin-story",
    pillar: "ingredients",
    meta: "Origin story · Heartleaf",
    title: "Heartleaf (Houttuynia Cordata): The Weed That Became A Calming Category",
    blurb: "Eosuchou's folk-medicine roots, its role in oily-sensitive routines, and honest limits.",
    read: "6 min read",
    cover: routineFlatlay,
    coverAlt: "Flat lay of a minimal Korean skincare routine on linen",
    standfirst:
      "Heartleaf — eosuchou (어성초), literally 'fishy-smelling herb' — grows wild across Korea and Japan and was used as a poultice long before it anchored a modern soothing category. It is the ingredient behind most of the current oily-sensitive skincare boom.",
    sections: [
      {
        heading: "Where it comes from",
        body: "Houttuynia cordata is a hardy creeping plant found across East Asia. In Korean and Japanese folk medicine it was brewed as tea and applied as a poultice for inflammation, boils and skin eruptions — the raw leaf's strong smell is where its Korean name comes from. Modern cosmetic extracts are purified and deodorised, which is why a heartleaf toner smells of almost nothing.",
      },
      {
        heading: "What it does on skin",
        body: "Heartleaf extract is used to calm the appearance of redness and to support skin that is simultaneously oily and sensitive — a combination Western skincare historically handled badly by pushing harsh actives. Its usable actives include quercitrin and other flavonoids. Formulas are usually watery, fragrance-free and high-percentage: 70–80% extract toners are common.",
      },
      {
        heading: "Why it took over Korean shelves",
        body: "It solved a real gap. Oily-sensitive skin needed something that reduced visible irritation without occlusion or alcohol, and heartleaf delivers a light, comfortable feel at high concentration for a low ingredient cost. That combination made it the anchor for entire brand lines rather than a single hero product, and it is now a staple in the Korean soothing category alongside centella.",
      },
      {
        heading: "How to use it in Australia",
        body: "It works as a daily hydrating toner step morning and night, especially in Sydney, Brisbane and Perth summers where heavier soothing creams feel unbearable. Pair it with a light gel moisturiser and sunscreen. It layers safely with niacinamide, hyaluronic acid, panthenol and BHA, and it is a good buffer product on nights you use a stronger active.",
      },
      {
        heading: "Honest limits",
        body: "Heartleaf is a soother, not an acne treatment. It will not clear comedones, it will not replace benzoyl peroxide or a prescription retinoid, and marketing that implies it treats acne is overreaching. Use it to keep skin calm while a real treatment does the work.",
      },
    ],
    keyPoints: [
      "Houttuynia cordata (eosuchou) was a Korean and Japanese folk poultice for skin inflammation.",
      "Modern extracts are deodorised and often used at 70–80% in watery toners.",
      "Best for oily-sensitive skin that cannot tolerate rich soothing creams.",
      "It calms visible redness; it does not treat acne.",
    ],
    sources: [SRC_HWAHAE, SRC_OY, SRC_KFDA],
    related: ["mugwort-origin-story", "centella-everywhere", "humid-summer-layering"],
  },
  {
    slug: "rice-ferment-origin-story",
    pillar: "ingredients",
    meta: "Origin story · Rice ferment",
    title: "Rice Water And Ferment Filtrates: The Oldest Korean Beauty Habit",
    blurb: "From ssal-tteumul to galactomyces — what fermentation adds, and what it doesn't.",
    read: "7 min read",
    cover: petri,
    coverAlt: "Petri dishes containing fermented skincare samples",
    standfirst:
      "Rinsing your face with the cloudy water left from washing rice — ssal-tteumul (쌀뜨물) — predates the Korean cosmetics industry by centuries. Fermentation turned that habit into a category. Here is what the modern version actually adds.",
    sections: [
      {
        heading: "Where it comes from",
        body: "Rice water was a household skincare and haircare step across Korea, Japan and China long before commercial cosmetics existed: the starchy rinse water was reused rather than discarded. Korean brands industrialised it by fermenting rice with yeasts and bacteria, a process borrowed conceptually from makgeolli and other traditional ferments, and by the 1980s Japanese and Korean brands were selling filtrate-based essences built on the observation that sake brewers had notably soft hands.",
      },
      {
        heading: "What fermentation actually does",
        body: "Fermentation breaks large molecules into smaller ones and generates by-products: amino acids, organic acids, vitamins, peptides and beta-glucan. The practical effects are better sensorial absorption, mild surface exfoliation from the organic acids, and added humectancy. Common INCI names to look for are Saccharomyces ferment filtrate, Galactomyces ferment filtrate, Lactobacillus ferment and Oryza sativa (rice) extract.",
      },
      {
        heading: "What it does not do",
        body: "Fermentation is not an active category by itself. A ferment filtrate is not a retinoid, not a pigment inhibitor, and not proven to remodel collagen. Claims that fermented essences 'renew skin at a cellular level' outrun the evidence. Treat rice ferment as an excellent daily conditioning and hydration step — the thing that makes everything after it work better and feel better.",
      },
      {
        heading: "How to use it in Australia",
        body: "Use a ferment essence as the step directly after cleansing, on damp skin, morning and night. It suits dull, dehydrated or texture-prone skin and is safe for most people daily. In hard-water areas — much of Adelaide and Perth — a hydrating ferment essence noticeably reduces the tight, squeaky feeling left after washing.",
      },
      {
        heading: "Who should be careful",
        body: "Galactomyces in particular is not universally tolerated: some people with fungal acne (malassezia folliculitis) or yeast-sensitive skin react to it. If you get small uniform bumps on the forehead or chest after starting a ferment essence, stop and switch to a plain humectant toner.",
      },
    ],
    keyPoints: [
      "Rice water (ssal-tteumul) was a household Korean beauty step for centuries.",
      "Fermentation adds amino acids, organic acids, vitamins, peptides and beta-glucan.",
      "Ferment essences are conditioning and hydrating steps, not corrective actives.",
      "Galactomyces can trigger reactions in yeast-sensitive or fungal-acne-prone skin.",
    ],
    sources: [SRC_HWAHAE, SRC_OY],
    related: ["prevention-over-repair", "humid-summer-layering", "ginseng-origin-story"],
  },
  {
    slug: "snail-mucin-origin-story",
    pillar: "ingredients",
    meta: "Origin story · Snail mucin",
    title: "Snail Mucin: How A Farming Observation Became A K-Beauty Staple",
    blurb: "Snail secretion filtrate explained — what it is, how it's collected, what it treats.",
    read: "6 min read",
    cover: featureSerum,
    coverAlt: "Clear viscous serum on a neutral background",
    standfirst:
      "Snail secretion filtrate is the ingredient people find hardest to take seriously and the one most likely to stay in their routine. Its history is agricultural, its function is unglamorous, and it does one job very well.",
    sections: [
      {
        heading: "Where it comes from",
        body: "The modern cosmetic use traces to observations by snail farmers in Chile and Europe in the late twentieth century, who noticed unusually smooth hands and fast-healing cuts. Korean brands industrialised it in the 2000s and made it a mainstream category, and it remains one of the most recognisable K-beauty exports. Reputable producers collect the filtrate without harming the animals, in dark, humid, low-stress conditions, then filter and preserve it.",
      },
      {
        heading: "What it does on skin",
        body: "Snail secretion filtrate is a hydrating, film-forming ingredient containing glycoproteins, glycosaminoglycans, hyaluronic acid, allantoin and trace zinc. It makes skin feel plump, comfortable and slightly cushioned, and it supports the healing appearance of post-acne marks and dry, tight skin. It is a hydrator and soother that punches above its weight — not an anti-ageing active on its own.",
      },
      {
        heading: "Reading the label",
        body: "Percentage is the number that matters. High-percentage essences list snail secretion filtrate as the first ingredient; products that list it after preservatives are using it as a marketing garnish. Texture should be slightly stringy and viscous. Fragrance-free versions are widely available and preferable for reactive skin.",
      },
      {
        heading: "How to use it in Australia",
        body: "Use it as an essence step after cleansing and toner, morning or night, on damp skin. Its film-forming quality is a real advantage in dry Melbourne winters and in air-conditioned offices. In very humid weather it can feel tacky — apply less, and seal with a gel rather than a cream.",
      },
      {
        heading: "Who should skip it",
        body: "People with a shellfish or mollusc allergy should avoid it, and anyone who objects to animal-derived ingredients should choose a polyglutamic acid or beta-glucan essence instead, which delivers a similar cushioned hydration.",
      },
    ],
    keyPoints: [
      "Snail secretion filtrate contains glycoproteins, glycosaminoglycans, hyaluronic acid and allantoin.",
      "It is a hydrator, soother and film-former — not a standalone anti-ageing active.",
      "Look for it as the first listed ingredient; percentage drives results.",
      "Avoid with mollusc allergy; polyglutamic acid or beta-glucan are vegan alternatives.",
    ],
    sources: [SRC_HWAHAE, SRC_OY],
    related: ["australian-barrier-climate", "rice-ferment-origin-story", "centella-everywhere"],
  },
  /* ----------------------------------------------------- WHAT NOT TO USE */
  {
    slug: "what-not-to-mix",
    pillar: "routines",
    meta: "Routine · What not to use",
    title: "What Not To Mix: The Korean Skincare Combinations To Avoid",
    blurb: "A plain list of ingredient pairings to separate, and the ones that are perfectly safe.",
    read: "8 min read",
    cover: routineFlatlay,
    coverAlt: "Skincare products arranged in routine order on a pale surface",
    standfirst:
      "Most 'do not mix' advice online is copied from a decade-old chart and half of it is wrong. Here is the short, accurate version: what genuinely should not share a routine, what only needs spacing, and what you can freely layer.",
    sections: [
      {
        heading: "Separate these — same night is too much",
        body: "Retinal or retinol with AHA or BHA exfoliants: both increase turnover and the combination is the most common cause of a damaged barrier. Alternate nights. Retinal with high-strength L-ascorbic acid vitamin C: split them across morning and evening rather than stacking. Two different exfoliating acids in one session: choose one, two to three times a week maximum. Benzoyl peroxide with retinal in the same application: use one in the morning and one at night unless the product is specifically formulated to combine them.",
      },
      {
        heading: "These are fine together, despite the myths",
        body: "Niacinamide and vitamin C can be used together — the flushing claim comes from a 1960s study on raw, heated ingredients, not modern formulas. Niacinamide with hyaluronic acid, peptides, ceramides, panthenol, centella and PDRN is safe and common. Sunscreen over any serum is safe; the 'sunscreen deactivates vitamin C' claim is not supported for finished formulations. Layering multiple hydrators is safe, just unnecessary past a point.",
      },
      {
        heading: "Products to stop entirely when skin is irritated",
        body: "If your skin is stinging, flaking, shiny-tight or reacting to products it used to tolerate, pause everything except a gentle cleanser, a barrier moisturiser with ceramides or centella, and sunscreen. That means stopping acids, retinal, scrubs, high-strength vitamin C, clay masks, fragranced products and any device. Hold that for seven to ten days, then reintroduce one product every five to seven days.",
      },
      {
        heading: "Habits that quietly cause damage",
        body: "Daily exfoliating toner pads on top of an existing active routine. Using a foaming cleanser twice in the morning and night. Hot water. Layering three products that all contain fragrance. Treating a sheet mask as a daily necessity when the essence inside is fragranced. Buying a second product to fix a reaction caused by the first, instead of removing the first.",
      },
      {
        heading: "The Australian additions",
        body: "Two local specifics. First, if you use a physical or chemical exfoliant, your sunscreen becomes non-negotiable rather than optional — Australian UV is far stronger than Seoul's for most of the year. Second, hard water in parts of Adelaide, Perth and regional areas makes cleansers feel more stripping than they are; switching to a low-pH cleanser fixes what looks like an active-related reaction.",
      },
      {
        heading: "The rule that replaces the chart",
        body: "One new product at a time, five to seven days apart, and no more than one strong active per session. If you cannot name what a product is doing for you, it is a candidate for removal — not for a companion product.",
      },
    ],
    keyPoints: [
      "Alternate nights: retinal/retinol with AHA or BHA exfoliants.",
      "Split AM/PM: strong vitamin C with retinal; benzoyl peroxide with retinal.",
      "Never two exfoliating acids in one session.",
      "Safe together: niacinamide, vitamin C, hyaluronic acid, peptides, ceramides, panthenol, centella, PDRN.",
      "When irritated: cleanser, barrier moisturiser and sunscreen only for 7–10 days.",
      "Reintroduce one product every 5–7 days.",
    ],
    sources: [SRC_HWAHAE, SRC_OY, SRC_TGA],
    related: ["acids-frequency", "australian-barrier-climate", "prevention-over-repair"],
  },
  /* ----------------------------------------------------- NEW LAUNCH WATCHLIST */
  {
    slug: "new-launch-watchlist",
    pillar: "seoul",
    meta: "Seoul Signal · Watchlist",
    title: "The New-Launch Watchlist: What's Landing In Seoul Before It Reaches Australia",
    blurb: "The categories moving fastest in Korea right now, and which ones are worth waiting for.",
    read: "7 min read",
    cover: portraitDeep,
    coverAlt: "Close portrait of clear, well-hydrated skin in daylight",
    standfirst:
      "Australian retail usually receives Korean launches twelve to eighteen months late, filtered by whoever holds the distribution. This is what the domestic signals are showing now, and our read on what deserves your money.",
    sections: [
      {
        heading: "Clinic-derived actives are the defining movement",
        body: "PDRN and exosome-positioned products are the clearest growth story in Korean skincare: PDRN product counts on Olive Young are up roughly 43% with reviews up 103%, and exosome reviews up 229% over a six-month window. The consumer logic is 'clinic results at home'. Our read: PDRN serums are worth buying now — they are well-formulated repair products even if you ignore the marketing. Exosome claims in cosmetics are far looser than in clinical settings; judge those products on their supporting formula, not the headline.",
      },
      {
        heading: "Toner pads have become a controlled exfoliation category",
        body: "Pore-care and toner pads keep gaining shelf space because they solve mess and dosing at once: a measured amount of a mild acid or soothing extract, applied without decanting. Watch for pads that state their acid percentage and pH. Skip pads whose only selling point is a scent or a fabric texture — the pad is a delivery method, not a benefit.",
      },
      {
        heading: "Sun care behaving like skincare",
        body: "Sun sticks, serum-textured SPF and hybrid tone-up sunscreens continue to dominate Korean launches, driven by reapplication over makeup. This is the category with the biggest Australian caveat: sunscreens making therapeutic SPF claims here are regulated by the TGA, and Korean labelling does not map onto Australian testing. Use imported Korean sun care as a comfortable reapplication layer, and read the label as supplied by the brand rather than assuming an Australian equivalence.",
      },
      {
        heading: "Overnight collagen film masks",
        body: "Hydrogel and collagen-film overnight masks that dissolve onto the skin have moved from novelty to repeat purchase. They work as an occlusive hydration event, which is exactly what dry Melbourne winters and air-conditioned offices call for. They are not a collagen-building treatment; the collagen sits on the surface as a film-former and humectant.",
      },
      {
        heading: "Sensitive-skin reformulation",
        body: "Established lines are quietly reissuing hero products fragrance-free, at lower pH and with shorter ingredient lists. This is the least visible trend and probably the most useful one. When two versions of a product exist, the reformulated sensitive version is usually the better buy for Australian skin dealing with UV and hard water.",
      },
      {
        heading: "What we are not chasing",
        body: "Single-ingredient miracle launches with no domestic review volume. Devices with cosmetic-level claims and clinical-level pricing. Anything that only exists in export markets — if it does not hold Olive Young Korea shelf space or Hwahae review volume, it did not win at home, and that is our first filter before we import anything.",
      },
    ],
    keyPoints: [
      "PDRN is the strongest current Korean category: product counts +43%, reviews +103%.",
      "Exosome cosmetic claims are looser than clinical ones — judge the full formula.",
      "Toner pads are worth buying when acid percentage and pH are disclosed.",
      "Korean SPF labelling is not TGA-equivalent; read brand-supplied information.",
      "Collagen film masks are occlusive hydration, not collagen building.",
      "We only import what holds Olive Young Korea shelf space and Hwahae review volume.",
    ],
    sources: [SRC_CLINIC, SRC_KBS, SRC_HWAHAE, SRC_TGA],
    related: ["seoul-vs-tiktok", "pdrn-explained", "tga-vs-korean-sunscreen"],
  },
];
