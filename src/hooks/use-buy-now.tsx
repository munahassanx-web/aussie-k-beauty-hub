import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { getClubSummary } from '@/lib/loyalty.functions';
import { isPaymentsConfigured } from '@/lib/stripe';
import { ProductCheckout, type ProductCheckoutOptions } from '@/components/product-checkout';

// Shared hook for launching product/bundle checkout from anywhere.
export function useBuyNow() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [options, setOptions] = useState<ProductCheckoutOptions | null>(null);

  const summaryQ = useQuery({
    queryKey: ['club-summary', user?.id],
    queryFn: () => getClubSummary(),
    enabled: !!user,
  });

  function buy(opts: Omit<ProductCheckoutOptions, 'pointsBalance'>) {
    if (!user) {
      navigate({ to: '/auth' });
      return;
    }
    if (!isPaymentsConfigured()) {
      alert('Payments are not configured for this build.');
      return;
    }
    setOptions({ ...opts, pointsBalance: summaryQ.data?.pointsBalance ?? 0 });
  }

  const modal = options ? <ProductCheckout options={options} onClose={() => setOptions(null)} /> : null;

  return { buy, modal };
}
