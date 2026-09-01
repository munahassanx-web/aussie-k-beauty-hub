import { useEffect, useRef, useState } from 'react';
import {
  FILTER_KEYS,
  SORT_OPTIONS,
  activeFilterCount,
  toggleValue,
  type FacetOption,
  type Filters,
  type SortValue,
} from '@/lib/collection-filters';

export type FacetGroups = {
  category: FacetOption[];
  brand: FacetOption[];
  concern: FacetOption[];
  ingredient: FacetOption[];
  price: FacetOption[];
};

const GROUP_ORDER: { key: keyof Filters; title: string }[] = [
  { key: 'category', title: 'Routine step' },
  { key: 'concern', title: 'Skin concern' },
  { key: 'ingredient', title: 'Key ingredient' },
  { key: 'brand', title: 'Brand' },
  { key: 'price', title: 'Price' },
];

type Props = {
  facets: FacetGroups;
  filters: Filters;
  sort: SortValue;
  total: number;
  /** Count for a candidate filter state — used by the staged mobile sheet. */
  countFor?: (filters: Filters) => number;
  onChange: (next: Filters) => void;
  onSort: (sort: SortValue) => void;
  onClear: () => void;
};

function FacetList({
  options,
  active,
  onToggle,
}: {
  options: FacetOption[];
  active: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <ul className="space-y-1">
      {options.map((o) => {
        const selected = active.includes(o.value);
        return (
          <li key={o.value}>
            <button
              type="button"
              aria-pressed={selected}
              onClick={() => onToggle(o.value)}
              className={`flex min-h-11 w-full items-center justify-between gap-3 px-2 text-left text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:min-h-9 ${
                selected
                  ? 'bg-secondary font-medium text-foreground'
                  : 'text-foreground/80 hover:text-foreground'
              }`}
            >
              <span className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className={`flex h-4 w-4 shrink-0 items-center justify-center border text-[10px] leading-none ${
                    selected ? 'border-foreground bg-foreground text-background' : 'border-border'
                  }`}
                >
                  {selected ? '✓' : ''}
                </span>
                <span>{o.label}</span>
              </span>
              <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">{o.count}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function FilterGroups({
  facets,
  filters,
  onChange,
}: {
  facets: FacetGroups;
  filters: Filters;
  onChange: (next: Filters) => void;
}) {
  return (
    <div className="divide-y divide-border">
      {GROUP_ORDER.map(({ key, title }) => {
        const options = facets[key as keyof FacetGroups];
        if (!options || options.length === 0) return null;
        return (
          <section key={key} className="py-6 first:pt-0">
            <h3 className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{title}</h3>
            <div className="mt-3">
              <FacetList
                options={options}
                active={filters[key]}
                onToggle={(value) =>
                  onChange({ ...filters, [key]: toggleValue(filters[key], value) })
                }
              />
            </div>
          </section>
        );
      })}
    </div>
  );
}

export function AppliedFilters({
  facets,
  filters,
  onChange,
  onClear,
}: Pick<Props, 'facets' | 'filters' | 'onChange' | 'onClear'>) {
  const chips = GROUP_ORDER.flatMap(({ key }) =>
    filters[key].map((value) => ({
      key,
      value,
      label: facets[key as keyof FacetGroups]?.find((o) => o.value === value)?.label ?? value,
    })),
  );

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Filtered by</span>
      {chips.map((c) => (
        <button
          key={`${c.key}-${c.value}`}
          type="button"
          onClick={() =>
            onChange({ ...filters, [c.key]: filters[c.key].filter((v: string) => v !== c.value) })
          }
          className="inline-flex min-h-9 items-center gap-2 border border-border px-3 py-1 text-xs text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {c.label}
          <span aria-hidden="true">×</span>
          <span className="sr-only">Remove filter</span>
        </button>
      ))}
      <button
        type="button"
        onClick={onClear}
        className="min-h-9 px-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground underline underline-offset-4 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        Clear all
      </button>
    </div>
  );
}

export function SortSelect({ sort, onSort }: Pick<Props, 'sort' | 'onSort'>) {
  return (
    <label className="inline-flex items-center gap-2 text-xs text-muted-foreground">
      <span className="uppercase tracking-[0.18em]">Sort</span>
      <select
        value={sort}
        aria-label="Sort products"
        onChange={(e) => onSort(e.target.value as SortValue)}
        className="min-h-11 border-b border-border bg-transparent py-1 pr-6 text-sm text-foreground outline-none focus-visible:border-primary"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

/** Desktop sidebar. */
export function FilterSidebar(props: Props) {
  return (
    <aside aria-label="Filter products" className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
      <FilterGroups facets={props.facets} filters={props.filters} onChange={props.onChange} />
    </aside>
  );
}

/** Mobile filter + sort sheet — staged: nothing applies until Show is pressed. */
export function FilterSheet(props: Props) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Filters>(props.filters);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const activeCount = activeFilterCount(props.filters);
  const draftTotal = props.countFor ? props.countFor(draft) : props.total;

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    setDraft(props.filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const nodes = panelRef.current.querySelectorAll<HTMLElement>(
        'button, select, a[href], input, [tabindex]:not([tabindex="-1"])',
      );
      if (nodes.length === 0) return;
      const first = nodes[0]!;
      const last = nodes[nodes.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector<HTMLElement>('button, select')?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        className="inline-flex min-h-11 items-center gap-2 border-b border-foreground px-1 py-2 text-xs uppercase tracking-[0.18em] text-foreground"
      >
        Filter &amp; sort
        {activeCount > 0 && <span className="tabular-nums text-primary">({activeCount})</span>}
      </button>

      {open && (
        <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Filter and sort">
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={close}
            className="absolute inset-0 h-full w-full cursor-default bg-ink/40"
          />
          <div
            ref={panelRef}
            className="absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col bg-background"
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <p className="font-display text-lg text-foreground">Filter &amp; sort</p>
              <button
                type="button"
                onClick={close}
                className="min-h-11 px-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="pb-5">
                <SortSelect sort={props.sort} onSort={props.onSort} />
              </div>
              <div className="border-t border-border pt-5">
                <FilterGroups facets={props.facets} filters={draft} onChange={setDraft} />
              </div>
            </div>

            <div className="flex items-center gap-4 border-t border-border px-6 py-4">
              <button
                type="button"
                onClick={() => {
                  props.onClear();
                  close();
                }}
                className="min-h-11 flex-1 border border-border text-xs uppercase tracking-[0.18em] text-foreground"
              >
                Clear all
              </button>
              <button
                type="button"
                onClick={() => {
                  props.onChange(draft);
                  close();
                }}
                className="min-h-11 flex-1 bg-primary text-xs uppercase tracking-[0.18em] text-primary-foreground"
              >
                Show {draftTotal} {draftTotal === 1 ? 'product' : 'products'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { FILTER_KEYS };
