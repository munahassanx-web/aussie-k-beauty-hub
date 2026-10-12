// Real Korean customer reviews for the products we stock that rank on the
// Hwahae Global Trending board.
//
// Sourcing rule (non-negotiable): every quote below is an actual published
// review written by a Korean shopper on unpa.me — Korea's independent
// "내돈내산" (bought-with-my-own-money) review community. unpa.me is a separate
// platform from Hwahae; its reviews do not feed the Hwahae ranking. Each quote
// is a verbatim excerpt checked against its permalink. Nothing here is invented,
// paraphrased into a claim, or generated. Each entry carries the reviewer's
// handle, their self-declared skin type where published, the publication date
// and a link back to the original review so any figure can be checked.
//
// The star rating and review count shown next to a quote are Hwahae's own
// aggregate figures (see korea-rankings.ts) — the quote is one voice inside
// that aggregate, not the source of it.

export type KoreanReview = {
  /** Original Korean text, verbatim excerpt. */
  ko: string;
  /** Plain-English translation of that excerpt. */
  en: string;
  /** Reviewer handle as published. */
  author: string;
  /** Self-declared skin type, as published (Korean → English). */
  skinType?: string;
  /** Publication date as published. */
  date: string;
  /** Permalink to the original review. */
  url: string;
};

export const REVIEW_SOURCE = 'unpa.me';
export const REVIEW_SOURCE_URL = 'https://unpa.me';

/** Keyed by Skin Grocer priceId. */
export const KOREAN_REVIEWS: Record<string, KoreanReview> = {
  aestura_atobarrier365_cream_onetime: {
    ko: '보습 크림 중에서 정말 이만한 인생템이 없는 것 같아요. 크림 안에 미세한 보습 캡슐이 들어있는데 피부에 부드럽게 문지르면 사르르 녹아내리면서 흡수됩니다.',
    en: 'Of all the moisturisers I have tried, nothing else comes close. There are fine hydrating capsules inside the cream, and when you smooth it gently over the skin they melt away and absorb.',
    author: '까르릉#n60Z',
    skinType: 'Sensitive',
    date: '12 July 2026',
    url: 'https://unpa.me/reviews/453381',
  },
  wellage_real_hyaluronic_soothing_cream_80ml_onetime: {
    ko: '바르는 순간 부드럽게 펴 발리면서 피부에 수분이 촘촘하게 채워지는 느낌이 들었고, 속건조를 잘 잡아줘서 피부가 한결 편안했어요.',
    en: 'It spreads softly the moment it goes on and the skin feels densely filled with water. It handles that dry-underneath feeling well, so my skin sits much more comfortably.',
    author: '츈식맘',
    date: '6 June 2026',
    url: 'https://unpa.me/reviews/443160',
  },
  s_nature_aqua_squalane_moisturizing_cream_onetime: {
    ko: '무겁거나 답답한 느낌이 전혀 없어 여름철이나 오일감이 부담스러운 지성·복합성 피부에 매우 잘 맞습니다.',
    en: 'There is nothing heavy or suffocating about it, so it suits summer — and oily or combination skin that finds an oily feel too much.',
    author: 'ㅇ_ㅇ#z1Y1',
    date: '12 August 2026',
    url: 'https://unpa.me/reviews/462908',
  },
};

export function koreanReview(priceId: string): KoreanReview | undefined {
  return KOREAN_REVIEWS[priceId];
}
