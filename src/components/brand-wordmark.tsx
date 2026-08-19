/**
 * Primary brand identity: the SKIN GROCER wordmark, set in live text using a
 * high-contrast Didone editorial serif (Bodoni Moda) — thick vertical stems,
 * fine hairlines, sculpted serifs. Flat ink-black, never shadowed or embossed.
 */
export function BrandWordmark({
  size = "md",
  className = "",
  as: Tag = "span",
  sub = false,
}: {
  size?: "sm" | "md" | "lg" | "xl" | "display";
  className?: string;
  as?: "span" | "p" | "div";
  /** Render the small, widely tracked INNER BEAUTY line beneath the wordmark. */
  sub?: boolean;
}) {
  const scale =
    size === "display"
      ? "text-[2.1rem] sm:text-[3.4rem] md:text-[4.3rem] lg:text-[4.9rem] tracking-[0.07em]"
      : size === "xl"
        ? "text-[1.9rem] md:text-[2.5rem] tracking-[0.09em]"
        : size === "lg"
          ? "text-[1.45rem] md:text-[1.75rem] tracking-[0.09em]"
          : size === "sm"
            ? "text-[1rem] tracking-[0.1em]"
            : "text-[1.05rem] tracking-[0.09em] md:text-[1.35rem]";

  const subScale =
    size === "display"
      ? "text-[9px] md:text-[12px]"
      : size === "xl"
        ? "text-[10px]"
        : size === "sm"
          ? "text-[7px]"
          : "text-[8px] md:text-[9px]";

  const mark = (
    <span
      className={`block font-masthead uppercase leading-[0.9] whitespace-nowrap ${scale}`}
      style={{
        fontWeight: 900,
        fontOpticalSizing: "auto",
        fontVariationSettings: '"opsz" 96',
        textShadow: "none",
      }}
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
      <span
        className={`flex items-center justify-center ${size === "display" ? "mt-3 gap-5 md:mt-4 md:gap-7" : "mt-1.5 gap-2"}`}
        aria-hidden="true"
      >
        <span
          className={`h-px flex-none ${size === "display" ? "w-9 md:w-16" : "w-4"}`}
          style={{ background: "var(--stripe-gold)" }}
        />
        <span
          className={`font-body font-medium uppercase leading-none ${subScale}`}
          style={{ letterSpacing: "0.4em", textIndent: "0.4em", color: "currentColor" }}
        >
          Inner Beauty
        </span>
        <span
          className={`h-px flex-none ${size === "display" ? "w-9 md:w-16" : "w-4"}`}
          style={{ background: "var(--stripe-gold)" }}
        />
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
