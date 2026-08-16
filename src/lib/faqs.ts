// Curated FAQ content written for both humans and AI answer engines.
// Answers are self-contained: each one restates the question's subject so it
// can be lifted out of the page and still make sense on its own.

import type { ShopProduct } from '@/lib/shop-catalog';

export type Faq = {
  q: string;
  /** Short, direct answer. Kept self-contained for clean extraction. */
  a: string;
  /** Optional supporting points, rendered as a bullet list. */
  points?: string[];
};

/** Structured-data script entry for a route `head()` scripts array. */
export function faqJsonLd(items: Faq[]) {
  return {
    type: 'application/ld+json',
    children: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: items.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: [f.a, ...(f.points ?? [])].join(' '),
        },
      })),
    }),
  };
}

// --- Home: buying K-beauty in Australia -------------------------------------

export const HOME_FAQS: Faq[] = [
  {
    q: 'What is K-beauty and why does Korean skincare work so well?',
    a: 'K-beauty is skincare developed in South Korea around prevention rather than correction: hydrate the skin barrier daily, protect it from UV, and treat problems before they become permanent. Korean brands iterate formulas far faster than Western ones because domestic shoppers review everything publicly, so ingredient concentrations, textures and price-to-performance improve every season.',
    points: [
      'Layered, lightweight hydration instead of one heavy cream.',
      'Daily sunscreen treated as a skincare step, not a beach product.',
      'Barrier-first actives — centella, ceramides, panthenol, PDRN — before strong exfoliants.',
      'Cosmetically elegant textures, so people actually stick to the routine.',
    ],
  },
  {
    q: 'What is the correct order for a Korean skincare routine?',
    a: 'Apply products from thinnest to thickest. Morning: cleanser, toner, serum, moisturiser, sunscreen. Evening: oil cleanser, water-based cleanser, toner, treatment (serum, essence or mask), moisturiser. You do not need ten steps — four or five well-chosen products beat a long routine you skip.',
    points: [
      'AM: cleanse → tone → serum → moisturise → SPF 50+',
      'PM: oil cleanse → foam cleanse → tone → treat → moisturise',
      'Wait 30–60 seconds between layers rather than a set number of minutes.',
      'Add one new product at a time so you can tell what is working.',
    ],
  },
  {
    q: 'Are Skin Grocer products authentic Korean products?',
    a: 'Yes. Skin Grocer sources directly from Korean brands and their authorised distributors, and every batch is checked on arrival at our Melbourne warehouse. We do not buy grey-market stock, and each order ships with a provenance card showing the batch details.',
  },
  {
    q: 'How fast is delivery, and do you ship across Australia?',
    a: 'We dispatch from our Melbourne warehouse in Epping, Victoria. Orders placed before 12pm on a business day are dispatched the same day and typically arrive the next business day in metro Melbourne, Sydney, Canberra, Adelaide and Brisbane. Regional and WA/NT addresses usually take 2–5 business days.',
  },
  {
    q: 'Is Korean sunscreen legal to buy and use in Australia?',
    a: 'Yes, you can buy and use Korean sunscreen in Australia. Sunscreens sold with therapeutic SPF claims here are regulated by the TGA, so the SPF wording on an imported Korean product may differ from its Korean label. We list products with the information supplied by the brand and never invent Australian SPF ratings.',
  },
  {
    q: 'Is Korean skincare suitable for Australian climate and skin?',
    a: 'Most of it is, but not all of it translates directly. Formulas built for Seoul winters can feel heavy in a Brisbane summer, and Australian UV is far stronger year-round, so daily high-protection sunscreen and barrier support matter more here. Every product we stock is chosen and described with Australian humidity, hard water and UV in mind.',
  },
  {
    q: 'How do I find the right Korean products for my skin type?',
    a: 'Take the free two-minute Skin Grocer consultation. It asks about your skin type, concerns, climate and current routine, then returns a step-by-step routine using products we actually hold in stock, with the reason each one was chosen.',
  },
  {
    q: 'What is your returns and refund policy?',
    a: 'Unopened products can be returned within 30 days. If a routine we recommended does not work for your skin, our 30-day glow-or-refund guarantee covers it — contact hello@skingrocer.com.au with your order number and we will make it right.',
  },
];

// --- Standalone /faq page: home FAQs plus membership questions ---------------

export const FAQ_PAGE_FAQS: Faq[] = [
  ...HOME_FAQS,
  {
    q: 'What is the Restock Club and how do points work?',
    a: 'Every order earns points automatically — 1 point per A$1 spent. 100 points = A$5 in rewards, redeemable at checkout.',
  },
  {
    q: 'Can I subscribe and save on my favourite products?',
    a: 'Yes — Subscribe & Save gives 15% off eligible restock products, with 30/45/60/90-day delivery cadence options. You can pause or skip anytime from your account.',
  },
];

// --- Shop: choosing and buying ----------------------------------------------

export const SHOP_FAQS: Faq[] = [
  {
    q: 'How many Korean skincare products do I actually need?',
    a: 'Four: a gentle cleanser, a hydrating toner or serum, a moisturiser, and a sunscreen. Everything else — essences, ampoules, sheet masks, exfoliants — is optional and should be added one at a time once the core four are consistent.',
  },
  {
    q: 'What is the difference between a toner, an essence, an ampoule and a serum?',
    a: 'They differ mainly in concentration and thickness. A Korean toner is a watery hydrating layer (not an astringent), an essence is a slightly richer hydrating step, a serum targets one concern at a higher active level, and an ampoule is the most concentrated of the four, usually used as a short course.',
    points: [
      'Toner: hydration and prep, applied straight after cleansing.',
      'Essence: lightweight hydration and skin conditioning.',
      'Serum: targeted actives for tone, texture, firmness or breakouts.',
      'Ampoule: highest concentration, best used in bursts or for stubborn concerns.',
    ],
  },
  {
    q: 'Which Korean ingredients should not be combined?',
    a: 'Avoid stacking strong actives in the same routine. Do not layer retinal with AHA/BHA exfoliants or high-strength vitamin C in a single session; alternate them across nights instead. Niacinamide, hyaluronic acid, centella, ceramides and peptides are all safe to combine.',
    points: [
      'Retinal or retinol + AHA/BHA in the same routine: alternate nights.',
      'Pure vitamin C + strong exfoliating acids: split AM and PM.',
      'Two different exfoliants at once: choose one, two to three times a week.',
      'Safe together: niacinamide, hyaluronic acid, PDRN, ceramides, panthenol, centella.',
    ],
  },
  {
    q: 'Do you have Afterpay or payment plans?',
    a: 'Checkout is card-based through our secure payment provider. Subscribe & Save gives a standing 15% off eligible products delivered on your schedule, which is the cheapest way to buy the products you repurchase.',
  },
  {
    q: 'How do I check a Korean product is genuine?',
    a: 'Check the batch code on the base or crimp of the packaging, the Korean-language regulatory text on the back, and the seal. Every Skin Grocer order includes a provenance card with the batch reference so you can verify the exact unit you received.',
  },
  {
    q: 'What if a product breaks me out or stings?',
    a: 'Stop the new product, go back to cleanser, moisturiser and sunscreen only for a week, then reintroduce one product every five to seven days. Email hello@skingrocer.com.au and we will help you rebuild the routine — our 30-day guarantee applies.',
  },
];

// --- Ingredients / education ------------------------------------------------

export const INGREDIENT_FAQS: Faq[] = [
  {
    q: 'What is PDRN in Korean skincare and what does it do?',
    a: 'PDRN (polydeoxyribonucleotide) is a repair ingredient made from purified DNA fragments, most often from salmon. Topically it is used to support skin recovery, elasticity and barrier resilience, which is why it appears in Korean "repair" serums rather than in exfoliating or brightening products.',
    points: [
      'Best for: stressed, post-treatment, sun-exposed or ageing skin.',
      'Use it: evening, after toner, before moisturiser.',
      'Pairs with: peptides, niacinamide, hyaluronic acid, ceramides.',
      'Topical PDRN is a cosmetic ingredient and is not the same as an injectable clinic treatment.',
    ],
  },
  {
    q: 'What is centella asiatica (cica) and who is it for?',
    a: 'Centella asiatica, sold in Korea as "cica", is a herb whose extracts (madecassoside, asiaticoside) are used to calm visible redness and support barrier recovery. It suits sensitive, reactive, post-acne and sunburn-prone skin, and it layers safely with almost everything else.',
  },
  {
    q: 'What does niacinamide do, and how much is too much?',
    a: 'Niacinamide is vitamin B3. It helps with uneven tone, visible pores, oil balance and barrier function. Most Korean formulas sit between 2% and 5%, which suits daily use; 10% and above can sting sensitive skin without adding much benefit.',
  },
  {
    q: 'Does snail mucin actually work?',
    a: 'Snail secretion filtrate is a hydrating, film-forming ingredient rich in glycoproteins and hyaluronic acid. It is genuinely good at making skin feel plump and comfortable and at supporting healing of post-acne marks, but it is a hydrator and soother, not an anti-ageing active on its own.',
  },
  {
    q: 'What is the difference between hyaluronic acid molecular weights?',
    a: 'High molecular weight hyaluronic acid sits on the surface and holds water there; low molecular weight forms travel further into the upper layers for longer-lasting plumpness. Korean serums often use a multi-weight complex so you get both immediate surface hydration and deeper water retention.',
  },
  {
    q: 'Where do K-beauty plant ingredients come from?',
    a: 'Most trace back to Korean and East Asian traditional medicine. Ginseng has been cultivated in Korea for over a thousand years and is used for firmness; heartleaf (houttuynia cordata) was a folk remedy for inflammation and now anchors calming lines; mugwort (ssuk) was used in baths and teas and is now a staple soothing extract; rice ferment comes from centuries of using rice water on skin and hair.',
  },
  {
    q: 'Do I need a Korean toner if I already use a moisturiser?',
    a: 'A Korean toner is not the stripping alcohol toner of the 1990s — it is a watery hydration step. If your skin feels tight after cleansing or your serums pill, a hydrating toner helps; if your skin is comfortable and your routine works, it is optional.',
  },
];

// --- Trends / Seoul signal --------------------------------------------------

export const TREND_FAQS: Faq[] = [
  {
    q: 'What are the biggest Korean skincare trends right now?',
    a: 'The current Korean market has moved away from aggressive exfoliation toward repair and resilience. The dominant themes are barrier recovery ingredients (PDRN, exosome-positioned serums, peptides), "skin cycling" style routine restraint, collagen-film overnight masks, and hybrid sun care that behaves like skincare.',
    points: [
      'PDRN and peptide repair serums replacing high-strength acid routines.',
      'Overnight collagen hydrogel masks that dissolve onto the skin.',
      'Pore-care pads and toner pads as a controlled, low-mess exfoliation step.',
      'Sun sticks and serum-textured SPF for reapplication over makeup.',
      'Sensitive-skin reformulations: fragrance-free, low-pH, short ingredient lists.',
    ],
  },
  {
    q: 'Should I follow Korean skincare trends I see on TikTok?',
    a: 'Treat TikTok as discovery, not evidence. Trends like slugging, glass skin and 10-step routines are real techniques, but they were filmed in a different climate on a different skin type. We check what Korean shoppers actually repurchase domestically before stocking anything, then test whether it holds up in Australian humidity and UV.',
  },
  {
    q: 'Why do new Korean products take so long to reach Australia?',
    a: 'Australian retail typically lags Korean launches by 12 to 18 months because of distribution agreements, ingredient and labelling compliance, and freight. We shorten that by importing directly and holding stock locally, so new releases land here without an international shipping wait.',
  },
  {
    q: 'What should I stop using if my skin is irritated?',
    a: 'Pause exfoliating acids, retinal, scrubs, high-strength vitamin C and any fragranced product. Run cleanser, a barrier moisturiser with ceramides or centella, and sunscreen for seven to ten days, then reintroduce one active at a time.',
  },
];

// --- Product-level FAQs -----------------------------------------------------

/** Generates factual, product-specific questions from catalog data. */
export function productFaqs(
  p: ShopProduct,
  opts?: { steps?: string[]; description?: string },
): Faq[] {
  const stepText = opts?.steps?.length
    ? opts.steps.join(' ')
    : `Apply ${p.name} to clean skin as part of your routine, then follow with moisturiser and, in the morning, sunscreen.`;

  const concernText = p.concerns.length
    ? ` It is most often chosen for ${p.concerns.map(concernLabel).join(', ')}.`
    : '';

  return [
    {
      q: `How do I use ${p.brand} ${p.name}?`,
      a: stepText,
    },
    {
      q: `What is ${p.brand} ${p.name} good for?`,
      a: `${p.brand} ${p.name} is the ${p.category.toLowerCase()} step in a Korean skincare routine.${concernText} ${opts?.description ?? ''}`.trim(),
    },
    {
      q: `Is ${p.brand} ${p.name} authentic, and where does it ship from?`,
      a: `Yes. This stock is sourced from ${p.brand} or its authorised distributor and held in our Melbourne warehouse in Epping, Victoria. Order before 12pm on a business day and it is dispatched the same day, with next-business-day delivery to most Australian metro addresses.`,
    },
    {
      q: `What can I use ${p.brand} ${p.name} with?`,
      a: `It layers safely with hydrating and barrier ingredients such as hyaluronic acid, niacinamide, panthenol, ceramides and centella. Avoid using it in the same session as a strong exfoliating acid or retinal — alternate those on separate nights.`,
    },
    {
      q: `How much does ${p.brand} ${p.name} cost in Australia?`,
      a: `${p.brand} ${p.name} is ${p.price} AUD at Skin Grocer, priced in Australian dollars with no import surcharge at checkout. Subscribe & Save takes 15% off eligible repeat deliveries.`,
    },
  ];
}

function concernLabel(c: ShopProduct['concerns'][number]): string {
  const map: Record<string, string> = {
    hydration: 'hydration and glow',
    acne: 'breakouts and congestion',
    pigmentation: 'pigmentation and uneven tone',
    sensitivity: 'sensitivity and redness',
    'anti-aging': 'firmness and fine lines',
    barrier: 'barrier repair',
  };
  return map[c] ?? c;
}
