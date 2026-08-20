/**
 * The Grocer Stripe — Skin Grocer's reusable brand band.
 *
 * Single source of truth for the diagonal black / champagne-gold / white
 * motif. Visuals live in the `grocer-stripe` utility in src/styles.css —
 * this component only wraps it so every section reuses the exact same
 * identity instead of re-approximating it.
 */
export function GrocerStripe({
  className = "h-[10px] w-full md:h-[18px]",
}: {
  className?: string;
}) {
  return <div aria-hidden="true" className={`grocer-stripe ${className}`} />;
}
