// "The Skin Grocery List" — Skin Grocer's fortnightly newsletter, published on
// site as collectible issues. Each issue follows the same eight-part structure
// so readers learn the format and come back for it.

import torridenSerum from "@/assets/torriden-divein-serum.webp";
import aesturaSerum from "@/assets/aestura-cica365-serum.webp";
import anuaPdrn from "@/assets/anua-pdrn-cream.webp";
import medicubePdrn from "@/assets/medicube-pdrn-eye.webp";
import bojGlow from "@/assets/boj-glow-serum.webp";
import skin1004 from "@/assets/skin1004-centella-ampoule.webp";
import biodanceMask from "@/assets/biodance-collagen-mask.webp";
import centellaToner from "@/assets/product-centella-toner.jpg";
import cicaCream from "@/assets/product-cica-cream.jpg";
import riceCleanser from "@/assets/product-rice-cleanser.jpg";
import reliefSun from "@/assets/product-relief-sun.jpg";
import portraitDeep from "@/assets/learn-portrait-deep.jpg";
import routineFlatlay from "@/assets/learn-routine-flatlay.jpg";
import textureMacro from "@/assets/texture-macro.jpg";

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

export const upcomingIssues: { number: string; theme: string; title: string; heroes: string }[] = [
  { number: "02", theme: "The Barrier Issue", title: "Your Skin Barrier Is Not a Trend", heroes: "AESTURA + WELLAGE" },
  { number: "03", theme: "The Routine Issue", title: "The Korean 10-Step Routine Is Dead", heroes: "Round Lab + Torriden + Dr.G" },
  { number: "04", theme: "The PDRN Issue", title: "PDRN: Miracle Ingredient or Marketing?", heroes: "WELLAGE" },
  { number: "05", theme: "The Pigmentation Issue", title: "Why Your Dark Spots Keep Coming Back", heroes: "Isntree + Beauty of Joseon" },
  { number: "06", theme: "The Undiscovered Issue", title: "The Korean Products Australians Haven't Found Yet", heroes: "S.NATURE + beplain + AESTURA" },
];

export const newsletterIssues: NewsletterIssue[] = [
  {
    number: "01",
    slug: "why-is-my-skin-so-thirsty",
    title: "Why Is My Skin So Thirsty?",
    theme: "The Hydration Issue",
    date: "Fortnight of 13 August 2026",
    published: true,
    cover: textureMacro,
    coverAlt: "Macro texture of a clear hydrating serum",
    standfirst:
      "The difference between dry and dehydrated skin, why Australian air keeps winning that argument, and the four products that actually fix it.",

    bigQuestion: {
      question: "Do you actually need a toner?",
      body: [
        "Toner used to be an apology. In the era of stripping foam cleansers, Western toners were mostly alcohol and witch hazel — a second wipe to remove what the cleanser left behind and to \"rebalance pH\" after it had wrecked it. If that's your mental model, skipping toner is entirely reasonable. That product was solving a problem a good cleanser shouldn't create.",
        "Korean toners are a different category wearing the same name. They're closer to a light essence: humectant-led, watery, layered onto damp skin in one to three passes. Glycerin, panthenol, hyaluronic acid, sometimes a fermented extract or a low-dose PHA. The job isn't to clean — it's to get water into the top layers of skin while it's still damp, so everything after it has something to seal.",
        "Who actually benefits: anyone dehydrated, which in Australia is most of us for at least half the year. Air conditioning, heated cars, chlorinated pools, hard water in Adelaide and Perth, and a UV index that regularly hits 11+. If your skin feels tight ten minutes after cleansing, or your foundation clings and flakes while your T-zone still shines, you're dehydrated, not dry — and a hydrating toner is the cheapest fix available.",
        "Who can skip it: if you have genuinely oily, comfortable skin that never feels tight, and your moisturiser already sits well, a toner is optional. So is it if you're using a hydrating essence or a low-molecular HA serum on damp skin — that's the same job, done once. What we'd never recommend is an astringent, alcohol-forward toner used daily. That's the 1998 product, and it's the reason half of Australia thinks toner does nothing.",
      ],
      pick: {
        name: "1025 Dokdo Toner",
        brand: "Round Lab",
        price: "$32",
        image: centellaToner,
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
          name: "PDRN Hyaluronic Acid Capsule 100 Serum",
          brand: "Anua",
          price: "$44",
          image: anuaPdrn,
          note: "The easiest entry point — PDRN plus multi-weight HA, no fragrance.",
        },
        {
          name: "PDRN Pink Peptide Eye Serum",
          brand: "Medicube",
          price: "$46",
          image: medicubePdrn,
          note: "Where Koreans usually start: the thin skin that shows dehydration first.",
        },
        {
          name: "Atobarrier365 Cream",
          brand: "AESTURA",
          price: "$42",
          image: aesturaSerum,
          note: "Not PDRN, but the barrier cream Korean dermatology clinics pair it with.",
        },
      ],
    },

    aisle: [
      {
        emoji: "🥑",
        concern: "Dry",
        pick: "Atobarrier365 Cream",
        brand: "AESTURA",
        why: "Ceramide-led occlusive that holds oil in skin that genuinely doesn't make enough.",
        image: aesturaSerum,
      },
      {
        emoji: "🍋",
        concern: "Dull",
        pick: "Glow Serum: Propolis + Niacinamide",
        brand: "Beauty of Joseon",
        why: "2% niacinamide with propolis — clarity without the sting of an acid.",
        image: bojGlow,
      },
      {
        emoji: "🌶️",
        concern: "Irritated",
        pick: "Madagascar Centella Ampoule",
        brand: "SKIN1004",
        why: "One ingredient, 100% centella extract. Nothing in it to react to.",
        image: skin1004,
      },
      {
        emoji: "🍚",
        concern: "Dehydrated",
        pick: "DIVE-IN Low Molecular HA Serum",
        brand: "Torriden",
        why: "Five weights of hyaluronic acid, applied damp. The thirst fix.",
        image: torridenSerum,
      },
      {
        emoji: "🫛",
        concern: "Congested",
        pick: "Bio-Collagen Real Deep Mask",
        brand: "BIODANCE",
        why: "Overnight hydrogel that softens congestion without scrubbing at it.",
        image: biodanceMask,
      },
    ],

    fiveMinute: {
      intro:
        "The \"I can't be bothered\" routine. Four steps, roughly five minutes, and honestly better for most Australian skin than eleven products applied inconsistently.",
      steps: [
        { step: "01 · Cleanse", what: "Low-foam, no squeak. If your face feels tight after, the cleanser is wrong.", pick: "Rice Probiotics Cleansing Foam", brand: "I'm From", image: riceCleanser },
        { step: "02 · Hydrate", what: "Toner or HA serum onto damp skin. Two light passes, not one heavy one.", pick: "DIVE-IN Low Molecular HA Serum", brand: "Torriden", image: torridenSerum },
        { step: "03 · Treat", what: "One active. Niacinamide by day, or nothing at all on a bad skin week.", pick: "Glow Serum: Propolis + Niacinamide", brand: "Beauty of Joseon", image: bojGlow },
        { step: "04 · Moisturise", what: "Seal it. Morning: add SPF over the top, every single day, all year.", pick: "Cica Recovery Cream", brand: "Anua", image: cicaCream },
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
      product: "Aqua Squalane Cream",
      brand: "S.NATURE",
      duration: "2 weeks, one tester in Melbourne, one in Brisbane",
      image: cicaCream,
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
        { name: "DIVE-IN Low Molecular HA Serum", brand: "Torriden", price: "$36", image: torridenSerum, note: "Water in." },
        { name: "1025 Dokdo Toner", brand: "Round Lab", price: "$32", image: centellaToner, note: "The layer underneath." },
        { name: "Atobarrier365 Cream", brand: "AESTURA", price: "$42", image: aesturaSerum, note: "Water stays in." },
        { name: "Relief Sun SPF50+", brand: "Beauty of Joseon", price: "$22", image: reliefSun, note: "Non-negotiable." },
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
