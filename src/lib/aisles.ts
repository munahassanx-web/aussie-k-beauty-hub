/**
 * The five skin-goal "aisles": one colour and number per goal, shared by the
 * glow-word band, product cards and packaging. Colours live in styles.css
 * as --aisle-* tokens.
 */
export type Aisle = {
  number: string;
  name: string;
  ko: string;
  /** Tailwind background class for the aisle colour. */
  bg: string;
};

export const AISLES = {
  glass: { number: "01", name: "glass skin", ko: "물광", bg: "bg-aisle-glass" },
  hydration: { number: "02", name: "hydration", ko: "수분", bg: "bg-aisle-hydration" },
  barrier: { number: "03", name: "barrier", ko: "장벽", bg: "bg-aisle-barrier" },
  cica: { number: "04", name: "cica calm", ko: "병풀", bg: "bg-aisle-cica" },
  honey: { number: "05", name: "honey glow", ko: "꿀광", bg: "bg-aisle-honey" },
} satisfies Record<string, Aisle>;

const BY_CONCERN: Record<string, Aisle> = {
  hydration: AISLES.hydration,
  barrier: AISLES.barrier,
  sensitivity: AISLES.barrier,
  acne: AISLES.cica,
  pigmentation: AISLES.honey,
  "anti-aging": AISLES.glass,
};

/** The aisle for a product, taken from its first catalogued concern. */
export function aisleFor(concerns: readonly string[] | undefined): Aisle | null {
  for (const c of concerns ?? []) {
    const aisle = BY_CONCERN[c];
    if (aisle) return aisle;
  }
  return null;
}
