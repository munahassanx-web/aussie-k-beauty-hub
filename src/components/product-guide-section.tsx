import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { fetchAllGuides, matchGuide } from '@/lib/application-guides';
import { ApplicationGuideDetails } from '@/components/application-guide';
import { matchProductByReference } from '@/lib/guide-content';
import { productSlug } from '@/lib/product-detail';

// Shows the application guide for a product referenced loosely by
// "Brand Product Name" (as used on shop cards / checkout).
export function ProductGuideSection({ reference }: { reference: string }) {
  const { data } = useQuery({
    queryKey: ['product-guides'],
    queryFn: fetchAllGuides,
    staleTime: 5 * 60_000,
  });

  const guide = data ? matchGuide(reference, data) : null;
  if (!guide) return null;
  const catalogMatch = matchProductByReference(reference);
  const guideParam = catalogMatch ? productSlug(catalogMatch) : guide.id;

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
