// Remembers the invite code a friend arrived with, in this browser only,
// so it can be applied at checkout. Storage can be unavailable (private
// mode, blocked site data); the invite then simply isn't remembered.
import { INVITE_TTL_MS, normaliseReferralCode } from '@/lib/referrals';

const KEY = 'sg-invite';

export function saveInvite(code: string, now = Date.now()): void {
  const normalised = normaliseReferralCode(code);
  if (!normalised) return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ code: normalised, savedAt: now }));
  } catch {
    /* storage unavailable */
  }
}

export function readInvite(now = Date.now()): string | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { code?: unknown; savedAt?: unknown };
    const code = normaliseReferralCode(parsed.code);
    if (!code || typeof parsed.savedAt !== 'number' || now - parsed.savedAt > INVITE_TTL_MS) {
      window.localStorage.removeItem(KEY);
      return null;
    }
    return code;
  } catch {
    return null;
  }
}

export function clearInvite(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* storage unavailable */
  }
}
