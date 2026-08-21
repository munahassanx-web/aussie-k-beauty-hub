import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import {
  getAdminOrder,
  getOrderComms,
  getShippingCapability,
  markOrderDelivered,
  sendOrderNotification,
  updateOrderFulfilment,
  FULFILMENT_STAGES,
} from '@/lib/admin-orders.functions';
import { CARRIERS, DEFAULT_CARRIER_LABEL, findCarrier, isPlausibleTracking, trackingLink, trackingLinkLabel } from '@/lib/shipping/carriers';
import { PackingSlip } from '@/components/admin/packing-slip';
import { AuthenticityPanel } from '@/components/admin/authenticity-panel';
import { OrderWorkflowGuide } from '@/components/admin/order-workflow-guide';
import { useAuth } from '@/hooks/use-auth';

export const Route = createFileRoute('/admin/orders/$id')({
  head: () => ({
    meta: [
      { title: 'Order detail — Skin Grocer admin' },
      { name: 'description', content: 'Internal order detail, packing slip and fulfilment controls for a Skin Grocer order.' },
      { name: 'robots', content: 'noindex, nofollow' },
      { property: 'og:title', content: 'Order detail — Skin Grocer admin' },
      { property: 'og:description', content: 'Pack, dispatch and add tracking to a Skin Grocer order.' },
    ],
  }),
  component: OrderDetail,
});

/** Honest wording for each persisted notification state. Never says "sent" unless it is. */
const STATUS_COPY: Record<string, string> = {
  'no record yet': 'No record yet',
  pending: 'Pending',
  not_configured: 'Not configured — no email sent',
  queued: 'Queued',
  sent: 'Sent',
  failed: 'Failed',
  // "Skipped" only means no send happened — the ledger row carries the real
  // reason, which is shown next to it. It does NOT imply a missing email.
  skipped: 'Not sent',
};

function money(cents: number, currency = 'AUD') {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency }).format((cents ?? 0) / 100);
}

const STAGE_LABEL: Record<string, string> = {
  processing: 'To pack',
  packed: 'Packed',
  shipped: 'Dispatched',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

function OrderDetail() {
  const { id } = Route.useParams();
  const { user, loading } = useAuth();
  const qc = useQueryClient();
  const fetchOrder = useServerFn(getAdminOrder);
  const fetchCapability = useServerFn(getShippingCapability);
  const save = useServerFn(updateOrderFulfilment);

  const q = useQuery({
    queryKey: ['admin-order', id],
    queryFn: () => fetchOrder({ data: { id } }),
    enabled: Boolean(user),
    retry: false,
  });

  const capability = useQuery({
    queryKey: ['shipping-capability'],
    queryFn: () => fetchCapability(),
    enabled: Boolean(user),
    retry: false,
  });

  const order = q.data ?? null;
  const [tracking, setTracking] = useState('');
  const [carrier, setCarrier] = useState('');
  const [service, setService] = useState('');
  const [shipmentId, setShipmentId] = useState('');
  const [labelUrl, setLabelUrl] = useState('');
  const [labelRef, setLabelRef] = useState('');
  const [labelCost, setLabelCost] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!order) return;
    setTracking(order.trackingNumber ?? '');
    // Australia Post is the default carrier; staff can change it freely.
    setCarrier(order.shippingCarrier ?? DEFAULT_CARRIER_LABEL);
    setService(order.shippingService ?? '');
    setShipmentId(order.shipmentId ?? '');
    setLabelUrl(order.labelUrl ?? '');
    setLabelRef(order.labelReference ?? '');
    setLabelCost(order.shippingCostActualCents == null ? '' : (order.shippingCostActualCents / 100).toFixed(2));
    setNotes(order.opsNotes ?? '');
  }, [order?.id, order?.fulfillmentUpdatedAt]);

  const selectedCarrier = findCarrier(carrier);
  const trackUrl = trackingLink(carrier, tracking);
  const [overrideDispatch, setOverrideDispatch] = useState(false);
  const dispatchReady = Boolean(carrier.trim()) && isPlausibleTracking(carrier, tracking);
  const dispatchBlocked = !dispatchReady && !overrideDispatch;

  const mutate = useMutation({
    mutationFn: (vars: Parameters<typeof updateOrderFulfilment>[0]['data']) => save({ data: vars }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin-order', id] });
      void qc.invalidateQueries({ queryKey: ['admin-orders'] });
      void qc.invalidateQueries({ queryKey: ['admin-order-comms', id] });
    },
  });

  const fetchComms = useServerFn(getOrderComms);
  const sendNotification = useServerFn(sendOrderNotification);
  const comms = useQuery({
    queryKey: ['admin-order-comms', id],
    queryFn: () => fetchComms({ data: { id } }),
    enabled: Boolean(user),
    retry: false,
  });
  const resend = useMutation({
    mutationFn: (kind: 'order_confirmation' | 'dispatch' | 'delivery' | 'cancellation') =>
      sendNotification({ data: { id, kind } }),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['admin-order-comms', id] }),
  });

  const markDelivered = useServerFn(markOrderDelivered);
  const deliver = useMutation({
    mutationFn: () => markDelivered({ data: { id, confirm: true } }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin-order', id] });
      void qc.invalidateQueries({ queryKey: ['admin-orders'] });
      void qc.invalidateQueries({ queryKey: ['admin-order-comms', id] });
    },
  });
  const [copied, setCopied] = useState(false);

  if (loading || q.isLoading) {
    return <main className="mx-auto max-w-4xl px-6 py-16 text-sm text-muted-foreground">Loading…</main>;
  }
  if (!user) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16 text-sm text-muted-foreground">
        <Link to="/auth" className="underline">Sign in</Link> with a staff account to view this order.
      </main>
    );
  }
  if (q.isError) {
    return <main className="mx-auto max-w-4xl px-6 py-16 text-sm text-destructive">{(q.error as Error).message}</main>;
  }
  if (!order) {
    return <main className="mx-auto max-w-4xl px-6 py-16 text-sm text-muted-foreground">Order not found.</main>;
  }

  const address = [
    order.shippingLine1,
    order.shippingLine2,
    [order.shippingCity, order.shippingState, order.shippingPostcode].filter(Boolean).join(' '),
    order.shippingCountry,
  ].filter(Boolean);

  return (
    <>
      <PackingSlip order={order} />

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16 print:hidden">
        <Link to="/admin/orders" className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">
          ← Order queue
        </Link>
        {order.environment !== 'live' && (
          <p className="mt-4 rounded-2xl border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
            <strong>Stripe test / sandbox order.</strong> No real payment was taken. It is excluded from live metrics
            and cannot be packed, dispatched or delivered.
          </p>
        )}
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl text-foreground">
              Order {order.id.slice(0, 8).toUpperCase()}
              {order.environment !== 'live' && (
                <span className="ml-3 align-middle rounded-full border border-destructive px-2 py-0.5 text-xs font-semibold uppercase tracking-[0.14em] text-destructive">
                  Test
                </span>
              )}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {new Date(order.createdAt).toLocaleString('en-AU')} · Payment: {order.status} ·{' '}
              {STAGE_LABEL[order.fulfillmentStatus] ?? order.fulfillmentStatus}
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-full border border-border px-5 py-2.5 text-sm hover:border-foreground"
          >
            Print packing slip
          </button>
        </div>

        <OrderWorkflowGuide order={order} />

        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border p-4 text-sm sm:p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Ship to</p>
            <p className="mt-2 text-foreground">{order.shippingName ?? order.customerName ?? 'Not provided'}</p>
            {address.length > 0 ? (
              address.map((line) => <p key={line} className="text-muted-foreground">{line}</p>)
            ) : (
              <p className="text-destructive">No shipping address captured — contact the customer before packing.</p>
            )}
            {order.shippingPhone && <p className="text-muted-foreground">{order.shippingPhone}</p>}
            <p className="mt-2 text-muted-foreground">
              {order.customerEmail ?? '—'} {order.isGuest ? '(guest checkout)' : ''}
            </p>
          </div>
          <div className="rounded-2xl border border-border p-4 text-sm sm:p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Payment</p>
            <p className="mt-2 text-foreground">{money(order.amountCents, order.currency)} paid</p>
            <p className="text-muted-foreground">Shipping {money(order.shippingCents, order.currency)}</p>
            {order.discountCents > 0 && (
              <p className="text-muted-foreground">Discount −{money(order.discountCents, order.currency)}</p>
            )}
            <p className="text-muted-foreground">
              Points earned {order.pointsEarned} · redeemed {order.pointsRedeemed}
            </p>
            {order.refundedCents != null && order.refundedCents > 0 && (
              <p className="mt-2 text-destructive">
                Refunded {money(order.refundedCents, order.currency)}
                {order.refundedAt ? ` on ${new Date(order.refundedAt).toLocaleString('en-AU')}` : ''} — recorded from
                Stripe.
              </p>
            )}
            {order.deliveredAt && (
              <p className="mt-2 text-muted-foreground">
                Delivered {new Date(order.deliveredAt).toLocaleString('en-AU')} (confirmed by staff)
              </p>
            )}
            <p className="mt-2 break-all font-mono text-xs text-muted-foreground">
              {order.stripeSessionId ?? order.stripePaymentIntentId ?? '—'}
            </p>
          </div>
        </section>

        <section id="ops-pick-list" className="mt-4 scroll-mt-24 rounded-2xl border border-border p-4 sm:p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Pick list</p>
          <ul className="mt-3 divide-y divide-border text-sm">
            {order.lines.map((l, i) => (
              <li key={`${l.name}-${i}`} className="flex items-baseline justify-between gap-4 py-3">
                <span className="text-foreground">{l.name}</span>
                <span className="text-muted-foreground">× {l.quantity} · {money(l.amountCents, order.currency)}</span>
              </li>
            ))}
            {order.lines.length === 0 && <li className="py-3 text-muted-foreground">No line items recorded.</li>}
          </ul>
        </section>

        <section id="ops-fulfilment" className="mt-4 scroll-mt-24 rounded-2xl border border-border p-4 sm:p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Fulfilment</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[...FULFILMENT_STAGES.filter((f) => f !== 'delivered'), 'cancelled'].map((s) => (
              <button
                key={s}
                type="button"
                disabled={mutate.isPending || order.fulfillmentStatus === s || (s === 'shipped' && dispatchBlocked)}
                title={
                  s === 'shipped' && dispatchBlocked
                    ? 'Add a carrier and a valid tracking number first, or tick the override below.'
                    : undefined
                }
                onClick={() => {
                  if (s === 'shipped' && dispatchBlocked) return;
                  // Dispatch and cancel are customer-visible and one-way — confirm first.
                  if (s === 'shipped' &&
                    !window.confirm(
                      `Mark this order dispatched?\n\nThis sends the customer the dispatch email once, with ${carrier || 'no carrier'} tracking ${tracking || '(none)'}.`,
                    )
                  ) return;
                  if (s === 'cancelled' && !window.confirm('Mark this order cancelled? This does not refund the customer — refunds are processed in Stripe.')) return;
                  mutate.mutate({
                    id: order.id,
                    fulfillmentStatus: s,
                    // Persist what the form is showing so dispatch can never be
                    // recorded with tracking that was typed but never saved.
                    ...(s === 'shipped' ? { shippingCarrier: carrier, trackingNumber: tracking } : {}),
                  });
                }}
                className={`rounded-full border px-4 py-2 text-sm disabled:opacity-60 ${
                  order.fulfillmentStatus === s
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border text-muted-foreground hover:border-foreground'
                }`}
              >
                {STAGE_LABEL[s] ?? s}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {order.packedAt ? `Packed ${new Date(order.packedAt).toLocaleString('en-AU')}. ` : ''}
            {order.shippedAt ? `Dispatched ${new Date(order.shippedAt).toLocaleString('en-AU')}. ` : ''}
            {order.fulfillmentUpdatedAt
              ? `Last updated ${new Date(order.fulfillmentUpdatedAt).toLocaleString('en-AU')}.`
              : 'No fulfilment activity yet.'}
          </p>

          <div className="mt-3 rounded-xl border border-border p-3 text-xs">
            <p className="text-foreground">Delivered</p>
            <p className="mt-1 text-muted-foreground">
              Australia Post MyPost Business gives this account no delivery API, so delivery is confirmed by a human.
              Marking delivered sends the customer the Delivered email once.
            </p>
            <button
              type="button"
              disabled={
                deliver.isPending ||
                order.fulfillmentStatus === 'delivered' ||
                order.fulfillmentStatus !== 'shipped'
              }
              onClick={() => {
                if (!window.confirm('Confirm this parcel was delivered?\n\nThis marks the order Delivered and sends the customer the Delivered email once. It cannot be undone from here.')) return;
                deliver.mutate();
              }}
              className="mt-3 rounded-full border border-border px-4 py-2 text-xs hover:border-foreground disabled:opacity-60"
            >
              {order.fulfillmentStatus === 'delivered'
                ? 'Delivered'
                : deliver.isPending
                  ? 'Marking…'
                  : 'Mark delivered'}
            </button>
            {order.fulfillmentStatus !== 'shipped' && order.fulfillmentStatus !== 'delivered' && (
              <span className="ml-3 text-muted-foreground">Dispatch the order first.</span>
            )}
            {deliver.isError && <span className="ml-3 text-destructive">{(deliver.error as Error).message}</span>}
          </div>

          <div className="mt-3 rounded-xl border border-border bg-secondary/60 p-3 text-xs">
            {dispatchReady ? (
              <p className="text-foreground">
                Ready to dispatch — {carrier} tracking <span className="font-mono">{tracking}</span> is recorded.
              </p>
            ) : (
              <>
                <p className="text-destructive">
                  Dispatch is locked: enter a carrier and the tracking / consignment number from the carrier portal
                  below, then save. Never invent a number.
                </p>
                <label className="mt-2 flex items-start gap-2 text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={overrideDispatch}
                    onChange={(e) => setOverrideDispatch(e.target.checked)}
                    className="mt-0.5 h-4 w-4"
                  />
                  <span>
                    Override — mark dispatched without tracking (e.g. hand delivery or pickup). The customer will see
                    no tracking for this order.
                  </span>
                </label>
              </>
            )}
          </div>

          <form
            id="ops-shipping-form"
            className="mt-5 grid scroll-mt-24 gap-4 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              mutate.mutate({
                id: order.id,
                trackingNumber: tracking,
                shippingCarrier: carrier,
                shippingService: service,
                shipmentId: shipmentId,
                labelUrl: labelUrl,
                labelReference: labelRef,
                shippingCostActualCents: labelCost.trim() === '' ? null : Math.round(Number(labelCost) * 100),
                opsNotes: notes,
              });
            }}
          >
            <div>
              <label htmlFor="carrier" className="text-sm text-foreground">Carrier</label>
              <input
                id="carrier"
                list="carrier-options"
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              />
              <datalist id="carrier-options">
                {CARRIERS.map((c) => <option key={c.id} value={c.label} />)}
              </datalist>
            </div>
            <div>
              <label htmlFor="service" className="text-sm text-foreground">Service</label>
              <input
                id="service"
                list="service-options"
                value={service}
                onChange={(e) => setService(e.target.value)}
                placeholder="e.g. Parcel Post"
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              />
              <datalist id="service-options">
                {selectedCarrier?.services.map((s) => <option key={s} value={s} />)}
              </datalist>
            </div>
            <div>
              <label htmlFor="tracking" className="text-sm text-foreground">Tracking / consignment number</label>
              <input
                id="tracking"
                value={tracking}
                onChange={(e) => setTracking(e.target.value)}
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 font-mono text-sm outline-none focus:border-primary"
              />
              {trackUrl && (
                <a href={trackUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs underline text-muted-foreground">
                  {trackingLinkLabel(carrier)}
                </a>
              )}
            </div>
            <div>
              <label htmlFor="shipment" className="text-sm text-foreground">Shipment / order ID in carrier portal</label>
              <input
                id="shipment"
                value={shipmentId}
                onChange={(e) => setShipmentId(e.target.value)}
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 font-mono text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="label-url" className="text-sm text-foreground">Label link (https)</label>
              <input
                id="label-url"
                type="url"
                value={labelUrl}
                onChange={(e) => setLabelUrl(e.target.value)}
                placeholder="Paste the label PDF link if your carrier gives one"
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="label-ref" className="text-sm text-foreground">Label reference</label>
              <input
                id="label-ref"
                value={labelRef}
                onChange={(e) => setLabelRef(e.target.value)}
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="label-cost" className="text-sm text-foreground">Actual postage cost (AUD)</label>
              <input
                id="label-cost"
                type="number"
                min="0"
                step="0.01"
                value={labelCost}
                onChange={(e) => setLabelCost(e.target.value)}
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Customer paid {money(order.shippingCents, order.currency)} shipping.
              </p>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="notes" className="text-sm text-foreground">Internal note</label>
              <textarea
                id="notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Only visible to staff — e.g. awaiting restock, customer requested delay."
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </div>
            <div className="sm:col-span-2 flex items-center gap-3">
              <button
                type="submit"
                disabled={mutate.isPending}
                className="rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground hover:opacity-90 disabled:opacity-60"
              >
                {mutate.isPending ? 'Saving…' : 'Save shipping details'}
              </button>
              {mutate.isError && <span className="text-sm text-destructive">{(mutate.error as Error).message}</span>}
              {mutate.isSuccess && !mutate.isPending && <span className="text-sm text-muted-foreground">Saved.</span>}
            </div>
          </form>
          <p className="mt-4 text-xs text-muted-foreground">
            Customers see the stage and tracking number on <Link to="/track" className="underline">/track</Link> and in
            their account.
          </p>
        </section>

        <div id="ops-authenticity" className="scroll-mt-24">
          <AuthenticityPanel orderId={order.id} enabled={Boolean(user)} />
        </div>

        <section className="mt-4 rounded-2xl border border-border p-4 text-sm sm:p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Customer communication — staff only</p>

          {comms.isLoading && <p className="mt-2 text-muted-foreground">Loading communication status…</p>}

          {comms.data && (
            <>
              <p className="mt-2 text-muted-foreground">
                Email provider: <strong className="text-foreground">{comms.data.capability.providerLabel}</strong>
                {!comms.data.capability.configured && ' — nothing is sent automatically yet.'}
              </p>

              <dl className="mt-4 space-y-2">
                {(['order_confirmation', 'dispatch', 'delivery', 'cancellation'] as const).map((kind) => {
                  const record = comms.data!.notifications.find((n) => n.kind === kind) ?? null;
                  const label =
                    kind === 'dispatch'
                      ? 'Dispatch email'
                      : kind === 'delivery'
                        ? 'Delivered email'
                        : kind === 'cancellation'
                          ? 'Cancellation / refund email'
                          : 'Order confirmation';
                  const state = record?.status ?? 'no record yet';
                  return (
                    <div key={kind} className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border/60 pb-2">
                      <dt className="text-foreground">{label}</dt>
                      <dd className="flex flex-wrap items-baseline gap-2 text-muted-foreground">
                        <span>
                          {STATUS_COPY[state] ?? state}
                          {record?.recipientMasked ? ` · ${record.recipientMasked}` : ''}
                          {record?.sentAt ? ` · ${new Date(record.sentAt).toLocaleString('en-AU')}` : ''}
                          {record?.error ? ` · ${record.error}` : ''}
                        </span>
                        {comms.data!.capability.configured && (
                          <button
                            type="button"
                            onClick={() => resend.mutate(kind)}
                            title={kind === 'dispatch' && !comms.data!.dispatchReady ? comms.data!.dispatchBlockedReason ?? undefined : undefined}
                            disabled={resend.isPending || (kind === 'dispatch' && !comms.data!.dispatchReady)}
                            className="rounded-full border border-border px-3 py-1 text-xs hover:border-foreground disabled:opacity-60"
                          >
                            {state === 'sent' ? 'Resend' : 'Send'}
                          </button>
                        )}
                      </dd>
                    </div>
                  );
                })}
              </dl>
              {resend.isError && (
                <p className="mt-2 text-xs text-destructive">{(resend.error as Error).message}</p>
              )}
              {resend.isSuccess && !resend.isPending && (
                <p className="mt-2 text-xs text-muted-foreground">Last action: {resend.data?.status}{resend.data?.reason ? ` (${resend.data.reason})` : ''}</p>
              )}

              {!comms.data.capability.configured && (
                <p className="mt-4 rounded-xl bg-muted/50 p-3 text-xs text-muted-foreground">
                  Setup note: no transactional email sender is connected, so Skin Grocer has sent no order or dispatch
                  email. Stripe still emails its own payment receipt if receipts are enabled in Stripe, and account /
                  password emails come from the auth system. Connect a verified sender domain to switch these rows from
                  “not configured” to real sends — templates, ledger and triggers are already in place.
                </p>
              )}


              {comms.data.dispatchMessage ? (
                <div className="mt-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    Manual dispatch message (copy &amp; paste)
                  </p>
                  <pre className="mt-2 max-h-56 overflow-auto whitespace-pre-wrap rounded-xl border border-border bg-background p-3 text-xs text-foreground">
{comms.data.dispatchMessage}
                  </pre>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        void navigator.clipboard.writeText(comms.data!.dispatchMessage!).then(() => {
                          setCopied(true);
                          window.setTimeout(() => setCopied(false), 2000);
                        });
                      }}
                      className="rounded-full border border-border px-4 py-2 text-xs hover:border-foreground"
                    >
                      {copied ? 'Copied' : 'Copy message'}
                    </button>
                    {comms.data.capability.configured && (
                      <button
                        type="button"
                        onClick={() => resend.mutate('dispatch')}
                        disabled={resend.isPending}
                        className="rounded-full border border-border px-4 py-2 text-xs hover:border-foreground disabled:opacity-60"
                      >
                        {resend.isPending ? 'Sending…' : 'Send dispatch email'}
                      </button>
                    )}
                    {resend.isError && <span className="text-xs text-destructive">{(resend.error as Error).message}</span>}
                  </div>
                </div>
              ) : (
                <div className="mt-4 rounded-xl border border-dashed border-border p-3 text-xs text-muted-foreground">
                  <p className="font-medium text-foreground">Dispatch message not available yet</p>
                  <p className="mt-1">
                    {comms.data.dispatchBlockedReason ??
                      'Not ready — add valid Australia Post shipping/tracking details and complete dispatch first.'}
                  </p>
                  <p className="mt-1">
                    Workflow: buy the label in MyPost Business → save carrier, service and tracking number above → mark
                    the order Dispatched. The customer message is then generated from the saved tracking details.
                  </p>
                </div>
              )}

            </>
          )}
        </section>

        <section className="mt-4 rounded-2xl border border-dashed border-border p-5 text-sm">
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Shipping integration — staff only</p>
          {capability.data?.automated ? (
            <p className="mt-2 text-foreground">
              Automated labels available via{' '}
              {capability.data.providers.filter((p) => p.id !== 'manual' && p.configured).map((p) => p.label).join(', ')}.
            </p>
          ) : (
            <>
              <p className="mt-2 font-medium text-foreground">
                Australia Post MyPost Business — manual tracking workflow active
              </p>
              <p className="mt-2 text-muted-foreground">
                Label automation is <strong>not connected</strong>. Buy the label in MyPost Business, then paste the
                consignment / article number into the tracking field above. Nothing here creates labels or reads live
                carrier status.
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Order record — provider: {order.shippingProvider} · label status: {order.labelStatus}
                {order.dispatchedAt ? ` · dispatched ${new Date(order.dispatchedAt).toLocaleString('en-AU')}` : ''}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                To automate later: MyPost Business accounts integrate through an authorised Australia Post eCommerce
                shipping partner; direct Shipping &amp; Tracking API access is for eParcel contract accounts. Either
                path plugs into the same order fields — the admin screens do not change.
              </p>
            </>
          )}
        </section>
      </main>
    </>
  );
}
