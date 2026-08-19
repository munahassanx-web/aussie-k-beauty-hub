/**
 * Primary brand identity: the SKIN GROCER wordmark, set in live text using the
 * project's display face (Fraunces) at a heavy, architectural weight with
 * high optical sizing — deliberately not a thin luxury serif.
 */
export function BrandWordmark({
  size = "md",
  className = "",
  as: Tag = "span",
  sub = false,
}: {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  as?: "span" | "p" | "div";
  /** Render the small, widely tracked INNER BEAUTY line beneath the wordmark. */
  sub?: boolean;
}) {
  const scale =
    size === "xl"
      ? "text-[1.9rem] md:text-[2.5rem] tracking-[0.13em]"
      : size === "lg"
        ? "text-[1.45rem] md:text-[1.75rem] tracking-[0.13em]"
        : size === "sm"
          ? "text-[1rem] tracking-[0.14em]"
          : "text-[1.05rem] tracking-[0.12em] md:text-[1.35rem] md:tracking-[0.14em]";

  const subScale =
    size === "xl" ? "text-[10px]" : size === "sm" ? "text-[7px]" : "text-[8px] md:text-[9px]";

  const mark = (
    <span
      className={`block font-display uppercase leading-none whitespace-nowrap ${scale}`}
      style={{ fontWeight: 900, fontOpticalSizing: "auto", fontVariationSettings: '"opsz" 144' }}
    >
      Skin Grocer
    </span>
  );

  if (!sub) {
    return (
      <Tag className={`inline-block ${className}`}>
        {mark}
      </Tag>
    );
  }

  return (
    <Tag className={`inline-block ${className}`}>
      {mark}
      <span className="mt-1.5 flex items-center justify-center gap-2" aria-hidden="true">
        <span className="h-px w-4 flex-none" style={{ background: "var(--stripe-gold)" }} />
        <span
          className={`font-body font-medium uppercase leading-none ${subScale}`}
          style={{ letterSpacing: "0.42em", textIndent: "0.42em", color: "var(--stripe-gold)" }}
        >
          Inner Beauty
        </span>
        <span className="h-px w-4 flex-none" style={{ background: "var(--stripe-gold)" }} />
      </span>
    </Tag>
  );
}

/** Supporting brand line — use selectively, never bolted onto every wordmark. */
export function BrandLine({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block text-[10px] font-medium uppercase tracking-[0.28em] ${className}`}
    >
      Seoul Sourced. Skin Assured.
    </span>
  );
}
