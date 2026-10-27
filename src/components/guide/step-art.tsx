import type { ReactNode } from "react";
import type { StepArt } from "@/lib/guide-steps";

// Line illustrations for the "How to use" steps. One drawing style throughout:
// 96px grid, rounded 2.4px strokes in --art-ink, soft shapes in --art-fill.
// The parent sets both colours, so each guide picks up its product's aisle.

const INK = "var(--art-ink, currentColor)";
const FILL = "var(--art-fill, #f4e3dc)";

function Face({ eyes = true }: { eyes?: boolean }) {
  return (
    <g>
      <path
        d="M27 47c0-17 9.5-27 21-27s21 10 21 27c0 18-9.5 31-21 31S27 65 27 47Z"
        fill="#fff"
        stroke={INK}
      />
      <path d="M41 77.5V88M55 77.5V88" stroke={INK} />
      <path
        d="M30 34c5-9 11-13 18-13s13 4 18 13c-6-3-12-4-18-4s-12 1-18 4Z"
        fill={FILL}
        stroke={INK}
      />
      {eyes && (
        <>
          <path d="M36.5 48.5c2.5 2 5.5 2 8 0M51.5 48.5c2.5 2 5.5 2 8 0" stroke={INK} />
          <path d="M44.5 64c2.2 1.8 4.8 1.8 7 0" stroke={INK} />
        </>
      )}
    </g>
  );
}

function Drop({
  x,
  y,
  s = 1,
  filled = true,
}: {
  x: number;
  y: number;
  s?: number;
  filled?: boolean;
}) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M0-8C3.5-3.5 6-.5 6 3a6 6 0 0 1-12 0c0-3.5 2.5-6.5 6-11Z"
      fill={filled ? FILL : "#fff"}
      stroke={INK}
    />
  );
}

function Sparkle({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M0-7C.8-2 2-.8 7 0 2 .8.8 2 0 7-.8 2-2 .8-7 0-2-.8-.8-2 0-7Z"
      fill={FILL}
      stroke={INK}
    />
  );
}

function Pad({ x, y, r = 11 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="#fff" stroke={INK} />
      <circle cx={x} cy={y} r={r - 4} fill={FILL} stroke={INK} strokeDasharray="1.5 4" />
    </g>
  );
}

const ART: Record<StepArt, ReactNode> = {
  dispense: (
    <g>
      <circle cx="48" cy="52" r="34" fill={FILL} stroke="none" opacity=".55" />
      <path d="M38 24h18v-5H44" stroke={INK} />
      <rect x="42" y="24" width="12" height="9" rx="2" fill="#fff" stroke={INK} />
      <rect x="34" y="33" width="28" height="40" rx="8" fill="#fff" stroke={INK} />
      <path d="M40 46h16M40 52h10" stroke={INK} />
      <Drop x={70} y={44} s={0.9} />
      <path d="M24 82c14 7 34 7 50-2" stroke={INK} />
    </g>
  ),
  lather: (
    <g>
      <path d="M14 66c10 16 58 16 68 0" fill={FILL} stroke={INK} />
      <circle cx="36" cy="54" r="10" fill="#fff" stroke={INK} />
      <circle cx="53" cy="48" r="12" fill="#fff" stroke={INK} />
      <circle cx="66" cy="58" r="7" fill="#fff" stroke={INK} />
      <circle cx="44" cy="33" r="5" fill="#fff" stroke={INK} />
      <circle cx="61" cy="30" r="3.5" fill="#fff" stroke={INK} />
      <path d="M49 44a5 5 0 0 1 6-1" stroke={INK} />
    </g>
  ),
  massage: (
    <g>
      <Face />
      <path d="M33 60a6 6 0 1 1 6 6" stroke={INK} />
      <path d="M36 67l3-1-1-3" stroke={INK} />
      <path d="M63 60a6 6 0 1 0-6 6" stroke={INK} />
      <path d="M60 67l-3-1 1-3" stroke={INK} />
    </g>
  ),
  rinse: (
    <g>
      <Face />
      <Drop x={20} y={30} s={0.8} />
      <Drop x={78} y={26} s={0.8} />
      <Drop x={16} y={56} s={0.6} />
      <Drop x={82} y={52} s={0.6} />
      <path d="M12 86c8-4 14-4 22 0s14 4 22 0 14-4 22 0" stroke={INK} />
    </g>
  ),
  pad: (
    <g>
      <Pad x={48} y={58} r={24} />
      <Drop x={48} y={20} s={1.1} />
      <path d="M48 30v4" stroke={INK} strokeDasharray="1.5 3" />
    </g>
  ),
  sweep: (
    <g>
      <Face />
      <Pad x={64} y={60} r={9} />
      <path d="M58 72c6 6 14 5 20-2" stroke={INK} />
      <path d="M78 64l1 6-6 1" stroke={INK} />
    </g>
  ),
  pat: (
    <g>
      <Face />
      <path d="M22 56c2-3 2-6 0-9M17 59c4-5 4-11 0-15" stroke={INK} />
      <path d="M74 56c-2-3-2-6 0-9M79 59c-4-5-4-11 0-15" stroke={INK} />
      <circle cx="35" cy="58" r="2.2" fill={INK} stroke="none" />
      <circle cx="61" cy="58" r="2.2" fill={INK} stroke="none" />
    </g>
  ),
  spread: (
    <g>
      <Face />
      <path d="M31 62c3-4 7-5 11-3M65 62c-3-4-7-5-11-3" stroke={INK} />
      <path d="M38 40c3-2 7-3 10-3s7 1 10 3" stroke={INK} />
      <Sparkle x={78} y={30} s={0.8} />
    </g>
  ),
  absorb: (
    <g>
      <Face />
      <Sparkle x={20} y={34} s={0.9} />
      <Sparkle x={77} y={44} s={1.1} />
      <Sparkle x={70} y={20} s={0.6} />
    </g>
  ),
  sun: (
    <g>
      <Face />
      <circle cx="76" cy="20" r="8" fill={FILL} stroke={INK} />
      <path
        d="M76 6v3M76 31v3M62 20h3M87 20h3M66 10l2 2M84 28l2 2M66 30l2-2M84 12l2-2"
        stroke={INK}
      />
    </g>
  ),
  amount: (
    <g>
      <circle cx="48" cy="50" r="34" fill={FILL} stroke="none" opacity=".55" />
      <rect x="30" y="20" width="16" height="58" rx="8" fill="#fff" stroke={INK} />
      <rect x="50" y="16" width="16" height="62" rx="8" fill="#fff" stroke={INK} />
      <path d="M33 26v48M53 22v52" stroke={FILL} strokeWidth="5" />
      <path d="M33 26v48M53 22v52" stroke={INK} strokeDasharray="0.1 6" />
    </g>
  ),
  reapply: (
    <g>
      <circle cx="48" cy="48" r="13" fill={FILL} stroke={INK} />
      <path d="M48 26v5M48 65v5M26 48h5M65 48h5" stroke={INK} />
      <path d="M20 30a34 34 0 0 1 54-8" stroke={INK} />
      <path d="M74 14v8h-8" stroke={INK} />
      <path d="M76 66a34 34 0 0 1-54 8" stroke={INK} />
      <path d="M22 82v-8h8" stroke={INK} />
    </g>
  ),
  mask: (
    <g>
      <Face eyes={false} />
      <path
        d="M31 44c2-9 9-14 17-14s15 5 17 14c1 9-1 18-5 24-3 4-7 6-12 6s-9-2-12-6c-4-6-6-15-5-24Z"
        fill={FILL}
        stroke={INK}
      />
      <ellipse cx="40.5" cy="48" rx="4" ry="2.6" fill="#fff" stroke={INK} />
      <ellipse cx="55.5" cy="48" rx="4" ry="2.6" fill="#fff" stroke={INK} />
      <path d="M44.5 63c2.2 1.6 4.8 1.6 7 0" stroke={INK} />
    </g>
  ),
  timer: (
    <g>
      <circle cx="48" cy="54" r="27" fill={FILL} stroke={INK} />
      <circle cx="48" cy="54" r="20" fill="#fff" stroke={INK} />
      <path d="M48 54V40M48 54l8 5" stroke={INK} />
      <path d="M42 20h12M48 20v7M70 30l4-4" stroke={INK} />
    </g>
  ),
  remove: (
    <g>
      <Face eyes={false} />
      <path
        d="M31 44c2-9 9-14 17-14 6 0 11 3 14 8L34 70c-3-7-4-17-3-26Z"
        fill={FILL}
        stroke={INK}
      />
      <path d="M62 38c4 8 4 22-2 30" stroke={INK} strokeDasharray="2 4" />
      <path d="M66 22l12-8M78 14v7M78 14h-7" stroke={INK} />
    </g>
  ),
  layer: (
    <g>
      <rect x="22" y="58" width="52" height="16" rx="8" fill="#fff" stroke={INK} />
      <rect x="26" y="40" width="44" height="16" rx="8" fill={FILL} stroke={INK} />
      <rect x="30" y="22" width="36" height="16" rx="8" fill="#fff" stroke={INK} />
      <path d="M80 30v24M74 48l6 6 6-6" stroke={INK} />
    </g>
  ),
};

export function StepIllustration({ art, className }: { art: StepArt; className?: string }) {
  return (
    <svg
      viewBox="0 0 96 96"
      className={className}
      fill="none"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ART[art]}
    </svg>
  );
}
