import { Link } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useBuyNow } from "@/hooks/use-buy-now";
import { useSoldOutSkus } from "@/hooks/use-stock";
import { isPurchasable } from "@/lib/shop-catalog";
import { trackUi } from "@/lib/analytics";
import { BUILD_LATER, routineMoney, routinePrice, routineProduct, type RoutineEdit } from "@/lib/routine-edits";

export function RoutineDetailPage({ routine }: { routine: RoutineEdit }) {
  const { buy } = useBuyNow();
  const { isSoldOut } = useSoldOutSkus();
  const optionalId = routine.optional?.priceId;
  const isAvailable = (priceId: string) => isPurchasable(priceId) && !isSoldOut(priceId);
  const [selected, setSelected] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    routine.core.forEach((slot) => { initial[slot.priceId] = isAvailable(slot.priceId); });
    if (optionalId) initial[optionalId] = false;
    return initial;
  });
  const addingRef = useRef(false);
  const [adding, setAdding] = useState(false);

  const selectedIds = useMemo(() => {
    const ids = [...routine.core.map((slot) => slot.priceId), ...(optionalId ? [optionalId] : [])];
    return ids.filter((id) => selected[id] && isAvailable(id));
  }, [optionalId, routine.core, selected]);
  const total = selectedIds.reduce((sum, id) => sum + routinePrice(id), 0);

  function addSelected() {
    if (addingRef.current || selectedIds.length === 0) return;
    addingRef.current = true;
    setAdding(true);
    let added = 0;
    selectedIds.forEach((id) => {
      const product = routineProduct(id);
      if (!product) return;
      buy({ priceId: product.priceId, name: product.name, priceLabel: product.price, brand: product.brand, image: product.image });
      added += 1;
    });
    if (added > 0) {
      trackUi("routine_edit_add_selected", { edit: routine.id, items: added });
      toast.success(`${added} product${added === 1 ? "" : "s"} added to your bag.`);
    }
    window.setTimeout(() => {
      addingRef.current = false;
      setAdding(false);
    }, 600);
  }

  return (
    <main className="bg-paper text-ink">
      <header className={`${routine.field} border-b border-border`}>
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <Link to="/" hash="bundles" className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/65 underline underline-offset-4">← Back to homepage</Link>
          <p className={`mt-10 text-[11px] font-semibold uppercase tracking-[0.22em] ${routine.accent}`}>Routine edit {routine.number}</p>
          <h1 className="mt-4 max-w-4xl font-display text-4xl leading-tight md:text-6xl">{routine.name}</h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/70 md:text-lg">{routine.purpose}</p>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-14 lg:grid-cols-[minmax(0,1fr)_320px] lg:py-20">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/55">Core routine — three products</p>
          <ul className="mt-4 divide-y divide-border border-y border-border">
            {routine.core.map((slot, index) => {
              const product = routineProduct(slot.priceId);
              if (!product) return null;
              const available = isAvailable(slot.priceId);
              return (
                <li key={slot.priceId} className="grid grid-cols-[72px_minmax(0,1fr)] gap-4 py-6 sm:grid-cols-[96px_minmax(0,1fr)_auto] sm:items-start">
                  <img src={product.image} alt={`${product.brand} ${product.name}`} width={160} height={200} className="h-24 w-18 object-contain mix-blend-multiply sm:h-28 sm:w-24" />
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/50">Step {index + 1} · {slot.role}</p>
                    <h2 className="mt-1 font-display text-xl">{product.brand} {product.name}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-ink/65">{slot.why}</p>
                    {!available && <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-clay">Unavailable right now</p>}
                  </div>
                  <div className="col-start-2 flex items-center justify-between gap-5 sm:col-start-auto sm:block sm:text-right">
                    <p className="font-display text-xl">{routineMoney(routinePrice(slot.priceId))}</p>
                    <label className="flex min-h-11 items-center gap-2 text-sm sm:mt-2 sm:justify-end">
                      <input type="checkbox" checked={Boolean(selected[slot.priceId]) && available} disabled={!available} onChange={(event) => setSelected((current) => ({ ...current, [slot.priceId]: event.target.checked }))} aria-label={`Include ${product.brand} ${product.name}`} className="h-5 w-5" />
                      Include
                    </label>
                  </div>
                </li>
              );
            })}
          </ul>

          {routine.optional ? (() => {
            const optional = routine.optional;
            const product = routineProduct(optional.priceId);
            if (!product) return null;
            const available = isAvailable(optional.priceId);
            return (
              <section className="mt-8 border border-dashed border-border bg-secondary/50 p-5" aria-labelledby="optional-heading">
                <p id="optional-heading" className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/55">{optional.label}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-ink/50">Optional — not included in the routine total</p>
                <div className="mt-4 grid grid-cols-[64px_minmax(0,1fr)] gap-4 sm:grid-cols-[80px_minmax(0,1fr)_auto] sm:items-center">
                  <img src={product.image} alt={`${product.brand} ${product.name}`} width={120} height={150} className="h-20 w-16 object-contain mix-blend-multiply" />
                  <div><h2 className="font-display text-lg">{product.brand} {product.name}</h2><p className="mt-1 text-sm text-ink/65">{optional.why}</p></div>
                  <div className="col-start-2 flex items-center justify-between gap-5 sm:col-start-auto sm:block sm:text-right"><p>{routineMoney(routinePrice(optional.priceId))}</p><label className="flex min-h-11 items-center gap-2 text-sm sm:justify-end"><input type="checkbox" checked={Boolean(selected[optional.priceId]) && available} disabled={!available} onChange={(event) => setSelected((current) => ({ ...current, [optional.priceId]: event.target.checked }))} aria-label={`Add optional ${product.brand} ${product.name}`} className="h-5 w-5" />Add</label></div>
                </div>
              </section>
            );
          })() : <section className="mt-8 border border-dashed border-border bg-secondary/50 p-5"><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/55">{BUILD_LATER.heading}</p><p className="mt-2 text-sm text-ink/65">{BUILD_LATER.body}</p></section>}

          <section className="mt-10" aria-labelledby="application-order"><h2 id="application-order" className="font-display text-2xl">Application order</h2><div className="mt-4 grid gap-4 sm:grid-cols-2"><Order title="Morning" steps={routine.morning} /><Order title="Evening" steps={routine.evening} /></div></section>
          <section className="mt-10 border-t border-border pt-8"><h2 className="font-display text-2xl">Why these three</h2><p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/70">{routine.whyThree}</p></section>
        </div>

        <aside className="self-start border border-border bg-paper p-6 lg:sticky lg:top-28">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/55">{selectedIds.length} product{selectedIds.length === 1 ? "" : "s"} selected</p>
          <p className="mt-1 font-display text-4xl">{routineMoney(total)}</p>
          <Button type="button" onClick={addSelected} disabled={adding || selectedIds.length === 0} className="mt-5 min-h-12 w-full rounded-none bg-ink px-4 text-xs uppercase tracking-[0.14em] text-paper hover:bg-ink/90">Add selected products to bag — {routineMoney(total)}</Button>
          <Link to="/consultation" className="mt-3 inline-flex min-h-12 w-full items-center justify-center border border-ink/30 px-4 text-center text-xs font-semibold uppercase tracking-[0.15em]">Build a personalised routine →</Link>
          <p className="mt-6 text-xs leading-relaxed text-ink/55">Cosmetic guidance only — not medical advice or a diagnosis. Introduce one new product at a time and patch-test before full-face use.</p>
        </aside>
      </div>
    </main>
  );
}

function Order({ title, steps }: { title: string; steps: string[] }) {
  return <div className="border border-border p-5"><h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">{title}</h3><ol className="mt-3 space-y-2 text-sm text-ink/75">{steps.map((step, index) => <li key={step}>{index + 1}. {step}</li>)}</ol></div>;
}