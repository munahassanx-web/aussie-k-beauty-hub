import type { Target, Transition } from "motion/react";

/**
 * Entrance "personalities" for the hero product stage.
 *
 * Each style bundles the product enter/exit choreography with the matching
 * stage recoil, flash, shockwave and debris settings so the whole act change
 * reads as one gesture. Styles are purely presentational — switching one never
 * changes which SKU or copy an act shows.
 */
export type HeroMotionStyle = {
  id: string;
  label: string;
  blurb: string;
  /** Product cutout keyframes for the act swap. */
  product: {
    initial: Target;
    animate: Target;
    exit: Target;
    transition: Transition;
  };
  /** Stage recoil applied to the whole 3D stage on every act change. */
  impact: Target & { transition: Transition };
  flash: { enabled: boolean; from: number; to: number; duration: number } | null;
  waves: { count: number; scale: number; duration: number; stagger: number } | null;
  shards: { count: number; dist: number; duration: number; gravity: number } | null;
  /**
   * When set, the product image itself is sliced into clip-path fragments that
   * fly apart on exit and slam back together on entry.
   */
  fragment: { cols: number; rows: number; dist: number; spin: number; stagger: number } | null;
};

const OVERSHOOT: Transition = {
  type: "spring",
  stiffness: 520,
  damping: 13,
  mass: 0.9,
  opacity: { duration: 0.16 },
  filter: { duration: 0.28 },
};

export const HERO_MOTION_STYLES: HeroMotionStyle[] = [
  {
    id: "shatter",
    label: "Shatter",
    blurb: "The product itself breaks apart into shards and reassembles with a bang.",
    product: {
      initial: { opacity: 1, scale: 1.02, rotate: 0 },
      animate: { opacity: 1, scale: 1, rotate: 0 },
      exit: { opacity: 1, scale: 1.04, rotate: 0 },
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
    impact: {
      x: [0, -26, 18, -9, 0],
      y: [0, 14, -8, 3, 0],
      rotate: [0, -1.8, 1.2, 0],
      scale: [1, 1.06, 0.985, 1],
      transition: { duration: 0.75, ease: "easeOut" },
    },
    flash: { enabled: true, from: 1, to: 2.3, duration: 0.6 },
    waves: { count: 3, scale: 4.8, duration: 1, stagger: 0.08 },
    shards: { count: 16, dist: 240, duration: 1, gravity: 90 },
    fragment: { cols: 4, rows: 5, dist: 300, spin: 90, stagger: 0.012 },
  },
  {
    id: "smash",
    label: "Smash",
    blurb: "Explodes straight at your face and slams down with shockwaves and debris.",
    product: {
      initial: { opacity: 0, scale: 5.2, filter: "blur(38px)", rotate: 26, y: -200 },
      animate: { opacity: 1, scale: 1, filter: "blur(0px)", rotate: 0, y: 0 },
      exit: { opacity: 0, scale: 2.1, filter: "blur(24px)", rotate: 14, y: -90 },
      transition: { ...OVERSHOOT, stiffness: 320, damping: 17, mass: 1.15 },
    },
    impact: {
      x: [0, -34, 24, -14, 7, 0],
      y: [0, 22, -14, 8, -3, 0],
      rotate: [0, -2.4, 1.7, -0.8, 0],
      scale: [1, 1.09, 0.975, 1],
      transition: { duration: 0.7, ease: "easeOut", times: [0, 0.12, 0.3, 0.52, 0.78, 1] },
    },
    flash: { enabled: true, from: 1, to: 2.1, duration: 0.55 },
    waves: { count: 3, scale: 4.6, duration: 0.95, stagger: 0.1 },
    shards: { count: 22, dist: 220, duration: 1.05, gravity: 60 },
    fragment: null,
  },
  {
    id: "drop",
    label: "Drop",
    blurb: "Free-falls from above, bounces twice and kicks up dust.",
    product: {
      initial: { opacity: 0, scale: 1.15, y: -420, rotate: -8, filter: "blur(8px)" },
      animate: { opacity: 1, scale: 1, y: 0, rotate: 0, filter: "blur(0px)" },
      exit: { opacity: 0, y: 200, scale: 0.9, rotate: 6, filter: "blur(10px)" },
      transition: {
        type: "spring",
        stiffness: 900,
        damping: 16,
        mass: 1.4,
        opacity: { duration: 0.12 },
        filter: { duration: 0.2 },
      },
    },
    impact: {
      x: [0, 0, 0],
      y: [0, 26, -8, 3, 0],
      rotate: [0, 0.4, -0.2, 0],
      scale: [1, 0.96, 1.02, 1],
      transition: { duration: 0.7, ease: "easeOut" },
    },
    flash: { enabled: true, from: 0.5, to: 1.7, duration: 0.6 },
    waves: { count: 1, scale: 4.2, duration: 1, stagger: 0 },
    shards: { count: 20, dist: 160, duration: 1.1, gravity: 120 },
    fragment: null,
  },
  {
    id: "warp",
    label: "Warp",
    blurb: "Punches out of deep space with a spin and a light bloom.",
    product: {
      initial: { opacity: 0, scale: 0.06, rotate: -220, filter: "blur(20px)" },
      animate: { opacity: 1, scale: 1, rotate: 0, filter: "blur(0px)" },
      exit: { opacity: 0, scale: 0.2, rotate: 140, filter: "blur(22px)" },
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 15,
        mass: 0.7,
        opacity: { duration: 0.2 },
        filter: { duration: 0.35 },
      },
    },
    impact: {
      x: [0, 0, 0],
      y: [0, 0, 0],
      rotate: [0, 0, 0],
      scale: [1, 1.08, 0.98, 1],
      transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
    },
    flash: { enabled: true, from: 0.8, to: 2.2, duration: 0.75 },
    waves: { count: 3, scale: 4.6, duration: 1.15, stagger: 0.09 },
    shards: null,
    fragment: null,
  },
  {
    id: "swing",
    label: "Swing",
    blurb: "Whips in from the side and settles like a pendulum.",
    product: {
      initial: { opacity: 0, x: 520, rotate: 34, scale: 1.1, filter: "blur(14px)" },
      animate: { opacity: 1, x: 0, rotate: 0, scale: 1, filter: "blur(0px)" },
      exit: { opacity: 0, x: -380, rotate: -26, scale: 0.95, filter: "blur(14px)" },
      transition: {
        type: "spring",
        stiffness: 340,
        damping: 12,
        mass: 0.8,
        opacity: { duration: 0.18 },
        filter: { duration: 0.3 },
      },
    },
    impact: {
      x: [0, 18, -12, 6, 0],
      y: [0, -4, 2, 0],
      rotate: [0, 1.4, -0.8, 0.3, 0],
      scale: [1, 1.02, 1],
      transition: { duration: 0.68, ease: "easeOut" },
    },
    flash: null,
    waves: { count: 1, scale: 3, duration: 0.9, stagger: 0 },
    shards: { count: 8, dist: 190, duration: 1, gravity: 20 },
    fragment: null,
  },
  {
    id: "bloom",
    label: "Bloom",
    blurb: "Unfurls softly with a slow halo — quiet, luxury pacing.",
    product: {
      initial: { opacity: 0, scale: 0.82, y: 40, filter: "blur(16px)" },
      animate: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" },
      exit: { opacity: 0, scale: 1.06, y: -24, filter: "blur(16px)" },
      transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
    },
    impact: {
      x: [0, 0, 0],
      y: [0, -6, 0],
      rotate: [0, 0, 0],
      scale: [1, 1.015, 1],
      transition: { duration: 1, ease: "easeOut" },
    },
    flash: { enabled: true, from: 0.35, to: 1.9, duration: 1.1 },
    waves: { count: 2, scale: 3.8, duration: 1.6, stagger: 0.35 },
    shards: null,
    fragment: null,
  },
];

export const DEFAULT_HERO_MOTION_STYLE = HERO_MOTION_STYLES[0]!.id;
export const HERO_MOTION_STORAGE_KEY = "sg-hero-motion-style";

export function shardsFor(style: HeroMotionStyle) {
  const cfg = style.shards;
  if (!cfg) return [];
  return Array.from({ length: cfg.count }, (_, i) => ({
    angle: (i / cfg.count) * Math.PI * 2 + (i % 2 ? 0.22 : 0),
    dist: cfg.dist + (i % 5) * 42,
    size: 5 + (i % 4) * 4,
    duration: cfg.duration + (i % 4) * 0.1,
    gravity: cfg.gravity,
  }));
}

export type HeroFragment = {
  clip: string;
  dx: number;
  dy: number;
  rot: number;
  delay: number;
};

/** Slice the product image into triangular shards flying away from centre. */
export function fragmentsFor(style: HeroMotionStyle): HeroFragment[] {
  const cfg = style.fragment;
  if (!cfg) return [];
  const out: HeroFragment[] = [];
  const w = 100 / cfg.cols;
  const h = 100 / cfg.rows;
  let i = 0;
  for (let r = 0; r < cfg.rows; r++) {
    for (let c = 0; c < cfg.cols; c++) {
      const x0 = c * w;
      const y0 = r * h;
      const x1 = x0 + w;
      const y1 = y0 + h;
      const halves = [
        `polygon(${x0}% ${y0}%, ${x1}% ${y0}%, ${x0}% ${y1}%)`,
        `polygon(${x1}% ${y0}%, ${x1}% ${y1}%, ${x0}% ${y1}%)`,
      ];
      for (const clip of halves) {
        const cx = (x0 + x1) / 2 - 50;
        const cy = (y0 + y1) / 2 - 50;
        const len = Math.max(8, Math.hypot(cx, cy));
        const spread = cfg.dist * (0.45 + (len / 70) * 0.9);
        out.push({
          clip,
          dx: (cx / len) * spread + ((i % 3) - 1) * 14,
          dy: (cy / len) * spread + ((i % 4) - 1) * 12,
          rot: ((i % 2 ? 1 : -1) * cfg.spin * (0.4 + (i % 5) / 5)),
          delay: (i % 7) * cfg.stagger,
        });
        i++;
      }
    }
  }
  return out;
}
