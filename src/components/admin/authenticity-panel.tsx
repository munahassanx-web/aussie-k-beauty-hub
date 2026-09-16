import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import {
  getOrderAuthenticityCards,
  getAuthenticityItemDraft,
  issueAuthenticityCard,
  revokeAuthenticityCard,
  type OpsCard,
  type VerificationItemEvidence,
} from '@/lib/authenticity.functions';
import { CHECK_LABELS_OPS, OPTIONAL_CHECKS, REQUIRED_CHECKS, type CheckKey } from '@/lib/authenticity-checks';
import { AuthenticityCardPrint } from '@/components/admin/authenticity-card-print';

const STATUS_COPY: Record<string, string> = {
  active: 'Active',
  revoked: 'Revoked',
  superseded: 'Superseded',
};

function printCard() {
  document.documentElement.classList.add('printing-card');
  window.print();
  window.setTimeout(() => document.documentElement.classList.remove('printing-card'), 500);
}

function when(value: string | null) {
  return value ? new Date(value).toLocaleString('en-AU') : '—';
}

/**
 * Operations panel for the per-order authenticity card. Everything here is
 * additive: it never touches fulfilment state, payment, shipping or email.
 */
export function AuthenticityPanel({ orderId, enabled }: { orderId: string; enabled: boolean }) {
  const qc = useQueryClient();
  const fetchCards = useServerFn(getOrderAuthenticityCards);
  const fetchDraft = useServerFn(getAuthenticityItemDraft);
  const issue = useServerFn(issueAuthenticityCard);
  const revoke = useServerFn(revokeAuthenticityCard);

  const q = useQuery({
    queryKey: ['authenticity-cards', orderId],
    queryFn: () => fetchCards({ data: { orderId } }),
    enabled,
    retry: false,
  });

  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [reason, setReason] = useState('');
  const [items, setItems] = useState<VerificationItemEvidence[]>([]);
  // The raw token exists only in this browser session, for printing.
  const [issued, setIssued] = useState<{ cardRef: string; verifyUrl: string } | null>(null);

  const cards = (q.data ?? []) as OpsCard[];
  const draft = useQuery({
    queryKey: ['authenticity-item-draft', orderId],
    queryFn: () => fetchDraft({ data: { orderId } }),
    enabled,
    retry: false,
  });
  useEffect(() => {
    if (draft.data?.length) setItems(draft.data);
  }, [draft.data]);
  const active = cards.find((c) => c.status === 'active') ?? null;
  const itemEvidenceComplete = items.length > 0 && items.every((item) =>
    Boolean(item.size.trim() && item.supplier && item.receivedInMelbourneOn && item.checkedOn && item.batchCode.trim() && item.packagingSealStatus.trim() && item.productCondition.trim()) &&
    Boolean((item.printedDateType && item.printedDate) || (!item.printedDateType && !item.printedDate)),
  );
  const readyToIssue = REQUIRED_CHECKS.every((k) => checks[k] === true) && itemEvidenceComplete;

  const issueMutation = useMutation({
    mutationFn: () => issue({ data: { orderId, checklist: checks, items, reason: reason.trim() || null } }),
    onSuccess: (res) => {
      setIssued({
        cardRef: res.cardRef,
        verifyUrl: `${window.location.origin}${res.verifyPath}`,
      });
      setChecks({});
      setReason('');
      void qc.invalidateQueries({ queryKey: ['authenticity-cards', orderId] });
    },
  });

  const revokeMutation = useMutation({
    mutationFn: (vars: { cardId: string; reason: string }) => revoke({ data: vars }),
    onSuccess: () => {
      setIssued(null);
      void qc.invalidateQueries({ queryKey: ['authenticity-cards', orderId] });
    },
  });

  return (
    <>
      {issued && <AuthenticityCardPrint cardRef={issued.cardRef} verifyUrl={issued.verifyUrl} />}

      <section className="mt-4 rounded-2xl border border-border p-4 text-sm sm:p-5 print:hidden">
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Authenticity card — staff only</p>

        {q.isLoading && <p className="mt-3 text-muted-foreground">Loading card status…</p>}
        {q.isError && <p className="mt-3 text-destructive">{(q.error as Error).message}</p>}

        {active ? (
          <div className="mt-4 rounded-xl border border-border bg-secondary/50 p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <p className="font-mono text-base tracking-[0.1em] text-foreground">{active.cardRef}</p>
              <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                {STATUS_COPY[active.status]} · v{active.version}
              </span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Issued {when(active.issuedAt)} · Verified {when(active.verifiedAt)} · Scans {active.scanCount}
              {active.lastScannedAt ? ` · last ${when(active.lastScannedAt)}` : ''}
            </p>
            <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
              {[...REQUIRED_CHECKS, ...OPTIONAL_CHECKS]
                .filter((k) => active.checklist[k])
                .map((k) => (
                  <li key={k}>✓ {CHECK_LABELS_OPS[k as CheckKey]}</li>
                ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={!issued}
                title={issued ? undefined : 'The QR can only be printed in the session it was issued. Reissue to print again.'}
                onClick={printCard}
                className="rounded-full border border-border px-4 py-2 text-xs hover:border-foreground disabled:opacity-50"
              >
                Print card
              </button>
              <button
                type="button"
                disabled={revokeMutation.isPending}
                onClick={() => {
                  const r = window.prompt('Reason for revoking this card? (e.g. return, misprint, duplicate)');
                  if (!r || r.trim().length < 3) return;
                  revokeMutation.mutate({ cardId: active.id, reason: r.trim() });
                }}
                className="rounded-full border border-border px-4 py-2 text-xs text-destructive hover:border-destructive disabled:opacity-50"
              >
                Revoke card
              </button>
            </div>
            {!issued && (
              <p className="mt-3 text-xs text-muted-foreground">
                The QR value is stored one-way only, so it can be printed just once. If the card is lost or misprinted,
                reissue below — the old card stops verifying immediately.
              </p>
            )}
            {revokeMutation.isError && (
              <p className="mt-2 text-xs text-destructive">{(revokeMutation.error as Error).message}</p>
            )}
          </div>
        ) : (
          !q.isLoading && (
            <p className="mt-3 text-muted-foreground">No active card for this order yet.</p>
          )
        )}

        {issued && (
          <div className="mt-4 rounded-xl border border-primary/40 bg-primary/5 p-4">
            <p className="text-foreground">Card {issued.cardRef} issued. Print it now — the QR cannot be recovered later.</p>
            <p className="mt-1 break-all font-mono text-xs text-muted-foreground">{issued.verifyUrl}</p>
            <button
              type="button"
              onClick={printCard}
              className="mt-3 rounded-full bg-primary px-5 py-2.5 text-xs text-primary-foreground hover:opacity-90"
            >
              Print authenticity card
            </button>
          </div>
        )}

        <div className="mt-5 border-t border-border pt-4">
          <p className="text-foreground">{active ? 'Reissue card' : 'Issue card'}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Only tick what you actually checked — each tick is published on the customer&rsquo;s verification page.
          </p>

          <fieldset className="mt-3 space-y-2">
            {[...REQUIRED_CHECKS, ...OPTIONAL_CHECKS].map((key) => (
              <label key={key} className="flex items-start gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={checks[key] === true}
                  onChange={(e) => setChecks((prev) => ({ ...prev, [key]: e.target.checked }))}
                  className="mt-0.5 h-4 w-4"
                />
                <span>
                  {CHECK_LABELS_OPS[key as CheckKey]}
                  {(REQUIRED_CHECKS as readonly string[]).includes(key) && <span className="text-destructive"> *</span>}
                </span>
              </label>
            ))}
          </fieldset>

          <div className="mt-5 space-y-4 border-t border-border pt-4">
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Products verified in this parcel</p>
            {items.map((item, index) => {
              const update = (field: keyof VerificationItemEvidence, value: string) =>
                setItems((current) => current.map((entry, i) => i === index ? { ...entry, [field]: value } : entry));
              return (
                <fieldset key={`${item.sku ?? item.productName}-${index}`} className="grid gap-3 rounded-xl border border-border p-4 sm:grid-cols-2">
                  <legend className="px-1 text-sm text-foreground">{item.brand ? `${item.brand} ` : ''}{item.productName} × {item.quantity}</legend>
                  <label className="text-xs text-muted-foreground">Size<input value={item.size} onChange={(e) => update('size', e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" required /></label>
                  <label className="text-xs text-muted-foreground">Supplier<select value={item.supplier} onChange={(e) => update('supplier', e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" required><option value="">Select</option><option value="UMMA">UMMA</option><option value="Seoul4PM">Seoul4PM</option></select></label>
                  <label className="text-xs text-muted-foreground">Received in Melbourne<input type="date" value={item.receivedInMelbourneOn} onChange={(e) => update('receivedInMelbourneOn', e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" required /></label>
                  <label className="text-xs text-muted-foreground">Checked by Skin Grocer<input type="date" value={item.checkedOn} onChange={(e) => update('checkedOn', e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" required /></label>
                  <label className="text-xs text-muted-foreground">Batch or lot code<input value={item.batchCode} onChange={(e) => update('batchCode', e.target.value)} placeholder="Exactly as printed" className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" required /></label>
                  <label className="text-xs text-muted-foreground">Printed date type<select value={item.printedDateType} onChange={(e) => update('printedDateType', e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"><option value="">Not printed / not recorded</option><option value="Expiry date">Expiry date</option><option value="Manufactured date">Manufactured date</option></select></label>
                  {item.printedDateType && <label className="text-xs text-muted-foreground">{item.printedDateType}<input type="date" value={item.printedDate} onChange={(e) => update('printedDate', e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" required /></label>}
                  <label className="text-xs text-muted-foreground">Packaging and seal status<input value={item.packagingSealStatus} onChange={(e) => update('packagingSealStatus', e.target.value)} placeholder="Record observed condition" className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" required /></label>
                  <label className="text-xs text-muted-foreground">Product condition<input value={item.productCondition} onChange={(e) => update('productCondition', e.target.value)} placeholder="Record observed condition" className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" required /></label>
                </fieldset>
              );
            })}
          </div>

          {active && (
            <div className="mt-3">
              <label htmlFor="reissue-reason" className="text-sm text-foreground">
                Reissue reason <span className="text-destructive">*</span>
              </label>
              <input
                id="reissue-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. card misprinted at packing"
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </div>
          )}

          <button
            type="button"
            disabled={issueMutation.isPending || !readyToIssue || (Boolean(active) && reason.trim().length < 3)}
            onClick={() => {
              if (active && !window.confirm('Reissue this card? The current card stops verifying immediately.')) return;
              issueMutation.mutate();
            }}
            className="mt-4 rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {issueMutation.isPending ? 'Issuing…' : active ? 'Reissue card' : 'Issue card'}
          </button>
          {!readyToIssue && (
            <span className="ml-3 text-xs text-muted-foreground">Complete the checklist and every product record first.</span>
          )}
          {issueMutation.isError && (
            <p className="mt-2 text-sm text-destructive">{(issueMutation.error as Error).message}</p>
          )}
        </div>

        {cards.length > 1 && (
          <div className="mt-5 border-t border-border pt-4">
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Card history</p>
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              {cards.map((c) => (
                <li key={c.id}>
                  v{c.version} · <span className="font-mono">{c.cardRef}</span> · {STATUS_COPY[c.status]} ·{' '}
                  {when(c.issuedAt)}
                  {c.revokedReason ? ` · ${c.revokedReason}` : ''}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </>
  );
}
