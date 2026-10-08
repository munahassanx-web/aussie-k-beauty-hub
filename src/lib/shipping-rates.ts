/**
 * Canonical shipping rate constants — the single source of truth for both the
 * client cart and the server-side commerce calculations. Do not redeclare these
 * values anywhere else.
 */

/** Flat standard shipping charge for orders below the free-delivery threshold. */
export const FLAT_SHIPPING_CENTS = 995;

/** Free standard delivery applies at this subtotal and above (A$100). */
export const FREE_SHIPPING_THRESHOLD_CENTS = 10000;

/** Display string for the threshold, e.g. "A$100". */
export const FREE_SHIPPING_THRESHOLD_LABEL = 'A$100';

/** A free K-beauty sample is packed with one-off orders at this subtotal (A$80). */
export const FREE_GIFT_THRESHOLD_CENTS = 8000;

/** Display string for the gift threshold, e.g. "A$80". */
export const FREE_GIFT_THRESHOLD_LABEL = 'A$80';

/** Whether a one-off order of this product subtotal earns the free sample. */
export function qualifiesForFreeGift(subtotalCents: number): boolean {
  return subtotalCents >= FREE_GIFT_THRESHOLD_CENTS;
}
