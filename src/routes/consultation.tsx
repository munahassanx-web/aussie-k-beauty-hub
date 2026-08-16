import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useBuyNow } from "@/hooks/use-buy-now";
import { WhyThisIngredient } from "@/components/why-this-ingredient";
import { CONSULT_PRODUCT_MAP } from "@/lib/consult-catalog";
import {
  runConsultation,
  askConsultantFollowUp,
  saveConsultationLead,
  type ConsultAnswers,
  type ConsultationResult,
} from "@/lib/consultation.functions";

export const Route = createFileRoute("/consultation")({
  head: () => ({
    meta: [
      { title: "Skin Consultation — Skin Grocer" },
      {
        name: "description",
        content:
          "A three-minute conversation with a K-beauty consultant. Tell us about your skin and your Australian climate, and we'll build a routine with the reasoning behind every step.",
      },
      { property: "og:title", content: "Skin Consultation — Skin Grocer" },
      {
        property: "og:description",
        content:
          "No wrong answers. Tell us about your skin and we'll build your routine — the same way we would for a friend who asked us in person.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/consultation" }],
  }),
  component: ConsultationPage,
});

// ---------------------------------------------------------------- questions

type Option = { value: string; title: string; hint?: string };

const SKIN_TYPES: Option[] = [
  { value: "Oily", title: "Oily", hint: "Shine comes back not long after cleansing" },
  { value: "Dry", title: "Dry", hint: "Feels tight, sometimes flaky" },
  { value: "Combination", title: "Combination", hint: "Oily through the T-zone, drier at the cheeks" },
  { value: "Sensitive", title: "Sensitive", hint: "Flushes or stings easily with new products" },
  { value: "Not sure", title: "Not sure", hint: "Completely fine — we'll work it out from the rest" },
];

const CONCERNS: Option[] = [
  { value: "Dullness", title: "Dullness", hint: "Skin looks flat even when you're well rested" },
  { value: "Breakouts", title: "Breakouts", hint: "Congestion, spots, or blocked pores" },
  { value: "Fine lines / ageing", title: "Fine lines & ageing", hint: "Early lines, or skin losing its bounce" },
  { value: "Redness / sensitivity", title: "Redness & sensitivity", hint: "Flushing or reactive patches" },
  { value: "Uneven tone", title: "Uneven tone", hint: "Dark marks or patchiness" },
  { value: "Dehydration", title: "Dehydration", hint: "Lacks water, not oil — even oily skin can feel tight" },
];

const FAMILIARITY: Option[] = [
  { value: "New and curious", title: "New and curious", hint: "You've heard the hype, haven't started" },
  { value: "Knows a few brands", title: "You know a few brands", hint: "COSRX, Beauty of Joseon, that world" },
  { value: "Past the beginner brands", title: "Past the beginner brands", hint: "You want what isn't in every haul video" },
];

const GAPS: Option[] = [
  { value: "Daily SPF", title: "Daily SPF" },
  { value: "A treatment step (serum / ampoule)", title: "A treatment step" },
  { value: "Proper hydration layer", title: "A proper hydration layer" },
  { value: "A gentle cleanser", title: "A gentle cleanser" },
  { value: "Anything for the eye area", title: "Anything for the eye area" },
  { value: "Consistency — I start and stop", title: "Consistency — I start and stop" },
  { value: "Honestly, I don't have a routine yet", title: "Honestly, no routine yet" },
];

const SUN: Option[] = [
  { value: "Outdoors most days", title: "Outdoors most days", hint: "Work, school run, or commute in full sun" },
  { value: "A mix", title: "A mix", hint: "Some sun, mostly indoors on weekdays" },
  { value: "Mostly indoors", title: "Mostly indoors", hint: "But still an Australian UV index" },
];

const AIR: Option[] = [
  { value: "Air-conditioning most of the day", title: "Air-conditioning most of the day" },
  { value: "Indoor heating through winter", title: "Indoor heating through winter" },
  { value: "Both, depending on the season", title: "Both, depending on the season" },
  { value: "Neither, really", title: "Neither, really" },
];

const BUDGET: Option[] = [
  { value: "Under $50 / month", title: "Under $50 a month" },
  { value: "$50–$100 / month", title: "$50 – $100 a month" },
  { value: "$100–$200 / month", title: "$100 – $200 a month" },
  { value: "Whatever it takes to get it right", title: "Whatever it takes to get it right" },
];

const STEPS = ["skin", "concerns", "familiarity", "gaps", "sun", "air", "budget", "words"] as const;
type Phase = "intro" | (typeof STEPS)[number] | "result";

type Draft = {
  skinType: string | null;
  concerns: string[];
  familiarity: string | null;
  gaps: string[];
  sunExposure: string | null;
  indoorAir: string | null;
  budget: string | null;
  freeText: string;
  name: string;
  email: string;
  consent: boolean;
};

const EMPTY: Draft = {
  skinType: null,
  concerns: [],
  familiarity: null,
  gaps: [],
  sunExposure: null,
  indoorAir: null,
  budget: null,
  freeText: "",
  name: "",
  email: "",
  consent: false,
};

// ------------------------------------------------------------------- page

function ConsultationPage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [result, setResult] = useState<ConsultationResult | null>(null);
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stepIndex = STEPS.indexOf(phase as (typeof STEPS)[number]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [phase]);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => ({ ...d, [k]: v }));
  const next = () => setPhase(STEPS[Math.min(STEPS.length - 1, stepIndex + 1)]);
  const back = () => (stepIndex <= 0 ? setPhase("intro") : setPhase(STEPS[stepIndex - 1]));

  const answers: ConsultAnswers = {
    skinType: draft.skinType ?? "Not sure",
    concerns: draft.concerns,
    familiarity: draft.familiarity ?? "New and curious",
    gaps: draft.gaps,
    sunExposure: draft.sunExposure ?? "A mix",
    indoorAir: draft.indoorAir ?? "Neither, really",
    budget: draft.budget ?? "Under $50 / month",
    freeText: draft.freeText,
    name: draft.name,
  };

  async function submit() {
    setThinking(true);
    setError(null);
    try {
      const res = await runConsultation({ data: { answers } });
      setResult(res);
      setPhase("result");
      // Consent-gated lead capture — never blocks the consultation itself.
      if (draft.consent && draft.email) {
        saveConsultationLead({
          data: {
            name: draft.name,
            email: draft.email,
            skinType: answers.skinType,
            concerns: answers.concerns,
            gaps: answers.gaps,
            budget: answers.budget,
            consent: true,
            recommended: res.routine.map((r) => r.priceId),
          },
        }).catch(() => undefined);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Try again?");
    } finally {
      setThinking(false);
    }
  }

  return (
    <div className="quiz-stage relative min-h-screen overflow-hidden py-12 md:py-20">
      <div className="quiz-aurora" aria-hidden />
      <div className="relative mx-auto max-w-2xl px-5">

        <div className="text-center">
          <p className="font-display text-lg tracking-[0.18em] text-ink">SKIN GROCER</p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            Skin Consultation
          </p>
        </div>

        <ProgressBar
          value={
            phase === "intro" ? 0 : phase === "result" ? 1 : (stepIndex + 1) / STEPS.length
          }
          label={
            phase === "intro"
              ? "Ready when you are"
              : phase === "result"
                ? "Consultation complete"
                : `Question ${stepIndex + 1} of ${STEPS.length}`
          }
        />

        <div className="mt-8" key={phase}>
          <div className="quiz-step">
          {phase === "intro" && <Intro onStart={() => setPhase("skin")} />}


          {phase === "skin" && (
            <Question
              index={0}
              prompt="Let's start with how your skin usually behaves."
              aside="No wrong answers — pick the one that sounds most like you."
              onBack={back}
              onNext={draft.skinType ? next : null}
            >
              <Choices options={SKIN_TYPES} value={draft.skinType} onChange={(v) => set("skinType", v)} />
            </Question>
          )}

          {phase === "concerns" && (
            <Question
              index={1}
              prompt="What would you most like to change?"
              aside="Pick up to two. Two well-targeted concerns beat six half-addressed ones."
              onBack={back}
              onNext={draft.concerns.length ? next : null}
            >
              <Choices
                multi
                max={2}
                options={CONCERNS}
                values={draft.concerns}
                onToggle={(v) =>
                  set(
                    "concerns",
                    draft.concerns.includes(v)
                      ? draft.concerns.filter((x) => x !== v)
                      : draft.concerns.length >= 2
                        ? [draft.concerns[1], v]
                        : [...draft.concerns, v],
                  )
                }
              />
            </Question>
          )}

          {phase === "familiarity" && (
            <Question
              index={2}
              prompt="How deep are you into K-beauty already?"
              aside="This is so we pitch the answer at the right level — not so we sell you more."
              onBack={back}
              onNext={draft.familiarity ? next : null}
            >
              <Choices options={FAMILIARITY} value={draft.familiarity} onChange={(v) => set("familiarity", v)} />
            </Question>
          )}

          {phase === "gaps" && (
            <Question
              index={3}
              prompt="What's missing from what you do now?"
              aside="Select anything that applies."
              onBack={back}
              onNext={next}
            >
              <Choices
                multi
                options={GAPS}
                values={draft.gaps}
                onToggle={(v) =>
                  set("gaps", draft.gaps.includes(v) ? draft.gaps.filter((x) => x !== v) : [...draft.gaps, v])
                }
              />
            </Question>
          )}

          {phase === "sun" && (
            <Question
              index={4}
              prompt="How much sun does your day actually involve?"
              aside="Almost all of Australia sits at a UV index Korean routines aren't written for. It changes what we'd recommend."
              onBack={back}
              onNext={draft.sunExposure ? next : null}
            >
              <Choices options={SUN} value={draft.sunExposure} onChange={(v) => set("sunExposure", v)} />
            </Question>
          )}

          {phase === "air" && (
            <Question
              index={5}
              prompt="And the air you sit in all day?"
              aside="Air-conditioning and winter heating quietly pull more water out of skin than the weather does."
              onBack={back}
              onNext={draft.indoorAir ? next : null}
            >
              <Choices options={AIR} value={draft.indoorAir} onChange={(v) => set("indoorAir", v)} />
            </Question>
          )}

          {phase === "budget" && (
            <Question
              index={6}
              prompt="What feels comfortable to spend each month?"
              aside="We'd rather build something you'll actually keep up than something impressive."
              onBack={back}
              onNext={draft.budget ? next : null}
            >
              <Choices options={BUDGET} value={draft.budget} onChange={(v) => set("budget", v)} />
            </Question>
          )}

          {phase === "words" && (
            <FinalStep
              draft={draft}
              set={set}
              onBack={back}
              onSubmit={submit}
              thinking={thinking}
              error={error}
            />
          )}

          {phase === "result" && result && (
            <Results
              result={result}
              answers={answers}
              onRestart={() => {
                setDraft(EMPTY);
                setResult(null);
                setPhase("intro");
              }}
            />
          )}
          </div>
        </div>


        <p className="mt-8 text-center text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Guidance only — not a substitute for a dermatologist
        </p>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ pieces

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className="border border-border bg-paper p-8 md:p-12">
      <p className="text-[10px] uppercase tracking-[0.22em] text-primary">Three minutes, in your words</p>
      <h1 className="mt-4 font-display text-3xl leading-[1.15] text-ink md:text-[2.6rem]">
        No wrong answers here.
      </h1>
      <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
        Tell us about your skin and we'll build your routine — the same way we would for a friend who
        asked us in person. A few questions, then a proper conversation about what's actually going on
        with your skin.
      </p>
      <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
        It replaces the hours of tabs, reviews and conflicting YouTube advice with one honest
        three-minute conversation — with someone who knows both Korean formulations and Australian
        conditions.
      </p>
      <div className="mt-8 grid grid-cols-3 gap-4 border-y border-border py-5 text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
        <div>
          <span className="block font-display text-2xl normal-case tracking-normal text-ink">7</span>
          questions
        </div>
        <div>
          <span className="block font-display text-2xl normal-case tracking-normal text-ink">~3</span>
          minutes
        </div>
        <div>
          <span className="block font-display text-2xl normal-case tracking-normal text-ink">1</span>
          routine, reasoned
        </div>
      </div>
      <button
        onClick={onStart}
        className="mt-8 w-full bg-ink py-4 text-[11px] font-medium uppercase tracking-[0.18em] text-paper transition-colors hover:bg-primary"
      >
        Start the conversation
      </button>
    </div>
  );
}

function ProgressBar({ value, label }: { value: number; label: string }) {
  return (
    <div className="mt-8">
      <div className="flex items-baseline justify-between">
        <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</span>
        <span className="font-display text-sm italic text-primary">{Math.round(value * 100)}%</span>
      </div>
      <div
        className="mt-2.5 h-[6px] w-full overflow-hidden rounded-full bg-border/60 shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)]"
        role="progressbar"
        aria-valuenow={Math.round(value * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary/60 via-primary to-ink shadow-[0_0_18px_rgba(0,0,0,0.35)]"
          style={{
            width: `${Math.max(3, value * 100)}%`,
            transition: "width 900ms cubic-bezier(0.22, 0.9, 0.24, 1)",
          }}
        />
      </div>

    </div>
  );
}

function Marker({ index }: { index: number }) {
  return (
    <div className="mb-7 flex items-baseline gap-4">
      <span className="font-display text-2xl italic text-primary">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="flex flex-1 gap-1">
        {STEPS.map((_, i) => (
          <span
            key={i}
            className={`h-px flex-1 transition-colors duration-500 ${i <= index ? "bg-primary" : "bg-border"}`}
            aria-hidden
          />
        ))}
      </div>
      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        of {STEPS.length}
      </span>
    </div>
  );
}


function Question({
  index,
  prompt,
  aside,
  children,
  onBack,
  onNext,
}: {
  index: number;
  prompt: string;
  aside?: string;
  children: React.ReactNode;
  onBack: () => void;
  onNext: (() => void) | null;
}) {
  return (
    <div className="border border-border bg-paper p-7 md:p-10">
      <Marker index={index} />
      <h2 className="font-display text-[1.7rem] leading-snug text-ink">{prompt}</h2>
      {aside && <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">{aside}</p>}
      <div className="mt-7">{children}</div>
      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground hover:text-ink"
        >
          ← Back
        </button>
        <button
          onClick={onNext ?? undefined}
          disabled={!onNext}
          className="bg-ink px-7 py-3 text-[10px] font-medium uppercase tracking-[0.18em] text-paper transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:bg-border disabled:text-muted-foreground"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function Choices(
  props:
    | { options: Option[]; value: string | null; onChange: (v: string) => void; multi?: false; max?: never }
    | { options: Option[]; values: string[]; onToggle: (v: string) => void; multi: true; max?: number },
) {
  const selected = (v: string) => (props.multi ? props.values.includes(v) : props.value === v);
  return (
    <div className="flex flex-col gap-2">
      {props.options.map((o, i) => {
        const sel = selected(o.value);
        return (
          <button
            key={o.value}
            onClick={() => (props.multi ? props.onToggle(o.value) : props.onChange(o.value))}
            style={{ animationDelay: `${i * 45}ms` }}
            className={`quiz-step quiz-glass flex items-start justify-between gap-3 rounded-xl px-5 py-4 text-left text-ink ${
              sel ? "quiz-glass-active" : ""
            }`}
          >
            <span className="flex-1">
              <span className="block text-[15px] font-medium leading-snug">{o.title}</span>
              {o.hint && <span className="mt-1 block text-xs text-muted-foreground">{o.hint}</span>}
            </span>
            <span
              className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[11px] transition-all duration-300 ${
                sel
                  ? "scale-100 border-primary bg-primary text-paper opacity-100"
                  : "scale-90 border-border text-transparent opacity-40"
              }`}
            >
              ✓
            </span>
          </button>

        );
      })}
    </div>
  );
}

function FinalStep({
  draft,
  set,
  onBack,
  onSubmit,
  thinking,
  error,
}: {
  draft: Draft;
  set: <K extends keyof Draft>(k: K, v: Draft[K]) => void;
  onBack: () => void;
  onSubmit: () => void;
  thinking: boolean;
  error: string | null;
}) {
  return (
    <div className="border border-border bg-paper p-7 md:p-10">
      <Marker index={7} />
      <h2 className="font-display text-[1.7rem] leading-snug text-ink">
        Anything else you'd tell a consultant in person?
      </h2>
      <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
        Describe your skin in your own words, or ask us something outright — "will this help my
        hormonal breakouts?", "is retinol too much for me?". This is the part that makes the routine
        yours.
      </p>

      <textarea
        value={draft.freeText}
        onChange={(e) => set("freeText", e.target.value)}
        rows={5}
        maxLength={1200}
        placeholder="My skin gets oily by lunchtime but still feels tight, and I break out along my jaw before my period…"
        className="mt-5 w-full resize-none border border-border bg-cream px-4 py-3 text-sm leading-relaxed text-ink outline-none placeholder:text-muted-foreground/70 focus:border-primary"
      />

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">First name</span>
          <input
            value={draft.name}
            onChange={(e) => set("name", e.target.value)}
            className="mt-1.5 w-full border border-border bg-cream px-3 py-2.5 text-sm text-ink outline-none focus:border-primary"
            placeholder="So we can talk to you properly"
          />
        </label>
        <label className="block">
          <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Email</span>
          <input
            type="email"
            value={draft.email}
            onChange={(e) => set("email", e.target.value)}
            className="mt-1.5 w-full border border-border bg-cream px-3 py-2.5 text-sm text-ink outline-none focus:border-primary"
            placeholder="you@example.com"
          />
        </label>
      </div>

      <label className="mt-4 flex cursor-pointer items-start gap-3 border border-border bg-cream px-4 py-3">
        <input
          type="checkbox"
          checked={draft.consent}
          onChange={(e) => set("consent", e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[#1F2A37]"
        />
        <span className="text-xs leading-relaxed text-muted-foreground">
          Email me my routine and occasional Skin Grocer notes on new arrivals and skincare guidance.
          You can unsubscribe any time. <span className="text-ink">Optional</span> — your consultation
          works either way.
        </span>
      </label>

      {error && <p className="mt-4 text-xs text-destructive">{error}</p>}

      <div className="mt-7 flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground hover:text-ink"
        >
          ← Back
        </button>
        <button
          onClick={onSubmit}
          disabled={thinking}
          className="bg-ink px-7 py-3 text-[10px] font-medium uppercase tracking-[0.18em] text-paper transition-colors hover:bg-primary disabled:cursor-wait disabled:bg-border disabled:text-muted-foreground"
        >
          {thinking ? "Reading your answers…" : "Build my routine"}
        </button>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ result

type RoutineStep = {
  product: (typeof CONSULT_PRODUCT_MAP)[string];
  why: string;
  slot: "am" | "pm" | "both";
};

function slotFor(step: string): "am" | "pm" | "both" {
  const s = step.toLowerCase();
  if (s.includes("protect")) return "am";
  if (s.includes("weekly") || s.includes("targeted") || s.includes("sleeping")) return "pm";
  return "both";
}

function RoutineColumn({
  title,
  caption,
  icon,
  steps,
  buy,
}: {
  title: string;
  caption: string;
  icon: string;
  steps: RoutineStep[];
  buy: (o: { priceId: string; name: string; priceLabel: string }) => void;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-paper/80 p-5">
      <div className="flex items-baseline gap-2">
        <span className="text-base text-primary">{icon}</span>
        <h3 className="font-display text-xl text-ink">{title}</h3>
      </div>
      <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{caption}</p>

      {steps.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">Nothing extra needed here.</p>
      ) : (
        <ol className="relative mt-6 space-y-6 border-l border-dashed border-border pl-5">
          {steps.map((s, i) => (
            <li key={`${title}-${s.product.priceId}-${i}`} className="quiz-step relative" style={{ animationDelay: `${i * 70}ms` }}>
              <span className="absolute -left-[26px] top-1.5 grid h-4 w-4 place-items-center rounded-full border border-primary bg-paper text-[9px] text-primary">
                {i + 1}
              </span>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{s.product.step}</p>
              <div className="quiz-glass mt-2 flex gap-3 rounded-xl p-3">
                <img
                  src={s.product.image}
                  alt={s.product.name}
                  loading="lazy"
                  className="h-16 w-16 shrink-0 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.product.brand}</p>
                  <p className="font-display text-[15px] leading-snug text-ink">{s.product.name}</p>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">{s.why}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="text-[13px] text-ink">{s.product.price} AUD</span>
                    <button
                      onClick={() =>
                        buy({
                          priceId: s.product.priceId,
                          name: s.product.name,
                          priceLabel: `${s.product.price} AUD`,
                        })
                      }
                      className="rounded-full border border-ink px-3 py-1 text-[10px] uppercase tracking-wider text-ink transition-colors hover:bg-ink hover:text-paper"
                    >
                      Add it
                    </button>
                  </div>
                  <WhyThisIngredient productId={s.product.priceId} />
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function Results({
  result,
  answers,
  onRestart,
}: {
  result: ConsultationResult;
  answers: ConsultAnswers;
  onRestart: () => void;
}) {
  const { buy, modal } = useBuyNow();
  const [thread, setThread] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const threadEnd = useRef<HTMLDivElement>(null);

  const steps: RoutineStep[] = result.routine
    .map((r) => {
      const p = CONSULT_PRODUCT_MAP[r.priceId];
      return p ? { product: p, why: r.why, slot: slotFor(p.step) } : null;
    })
    .filter(Boolean) as RoutineStep[];

  const routineTotal = `A$${steps
    .reduce((sum, s) => sum + Number(s.product.price.replace(/[^0-9.]/g, "") || 0), 0)
    .toFixed(2)
    .replace(/\.00$/, "")}`;

  async function addAll() {
    steps.forEach((s) =>
      buy({ priceId: s.product.priceId, name: s.product.name, priceLabel: `${s.product.price} AUD` }),
    );
    const { default: confetti } = await import("canvas-confetti");
    const shots = [
      { spread: 70, startVelocity: 45, particleCount: 60, origin: { y: 0.7 } },
      { spread: 120, startVelocity: 30, particleCount: 40, decay: 0.92, origin: { y: 0.7 } },
    ];
    shots.forEach((s, i) =>
      setTimeout(() => confetti({ ...s, scalar: 0.9, ticks: 160, colors: ["#1F2A37", "#C7A17A", "#F4F5F7"] }), i * 140),
    );
  }

  useEffect(() => {
    if (thread.length) threadEnd.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [thread]);


  async function ask() {
    const q = question.trim();
    if (!q || busy) return;
    setQuestion("");
    setErr(null);
    setThread((t) => [...t, { role: "user", content: q }]);
    setBusy(true);
    try {
      const { reply } = await askConsultantFollowUp({
        data: { answers, history: thread, question: q },
      });
      setThread((t) => [...t, { role: "assistant", content: reply }]);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "That didn't send. Try again?");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="border border-border bg-paper p-7 md:p-10">
      <p className="text-[10px] uppercase tracking-[0.22em] text-primary">Your consultation</p>
      <h2 className="mt-3 font-display text-[1.9rem] leading-snug text-ink">
        {answers.name ? `Here's your routine, ${answers.name}.` : "Here's your routine."}
      </h2>

      <p className="mt-5 whitespace-pre-line text-[15px] leading-relaxed text-ink/85">{result.opening}</p>

      <div className="mt-6 flex flex-wrap gap-1.5">
        {[answers.skinType, ...answers.concerns, answers.sunExposure, answers.indoorAir]
          .filter(Boolean)
          .map((f) => (
            <span
              key={f}
              className="border border-border px-2.5 py-1 text-[10px] uppercase tracking-[0.05em] text-muted-foreground"
            >
              {f}
            </span>
          ))}
      </div>

      <div className="mt-9 rounded-2xl border border-border/70 bg-cream/60 p-1 md:p-2">
        <div className="grid gap-2 md:grid-cols-2">
          <RoutineColumn
            title="Morning"
            caption="Protect and prep for an Australian UV day"
            icon="☀"
            steps={steps.filter((s) => s.slot !== "pm")}
            buy={buy}
          />
          <RoutineColumn
            title="Evening"
            caption="Repair while you sleep"
            icon="☾"
            steps={steps.filter((s) => s.slot !== "am")}
            buy={buy}
          />
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-paper p-5 text-center">
        <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          {steps.length} products · {routineTotal}
        </p>
        <button
          onClick={addAll}
          className="mt-3 w-full rounded-xl bg-ink py-4 text-[11px] font-medium uppercase tracking-[0.18em] text-paper transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary hover:shadow-[0_18px_40px_-22px_rgba(0,0,0,0.6)]"
        >
          Add full routine to cart
        </button>
        <p className="mt-2 text-[11px] text-muted-foreground">
          Free shipping on orders over A$80 · Melbourne warehouse, same-day dispatch
        </p>
      </div>


      {/* Follow-up conversation */}
      <div className="mt-9 border-t border-border pt-7">
        <p className="text-[15px] leading-relaxed text-ink/85">{result.closing}</p>

        {thread.length > 0 && (
          <div className="mt-5 space-y-4">
            {thread.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-auto max-w-[85%] bg-accent/30 px-4 py-3 text-sm leading-relaxed text-ink"
                    : "max-w-[92%] border-l-2 border-primary bg-cream px-4 py-3 text-sm leading-relaxed text-ink/85"
                }
              >
                {m.content}
              </div>
            ))}
            {busy && <p className="text-xs italic text-muted-foreground">Thinking it through…</p>}
            <div ref={threadEnd} />
          </div>
        )}

        {err && <p className="mt-3 text-xs text-destructive">{err}</p>}

        <div className="mt-5 flex gap-2">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") ask();
            }}
            placeholder="Ask a follow-up…"
            className="flex-1 border border-border bg-cream px-4 py-3 text-sm text-ink outline-none placeholder:text-muted-foreground/70 focus:border-primary"
          />
          <button
            onClick={ask}
            disabled={busy || !question.trim()}
            className="bg-ink px-5 text-[10px] font-medium uppercase tracking-[0.18em] text-paper hover:bg-primary disabled:bg-border disabled:text-muted-foreground"
          >
            Ask
          </button>
        </div>
      </div>

      <div className="mt-9 flex flex-col items-center gap-3">
        <Link
          to="/shop"
          className="bg-ink px-8 py-3 text-[10px] font-medium uppercase tracking-[0.18em] text-paper hover:bg-primary"
        >
          Shop the full range
        </Link>
        <button
          onClick={onRestart}
          className="border border-border px-4 py-2 text-[10px] uppercase tracking-[0.14em] text-muted-foreground hover:border-ink hover:text-ink"
        >
          Start over
        </button>
      </div>
      {modal}
    </div>
  );
}
