import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';

/**
 * Display-only Circle signal. The entitlement itself is decided server-side at
 * checkout from the subscriptions ledger — this hook only labels the UI.
 */
export function useCircle(): { isCircle: boolean; loading: boolean } {
  const { user, loading: authLoading } = useAuth();
  const [isCircle, setIsCircle] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setIsCircle(false);
      setLoading(false);
      return;
    }
    let cancelled = false;
    supabase
      .from('memberships')
      .select('tier, has_active_subscription')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        setIsCircle(data?.tier === 'circle' && Boolean(data?.has_active_subscription));
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  return { isCircle, loading };
}
