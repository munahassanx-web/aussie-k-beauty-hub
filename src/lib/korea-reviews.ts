// Real Korean customer reviews for the products we stock that rank on the
// Hwahae Global Trending board.
//
// Sourcing rule (non-negotiable): every quote below is an actual published
// review written by a Korean shopper on unpa.me — Korea's independent
// "내돈내산" (bought-with-my-own-money) review community, the same review pool
// that feeds the Hwahae-era ranking culture. Nothing here is invented,
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
    ko: '보습 크림 중에서 정말 이만한 인생템이 없는 것 같아요. 크림 안에 미세한 보습 캡슐이 들어있는데 피부에 부드럽게 문지르면 사르르 녹아내려요.',
    en: 'Of all the moisturisers I have tried, nothing else comes close. There are fine hydrating capsules inside the cream, and they melt away the moment you smooth it over the skin.',
    author: '고잉고잉고',
    skinType: 'Sensitive',
    date: '12 July 2026',
    url: 'https://unpa.me/reviews/453381',
  },
  beplain_mung_bean_ph_balanced_cleansing_foam_80ml_onetime: {
    ko: '제형 속에 콕콕 박혀 있는 미세한 녹두 가루 파우더가 자극 없이 부드럽게 롤링되면서 각질과 피지를 정돈해 줍니다. 약산성인데도 거품이 조밀해요.',
    en: 'The fine mung bean powder set through the formula rolls over the skin gently and tidies up flakes and oil without any sting. Even at low pH the lather stays dense.',
    author: 'ㅇ_ㅇ',
    date: 'August 2026',
    url: 'https://unpa.me/reviews/461511',
  },
  torriden_dive_in_serum_onetime: {
    ko: '수부지 피부에게 너무너무 추천해요. 끈적거리지 않아서 매일 쓰기 편하고, 건조할 때 몇 번씩 레이어링해도 피부에 싹 스며들어서 촉촉해요.',
    en: 'I really recommend it for dehydrated-but-oily skin. It is never tacky, so it is easy to use every day, and even layered several times on dry days it sinks straight in and stays comfortable.',
    author: '빈',
    date: '20 January 2026',
    url: 'https://unpa.me/reviews/389153',
  },
  wellage_real_hyaluronic_soothing_cream_80ml_onetime: {
    ko: '바르는 순간 부드럽게 펴 발리면서 피부에 수분이 촘촘하게 채워지는 느낌이 들었고, 속건조를 잘 잡아줘서 피부가 한결 편안했어요.',
    en: 'It spreads softly the moment it goes on and the skin feels densely filled with water. It handles that dry-underneath feeling well, so my skin sits much more comfortably.',
    author: '츈식맘',
    date: '6 June 2026',
    url: 'https://unpa.me/reviews/443160',
  },
  s_nature_aqua_oasis_toner_onetime: {
    ko: '보습 토너로 쓰고 있습니다. 레이어링 하기에 좋은 제품이라 속건조 잡기 위해 여러 번 겹쳐 발라요.',
    en: 'I use it purely as a hydrating toner. It layers really well, so I press on several rounds to deal with dryness underneath.',
    author: '쑤늬',
    date: '22 May 2026',
    url: 'https://unpa.me/reviews/438158',
  },
  s_nature_aqua_squalane_moisturizing_cream_onetime: {
    ko: '무겁거나 답답한 느낌이 전혀 없어 여름철이나 오일감이 부담스러운 지성·복합성 피부에 매우 잘 맞습니다.',
    en: 'There is nothing heavy or suffocating about it, so it suits summer — and oily or combination skin that finds richer creams too much.',
    author: 'ㅇ_ㅇ',
    date: 'August 2026',
    url: 'https://unpa.me/reviews/462908',
  },
};

export function koreanReview(priceId: string): KoreanReview | undefined {
  return KOREAN_REVIEWS[priceId];
}
