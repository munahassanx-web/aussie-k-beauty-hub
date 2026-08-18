import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { fetchAllGuides } from '@/lib/application-guides';
import { ApplicationGuideDetails } from '@/components/application-guide';
import { matchProductByReference, strictStoredMatch } from '@/lib/guide-content';

import { productSlug } from '@/lib/product-detail';

// Shows the application guide for a product referenced loosely by
// "Brand Product Name" (as used on shop cards / checkout).
export function ProductGuideSection({ reference }: { reference: string }) {
  const { data } = useQuery({
    queryKey: ['product-guides'],
    queryFn: fetchAllGuides,
    staleTime: 5 * 60_000,
  });

  // Only an exact brand+name match on a current catalog product may render
  // stored directions — stale rows must never enrich the wrong SKU.
  const catalogMatch = matchProductByReference(reference);
  const guide = data && catalogMatch ? strictStoredMatch(catalogMatch, data) : null;
  if (!guide) return null;
  const guideParam = productSlug(catalogMatch!);


  return (
    <section className="mt-8 border-t border-border pt-6">
      <h4 className="font-display text-xl text-foreground">How to use it</h4>
      <div className="mt-4">
        <ApplicationGuideDetails guide={guide} />
      </div>
      <Link
        to="/guide/$productId"
        params={{ productId: guideParam }}
        className="mt-4 inline-flex text-xs font-medium uppercase tracking-wider text-primary hover:underline"
      >
        How to apply — full guide →
      </Link>
    </section>
  );
}
