/**
 * Brand band — the thin edge-of-page motif that sits above the header.
 *
 * Replaces the gold/black diagonal Grocer Stripe with quieter marks that fit
 * the navy + cream + rose-gold identity. Three variants so the look can be
 * compared and switched from one place.
 */

export type BrandBandVariant = "rule" | "gradient" | "ticks";

export function BrandBand({
  variant = "rule",
  className = "",
}: {
  variant?: BrandBandVariant;
  className?: string;
}) {
  if (variant === "gradient") {
    return (
      <div aria-hidden="true" className={`w-full ${className}`}>
        <div
          className="h-[3px] w-full"
          style={{
            background:
              "linear-gradient(90deg, var(--hanbok-deep) 0%, var(--hanbok) 38%, var(--rose-gold) 62%, var(--hanbok-deep) 100%)",
          }}
        />
      </div>
    );
  }

  if (variant === "ticks") {
    return (
      <div aria-hidden="true" className={`w-full bg-hanbok-deep ${className}`}>
        <div
          className="h-[6px] w-full opacity-60"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, var(--rose-gold) 0px, var(--rose-gold) 1px, transparent 1px, transparent 14px)",
          }}
        />
      </div>
    );
  }

  // "rule" — a fine navy rule finished with a single rose-gold hairline.
  return (
    <div aria-hidden="true" className={`w-full ${className}`}>
      <div className="h-[3px] w-full bg-hanbok-deep" />
      <div className="h-px w-full bg-rose-gold/70" />
    </div>
  );
}
