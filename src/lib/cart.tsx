import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

export type CartLine = {
  priceId: string;
  name: string;
  brand: string;
  image: string;
  unitCents: number;
  quantity: number;
  recurring: boolean;
};

export {
  FLAT_SHIPPING_CENTS,
  FREE_SHIPPING_THRESHOLD_CENTS,
  FREE_SHIPPING_THRESHOLD_LABEL,
} from '@/lib/shipping-rates';
import { FLAT_SHIPPING_CENTS, FREE_SHIPPING_THRESHOLD_CENTS } from '@/lib/shipping-rates';
import { track, centsToAud, type AnalyticsItem } from '@/lib/analytics';

function lineToItem(line: Pick<CartLine, 'priceId' | 'name' | 'brand' | 'unitCents'> & { quantity?: number }): AnalyticsItem {
  return {
    item_id: line.priceId,
    item_name: line.name,
    item_brand: line.brand,
    price: centsToAud(line.unitCents),
    quantity: line.quantity ?? 1,
  };
}

const STORAGE_KEY = 'sg-cart-v1';

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  hasSubscription: boolean;
  mixedModes: boolean;
  add: (line: Omit<CartLine, 'quantity'>, quantity?: number) => void;
  setQuantity: (priceId: string, quantity: number) => void;
  remove: (priceId: string) => void;
  clear: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function readStored(): CartLine[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((l) => l && typeof l.priceId === 'string' && typeof l.unitCents === 'number');
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Read after mount so SSR and first client render match.
  useEffect(() => {
    setLines(readStored());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  // view_cart — once per drawer opening, with the contents actually shown.
  const viewCartReported = useRef(false);
  useEffect(() => {
    if (!open) {
      viewCartReported.current = false;
      return;
    }
    if (viewCartReported.current || lines.length === 0) return;
    viewCartReported.current = true;
    track('view_cart', {
      currency: 'AUD',
      value: centsToAud(lines.reduce((sum, l) => sum + l.unitCents * l.quantity, 0)),
      items: lines.map((l) => lineToItem(l)),
    });
  }, [open, lines]);

  const value = useMemo<CartContextValue>(() => {
    const subtotalCents = lines.reduce((sum, l) => sum + l.unitCents * l.quantity, 0);
    const hasSubscription = lines.some((l) => l.recurring);
    const mixedModes = hasSubscription && lines.some((l) => !l.recurring);
    const shippingCents =
      lines.length === 0 || hasSubscription || subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS
        ? 0
        : FLAT_SHIPPING_CENTS;

    return {
      lines,
      count: lines.reduce((sum, l) => sum + l.quantity, 0),
      subtotalCents,
      shippingCents,
      totalCents: subtotalCents + shippingCents,
      hasSubscription,
      mixedModes,
      open,
      setOpen,
      add: (line, quantity = 1) => {
        track('add_to_cart', {
          currency: 'AUD',
          value: centsToAud(line.unitCents * quantity),
          items: [lineToItem({ ...line, quantity })],
        });
        setLines((prev) => {
          const existing = prev.find((l) => l.priceId === line.priceId);
          if (existing) {
            return prev.map((l) =>
              l.priceId === line.priceId ? { ...l, quantity: Math.min(10, l.quantity + quantity) } : l,
            );
          }
          return [...prev, { ...line, quantity: Math.min(10, quantity) }];
        });
      },
      setQuantity: (priceId, quantity) =>
        setLines((prev) => {
          const existing = prev.find((l) => l.priceId === priceId);
          if (existing && quantity <= 0) {
            track('remove_from_cart', {
              currency: 'AUD',
              value: centsToAud(existing.unitCents * existing.quantity),
              items: [lineToItem(existing)],
            });
          }
          return quantity <= 0
            ? prev.filter((l) => l.priceId !== priceId)
            : prev.map((l) => (l.priceId === priceId ? { ...l, quantity: Math.min(10, quantity) } : l));
        }),
      remove: (priceId) =>
        setLines((prev) => {
          const existing = prev.find((l) => l.priceId === priceId);
          if (existing) {
            track('remove_from_cart', {
              currency: 'AUD',
              value: centsToAud(existing.unitCents * existing.quantity),
              items: [lineToItem(existing)],
            });
          }
          return prev.filter((l) => l.priceId !== priceId);
        }),
      clear: () => setLines([]),
    };
  }, [lines, open]);


  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}

export function formatAud(cents: number): string {
  return `A$${(cents / 100).toFixed(2).replace(/\.00$/, '')}`;
}
