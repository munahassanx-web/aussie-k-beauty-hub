/**
 * Server-only helpers for the per-order authenticity card.
 *
 * Token model: 32 bytes of CSPRNG randomness rendered as Crockford-style
 * base32. The raw token is returned exactly once, at issue time, so it can be
 * printed onto the physical card. Only the SHA-256 hash and a short,
 * non-secret prefix are ever persisted.
 */

const ALPHABET = 'ABCDEFGHJKMNPQRSTVWXYZ0123456789'; // no I, L, O, U — misread-safe

function encode(bytes: Uint8Array, length: number) {
  let out = '';
  for (let i = 0; i < length; i += 1) {
    out += ALPHABET[bytes[i]! % ALPHABET.length];
  }
  return out;
}

export function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return encode(bytes, 32);
}

/** Human-readable, non-secret card reference printed on the card, e.g. SG-7F2K-9QD4. */
export function generateCardRef(): string {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  const raw = encode(bytes, 8);
  return `SG-${raw.slice(0, 4)}-${raw.slice(4, 8)}`;
}

export async function hashToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Tokens are uppercase base32; anything else can be rejected before a DB hit. */
export function isWellFormedToken(token: unknown): token is string {
  return typeof token === 'string' && /^[A-Z0-9]{32}$/.test(token);
}

export const REQUIRED_CHECKS = [
  'products_match',
  'branded_packaging',
  'catalogue_match',
  'packaging_inspected',
] as const;

export const OPTIONAL_CHECKS = ['approved_sourcing_channel'] as const;

export type CheckKey = (typeof REQUIRED_CHECKS)[number] | (typeof OPTIONAL_CHECKS)[number];

/**
 * Public-facing wording. Every line describes an action staff genuinely
 * perform and tick in Operations — nothing here is a default marketing claim.
 */
export const CHECK_LABELS: Record<CheckKey, string> = {
  products_match: 'Every product in the parcel was checked against this order',
  branded_packaging: 'Products arrived and were dispatched in original branded packaging',
  catalogue_match: 'Product identity matched to the Skin Grocer catalogue',
  packaging_inspected: 'Packaging visually inspected before dispatch',
  approved_sourcing_channel: 'Sourced through a Skin Grocer approved supply channel',
};

export const CHECK_LABELS_OPS: Record<CheckKey, string> = {
  products_match: 'Products in the parcel match the order',
  branded_packaging: 'Original branded packaging checked',
  catalogue_match: 'Product identity matched to the Skin Grocer catalogue',
  packaging_inspected: 'Packaging visually inspected (seals, damage)',
  approved_sourcing_channel: 'Approved sourcing channel confirmed (optional)',
};
