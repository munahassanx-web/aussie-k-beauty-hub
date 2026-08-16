/**
 * Structured, server-side logging for the cart → Stripe session → webhook path.
 *
 * Every line is a single JSON object prefixed with `[commerce]` so it can be
 * grepped out of the server function / webhook logs and read as JSON:
 *
 *   [commerce] {"scope":"checkout","event":"session.created","trace":"a1b2c3d4",...}
 *
 * Rules:
 *  - never log secrets, API keys, tokens or full card/customer payloads
 *  - emails are masked, user ids are truncated
 *  - money is always logged in cents with explicit field names
 */

export type CommerceScope = 'checkout' | 'guest_checkout' | 'webhook' | 'points';

/** Short correlation id shared by every log line of one checkout/webhook flow. */
export function newTraceId(): string {
  return Math.random().toString(16).slice(2, 10);
}

/** j***e@example.com — enough to match a customer, not enough to leak an inbox. */
export function maskEmail(email: string | null | undefined): string | null {
  if (!email) return null;
  const [local, domain] = email.split('@');
  if (!domain) return '***';
  const head = local.slice(0, 1);
  const tail = local.length > 1 ? local.slice(-1) : '';
  return `${head}***${tail}@${domain}`;
}

export function shortId(value: string | null | undefined): string | null {
  if (!value) return null;
  return value.length <= 12 ? value : `${value.slice(0, 8)}…${value.slice(-4)}`;
}

function emit(level: 'log' | 'warn' | 'error', scope: CommerceScope, event: string, fields: Record<string, unknown>) {
  const payload: Record<string, unknown> = { scope, event, at: new Date().toISOString() };
  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined) payload[key] = value;
  }
  const line = `[commerce] ${JSON.stringify(payload)}`;
  if (level === 'error') console.error(line);
  else if (level === 'warn') console.warn(line);
  else console.log(line);
}

export function logCommerce(scope: CommerceScope, event: string, fields: Record<string, unknown> = {}) {
  emit('log', scope, event, fields);
}

export function warnCommerce(scope: CommerceScope, event: string, fields: Record<string, unknown> = {}) {
  emit('warn', scope, event, fields);
}

export function errorCommerce(scope: CommerceScope, event: string, error: unknown, fields: Record<string, unknown> = {}) {
  const e = error as { message?: string; type?: string; code?: string; statusCode?: number } | null;
  emit('error', scope, event, {
    ...fields,
    errorMessage: e?.message ?? String(error),
    errorType: e?.type,
    errorCode: e?.code,
    errorStatus: e?.statusCode,
  });
}

/** Timing helper: returns elapsed ms since the call. */
export function since(start: number): number {
  return Math.round(Date.now() - start);
}
