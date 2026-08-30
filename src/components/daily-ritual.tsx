import { useId, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { trackUi } from "@/lib/analytics";

/**
 * Homepage "The Daily Ritual" section: educates beginners that a useful
 * routine is simple and flexible, with an accessible AM/PM tab guide.
 * Guidance-first — no product sales actions in this section.
 *
 * The editorial visual is a code-native "day-to-night routine shelf" built
 * from three genuine catalogue packshots (transparent cutouts, unaltered).
 * It is an example base routine — not a personalised recommendation.
 */

import cleanserCutout from "@/assets/daily-ritual/roundlab-dokdo-cleanser.webp";
import serumCutout from "@/assets/daily-ritual/torriden-dive-in-serum.webp";
import creamCutout from "@/assets/daily-ritual/aestura-atobarrier365-cream.webp";

/**
 * Genuine catalogue packshots (alpha-trimmed presentation crops only —
 * packaging, labels and colours are untouched).
 */
const SHELF_AM = { src: cleanserCutout, name: "ROUND LAB 1025 Dokdo Cleanser", role: "Cleanse" };
const SHELF_PM = [
  { src: serumCutout, name: "TORRIDEN Dive In Serum", role: "Hydrate — Optional" },
  { src: creamCutout, name: "AESTURA Atobarrier365 Cream", role: "Moisturise" },
];

function RoutineShelfVisual() {
  return (
    <figure>
      <div
        role="img"
        aria-label="Example three-product base routine showing a ROUND LAB cleanser, TORRIDEN hydrating serum and AESTURA moisturiser arranged from morning to evening."
        className="relative grid grid-cols-2 overflow-hidden rounded-2xl border border-foreground/10"
      >
        {/* Morning — warm ivory, pale golden light */}
        <div
          aria-hidden="true"
          className="relative flex min-h-[320px] flex-col bg-sand p-5 pb-0 md:min-h-[460px] md:p-6 md:pb-0"
          style={{
            backgroundImage:
              "linear-gradient(155deg, rgba(255,251,240,0.92), rgba(232,215,180,0.5) 70%, rgba(214,190,150,0.6)), radial-gradient(ellipse at 20% 0%, rgba(255,244,214,0.85), transparent 60%)",
          }}
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-ink/60">AM</span>
          <div className="flex flex-1 items-end justify-center">
            <img
              src={SHELF_AM.src}
              alt=""
              width={310}
              height={658}
              loading="lazy"
              decoding="async"
              className="h-52 object-contain drop-shadow-[0_20px_22px_rgba(60,45,20,0.16)] md:h-72"
            />
          </div>
          <div className="border-t border-clay/60 py-3 text-center">
            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-ink/70">
              {SHELF_AM.role}
            </p>
          </div>
        </div>

        {/* Evening — deeper navy, restrained warm highlight */}
        <div
          aria-hidden="true"
          className="relative flex min-h-[320px] flex-col bg-ink p-5 pb-0 md:min-h-[460px] md:p-6 md:pb-0"
          style={{
            backgroundImage:
              "linear-gradient(205deg, rgba(20,26,44,0.35), rgba(10,14,26,0.85) 75%), radial-gradient(ellipse at 85% 8%, rgba(214,178,110,0.2), transparent 55%)",
          }}
        >
          <span className="self-end text-[10px] font-semibold uppercase tracking-[0.28em] text-paper/60">PM</span>
          <div className="flex flex-1 items-end justify-center gap-4">
            {SHELF_PM.map((p) => (
              <img
                key={p.src}
                src={p.src}
                alt=""
                width={300}
                height={658}
                loading="lazy"
                decoding="async"
                className="h-44 object-contain drop-shadow-[0_20px_22px_rgba(0,0,0,0.45)] md:h-60"
              />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 border-t border-clay/50 py-3 text-center">
            {SHELF_PM.map((p) => (
              <p key={p.role} className="text-[9px] font-semibold uppercase tracking-[0.18em] text-paper/70">
                {p.role}
              </p>
            ))}
          </div>
        </div>

        {/* Warm-gold connecting line: Cleanse → Hydrate — Optional → Moisturise */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-6 bottom-[52px] flex items-center"
        >
          <span className="text-[10px] text-clay">→</span>
          <span className="mx-1.5 h-px flex-1 bg-clay/70" />
          <span className="text-[10px] text-clay">→</span>
          <span className="mx-1.5 h-px flex-1 bg-clay/60" />
          <span className="text-[10px] text-clay">→</span>
        </div>
      </div>

      <figcaption className="mt-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-ink/70">
          A simple base routine
        </p>
        <p className="mt-1.5 text-xs italic text-ink/60">
          Three clear roles. Add only what your skin needs.
        </p>
        <p className="mt-2 text-xs leading-relaxed text-ink/55">
          Example routine only. Product suitability varies by individual.
        </p>
      </figcaption>
    </figure>
  );
}

type RoutineStep = {
  num: string;
  title: string;
  copy: string;
  label?: string;
  note?: string;
};

type RoutineTab = {
  id: "morning" | "evening";
  label: string;
  intro: string;
  steps: RoutineStep[];
};

const TABS: RoutineTab[] = [
  {
    id: "morning",
    label: "MORNING",
    intro:
      "Your morning routine prepares your skin for the day. Not every person needs every step.",
    steps: [
      {
        num: "01",
        title: "Cleanse or rinse",
        copy: "Use a gentle cleanser if your skin needs it, or rinse with water if that feels more comfortable.",
        label: "As needed",
      },
      {
        num: "02",
        title: "Hydrate or target",
        copy: "An optional toner, essence or serum can support a specific routine goal. It is not compulsory.",
        label: "Optional",
      },
      {
        num: "03",
        title: "Moisturise",
        copy: "Use a moisturiser when your skin needs additional comfort or moisture support.",
        label: "As needed",
      },
      {
        num: "04",
        title: "Protect",
        copy: "Finish with appropriate sun protection suitable for lawful Australian supply and follow its labelled directions.",
        label: "Important morning step",
      },
    ],
  },
  {
    id: "evening",
    label: "EVENING",
    intro:
      "Your evening routine removes the day and supports a comfortable moisture routine overnight.",
    steps: [
      {
        num: "01",
        title: "Cleanse",
        copy: "Remove makeup, sunscreen and daily buildup using a cleanser appropriate for what you wore that day.",
        note: "Double cleansing is optional—not a requirement for everyone.",
      },
      {
        num: "02",
        title: "Hydrate or target",
        copy: "Use one relevant toner, essence or serum if it has a clear role in your routine.",
        label: "Optional",
      },
      {
        num: "03",
        title: "Moisturise",
        copy: "Finish with a moisturiser suited to your preferred texture and level of comfort.",
        label: "Core support step",
      },
    ],
  },
];

function StepRow({ step }: { step: RoutineStep }) {
  return (
    <li className="grid grid-cols-[auto_1fr] gap-x-5 border-t border-foreground/12 py-5 first:border-t-0 first:pt-0 last:pb-0">
      <span className="pt-0.5 font-display text-base italic leading-none text-clay">
        {step.num}
      </span>
      <div>
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h4 className="text-[13px] font-semibold uppercase tracking-[0.18em] text-ink">
            {step.title}
          </h4>
          {step.label && (
            <span className="rounded-full border border-foreground/25 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-ink/70">
              {step.label}
            </span>
          )}
        </div>
        <p className="mt-2 text-sm leading-relaxed text-ink/75">{step.copy}</p>
        {step.note && (
          <p className="mt-2 text-xs italic leading-relaxed text-ink/60">{step.note}</p>
        )}
      </div>
    </li>
  );
}

export function DailyRitualSection() {
  const [active, setActive] = useState<RoutineTab["id"]>("morning");
  const uid = useId();
  const tablistRef = useRef<HTMLDivElement>(null);

  const activate = (id: RoutineTab["id"]) => {
    setActive(id);
    trackUi("daily_ritual_tab_select", { tab: id });
  };

  const focusTab = (index: number) => {
    const buttons = tablistRef.current?.querySelectorAll<HTMLButtonElement>("[role='tab']");
    buttons?.[index]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = -1;
    if (e.key === "ArrowRight") nextIndex = (index + 1) % TABS.length;
    else if (e.key === "ArrowLeft") nextIndex = (index - 1 + TABS.length) % TABS.length;
    else if (e.key === "Home") nextIndex = 0;
    else if (e.key === "End") nextIndex = TABS.length - 1;
    if (nextIndex === -1) return;
    e.preventDefault();
    activate(TABS[nextIndex]!.id);
    focusTab(nextIndex);
  };

  return (
    <section className="bg-paper" aria-labelledby="daily-ritual-heading">
      <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-x-14 lg:gap-y-0">
          {/* Heading + introduction */}
          <div className="order-1 lg:order-none lg:col-start-6 lg:col-span-7 lg:row-start-1">
            <p className="eyebrow eyebrow-rule text-clay">THE DAILY RITUAL</p>
            <h2
              id="daily-ritual-heading"
              className="display-section mt-4 text-ink"
            >
              A routine should support your day—not take it over.
            </h2>
            <p className="mt-5 max-w-xl leading-relaxed text-ink/75">
              Korean skincare does not need to mean ten steps. Begin with the
              essentials, add only what has a clear role, and introduce one new
              product at a time.
            </p>

            <ul className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 border-y border-foreground/12 py-4">
              {["Start with the essentials", "One new product at a time", "Adjust for your skin"].map(
                (p, i) => (
                  <li key={p} className="flex items-center gap-3">
                    {i > 0 && (
                      <span aria-hidden="true" className="text-clay">
                        ·
                      </span>
                    )}
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/70">
                      {p}
                    </span>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Product-led editorial visual — ~45% desktop */}
          <div className="order-2 lg:order-none lg:col-start-1 lg:col-span-5 lg:row-start-1 lg:row-span-3">
            <RoutineShelfVisual />
          </div>

          {/* AM/PM interactive guide */}
          <div className="order-3 lg:order-none lg:col-start-6 lg:col-span-7 lg:row-start-2 lg:mt-12">
            <div>
              <div
                ref={tablistRef}
                role="tablist"
                aria-label="Morning and evening routine guide"
                className="flex gap-2"
              >
                {TABS.map((tab, index) => {
                  const selected = tab.id === active;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      id={`${uid}-tab-${tab.id}`}
                      aria-selected={selected}
                      aria-controls={`${uid}-panel-${tab.id}`}
                      tabIndex={selected ? 0 : -1}
                      onClick={() => activate(tab.id)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className={`rounded-full border px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pop motion-reduce:transition-none ${
                        selected
                          ? "border-ink bg-ink text-paper"
                          : "border-foreground/25 bg-paper text-ink hover:border-foreground/50"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {TABS.map((tab) => (
                <div
                  key={tab.id}
                  role="tabpanel"
                  id={`${uid}-panel-${tab.id}`}
                  aria-labelledby={`${uid}-tab-${tab.id}`}
                  hidden={tab.id !== active}
                  className="mt-7"
                >
                  <p className="max-w-xl text-sm leading-relaxed text-ink/70">{tab.intro}</p>
                  <ol className="mt-6">
                    {tab.steps.map((s) => (
                      <StepRow key={s.num} step={s} />
                    ))}
                  </ol>
                </div>
              ))}

              <div className="mt-8 rounded-xl bg-sand/50 p-5">
                <p className="text-xs leading-relaxed text-ink/70">
                  You do not need to use every category shown. Introduce products gradually,
                  patch-test where appropriate and stop using a product if significant irritation
                  develops.
                </p>
                <p className="mt-2 text-xs leading-relaxed text-ink/60">
                  Cosmetic guidance only—not medical advice or diagnosis.
                </p>
              </div>
            </div>
          </div>

          {/* Calls to action */}
          <div className="order-4 lg:order-none lg:col-start-6 lg:col-span-7 lg:row-start-3">
            <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8 lg:mt-12">
              <Link
                to="/consultation"
                onClick={() => trackUi("daily_ritual_consultation_click", {})}
                className="inline-flex items-center justify-center rounded-full bg-pop px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-pop-foreground hover:opacity-90"
              >
                Build my starting routine →
              </Link>
              <Link
                to="/routines"
                onClick={() => trackUi("daily_ritual_layering_click", {})}
                className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink underline underline-offset-4 hover:text-clay"
              >
                Learn how to layer a routine →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
