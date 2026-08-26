import { ROUTINE_ORDER_LABELS, type ProductGuide } from '@/lib/application-guides';

export function ApplicationGuideDetails({ guide }: { guide: ProductGuide }) {
  const rows = [
    { label: 'Routine step', value: guide.routine_step },
    { label: 'Amount to use', value: guide.amount_to_use },
    { label: 'How to apply', value: guide.how_to_apply },
    { label: 'Frequency', value: guide.frequency },
  ].filter((r) => Boolean(r.value));

  return (
    <div className="space-y-4">
      <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        Step {guide.routine_order} · {ROUTINE_ORDER_LABELS[guide.routine_order] ?? guide.routine_step}
      </p>
      <dl className="divide-y divide-border overflow-hidden rounded-2xl border border-border">
        {rows.map((r) => (
          <div key={r.label} className="grid gap-1 p-4 sm:grid-cols-[160px_1fr] sm:gap-4">
            <dt className="text-xs uppercase tracking-wider text-muted-foreground">{r.label}</dt>
            <dd className="text-sm text-foreground">{r.value}</dd>
          </div>
        ))}
      </dl>
      {guide.pro_tip && (
        <div className="rounded-2xl border-2 border-primary bg-secondary p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
            Pro tip
          </p>
          <p className="mt-2 text-sm text-foreground/85">{guide.pro_tip}</p>
        </div>
      )}
    </div>
  );
}
