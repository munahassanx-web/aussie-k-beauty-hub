/**
 * Client-safe verification checklist vocabulary.
 *
 * Every line describes an action Skin Grocer staff genuinely perform and tick
 * in Operations — nothing here is a default marketing claim, and only ticked
 * items are ever shown publicly.
 */

export const REQUIRED_CHECKS = [
  'products_match',
  'branded_packaging',
  'catalogue_match',
  'packaging_inspected',
] as const;

export const OPTIONAL_CHECKS = ['approved_sourcing_channel'] as const;

export type CheckKey = (typeof REQUIRED_CHECKS)[number] | (typeof OPTIONAL_CHECKS)[number];

/** Public wording, shown on /verify. */
export const CHECK_LABELS: Record<CheckKey, string> = {
  products_match: 'Every product in the parcel was checked against this order',
  branded_packaging: 'Products were handled and dispatched in original branded packaging',
  catalogue_match: 'Product identity matched to the Skin Grocer catalogue',
  packaging_inspected: 'Packaging visually inspected before dispatch',
  approved_sourcing_channel: 'Sourced through a Skin Grocer approved supply channel',
};

/** Operations wording, shown to staff. */
export const CHECK_LABELS_OPS: Record<CheckKey, string> = {
  products_match: 'Products in the parcel match the order',
  branded_packaging: 'Original branded packaging checked',
  catalogue_match: 'Product identity matched to the Skin Grocer catalogue',
  packaging_inspected: 'Packaging visually inspected (seals, damage)',
  approved_sourcing_channel: 'Approved sourcing channel confirmed (optional)',
};
