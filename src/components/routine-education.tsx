import { useId, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { trackUi } from "@/lib/analytics";
import sunProtection from "@/assets/learn/daily-sun-protection-melbourne.webp";

/**
 * Homepage routine education: three core steps, three clearly optional
 * additions, worked routine examples and a routine-finder call to action.
 * Educational only — no Add to Bag actions live in this section.
 */

type CoreStep = {
  num: string;
  title: string;
  purpose: string;
  note: string;
  img: string;
  alt: string;
  linkLabel: string;
  to: string;
  search?: { step: "cleanse" | "moisturise" };
};

const CORE_STEPS: CoreStep[] = [
  {
    num: "01",
    title: "Cleanse",
    purpose:
      "Remove sunscreen, makeup and the day’s buildup without leaving skin feeling unnecessarily stripped.",
    note: "A morning cleanse is optional. Double cleansing is most useful when removing makeup or water-resistant sunscreen.",
    img: "/products/beplain/mung-bean-cleansing-oil-200ml.webp",
    alt: "beplain Mung Bean Cleansing Oil 200ml bottle",
    linkLabel: "Explore cleansers",
    to: "/shop",
    search: { step: "cleanse" },
  },
  {
    num: "02",
    title: "Moisturise",
    purpose: "Support hydration and comfort with a texture that suits how your skin feels.",
    note: "Choose a lighter texture when rich creams feel heavy, or a richer cream when skin still feels tight.",
    img: "/products/aestura/atobarrier365-cream.webp",
    alt: "AESTURA Atobarrier365 Cream jar",
    linkLabel: "Explore moisturisers",
    to: "/shop",
    search: { step: "moisturise" },
  },
  {
    num: "03",
    title: "Protect",
    purpose:
      "During the day, finish with a broad-spectrum sunscreen lawfully supplied in Australia and follow its labelled directions.",
    note: "Sunscreen is regulated differently in Australia and Korea, so Skin Grocer links to Australian guidance rather than recommending an unverified product.",
    img: sunProtection,
    alt: "Woman wearing a wide-brimmed hat walking in morning sunlight — daily sun protection as a routine step",
    linkLabel: "Read Australian sunscreen guidance",
    to: "/learn/article/$slug",
  },
];

type OptionalStep = {
  label: string;
  title: string;
  purpose: string;
  linkLabel: string;
  category: "tone" | "treat" | "masks";
};

const OPTIONAL_STEPS: OptionalStep[] = [
  {
    label: "Optional · Hydrate & prepare",
    title: "Toner or Essence",
    purpose: "Add a lightweight hydration layer when your skin needs one. This step is optional.",
    linkLabel: "Explore toners & essences",
    category: "tone",
  },
  {
    label: "Optional · Target",
    title: "Serum or Treatment",
    purpose: "Choose one clearly defined cosmetic concern and introduce one targeted product at a time.",
    linkLabel: "Explore treatments",
    category: "treat",
  },
  {
    label: "Optional · Ritual",
    title: "Mask",
    purpose: "An occasional hydration, comfort or sensory step—not a requirement for an effective routine.",
    linkLabel: "Explore masks",
    category: "masks",
  },
];

const EXAMPLES: { id: string; label: string; steps: string[]; note?: string }[] = [
  {
    id: "morning",
    label: "3-MINUTE MORNING",
    steps: ["Gentle cleanse if needed", "Moisturiser", "Appropriate sun protection"],
  },
  {
    id: "evening",
    label: "SIMPLE EVENING",
    steps: ["Cleanse", "Moisturiser"],
    note: "Add a hydrating toner or serum only when it has a clear role.",
  },
  {
    id: "treatment",
    label: "OPTIONAL TREATMENT NIGHT",
    steps: ["Cleanse", "One targeted treatment", "Moisturiser"],
    note: "Use strong actives according to their directions. Introduce one new active at a time.",
  },
];

function CoreCard({ step }: { step: CoreStep }) {
  const inner = (
    <>
      <div className="flex items-baseline gap-3">
        <span className="font-display text-sm italic leading-none text-ink/60">{step.num}</span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-clay">Core step</span>
        <span className="h-px flex-1 bg-foreground/12" />
      </div>
      <div className="flex items-center justify-center py-5">
        <img
          src={step.img}
          alt={step.alt}
          width={480}
          height={320}
          loading="lazy"
          decoding="async"
          className="h-[160px] w-full object-contain"
        />
      </div>
      <h4 className="font-display text-2xl leading-tight text-ink">{step.title}</h4>
      <p className="mt-2 text-sm leading-relaxed text-ink/70">{step.purpose}</p>
      <p className="mt-3 text-xs leading-relaxed text-ink/60">{step.note}</p>
      <span className="mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink group-hover:text-clay">
        {step.linkLabel}
        <span aria-hidden="true" className="transition-transform duration-300 motion-reduce:transition-none group-hover:translate-x-1">→</span>
      </span>
    </>
  );

  const cls =
    "group flex h-full flex-col border border-foreground/15 bg-paper p-6 transition-colors hover:border-foreground/35 md:p-8";
  const onClick = () => trackUi("routine_core_step_click", { step: step.title });

  if (step.search) {
    return (
      <li>
        <Link to="/shop" search={step.search} className={cls} onClick={onClick}>
          {inner}
        </Link>
      </li>
    );
  }
  return (
    <li>
      <Link
        to="/learn/article/$slug"
        params={{ slug: "tga-vs-korean-sunscreen" }}
        className={cls}
        onClick={onClick}
      >
        {inner}
      </Link>
    </li>
  );
}

function OptionalCard({ step }: { step: OptionalStep }) {
  return (
    <li className="flex h-full flex-col border border-dashed border-foreground/25 bg-sand/30 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/60">{step.label}</p>
      <h4 className="mt-2 font-display text-lg text-ink">{step.title}</h4>
      <p className="mt-2 text-sm leading-relaxed text-ink/70">{step.purpose}</p>
            <Link
        to="/shop"
        search={{ step: step.category }}
        onClick={() => trackUi("routine_optional_step_click", { step: step.title })}
        className="mt-auto pt-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink underline underline-offset-4 hover:text-clay"
      >
        {step.linkLabel}
        <span aria-hidden="true">→</span>
      </Link>
    </li>
  );
}

function RoutineExamples() {
  const [active, setActive] = useState(EXAMPLES[0]!.id);
  const uid = useId();
  const tablistRef = useRef<HTMLDivElement>(null);

  const activate = (id: string) => {
    setActive(id);
    trackUi("routine_example_select", { example: id });
  };

  const focusTab = (index: number) => {
    const buttons = tablistRef.current?.querySelectorAll<HTMLButtonElement>("[role='tab']");
    buttons?.[index]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = -1;
    if (e.key === "ArrowRight") nextIndex = (index + 1) % EXAMPLES.length;
    else if (e.key === "ArrowLeft") nextIndex = (index - 1 + EXAMPLES.length) % EXAMPLES.length;
    else if (e.key === "Home") nextIndex = 0;
    else if (e.key === "End") nextIndex = EXAMPLES.length - 1;
    if (nextIndex === -1) return;
    e.preventDefault();
    activate(EXAMPLES[nextIndex]!.id);
    focusTab(nextIndex);
  };

  return (
    <div className="mt-12 border-t border-foreground/12 pt-8">
      <h3 className="font-display text-2xl text-ink">What this looks like in practice</h3>
      <div ref={tablistRef} role="tablist" aria-label="Routine examples" className="mt-5 flex flex-wrap gap-2">
        {EXAMPLES.map((ex, index) => {
          const selected = ex.id === active;
          return (
            <button
              key={ex.id}
              type="button"
              role="tab"
              id={`${uid}-tab-${ex.id}`}
              aria-selected={selected}
              aria-controls={`${uid}-panel-${ex.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => activate(ex.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pop ${
                selected
                  ? "border-ink bg-ink text-paper"
                  : "border-foreground/25 bg-paper text-ink hover:border-foreground/50"
              }`}
            >
              {ex.label}
            </button>
          );
        })}
      </div>
      {EXAMPLES.map((ex) => (
        <div
          key={ex.id}
          role="tabpanel"
          id={`${uid}-panel-${ex.id}`}
          aria-labelledby={`${uid}-tab-${ex.id}`}
          hidden={ex.id !== active}
          className="mt-6 border border-foreground/15 bg-paper p-6 md:p-8"
        >
          <ol className="space-y-3">
            {ex.steps.map((s, i) => (
              <li key={s} className="flex gap-3 text-sm text-ink/80">
                <span className="font-display text-xs italic text-ink/50">{String(i + 1).padStart(2, "0")}</span>
                {s}
              </li>
            ))}
          </ol>
          {ex.note && <p className="mt-4 text-xs leading-relaxed text-ink/60">{ex.note}</p>}
        </div>
      ))}
    </div>
  );
}

export function RoutineEducation() {
  const [showOptional, setShowOptional] = useState(false);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:py-20" aria-labelledby="routine-education-heading">
      <div className="max-w-2xl">
        <p className="eyebrow eyebrow-rule text-clay">A routine that fits real life</p>
        <h2 id="routine-education-heading" className="display-section mt-4 text-ink">
          Start with three. Add only with a reason.
        </h2>
        <p className="mt-5 text-ink/70">
          A useful routine does not need to fill a bathroom shelf. Begin with cleansing, moisturising
          and appropriate daytime sun protection. Add hydration, treatment or a mask only when you
          understand the role it will play.
        </p>
        <p className="mt-3 text-sm font-semibold text-ink">
          You do not need to buy every step shown here.
        </p>
      </div>

      <h3 className="mt-10 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink">
        Your core routine
      </h3>
      <ul className="mt-6 grid gap-6 md:grid-cols-3">
        {CORE_STEPS.map((s) => (
          <CoreCard key={s.num} step={s} />
        ))}
      </ul>

      <div className="mt-12 border-t border-foreground/12 pt-8">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/70">
          Optional additions
        </h3>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink/70">
          Add one optional step only when you can explain what it contributes to your routine.
          Introduce one new product at a time so you can better understand how your skin responds.
        </p>

        <button
          type="button"
          aria-expanded={showOptional}
          aria-controls="routine-optional-list"
          onClick={() => {
            setShowOptional((v) => !v);
            if (!showOptional) trackUi("routine_optional_expand", {});
          }}
          className="mt-6 inline-flex items-center gap-2 border border-foreground/25 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink md:hidden"
        >
          {showOptional ? "Hide optional additions" : "Show optional additions"}
        </button>

        <ul
          id="routine-optional-list"
          className={`mt-6 gap-5 md:grid md:grid-cols-3 ${showOptional ? "grid grid-cols-1" : "hidden md:grid"}`}
        >
          {OPTIONAL_STEPS.map((s) => (
            <OptionalCard key={s.title} step={s} />
          ))}
        </ul>
      </div>

      <RoutineExamples />

      <div className="mt-12 border border-foreground/20 bg-sand/60 p-7 md:p-10">
        <h3 className="font-display text-3xl text-ink">Not sure which steps you actually need?</h3>
        <p className="mt-4 max-w-2xl text-ink/75">
          Tell us what your skin feels like, what you already use and how much routine fits your
          life. We’ll suggest a starting point using products currently stocked in Melbourne.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-5">
          <Link
            to="/consultation"
            onClick={() => trackUi("routine_finder_cta_click", {})}
            className="inline-flex items-center justify-center rounded-full bg-pop px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-pop-foreground hover:opacity-90"
          >
            Build my starting routine
          </Link>
          <Link
            to="/shop"
            onClick={() => trackUi("routine_shop_all_click", {})}
            className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink underline underline-offset-4 hover:text-clay"
          >
            Shop all products →
          </Link>
        </div>
        <p className="mt-6 text-xs text-ink/60">Guidance only—not medical advice or a diagnosis.</p>
      </div>
    </section>
  );
}
