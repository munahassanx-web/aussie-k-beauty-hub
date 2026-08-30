import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { trackUi } from "@/lib/analytics";

/**
 * Homepage Routine Finder promo. Shows an illustrative preview of the real
 * consultation flow — it never mutates or completes the actual quiz state.
 */

const STEPS = [
  {
    num: "01",
    kicker: "YOUR SKIN TODAY",
    title: "WHAT DO YOU NOTICE MOST?",
    copy: "Start with how your skin usually feels and the concern you most want your routine to support.",
    note: "There are no perfect answers. “Not sure” is always available.",
  },
  {
    num: "02",
    kicker: "YOUR ROUTINE REALITY",
    title: "WHAT ARE YOU ALREADY USING?",
    copy: "We consider your existing routine so we can avoid unnecessary duplicates and overly complicated recommendations.",
    note: "More products do not automatically make a better routine.",
  },
  {
    num: "03",
    kicker: "YOUR ROUTINE EDIT",
    title: "WHAT EARNS A PLACE?",
    copy: "Receive a routine using products available from Skin Grocer, shown in usage order with the reasoning behind every recommended step.",
    note: "If a step does not have a clear role, we leave it out.",
  },
];

/** Mirrors the first consultation question, shortened for preview. */
const ANSWERS = [
  { title: "Tight or dry", hint: "Feels tight after cleansing" },
  { title: "Shiny by midday", hint: "Shine returns soon after washing" },
  { title: "A bit of both", hint: "Oily centre, drier cheeks" },
  { title: "Not sure", hint: "The rest of the answers will tell us" },
];

const ROUTINE = {
  morning: [
    { step: "Moisturise", why: "Keeps hydration in place before sun protection goes on." },
    { step: "Appropriate sun protection", why: "The daytime step with the clearest long-term role." },
  ],
  evening: [
    { step: "Cleanse", why: "Removes sunscreen and the day’s buildup without stripping." },
    { step: "Targeted step, only if relevant", why: "Included only when one concern is worth addressing." },
    { step: "Moisturise", why: "Leaves the barrier comfortable overnight." },
  ],
};

function QuizPreview({ advanced }: { advanced: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="rounded-2xl border border-foreground/15 bg-paper p-5 shadow-[0_24px_60px_-40px_rgba(20,24,40,0.55)] md:p-6"
    >
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink/55">
          Question {advanced ? 2 : 1} of 7
        </p>
        <p className="text-[10px] uppercase tracking-[0.2em] text-ink/40">Preview</p>
      </div>
      <div className="mt-3 h-[3px] w-full overflow-hidden rounded-full bg-foreground/10">
        <div
          className="h-full rounded-full bg-pop transition-[width] duration-700 ease-out motion-reduce:transition-none"
          style={{ width: advanced ? "28.5%" : "14.2%" }}
        />
      </div>

      <p className="mt-5 font-display text-xl leading-snug text-ink">
        How does your skin usually feel?
      </p>

      <ul className="mt-4 space-y-2">
        {ANSWERS.map((a, i) => {
          const selected = advanced && i === 0;
          return (
            <li
              key={a.title}
              className={`rounded-xl border px-4 py-3 transition-colors duration-500 motion-reduce:transition-none ${
                selected
                  ? "border-pop bg-pop/8"
                  : "border-foreground/15 bg-background/60"
              }`}
            >
              <p className="text-sm font-medium text-ink">{a.title}</p>
              <p className="mt-0.5 text-xs text-ink/55">{a.hint}</p>
            </li>
          );
        })}
      </ul>

      <div
        className={`mt-5 rounded-xl border border-dashed border-foreground/20 bg-sand/40 p-4 transition-all duration-700 motion-reduce:transition-none ${
          advanced ? "translate-y-0 opacity-100" : "translate-y-2 opacity-60"
        }`}
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/55">
          Where this leads
        </p>
        <p className="mt-2 text-sm text-ink/80">Cleanse → Treat if needed → Moisturise</p>
        <p className="mt-2 text-xs text-ink/60">
          <span className="font-semibold uppercase tracking-[0.14em] text-ink/70">Why this step: </span>
          each recommendation arrives with a plain-English reason.
        </p>
        <p className="mt-1 text-xs text-ink/60">
          <span className="font-semibold uppercase tracking-[0.14em] text-ink/70">Leave this out for now: </span>
          anything that would duplicate a step you already have.
        </p>
      </div>
    </div>
  );
}

function ResultPreview() {
  return (
    <div className="rounded-2xl border border-foreground/15 bg-background p-5 md:p-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-clay">
        Your routine, reasoned
      </p>
      <div className="mt-4 grid gap-5 sm:grid-cols-2">
        {(
          [
            ["Morning", ROUTINE.morning],
            ["Evening", ROUTINE.evening],
          ] as const
        ).map(([label, items]) => (
          <div key={label}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/55">{label}</p>
            <ol className="mt-3 space-y-3">
              {items.map((it, i) => (
                <li key={it.step} className="border-t border-foreground/12 pt-3">
                  <p className="text-sm text-ink">
                    <span className="font-display text-xs italic text-ink/50">{i + 1}. </span>
                    {it.step}
                  </p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-ink/45">Why it’s here</p>
                  <p className="text-xs leading-relaxed text-ink/65">{it.why}</p>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
      <div className="mt-5 border-t border-foreground/12 pt-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/55">Left out for now</p>
        <p className="mt-2 text-xs leading-relaxed text-ink/65">
          A second hydrating toner, an extra serum with the same role, or a mask added out of habit—
          steps that duplicate the routine or add complexity without a clear purpose.
        </p>
      </div>
      <p className="mt-4 text-[11px] text-ink/50">
        Illustrative format only—not your personalised result.
      </p>
    </div>
  );
}

export function RoutineFinderSection() {
  const [advanced, setAdvanced] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setAdvanced(true);
      return;
    }
    let timer: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          timer = setTimeout(() => setAdvanced(true), 900);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(node);
    return () => {
      io.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <section className="bg-paper" aria-labelledby="skin-quiz-heading">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">
            A SIMPLER PLACE TO START
          </p>
          <h2
            id="skin-quiz-heading"
            className="mt-4 font-display text-4xl leading-tight text-ink md:text-[3.25rem]"
          >
            Your skin doesn’t need more noise.{" "}
            <span className="italic text-hanbok-deep">It needs a clearer routine.</span>
          </h2>
          <p className="mt-5 max-w-2xl text-ink/70">
            Answer seven short questions about how your skin usually feels, what you are using now
            and how much routine fits your life. We’ll build a considered starting routine from
            products currently stocked in Melbourne—and explain the reason behind every step.
          </p>
          <ul className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/60">
            {["About 3 minutes", "Guidance, not diagnosis", "No unnecessary steps"].map((t, i) => (
              <li key={t} className="flex items-center gap-3">
                {i > 0 && <span aria-hidden="true" className="text-ink/25">·</span>}
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div ref={ref} className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-10 lg:items-start">
          <Link
            to="/consultation"
            onClick={() => trackUi("routine_finder_preview_click", {})}
            aria-label="Open the Routine Finder"
            className="block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pop"
          >
            <QuizPreview advanced={advanced} />
          </Link>
          <ResultPreview />
        </div>

        <div className="mt-10 flex flex-col items-start gap-3">
          <Link
            to="/consultation"
            onClick={() => trackUi("routine_finder_cta_click", { source: "homepage_section" })}
            className="group inline-flex min-h-[44px] items-center gap-3 rounded-full bg-pop px-8 py-4 text-[12px] font-bold uppercase tracking-[0.2em] text-pop-foreground shadow-[0_16px_38px_-12px] shadow-pop/60 transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink motion-reduce:transition-none"
          >
            Build my routine
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none">→</span>
          </Link>
          <p className="text-xs text-ink/60">7 questions · approximately 3 minutes</p>
          <p className="mt-2 max-w-2xl text-xs leading-relaxed text-ink/55">
            The Routine Finder provides cosmetic product guidance. It does not diagnose or treat
            acne, rosacea, eczema, dermatitis or another medical condition. If your skin is
            persistently painful, severely irritated or changing unexpectedly, seek advice from an
            appropriately qualified health professional.
          </p>
        </div>

        <ul className="mt-14 grid gap-px overflow-hidden border-t border-border md:grid-cols-3 md:border-t-0">
          {STEPS.map((s) => (
            <li key={s.num} className="border-b border-border py-6 md:border-b-0 md:border-t md:py-7 md:pr-8">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-xs italic text-ink/60">{s.num}</span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-clay">
                  {s.kicker}
                </span>
              </div>
              <p className="mt-3 font-display text-sm uppercase tracking-[0.14em] text-ink">
                {s.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{s.copy}</p>
              <p className="mt-3 text-xs leading-relaxed text-ink/50">{s.note}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
