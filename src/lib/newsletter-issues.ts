// "The Skin Grocery List" — Skin Grocer's fortnightly newsletter, published on
// site as collectible issues. Each issue follows the same eight-part structure
// so readers learn the format and come back for it.

import portraitDeep from "@/assets/learn/deeper-skin-tones.jpg";
import matureSkin from "@/assets/learn/mature-skin.jpg";
import hypeScrutiny from "@/assets/learn/hype-ingredient-scrutiny.jpg";
import routineFlatlay from "@/assets/learn-routine-flatlay.jpg";
import signalIssue01Cover from "@/assets/signal-issue-01-cover.jpg";
import issue02Cover from "@/assets/issues/issue-02-barrier.jpg";
import issue03Cover from "@/assets/issues/issue-03-routine.jpg";
import issue04Cover from "@/assets/issues/issue-04-pdrn.jpg";
import issue05Cover from "@/assets/issues/issue-05-pigmentation.jpg";
import issue06Cover from "@/assets/issues/issue-06-undiscovered.jpg";

export type IssuePick = {
  name: string;
  brand: string;
  price?: string;
  image?: string;
  note: string;
};

export type AisleItem = {
  emoji: string;
  concern: string;
  pick: string;
  brand: string;
  why: string;
  image?: string;
};

export type RoutineStep = {
  step: string;
  what: string;
  pick: string;
  brand: string;
  image?: string;
};

export type NewsletterIssue = {
  number: string;
  slug: string;
  title: string;
  theme: string;
  date: string;
  published: boolean;
  cover: string;
  coverAlt: string;
  standfirst: string;

  bigQuestion: {
    question: string;
    body: string[];
    pick: IssuePick & { reasons: string[] };
  };

  seoul: {
    ingredient: string;
    koreaHeat: string;
    australiaHeat: string;
    whatIsIt: string;
    whyKoreansLove: string;
    shouldAussiesCare: string;
    tryIt: IssuePick[];
  };

  aisle: AisleItem[];

  fiveMinute: {
    intro: string;
    steps: RoutineStep[];
    closer: string;
  };

  everyone: {
    topic: string;
    image: string;
    imageAlt: string;
    body: string[];
  };

  weTriedIt: {
    product: string;
    brand: string;
    duration: string;
    image?: string;
    scores: { label: string; value: string }[];
    verdict: string;
  };

  basket: {
    forWho: string;
    items: IssuePick[];
  };

  askTheGrocer: {
    prompt: string;
    options: string[];
  };
};

export const newsletterIssues: NewsletterIssue[] = [
  {
    number: "06",
    slug: "korean-products-australians-havent-found-yet",
    title: "What Korea Is Actually Buying Right Now",
    theme: "The Undiscovered Issue",
    date: "Fortnight of 17 August 2026",
    published: true,
    cover: issue06Cover,
    coverAlt:
      "S.NATURE, beplain and AESTURA creams on concrete with fresh centella leaves and squalane oil drops",
    standfirst:
      "The products topping Olive Young's shelves in Seoul are almost never the ones going viral on Australian TikTok. This fortnight: the quiet, boring, dermatologist-adjacent products Korean women repurchase — and why none of them are the ones with the loudest marketing.",
    bigQuestion: {
      question: "Why is the product Korea repurchases never the one that goes viral here?",
      body: [
        "There are two K-beauty markets and they barely overlap. The first is the export market: heavy influencer seeding, glass-jar packaging, a hero ingredient with a good name and a trend cycle measured in weeks. The second is the domestic one — the products Korean women buy again at Olive Young without being asked to, usually cheap, usually plain, usually recommended by a dermatologist or a pharmacist rather than a creator.",
        "AESTURA is the cleanest example. It's owned by Amorepacific and sold heavily through Korean pharmacies and derm clinics for eczema-prone and compromised skin. Its Atobarrier365 line is a repeat-purchase staple in Korea and almost invisible in Australian conversation, because a ceramide cream in a white tube is not a TikTok asset. It just works, quietly, for years.",
        "The screening question we use before stocking anything: would a Korean dermatologist hand this to a patient with irritated skin? That filters out about 80% of what trends. Fragrance-heavy essences, 15-active serums, anything selling an outcome that requires a needle — all gone. What's left is short ingredient lists, sensible concentrations, and formulas designed to be used every day for a year.",
        "If you are the person who has been burned by three viral products already: buy the boring one. It's usually cheaper, it usually has the fewest ingredients, and it's usually the one the person who actually has to fix skin for a living recommends.",
      ],
      pick: {
        name: "Atobarrier365 Cream (2nd Generation)",
        brand: "AESTURA",
        price: "A$55",
        image: "/products/aestura/atobarrier365-cream.png",
        note: "A pharmacy-channel ceramide cream that Korean derm clinics hand out — no fragrance, no essential oils, nothing to react to.",
        reasons: [
          "Ceramide-led formula built for eczema-prone, compromised skin",
          "Fragrance-free and colourant-free — the shortest list in our range",
          "Repeat-purchase staple in Korea, still barely known in Australia",
        ],
      },
    },
    seoul: {
      ingredient: "Squalane",
      koreaHeat: "🔥🔥🔥🔥",
      australiaHeat: "😴 badly underrated",
      whatIsIt:
        "A saturated, stable lipid — most commonly made from olives or sugarcane. It's the hydrogenated version of squalene, which your own sebum already contains. Because it's saturated it doesn't oxidise easily, so it doesn't go rancid on your face the way some plant oils do.",
      whyKoreansLove:
        "It's the emollient of choice for people who want slip and comfort without a heavy occlusive film. In Korean formulas it usually appears at modest levels alongside humectants — the water goes in first, the squalane keeps it from leaving. It also sits well under makeup, which matters in a market where base makeup is worn daily.",
      shouldAussiesCare:
        "Yes, especially if oils have historically broken you out. Squalane is non-comedogenic for most people, lightweight, and one of the few lipids that suits both a Brisbane summer and a Melbourne winter. It is not an active: it will not brighten, resurface or firm anything. It fixes texture and comfort, and that's the whole job.",
      tryIt: [
        { name: "Aqua Squalane Serum", brand: "S.NATURE", price: "A$34", image: "/products/s-nature/aqua-squalane-serum.png", note: "Lightweight squalane and water — the summer version." },
        { name: "Aqua Squalane Moisturizing Cream", brand: "S.NATURE", price: "A$35", image: "/products/s-nature/aqua-squalane-moisturizing-cream.png", note: "Same idea, sealed. Good for dry mornings." },
        { name: "Milk Ceramide Moisturizing Cream", brand: "beplain", price: "A$35", image: "/products/beplain/milk-ceramide-moisturizing-cream.png", note: "Lipids plus ceramides if squalane alone isn't enough." },
      ],
    },
    aisle: [
      { emoji: "🥛", concern: "Tight after cleansing", pick: "Mung Bean pH-Balanced Cleansing Foam 80ml", brand: "beplain", why: "Low-pH, low-foam. Removes the day without stripping the barrier that keeps water in.", image: "/products/beplain/mung-bean-ph-balanced-cleansing-foam-80ml.png" },
      { emoji: "🌿", concern: "Reactive", pick: "Cicaful Ampoule 30ml", brand: "beplain", why: "Centella-led, fragrance-free, short list. Nothing in it to argue with.", image: "/products/beplain/cicaful-ampoule-30ml.png" },
      { emoji: "💧", concern: "Dehydrated but oily", pick: "Aqua Oasis Moisturizing Gel", brand: "S.NATURE", why: "Humectant gel with no heavy occlusive — hydration without the film.", image: "/products/s-nature/aqua-oasis-moisturizing-gel.png" },
      { emoji: "🧴", concern: "Barrier damage", pick: "Atobarrier 365 Hydro Soothing Cream", brand: "AESTURA", why: "The lighter Atobarrier for warm weather. Same repair logic, less weight.", image: "/products/aestura/atobarrier-365-hydro-soothing-cream.png" },
      { emoji: "🍶", concern: "Dull, uneven", pick: "Black Rice Hyaluronic Toner 150ml", brand: "HARUHARU WONDER", why: "Fermented rice extract and HA — hydration first, gentle tone-evening second.", image: "/products/haruharu-wonder/black-rice-hyaluronic-toner-150ml.png" },
    ],
    fiveMinute: {
      intro:
        "The version we'd build for someone who has been burned by viral products and wants to reset with things that were never trendy in the first place.",
      steps: [
        { step: "01 · Cleanse", what: "One gentle wash at night, water only in the morning if you're dry.", pick: "Mung Bean pH-Balanced Cleansing Foam 80ml", brand: "beplain", image: "/products/beplain/mung-bean-ph-balanced-cleansing-foam-80ml.png" },
        { step: "02 · Hydrate", what: "Onto damp skin. Fermented rice and HA, two light passes.", pick: "Black Rice Hyaluronic Toner 150ml", brand: "HARUHARU WONDER", image: "/products/haruharu-wonder/black-rice-hyaluronic-toner-150ml.png" },
        { step: "03 · Comfort", what: "Squalane where skin feels rough. Skip on humid days.", pick: "Aqua Squalane Serum", brand: "S.NATURE", image: "/products/s-nature/aqua-squalane-serum.png" },
        { step: "04 · Seal", what: "Ceramides at night. SPF over the top in the morning, all year.", pick: "Atobarrier365 Cream (2nd Generation)", brand: "AESTURA", image: "/products/aestura/atobarrier365-cream.png" },
      ],
      closer:
        "Nothing in this routine has ever trended. That's the point — it's the one you can still be using in two years.",
    },
    everyone: {
      topic: "Skincare when you genuinely have no time",
      image: routineFlatlay,
      imageAlt: "Flatlay of a short Korean skincare routine: cleanser, toner, serum and cream",
      body: [
        "The single biggest reason routines fail isn't the wrong product. It's a routine designed for someone with twenty free minutes and no one else in the house. If you're getting four kids out the door, or answering work email at 10pm, an eleven-step evening ritual isn't aspirational — it's the thing you'll abandon in nine days and then feel guilty about.",
        "So we build for the worst night, not the best one. Three products you can apply in ninety seconds, standing up, with the bathroom door open: a cleanser that doesn't leave you tight, one hydrating layer, one cream. Add sunscreen in the morning. That is a complete, defensible routine, and it beats a perfect one you do twice a week.",
        "The upgrade path, when there is time, is one product at a time — not one routine at a time. Add a single active, use it for three to four weeks, and only then decide whether anything else is missing. Most people discover it isn't.",
        "And if you have more time and budget now than you did ten years ago: spend it on consistency and sun protection before you spend it on a new hero serum. Nothing on this website will out-perform daily SPF for how your face looks in five years.",
      ],
    },
    weTriedIt: {
      product: "Aqua Oasis Toner",
      brand: "S.NATURE",
      duration: "3 weeks, two testers on our team",
      image: "/products/s-nature/aqua-oasis-toner.png",
      scores: [
        { label: "Absorption", value: "9/10" },
        { label: "Stickiness", value: "None" },
        { label: "Under sunscreen", value: "⭐⭐⭐⭐⭐" },
        { label: "Value per ml", value: "⭐⭐⭐" },
      ],
      verdict:
        "Does one thing — puts water in — and doesn't interfere with anything after it. Neither tester noticed a dramatic change, which is the correct outcome for a hydrating toner. If you want a visible result, this isn't the product; the cream is.",
    },
    basket: {
      forWho: "For starting over after a bad run",
      items: [
        { name: "Mung Bean pH-Balanced Cleansing Foam 80ml", brand: "beplain", price: "A$24", image: "/products/beplain/mung-bean-ph-balanced-cleansing-foam-80ml.png", note: "Stop the damage." },
        { name: "Black Rice Hyaluronic Toner 150ml", brand: "HARUHARU WONDER", price: "A$28", image: "/products/haruharu-wonder/black-rice-hyaluronic-toner-150ml.png", note: "Water in." },
        { name: "Atobarrier365 Cream (2nd Generation)", brand: "AESTURA", price: "A$55", image: "/products/aestura/atobarrier365-cream.png", note: "Water stays in." },
        { name: "Derma UV365 Barrier Moisture Mineral Sun Cream 20ml", brand: "AESTURA", price: "A$10", image: "/products/aestura/derma-uv365-barrier-moisture-mineral-sun-cream.png", note: "The only anti-ageing step that's proven." },
      ],
    },
    askTheGrocer: {
      prompt: "What should we dig into next fortnight?",
      options: [
        "Are exosome serums worth it?",
        "Cleansing oil vs balm vs micellar",
        "What actually works for large pores?",
        "Which Korean SPF is best for kids?",
      ],
    },
  },
  {
    number: "05",
    slug: "why-your-dark-spots-keep-coming-back",
    title: "Why Your Dark Spots Keep Coming Back",
    theme: "The Pigmentation Issue",
    date: "Fortnight of 3 August 2026",
    published: true,
    cover: issue05Cover,
    coverAlt:
      "Beauty of Joseon Glow Serum and ISNTREE Green Tea Fresh Toner in hard sunlight with green tea leaves and propolis honeycomb",
    standfirst:
      "Brightening serums are the most oversold category in skincare. Here's what actually moves pigment, what percentage you need before an ingredient does anything at all, and why the spot you faded in autumn is back by Christmas.",
    bigQuestion: {
      question: "Why does pigment come back every summer?",
      body: [
        "Because pigmentation isn't a stain you remove — it's an ongoing process you're managing. Melanocytes make melanin in response to triggers: UV, visible light, heat, inflammation and hormones. A brightening serum slows production. It does nothing to the trigger. Remove the serum's competition — the sun — and results appear. Leave the trigger in place and you're bailing out a boat with the tap running.",
        "This is why Australian pigmentation behaves differently from Korean pigmentation. Seoul's UV index sits low for months of the year; ours does not. A routine that holds melasma flat in Korea can lose ground in a Queensland summer with identical products. The variable isn't the serum. It's ninety minutes of ambient UV on the school run.",
        "The second reason is heat and inflammation. Melasma in particular responds to heat and visible light, not just UVB — which is why it flares after a hot car, a sauna, or a laser done too aggressively. If your pigment darkens on days you didn't burn, that's your answer.",
        "The honest expectation: eight to twelve weeks of daily use before you fairly judge any brightening active, and permanent daily sunscreen if you want to keep the result. Anything promising two weeks is selling you the same relapse you had last year.",
      ],
      pick: {
        name: "Glow Serum: Propolis + Niacinamide 30ml",
        brand: "Beauty of Joseon",
        price: "A$34",
        image: "/__l5e/assets-v1/910b33a5-3e9c-4af3-8af0-d8d106de9b22/boj-glow-serum-propolis.jpg",
        note: "Niacinamide with propolis extract — the low-irritation end of brightening, which is the end that works long-term.",
        reasons: [
          "Niacinamide is one of the few brightening actives that rarely irritates",
          "Comfortable enough to use daily for the eight to twelve weeks it actually takes",
          "Layers under sunscreen without pilling — the step that protects the result",
        ],
      },
    },
    seoul: {
      ingredient: "Niacinamide (and what percentage matters)",
      koreaHeat: "🔥🔥🔥🔥",
      australiaHeat: "🔥🔥🔥 everywhere, poorly understood",
      whatIsIt:
        "Vitamin B3. In pigmentation it works upstream of the visible mark: it interferes with the transfer of melanin from melanocytes into surrounding skin cells, rather than bleaching pigment that's already there. It also supports barrier lipid production, which is why it turns up in almost every Korean formula.",
      whyKoreansLove:
        "Because it's the rare active that's both effective and boring to your skin. Published dermatology work has generally used niacinamide in the 2–5% range for pigmentation and barrier benefits, and Korean formulators tend to sit in that band rather than chase a number on the front of the bottle. The 10%+ serums that trended in the West mostly bought irritation, not results.",
      shouldAussiesCare:
        "Yes — as your default daily brightener, not your hero. If a product lists niacinamide high in the ingredients, you're likely in a useful range. If your skin flushes on it, drop to a lower-percentage formula rather than abandoning the ingredient; the flush is usually dose, not allergy.",
      tryIt: [
        { name: "Glow Serum: Propolis + Niacinamide 30ml", brand: "Beauty of Joseon", price: "A$34", image: "/__l5e/assets-v1/910b33a5-3e9c-4af3-8af0-d8d106de9b22/boj-glow-serum-propolis.jpg", note: "The daily one." },
        { name: "Green Tea Fresh Toner 200ml", brand: "ISNTREE", price: "A$26", image: "/products/isntree/green-tea-fresh-toner-200ml.png", note: "Green tea polyphenols — antioxidant support under SPF." },
        { name: "1025 Dokdo Toner 100ml", brand: "ROUND LAB", price: "A$18", image: "/products/round-lab/1025-dokdo-toner-100ml.png", note: "Hydration base so you can tolerate an active daily." },
      ],
    },
    aisle: [
      { emoji: "☀️", concern: "Sun-triggered spots", pick: "Derma UV365 Barrier Moisture Mineral Sun Cream 20ml", brand: "AESTURA", why: "The only step that stops the trigger. Everything else is maintenance.", image: "/products/aestura/derma-uv365-barrier-moisture-mineral-sun-cream.png" },
      { emoji: "🍯", concern: "Dull with uneven tone", pick: "Glow Serum: Propolis + Niacinamide 30ml", brand: "Beauty of Joseon", why: "Daily niacinamide, low irritation, safe to run for months.", image: "/__l5e/assets-v1/910b33a5-3e9c-4af3-8af0-d8d106de9b22/boj-glow-serum-propolis.jpg" },
      { emoji: "🌱", concern: "Post-acne marks", pick: "Chestnut BHA 2% Clear Liquid 100ml", brand: "ISNTREE", why: "Clears the congestion causing new marks. Two to three nights a week, not daily.", image: "/products/isntree/chestnut-bha-2-percent-clear-liquid-100ml.png" },
      { emoji: "🍵", concern: "Redness plus pigment", pick: "Green Tea Fresh Toner 200ml", brand: "ISNTREE", why: "Calms the inflammation that keeps generating fresh pigment.", image: "/products/isntree/green-tea-fresh-toner-200ml.png" },
      { emoji: "🌙", concern: "Fine lines with dark spots", pick: "Revive Eye Serum: Ginseng + Retinal 30ml", brand: "Beauty of Joseon", why: "Low-dose retinal, used sparingly. Retinoids are the strongest evidence base we have.", image: "/products/beauty-of-joseon/revive-eye-serum-ginseng-plus-retinal-30ml.png" },
    ],
    fiveMinute: {
      intro:
        "A pigmentation routine you can hold for three months, because three months is the actual timeframe. Anything more aggressive gets abandoned in week two.",
      steps: [
        { step: "01 · Cleanse", what: "Gentle, low-pH. Scrubbing pigment does nothing except make more of it.", pick: "Yam Root Vegan Milk Cleanser 220ml", brand: "ISNTREE", image: "/products/isntree/yam-root-vegan-milk-cleanser-220ml.png" },
        { step: "02 · Hydrate", what: "Damp skin, one pass. Hydrated skin tolerates actives better.", pick: "Green Tea Fresh Toner 200ml", brand: "ISNTREE", image: "/products/isntree/green-tea-fresh-toner-200ml.png" },
        { step: "03 · Brighten", what: "Niacinamide serum, morning. Every day for at least eight weeks.", pick: "Glow Serum: Propolis + Niacinamide 30ml", brand: "Beauty of Joseon", image: "/__l5e/assets-v1/910b33a5-3e9c-4af3-8af0-d8d106de9b22/boj-glow-serum-propolis.jpg" },
        { step: "04 · Protect", what: "SPF, generously, reapplied when you're outdoors. This is the treatment.", pick: "Derma UV365 Barrier Moisture Mineral Sun Cream 20ml", brand: "AESTURA", image: "/products/aestura/derma-uv365-barrier-moisture-mineral-sun-cream.png" },
      ],
      closer:
        "If you only do one of these four, do the sunscreen. It out-performs every brightening serum ever sold, including the ones we stock.",
    },
    everyone: {
      topic: "Pigmentation on deeper skin tones",
      image: portraitDeep,
      imageAlt: "Portrait of a woman with deep skin tone and even, healthy complexion",
      body: [
        "On deeper skin, the mark is usually caused by the treatment, not the original blemish. More active melanocytes means any inflammation — a strong acid, a retinoid ramped too fast, a scrub, picking — can leave a new dark mark that lasts longer than the thing you were treating.",
        "So the order of operations inverts. Calm first, brighten second, exfoliate last and least. Niacinamide, tranexamic acid, alpha-arbutin and liquorice root are the low-irritation end of the shelf and the right starting point. Introduce one at a time, two to three nights a week, and give it a month before judging.",
        "Sunscreen choice matters more here too. Korean chemical and hybrid filters generally leave no grey cast, which is exactly why we stock them — a sunscreen you'll actually wear every day beats a high-zinc one you skip.",
        "If pigment is patchy, symmetrical across the cheeks and worsens with heat, that pattern is often melasma rather than post-inflammatory pigmentation, and it's worth seeing a dermatologist. Melasma is manageable, not curable, and it punishes aggressive treatment more than almost anything else.",
      ],
    },
    weTriedIt: {
      product: "Green Tea Fresh Toner 200ml",
      brand: "ISNTREE",
      duration: "4 weeks, one tester with combination skin",
      image: "/products/isntree/green-tea-fresh-toner-200ml.png",
      scores: [
        { label: "Comfort", value: "9/10" },
        { label: "Redness", value: "⭐⭐⭐⭐" },
        { label: "Oil control", value: "⭐⭐⭐" },
        { label: "Visible brightening", value: "⭐⭐" },
      ],
      verdict:
        "Genuinely calming and pleasant to use daily, and our tester's redness settled. It did not visibly shift existing dark spots in four weeks — no toner will. Treat it as the comfortable base layer that lets you keep using an actual brightening step.",
    },
    basket: {
      forWho: "For pigmentation and uneven tone",
      items: [
        { name: "Glow Serum: Propolis + Niacinamide 30ml", brand: "Beauty of Joseon", price: "A$34", image: "/__l5e/assets-v1/910b33a5-3e9c-4af3-8af0-d8d106de9b22/boj-glow-serum-propolis.jpg", note: "The daily brightener." },
        { name: "Green Tea Fresh Toner 200ml", brand: "ISNTREE", price: "A$26", image: "/products/isntree/green-tea-fresh-toner-200ml.png", note: "Calm the trigger." },
        { name: "Chestnut BHA 2% Clear Liquid 100ml", brand: "ISNTREE", price: "A$36", image: "/products/isntree/chestnut-bha-2-percent-clear-liquid-100ml.png", note: "Fewer new marks." },
        { name: "Derma UV365 Barrier Moisture Mineral Sun Cream 20ml", brand: "AESTURA", price: "A$10", image: "/products/aestura/derma-uv365-barrier-moisture-mineral-sun-cream.png", note: "Protect the result." },
      ],
    },
    askTheGrocer: {
      prompt: "Which pigmentation question should we answer next?",
      options: [
        "Vitamin C: which form actually works?",
        "Is tranexamic acid better than niacinamide?",
        "How do I treat melasma without making it worse?",
        "Do LED masks do anything for pigment?",
      ],
    },
  },
  {
    number: "04",
    slug: "pdrn-miracle-ingredient-or-marketing",
    title: "PDRN: Miracle Ingredient or Marketing?",
    theme: "The PDRN Issue",
    date: "Fortnight of 20 July 2026",
    published: true,
    cover: issue04Cover,
    coverAlt:
      "WELLAGE Hyper PDRN Repair Ampoule and MEDICUBE PDRN Pink Peptide Eye Cream with pink ampoule fluid on a lab slide",
    standfirst:
      "Salmon DNA is the most-marketed ingredient in Korea right now. We separated what the clinic data supports from what a topical serum can plausibly do to your face — including the part the ads leave out about molecule size.",
    bigQuestion: {
      question: "Does topical PDRN do what injected PDRN does?",
      body: [
        "No — and the gap is the entire story. PDRN (polydeoxyribonucleotide) is a purified fragment mix of DNA, usually salmon-derived. The clinical evidence people cite for it comes from injectable use: skin boosters and wound-healing applications, where the material is delivered under the skin barrier by a needle. That is a completely different delivery route from a serum you pat on.",
        "The limiting factor is size. Skin's outer layer is a very effective barrier, and large, water-loving molecules struggle to cross it in meaningful amounts. DNA fragments are large. So the honest read on a topical PDRN serum is that most of it stays on the surface, where it behaves like an excellent water-binding film — genuinely hydrating, genuinely comfortable — rather than a regenerative signal delivered into living tissue.",
        "That's not nothing. Surface hydration and reduced water loss make skin look plumper, calmer and smoother within days, and PDRN formulas are usually built around soothing, low-irritation bases that suit over-exfoliated skin. But if you bought it expecting the result your friend got from a clinic session, the product isn't underperforming — the marketing overpromised.",
        "Our position: buy PDRN products because they're pleasant, hydrating, well-formulated calming products at a fair price. Do not buy them as a needle substitute, and do not pay a premium over a good ceramide or HA product on the strength of the letters alone.",
      ],
      pick: {
        name: "Hyper PDRN Repair Ampoule 30ml",
        brand: "WELLAGE",
        price: "A$40",
        image: "/products/wellage/hyper-pdrn-repair-ampoule-30ml.png",
        note: "If you want to try the category, this is the straightforward one: concentrated, fragrance-free, no theatre.",
        reasons: [
          "Comfortable enough for sensitised, over-exfoliated skin",
          "Strong surface hydration — the effect topical PDRN can actually deliver",
          "No fragrance or essential oils competing with the claim",
        ],
      },
    },
    seoul: {
      ingredient: "Exosomes (the next PDRN)",
      koreaHeat: "🔥🔥🔥🔥",
      australiaHeat: "👀 arriving now",
      whatIsIt:
        "Tiny vesicles that cells release to carry signalling material to other cells. In clinics, exosome preparations are used alongside micro-needling or lasers, where the skin barrier has been deliberately breached. In cosmetics, 'exosome' on a label usually means a plant- or ferment-derived extract, and the amount and activity vary enormously between products.",
      whyKoreansLove:
        "Korea's aesthetic clinics normalise the technology first, and the shelf follows — the same path PDRN took. The word carries clinic authority, which sells.",
      shouldAussiesCare:
        "Cautiously. Same barrier problem as PDRN, plus far less consistency in what's in the bottle. Judge these products by the rest of the formula — the humectants, the lipids, the soothing agents — because that's what's doing the work you can feel. If a serum is good, it's good; the exosome claim is a bonus you shouldn't pay much extra for.",
      tryIt: [
        { name: "One Day Exosome Shot Pore Serum 2000 30ml", brand: "MEDICUBE", price: "A$40", image: "/products/medicube/one-day-exosome-shot-pore-serum-2000-30ml.png", note: "The category example — a light, pore-focused serum." },
        { name: "PDRN Pink Peptide Serum 30ml", brand: "MEDICUBE", price: "A$40", image: "/products/medicube/pdrn-pink-peptide-serum-30ml.png", note: "Peptides alongside PDRN — the peptides are the better-evidenced half." },
        { name: "Real Hyaluronic Blue 100 Ampoule 60ml", brand: "WELLAGE", price: "A$34", image: "/products/wellage/real-hyaluronic-blue-100-ampoule-60ml.png", note: "The unglamorous control: pure hydration, cheaper per ml." },
      ],
    },
    aisle: [
      { emoji: "💉", concern: "Post-treatment skin", pick: "Hyper PDRN Repair Ampoule 30ml", brand: "WELLAGE", why: "Calm, hydrating and fragrance-free — safe on skin that's had enough.", image: "/products/wellage/hyper-pdrn-repair-ampoule-30ml.png" },
      { emoji: "👁️", concern: "Crepey under-eyes", pick: "PDRN Pink Peptide Eye Cream 30ml", brand: "MEDICUBE", why: "Thin skin shows dehydration first. This is a hydration fix that looks like a firming one.", image: "/products/medicube/pdrn-pink-peptide-eye-cream-30ml.png" },
      { emoji: "🫧", concern: "Visible pores", pick: "One Day Exosome Shot Pore Serum 2000 30ml", brand: "MEDICUBE", why: "Light texture, smoothing finish. Pores don't close — they can look tidier.", image: "/products/medicube/one-day-exosome-shot-pore-serum-2000-30ml.png" },
      { emoji: "🧊", concern: "Redness after actives", pick: "PDRN Pink Cica Soothing Toner 250ml", brand: "MEDICUBE", why: "Centella-led toner to reset a face you've pushed too hard.", image: "/products/medicube/pdrn-pink-cica-soothing-toner-250ml.png" },
      { emoji: "🪞", concern: "Loss of bounce", pick: "Collagen Jelly Cream 110ml", brand: "MEDICUBE", why: "Occlusive comfort. Topical collagen hydrates the surface — it doesn't rebuild yours.", image: "/products/medicube/collagen-jelly-cream-110ml.png" },
    ],
    fiveMinute: {
      intro:
        "How we'd actually use a PDRN product: as the hydrating layer in a short routine, not as the centrepiece of an expensive one.",
      steps: [
        { step: "01 · Cleanse", what: "Whip cleanser, lukewarm water, thirty seconds.", pick: "PDRN Pink Niacinamide Whip Cleanser 120g", brand: "MEDICUBE", image: "/products/medicube/pdrn-pink-niacinamide-whip-cleanser-120g.png" },
        { step: "02 · Calm", what: "Centella toner on damp skin, especially after actives.", pick: "PDRN Pink Cica Soothing Toner 250ml", brand: "MEDICUBE", image: "/products/medicube/pdrn-pink-cica-soothing-toner-250ml.png" },
        { step: "03 · Hydrate", what: "PDRN ampoule while skin is still damp — that's when it performs.", pick: "Hyper PDRN Repair Ampoule 30ml", brand: "WELLAGE", image: "/products/wellage/hyper-pdrn-repair-ampoule-30ml.png" },
        { step: "04 · Seal", what: "Cream over the top, or none of the above stays put.", pick: "Real Hyaluronic 100 Cream 80ml", brand: "WELLAGE", image: "/products/wellage/real-hyaluronic-100-cream-80ml.png" },
      ],
      closer:
        "A good PDRN routine is a good hydration routine with better branding. Buy it for how your skin feels at 4pm, not for what the ad implied.",
    },
    everyone: {
      topic: "How to read a hype ingredient before you pay for it",
      image: routineFlatlay,
      imageAlt: "Flatlay of Korean serums and creams arranged as a routine",
      body: [
        "Three questions sort most of it. First: was the evidence generated by injecting, needling or lasering the ingredient in — or by applying it to intact skin? If it's the former, the serum version is a different product with the same name.",
        "Second: how big is the molecule and where does it need to end up? Hydration ingredients only need to sit on and just under the surface, so they deliver reliably. Anything claiming to work in the deeper layers has to cross a barrier evolved specifically to stop that.",
        "Third: where does it sit in the ingredient list? An active named on the front of the box but listed after the fragrance and preservatives is present in a token amount. Korean brands are generally better than most at disclosing meaningful percentages — if a number is nowhere on the packaging or the brand's site, assume it's low.",
        "None of this means hype ingredients are scams. It means the honest version of the claim is usually smaller and more useful than the marketed one — and the smaller claim is the one we'll always give you.",
      ],
    },
    weTriedIt: {
      product: "PDRN Pink Peptide Eye Cream 30ml",
      brand: "MEDICUBE",
      duration: "4 weeks, one tester in her forties",
      image: "/products/medicube/pdrn-pink-peptide-eye-cream-30ml.png",
      scores: [
        { label: "Texture", value: "8/10" },
        { label: "Morning puffiness", value: "⭐⭐⭐" },
        { label: "Dryness lines", value: "⭐⭐⭐⭐" },
        { label: "Deep lines", value: "⭐" },
      ],
      verdict:
        "Fine lines that were really dehydration lines softened within a fortnight. Established creases did not move, and we'd be lying if we said otherwise. Worth it as a comfortable eye hydrator; not worth it as an alternative to a clinic.",
    },
    basket: {
      forWho: "For calm, well-hydrated skin",
      items: [
        { name: "Hyper PDRN Repair Ampoule 30ml", brand: "WELLAGE", price: "A$40", image: "/products/wellage/hyper-pdrn-repair-ampoule-30ml.png", note: "The category, done properly." },
        { name: "PDRN Pink Cica Soothing Toner 250ml", brand: "MEDICUBE", price: "A$36", image: "/products/medicube/pdrn-pink-cica-soothing-toner-250ml.png", note: "Reset layer." },
        { name: "Real Hyaluronic 100 Cream 80ml", brand: "WELLAGE", price: "A$30", image: "/products/wellage/real-hyaluronic-100-cream-80ml.png", note: "Seal." },
        { name: "PDRN Pink Peptide Eye Cream 30ml", brand: "MEDICUBE", price: "A$38", image: "/products/medicube/pdrn-pink-peptide-eye-cream-30ml.png", note: "Where dehydration shows first." },
      ],
    },
    askTheGrocer: {
      prompt: "Which hyped ingredient should we pull apart next?",
      options: [
        "Topical collagen — does any of it absorb?",
        "Peptides: which ones have real data?",
        "Snail mucin, honestly",
        "Are LED and microcurrent devices worth it?",
      ],
    },
  },
  {
    number: "03",
    slug: "the-korean-10-step-routine-is-dead",
    title: "The Korean 10-Step Routine Is Dead",
    theme: "The Routine Issue",
    date: "Fortnight of 6 July 2026",
    published: true,
    cover: issue03Cover,
    coverAlt:
      "ROUND LAB toner, TORRIDEN Dive In Soothing Cream and Dr.G soothing foam lined up as a four-step routine",
    standfirst:
      "Nobody in Seoul is doing ten steps on a Tuesday. What replaced it is shorter, cheaper and far better suited to a woman with a job, kids and four minutes — here's the structure, and the two steps most people should delete.",
    bigQuestion: {
      question: "How many steps do you actually need?",
      body: [
        "Four, most nights. Cleanse, hydrate, treat, seal — plus sunscreen in the morning. The ten-step routine was a Western retelling of a Korean marketing era that Korea itself moved past years ago; the current domestic conversation is about 'skip care' and 'skin minimalism', with multi-function products replacing single-function ones.",
        "The reason isn't laziness — it's that more steps means more chances to irritate. Every additional product adds preservatives, fragrance, surfactants and actives that can interact. The most common skin problem we see in customer emails isn't dryness or acne. It's a barrier wrecked by too many products used too often, which then gets treated with another product.",
        "The two steps most people should delete first: the second exfoliant, and the essence that duplicates a serum you already own. If you're using an acid toner and a scrub and a retinoid, you have three exfoliating steps and a compromised barrier. If your essence and your HA serum are both watery humectants, you're paying twice for one job.",
        "What's worth keeping when you do have time: a proper oil cleanse at night if you wear sunscreen and makeup (and you should be wearing sunscreen), and an occasional mask. Those are additions with a clear purpose. Everything else has to justify its place.",
      ],
      pick: {
        name: "Dive In Soothing Cream",
        brand: "TORRIDEN",
        price: "A$40",
        image: "/products/torriden/dive-in-soothing-cream.png",
        note: "One cream that hydrates, soothes and seals — the multi-function step that lets you delete two others.",
        reasons: [
          "Low-molecular hyaluronic acid plus centella in one step",
          "Light enough for humid nights, sufficient for most skin in winter",
          "Fragrance-free, so it doesn't compete with anything else in the routine",
        ],
      },
    },
    seoul: {
      ingredient: "Skip care / skin minimalism",
      koreaHeat: "🔥🔥🔥🔥🔥",
      australiaHeat: "🔥🔥 catching on",
      whatIsIt:
        "A Korean shelf philosophy rather than an ingredient: fewer, better products, each doing more than one job. Toner-essence hybrids, cream-serums, cleansing waters that skip a step. It's the direct commercial response to the ten-step era.",
      whyKoreansLove:
        "Time, money and irritation, in that order. It also suits the way Korean women actually shop — high repurchase of a small number of trusted staples rather than a rotating cast of new heroes.",
      shouldAussiesCare:
        "Especially here. Our climate swings hard between a dry, air-conditioned winter and a humid, high-UV summer, and a bloated routine is far harder to adjust than a four-step one. Fewer products also makes it possible to identify the culprit when something goes wrong — which is impossible with eleven.",
      tryIt: [
        { name: "1025 Dokdo Toner + Lotion Special Set (200ml + 200ml)", brand: "ROUND LAB", price: "A$45", image: "/products/round-lab/1025-dokdo-toner-plus-lotion-special-set.png", note: "Two steps, one purchase, both fragrance-free." },
        { name: "Dive In Trial Kit (Global)", brand: "TORRIDEN", price: "A$35", image: "/products/torriden/dive-in-trial-kit.png", note: "A whole minimal routine in travel sizes before you commit." },
        { name: "Balanceful Cleansing Gel", brand: "TORRIDEN", price: "A$34", image: "/products/torriden/balanceful-cleansing-gel.png", note: "One cleanser that handles most days without a double-cleanse." },
      ],
    },
    aisle: [
      { emoji: "🧼", concern: "Over-cleansed", pick: "Balanceful Cleansing Gel", brand: "TORRIDEN", why: "Replaces a stripping foam. If your face squeaks, that's damage, not clean.", image: "/products/torriden/balanceful-cleansing-gel.png" },
      { emoji: "🧪", concern: "Too many actives", pick: "Dive In Serum", brand: "TORRIDEN", why: "The rest week product. Pure hydration while your barrier recovers.", image: "/products/torriden/dive-in-serum.png" },
      { emoji: "🕖", concern: "No time", pick: "1025 Dokdo Lotion 200ml", brand: "ROUND LAB", why: "Hydrate and moisturise in one pass. Ninety seconds, done.", image: "/products/round-lab/1025-dokdo-lotion-200ml.png" },
      { emoji: "🌡️", concern: "Humid summer", pick: "Aqua Oasis Moisturizing Gel", brand: "S.NATURE", why: "Swap your winter cream for this and delete a step until March.", image: "/products/s-nature/aqua-oasis-moisturizing-gel.png" },
      { emoji: "🛏️", concern: "Late nights", pick: "Dive In Mask Pack 1pc", brand: "TORRIDEN", why: "The whole routine in one sheet when you genuinely cannot.", image: "/products/torriden/dive-in-mask-pack-1pc.png" },
    ],
    fiveMinute: {
      intro:
        "The four steps, in order, with the reason each one earns its place. Delete anything that isn't on this list until your skin is calm.",
      steps: [
        { step: "01 · Cleanse", what: "Once at night. Add an oil cleanse first only if you wore sunscreen and makeup.", pick: "Balanceful Cleansing Gel", brand: "TORRIDEN", image: "/products/torriden/balanceful-cleansing-gel.png" },
        { step: "02 · Hydrate", what: "Onto damp skin, within a minute of washing. This is the step that does the most.", pick: "1025 Dokdo Toner 100ml", brand: "ROUND LAB", image: "/products/round-lab/1025-dokdo-toner-100ml.png" },
        { step: "03 · Treat", what: "One active, some nights. Not three, not nightly, not while your skin stings.", pick: "Dive In Serum", brand: "TORRIDEN", image: "/products/torriden/dive-in-serum.png" },
        { step: "04 · Seal", what: "Cream at night; SPF instead in the morning, over a lighter moisturiser.", pick: "Dive In Soothing Cream", brand: "TORRIDEN", image: "/products/torriden/dive-in-soothing-cream.png" },
      ],
      closer:
        "Four products used every night beat eleven used when you can face it. Consistency is the active ingredient nobody can sell you.",
    },
    everyone: {
      topic: "Building a routine around a life, not the other way around",
      image: routineFlatlay,
      imageAlt: "Flatlay of a four-step Korean routine: cleanser, toner, serum and cream",
      body: [
        "Design the routine for your worst evening. If it survives a 10pm finish with a sick kid, it'll survive everything else. That usually means three products within arm's reach of the sink, not a shelf of jars in a cupboard.",
        "Keep sunscreen where you get dressed rather than in the bathroom — the most-skipped step in Australia is skipped because of the walk back down the hall. Small logistics beat willpower.",
        "If you're in the second act — kids grown, more time and budget, and your face is finally the priority — the temptation is to buy a big routine at once. Don't. Add one product a month, in this order: sunscreen, moisturiser, hydrating layer, then a single active. You'll know exactly what worked.",
        "And take a photo in the same light every four weeks. Skin changes slowly enough that memory is useless, and a photo is the only honest way to tell whether that serum is earning its place.",
      ],
    },
    weTriedIt: {
      product: "1025 Dokdo Lotion 200ml",
      brand: "ROUND LAB",
      duration: "3 weeks, two testers, morning and night",
      image: "/products/round-lab/1025-dokdo-lotion-200ml.png",
      scores: [
        { label: "Absorption", value: "9/10" },
        { label: "Under SPF", value: "⭐⭐⭐⭐⭐" },
        { label: "Dry skin in winter", value: "⭐⭐⭐" },
        { label: "Value per ml", value: "⭐⭐⭐⭐⭐" },
      ],
      verdict:
        "The clearest step-deleter we've tested: hydration and moisturiser in one, no fragrance, no pilling under sunscreen. Very dry skin will still want a cream at night on cold weeks. Everyone else can genuinely drop a product.",
    },
    basket: {
      forWho: "For a four-step reset",
      items: [
        { name: "Balanceful Cleansing Gel", brand: "TORRIDEN", price: "A$34", image: "/products/torriden/balanceful-cleansing-gel.png", note: "Stop stripping." },
        { name: "1025 Dokdo Toner 100ml", brand: "ROUND LAB", price: "A$18", image: "/products/round-lab/1025-dokdo-toner-100ml.png", note: "Water in." },
        { name: "Dive In Serum", brand: "TORRIDEN", price: "A$38", image: "/products/torriden/dive-in-serum.png", note: "The one treat step." },
        { name: "Dive In Soothing Cream", brand: "TORRIDEN", price: "A$40", image: "/products/torriden/dive-in-soothing-cream.png", note: "Seal and soothe." },
      ],
    },
    askTheGrocer: {
      prompt: "What should we simplify next?",
      options: [
        "Do I really need to double cleanse?",
        "Morning routine: how short can it get?",
        "Which products can I safely layer together?",
        "Sheet masks — worth it or landfill?",
      ],
    },
  },
  {
    number: "02",
    slug: "your-skin-barrier-is-not-a-trend",
    title: "Your Skin Barrier Is Not a Trend",
    theme: "The Barrier Issue",
    date: "Fortnight of 22 June 2026",
    published: true,
    cover: issue02Cover,
    coverAlt:
      "AESTURA Atobarrier365 Cream and WELLAGE Real Hyaluronic Soothing Cream beside a ceramide cream swatch",
    standfirst:
      "Stinging, flushing, products that used to be fine and suddenly aren't — that's a damaged barrier, and it's the most common problem in our inbox. What actually repairs it, how long it takes, and the products making it worse.",
    bigQuestion: {
      question: "How do you know your barrier is damaged — and how long does it take to fix?",
      body: [
        "The tells are consistent: skin stings when you apply things that never used to sting, it flushes easily, it feels tight and looks shiny-tight rather than plump, it's simultaneously flaky and oily, and breakouts turn up in places you don't normally get them. Nothing you own works anymore, so you buy something else, and that makes it worse.",
        "What's happened physically is that the mortar between your surface skin cells — ceramides, cholesterol and fatty acids — has been depleted, usually by over-cleansing, over-exfoliating, actives stacked too aggressively, hot water, or all four. Water leaves faster than skin can replace it, and irritants get in more easily.",
        "The repair timeline is the part nobody wants: two to four weeks of doing very little for mild damage, and up to two or three months if you've been at it for a year. Skin renews on its own schedule and there is no product that shortens that meaningfully. Ceramide creams support the process; they don't accelerate biology.",
        "So the treatment is subtraction. Stop every acid, retinoid, vitamin C, scrub and clay mask. Cleanse once a day with something gentle, hydrate, and use a ceramide-rich cream twice daily. Sunscreen stays — a damaged barrier burns faster. Reintroduce one active at a time, once you've gone a full week without stinging.",
      ],
      pick: {
        name: "Atobarrier365 Cream (2nd Generation)",
        brand: "AESTURA",
        price: "A$55",
        image: "/products/aestura/atobarrier365-cream.png",
        note: "The ceramide cream Korean derm clinics reach for with eczema-prone patients. Fragrance-free, no essential oils, nothing decorative.",
        reasons: [
          "Ceramide-led lipid blend that mirrors what depleted skin has lost",
          "No fragrance, colourant or essential oils to re-irritate",
          "Rich enough for a repair period, but not so heavy you'll abandon it",
        ],
      },
    },
    seoul: {
      ingredient: "Ceramides",
      koreaHeat: "🔥🔥🔥🔥🔥",
      australiaHeat: "🔥🔥🔥 rising fast",
      whatIsIt:
        "Lipids that make up a large share of the mortar between your surface skin cells. They're not an active — they're a building material. Applied topically they sit in the surface layers and help slow water loss while your own supply recovers.",
      whyKoreansLove:
        "Korea's barrier obsession is partly climate — brutal winters, heavy heating, aggressive summer sun — and partly clinical: derm-adjacent brands like AESTURA sell through pharmacies, so the formulas are built for compromised skin rather than for a photo. Ceramide creams are the default winter purchase, not a trend.",
      shouldAussiesCare:
        "Yes, and not only in winter. Air conditioning, salt water, chlorine and daily sunscreen removal all deplete surface lipids. If you can only own one thing from this issue, own a ceramide cream. It is the least exciting and most consistently useful product in skincare.",
      tryIt: [
        { name: "Black Rice 5 Ceramide Barrier Moisturizing Cream", brand: "HARUHARU WONDER", price: "A$38", image: "/products/haruharu-wonder/black-rice-5-ceramide-barrier-moisturizing-cream.png", note: "Five ceramides, lighter texture — good for combination skin." },
        { name: "Milk Ceramide Moisturizing Cream", brand: "beplain", price: "A$35", image: "/products/beplain/milk-ceramide-moisturizing-cream.png", note: "Simple, gentle, well-priced entry point." },
        { name: "Real Hyaluronic Soothing Cream 80ml", brand: "WELLAGE", price: "A$38", image: "/products/wellage/real-hyaluronic-soothing-cream-80ml.png", note: "Hydration plus soothing when skin is actively reactive." },
      ],
    },
    aisle: [
      { emoji: "🔥", concern: "Stinging", pick: "Cicaful Ampoule 30ml", brand: "beplain", why: "Centella and madecassoside — the best-evidenced calming pairing in K-beauty.", image: "/products/beplain/cicaful-ampoule-30ml.png" },
      { emoji: "🧱", concern: "Barrier damage", pick: "Atobarrier365 Cream (2nd Generation)", brand: "AESTURA", why: "The repair cream. Twice daily until stinging stops, then keep using it.", image: "/products/aestura/atobarrier365-cream.png" },
      { emoji: "🫧", concern: "Over-cleansed", pick: "Mung Bean Cleansing Oil 200ml", brand: "beplain", why: "Removes sunscreen without a second foaming wash that strips lipids.", image: "/products/beplain/mung-bean-cleansing-oil-200ml.png" },
      { emoji: "🌾", concern: "Flaky and oily at once", pick: "Black Rice 5 Ceramide Barrier Moisturizing Cream", brand: "HARUHARU WONDER", why: "Lipids without the weight — dehydration and oiliness usually travel together.", image: "/products/haruharu-wonder/black-rice-5-ceramide-barrier-moisturizing-cream.png" },
      { emoji: "🩹", concern: "Angry, red patches", pick: "R.E.D Blemish Clear Soothing Cream 70ml", brand: "Dr.G", why: "Calming cream for reactive, blemish-prone skin during a repair phase.", image: "/products/dr-g/r-e-d-blemish-clear-soothing-cream-70ml.png" },
    ],
    fiveMinute: {
      intro:
        "The repair routine. Deliberately boring — three products, no actives, for at least two weeks before you reintroduce anything.",
      steps: [
        { step: "01 · Cleanse", what: "Oil cleanse at night only if you wore SPF or makeup. Water in the morning.", pick: "Mung Bean Cleansing Oil 200ml", brand: "beplain", image: "/products/beplain/mung-bean-cleansing-oil-200ml.png" },
        { step: "02 · Hydrate", what: "One hydrating layer on damp skin. No acids, no vitamin C, no exceptions.", pick: "Real Hyaluronic Toner 200ml", brand: "WELLAGE", image: "/products/wellage/real-hyaluronic-toner-200ml.png" },
        { step: "03 · Repair", what: "Ceramide cream, morning and night, generously. This is the treatment.", pick: "Atobarrier365 Cream (2nd Generation)", brand: "AESTURA", image: "/products/aestura/atobarrier365-cream.png" },
        { step: "04 · Protect", what: "SPF every morning. Damaged skin burns faster and heals slower.", pick: "Derma UV365 Barrier Moisture Mineral Sun Cream 20ml", brand: "AESTURA", image: "/products/aestura/derma-uv365-barrier-moisture-mineral-sun-cream.png" },
      ],
      closer:
        "If it stings, you're not done. The urge to add something is the thing that broke it in the first place.",
    },
    everyone: {
      topic: "Why your skin changed in your forties (and what to do about it)",
      image: portraitDeep,
      imageAlt: "Portrait of a woman with even, healthy skin in natural light",
      body: [
        "Skin gets drier with age for structural reasons: sebum output falls, surface lipid production slows, and the skin holds less water than it did. A routine built for the oily skin you had at twenty-five will actively damage the skin you have at forty-five — same products, opposite result.",
        "The most common mistake we see in this group is continuing to treat oiliness that's actually dehydration. Foaming cleansers, clay masks and astringent toners keep getting bought because the shine is still there; the shine is often skin overcompensating for what the routine strips.",
        "Swap in this order: gentler cleanser first, richer moisturiser second, then a hydrating layer. Only after those three are stable is it worth adding a retinoid — which remains the best-evidenced ageing active there is, and the one most likely to wreck a barrier if introduced too fast. Two nights a week, buffered with moisturiser, for a month.",
        "Hormonal change deserves proper advice too. If dryness arrived suddenly alongside other perimenopausal symptoms, that's a GP or dermatologist conversation, not a serum one. We'd rather send you there than sell you a cream that can't fix it.",
      ],
    },
    weTriedIt: {
      product: "Atobarrier365 Cream (2nd Generation)",
      brand: "AESTURA",
      duration: "6 weeks, one tester recovering from over-exfoliation",
      image: "/products/aestura/atobarrier365-cream.png",
      scores: [
        { label: "Stinging by week 2", value: "Gone" },
        { label: "Texture", value: "8/10" },
        { label: "Winter comfort", value: "⭐⭐⭐⭐⭐" },
        { label: "Humid summer", value: "⭐⭐⭐" },
      ],
      verdict:
        "Our tester stopped every active and used this twice a day. Stinging stopped inside two weeks; flaking took about four. It's rich — in a Brisbane February you'd want the Hydro Soothing version instead. Nothing dramatic happened, which is exactly what barrier repair looks like.",
    },
    basket: {
      forWho: "For a compromised barrier",
      items: [
        { name: "Mung Bean Cleansing Oil 200ml", brand: "beplain", price: "A$35", image: "/products/beplain/mung-bean-cleansing-oil-200ml.png", note: "Gentle removal." },
        { name: "Real Hyaluronic Toner 200ml", brand: "WELLAGE", price: "A$28", image: "/products/wellage/real-hyaluronic-toner-200ml.png", note: "Water in." },
        { name: "Atobarrier365 Cream (2nd Generation)", brand: "AESTURA", price: "A$55", image: "/products/aestura/atobarrier365-cream.png", note: "The repair step." },
        { name: "Cicaful Ampoule 30ml", brand: "beplain", price: "A$38", image: "/products/beplain/cicaful-ampoule-30ml.png", note: "For the reactive days." },
      ],
    },
    askTheGrocer: {
      prompt: "What's your barrier question?",
      options: [
        "How do I reintroduce retinol without starting over?",
        "Is my cleanser the problem?",
        "Cica vs ceramides — which first?",
        "Can sunscreen itself irritate my skin?",
      ],
    },
  },
  {
    number: "01",
    slug: "why-is-my-skin-so-thirsty",
    title: "Why Is My Skin So Thirsty?",
    theme: "The Hydration Issue",
    date: "Fortnight of 8 June 2026",
    published: true,
    cover: signalIssue01Cover,
    coverAlt:
      "TORRIDEN Dive In Serum, ROUND LAB 1025 Dokdo Toner and AESTURA Atobarrier365 Cream on wet limestone with hyaluronic gel and water droplets",

    standfirst:
      "Korea spent this fortnight arguing about water, not actives: hydrating toners, low-molecular hyaluronic acid and overnight hydrogel masks. Here is what that argument means for skin living through an Australian summer — and the four products that actually fix dehydration.",

    bigQuestion: {
      question: "Do you actually need a toner?",
      body: [
        "Toner used to be an apology. In the era of stripping foam cleansers, Western toners were mostly alcohol and witch hazel — a second wipe to remove what the cleanser left behind and to \"rebalance pH\" after it had wrecked it. If that's your mental model, skipping toner is entirely reasonable. That product was solving a problem a good cleanser shouldn't create.",
        "Korean toners are a different category wearing the same name. They're closer to a light essence: humectant-led, watery, layered onto damp skin in one to three passes. Glycerin, panthenol, hyaluronic acid, sometimes a fermented extract or a low-dose PHA. The job isn't to clean — it's to get water into the top layers of skin while it's still damp, so everything after it has something to seal.",
        "Who actually benefits: anyone dehydrated, which in Australia is most of us for at least half the year. Air conditioning, heated cars, chlorinated pools, hard water in Adelaide and Perth, and a UV index that regularly hits 11+. If your skin feels tight ten minutes after cleansing, or your foundation clings and flakes while your T-zone still shines, you're dehydrated, not dry — and a hydrating toner is the cheapest fix available.",
        "Who can skip it: if you have genuinely oily, comfortable skin that never feels tight, and your moisturiser already sits well, a toner is optional. So is it if you're using a hydrating essence or a low-molecular HA serum on damp skin — that's the same job, done once. What we'd never recommend is an astringent, alcohol-forward toner used daily. That's the 1998 product, and it's the reason half of Australia thinks toner does nothing.",
      ],
      pick: {
        name: "1025 Dokdo Toner 100ml",
        brand: "ROUND LAB",
        price: "A$18",
        image: "/products/round-lab/1025-dokdo-toner-100ml.png",
        note: "Deep-sea mineral water, no fragrance, no sting. The one we hand to people who've never used a toner they liked.",
        reasons: [
          "Lightweight hydration that absorbs in seconds — no tacky film",
          "Layers beautifully: two passes on damp skin, then serum",
          "Particularly useful for dehydrated Australian skin in air-conditioned offices",
        ],
      },
    },

    seoul: {
      ingredient: "PDRN",
      koreaHeat: "🔥🔥🔥🔥🔥",
      australiaHeat: "👀 just discovering it",
      whatIsIt:
        "Polydeoxyribonucleotide — short fragments of DNA, usually from salmon, purified down to a skincare-grade ingredient. In clinics it's injected. On a shelf it's a topical, and topical PDRN works on the surface: it's a strong humectant and appears to support the skin's own repair signalling rather than forcing turnover the way an acid or retinoid does.",
      whyKoreansLove:
        "It fits the Korean logic exactly: manage skin before it needs correcting. PDRN is the at-home echo of the \"skin booster\" injectables Koreans already get, so it reads as clinic-grade without downtime. Olive Young review volume for PDRN products has climbed steeply through 2025–26, and it's now a standard shelf category in Seoul, not a novelty.",
      shouldAussiesCare:
        "Honestly? It's a very good hydrator and a good barrier-support ingredient, and it plays well with a sensitised, over-exfoliated face — which is a common Australian problem. It is not a retinoid replacement, and topical PDRN will not do what an injection does. Buy it if you want comfortable, calm, well-hydrated skin without irritation. Don't buy it expecting to erase a wrinkle.",
      tryIt: [
        {
          name: "Hyper PDRN Repair Ampoule 30ml",
          brand: "WELLAGE",
          price: "A$40",
          image: "/products/wellage/hyper-pdrn-repair-ampoule-30ml.png",
          note: "The easiest entry point — a concentrated PDRN repair ampoule, no fragrance.",
        },
        {
          name: "PDRN Pink Peptide Eye Cream 30ml",
          brand: "MEDICUBE",
          price: "A$38",
          image: "/products/medicube/pdrn-pink-peptide-eye-cream-30ml.png",
          note: "Where Koreans usually start: the thin skin that shows dehydration first.",
        },
        {
          name: "Atobarrier365 Cream (2nd Generation)",
          brand: "AESTURA",
          price: "A$55",
          image: "/products/aestura/atobarrier365-cream.png",
          note: "Not PDRN, but the barrier cream Korean dermatology clinics pair it with.",
        },
      ],
    },

    aisle: [
      {
        emoji: "🥑",
        concern: "Dry",
        pick: "Atobarrier365 Cream (2nd Generation)",
        brand: "AESTURA",
        why: "Ceramide-led occlusive that holds oil in skin that genuinely doesn't make enough.",
        image: "/products/aestura/atobarrier365-cream.png",
      },
      {
        emoji: "🍋",
        concern: "Dull",
        pick: "Revive Eye Serum: Ginseng + Retinal",
        brand: "Beauty of Joseon",
        why: "Ginseng with a low-dose retinal — brightens tired, dull skin without the sting of an acid.",
        image: "/products/beauty-of-joseon/revive-eye-serum-ginseng-plus-retinal-30ml.png",
      },
      {
        emoji: "🌶️",
        concern: "Irritated",
        pick: "Cicaful Ampoule 30ml",
        brand: "beplain",
        why: "Centella-led and stripped back. Calming, fragrance-free, nothing in it to react to.",
        image: "/products/beplain/cicaful-ampoule-30ml.png",
      },
      {
        emoji: "🍚",
        concern: "Dehydrated",
        pick: "Dive In Serum",
        brand: "TORRIDEN",
        why: "Low-molecular hyaluronic acid, applied damp. The thirst fix.",
        image: "/products/torriden/dive-in-serum.png",
      },
      {
        emoji: "🫛",
        concern: "Congested",
        pick: "Bio Collagen Real Deep Mask",
        brand: "BIODANCE",
        why: "Overnight hydrogel that softens congestion without scrubbing at it.",
        image: "/products/biodance/bio-collagen-real-deep-mask.png",
      },
    ],

    fiveMinute: {
      intro:
        "The \"I can't be bothered\" routine. Four steps, roughly five minutes, and honestly better for most Australian skin than eleven products applied inconsistently.",
      steps: [
        { step: "01 · Cleanse", what: "Low-foam, no squeak. If your face feels tight after, the cleanser is wrong.", pick: "Mung Bean pH-Balanced Cleansing Foam 80ml", brand: "beplain", image: "/products/beplain/mung-bean-ph-balanced-cleansing-foam-80ml.png" },
        { step: "02 · Hydrate", what: "Toner or HA serum onto damp skin. Two light passes, not one heavy one.", pick: "Dive In Serum", brand: "TORRIDEN", image: "/products/torriden/dive-in-serum.png" },
        { step: "03 · Treat", what: "One active. Niacinamide by day, or nothing at all on a bad skin week.", pick: "Revive Eye Serum: Ginseng + Retinal", brand: "Beauty of Joseon", image: "/products/beauty-of-joseon/revive-eye-serum-ginseng-plus-retinal-30ml.png" },
        { step: "04 · Moisturise", what: "Seal it. Morning: add SPF over the top, every single day, all year.", pick: "Dive In Soothing Cream", brand: "TORRIDEN", image: "/products/torriden/dive-in-soothing-cream.png" },
      ],
      closer:
        "That's it. You don't need eleven products to have a good skincare routine — you need four you'll actually use, and a sunscreen you don't hate.",
    },

    everyone: {
      topic: "Hyperpigmentation on deeper skin tones",
      image: portraitDeep,
      imageAlt: "Portrait of a woman with deep skin tone and even, healthy complexion",
      body: [
        "Post-inflammatory hyperpigmentation (PIH) is the dark mark left behind after skin has been inflamed — a pimple, a scratch, a reaction, a burn. It isn't scarring. It's pigment that melanocytes produced in response to injury, sitting in skin that hasn't cleared it yet. In deeper skin tones, more active melanocytes means PIH is more common, darker, and considerably slower to fade.",
        "Which changes the strategy completely. On deeper skin, the mark is usually caused by the irritation, not the original spot. Anything that inflames skin — a harsh scrub, a too-strong acid, a retinoid ramped up too fast, picking — can create a new mark that outlasts the thing you were treating. Aggressive exfoliation is not the shortcut it looks like; it's often the cause.",
        "So introduce brightening slowly and boringly. Start with tyrosinase-adjacent, low-irritation actives: niacinamide, tranexamic acid, alpha-arbutin, liquorice root. Two to three nights a week, one product at a time, three to four weeks before adding anything else. If it stings, it's too much. Consistency over eight to twelve weeks beats intensity over two, every time.",
        "And sunscreen is not optional here — it's the whole treatment. UV re-darkens existing PIH faster than any serum can fade it. The good news: Korean chemical and hybrid filters typically leave no cast on deeper skin, which is exactly why we stock them. A sunscreen you'll wear daily beats a high-zinc one you avoid because it turns you grey.",
      ],
    },

    weTriedIt: {
      product: "Aqua Squalane Moisturizing Cream",
      brand: "S.NATURE",
      duration: "2 weeks, one tester in Melbourne, one in Brisbane",
      image: "/products/s-nature/aqua-squalane-moisturizing-cream.png",
      scores: [
        { label: "Texture", value: "9/10" },
        { label: "Dry skin", value: "⭐⭐⭐⭐⭐" },
        { label: "Oily skin", value: "⭐⭐⭐" },
        { label: "Melbourne winter", value: "⭐⭐⭐⭐⭐" },
        { label: "Brisbane summer", value: "⭐⭐⭐⭐" },
      ],
      verdict:
        "If you hate heavy creams but wake up feeling tight and dry, this is worth trying. Our Brisbane tester found it fine morning and night; our Melbourne tester wanted something richer by week two on the coldest nights. Nobody broke out.",
    },

    basket: {
      forWho: "For dehydrated skin",
      items: [
        { name: "Dive In Serum", brand: "TORRIDEN", price: "A$38", image: "/products/torriden/dive-in-serum.png", note: "Water in." },
        { name: "1025 Dokdo Toner 100ml", brand: "ROUND LAB", price: "A$18", image: "/products/round-lab/1025-dokdo-toner-100ml.png", note: "The layer underneath." },
        { name: "Atobarrier365 Cream (2nd Generation)", brand: "AESTURA", price: "A$55", image: "/products/aestura/atobarrier365-cream.png", note: "Water stays in." },
        { name: "Derma UV365 Barrier Moisture Mineral Sun Cream 20ml", brand: "AESTURA", price: "A$10", image: "/products/aestura/derma-uv365-barrier-moisture-mineral-sun-cream.png", note: "Non-negotiable." },
      ],
    },

    askTheGrocer: {
      prompt: "What do you want us to investigate next?",
      options: [
        "Why is my skin suddenly dry?",
        "PDRN — worth the hype?",
        "How do I get rid of congestion?",
        "K-beauty for pigmentation?",
      ],
    },
  },
];

export const flatlayImage = routineFlatlay;

export function getIssue(slug: string) {
  return newsletterIssues.find((i) => i.slug === slug);
}
