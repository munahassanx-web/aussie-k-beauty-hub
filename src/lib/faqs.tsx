// Curated FAQ content written for both humans and AI answer engines.
// Answers are self-contained: each one restates the question's subject so it
// can be lifted out of the page and still make sense on its own.

import type { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import type { ShopProduct } from '@/lib/shop-catalog';

export type Faq = {
  q: string;
  /** Short, direct answer. Kept self-contained for clean extraction. */
  a: ReactNode;
  /** Plain-text fallback for structured data and non-React consumers. */
  plainText?: string;
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
          text: f.plainText ?? (typeof f.a === 'string' ? f.a : ''),
        },
      })),
    }),
  };
}

// --- Home: buying K-beauty in Australia -------------------------------------

export const HOME_FAQS: Faq[] = [
  {
    q: 'How do I know Skin Grocer products are authentic?',
    a: 'We source our products through established Korean wholesale supply partners. When stock arrives in Melbourne, our team documents the supplier, purchase records and batch details before it is approved for sale. Your order includes a QR verification card linked to its genuine Skin Grocer verification record, so you can see the checks recorded for your products.',
  },
  {
    q: 'I am new to K-beauty — where should I start?',
    a: (
      <>
        Start with the essentials rather than a complicated routine. Choose a gentle cleanser and a moisturiser suited to how your skin feels, then introduce one additional product only when it has a clear purpose. During the day, use appropriate sun protection supplied lawfully for Australia and follow its labelled directions. If you would like guidance, use our{' '}
        <Link to="/consultation" className="text-primary underline underline-offset-4 hover:no-underline">
          Routine Finder
        </Link>{' '}
        to create a simple starting point from products available at Skin Grocer.
      </>
    ),
    plainText:
      'Start with the essentials rather than a complicated routine. Choose a gentle cleanser and a moisturiser suited to how your skin feels, then introduce one additional product only when it has a clear purpose. During the day, use appropriate sun protection supplied lawfully for Australia and follow its labelled directions. If you would like guidance, use our Routine Finder to create a simple starting point from products available at Skin Grocer.',
  },
  {
    q: 'Do I need a 10-step Korean skincare routine?',
    a: 'No. Korean skincare is not defined by the number of steps you use. A simple routine may be all you need: cleanse when needed, moisturise according to how your skin feels and use appropriate sun protection during the day. Optional hydration or targeted products can be introduced gradually when they have a clear role.',
  },
  {
    q: 'How will I know how to use the products I buy?',
    a: (
      <>
        Each product page explains where the product may fit within a routine, how to apply it and any important usage guidance. Our{' '}
        <Link to="/learn/hub" className="text-primary underline underline-offset-4 hover:no-underline">
          Learn Hub
        </Link>{' '}
        also provides plain-English guides to routine order, commonly discussed ingredients, patch testing and introducing new products gradually. The QR authenticity card included with your order opens its Skin Grocer verification record.
      </>
    ),
    plainText:
      'Each product page explains where the product may fit within a routine, how to apply it and any important usage guidance. Our Learn Hub also provides plain-English guides to routine order, commonly discussed ingredients, patch testing and introducing new products gradually. The QR authenticity card included with your order opens its Skin Grocer verification record.',
  },
  {
    q: 'How do I choose products for what I notice about my skin?',
    a: (
      <>
        Begin with what you notice—such as dryness, tightness, excess oil, dullness or easily unsettled skin—then consider texture preferences, your current routine and the product’s intended cosmetic role. Our{' '}
        <Link to="/" hash="shop-by-what-you-notice" className="text-primary underline underline-offset-4 hover:no-underline">
          Shop by What You Notice
        </Link>{' '}
        and{' '}
        <Link to="/consultation" className="text-primary underline underline-offset-4 hover:no-underline">
          Routine Finder
        </Link>{' '}
        tools can help narrow the options. Introduce one new product at a time and stop using it if significant irritation develops. Persistent or concerning skin problems should be discussed with a qualified health professional.
      </>
    ),
    plainText:
      'Begin with what you notice—such as dryness, tightness, excess oil, dullness or easily unsettled skin—then consider texture preferences, your current routine and the product’s intended cosmetic role. Our Shop by What You Notice and Routine Finder tools can help narrow the options. Introduce one new product at a time and stop using it if significant irritation develops. Persistent or concerning skin problems should be discussed with a qualified health professional.',
  },
  {
    q: 'How do shipping and returns work?',
    a: (
      <>
        Orders are dispatched from our Epping, Victoria warehouse. Free standard shipping is available on Australian orders of A$100 or more. Current dispatch estimates, delivery options and charges are shown in our{' '}
        <Link to="/shipping-policy" className="text-primary underline underline-offset-4 hover:no-underline">
          Shipping Policy
        </Link>{' '}
        and at checkout. Return eligibility and instructions are explained in our{' '}
        <Link to="/returns-policy" className="text-primary underline underline-offset-4 hover:no-underline">
          Returns &amp; Refund Policy
        </Link>
        . Your rights under Australian Consumer Law are not limited by our store policies.
      </>
    ),
    plainText:
      'Orders are dispatched from our Epping, Victoria warehouse. Free standard shipping is available on Australian orders of A$100 or more. Current dispatch estimates, delivery options and charges are shown in our Shipping Policy and at checkout. Return eligibility and instructions are explained in our Returns & Refund Policy. Your rights under Australian Consumer Law are not limited by our store policies.',
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
    a: 'PDRN stands for polydeoxyribonucleotide. In skincare, the name generally refers to DNA-derived fragments used in cosmetic formulations. Some early research and manufacturer testing explore appearance-related hydration and elasticity outcomes, but independent evidence for topical skincare remains limited.',
    points: [
      'Evidence strength: EMERGING — limited independent topical evidence.',
      'Topical cosmetic products are not equivalent to injectable medical treatments.',
      'Product performance depends on the complete formula — not the hero ingredient alone.',
      'Results should not be guaranteed.',
      'Customers receiving procedures should follow their treating professional’s aftercare advice.',
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
      a: `Yes. It is sourced through established Korean wholesale supply partners, documented by our Melbourne team and locally stocked in Australia. Orders are dispatched from our Melbourne warehouse, and delivery times follow the current estimates in our shipping policy. You can view a sample verification record on this site under Verify.`,
    },
    {
      q: `What can I use ${p.brand} ${p.name} with?`,
      a: `It generally sits well alongside hydrating and barrier-focused ingredients such as hyaluronic acid, niacinamide, panthenol, ceramides and centella. Introduce one new product at a time, and avoid using it in the same session as a strong exfoliating acid or retinal — alternate those on separate nights.`,
    },
    {
      q: `How much does ${p.brand} ${p.name} cost in Australia?`,
      a: `${p.brand} ${p.name} is ${p.price} AUD at Skin Grocer, priced in Australian dollars including GST with no import surcharge at checkout.`,
    },
  ];
}

function concernLabel(c: ShopProduct['concerns'][number]): string {
  const map: Record<string, string> = {
    hydration: 'hydration and glow',
    acne: 'congestion and excess oil',
    pigmentation: 'the look of uneven tone',
    sensitivity: 'comfort for reactive skin',
    'anti-aging': 'firmness and the look of fine lines',
    barrier: 'barrier comfort',
  };
  return map[c] ?? c;
}
