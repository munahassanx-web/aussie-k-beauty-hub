import { Link, useNavigate } from "@tanstack/react-router";
import { trackUi } from "@/lib/analytics";
import { QUIZ_QUESTION_COUNT, startQuizWith, type FaceZones } from "@/lib/skin-quiz";
import type { SkinFeel } from "@/lib/routine-matching";
import { FaceMap } from "@/components/face-map";

const PROMISES = [
  "Map your skin, zone by zone",
  "Morning and evening routine",
  "The reason for every step",
  "No acids stacked on what you already use",
];

/**
 * The homepage skin quiz: a bold band that lets people answer question 1
 * right here, then carries on in the full quiz from question 2.
 */
export function SkinQuizBanner() {
  const navigate = useNavigate();

  const finish = (skinFeel: SkinFeel, zones: FaceZones) => {
    trackUi("homepage_quiz_answer", { skin_feel: skinFeel });
    startQuizWith(skinFeel, zones);
    void navigate({ to: "/consultation", search: {} });
  };

  return (
    <section
      id="skin-quiz"
      aria-labelledby="skin-quiz-title"
      className="scroll-mt-20 bg-ink text-paper"
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-[1fr_1.1fr] md:items-center md:py-20">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-paper/60">
            The skin quiz · about 2 minutes
          </p>
          <h2 id="skin-quiz-title" className="mt-4 display-section text-paper">
            not sure where to start?{" "}
            <span className="italic text-paper/70">let your skin decide.</span>
          </h2>
          <p className="mt-5 max-w-md text-paper/70">
            Tap where your skin gets shiny and where it feels tight, the way a skin therapist reads
            it. A few quick questions later, you get a Korean skincare routine from what we stock,
            in the order you use it.
          </p>
          <ul className="mt-7 grid max-w-md grid-cols-2 gap-x-6 gap-y-3 text-sm text-paper/85">
            {PROMISES.map((p) => (
              <li key={p} className="flex items-start gap-2">
                <span
                  aria-hidden
                  className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full bg-paper/60"
                />
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[1.75rem] bg-paper p-6 text-ink shadow-[0_30px_60px_-30px_rgba(0,0,0,0.5)] md:p-8">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/55">
            Question 1 of {QUIZ_QUESTION_COUNT} · map your skin
          </p>
          <FaceMap compact onComplete={finish} />
          <p className="mt-5 text-xs text-ink/55">
            Prefer words?{" "}
            <Link
              to="/consultation"
              search={{}}
              onClick={() => trackUi("homepage_quiz_open", {})}
              className="underline underline-offset-4 hover:text-ink"
            >
              Open the full quiz
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
