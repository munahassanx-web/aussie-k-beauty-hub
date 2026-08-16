import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';

type WishlistContextValue = {
  /** Saved product ids (catalog priceIds). */
  ids: string[];
  loading: boolean;
  signedIn: boolean;
  has: (productId: string) => boolean;
  /** Throws when the save/remove fails so callers can show an honest error. */
  toggle: (productId: string) => Promise<'added' | 'removed' | 'signed-out'>;
  /** Throws when the delete fails or removes nothing. */
  remove: (productId: string) => Promise<void>;
  refresh: () => Promise<void>;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

/** The context user can lag behind a hydrating session; fall back to the live session. */
async function currentUserId(fallback?: string | null) {
  if (fallback) return fallback;
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [ids, setIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = user?.id ?? null;
  const userIdRef = useRef<string | null>(null);
  userIdRef.current = userId;

  const fetchIds = useCallback(async () => {
    const uid = await currentUserId(userIdRef.current);
    if (!uid) {
      setIds([]);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from('wishlist_items')
      .select('product_id')
      .eq('user_id', uid)
      .order('created_at', { ascending: false });
    if (!error) setIds((data ?? []).map((r) => r.product_id as string));
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!userId) {
      setIds([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    void fetchIds();
  }, [userId, authLoading, fetchIds]);

  const has = useCallback((productId: string) => ids.includes(productId), [ids]);

  const remove = useCallback(async (productId: string) => {
    console.log('[wishlist-debug] remove entered', { productId, contextUserId: userIdRef.current });
    const uid = await currentUserId(userIdRef.current);
    console.log('[wishlist-debug] identity resolved', { hasUserId: Boolean(uid) });
    if (!uid) {
      console.log('[wishlist-debug] no authenticated user');
      throw new Error('You need to be signed in to change your wishlist.');
    }

    const previous = ids;
    setIds((prev) => prev.filter((id) => id !== productId));

    const { data, error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('user_id', uid)
      .eq('product_id', productId)
      .select('id');

    console.log('[wishlist-debug] delete completed', { deletedRows: data?.length ?? 0, error: error?.message ?? null });

    if (error) {
      setIds(previous);
      throw new Error(error.message);
    }
    // No rows deleted means the row is gone or not ours — resync with the server
    // rather than leaving the UI asserting something untrue.
    if (!data || data.length === 0) {
      await fetchIds();
    }
  }, [ids, fetchIds]);

  const toggle = useCallback<WishlistContextValue['toggle']>(
    async (productId) => {
      const uid = await currentUserId(userIdRef.current);
      if (!uid) return 'signed-out';
      if (ids.includes(productId)) {
        await remove(productId);
        return 'removed';
      }
      setIds((prev) => [productId, ...prev]);
      const { error } = await supabase.from('wishlist_items').insert({ user_id: uid, product_id: productId });
      if (error) {
        setIds((prev) => prev.filter((id) => id !== productId));
        throw new Error(error.message);
      }
      return 'added';
    },
    [ids, remove],
  );

  const value = useMemo<WishlistContextValue>(
    () => ({
      ids,
      loading: loading || authLoading,
      signedIn: Boolean(userId),
      has,
      toggle,
      remove,
      refresh: fetchIds,
    }),
    [ids, loading, authLoading, userId, has, toggle, remove, fetchIds],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider');
  return ctx;
}
