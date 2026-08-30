import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { SHOP_PRODUCTS, isPurchasable } from "@/lib/shop-catalog";
import { useBuyNow } from "@/hooks/use-buy-now";
import { useSoldOutSkus } from "@/hooks/use-stock";
import { trackUi } from "@/lib/analytics";

/* -------------------------------------------------------------------------
   Routine edits — three low-risk starting routines built from live catalog
   data. Prices, availability and imagery all resolve from SHOP_PRODUCTS, so
   nothing displayed here can drift from the real product records.
   ------------------------------------------------------------------------- */

type Slot = {
  priceId: string;
  role: string;
  why: string;
};

type Edit = {
  id: string;
  number: string;
  name: string;
  purpose: string;
  field: string; // ingredient-inspired colour field
  accent: string;
  core: Slot[];
  optional?: {
    priceId: string;
    label: string;
    role: string;
    why: string;
    caution?: string;
  };
  morning: string[];
  evening: string[];
  whyThree: string;
  cautions: string[];
};

/** Shown in place of an optional product when a routine deliberately has none. */
const BUILD_LATER = {
  heading: "Build later, if needed",
  body: "Start with the three-product core. Introduce additional products only after your skin has had time to adjust.",
};

const EDITS: Edit[] = [
  {
    id: "essential-hydration",
    number: "01",
    name: "The Essential Hydration Edit",
    purpose:
      "For skin that often feels tight, dehydrated or uncomfortable and needs a simple everyday starting point.",
    field: "bg-[#eef2f6]",
    accent: "text-hanbok-deep",
    core: [
      {
        priceId: "round_lab_1025_dokdo_cleanser_150ml_onetime",
        role: "Gentle cleanse",
        why: "Removes sunscreen and daily buildup without stripping the skin.",
      },
      {
        priceId: "torriden_dive_in_serum_onetime",
        role: "Lightweight hydration",
        why: "Adds a light hydrating step under moisturiser.",
      },
      {
        priceId: "aestura_atobarrier365_cream_onetime",
        role: "Moisturising support",
        why: "Helps reduce water loss and keeps the routine comfortable.",
      },
    ],
    optional: {
      priceId: "wellage_real_hyaluronic_toner_200ml_onetime",
      label: "Optional hydrating layer",
      role: "Extra hydrating layer",
      why: "A toner may add another hydrating layer, but the core routine can work without it.",
    },
    morning: ["Serum if wanted", "Moisturiser", "Appropriate sun protection"],
    evening: ["Cleanser", "Serum", "Moisturiser"],
    whyThree:
      "One cleanse, one hydrating step, one moisturiser. Three products cover the everyday basics without duplicating the same job twice.",
    cautions: [
      "Introduce one new product at a time, about a week apart.",
      "Patch-test on a small area of the inner forearm or jawline before full-face use.",
      "Cleanse once in the evening; twice daily only if it stays comfortable.",
      "Sun protection is part of any daytime routine and is bought separately.",
      "Stop use if persistent stinging, redness or itching occurs.",
    ],
  },
  {
    id: "tone-glow-support",
    number: "02",
    name: "The Tone + Glow Support Edit",
    purpose:
      "For customers who want to support hydration and improve the appearance of uneven-looking tone without building a long routine.",
    field: "bg-[#f6efe6]",
    accent: "text-clay",
    core: [
      {
        priceId: "torriden_balanceful_cleansing_gel_onetime",
        role: "Cleanse",
        why: "Removes sunscreen and daily buildup before the next steps.",
      },
      {
        priceId: "beauty_of_joseon_glow_serum_propolis_plus_niacinamide_30ml_onetime",
        role: "Targeted tone and hydration support",
        why: "Supports hydration and the appearance of uneven-looking tone in one step.",
      },
      {
        priceId: "torriden_dive_in_soothing_cream_onetime",
        role: "Moisturise",
        why: "Helps reduce water loss and keeps the routine comfortable.",
      },
    ],
    optional: {
      priceId: "biodance_bio_collagen_real_deep_mask_onetime",
      label: "Optional occasional mask",
      role: "Occasional hydrating mask",
      why: "A mask can be a pleasant occasional hydrating step, but the core routine works without it.",
    },
    morning: ["Serum if wanted", "Moisturiser", "Appropriate sun protection"],
    evening: ["Cleanser", "Serum", "Moisturiser"],
    whyThree:
      "Cleanse, one supportive serum, moisturise. The serum carries the tone-support role so nothing else needs to repeat it.",
    cautions: [
      "Introduce one new product at a time, about a week apart.",
      "Patch-test before full-face use, particularly if you react to bee-derived ingredients such as propolis.",
      "Niacinamide is usually well tolerated; reduce frequency if your skin feels warm or flushed.",
      "Avoid layering with strong exfoliants or retinoids in the same routine while you are settling in.",
      "Masks are occasional, not daily. Stop use if persistent irritation occurs.",
    ],
  },
  {
    id: "barrier-comfort",
    number: "03",
    name: "The Barrier-Comfort Edit",
    purpose:
      "A simple, active-free starting routine for skin that feels easily unsettled or overcomplicated.",
    field: "bg-[#eef2ec]",
    accent: "text-[#3f5c46]",
    core: [
      {
        priceId: "beplain_mung_bean_ph_balanced_cleansing_foam_80ml_onetime",
        role: "Gentle cleanse",
        why: "A low-fuss pH-balanced cleanse that removes the day without a stripped feeling.",
      },
      {
        priceId: "beplain_cicaful_ampoule_30ml_onetime",
        role: "Lightweight soothing support",
        why: "Adds a light soothing step without introducing an active.",
      },
      {
        priceId: "aestura_atobarrier365_cream_onetime",
        role: "Moisturising and barrier support",
        why: "Helps reduce water loss and keeps the routine comfortable.",
      },
    ],
    // No optional addition: the barrier-comfort core is deliberately active-free,
    // so no exfoliant is recommended beside it.
    morning: ["Ampoule if wanted", "Moisturiser", "Appropriate sun protection"],
    evening: ["Cleanser", "Ampoule", "Moisturiser"],
    whyThree:
      "Cleanse, soothe, moisturise — and nothing else. Fewer variables makes it easier to tell what your skin is responding to.",
    cautions: [
      "Introduce one new product at a time, about a week apart.",
      "Patch-test before full-face use.",
      "Keep the core routine active-free while your skin settles.",
      "Do not combine exfoliants and retinoids in the same routine.",
      "If discomfort persists, or skin is broken or painful, consider speaking with a pharmacist or doctor.",
    ],
  },
];

/* ------------------------------ data helpers ----------------------------- */

function priceOf(priceId: string): number {
  const p = SHOP_PRODUCTS.find((x) => x.priceId === priceId);
  return p ? Number(p.price.replace(/[^0-9.]/g, "")) || 0 : 0;
}

function productOf(priceId: string) {
  return SHOP_PRODUCTS.find((x) => x.priceId === priceId);
}

function money(v: number) {
  return `A$${v.toFixed(0)}`;
}

/* ------------------------------- card media ------------------------------ */

function CoreShelf({ edit }: { edit: Edit }) {
  return (
    <div className={`grid grid-cols-3 gap-px ${edit.field}`}>
      {edit.core.map((slot) => {
        const p = productOf(slot.priceId);
        if (!p) return null;
        return (
          <div key={slot.priceId} className="flex flex-col items-center justify-end px-2 pb-4 pt-6">
            <img
              src={p.image}
              alt={`${p.brand} ${p.name}`}
              loading="lazy"
              width={240}
              height={300}
              className="h-28 w-full object-contain mix-blend-multiply md:h-32"
            />
            <p className="mt-3 text-center text-[9px] font-semibold uppercase tracking-[0.14em] text-ink/55">
              {slot.role}
            </p>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------ detail dialog ---------------------------- */

function RoutineDialog({
  edit,
  onClose,
  returnFocusTo,
}: {
  edit: Edit;
  onClose: () => void;
  returnFocusTo: HTMLButtonElement | null;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const { buy } = useBuyNow();
  const { isSoldOut } = useSoldOutSkus();

  const available = (priceId: string) => isPurchasable(priceId) && !isSoldOut(priceId);

  const optionalId = edit.optional?.priceId;
  const [selected, setSelected] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    edit.core.forEach((s) => {
      initial[s.priceId] = available(s.priceId);
    });
    if (optionalId) initial[optionalId] = false;
    return initial;
  });
  // Guards against duplicate additions from rapid repeated clicking.
  const addingRef = useRef(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab") {
        // Simple focus trap: keep Tab / Shift+Tab inside the dialog panel.
        const panel = panelRef.current;
        if (!panel) return;
        const focusables = panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey && (active === first || !panel.contains(active))) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (active === last || !panel.contains(active))) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
      returnFocusTo?.focus();
    };
  }, [onClose, returnFocusTo]);

  const chosen = useMemo(
    () =>
      [...edit.core.map((s) => s.priceId), ...(optionalId ? [optionalId] : [])].filter(
        (id) => selected[id] && available(id),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selected, edit],
  );

  const total = chosen.reduce((sum, id) => sum + priceOf(id), 0);
  const unavailableCore = edit.core.filter((s) => !available(s.priceId));
  const coreComplete = unavailableCore.length === 0;

  function addSelected() {
    if (chosen.length === 0) return;
    let added = 0;
    chosen.forEach((id) => {
      const p = productOf(id);
      if (!p) return;
      buy({
        priceId: p.priceId,
        name: p.name,
        priceLabel: p.price,
        brand: p.brand,
        image: p.image,
      });
      added += 1;
    });
    if (added > 0) {
      trackUi("routine_edit_add_selected", { edit: edit.id, items: added });
      toast.success(`${added} product${added > 1 ? "s" : ""} added to your bag.`);
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-ink/80 p-4 backdrop-blur">
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`routine-dialog-${edit.id}`}
        className="my-8 w-full max-w-3xl bg-paper p-6 shadow-2xl outline-none md:p-8"
      >
        <div className="flex items-start justify-between gap-4 border-b border-border pb-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink/55">
              Edit {edit.number} · Review this routine
            </p>
            <h3 id={`routine-dialog-${edit.id}`} className="mt-2 font-display text-2xl text-ink md:text-3xl">
              {edit.name}
            </h3>
            <p className="mt-2 max-w-xl text-sm text-ink/70">{edit.purpose}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close routine details"
            className="min-h-11 min-w-11 shrink-0 border border-border px-3 text-sm text-ink/70 transition hover:bg-secondary"
          >
            ✕
          </button>
        </div>

        {!coreComplete && (
          <p className="mt-5 border border-clay/40 bg-clay/10 p-4 text-sm text-ink/80">
            {unavailableCore
              .map((s) => {
                const p = productOf(s.priceId);
                return p ? `${p.brand} ${p.name}` : s.priceId;
              })
              .join(", ")}{" "}
            is unavailable right now, so this routine can’t be added in full. You can still review the
            remaining products, or{" "}
            <Link to="/consultation" className="underline">
              build your own routine
            </Link>
            .
          </p>
        )}

        {/* Core products */}
        <div className="mt-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/60">
            Core routine — three products
          </p>
          <ul className="mt-3 divide-y divide-border border-y border-border">
            {edit.core.map((slot, i) => {
              const p = productOf(slot.priceId);
              if (!p) return null;
              const ok = available(slot.priceId);
              return (
                <li key={slot.priceId} className="flex items-start gap-4 py-4">
                  <img
                    src={p.image}
                    alt={`${p.brand} ${p.name}`}
                    loading="lazy"
                    width={120}
                    height={150}
                    className="h-20 w-16 shrink-0 object-contain mix-blend-multiply"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/50">
                      Step {i + 1} · {slot.role}
                    </p>
                    <p className="mt-1 text-sm font-medium text-ink">
                      {p.brand} {p.name}
                    </p>
                    <p className="mt-1 text-xs text-ink/65">
                      <span className="font-semibold uppercase tracking-[0.12em] text-ink/50">
                        Why it’s here:
                      </span>{" "}
                      {slot.why}
                    </p>
                    {!ok && (
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-clay">
                        Unavailable right now
                      </p>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm text-ink">{money(priceOf(slot.priceId))}</p>
                    <label className="mt-2 flex items-center justify-end gap-2 text-xs text-ink/70">
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={Boolean(selected[slot.priceId]) && ok}
                        disabled={!ok}
                        onChange={(e) =>
                          setSelected((s) => ({ ...s, [slot.priceId]: e.target.checked }))
                        }
                      />
                      Include
                    </label>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Optional addition */}
        {(() => {
          const p = productOf(edit.optional.priceId);
          if (!p) return null;
          const ok = available(edit.optional.priceId);
          return (
            <div className="mt-6 border border-dashed border-border bg-secondary/60 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/60">
                {edit.optional.label}
              </p>
              <div className="mt-3 flex items-start gap-4">
                <img
                  src={p.image}
                  alt={`${p.brand} ${p.name}`}
                  loading="lazy"
                  width={120}
                  height={150}
                  className="h-20 w-16 shrink-0 object-contain mix-blend-multiply"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink">
                    {p.brand} {p.name}
                  </p>
                  <p className="mt-1 text-xs text-ink/65">
                    <span className="font-semibold uppercase tracking-[0.12em] text-ink/50">
                      Why it’s optional:
                    </span>{" "}
                    {edit.optional.why}
                  </p>
                  {edit.optional.caution && (
                    <p className="mt-2 border-l-2 border-clay/50 pl-3 text-xs text-ink/70">
                      {edit.optional.caution}
                    </p>
                  )}
                  {!ok && (
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-clay">
                      Unavailable right now
                    </p>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm text-ink">{money(priceOf(edit.optional.priceId))}</p>
                  <label className="mt-2 flex items-center justify-end gap-2 text-xs text-ink/70">
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={Boolean(selected[edit.optional.priceId]) && ok}
                      disabled={!ok}
                      onChange={(e) =>
                        setSelected((s) => ({ ...s, [edit.optional.priceId]: e.target.checked }))
                      }
                    />
                    Add
                  </label>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Usage order */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="border border-border p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/60">Morning</p>
            <ol className="mt-2 space-y-1 text-sm text-ink/75">
              {edit.morning.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </div>
          <div className="border border-border p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/60">Evening</p>
            <ol className="mt-2 space-y-1 text-sm text-ink/75">
              {edit.evening.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </div>
        </div>

        {/* Safety */}
        <div className="mt-6 border-t border-border pt-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/60">
            Using this routine safely
          </p>
          <ul className="mt-3 space-y-1.5 text-sm text-ink/70">
            {edit.cautions.map((c) => (
              <li key={c} className="flex gap-2">
                <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink/40" />
                {c}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-ink/55">
            Cosmetic guidance only — not medical advice or a diagnosis. If a skin concern is painful,
            persistent or worsening, speak with a pharmacist, doctor or dermatologist.
          </p>
        </div>

        {/* Totals + actions */}
        <div className="sticky bottom-0 mt-6 flex flex-wrap items-center gap-4 border-t border-border bg-paper py-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/55">
              {chosen.length} product{chosen.length === 1 ? "" : "s"} selected
            </p>
            <p className="font-display text-2xl text-ink">{money(total)}</p>
          </div>
          <div className="ml-auto flex flex-wrap gap-3">
            <Link
              to="/consultation"
              className="inline-flex min-h-11 items-center border border-ink px-5 text-xs font-semibold uppercase tracking-[0.18em] text-ink transition hover:bg-secondary"
            >
              Build my own routine →
            </Link>
            <button
              type="button"
              onClick={addSelected}
              disabled={chosen.length === 0}
              className="inline-flex min-h-11 items-center bg-ink px-5 text-xs font-semibold uppercase tracking-[0.18em] text-paper transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Add selected products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- card ---------------------------------- */

function EditCard({ edit }: { edit: Edit }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const total = edit.core.reduce((sum, s) => sum + priceOf(s.priceId), 0);

  return (
    <article className="group flex flex-col border border-border/70 bg-paper transition duration-300 hover:border-ink/40 hover:shadow-[0_28px_60px_-48px_rgba(20,24,40,0.6)]">
      <CoreShelf edit={edit} />

      <div className="flex flex-1 flex-col p-6">
        <p className={`text-[11px] font-semibold uppercase tracking-[0.24em] ${edit.accent}`}>
          Edit {edit.number}
        </p>
        <h3 className="mt-2 font-display text-2xl leading-tight text-ink md:text-[1.7rem]">
          {edit.name}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-ink/70">{edit.purpose}</p>

        <ul className="mt-5 divide-y divide-border border-t border-border text-sm text-ink/80">
          {edit.core.map((slot) => {
            const p = productOf(slot.priceId);
            if (!p) return null;
            return (
              <li key={slot.priceId} className="py-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/50">
                  {slot.role}
                </p>
                <p className="mt-0.5">
                  {p.brand} {p.name}
                </p>
              </li>
            );
          })}
        </ul>

        <p className="mt-4 text-xs leading-relaxed text-ink/60">
          <span className="font-semibold uppercase tracking-[0.14em] text-ink/50">
            Why these three:
          </span>{" "}
          {edit.whyThree}
        </p>

        <div className="mt-4 grid gap-2 text-xs text-ink/65 sm:grid-cols-2">
          <p>
            <span className="font-semibold uppercase tracking-[0.14em] text-ink/50">AM</span>{" "}
            {edit.morning.join(" · ")}
          </p>
          <p>
            <span className="font-semibold uppercase tracking-[0.14em] text-ink/50">PM</span>{" "}
            {edit.evening.join(" · ")}
          </p>
        </div>

        {(() => {
          const p = productOf(edit.optional.priceId);
          if (!p) return null;
          return (
            <div className="mt-5 border border-dashed border-border p-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/55">
                {edit.optional.label}
              </p>
              <p className="mt-1 text-sm text-ink/80">
                {p.brand} {p.name} — {money(priceOf(edit.optional.priceId))}
              </p>
              <p className="mt-1 text-xs text-ink/55">Not included in the three-product core.</p>
            </div>
          );
        })()}

        <div className="mt-auto pt-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/55">
            Three products, current price
          </p>
          <p className="font-display text-3xl text-ink">{money(total)}</p>

          <button
            ref={triggerRef}
            type="button"
            aria-expanded={open}
            aria-haspopup="dialog"
            onClick={() => {
              setOpen(true);
              trackUi("routine_edit_review", { edit: edit.id });
            }}
            className="mt-4 min-h-11 w-full bg-ink px-5 text-xs font-semibold uppercase tracking-[0.2em] text-paper transition hover:opacity-90"
          >
            Review this routine →
          </button>
          <Link
            to="/consultation"
            className="mt-3 inline-flex min-h-11 w-full items-center justify-center border border-ink/30 px-5 text-xs font-semibold uppercase tracking-[0.2em] text-ink transition hover:bg-secondary"
          >
            Build my own routine →
          </Link>
        </div>
      </div>

      {open && (
        <RoutineDialog
          edit={edit}
          onClose={() => setOpen(false)}
          returnFocusTo={triggerRef.current}
        />
      )}
    </article>
  );
}

export function RoutineEdits() {
  return (
    <section id="bundles" className="scroll-mt-20 bg-secondary">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">
            THE ROUTINE EDITS
          </p>
          <h2 className="mt-4 display-section text-ink">
            A considered routine,{" "}
            <span className="italic text-hanbok-deep">already put together.</span>
          </h2>
          <p className="mt-5 max-w-xl text-ink/70">
            Three-product starting routines for when you want the decisions narrowed down. Each
            product has a distinct role, and optional additions stay optional.
          </p>
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/55">
            START WITH THREE · ADJUST GRADUALLY · KNOW WHY IT’S THERE
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {EDITS.map((e) => (
            <EditCard key={e.id} edit={e} />
          ))}
        </div>
      </div>
    </section>
  );
}
