import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useBuyNow } from "@/hooks/use-buy-now";
import { productSlug } from "@/lib/product-detail";
import {
  buildRoutine,
  itemsFor,
  CONCERN_COPY,
  type ConsultationOutcome,
  type Depth,
  type Experience,
  type QuizAnswers,
  type Reactivity,
  type SkinFeel,
  type TexturePref,
} from "@/lib/routine-matching";
import type { Concern } from "@/lib/shop-catalog";
import { askConsultantFollowUp, saveConsultationLead } from "@/lib/consultation.functions";

export const Route = createFileRoute("/consultation")({
  head: () => ({
    meta: [
      { title: "Skin Consultation — Build Your Routine | Skin Grocer" },
      {
        name: "description",
        content:
          "Seven short questions and we'll build a personalised Korean skincare routine from the products we actually stock in Melbourne — with the reasoning behind every step.",
      },
      { property: "og:title", content: "Skin Consultation — Build Your Routine | Skin Grocer" },
      {
        property: "og:description",
        content:
          "Tell us how your skin behaves and we'll build an AM and PM routine from the Skin Grocer range — no jargon, no guesswork, no invented claims.",
      },
      { property: "og:url", content: "https://skingrocer.com.au/consultation" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://skingrocer.com.au/consultation" }],
  }),
  component: ConsultationPage,
});

// ---------------------------------------------------------------- questions

type Option<T extends string> = { value: T; title: string; hint?: string };

const SKIN_FEEL: Option<SkinFeel>[] = [
  { value: "dry", title: "Tight or dry", hint: "Feels tight after cleansing, sometimes flaky" },
  { value: "oily", title: "Shiny by midday", hint: "Shine comes back not long after washing" },
  { value: "combination", title: "A bit of both", hint: "Oily through the nose and forehead, drier at the cheeks" },
  { value: "balanced", title: "Mostly comfortable", hint: "Nothing dramatic either way" },
  { value: "unsure", title: "Not sure", hint: "Completely fine — the rest of the answers will tell us" },
];

const CONCERN_OPTIONS: Option<Concern>[] = [
  { value: "hydration", title: "Dryness & dehydration", hint: "Tightness, flaking, skin drinking product" },
  { value: "acne", title: "Breakouts & congestion", hint: "Spots, blocked pores, bumpy texture" },
  { value: "pigmentation", title: "Uneven tone & marks", hint: "Dark marks, patchiness, dullness" },
  { value: "sensitivity", title: "Redness & reactivity", hint: "Flushes or stings with new products" },
  { value: "anti-aging", title: "Firmness & fine lines", hint: "Early lines, skin losing bounce" },
  { value: "barrier", title: "A stressed barrier", hint: "Everything stings, skin feels worn out" },
];

const REACTIVITY: Option<Reactivity>[] = [
  { value: "often", title: "Often", hint: "New products regularly sting, flush or break me out" },
  { value: "sometimes", title: "Sometimes", hint: "It happens, but not with everything" },
  { value: "rarely", title: "Rarely", hint: "My skin handles most things fine" },
];

const EXPERIENCE: Option<Experience>[] = [
  { value: "new", title: "Starting from scratch", hint: "Little or no routine yet" },
  { value: "some", title: "I have the basics", hint: "Cleanser, moisturiser, maybe SPF" },
  { value: "confident", title: "I know what I'm doing", hint: "Comfortable with serums and stronger actives" },
];

const DEPTH: Option<Depth>[] = [
  { value: "minimal", title: "Keep it short", hint: "Three steps I'll actually do every day" },
  { value: "balanced", title: "A proper routine", hint: "Around five steps, morning and night" },
  { value: "full", title: "I enjoy the ritual", hint: "Happy with a fuller routine and a weekly treatment" },
];

const TEXTURE: Option<TexturePref>[] = [
  { value: "light", title: "Light and fast-absorbing", hint: "Gels, lotions, watery layers" },
  { value: "rich", title: "Rich and cushioned", hint: "Proper creams that sit on the skin" },
  { value: "either", title: "No preference", hint: "Pick whatever suits my skin best" },
];

const STEPS = [
  "feel",
  "primary",
  "secondary",
  "reactivity",
  "experience",
  "depth",
  "texture",
] as const;
type Phase = "intro" | (typeof STEPS)[number] | "result";

type Draft = {
  skinFeel: SkinFeel | null;
  primaryConcern: Concern | null;
  secondaryConcern: Concern | "none" | null;
  reactivity: Reactivity | null;
  experience: Experience | null;
  depth: Depth | null;
  texture: TexturePref | null;
};

const EMPTY: Draft = {
  skinFeel: null,
  primaryConcern: null,
  secondaryConcern: null,
  reactivity: null,
  experience: null,
  depth: null,
  texture: null,
};

const STORAGE_KEY = "sg-consultation-v2";

function isComplete(d: Draft): d is Required<{ [K in keyof Draft]: NonNullable<Draft[K]> }> {
  return Object.values(d).every((v) => v !== null);
}

function toAnswers(d: Draft): QuizAnswers {
  return {
    skinFeel: d.skinFeel ?? "unsure",
    primaryConcern: d.primaryConcern ?? "hydration",
    secondaryConcern: d.secondaryConcern ?? "none",
    reactivity: d.reactivity ?? "sometimes",
    experience: d.experience ?? "some",
    depth: d.depth ?? "balanced",
    texture: d.texture ?? "either",
  };
}

// ------------------------------------------------------------------- page

function ConsultationPage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  // Least-invasive persistence: the same localStorage approach the cart uses.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { draft?: Draft; done?: boolean };
        if (parsed?.draft) {
          setDraft({ ...EMPTY, ...parsed.draft });
          if (parsed.done && isComplete({ ...EMPTY, ...parsed.draft })) setPhase("result");
        }
      }
    } catch {
      /* ignore malformed state */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ draft, done: phase === "result" }),
    );
  }, [draft, phase, hydrated]);

  const stepIndex = STEPS.indexOf(phase as (typeof STEPS)[number]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [phase]);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => ({ ...d, [k]: v }));
  const next = () => setPhase(STEPS[Math.min(STEPS.length - 1, stepIndex + 1)]);
  const back = () => (stepIndex <= 0 ? setPhase("intro") : setPhase(STEPS[stepIndex - 1]));

  const outcome = useMemo<ConsultationOutcome | null>(
    () => (isComplete(draft) ? buildRoutine(toAnswers(draft)) : null),
    [draft],
  );

  /** Answer + advance in one tap — the whole quiz is one tap per question. */
  const choose = <K extends keyof Draft>(k: K, v: Draft[K]) => {
    set(k, v);
    if (stepIndex === STEPS.length - 1) setPhase("result");
    else window.setTimeout(next, 180);
  };

  const progress =
    phase === "intro" ? 0 : phase === "result" ? 1 : (stepIndex + 1) / STEPS.length;

  const restart = () => {
    setDraft(EMPTY);
    setPhase("intro");
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="min-h-screen bg-ink py-10 md:py-16">
      <div className="mx-auto w-full max-w-2xl px-4 md:px-6">
        <ProgressBar
          value={progress}
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
            {phase === "intro" && <Intro onStart={() => setPhase("feel")} />}

            {phase === "feel" && (
              <Question
                index={0}
                prompt="How does your skin usually feel?"
                aside="No wrong answers — pick the one that sounds most like a normal day."
                onBack={back}
                onNext={draft.skinFeel ? next : null}
              >
                <Choices options={SKIN_FEEL} value={draft.skinFeel} onChange={(v) => choose("skinFeel", v)} />
              </Question>
            )}

            {phase === "primary" && (
              <Question
                index={1}
                prompt="What would you most like to change?"
                aside="This is the concern your routine will be built around."
                onBack={back}
                onNext={draft.primaryConcern ? next : null}
              >
                <Choices
                  options={CONCERN_OPTIONS}
                  value={draft.primaryConcern}
                  onChange={(v) => choose("primaryConcern", v)}
                />
              </Question>
            )}

            {phase === "secondary" && (
              <Question
                index={2}
                prompt="Anything else worth working on?"
                aside="We'll use this to break ties — it won't take over the routine."
                onBack={back}
                onNext={draft.secondaryConcern ? next : null}
              >
                <Choices
                  options={[
                    ...CONCERN_OPTIONS.filter((c) => c.value !== draft.primaryConcern),
                    { value: "none" as const, title: "Nothing else for now", hint: "Keep it focused on one thing" },
                  ]}
                  value={draft.secondaryConcern}
                  onChange={(v) => choose("secondaryConcern", v)}
                />
              </Question>
            )}

            {phase === "reactivity" && (
              <Question
                index={3}
                prompt="How often does your skin react to new products?"
                aside="If you react easily we leave exfoliating acids and retinal out entirely — no exceptions."
                onBack={back}
                onNext={draft.reactivity ? next : null}
              >
                <Choices options={REACTIVITY} value={draft.reactivity} onChange={(v) => choose("reactivity", v)} />
              </Question>
            )}

            {phase === "experience" && (
              <Question
                index={4}
                prompt="Where are you starting from?"
                aside="This changes how strong we're willing to go, not how much we recommend."
                onBack={back}
                onNext={draft.experience ? next : null}
              >
                <Choices options={EXPERIENCE} value={draft.experience} onChange={(v) => choose("experience", v)} />
              </Question>
            )}

            {phase === "depth" && (
              <Question
                index={5}
                prompt="How many steps do you actually want?"
                aside="We'd rather build something you'll keep up than something impressive."
                onBack={back}
                onNext={draft.depth ? next : null}
              >
                <Choices options={DEPTH} value={draft.depth} onChange={(v) => choose("depth", v)} />
              </Question>
            )}

            {phase === "texture" && (
              <Question
                index={6}
                prompt="How do you like things to feel on your skin?"
                aside="Last one. Texture is the difference between a routine you enjoy and one you abandon."
                onBack={back}
                onNext={draft.texture ? () => setPhase("result") : null}
              >
                <Choices options={TEXTURE} value={draft.texture} onChange={(v) => choose("texture", v)} />
              </Question>
            )}

            {phase === "result" &&
              (outcome ? (
                <Results outcome={outcome} onRestart={restart} onEdit={() => setPhase("feel")} />
              ) : (
                <div className="quiz-panel p-8 text-center">
                  <p className="text-[15px] text-muted-foreground">
                    We're missing a couple of answers. Start the consultation again and we'll build your routine.
                  </p>
                  <button
                    onClick={restart}
                    className="mt-6 bg-ink px-7 py-3 text-[11px] uppercase tracking-[0.18em] text-paper hover:bg-primary"
                  >
                    Start again
                  </button>
                </div>
              ))}
          </div>
        </div>

        <p className="mt-8 text-center text-[10px] uppercase leading-relaxed tracking-[0.22em] text-paper/75">
          Guidance only — not medical advice or a diagnosis
        </p>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ pieces

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className="quiz-panel p-7 md:p-12">
      <p className="text-[10px] uppercase tracking-[0.22em] text-primary">Three minutes, in your words</p>
      <h1 className="mt-4 font-display text-[2rem] leading-[1.15] text-ink md:text-[2.6rem]">
        What does your skin actually need?
      </h1>
      <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
        Seven short questions, then a routine built from the products sitting in our Melbourne
        warehouse — in the order you'd use them, with the reasoning behind every step.
      </p>
      <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
        We only recommend what we stock, and we only say what we can back up. If a step isn't right
        for you, we leave it out.
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
        Start the consultation
      </button>
    </div>
  );
}

function ProgressBar({ value, label }: { value: number; label: string }) {
  return (
    <div className="mt-4">
      <div className="flex items-baseline justify-between">
        <span className="text-[10px] uppercase tracking-[0.22em] text-paper/60">{label}</span>
        <span className="font-display text-sm italic text-paper/90">{Math.round(value * 100)}%</span>
      </div>
      <div
        className="mt-2.5 h-[7px] w-full overflow-hidden rounded-full bg-paper/12 shadow-[inset_0_1px_3px_rgba(0,0,0,0.45)]"
        role="progressbar"
        aria-label="Consultation progress"
        aria-valuenow={Math.round(value * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent via-primary to-paper motion-safe:transition-[width] motion-safe:duration-700"
          style={{ width: `${Math.max(3, value * 100)}%` }}
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
      <div className="flex flex-1 gap-1" aria-hidden>
        {STEPS.map((_, i) => (
          <span
            key={i}
            className={`h-px flex-1 transition-colors duration-500 ${i <= index ? "bg-primary" : "bg-border"}`}
          />
        ))}
      </div>
      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">of {STEPS.length}</span>
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
    <div className="quiz-panel p-6 md:p-10">
      <Marker index={index} />
      <h2 className="font-display text-[1.55rem] leading-snug text-ink md:text-[1.7rem]">{prompt}</h2>
      {aside && <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">{aside}</p>}
      <div className="mt-7">{children}</div>
      <div className="mt-8 flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="min-h-11 px-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          ← Back
        </button>
        <button
          onClick={onNext ?? undefined}
          disabled={!onNext}
          className="min-h-11 bg-ink px-7 text-[10px] font-medium uppercase tracking-[0.18em] text-paper transition-colors hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:bg-border disabled:text-muted-foreground"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function Choices<T extends string>({
  options,
  value,
  onChange,
}: {
  options: Option<T>[];
  value: T | null;
  onChange: (v: T) => void;
}) {
  return (
    <div role="radiogroup" className="grid gap-2.5">
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={`min-h-[56px] w-full rounded-xl border px-4 py-3.5 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
              active
                ? "border-ink bg-ink text-paper"
                : "border-border bg-cream/60 text-ink hover:border-ink"
            }`}
          >
            <span className="block text-[15px] leading-snug">{o.title}</span>
            {o.hint && (
              <span
                className={`mt-1 block text-[12.5px] leading-relaxed ${active ? "text-paper/70" : "text-muted-foreground"}`}
              >
                {o.hint}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ------------------------------------------------------------------ results

function Results({
  outcome,
  onRestart,
  onEdit,
}: {
  outcome: ConsultationOutcome;
  onRestart: () => void;
  onEdit: () => void;
}) {
  const { buy } = useBuyNow();
  const am = itemsFor(outcome, "am");
  const pm = itemsFor(outcome, "pm");
  const total = `A$${(outcome.totalCents / 100).toFixed(2).replace(/\.00$/, "")}`;

  const addAll = () => {
    outcome.items.forEach((i) =>
      buy({ priceId: i.product.priceId, name: i.product.name, priceLabel: i.product.price }),
    );
  };

  return (
    <div className="quiz-panel p-6 md:p-10">
      <p className="text-[10px] uppercase tracking-[0.22em] text-primary">Your consultation</p>
      <h1 className="mt-3 font-display text-[1.8rem] leading-snug text-ink md:text-[2.1rem]">
        Your skin profile
      </h1>

      <ul className="mt-5 space-y-2.5">
        {outcome.profile.map((line) => (
          <li key={line} className="flex gap-3 text-[15px] leading-relaxed text-ink/85">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden />
            {line}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap gap-1.5">
        {[
          CONCERN_COPY[outcome.answers.primaryConcern].label,
          outcome.answers.secondaryConcern !== "none"
            ? CONCERN_COPY[outcome.answers.secondaryConcern].label
            : null,
          outcome.answers.reactivity === "often" ? "Acid & retinal free" : null,
          outcome.answers.depth === "minimal" ? "Short routine" : null,
        ]
          .filter(Boolean)
          .map((f) => (
            <span
              key={f as string}
              className="border border-border px-2.5 py-1 text-[10px] uppercase tracking-[0.05em] text-muted-foreground"
            >
              {f}
            </span>
          ))}
      </div>

      <div className="mt-8 border-t border-border pt-6">
        <h2 className="font-display text-[1.3rem] text-ink">The strategy</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-ink/85">{outcome.strategy}</p>
        {outcome.omitted.length > 0 && (
          <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
            We've left out {outcome.omitted.join(" and ")} — nothing in our current range was a
            confident match for what you told us, and we'd rather say so than fill the gap.
          </p>
        )}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <RoutineColumn title="Morning" caption="Protect and prep for an Australian UV day" items={am} buy={buy} />
        <RoutineColumn title="Evening" caption="Repair while you sleep" items={pm} buy={buy} />
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-paper p-5 text-center">
        <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          {outcome.items.length} products · {total}
        </p>
        <button
          onClick={addAll}
          className="mt-3 min-h-12 w-full rounded-xl bg-ink text-[11px] font-medium uppercase tracking-[0.18em] text-paper transition-colors hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Add the full routine to cart
        </button>
        <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
          Dispatched from our Melbourne warehouse · Free shipping over A$80
        </p>
      </div>

      <SaveRoutine outcome={outcome} />
      <FollowUp outcome={outcome} />

      <div className="mt-9 flex flex-col items-center gap-3">
        <Link
          to="/shop"
          className="min-h-11 bg-ink px-8 py-3 text-[10px] font-medium uppercase tracking-[0.18em] text-paper hover:bg-primary"
        >
          Shop the full range
        </Link>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={onEdit}
            className="min-h-11 border border-border px-4 text-[10px] uppercase tracking-[0.14em] text-muted-foreground hover:border-ink hover:text-ink"
          >
            Change my answers
          </button>
          <button
            onClick={onRestart}
            className="min-h-11 border border-border px-4 text-[10px] uppercase tracking-[0.14em] text-muted-foreground hover:border-ink hover:text-ink"
          >
            Retake consultation
          </button>
        </div>
      </div>
    </div>
  );
}

function RoutineColumn({
  title,
  caption,
  items,
  buy,
}: {
  title: string;
  caption: string;
  items: ReturnType<typeof itemsFor>;
  buy: ReturnType<typeof useBuyNow>["buy"];
}) {
  return (
    <section className="rounded-2xl border border-border/70 bg-cream/50 p-4">
      <header className="border-b border-border pb-3">
        <h2 className="font-display text-[1.25rem] text-ink">{title}</h2>
        <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{caption}</p>
      </header>
      {items.length === 0 ? (
        <p className="mt-4 text-[13px] text-muted-foreground">No steps recommended for this time of day.</p>
      ) : (
        <ol className="mt-4 space-y-5">
          {items.map((item, i) => (
            <li key={item.product.priceId}>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Step {i + 1} · {item.step}
              </p>
              <div className="quiz-glass mt-2 rounded-xl p-3">
                <div className="flex gap-3">
                  <img
                    src={item.product.image}
                    alt={`${item.product.brand} ${item.product.name}`}
                    loading="lazy"
                    className="h-16 w-16 shrink-0 rounded-lg bg-paper object-contain"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {item.product.brand}
                    </p>
                    <Link
                      to="/product/$slug"
                      params={{ slug: productSlug(item.product) }}
                      className="font-display text-[15px] leading-snug text-ink hover:text-primary"
                    >
                      {item.product.name}
                    </Link>
                    <p className="mt-1 text-[13px] text-ink">{item.product.price}</p>
                  </div>
                </div>

                <p className="mt-3 text-[12.5px] leading-relaxed text-muted-foreground">{item.why}</p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                  When: <span className="normal-case tracking-normal text-ink/80">{item.when}</span>
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() =>
                      buy({
                        priceId: item.product.priceId,
                        name: item.product.name,
                        priceLabel: item.product.price,
                      })
                    }
                    className="min-h-10 rounded-full border border-ink px-4 text-[10px] uppercase tracking-wider text-ink transition-colors hover:bg-ink hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    Add to bag
                  </button>
                  <Link
                    to="/guide/$productId"
                    params={{ productId: item.slug }}
                    className="min-h-10 rounded-full border border-border px-4 py-2.5 text-[10px] uppercase tracking-wider text-muted-foreground hover:border-ink hover:text-ink"
                  >
                    How to apply
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

/** Optional — the routine is already visible before this is offered. */
function SaveRoutine({ outcome }: { outcome: ConsultationOutcome }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    if (busy) return;
    setBusy(true);
    try {
      await saveConsultationLead({
        data: {
          name,
          email,
          consent,
          skinType: outcome.answers.skinFeel,
          concerns: [outcome.answers.primaryConcern, outcome.answers.secondaryConcern].filter(
            (c) => c !== "none",
          ),
          gaps: [],
          budget: outcome.answers.depth,
          recommended: outcome.items.map((i) => i.product.priceId),
        },
      });
      setSaved(true);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "That didn't save. Try again?");
    } finally {
      setBusy(false);
    }
  }

  if (saved) {
    return (
      <p className="mt-6 rounded-xl border border-border bg-cream/60 p-4 text-[13px] leading-relaxed text-ink/85">
        Saved. We'll send your routine and the occasional Skin Grocer dispatch — unsubscribe any time.
      </p>
    );
  }

  return (
    <div className="mt-6 rounded-xl border border-border bg-cream/50 p-4">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="min-h-11 w-full text-[11px] uppercase tracking-[0.16em] text-ink hover:text-primary"
        >
          Email me this routine (optional)
        </button>
      ) : (
        <div className="grid gap-3">
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            We'll send this routine to your inbox so you have it when you're shopping.
          </p>
          <label className="grid gap-1 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            First name (optional)
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="min-h-11 border border-border bg-paper px-3 text-[15px] normal-case tracking-normal text-ink outline-none focus:border-primary"
            />
          </label>
          <label className="grid gap-1 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            Email
            <input
              type="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="min-h-11 border border-border bg-paper px-3 text-[15px] normal-case tracking-normal text-ink outline-none focus:border-primary"
            />
          </label>
          <label className="flex items-start gap-2.5 text-[12.5px] leading-relaxed text-muted-foreground">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 h-4 w-4 accent-[var(--color-ink)]"
            />
            Yes, email me my routine and occasional Skin Grocer updates.
          </label>
          <button
            onClick={save}
            disabled={busy || !consent || !email.trim()}
            className="min-h-11 bg-ink text-[10px] uppercase tracking-[0.18em] text-paper hover:bg-primary disabled:bg-border disabled:text-muted-foreground"
          >
            {busy ? "Saving…" : "Send it to me"}
          </button>
        </div>
      )}
    </div>
  );
}

function FollowUp({ outcome }: { outcome: ConsultationOutcome }) {
  const [thread, setThread] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const threadEnd = useRef<HTMLDivElement>(null);

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
        data: {
          profile: outcome.profile.join(" "),
          routine: outcome.items.map((i) => `${i.step}: ${i.product.brand} ${i.product.name}`),
          history: thread,
          question: q,
        },
      });
      setThread((t) => [...t, { role: "assistant", content: reply }]);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "That didn't send. Try again?");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-9 border-t border-border pt-7">
      <h2 className="font-display text-[1.3rem] text-ink">Anything you'd like to ask?</h2>
      <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
        Ask about the order of steps, how to introduce something slowly, or why we picked a product.
      </p>

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
        <label className="sr-only" htmlFor="consult-followup">
          Ask a follow-up question
        </label>
        <input
          id="consult-followup"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") ask();
          }}
          placeholder="Ask a follow-up…"
          className="min-h-12 flex-1 border border-border bg-cream px-4 text-[15px] text-ink outline-none placeholder:text-muted-foreground/70 focus:border-primary"
        />
        <button
          onClick={ask}
          disabled={busy || !question.trim()}
          className="min-h-12 bg-ink px-5 text-[10px] font-medium uppercase tracking-[0.18em] text-paper hover:bg-primary disabled:bg-border disabled:text-muted-foreground"
        >
          Ask
        </button>
      </div>
    </div>
  );
}
