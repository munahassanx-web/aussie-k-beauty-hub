import { useQuery } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { getOrderAuthenticityCards, type OpsCard } from '@/lib/authenticity.functions';
import { isPlausibleTracking } from '@/lib/shipping/carriers';
import type { AdminOrderDetail } from '@/lib/admin-orders.functions';

/**
 * Operational "what do I do next?" guide for a single order.
 *
 * Read-only: it infers state from data the order already stores and links to
 * the existing controls below. It never performs fulfilment actions itself, so
 * every safeguard (authenticity checklist, tracking validation, dispatch
 * confirmation, cancellation-is-not-a-refund) stays exactly where it is.
 */

type StepState = 'done' | 'current' | 'upcoming' | 'unknown';

type Step = {
  key: string;
  title: string;
  /** Plain-English instruction shown when this is the current action. */
  instruction: string;
  /** Short evidence line: what the system actually knows. */
  detail: string;
  state: StepState;
  anchor?: string;
};

function scrollTo(anchor: string) {
  const el = document.getElementById(anchor);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function OrderWorkflowGuide({ order }: { order: AdminOrderDetail }) {
  const fetchCards = useServerFn(getOrderAuthenticityCards);
  // Shares the cache key with the authenticity panel below — no extra request.
  const cardsQuery = useQuery({
    queryKey: ['authenticity-cards', order.id],
    queryFn: () => fetchCards({ data: { orderId: order.id } }),
    retry: false,
  });

  const cards = (cardsQuery.data ?? []) as OpsCard[];
  const activeCard = cards.find((c) => c.status === 'active') ?? null;

  const stage = order.fulfillmentStatus;
  const packed = Boolean(order.packedAt) || stage === 'packed' || stage === 'shipped' || stage === 'delivered';
  const dispatched = stage === 'shipped' || stage === 'delivered';
  const trackingSaved =
    Boolean(order.shippingCarrier?.trim()) && isPlausibleTracking(order.shippingCarrier, order.trackingNumber);
  const labelEvidence = Boolean(
    order.shipmentId?.trim() ||
      order.labelReference?.trim() ||
      order.labelUrl?.trim() ||
      order.shippingCostActualCents != null,
  );

  const cancelled = stage === 'cancelled';

  const raw: Array<Omit<Step, 'state'> & { done: boolean; unknown?: boolean }> = [
    {
      key: 'pick',
      title: 'Pick products',
      instruction: 'Collect every item on the pick list below from the shelves and check quantities.',
      detail: packed
        ? 'Assumed done — this order has been marked packed.'
        : 'Physical step — the system cannot confirm it. Use the pick list below.',
      done: packed,
      unknown: !packed,
      anchor: 'ops-pick-list',
    },
    {
      key: 'verify',
      title: 'Complete authenticity checks',
      instruction: 'Tick only the checks you actually performed in the authenticity panel below.',
      detail: activeCard
        ? `Recorded with card ${activeCard.cardRef}.`
        : 'No verification recorded for this order yet.',
      done: Boolean(activeCard),
      anchor: 'ops-authenticity',
    },
    {
      key: 'card',
      title: 'Print / issue the QR authenticity card',
      instruction: 'Issue the card, then print it straight away — the QR can only be printed in that session.',
      detail: activeCard
        ? `Card ${activeCard.cardRef} issued (v${activeCard.version}). Printing itself is not tracked.`
        : 'Issuing the card requires the required checks above.',
      done: Boolean(activeCard),
      anchor: 'ops-authenticity',
    },
    {
      key: 'pack',
      title: 'Pack order',
      instruction: 'Pack the parcel with the card and packing slip, then set the stage to Packed.',
      detail: order.packedAt
        ? `Packed ${new Date(order.packedAt).toLocaleString('en-AU')}.`
        : packed
          ? 'Marked packed.'
          : 'Not marked packed yet.',
      done: packed,
      anchor: 'ops-fulfilment',
    },
    {
      key: 'label',
      title: 'Create Australia Post label in MyPost Business',
      instruction: 'Buy the label in MyPost Business — nothing here creates labels. The prep panel has every field to copy.',
      detail: labelEvidence
        ? 'Label details recorded on this order.'
        : trackingSaved
          ? 'Tracking recorded, no label reference or postage cost saved.'
          : 'Done in the carrier portal — the system cannot confirm it until details are saved.',
      done: labelEvidence || trackingSaved,
      unknown: !labelEvidence && !trackingSaved,
      anchor: 'ops-mypost',
    },
    {
      key: 'tracking',
      title: 'Save carrier, service, tracking and postage',
      instruction: 'Paste the consignment / article number from MyPost Business and save. Never invent a number.',
      detail: trackingSaved
        ? `${order.shippingCarrier} ${order.shippingService ? `· ${order.shippingService} ` : ''}· ${order.trackingNumber}`
        : 'No valid carrier + tracking number saved yet.',
      done: trackingSaved,
      anchor: 'ops-shipping-form',
    },
    {
      key: 'dispatch',
      title: 'Dispatch order',
      instruction: 'Mark the order Dispatched — this sends the customer the dispatch email once.',
      detail: order.shippedAt
        ? `Dispatched ${new Date(order.shippedAt).toLocaleString('en-AU')}.`
        : trackingSaved
          ? 'Ready — tracking is recorded.'
          : 'Locked until a carrier and valid tracking number are saved.',
      done: dispatched,
      anchor: 'ops-fulfilment',
    },
  ];

  const firstOpen = raw.findIndex((s) => !s.done);
  const steps: Step[] = raw.map((s, i) => ({
    key: s.key,
    title: s.title,
    instruction: s.instruction,
    detail: s.detail,
    anchor: s.anchor,
    state: cancelled
      ? s.done
        ? 'done'
        : 'upcoming'
      : s.done
        ? 'done'
        : i === firstOpen
          ? 'current'
          : 'upcoming',
  }));

  const current = cancelled ? null : (steps.find((s) => s.state === 'current') ?? null);
  const doneCount = steps.filter((s) => s.state === 'done').length;

  return (
    <section
      aria-labelledby="ops-guide-heading"
      className="mt-8 rounded-2xl border border-border bg-secondary/40 p-4 sm:p-6 print:hidden"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="ops-guide-heading" className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
          What do I do next?
        </h2>
        <p className="text-xs text-muted-foreground">
          {doneCount} of {steps.length} steps recorded
        </p>
      </div>

      {cancelled ? (
        <p className="mt-3 text-sm text-foreground">
          This order is cancelled — no further fulfilment steps. Cancelling does not refund the customer; refunds are
          processed in Stripe.
        </p>
      ) : current ? (
        <div className="mt-3 rounded-xl border border-foreground/20 bg-background p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Next action</p>
          <p className="mt-1 font-display text-xl text-foreground sm:text-2xl">{current.title}</p>
          <p className="mt-2 text-sm text-muted-foreground">{current.instruction}</p>
          {current.anchor && (
            <button
              type="button"
              onClick={() => scrollTo(current.anchor!)}
              className="mt-3 min-h-11 rounded-full bg-primary px-6 py-2.5 text-sm text-primary-foreground hover:opacity-90"
            >
              Go to this step
            </button>
          )}
        </div>
      ) : (
        <p className="mt-3 text-sm text-foreground">
          All fulfilment steps are recorded for this order.
        </p>
      )}

      <ol className="mt-4 space-y-1">
        {steps.map((s, i) => {
          const isCurrent = s.state === 'current';
          return (
            <li key={s.key}>
              <div
                className={`flex items-start gap-3 rounded-xl px-3 py-3 ${
                  isCurrent ? 'bg-background' : ''
                } ${s.state === 'upcoming' ? 'opacity-60' : ''}`}
              >
                <span
                  aria-hidden
                  className={`mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full border text-[11px] ${
                    s.state === 'done'
                      ? 'border-foreground bg-foreground text-background'
                      : isCurrent
                        ? 'border-foreground text-foreground'
                        : 'border-border text-muted-foreground'
                  }`}
                >
                  {s.state === 'done' ? '✓' : i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm ${s.state === 'done' ? 'text-muted-foreground' : 'text-foreground'}`}>
                    {s.title}
                    <span className="sr-only">
                      {' '}
                      — {s.state === 'done' ? 'completed' : isCurrent ? 'current action' : 'not ready yet'}
                    </span>
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{s.detail}</p>
                </div>
                {s.anchor && s.state !== 'upcoming' && (
                  <button
                    type="button"
                    onClick={() => scrollTo(s.anchor!)}
                    className="min-h-11 flex-none self-center rounded-full border border-border px-3 text-xs text-muted-foreground hover:border-foreground hover:text-foreground"
                  >
                    Open
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <p className="mt-3 text-xs text-muted-foreground">
        Picking, printing and buying the label happen off-system, so those lines show the safest state the stored order
        data supports rather than a confirmed tick.
      </p>
    </section>
  );
}
