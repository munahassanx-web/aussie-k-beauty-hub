import {
  ICON_DOT,
  ICON_GLYPHS,
  ICON_VIEWBOX,
  WORDMARK,
  WORDMARK_DOT,
  WORDMARK_VIEWBOX,
} from "@/components/brand-logo-art";

/**
 * Primary brand identity: "skin grocer" in clean, tightly kerned lowercase. The
 * letters take the current text colour; the square dot on the i takes --logo-dot.
 */
export function BrandWordmark({
  size = "md",
  className = "",
  as: Tag = "span",
}: {
  size?: "sm" | "md" | "lg" | "xl" | "display";
  className?: string;
  as?: "span" | "p" | "div";
  /** Kept for existing call sites; the wordmark has no tagline line. */
  sub?: boolean;
}) {
  const height =
    size === "display"
      ? "h-[30px] sm:h-[38px] md:h-[46px]"
      : size === "xl"
        ? "h-[36px] md:h-[44px]"
        : size === "lg"
          ? "h-[28px] md:h-[34px]"
          : size === "sm"
            ? "h-[24px]"
            : "h-[26px] md:h-[30px]";
  const { x, y, size: dot, radius } = WORDMARK_DOT;

  return (
    <Tag className={`inline-block align-middle ${className}`}>
      <svg
        viewBox={WORDMARK_VIEWBOX}
        className={`block w-auto ${height}`}
        role="img"
        aria-label="Skin Grocer"
      >
        <path d={WORDMARK} fill="currentColor" />
        <rect
          x={x}
          y={y}
          width={dot}
          height={dot}
          rx={radius}
          style={{ fill: "var(--logo-dot)" }}
        />
      </svg>
    </Tag>
  );
}

/** The "sg" icon on its own, for tight spots such as app icons and avatars. */
export function BrandIcon({ className = "" }: { className?: string }) {
  const { x, y, size, radius } = ICON_DOT;
  return (
    <svg viewBox={ICON_VIEWBOX} className={className} role="img" aria-label="Skin Grocer">
      <rect width="100" height="100" rx="28" style={{ fill: "var(--logo-icon)" }} />
      <path d={ICON_GLYPHS} style={{ fill: "var(--logo-ink)" }} />
      <rect
        x={x}
        y={y}
        width={size}
        height={size}
        rx={radius}
        style={{ fill: "var(--logo-dot)" }}
      />
    </svg>
  );
}

/** Supporting brand line — use selectively, never bolted onto every wordmark. */
export function BrandLine({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block text-[10px] font-medium uppercase tracking-[0.28em] ${className}`}
    >
      Korean Skincare. Melbourne Curated.
    </span>
  );
}
