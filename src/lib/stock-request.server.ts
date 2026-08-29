/**
 * "Ask us to stock it" — server-side handling.
 *
 * Records the request, then attempts a confirmation email. The email is
 * best-effort: if no provider is configured or the send fails, the request is
 * still stored and the row records why nothing was sent. We never tell the
 * customer an email is on the way unless the provider accepted it.
 */

import { renderStockRequestConfirmation } from '@/lib/email/stock-request-email.server';
import { activeEmailProvider } from '@/lib/email/provider.server';
import type { StockRequestData } from '@/lib/stock-request';

export type StockRequestResult = { success: true; emailed: boolean };

export async function recordStockRequest(data: StockRequestData): Promise<StockRequestResult> {
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');

  const { data: row, error } = await supabaseAdmin
    .from('stock_requests')
    .insert({
      email: data.email,
      name: data.name || null,
      product_brand: data.productBrand || null,
      product_name: data.productName,
      note: data.note || null,
      source: data.source || 'shop_watchlist',
    })
    .select('id')
    .single();

  if (error) {
    console.error('[stock-request] insert failed:', error.message);
    throw new Error('We could not log that request. Please try again.');
  }

  const rendered = renderStockRequestConfirmation({
    name: data.name || null,
    productBrand: data.productBrand || null,
    productName: data.productName,
    note: data.note || null,
  });

  const provider = activeEmailProvider();
  if (!provider) {
    await supabaseAdmin
      .from('stock_requests')
      .update({ confirmation_status: 'not_configured' })
      .eq('id', row.id);
    return { success: true, emailed: false };
  }

  const result = await provider.send({
    to: data.email,
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text,
    idempotencyKey: `stock_request:${row.id}`,
  });

  await supabaseAdmin
    .from('stock_requests')
    .update(
      result.ok
        ? { confirmation_status: 'sent', confirmed_at: new Date().toISOString(), confirmation_error: null }
        : { confirmation_status: 'failed', confirmation_error: result.error },
    )
    .eq('id', row.id);

  return { success: true, emailed: result.ok };
}
