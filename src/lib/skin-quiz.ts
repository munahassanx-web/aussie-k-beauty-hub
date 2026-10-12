import type { SkinFeel } from "@/lib/routine-matching";

/** Saved quiz progress lives here, so the homepage can start the quiz. */
export const QUIZ_STORAGE_KEY = "sg-consultation-v2";

export const QUIZ_QUESTION_COUNT = 8;

export const SKIN_FEEL_PROMPT = "How does your skin usually feel?";

export const SKIN_FEEL: { value: SkinFeel; title: string; hint?: string }[] = [
  {
    value: "dry",
    title: "Tight or dry",
    hint: "Feels tight after cleansing and may sometimes look or feel flaky.",
  },
  { value: "oily", title: "Shiny by midday", hint: "Shine returns not long after cleansing." },
  {
    value: "combination",
    title: "A bit of both",
    hint: "Oilier around the nose and forehead, but drier or more comfortable elsewhere.",
  },
  {
    value: "balanced",
    title: "Mostly comfortable",
    hint: "Usually feels balanced, without persistent tightness or excess shine.",
  },
  {
    value: "unsure",
    title: "Not sure",
    hint: "That’s okay—the next questions will help narrow down your suggestions.",
  },
];

// --- face map ---------------------------------------------------------------

export type FaceZone = "forehead" | "nose" | "left-cheek" | "right-cheek" | "chin";

export type FaceZones = { shine: FaceZone[]; tight: FaceZone[] };

export const FACE_ZONES: { id: FaceZone; label: string; t: boolean }[] = [
  { id: "forehead", label: "Forehead", t: true },
  { id: "nose", label: "Nose", t: true },
  { id: "left-cheek", label: "Left cheek", t: false },
  { id: "right-cheek", label: "Right cheek", t: false },
  { id: "chin", label: "Chin", t: true },
];

const T_ZONE = new Set<FaceZone>(["forehead", "nose", "chin"]);

/**
 * Turn where someone sees shine by midday and where they feel tight into the
 * skin-type answer, the way a skin therapist reads oil and dryness by zone.
 */
export function skinFeelFromZones({ shine, tight }: FaceZones): SkinFeel {
  if (shine.length === 0 && tight.length === 0) return "balanced";
  if (shine.length === 0) return "dry";
  const shinyCheeks = shine.some((z) => !T_ZONE.has(z));
  if (tight.length === 0) return shinyCheeks ? "oily" : "combination";
  return "combination";
}

/** Plain-English summary of the zones for the results page. */
export function zoneSummary({ shine, tight }: FaceZones): string {
  const names = (zs: FaceZone[]) => {
    const t = zs.filter((z) => T_ZONE.has(z)).length === 3;
    const cheeks = zs.includes("left-cheek") && zs.includes("right-cheek");
    const parts: string[] = [];
    if (t) parts.push("T-zone");
    else zs.filter((z) => T_ZONE.has(z)).forEach((z) => parts.push(z));
    if (cheeks) parts.push("cheeks");
    else zs.filter((z) => !T_ZONE.has(z)).forEach((z) => parts.push(z.replace("-", " ")));
    return parts.join(", ");
  };
  const bits: string[] = [];
  if (shine.length) bits.push(`shine on your ${names(shine)}`);
  if (tight.length) bits.push(`tightness on your ${names(tight)}`);
  return bits.length
    ? `You mapped ${bits.join(" and ")}.`
    : "You mapped no shine and no tightness.";
}

/**
 * Record the first answer from outside the quiz page. The quiz then opens on
 * question 2 with this answer kept.
 */
export function startQuizWith(skinFeel: SkinFeel, faceZones?: FaceZones): void {
  try {
    window.localStorage.setItem(
      QUIZ_STORAGE_KEY,
      JSON.stringify({
        draft: { skinFeel, faceZones: faceZones ?? null },
        done: false,
        heroStarted: true,
      }),
    );
  } catch {
    /* storage unavailable: the quiz simply starts from question 1 */
  }
}
