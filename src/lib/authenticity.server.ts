/**
 * Server-only helpers for the per-order authenticity card.
 *
 * Token model: 32 characters drawn from CSPRNG bytes over a misread-safe
 * base32 alphabet. The raw token is returned exactly once, at issue time, so
 * it can be printed onto the physical card. Only the SHA-256 hash and a short,
 * non-secret prefix are ever persisted.
 */

const ALPHABET = 'ABCDEFGHJKMNPQRSTVWXYZ0123456789'; // no I, L, O, U

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

/** Tokens are uppercase base32; anything else is rejected before a DB hit. */
export function isWellFormedToken(token: unknown): token is string {
  return typeof token === 'string' && /^[A-Z0-9]{32}$/.test(token);
}
