import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listReviewSummary } from "@/lib/reviews.functions";

/** Approved-review average and count for a product, or null when it has none. */
export function useReviewSummary(): (
  productId: string,
) => { average: number; count: number } | null {
  const fetchSummary = useServerFn(listReviewSummary);
  const q = useQuery({
    queryKey: ["review-summary"],
    queryFn: () => fetchSummary(),
    staleTime: 5 * 60_000,
    retry: false,
  });
  return (productId: string) => q.data?.[productId] ?? null;
}
