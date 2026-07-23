import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { getStripe, getStripeEnvironment } from '@/lib/stripe';
import { createCircleCheckout } from '@/lib/loyalty.functions';

export function CircleCheckout({ priceId, onClose }: { priceId: 'circle_monthly' | 'circle_yearly'; onClose: () => void }) {
  const fetchClientSecret = async (): Promise<string> => {
    const result = await createCircleCheckout({
      data: {
        priceId,
        environment: getStripeEnvironment(),
        returnUrl: `${window.location.origin}/club?welcome=circle`,
      },
    });
    if ('error' in result) throw new Error(result.error);
    return result.clientSecret;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-ink/80 p-4 backdrop-blur">
      <div className="my-8 w-full max-w-2xl rounded-2xl bg-background p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-xl text-foreground">Join Circle</h3>
          <button onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground">Close ✕</button>
        </div>
        <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret }}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
    </div>
  );
}
