import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useBuyNow } from "@/hooks/use-buy-now";

export type CompareItem = {
  priceId: string;
  name: string;
  brand: string;
  price: string;
  image: string;
};

type Row = {
  product_id: string;
  is_hero_ingredient: boolean;
  ingredients: { name_english: string; good_for: string[] } | null;
};

async function fetchIngredientsFor(productIds: string[]) {
  if (productIds.length === 0) return [] as Row[];
  const { data, error } = await supabase
    .from("product_ingredients")
    .select("product_id, is_hero_ingredient, ingredients ( name_english, good_for )")
    .in("product_id", productIds);
  if (error) throw error;
  return (data ?? []) as unknown as Row[];
}

export function CompareDrawer({
  items,
  onRemove,
  onClear,
  onOpen,
}: {
  items: CompareItem[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onOpen: () => void;
}) {
  if (items.length === 0) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-6 py-4">
        <p className="text-xs uppercase tracking-[0.2em] text-primary">Compare</p>
        <div className="flex flex-1 flex-wrap gap-2">
          {items.map((it) => (
            <span key={it.priceId} className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1.5 text-xs text-foreground">
              {it.name}
              <button onClick={() => onRemove(it.priceId)} className="text-muted-foreground hover:text-foreground" aria-label={`Remove ${it.name}`}>×</button>
            </span>
          ))}
        </div>
        <button onClick={onClear} className="text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground">Clear</button>
        <button
          onClick={onOpen}
          disabled={items.length < 2}
          className="rounded-full bg-primary px-5 py-2 text-xs font-medium uppercase tracking-wider text-primary-foreground disabled:opacity-40"
        >
          Compare Selected ({items.length})
        </button>
      </div>
    </div>
  );
}

export function CompareModal({
  items,
  open,
  onClose,
}: {
  items: CompareItem[];
  open: boolean;
  onClose: () => void;
}) {
  const ids = items.map((i) => i.priceId);
  const { data } = useQuery({
    queryKey: ["compare-ingredients", ids.sort().join(",")],
    queryFn: () => fetchIngredientsFor(ids),
    enabled: open && ids.length > 0,
  });
  const { buy, modal } = useBuyNow();

  if (!open) return null;

  const byProduct = (pid: string) => (data ?? []).filter((r) => r.product_id === pid);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-primary">Side by side</p>
            <h2 className="mt-2 font-display text-3xl text-foreground md:text-4xl">Compare products</h2>
          </div>
          <button onClick={onClose} className="rounded-full border border-border px-4 py-2 text-xs uppercase tracking-wider text-foreground hover:bg-secondary">Close</button>
        </div>

        <div className={`mt-10 grid gap-6 ${items.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
          {items.map((p) => {
            const rows = byProduct(p.priceId);
            const heroes = rows.filter((r) => r.is_hero_ingredient && r.ingredients).map((r) => r.ingredients!.name_english);
            const others = rows.filter((r) => !r.is_hero_ingredient && r.ingredients).map((r) => r.ingredients!.name_english);
            const concerns = Array.from(new Set(rows.flatMap((r) => r.ingredients?.good_for ?? [])));
            return (
              <article key={p.priceId} className="rounded-3xl border border-border bg-background p-5">
                <div className="aspect-square overflow-hidden rounded-2xl bg-secondary">
                  <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                </div>
                <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">{p.brand}</p>
                <h3 className="mt-1 font-display text-xl text-foreground">{p.name}</h3>
                <p className="mt-2 text-sm text-foreground">{p.price} AUD</p>

                <div className="mt-5 border-t border-border pt-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "#1F2A37" }}>Hero ingredients</p>
                  {heroes.length ? (
                    <ul className="mt-2 space-y-1 text-sm text-foreground">
                      {heroes.map((h) => <li key={h}>• {h}</li>)}
                    </ul>
                  ) : <p className="mt-2 text-xs italic text-muted-foreground">Coming soon</p>}
                </div>

                <div className="mt-4 border-t border-border pt-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Targets concerns</p>
                  {concerns.length ? (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {concerns.map((c) => (
                        <span key={c} className="rounded-full border border-border bg-secondary/60 px-2.5 py-0.5 text-[11px] text-foreground">{c}</span>
                      ))}
                    </div>
                  ) : <p className="mt-2 text-xs italic text-muted-foreground">—</p>}
                </div>

                {others.length > 0 && (
                  <div className="mt-4 border-t border-border pt-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Also contains</p>
                    <p className="mt-2 text-xs text-muted-foreground">{others.join(", ")}</p>
                  </div>
                )}

                <button
                  onClick={() => buy({ priceId: p.priceId, name: p.name, priceLabel: `${p.price} AUD` })}
                  className="mt-5 w-full rounded-full bg-primary px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-primary-foreground hover:opacity-90"
                >
                  Buy {p.name}
                </button>
              </article>
            );
          })}
        </div>
      </div>
      {modal}
    </div>
  );
}
