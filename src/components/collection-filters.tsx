import { useEffect, useState } from 'react';
import {
  SORT_OPTIONS,
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
  onChange: (patch: Partial<Record<keyof Filters, string | undefined>>) => void;
  onSort: (sort: SortValue) => void;
  onClear: () => void;
};

function FacetList({
  options,
  active,
  onSelect,
}: {
  options: FacetOption[];
  active?: string;
  onSelect: (value: string | undefined) => void;
}) {
  return (
    <ul className="space-y-1.5">
      {options.map((o) => {
        const selected = active === o.value;
        return (
          <li key={o.value}>
            <button
              type="button"
              aria-pressed={selected}
              onClick={() => onSelect(selected ? undefined : o.value)}
              className={`flex w-full items-baseline justify-between gap-3 py-1.5 text-left text-sm transition-colors ${
                selected ? 'text-primary' : 'text-foreground/80 hover:text-foreground'
              }`}
            >
              <span className={selected ? 'underline underline-offset-4' : ''}>{o.label}</span>
              <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">{o.count}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function FilterGroups({ facets, filters, onChange }: Pick<Props, 'facets' | 'filters' | 'onChange'>) {
  return (
    <div className="divide-y divide-border">
      {GROUP_ORDER.map(({ key, title }) => {
        const options = facets[key as keyof FacetGroups];
        if (!options || options.length < 2) return null;
        return (
          <section key={key} className="py-6 first:pt-0">
            <h3 className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{title}</h3>
            <div className="mt-3">
              <FacetList
                options={options}
                active={filters[key] as string | undefined}
                onSelect={(value) => onChange({ [key]: value })}
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
  const chips = GROUP_ORDER.flatMap(({ key }) => {
    const value = filters[key];
    if (!value) return [];
    const label =
      facets[key as keyof FacetGroups]?.find((o) => o.value === value)?.label ?? String(value);
    return [{ key, label }];
  });

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      {chips.map((c) => (
        <button
          key={c.key}
          type="button"
          onClick={() => onChange({ [c.key]: undefined })}
          className="inline-flex items-center gap-2 border-b border-border py-1 text-xs text-foreground transition-colors hover:border-primary hover:text-primary"
        >
          {c.label}
          <span aria-hidden="true">×</span>
          <span className="sr-only">Remove filter</span>
        </button>
      ))}
      {chips.length > 1 && (
        <button
          type="button"
          onClick={onClear}
          className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
        >
          Clear all
        </button>
      )}
    </div>
  );
}

export function SortSelect({ sort, onSort }: Pick<Props, 'sort' | 'onSort'>) {
  return (
    <label className="inline-flex items-center gap-2 text-xs text-muted-foreground">
      <span className="uppercase tracking-[0.18em]">Sort</span>
      <select
        value={sort}
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

/** Mobile filter + sort sheet. */
export function FilterSheet(props: Props) {
  const [open, setOpen] = useState(false);
  const activeCount = GROUP_ORDER.filter(({ key }) => Boolean(props.filters[key])).length;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-11 items-center gap-2 border-b border-foreground px-1 py-2 text-xs uppercase tracking-[0.18em] text-foreground"
      >
        Filter &amp; sort
        {activeCount > 0 && <span className="tabular-nums text-primary">({activeCount})</span>}
      </button>

      {open && (
        <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Filter and sort">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setOpen(false)}
            className="absolute inset-0 h-full w-full cursor-default bg-ink/40"
          />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col bg-background">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <p className="font-display text-lg text-foreground">Filter &amp; sort</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
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
                <FilterGroups
                  facets={props.facets}
                  filters={props.filters}
                  onChange={props.onChange}
                />
              </div>
            </div>

            <div className="flex items-center gap-4 border-t border-border px-6 py-4">
              <button
                type="button"
                onClick={props.onClear}
                className="min-h-11 flex-1 border border-border text-xs uppercase tracking-[0.18em] text-foreground"
              >
                Clear all
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="min-h-11 flex-1 bg-primary text-xs uppercase tracking-[0.18em] text-primary-foreground"
              >
                Show {props.total} {props.total === 1 ? 'product' : 'products'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
