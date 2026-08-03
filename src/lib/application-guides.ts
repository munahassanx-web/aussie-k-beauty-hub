import { supabase } from '@/integrations/supabase/client';

// Application guide data lives in the `products` table so copy stays editable
// from the database side (no hardcoded guide text in the UI).

export type ProductGuide = {
  id: string;
  brand: string;
  name: string;
  routine_step: string;
  routine_order: number;
  amount_to_use: string | null;
  how_to_apply: string | null;
  frequency: string | null;
  pro_tip: string | null;
  pairs_well_with: string[];
  suggested_bundle: string | null;
};

export type RoutineBundle = {
  id: string;
  name: string;
  product_names: string[];
  description: string | null;
};

export const ROUTINE_ORDER_LABELS: Record<number, string> = {
  1: 'Cleanse',
  2: 'Tone / Exfoliate',
  3: 'Treat',
  4: 'Eye care',
  5: 'Moisturise',
  6: 'Protect / SPF',
};

const GUIDE_COLUMNS =
  'id, brand, name, routine_step, routine_order, amount_to_use, how_to_apply, frequency, pro_tip, pairs_well_with, suggested_bundle';

export async function fetchAllGuides(): Promise<ProductGuide[]> {
  const { data, error } = await supabase
    .from('products')
    .select(GUIDE_COLUMNS)
    .order('routine_order', { ascending: true });
  if (error) throw error;
  return (data ?? []) as unknown as ProductGuide[];
}

export async function fetchGuideById(productId: string): Promise<ProductGuide | null> {
  const { data, error } = await supabase
    .from('products')
    .select(GUIDE_COLUMNS)
    .eq('id', productId)
    .maybeSingle();
  if (error) throw error;
  return (data as unknown as ProductGuide) ?? null;
}

export async function fetchBundles(): Promise<RoutineBundle[]> {
  const { data, error } = await supabase
    .from('routine_bundles')
    .select('id, name, product_names, description')
    .order('name', { ascending: true });
  if (error) throw error;
  return (data ?? []) as unknown as RoutineBundle[];
}

export async function fetchBundleById(bundleId: string): Promise<RoutineBundle | null> {
  const { data, error } = await supabase
    .from('routine_bundles')
    .select('id, name, product_names, description')
    .eq('id', bundleId)
    .maybeSingle();
  if (error) throw error;
  return (data as unknown as RoutineBundle) ?? null;
}

// --- matching helpers -------------------------------------------------------

function normalise(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .filter((t) => t.length > 2 && !['the', 'and', 'ml', 'for'].includes(t));
}

/**
 * Resolve a loosely written product reference (e.g. a "Pairs Well With" entry
 * or a Stripe line item name) to a row in the products table.
 */
export function matchGuide(reference: string, guides: ProductGuide[]): ProductGuide | null {
  const ref = normalise(reference);
  if (ref.length === 0) return null;
  let best: { guide: ProductGuide; score: number } | null = null;
  for (const guide of guides) {
    const target = new Set(normalise(`${guide.brand} ${guide.name}`));
    let score = 0;
    for (const token of ref) if (target.has(token)) score += 1;
    const ratio = score / ref.length;
    if (ratio >= 0.6 && (!best || score > best.score)) best = { guide, score };
  }
  return best?.guide ?? null;
}

/** Sort a customer's products into correct application sequence. */
export function sortByRoutineOrder(guides: ProductGuide[]): ProductGuide[] {
  return [...guides].sort(
    (a, b) => a.routine_order - b.routine_order || a.name.localeCompare(b.name),
  );
}

export function bundleSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
