/**
 * Primary brand identity: the SKIN GROCER wordmark, set in live text using the
 * project's existing display face (Fraunces). No emblem, no raster logo.
 */
export function BrandWordmark({
  size = "md",
  className = "",
  as: Tag = "span",
}: {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  as?: "span" | "p" | "div";
}) {
  const scale =
    size === "xl"
      ? "text-[1.75rem] md:text-[2.25rem] tracking-[0.20em]"
      : size === "lg"
        ? "text-[1.35rem] md:text-[1.6rem] tracking-[0.20em]"
        : size === "sm"
          ? "text-[0.95rem] tracking-[0.22em]"
          : "text-[0.9rem] tracking-[0.18em] md:text-[1.2rem] md:tracking-[0.22em]";

  return (
    <Tag
      className={`font-display font-medium uppercase leading-none whitespace-nowrap ${scale} ${className}`}
    >
      Skin Grocer
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
