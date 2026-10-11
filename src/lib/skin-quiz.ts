import type { SkinFeel } from "@/lib/routine-matching";

/** Saved quiz progress lives here, so the homepage can start the quiz. */
export const QUIZ_STORAGE_KEY = "sg-consultation-v2";

export const QUIZ_QUESTION_COUNT = 7;

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

/**
 * Record the first answer from outside the quiz page. The quiz then opens on
 * question 2 with this answer kept.
 */
export function startQuizWith(skinFeel: SkinFeel): void {
  try {
    window.localStorage.setItem(
      QUIZ_STORAGE_KEY,
      JSON.stringify({ draft: { skinFeel }, done: false, heroStarted: true }),
    );
  } catch {
    /* storage unavailable: the quiz simply starts from question 1 */
  }
}
