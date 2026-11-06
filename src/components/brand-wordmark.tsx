import {
  ICON_DOT,
  ICON_GLYPHS,
  ICON_VIEWBOX,
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
      ? "h-[40px] sm:h-[52px] md:h-[62px]"
      : size === "xl"
        ? "h-[42px] md:h-[52px]"
        : size === "lg"
          ? "h-[32px] md:h-[40px]"
          : size === "sm"
            ? "h-[30px]"
            : "h-[32px] md:h-[38px]";
  // Bilingual logo (serif name + vertical 스킨그로서). Drawn as a mask so it
  // takes the current text colour on light and dark surfaces.
  return (
    <Tag className={`inline-block align-middle ${className}`}>
      <span
        role="img"
        aria-label="Skin Grocer 스킨그로서"
        className={`block aspect-[1200/301] ${height}`}
        style={{
          backgroundColor: "currentColor",
          WebkitMaskImage: "url(/brand/skin-grocer-logo.png)",
          maskImage: "url(/brand/skin-grocer-logo.png)",
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
        }}
      />
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
