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
    q: 'How do I know Skin Grocer products are authentic?',
    a: 'Our products come straight from Seoul through approved supply channels. Every order is checked by our Melbourne team before it is sealed, and ships with a QR authenticity card linked to that specific order so you can see the verification record we made for it.',
  },
  {
    q: 'I am new to K-beauty — where should I start?',
    a: 'Start small. Choose a gentle cleanser, a moisturiser that suits how your skin feels, and a daytime sun protection product, then add one more step only when you know why you want it. If you would rather be guided, our skin consultation asks a short series of questions and returns a routine built from products we stock.',
  },
  {
    q: 'Do I need a 10-step Korean skincare routine?',
    a: 'No. Long routines are a style of shopping, not a requirement. A simple core — cleanse, moisturise, and sun protection during the day — works for most people, with hydration or treatment steps added according to what your own skin is asking for.',
  },
  {
    q: 'How will I know how to use the products I buy?',
    a: 'Every order includes a QR code that links to How to Apply guidance for the products you bought — where each one sits in your routine, how much to use and what to pair it with. You can also read the same guidance on each product page before you buy.',
  },
  {
    q: 'How do I choose products for what I notice about my skin?',
    a: 'Shop by what you notice rather than by category. Dryness and dullness point to hydration and barrier-focused care; congestion and visible pores to lighter textures and gentle exfoliation; sensitivity and easily unsettled skin to calming, fragrance-free formulas; uneven-looking tone and fine lines to targeted serums used consistently.',
    points: [
      'Add one new product at a time so you can tell what suits you.',
      'Keep strong exfoliants and retinal on separate nights.',
      'If something stings or unsettles your skin, pause it and go back to the basics.',
    ],
  },
  {
    q: 'How does shipping and returns work?',
    a: 'Orders are dispatched from our Melbourne warehouse in Epping, Victoria. Orders placed before 12pm on a business day are dispatched the same day, shipped with Australia Post — free standard delivery on orders A$100 and over, and free Express Post for Circle members. Unopened products can be returned within 30 days of delivery, and nothing in our policy limits your rights under Australian Consumer Law.',
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
    a: 'Check the code printed on the base or crimp of the packaging, the Korean-language regulatory text on the back, and the seal. Every Skin Grocer order also includes an authenticity card with a QR code and card reference you can scan to see the verification record we made for your order.',
  },
  {
    q: 'What if a product breaks me out or stings?',
    a: 'Stop the new product, go back to cleanser, moisturiser and sunscreen only for a week, then reintroduce one product every five to seven days. Email customercare@skingrocer.com.au and we will help you rebuild the routine — our 30-day guarantee applies.',
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
      a: `Yes. This stock is sourced from ${p.brand} or its authorised distributor and held in our Melbourne warehouse in Epping, Victoria. Order before 12pm on a business day and it is dispatched the same day with Australia Post. Estimated transit after dispatch is typically 1–2 business days to metro areas and 2–5 business days regionally — these are Australia Post estimates, not guarantees.`,
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
