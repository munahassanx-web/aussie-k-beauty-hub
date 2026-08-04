import { supabase } from '@/integrations/supabase/client';

export type GuideViewSource = 'qr' | 'web' | 'email' | 'routine';

const VALID: GuideViewSource[] = ['qr', 'web', 'email', 'routine'];

/** Read the traffic source from the URL (?src=qr) and fall back sensibly. */
export function resolveSource(fallback: GuideViewSource = 'web'): GuideViewSource {
  if (typeof window === 'undefined') return fallback;
  const raw = new URLSearchParams(window.location.search).get('src')?.toLowerCase();
  return VALID.includes(raw as GuideViewSource) ? (raw as GuideViewSource) : fallback;
}

/**
 * Fire-and-forget analytics ping. Never throws — tracking must not break a page.
 */
export async function trackGuideView(params: {
  productId?: string;
  bundleId?: string;
  source?: GuideViewSource;
}): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    await supabase.from('guide_views').insert({
      product_id: params.productId ?? `bundle:${params.bundleId ?? 'unknown'}`,
      bundle_id: params.bundleId ?? null,
      source: params.source ?? resolveSource(),
      referrer: document.referrer || null,
    });
  } catch {
    /* analytics is best-effort */
  }
}
