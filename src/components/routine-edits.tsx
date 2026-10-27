import { Link } from "@tanstack/react-router";
import { trackUi } from "@/lib/analytics";
import { ROUTINE_EDITS, routineMoney, routinePrice, routineProduct, type RoutineEdit } from "@/lib/routine-edits";

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

// Homepage card: the shelf, the name, what it's for and the price. The full
// breakdown (roles, AM/PM, optional extras) lives on each routine's own page.
function EditCard({ edit }: { edit: RoutineEdit }) {
  const total = edit.core.reduce((sum, slot) => sum + routinePrice(slot.priceId), 0);
  const destination = `/routines/${edit.id}` as "/routines/essential-hydration" | "/routines/tone-glow-support" | "/routines/barrier-comfort";

  return (
    <article className="group flex w-[82%] max-w-[22rem] flex-none snap-start flex-col overflow-hidden rounded-[1.75rem] border border-border/70 bg-paper transition duration-300 hover:border-glaze hover:shadow-[0_28px_60px_-48px_rgba(58,38,32,0.6)] md:w-auto md:max-w-none">
      <CoreShelf edit={edit} />
      <div className="flex flex-1 flex-col p-6">
        <p className={`text-[11px] font-semibold uppercase tracking-[0.24em] ${edit.accent}`}>Edit {edit.number}</p>
        <h3 className="mt-2 font-display text-2xl leading-tight text-ink md:text-[1.7rem]">{edit.name}</h3>
        <p className="mt-3 text-sm leading-relaxed text-ink/70">{edit.purpose}</p>
        <div className="mt-auto pt-6">
          <p className="whitespace-nowrap font-display text-3xl text-ink">{routineMoney(total)}<span className="ml-2 text-xs text-ink/55">for all three</span></p>
          <Link to={destination} onClick={() => trackUi("routine_edit_review", { edit: edit.id })} className="mt-4 inline-flex min-h-11 w-full items-center justify-center whitespace-nowrap rounded-full bg-ink px-5 text-xs font-semibold uppercase tracking-[0.2em] text-paper transition hover:opacity-90">See this routine →</Link>
        </div>
      </div>
    </article>
  );
}

export function RoutineEdits() {
  return (
    <section id="bundles" className="scroll-mt-20 bg-secondary">
      <div className="mx-auto max-w-7xl py-16 md:px-6 md:py-24">
        <div className="max-w-2xl px-6 md:px-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">THE ROUTINE EDITS</p>
          <h2 className="mt-4 display-section text-ink">A considered routine, <span className="italic text-hanbok-deep">already put together.</span></h2>
          <p className="mt-5 max-w-xl text-ink/70">Three products, each with one job. Swipe to pick a starting point.</p>
        </div>
        <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-6 px-6 pb-2 [scrollbar-width:none] md:mt-14 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">{ROUTINE_EDITS.map((edit) => <EditCard key={edit.id} edit={edit} />)}</div>
      </div>
    </section>
  );
}
