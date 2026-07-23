import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useBuyNow } from "@/hooks/use-buy-now";
import maskMedihealSheet from "@/assets/mask-mediheal-sheet.jpg";
import maskDynastyCream from "@/assets/mask-dynasty-cream.jpg";
import maskNumbuzinEye from "@/assets/mask-numbuzin-eye.jpg";
import maskSomeByMiClay from "@/assets/mask-somebymi-clay.jpg";
import maskAbibSleeping from "@/assets/mask-abib-sleeping.jpg";
import maskAnuaHeartleaf from "@/assets/mask-anua-heartleaf.jpg";
import maskSkin1004Centella from "@/assets/mask-skin1004-centella.jpg";
import productSnail from "@/assets/product-snail-essence.jpg";
import productCentellaToner from "@/assets/product-centella-toner.jpg";
import productVitC from "@/assets/product-vitc-serum.jpg";
import productRice from "@/assets/product-rice-cleanser.jpg";
import productReliefSun from "@/assets/product-relief-sun.jpg";
import productCicaCream from "@/assets/product-cica-cream.jpg";
import productHeartleaf from "@/assets/product-heartleaf-ampoule.jpg";

export const Route = createFileRoute("/consultation")({
  head: () => ({
    meta: [
      { title: "Routine Consultation — Skin Grocer" },
      {
        name: "description",
        content:
          "A 2-minute Korean skincare consultation tuned to your Australian climate, skin type, and concerns. Get a personalised routine built by Skin Grocer.",
      },
      { property: "og:title", content: "Routine Consultation — Skin Grocer" },
      {
        property: "og:description",
        content:
          "Most skincare advice is built for someone else's climate. Answer 8 quick questions for a routine matched to where you live in Australia.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/consultation" }],
  }),
  component: ConsultationPage,
});

// ---------- Reference data (ported from consultation source) ----------

type ZoneKey = "tropical" | "dry" | "coastal" | "cool";

const STATES: { code: string; name: string; capital: string; zone: ZoneKey }[] = [
  { code: "nsw", name: "New South Wales", capital: "Sydney", zone: "coastal" },
  { code: "vic", name: "Victoria", capital: "Melbourne", zone: "cool" },
  { code: "qld", name: "Queensland", capital: "Brisbane", zone: "coastal" },
  { code: "wa", name: "Western Australia", capital: "Perth", zone: "dry" },
  { code: "sa", name: "South Australia", capital: "Adelaide", zone: "dry" },
  { code: "tas", name: "Tasmania", capital: "Hobart", zone: "cool" },
  { code: "act", name: "Australian Capital Territory", capital: "Canberra", zone: "cool" },
  { code: "nt", name: "Northern Territory", capital: "Darwin", zone: "tropical" },
];

const ZONES: Record<ZoneKey, { label: string; profile: string; texture: string; spf: string }> = {
  tropical: {
    label: "Tropical North",
    profile:
      "Heat and humidity stay high year-round. Skin tends to run oilier, congestion and sweat-triggered breakouts are common, and SPF needs frequent reapplication to hold up through the day.",
    texture: "lightweight, gel-based, non-comedogenic",
    spf: "a fluid, matte-finish SPF you won't mind reapplying",
  },
  dry: {
    label: "Dry Interior & West",
    profile:
      "Low humidity, strong dry heat, and wide day-to-night temperature swings pull moisture out of skin fast. Barrier support and humectants matter more here than almost anywhere else in the country.",
    texture: "richer, humectant- and ceramide-heavy",
    spf: "a hydrating SPF that won't add to the tightness",
  },
  coastal: {
    label: "Temperate East Coast",
    profile:
      "Strong, consistent UV with moderate humidity most of the year. A steady routine with genuine antioxidant protection does more here than any single hero product.",
    texture: "balanced, lightweight-to-medium",
    spf: "a daily broad-spectrum SPF with added antioxidants",
  },
  cool: {
    label: "Cool South",
    profile:
      "Real seasons. Winters run dry and cold enough to trigger flaking and sensitivity, even though the UV index stays higher than most people expect for the latitude.",
    texture: "richer in winter, lighter in summer",
    spf: "SPF every day, even in a Melbourne or Hobart winter",
  },
};

const AGE_BANDS: Record<string, string> = {
  teens: "Under 20",
  twenties: "20s",
  thirties: "30s",
  forties: "40s",
  fiftyplus: "50+",
};

const SKIN_TYPES: Record<string, { title: string; hint: string }> = {
  oily: { title: "Oily", hint: "Skin feels slick or looks shiny shortly after cleansing, often with visible pores or regular breakouts" },
  dry: { title: "Dry", hint: "Skin feels tight shortly after washing, may flake or show dry patches, with few breakouts" },
  combo: { title: "Combination", hint: "Oily through the T-zone, but balanced or dry at the cheeks" },
  normal: { title: "Normal", hint: "Rarely feels tight or greasy, breakouts are infrequent, texture is generally even" },
  sensitive: { title: "Sensitive / reactive", hint: "Prone to redness, stinging, or bumps, especially with new products or weather changes" },
};

const CONCERNS: Record<string, { title: string; hint: string; active: string }> = {
  dehydration: { title: "Dehydration & tightness", hint: "Skin feels tight or rough within hours of moisturising", active: "hyaluronic acid + ceramides" },
  breakouts: { title: "Breakouts & congestion", hint: "Regular blackheads, whiteheads, or inflamed spots", active: "centella + gentle BHA" },
  dullness: { title: "Dullness & uneven tone", hint: "Skin looks flat or tired even when well-rested", active: "propolis + niacinamide" },
  aging: { title: "Fine lines & firmness", hint: "Early lines, or skin that's begun to lose bounce", active: "collagen + peptides" },
  redness: { title: "Redness & sensitivity", hint: "Flushing, stinging, or visible redness that flares easily", active: "heartleaf + centella" },
  sundamage: { title: "Sun damage & pigmentation", hint: "Dark spots, patchiness, or visible sun-related ageing", active: "niacinamide + rice + probiotics" },
};

const SECONDARY: Record<string, string> = {
  texture: "Rough or uneven texture",
  pores: "Enlarged pores",
  darkcircles: "Dark circles / puffiness",
  dryness_patch: "Dry, flaky patches",
  oil_control: "Midday shine / oil breakthrough",
  barrier: "A compromised, easily-irritated barrier",
};

const SENSITIVITY: Record<string, { title: string; hint: string }> = {
  none: { title: "Rarely reacts", hint: "New products almost never cause irritation" },
  mild: { title: "Occasionally reactive", hint: "Fragrance or strong actives sometimes cause redness" },
  high: { title: "Reacts easily", hint: "New products often cause stinging, redness, or breakouts" },
};

const EXPOSURE: Record<string, { title: string; hint: string }> = {
  outdoor: { title: "Mostly outdoors", hint: "Work, commute, or lifestyle keeps you in direct sun most days" },
  mixed: { title: "A mix of both", hint: "Some outdoor time, but mostly indoors on weekdays" },
  indoor: { title: "Mostly indoors", hint: "Air-conditioned office or home for most of the day" },
};

const DEPTHS: Record<string, { title: string; hint: string; steps: number }> = {
  minimal: { title: "Minimal", hint: "3 steps — cleanse, treat, protect", steps: 3 },
  moderate: { title: "Moderate", hint: "5 steps — the everyday ritual", steps: 5 },
  full: { title: "Full Ritual", hint: "7 steps — the complete K-beauty layer-up", steps: 7 },
};

type StepKey = "cleanse" | "tone" | "treat" | "essence" | "moisturise" | "mask" | "protect";

type Product = {
  id: string;
  name: string;
  step: StepKey;
  skinTypes: string[];
  concerns: string[];
  zones: (ZoneKey | "any")[];
  sensitiveOk: boolean;
};

const PRODUCTS: Product[] = [
  { id: "anua-heartleaf-oil", name: "Anua Heartleaf Pore Control Cleansing Oil", step: "cleanse", skinTypes: ["any"], concerns: ["redness", "breakouts"], zones: ["any"], sensitiveOk: true },
  { id: "cosrx-ahabha-toner", name: "COSRX AHA/BHA Clarifying Treatment Toner", step: "tone", skinTypes: ["oily", "combo", "normal"], concerns: ["breakouts", "dullness"], zones: ["tropical", "coastal"], sensitiveOk: false },
  { id: "torriden-dive-in", name: "Torriden DIVE-IN Low Molecular Hyaluronic Acid Serum", step: "treat", skinTypes: ["dry", "normal", "combo", "sensitive"], concerns: ["dehydration"], zones: ["dry", "cool"], sensitiveOk: true },
  { id: "beautyofjoseon-glowserum", name: "Beauty of Joseon Glow Serum: Propolis + Niacinamide", step: "treat", skinTypes: ["any"], concerns: ["dullness", "sundamage"], zones: ["any"], sensitiveOk: true },
  { id: "biodance-collagen-mask", name: "BIODANCE Bio-Collagen Real Deep Mask", step: "mask", skinTypes: ["any"], concerns: ["aging", "dehydration"], zones: ["any"], sensitiveOk: true },
  { id: "beautyofjoseon-reliefsun", name: "Beauty of Joseon Relief Sun: Rice + Probiotics SPF50+", step: "protect", skinTypes: ["any"], concerns: ["sundamage", "any"], zones: ["any"], sensitiveOk: true },
];

type Answers = {
  state: string | null;
  age: string | null;
  skin: string | null;
  concern: string | null;
  secondary: string[];
  sensitivity: string | null;
  exposure: string | null;
  depth: string | null;
};

const EMPTY_ANSWERS: Answers = {
  state: null, age: null, skin: null, concern: null, secondary: [], sensitivity: null, exposure: null, depth: null,
};

function bestProductFor(stepKey: StepKey, answers: Answers): Product | null {
  const candidates = PRODUCTS.filter((p) => p.step === stepKey);
  if (!candidates.length) return null;
  let best: Product | null = null;
  let bestScore = -1;
  const zoneKey = STATES.find((s) => s.code === answers.state)?.zone;
  candidates.forEach((p) => {
    let score = 0;
    if (p.skinTypes.includes("any") || (answers.skin && p.skinTypes.includes(answers.skin))) score += 1;
    if (p.concerns.includes("any") || (answers.concern && p.concerns.includes(answers.concern))) score += 2;
    if (zoneKey && (p.zones.includes("any") || p.zones.includes(zoneKey))) score += 1;
    if (answers.sensitivity === "high" && !p.sensitiveOk) score -= 5;
    if (score > bestScore) { bestScore = score; best = p; }
  });
  return bestScore > 0 ? best : null;
}

const STEP_ORDER = ["intro", "state", "age", "skin", "concern", "secondary", "sensitivity", "exposure", "depth", "result"] as const;
type Phase = (typeof STEP_ORDER)[number];

function ConsultationPage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [answers, setAnswers] = useState<Answers>(EMPTY_ANSWERS);

  const idx = STEP_ORDER.indexOf(phase);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [phase]);

  const go = (delta: number) => setPhase(STEP_ORDER[Math.max(0, Math.min(STEP_ORDER.length - 1, idx + delta))]);
  const restart = () => { setAnswers(EMPTY_ANSWERS); setPhase("intro"); };

  return (
    <div className="min-h-screen bg-cream py-10 md:py-16">
      <div className="mx-auto max-w-2xl px-4">
        <div className="text-center">
          <p className="font-display text-lg tracking-[0.18em] text-ink">SKIN GROCER</p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">Routine Consultation</p>
        </div>

        <div className="mt-8 overflow-hidden border border-border bg-paper shadow-[0_22px_44px_-24px_rgba(43,38,32,0.35)]">
          {phase === "intro" && <Intro onStart={() => setPhase("state")} />}
          {phase === "state" && (
            <StepCard stepIndex={0} eyebrow="Step 1 of 8" question="Where in Australia are you based?"
              hint="We'll use this to account for local UV intensity, humidity, and seasonal shifts in your routine."
              onBack={null} onNext={answers.state ? () => go(1) : null}>
              <OptionList
                options={STATES.map((s) => ({ value: s.code, title: s.capital, hint: s.name }))}
                value={answers.state} onChange={(v) => setAnswers((a) => ({ ...a, state: v }))}
              />
            </StepCard>
          )}
          {phase === "age" && (
            <StepCard stepIndex={1} eyebrow="Step 2 of 8" question="What's your age range?"
              hint="This helps calibrate how much emphasis to put on prevention versus repair."
              onBack={() => go(-1)} onNext={answers.age ? () => go(1) : null}>
              <OptionList
                options={Object.entries(AGE_BANDS).map(([k, v]) => ({ value: k, title: v }))}
                value={answers.age} onChange={(v) => setAnswers((a) => ({ ...a, age: v }))}
              />
            </StepCard>
          )}
          {phase === "skin" && (
            <StepCard stepIndex={2} eyebrow="Step 3 of 8" question="How would you describe your skin type?"
              onBack={() => go(-1)} onNext={answers.skin ? () => go(1) : null}>
              <OptionList
                options={Object.entries(SKIN_TYPES).map(([k, v]) => ({ value: k, title: v.title, hint: v.hint }))}
                value={answers.skin} onChange={(v) => setAnswers((a) => ({ ...a, skin: v }))}
              />
            </StepCard>
          )}
          {phase === "concern" && (
            <StepCard stepIndex={3} eyebrow="Step 4 of 8" question="What's the one concern you'd most like this routine to address?"
              onBack={() => go(-1)} onNext={answers.concern ? () => go(1) : null}>
              <OptionList
                options={Object.entries(CONCERNS).map(([k, v]) => ({ value: k, title: v.title, hint: v.hint }))}
                value={answers.concern} onChange={(v) => setAnswers((a) => ({ ...a, concern: v }))}
              />
            </StepCard>
          )}
          {phase === "secondary" && (
            <StepCard stepIndex={4} eyebrow="Step 5 of 8" question="Anything else you've noticed?"
              hint="Select all that apply — optional, but it sharpens the recommendation."
              onBack={() => go(-1)} onNext={() => go(1)}>
              <OptionList multi
                options={Object.entries(SECONDARY).map(([k, v]) => ({ value: k, title: v }))}
                value={answers.secondary}
                onToggle={(v) => setAnswers((a) => ({ ...a, secondary: a.secondary.includes(v) ? a.secondary.filter((x) => x !== v) : [...a.secondary, v] }))}
              />
            </StepCard>
          )}
          {phase === "sensitivity" && (
            <StepCard stepIndex={5} eyebrow="Step 6 of 8" question="How does your skin usually handle new products?"
              onBack={() => go(-1)} onNext={answers.sensitivity ? () => go(1) : null}>
              <OptionList
                options={Object.entries(SENSITIVITY).map(([k, v]) => ({ value: k, title: v.title, hint: v.hint }))}
                value={answers.sensitivity} onChange={(v) => setAnswers((a) => ({ ...a, sensitivity: v }))}
              />
            </StepCard>
          )}
          {phase === "exposure" && (
            <StepCard stepIndex={6} eyebrow="Step 7 of 8" question="How much direct sun does your day-to-day involve?"
              onBack={() => go(-1)} onNext={answers.exposure ? () => go(1) : null}>
              <OptionList
                options={Object.entries(EXPOSURE).map(([k, v]) => ({ value: k, title: v.title, hint: v.hint }))}
                value={answers.exposure} onChange={(v) => setAnswers((a) => ({ ...a, exposure: v }))}
              />
            </StepCard>
          )}
          {phase === "depth" && (
            <StepCard stepIndex={7} eyebrow="Step 8 of 8" question="How much routine do you actually want to commit to?"
              onBack={() => go(-1)} onNext={answers.depth ? () => go(1) : null}>
              <OptionList
                options={Object.entries(DEPTHS).map(([k, v]) => ({ value: k, title: v.title, hint: v.hint }))}
                value={answers.depth} onChange={(v) => setAnswers((a) => ({ ...a, depth: v }))}
              />
            </StepCard>
          )}
          {phase === "result" && <Result answers={answers} onRestart={restart} />}
        </div>

        <p className="mt-6 text-center text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Guidance only — not a substitute for a dermatologist
        </p>
      </div>
    </div>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className="p-8 md:p-10">
      <p className="text-[10px] uppercase tracking-[0.22em] text-primary">A Skin Grocer Consultation</p>
      <h1 className="mt-3 font-display text-3xl leading-tight text-ink md:text-4xl">
        Let's build a routine around your skin — and your climate.
      </h1>
      <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
        Most routine advice is written for someone else's weather. This consultation factors in where
        you live in Australia alongside your skin type, sensitivity, and concerns, then matches you
        to Korean formulas suited to your conditions — not a generic global default.
      </p>
      <div className="mt-6 flex gap-8 text-xs uppercase tracking-[0.08em] text-muted-foreground">
        <div><span className="block font-display text-xl text-ink">8</span>questions</div>
        <div><span className="block font-display text-xl text-ink">~2</span>minutes</div>
        <div><span className="block font-display text-xl text-ink">1</span>routine, built for you</div>
      </div>
      <button
        onClick={onStart}
        className="mt-8 w-full bg-ink py-4 text-[11px] font-medium uppercase tracking-[0.18em] text-paper transition-colors hover:bg-primary"
      >
        Begin Consultation
      </button>
    </div>
  );
}

function Progress({ current, total }: { current: number; total: number }) {
  return (
    <div className="mb-6 flex gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-[3px] flex-1 ${i < current ? "bg-accent/50" : i === current ? "bg-primary" : "bg-border"}`}
        />
      ))}
    </div>
  );
}

function StepCard({ stepIndex, eyebrow, question, hint, children, onBack, onNext }: {
  stepIndex: number; eyebrow: string; question: string; hint?: string;
  children: React.ReactNode; onBack: (() => void) | null; onNext: (() => void) | null;
}) {
  return (
    <div className="p-7 md:p-9">
      <Progress current={stepIndex} total={8} />
      <p className="text-[10px] uppercase tracking-[0.22em] text-primary">{eyebrow}</p>
      <h2 className="mt-2 font-display text-2xl leading-tight text-ink">{question}</h2>
      {hint && <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{hint}</p>}
      <div className="mt-5">{children}</div>
      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={onBack ?? undefined}
          disabled={!onBack}
          className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground disabled:invisible hover:text-ink"
        >
          ← Back
        </button>
        <button
          onClick={onNext ?? undefined}
          disabled={!onNext}
          className="bg-ink px-6 py-3 text-[10px] font-medium uppercase tracking-[0.18em] text-paper transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:bg-border disabled:text-muted-foreground"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

type Option = { value: string; title: string; hint?: string };

function OptionList(props:
  | { options: Option[]; value: string | null; onChange: (v: string) => void; multi?: false; onToggle?: never }
  | { options: Option[]; value: string[]; onToggle: (v: string) => void; multi: true; onChange?: never }
) {
  const isSelected = (v: string) => props.multi ? props.value.includes(v) : props.value === v;
  const handle = (v: string) => props.multi ? props.onToggle(v) : props.onChange(v);
  return (
    <div className="flex flex-col gap-2">
      {props.options.map((o) => {
        const sel = isSelected(o.value);
        return (
          <button
            key={o.value}
            onClick={() => handle(o.value)}
            className={`flex items-start justify-between gap-3 border px-4 py-3 text-left text-sm transition-colors ${
              sel ? "border-primary bg-accent/25 text-ink" : "border-border bg-paper text-ink hover:border-primary/60"
            }`}
          >
            <span className="flex-1">
              <span className="block font-medium">{o.title}</span>
              {o.hint && <span className="mt-1 block text-xs text-muted-foreground">{o.hint}</span>}
            </span>
            <span className={`mt-0.5 text-primary transition-opacity ${sel ? "opacity-100" : "opacity-0"}`}>✓</span>
          </button>
        );
      })}
    </div>
  );
}

function Result({ answers, onRestart }: { answers: Answers; onRestart: () => void }) {
  const routine = useMemo(() => {
    const st = STATES.find((s) => s.code === answers.state)!;
    const zone = ZONES[st.zone];
    const concern = answers.concern ? CONCERNS[answers.concern] : null;
    const depthCount = answers.depth ? DEPTHS[answers.depth].steps : 5;
    const gentle = answers.sensitivity === "high";
    const all: { key: StepKey; name: string; desc: string; pick?: string }[] = [
      { key: "cleanse", name: "Cleanse", desc: `A ${gentle ? "fragrance-free, " : ""}${zone.texture} cleanser suited to ${zone.label.toLowerCase()} conditions${gentle ? ", low on stripping actives given how easily your skin reacts" : ""}.` },
      { key: "tone", name: "Tone / Prep", desc: "Rebalances skin and preps it to absorb what comes next." },
      { key: "treat", name: "Treat", desc: `Targets your main concern with ${concern?.active ?? "targeted actives"}${gentle ? ", introduced gradually to avoid irritation" : ""}.` },
      { key: "essence", name: "Essence / Booster", desc: `An extra hydration layer — especially useful given ${zone.label.toLowerCase()} conditions.` },
      { key: "moisturise", name: "Moisturise", desc: `A ${zone.texture} moisturiser to lock everything in.` },
      { key: "mask", name: "Eye Care / Mask", desc: "Weekly firming or brightening treatment for extra care." },
      { key: "protect", name: "Protect", desc: zone.spf + (answers.exposure === "outdoor" ? ", reapplied through the day given your sun exposure" : "") + "." },
    ];
    const trimmed = all.slice(0, depthCount);
    trimmed.forEach((s) => { const m = bestProductFor(s.key, answers); if (m) s.pick = m.name; });
    return { st, zone, trimmed };
  }, [answers]);

  const skinLabel = answers.skin ? SKIN_TYPES[answers.skin].title : "";
  const { st, zone, trimmed } = routine;

  return (
    <div className="p-7 md:p-9">
      <p className="text-[10px] uppercase tracking-[0.22em] text-primary">Your Routine</p>
      <h2 className="mt-2 font-display text-3xl leading-tight text-ink">
        {zone.label} · {skinLabel} Skin
      </h2>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {[
          `${st.capital}, ${st.name}`,
          `${skinLabel} skin`,
          answers.age ? AGE_BANDS[answers.age] : "",
          answers.sensitivity ? SENSITIVITY[answers.sensitivity].title : "",
        ].filter(Boolean).map((f) => (
          <span key={f} className="border border-border px-2.5 py-1 text-[10px] uppercase tracking-[0.05em] text-muted-foreground">{f}</span>
        ))}
      </div>

      <div className="mt-5 border-l-2 border-primary bg-cream px-4 py-3 text-xs leading-relaxed text-muted-foreground">
        <b className="text-ink">Why this routine:</b> {zone.profile}
        {answers.secondary.length > 0 && (
          <> We've also factored in {answers.secondary.map((k) => SECONDARY[k]).join(", ").toLowerCase()}.</>
        )}
      </div>

      <div className="mt-4">
        {trimmed.map((s, i) => (
          <div key={s.key} className="flex gap-4 border-b border-dashed border-border py-4 last:border-b-0">
            <div className="w-6 shrink-0 font-display text-lg italic text-primary">{i + 1}</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-ink">{s.name}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
              {s.pick && <p className="mt-1.5 text-xs text-primary">Try: {s.pick}</p>}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col items-center gap-3">
        <Link to="/shop" className="bg-ink px-8 py-3 text-[10px] font-medium uppercase tracking-[0.18em] text-paper hover:bg-primary">
          Shop the Routine
        </Link>
        <button onClick={onRestart} className="border border-border px-4 py-2 text-[10px] uppercase tracking-[0.14em] text-muted-foreground hover:border-ink hover:text-ink">
          Start over
        </button>
      </div>
    </div>
  );
}
