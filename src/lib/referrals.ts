// Refer a friend: the friend gets A$10 off a first order, the person who
// shared the link gets A$10 off their next order once the friend has paid.
// Pure rules only — the server and the browser both import this file.

export const FRIEND_DISCOUNT_CENTS = 1000;
export const REFERRER_CREDIT_CENTS = 1000;
/** The friend's discount needs a basket of at least this much (before delivery). */
export const FRIEND_MIN_SUBTOTAL_CENTS = 4000;
export const FRIEND_DISCOUNT_LABEL = 'A$10';
export const FRIEND_MIN_SUBTOTAL_LABEL = 'A$40';
/** An invite link is remembered in the browser for this long. */
export const INVITE_TTL_MS = 30 * 24 * 60 * 60 * 1000;
export const INVITE_BASE_URL = 'https://skingrocer.com.au/invite';
/** Stripe metadata values are capped at 500 characters; ten credit ids fit. */
export const MAX_CREDITS_PER_ORDER = 10;

// No 0/O or 1/I/L so a code read aloud or retyped can't be misread.
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const CODE_RE = /^[A-Z0-9]{4,16}$/;

export function normaliseReferralCode(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const code = raw.trim().toUpperCase();
  return CODE_RE.test(code) ? code : null;
}

/** A friendly code from the first name, e.g. MUNA7K3Q. `random` returns 0..1. */
export function makeReferralCode(name: string | null | undefined, random: () => number = Math.random): string {
  const prefix = (name ?? '')
    .normalize('NFKD')
    .replace(/[^A-Za-z]/g, ' ')
    .trim()
    .split(/\s+/)[0]
    .toUpperCase()
    .slice(0, 6);
  let suffix = '';
  for (let i = 0; i < 4; i++) suffix += CODE_ALPHABET[Math.floor(random() * CODE_ALPHABET.length)];
  return `${prefix || 'GLOW'}${suffix}`;
}

export function inviteUrl(code: string): string {
  return `${INVITE_BASE_URL}/${code}`;
}

export function friendDiscountFor(subtotalCents: number): number {
  return subtotalCents >= FRIEND_MIN_SUBTOTAL_CENTS ? FRIEND_DISCOUNT_CENTS : 0;
}

/**
 * How many earned A$10 credits to spend on this basket. Credits are whole
 * A$10 units and, with any other discount, never take the order below A$1
 * so Stripe still has an amount to charge.
 */
export function creditsToApply(availableCredits: number, subtotalCents: number, otherDiscountCents = 0): number {
  const room = subtotalCents - 100 - otherDiscountCents;
  if (room < REFERRER_CREDIT_CENTS || availableCredits <= 0) return 0;
  return Math.min(availableCredits, MAX_CREDITS_PER_ORDER, Math.floor(room / REFERRER_CREDIT_CENTS));
}

/** First name only, for the invite page ("Muna sent you A$10"). */
export function firstNameOf(displayName: string | null | undefined): string | null {
  const first = (displayName ?? '').trim().split(/\s+/)[0];
  if (!first || first.includes('@')) return null;
  return first.slice(0, 24);
}
