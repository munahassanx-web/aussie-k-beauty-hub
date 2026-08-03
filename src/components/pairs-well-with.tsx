import { Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { fetchAllGuides, matchGuide, type ProductGuide } from '@/lib/application-guides';

// "Complete the Routine" — resolves the Pairs Well With column to products
// that actually exist in the catalogue and links to their guides.
export function PairsWellWith({ guide }: { guide: ProductGuide }) {
  const { data } = useQuery({
    queryKey: ['product-guides'],
    queryFn: fetchAllGuides,
    staleTime: 5 * 60_000,
  });

  if (!data) return null;
  const companions = guide.pairs_well_with
    .map((ref) => matchGuide(ref, data))
    .filter((g): g is ProductGuide => !!g && g.id !== guide.id)
    .filter((g, i, arr) => arr.findIndex((x) => x.id === g.id) === i);

  if (companions.length === 0) return null;

  return (
    <section className="mt-10 border-t border-border pt-8">
      <h2 className="font-display text-2xl text-foreground">Complete the routine</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Products that work well alongside this one.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {companions.map((c) => (
          <Link
            key={c.id}
            to="/guide/$productId"
            params={{ productId: c.id }}
            className="rounded-2xl border border-border p-4 transition-colors hover:bg-secondary/60"
          >
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{c.brand}</p>
            <p className="mt-1 font-display text-base text-foreground">{c.name}</p>
            <p className="mt-2 text-xs text-primary">{c.routine_step} →</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
