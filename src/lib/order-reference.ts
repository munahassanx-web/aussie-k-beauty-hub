/**
 * Customer-facing order reference — client-safe.
 *
 * This is the single source of truth for the "SG-XXXXXXXX" reference shown to
 * customers (emails) and used by staff as the operational reference (admin,
 * MyPost Business "Your reference"). The internal order UUID is never used as
 * the operational reference.
 */
export function orderReference(id: string): string {
  return `SG-${id.slice(0, 8).toUpperCase()}`;
}
