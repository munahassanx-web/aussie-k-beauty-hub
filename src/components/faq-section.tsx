import type { Faq } from '@/lib/faqs';

type Props = {
  /** Anchor id so the section can be linked and cited directly. */
  id?: string;
  eyebrow?: string;
  title: string;
  intro?: string;
  items: Faq[];
  tone?: 'light' | 'sand';
};

/**
 * Semantic, crawler-friendly FAQ block.
 *
 * Every question is a real heading and every answer is plain text in the DOM
 * (details elements stay expanded for assistive tech and machine readers via
 * the `open` attribute on the first item and no JS-gated content).
 */
export function FaqSection({ id = 'faq', eyebrow = 'FAQ', title, intro, items, tone = 'light' }: Props) {
  if (items.length === 0) return null;

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={tone === 'sand' ? 'bg-sand' : 'bg-background'}
    >
      <div className="mx-auto max-w-4xl px-6 py-20">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">{eyebrow}</p>
        <h2 id={`${id}-heading`} className="mt-3 font-display text-4xl text-foreground md:text-5xl">
          {title}
        </h2>
        {intro && <p className="mt-5 max-w-2xl text-muted-foreground">{intro}</p>}

        <div className="mt-10 divide-y divide-border border-y border-border">
          {items.map((f, i) => (
            <details key={f.q} name={id} open={i === 0} className="group py-5">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
                <h3 className="font-display text-lg leading-snug text-foreground md:text-xl">
                  {f.q}
                </h3>
                <span
                  aria-hidden="true"
                  className="mt-1 shrink-0 text-lg text-muted-foreground transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <div className="mt-3 max-w-3xl space-y-3">
                <div className="text-[15px] leading-relaxed text-muted-foreground">{f.a}</div>
                {f.points && f.points.length > 0 && (
                  <ul className="ml-5 list-disc space-y-1.5 text-[15px] leading-relaxed text-muted-foreground">
                    {f.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                )}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
