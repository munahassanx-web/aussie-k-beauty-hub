import { Link, useNavigate } from "@tanstack/react-router";
import { trackUi } from "@/lib/analytics";
import { QUIZ_QUESTION_COUNT, SKIN_FEEL, SKIN_FEEL_PROMPT, startQuizWith } from "@/lib/skin-quiz";

const PROMISES = [
  `${QUIZ_QUESTION_COUNT} one-tap questions`,
  "Morning and evening routine",
  "The reason for every step",
  "Save it by email",
];

/**
 * The homepage skin quiz: a bold band that lets people answer question 1
 * right here, then carries on in the full quiz from question 2.
 */
export function SkinQuizBanner() {
  const navigate = useNavigate();

  const answer = (value: (typeof SKIN_FEEL)[number]["value"]) => {
    trackUi("homepage_quiz_answer", { skin_feel: value });
    startQuizWith(value);
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
            Tell us how your skin behaves and get a Korean skincare routine built from what we
            stock, in the order you use it.
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
          <div className="flex items-center justify-between gap-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/55">
              Question 1 of {QUIZ_QUESTION_COUNT}
            </p>
            <div aria-hidden className="h-1 w-24 overflow-hidden rounded-full bg-ink/10">
              <div
                className="h-full rounded-full bg-ink"
                style={{ width: `${100 / QUIZ_QUESTION_COUNT}%` }}
              />
            </div>
          </div>
          <p className="mt-4 text-xl font-light leading-snug md:text-2xl">{SKIN_FEEL_PROMPT}</p>
          <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
            {SKIN_FEEL.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => answer(o.value)}
                className={`group rounded-2xl border border-ink/15 px-4 py-3.5 text-left transition-colors hover:border-ink hover:bg-ink hover:text-paper focus-visible:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 ${
                  o.value === "unsure" ? "sm:col-span-2" : ""
                }`}
              >
                <span className="block text-[15px] font-medium">{o.title}</span>
                {o.value !== "unsure" && (
                  <span className="mt-0.5 block text-xs text-ink/55 group-hover:text-paper/70">
                    {o.hint}
                  </span>
                )}
              </button>
            ))}
          </div>
          <p className="mt-5 text-center text-xs text-ink/55">
            Tap an answer to keep going, or{" "}
            <Link
              to="/consultation"
              search={{}}
              onClick={() => trackUi("homepage_quiz_open", {})}
              className="underline underline-offset-4 hover:text-ink"
            >
              open the full quiz
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
