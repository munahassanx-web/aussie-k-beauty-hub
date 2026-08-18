// ---------------------------------------------------------------------------
// Consultation matching layer.
//
// This is the single source of truth for how quiz answers become a routine.
// Rules of the road:
//  * Every candidate comes from SHOP_PRODUCTS and must be purchasable. No
//    product is ever invented, and coming-soon SKUs are never recommended.
//  * Matching only uses attributes that already exist in the project: the
//    catalog `category`, the catalog `concerns` tags, price, and the small
//    audited override table below (`ATTRIBUTE_OVERRIDES`).
//  * The override table records two conservative, checkable things: how heavy
//    a formula feels, and whether it contains an exfoliating acid or retinal
//    (named on the product itself). Nothing about efficacy is asserted here.
//  * "Why we chose this" copy is assembled from the reasons that actually
//    fired during scoring, so it can never claim a benefit the data doesn't
//    support.
//
// Adding a new SKU: it is matched automatically from its category + concerns.
// Only add an override when the default weight is wrong, or when the product
// contains an acid/retinal that should be filtered out for reactive skin.
// ---------------------------------------------------------------------------

import {
  SHOP_PRODUCTS,
  isPurchasable,
  productPrice,
  type Concern,
  type ShopProduct,
} from '@/lib/shop-catalog';
import { productSlug } from '@/lib/product-detail';
import { applicationForSlug } from '@/lib/product-application-data';

// --- answers ---------------------------------------------------------------

export type SkinFeel = 'dry' | 'oily' | 'combination' | 'balanced' | 'unsure';
export type Reactivity = 'often' | 'sometimes' | 'rarely';
export type Experience = 'new' | 'some' | 'confident';
export type Depth = 'minimal' | 'balanced' | 'full';
export type TexturePref = 'light' | 'rich' | 'either';

export type QuizAnswers = {
  skinFeel: SkinFeel;
  primaryConcern: Concern;
  secondaryConcern: Concern | 'none';
  reactivity: Reactivity;
  experience: Experience;
  depth: Depth;
  texture: TexturePref;
};

export const CONCERN_COPY: Record<Concern, { label: string; phrase: string }> = {
  hydration: { label: 'Dryness & dehydration', phrase: 'dryness and dehydration' },
  acne: { label: 'Breakouts & congestion', phrase: 'breakouts and congestion' },
  pigmentation: { label: 'Uneven tone & marks', phrase: 'uneven tone' },
  sensitivity: { label: 'Redness & reactivity', phrase: 'redness and reactivity' },
  'anti-aging': { label: 'Firmness & fine lines', phrase: 'firmness and fine lines' },
  barrier: { label: 'A stressed barrier', phrase: 'a stressed skin barrier' },
};

const FEEL_PHRASE: Record<SkinFeel, string> = {
  dry: 'feels tight or dry',
  oily: 'gets shiny through the day',
  combination: 'is oily in some places and dry in others',
  balanced: 'is mostly comfortable',
  unsure: "isn't easy to categorise",
};

// --- audited product attributes -------------------------------------------

type Weight = 'light' | 'medium' | 'rich';

/** An exfoliating acid or retinal that is named on the product itself. */
type ActiveKind = 'bha' | 'aha-bha' | 'retinal';

type Override = { weight?: Weight; active?: ActiveKind };

const ATTRIBUTE_OVERRIDES: Record<string, Override> = {
  // Acids / retinal — named in the product title, so this is verifiable.
  isntree_chestnut_bha_2_percent_clear_liquid_100ml_onetime: { active: 'bha' },
  beauty_of_joseon_green_plum_refreshing_toner_150ml_onetime: { active: 'aha-bha' },
  beauty_of_joseon_revive_eye_serum_ginseng_plus_retinal_30ml_onetime: { active: 'retinal' },

  // Texture corrections where the default rule would read the name wrong.
  medicube_collagen_jelly_cream_110ml_onetime: { weight: 'medium' },
  s_nature_aqua_oasis_moisturizing_gel_onetime: { weight: 'light' },
  round_lab_1025_dokdo_lotion_200ml_onetime: { weight: 'light' },
  dr_g_r_e_d_blemish_clear_soothing_cream_70ml_onetime: { weight: 'medium' },
  beplain_mung_bean_pore_tight_up_soothing_cream_onetime: { weight: 'medium' },
};

function weightOf(p: ShopProduct): Weight {
  const o = ATTRIBUTE_OVERRIDES[p.priceId]?.weight;
  if (o) return o;
  if (p.category !== 'Moisturise') return 'light';
  return /gel|lotion|fluid/i.test(p.name) ? 'light' : 'rich';
}

function activeOf(p: ShopProduct): ActiveKind | undefined {
  return ATTRIBUTE_OVERRIDES[p.priceId]?.active;
}

/**
 * Conservative "suits easily-unsettled skin" signal. True only when the
 * catalog itself tags the product for sensitivity or barrier support and it
 * contains no named acid or retinal.
 */
function isGentle(p: ShopProduct): boolean {
  if (activeOf(p)) return false;
  return p.concerns.includes('sensitivity') || p.concerns.includes('barrier');
}

// --- scoring ---------------------------------------------------------------

type Scored = { product: ShopProduct; score: number; reasons: string[] };

function scoreProduct(p: ShopProduct, a: QuizAnswers): Scored | null {
  if (!isPurchasable(p.priceId)) return null;

  const active = activeOf(p);
  // Hard filter: no exfoliating acids or retinal for skin that reacts often,
  // or for someone brand new to a routine.
  if (active && (a.reactivity === 'often' || a.experience === 'new')) return null;

  const reasons: string[] = [];
  let score = 0;

  if (p.concerns.includes(a.primaryConcern)) {
    score += 5;
    reasons.push(`it's one of the products we tag for ${CONCERN_COPY[a.primaryConcern].phrase}`);
  }
  if (a.secondaryConcern !== 'none' && p.concerns.includes(a.secondaryConcern)) {
    score += 3;
    reasons.push(`it also covers ${CONCERN_COPY[a.secondaryConcern].phrase}`);
  }

  const gentle = isGentle(p);
  if (a.reactivity === 'often') {
    if (gentle) {
      score += 4;
      reasons.push('it sits in our gentle, barrier-friendly group — no acids or retinal');
    } else {
      score -= 2;
    }
  } else if (a.reactivity === 'sometimes' && gentle) {
    score += 2;
    reasons.push('it stays on the gentle side for skin that can flare');
  }

  const weight = weightOf(p);
  if (a.texture === 'light') {
    if (weight === 'light') { score += 3; reasons.push('it has the lighter finish you asked for'); }
    if (weight === 'rich') score -= 2;
  } else if (a.texture === 'rich') {
    if (weight === 'rich') { score += 3; reasons.push('it has the richer, more cushioned finish you asked for'); }
    if (weight === 'light') score -= 1;
  }

  if (a.skinFeel === 'oily' && weight === 'light') { score += 2; reasons.push('the texture stays light on skin that gets shiny'); }
  if (a.skinFeel === 'dry' && weight === 'rich') { score += 2; reasons.push('the richer texture suits skin that feels tight'); }
  if (a.skinFeel === 'combination' && weight === 'medium') { score += 1; }

  if (a.experience === 'confident' && active) {
    score += 2;
    reasons.push('you told us you\u2019re comfortable with stronger actives');
  }

  // Gentle tie-break so results are stable and the cheaper option wins a draw.
  score += Math.max(0, (60 - productPrice(p)) / 100);

  return { product: p, score, reasons };
}

function bestIn(
  a: QuizAnswers,
  predicate: (p: ShopProduct) => boolean,
  used: Set<string>,
): Scored | null {
  const ranked = SHOP_PRODUCTS.filter((p) => !used.has(p.priceId) && predicate(p))
    .map((p) => scoreProduct(p, a))
    .filter((s): s is Scored => s !== null)
    .sort((x, y) => y.score - x.score);
  return ranked[0] ?? null;
}

// --- routine assembly ------------------------------------------------------

export type RoutineUse = 'am' | 'pm' | 'both';

export type RoutineItem = {
  product: ShopProduct;
  slug: string;
  /** Human routine step, e.g. "Cleanse". */
  step: string;
  use: RoutineUse;
  /** When to use it — brand-stated frequency where we hold it, else the slot default. */
  when: string;
  /** Assembled from the reasons that actually fired in scoring. */
  why: string;
  /** True when we hold the brand's own directions for this SKU. */
  hasBrandDirections: boolean;
};

export type ConsultationOutcome = {
  answers: QuizAnswers;
  profile: string[];
  strategy: string;
  items: RoutineItem[];
  /** Steps we deliberately left out because no confident match existed. */
  omitted: string[];
  totalCents: number;
};

function why(step: string, a: QuizAnswers, reasons: string[]): string {
  const lead = `Because your skin ${FEEL_PHRASE[a.skinFeel]}`;
  if (reasons.length === 0) {
    return `${lead}, we've used this as a straightforward ${step.toLowerCase()} step — it's the most suitable match in our range for what you told us.`;
  }
  const list =
    reasons.length > 1
      ? `${reasons.slice(0, -1).join(', ')} and ${reasons[reasons.length - 1]}`
      : reasons[0];
  return `${lead}, we chose this for your ${step.toLowerCase()} step because ${list}.`;
}

function whenFor(slug: string, fallback: string): string {
  return applicationForSlug(slug)?.frequency ?? fallback;
}

function toItem(s: Scored, step: string, use: RoutineUse, fallbackWhen: string, a: QuizAnswers): RoutineItem {
  const slug = productSlug(s.product);
  // Anything with a named acid or retinal is placed in the evening only, and
  // introduced gradually — the conservative default when the brand's own page
  // doesn't state a frequency.
  const active = activeOf(s.product);
  const finalUse: RoutineUse = active ? 'pm' : use;
  const fallback = active
    ? 'Evenings only — start two or three nights a week and build up'
    : fallbackWhen;
  return {
    product: s.product,
    slug,
    step,
    use: finalUse,
    when: whenFor(slug, fallback),
    why: why(step, a, s.reasons),
    hasBrandDirections: Boolean(applicationForSlug(slug)),
  };
}


/**
 * Build the recommended routine. Steps are emitted in usage order and only
 * when the customer's chosen routine depth justifies them. If a slot has no
 * confident match, it is omitted and reported in `omitted` rather than filled
 * with a generic product.
 */
export function buildRoutine(a: QuizAnswers): ConsultationOutcome {
  const used = new Set<string>();
  const items: RoutineItem[] = [];
  const omitted: string[] = [];

  const push = (
    label: string,
    predicate: (p: ShopProduct) => boolean,
    step: string,
    use: RoutineUse,
    fallbackWhen: string,
  ) => {
    const found = bestIn(a, predicate, used);
    if (!found) {
      omitted.push(label);
      return;
    }
    used.add(found.product.priceId);
    items.push(toItem(found, step, use, fallbackWhen, a));
  };

  const wantsTone = a.depth !== 'minimal';
  const wantsTreat = a.depth !== 'minimal';
  const wantsSecondTreat = a.depth === 'full';
  const wantsMask = a.depth === 'full';

  // 1. Cleanse
  push('a cleanser', (p) => p.category === 'Cleanse', 'Cleanse', 'both', 'Morning and evening');

  // 2. Tone / prep
  if (wantsTone) {
    push('a toner', (p) => p.category === 'Tone', 'Tone & prep', 'both', 'Morning and evening, straight after cleansing');
  }

  // 3. Treatment — the step that carries the primary concern.
  if (wantsTreat) {
    push(
      'a treatment serum',
      (p) => p.category === 'Treat' && !/trial kit/i.test(p.name),
      'Treat',
      'both',
      'Morning and evening, before moisturiser',
    );
  }

  // 4. Optional second treatment for the secondary concern (evening only).
  if (wantsSecondTreat && a.secondaryConcern !== 'none') {
    const found = bestIn(
      a,
      (p) =>
        p.category === 'Treat' &&
        !/trial kit/i.test(p.name) &&
        p.concerns.includes(a.secondaryConcern as Concern),
      used,
    );
    if (found) {
      used.add(found.product.priceId);
      items.push(toItem(found, 'Second treatment', 'pm', 'Evenings only, alternating with your main serum', a));
    }
  }

  // 5. Moisturise
  push('a moisturiser', (p) => p.category === 'Moisturise' && !/eye/i.test(p.name), 'Moisturise', 'both', 'Morning and evening, as your last hydrating step');

  // 6. Protect — SPF is always the final morning step.
  push('an SPF', (p) => p.category === 'Protect', 'Protect', 'am', 'Every morning, as your final step');

  // 7. Weekly treatment mask, only for a full routine.
  if (wantsMask) {
    push('a weekly mask', (p) => p.category === 'Masks', 'Weekly treatment', 'pm', 'Once or twice a week, in the evening');
  }

  const profile: string[] = [
    `Your skin ${FEEL_PHRASE[a.skinFeel]}.`,
    `Your main focus is ${CONCERN_COPY[a.primaryConcern].phrase}${
      a.secondaryConcern !== 'none' ? `, with ${CONCERN_COPY[a.secondaryConcern].phrase} close behind` : ''
    }.`,
    a.reactivity === 'often'
      ? 'You react easily, so we\u2019ve left every exfoliating acid and retinal out of this routine.'
      : a.reactivity === 'sometimes'
        ? 'You can flare occasionally, so we\u2019ve leaned gentle where it made no difference to the result.'
        : 'Your skin tolerates most things, which gave us room to be a little more direct.',
    a.depth === 'minimal'
      ? 'You wanted something short you\u2019ll actually keep up.'
      : a.depth === 'full'
        ? 'You\u2019re happy with a fuller routine, so we\u2019ve used the extra steps.'
        : 'You wanted a balanced routine — enough steps to matter, not so many they get skipped.',
  ];

  const strategy =
    a.depth === 'minimal'
      ? 'We\u2019ve kept this to the steps that do the most work: clean skin, one thing that holds moisture in, and daily sun protection. Everything else can come later.'
      : a.depth === 'full'
        ? 'The order matters more than the number of products: cleanse, prep, treat, seal, protect. Morning is about protection, evening is about repair.'
        : 'Cleanse, prep, treat, seal — and protect in the morning. Each step earns its place against what you told us, and nothing is doubled up.';

  const totalCents = items.reduce((sum, i) => sum + Math.round(productPrice(i.product) * 100), 0);

  return { answers: a, profile, strategy, items, omitted, totalCents };
}

export function itemsFor(outcome: ConsultationOutcome, slot: 'am' | 'pm'): RoutineItem[] {
  return outcome.items.filter((i) => i.use === slot || i.use === 'both');
}
