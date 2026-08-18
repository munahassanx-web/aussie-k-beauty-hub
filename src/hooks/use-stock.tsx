import { useQuery } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { listSoldOutSkus } from '@/lib/inventory.functions';

/**
 * Sold-out SKUs only — the storefront never sees stock quantities.
 * SKUs without a real opening count are absent, so they stay purchasable.
 */
export function useSoldOutSkus(): { isSoldOut: (sku: string) => boolean } {
  const fetchSoldOut = useServerFn(listSoldOutSkus);
  const q = useQuery({
    queryKey: ['sold-out-skus'],
    queryFn: () => fetchSoldOut({ data: undefined as never }),
    staleTime: 60_000,
    retry: false,
  });
  const set = new Set(q.data ?? []);
  return { isSoldOut: (sku: string) => set.has(sku) };
}
