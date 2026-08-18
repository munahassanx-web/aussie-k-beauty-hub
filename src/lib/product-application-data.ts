// Product-specific application directions, keyed by the catalog slug.
//
// SOURCE RULE (non-negotiable): every entry here is transcribed from the
// brand's own official product page or official brand documentation. No
// amounts, frequencies, AM/PM guidance, warnings or cautions are inferred.
// Wording may be lightly reformatted into steps, never changed in substance.
// `source` is maintainer-facing metadata (surfaced in /admin/guide-links),
// not customer-facing copy.
//
// A SKU with no entry here stays in the honest fallback state: the guide page
// labels the steps as general routine-step guidance, not brand directions.

export type ApplicationData = {
  /** Step-by-step directions, from the official brand page. */
  steps: string[];
  /** Only when the official source states an amount. */
  amount?: string;
  /** Only when the official source states frequency / AM-PM. */
  frequency?: string;
  /** Only when the official source states a product-specific note or caution. */
  note?: string;
  /** Official source URL (internal/admin reference). */
  source: string;
};

export const PRODUCT_APPLICATION: Record<string, ApplicationData> = {};

export function applicationForSlug(slug: string): ApplicationData | undefined {
  return PRODUCT_APPLICATION[slug];
}

export type CoverageStatus = 'complete' | 'partial' | 'fallback';

/**
 * COMPLETE  — official directions plus at least one supported extra field.
 * PARTIAL   — official directions only.
 * FALLBACK  — no authoritative directions found; generic guidance is shown.
 */
export function coverageForSlug(slug: string): CoverageStatus {
  const entry = PRODUCT_APPLICATION[slug];
  if (!entry || entry.steps.length === 0) return 'fallback';
  const extras = [entry.amount, entry.frequency, entry.note].filter(Boolean).length;
  return extras > 0 ? 'complete' : 'partial';
}
