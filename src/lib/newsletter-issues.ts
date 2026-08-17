// "The Skin Grocery List" — Skin Grocer's fortnightly newsletter, published on
// site as collectible issues. Each issue follows the same eight-part structure
// so readers learn the format and come back for it.

import portraitDeep from "@/assets/learn-portrait-deep.jpg";
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
