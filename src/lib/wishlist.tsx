import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';

type WishlistContextValue = {
  /** Saved product ids (catalog priceIds). */
  ids: string[];
  loading: boolean;
  signedIn: boolean;
  has: (productId: string) => boolean;
  toggle: (productId: string) => Promise<'added' | 'removed' | 'signed-out'>;
  remove: (productId: string) => Promise<void>;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [ids, setIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (authLoading) return;
    if (!user) {
      setIds([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    void supabase
      .from('wishlist_items')
      .select('product_id')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (cancelled) return;
        setIds((data ?? []).map((r) => r.product_id as string));
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  const has = useCallback((productId: string) => ids.includes(productId), [ids]);

  const remove = useCallback(
    async (productId: string) => {
      if (!user) return;
      setIds((prev) => prev.filter((id) => id !== productId));
      await supabase.from('wishlist_items').delete().eq('user_id', user.id).eq('product_id', productId);
    },
    [user],
  );

  const toggle = useCallback<WishlistContextValue['toggle']>(
    async (productId) => {
      if (!user) return 'signed-out';
      if (ids.includes(productId)) {
        await remove(productId);
        return 'removed';
      }
      setIds((prev) => [productId, ...prev]);
      const { error } = await supabase
        .from('wishlist_items')
        .insert({ user_id: user.id, product_id: productId });
      if (error) setIds((prev) => prev.filter((id) => id !== productId));
      return 'added';
    },
    [user, ids, remove],
  );

  const value = useMemo<WishlistContextValue>(
    () => ({ ids, loading: loading || authLoading, signedIn: Boolean(user), has, toggle, remove }),
    [ids, loading, authLoading, user, has, toggle, remove],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider');
  return ctx;
}
