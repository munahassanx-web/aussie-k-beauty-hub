import { Link } from "@tanstack/react-router";
import { trackUi } from "@/lib/analytics";
import { BUILD_LATER, ROUTINE_EDITS, routineMoney, routinePrice, routineProduct, type RoutineEdit } from "@/lib/routine-edits";

function CoreShelf({ edit }: { edit: RoutineEdit }) {
  return (
    <div className={`grid grid-cols-3 gap-px ${edit.field}`}>
      {edit.core.map((slot) => {
        const product = routineProduct(slot.priceId);
        if (!product) return null;
        return (
          <div key={slot.priceId} className="flex flex-col items-center justify-end px-2 pb-4 pt-6">
            <img src={product.image} alt={`${product.brand} ${product.name}`} loading="lazy" width={240} height={300} className="h-28 w-full object-contain mix-blend-multiply md:h-32" />
            <p className="mt-3 text-center text-[9px] font-semibold uppercase tracking-[0.14em] text-ink/55">{slot.role}</p>
          </div>
        );
      })}
    </div>
  );
}

function EditCard({ edit }: { edit: RoutineEdit }) {
  const total = edit.core.reduce((sum, slot) => sum + routinePrice(slot.priceId), 0);
  const destination = `/routines/${edit.id}` as "/routines/essential-hydration" | "/routines/tone-glow-support" | "/routines/barrier-comfort";

  return (
    <article className="group flex flex-col border border-border/70 bg-paper transition duration-300 hover:border-ink/40 hover:shadow-[0_28px_60px_-48px_rgba(20,24,40,0.6)]">
      <CoreShelf edit={edit} />
      <div className="flex flex-1 flex-col p-6">
        <p className={`text-[11px] font-semibold uppercase tracking-[0.24em] ${edit.accent}`}>Edit {edit.number}</p>
        <h3 className="mt-2 font-display text-2xl leading-tight text-ink md:text-[1.7rem]">{edit.name}</h3>
        <p className="mt-3 text-sm leading-relaxed text-ink/70">{edit.purpose}</p>
        <ul className="mt-5 divide-y divide-border border-t border-border text-sm text-ink/80">
          {edit.core.map((slot) => {
            const product = routineProduct(slot.priceId);
            if (!product) return null;
            return <li key={slot.priceId} className="py-2.5"><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/50">{slot.role}</p><p className="mt-0.5">{product.brand} {product.name}</p></li>;
          })}
        </ul>
        <p className="mt-4 text-xs leading-relaxed text-ink/60"><span className="font-semibold uppercase tracking-[0.14em] text-ink/50">Why these three:</span>{" "}{edit.whyThree}</p>
        <div className="mt-4 grid gap-2 text-xs text-ink/65 sm:grid-cols-2">
          <p><span className="font-semibold uppercase tracking-[0.14em] text-ink/50">AM</span>{" "}{edit.morning.join(" · ")}</p>
          <p><span className="font-semibold uppercase tracking-[0.14em] text-ink/50">PM</span>{" "}{edit.evening.join(" · ")}</p>
        </div>
        {edit.optional ? (() => {
          const product = routineProduct(edit.optional.priceId);
          if (!product) return null;
          return <div className="mt-5 border border-dashed border-border p-3"><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/55">{edit.optional.label}</p><p className="mt-1 text-sm text-ink/80">{product.brand} {product.name} — {routineMoney(routinePrice(edit.optional.priceId))}</p><p className="mt-1 text-xs text-ink/55">Not included in the three-product core.</p></div>;
        })() : <div className="mt-5 border border-dashed border-border p-3"><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/55">{BUILD_LATER.heading}</p><p className="mt-1 text-xs text-ink/60">{BUILD_LATER.body}</p></div>}
        <div className="mt-auto pt-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/55">Three products, current price</p>
          <p className="font-display text-3xl text-ink">{routineMoney(total)}</p>
          <Link to={destination} onClick={() => trackUi("routine_edit_review", { edit: edit.id })} className="mt-4 inline-flex min-h-11 w-full items-center justify-center bg-ink px-5 text-xs font-semibold uppercase tracking-[0.2em] text-paper transition hover:opacity-90">Review this routine →</Link>
          <Link to="/consultation" className="mt-3 inline-flex min-h-11 w-full items-center justify-center border border-ink/30 px-5 text-xs font-semibold uppercase tracking-[0.2em] text-ink transition hover:bg-secondary">Build my own routine →</Link>
        </div>
      </div>
    </article>
  );
}

export function RoutineEdits() {
  return (
    <section id="bundles" className="scroll-mt-20 bg-secondary">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">THE ROUTINE EDITS</p>
          <h2 className="mt-4 display-section text-ink">A considered routine, <span className="italic text-hanbok-deep">already put together.</span></h2>
          <p className="mt-5 max-w-xl text-ink/70">Three-product starting routines for when you want the decisions narrowed down. Each product has a distinct role, and optional additions stay optional.</p>
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/55">START WITH THREE · ADJUST GRADUALLY · KNOW WHY IT’S THERE</p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">{ROUTINE_EDITS.map((edit) => <EditCard key={edit.id} edit={edit} />)}</div>
      </div>
    </section>
  );
}
