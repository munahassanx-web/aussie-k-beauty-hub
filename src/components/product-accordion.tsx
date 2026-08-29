import { useEffect, useState, type ReactNode } from 'react';

/**
 * Vertically scannable disclosure used for the product detail sections.
 * Hairline rules only — no cards, shadows or pills.
 */
export function ProductAccordion({
  items,
}: {
  items: { id: string; title: string; defaultOpen?: boolean; content: ReactNode }[];
}) {
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(items.map((i) => [i.id, Boolean(i.defaultOpen)])),
  );

  // Deep links such as /product/x#ingredients open and scroll to that section.
  useEffect(() => {
    const target = window.location.hash.replace('#', '');
    if (!target || !items.some((i) => i.id === target)) return;
    setOpen((p) => ({ ...p, [target]: true }));
    window.requestAnimationFrame(() => {
      document.getElementById(`section-${target}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [items]);

  return (
    <div className="border-t border-border">
      {items.map((item) => {
        const isOpen = Boolean(open[item.id]);
        return (
          <section key={item.id} id={`section-${item.id}`} className="scroll-mt-28 border-b border-border">

            <h2>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`panel-${item.id}`}
                onClick={() => setOpen((p) => ({ ...p, [item.id]: !p[item.id] }))}
                className="flex min-h-14 w-full items-center justify-between gap-6 py-5 text-left"
              >
                <span className="font-display text-lg text-foreground">{item.title}</span>
                <span
                  aria-hidden="true"
                  className={`text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
                >
                  +
                </span>
              </button>
            </h2>
            <div id={`panel-${item.id}`} hidden={!isOpen} className="pb-8">
              {item.content}
            </div>
          </section>
        );
      })}
    </div>
  );
}
