import {
  LOCKUP_VIEWBOX,
  SEAL,
  SEAL_GLYPHS,
  SEAL_VIEWBOX,
  WORDMARK,
  WORDMARK_TRANSFORM,
} from "@/components/brand-seal-art";

/** The seal on its own: a warm pearl dojang stamped with ㅅㄱ (스킨 그로서). */
function SealMark() {
  const { x, y, size, radius, frameInset, frameRadius, frameStroke } = SEAL;
  return (
    <>
      <rect x={x} y={y} width={size} height={size} rx={radius} style={{ fill: "var(--seal)" }} />
      <rect
        x={x + frameInset}
        y={y + frameInset}
        width={size - 2 * frameInset}
        height={size - 2 * frameInset}
        rx={frameRadius}
        fill="none"
        strokeWidth={frameStroke}
        style={{ stroke: "var(--seal-ink)" }}
      />
      <path d={SEAL_GLYPHS} style={{ fill: "var(--seal-ink)" }} />
    </>
  );
}

/**
 * Primary brand identity: the seal logo. A warm pearl Korean seal (ㅅㄱ) beside
 * SKIN GROCER in widely spaced Marcellus capitals. The wordmark takes the current
 * text colour; the seal takes the --seal and --seal-ink tokens.
 */
export function BrandWordmark({
  size = "md",
  className = "",
  as: Tag = "span",
}: {
  size?: "sm" | "md" | "lg" | "xl" | "display";
  className?: string;
  as?: "span" | "p" | "div";
  /** Kept for existing call sites; the seal lockup has no tagline line. */
  sub?: boolean;
}) {
  const height =
    size === "display"
      ? "h-[34px] sm:h-[44px] md:h-[56px]"
      : size === "xl"
        ? "h-[40px] md:h-[50px]"
        : size === "lg"
          ? "h-[32px] md:h-[38px]"
          : size === "sm"
            ? "h-[26px]"
            : "h-[28px] md:h-[34px]";

  return (
    <Tag className={`inline-block align-middle ${className}`}>
      <svg
        viewBox={LOCKUP_VIEWBOX}
        className={`block w-auto ${height}`}
        role="img"
        aria-label="Skin Grocer"
      >
        <SealMark />
        <path d={WORDMARK} transform={WORDMARK_TRANSFORM} fill="currentColor" />
      </svg>
    </Tag>
  );
}

/** The seal alone, for tight spots such as app icons and avatars. */
export function BrandSeal({ className = "" }: { className?: string }) {
  return (
    <svg viewBox={SEAL_VIEWBOX} className={className} role="img" aria-label="Skin Grocer">
      <SealMark />
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
