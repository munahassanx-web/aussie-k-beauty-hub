import { createFileRoute, Link } from '@tanstack/react-router';
import {
  ROUTINE_EDITS,
  routineMoney,
  routinePrice,
  routineProduct,
  type RoutineEdit,
} from '@/lib/routine-edits';

export const Route = createFileRoute('/routines/')({
  head: () => ({
    meta: [
      { title: 'Routine Edits — Skin Grocer' },
      {
        name: 'description',
        content:
          'Three considered Korean skincare starting routines — hydration, tone support and barrier comfort. Three products, three clear roles, current pricing.',
      },
      { property: 'og:title', content: 'Routine Edits — Skin Grocer' },
      {
        property: 'og:description',
        content: 'Three products. Three clear roles. Considered starting routines from Skin Grocer.',
      },
      { property: 'og:url', content: 'https://skingrocer.com.au/routines' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
    ],
    links: [{ rel: 'canonical', href: 'https://skingrocer.com.au/routines' }],
  }),
  component: RoutinesIndex,
});

const DESTINATIONS = {
  'essential-hydration': '/routines/essential-hydration',
  'tone-glow-support': '/routines/tone-glow-support',
  'barrier-comfort': '/routines/barrier-comfort',
} as const;

function RoutineCard({ edit }: { edit: RoutineEdit }) {
  const total = edit.core.reduce((sum, slot) => sum + routinePrice(slot.priceId), 0);

  return (
    <article className="flex flex-col border border-border/70 bg-paper transition duration-300 hover:border-ink/40">
      <div className={`grid grid-cols-3 gap-px ${edit.field}`}>
        {edit.core.map((slot) => {
          const product = routineProduct(slot.priceId);
          if (!product) return null;
          return (
            <div key={slot.priceId} className="flex flex-col items-center justify-end px-2 pb-4 pt-6">
              <img
                src={product.image}
                alt={`${product.brand} ${product.name}`}
                loading="lazy"
                width={240}
                height={300}
                className="h-24 w-full object-contain mix-blend-multiply md:h-28"
              />
              <p className="mt-3 text-center text-[9px] font-semibold uppercase tracking-[0.14em] text-ink/55">
                {slot.role}
              </p>
            </div>
          );
        })}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className={`text-[11px] font-semibold uppercase tracking-[0.24em] ${edit.accent}`}>
          Edit {edit.number}
        </p>
        <h2 className="mt-2 font-display text-2xl leading-tight text-ink">{edit.name}</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink/70">
          <span className="font-semibold uppercase tracking-[0.14em] text-ink/50">Who it may suit:</span>{' '}
          {edit.purpose}
        </p>

        <ul className="mt-5 divide-y divide-border border-t border-border text-sm text-ink/80">
          {edit.core.map((slot) => {
            const product = routineProduct(slot.priceId);
            if (!product) return null;
            return (
              <li key={slot.priceId} className="py-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/50">
                  {slot.role}
                </p>
                <p className="mt-0.5">
                  {product.brand} {product.name}
                </p>
              </li>
            );
          })}
        </ul>

        <div className="mt-auto pt-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/55">
            Three products, current price
          </p>
          <p className="font-display text-3xl text-ink">{routineMoney(total)}</p>
          <Link
            to={DESTINATIONS[edit.id]}
            className="mt-4 inline-flex min-h-11 w-full items-center justify-center bg-ink px-5 text-xs font-semibold uppercase tracking-[0.2em] text-paper transition hover:opacity-90"
          >
            Review this routine →
          </Link>
        </div>
      </div>
    </article>
  );
}

function RoutinesIndex() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
      <header className="max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">Routine edits</p>
        <h1 className="mt-4 font-display text-4xl leading-[1.05] text-ink md:text-5xl">
          Three products. <span className="italic text-hanbok-deep">Three clear roles.</span>
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink/70">
          Considered starting routines for customers who want fewer decisions. Review each edit, remove
          products you already own and adjust gradually.
        </p>
      </header>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {ROUTINE_EDITS.map((edit) => (
          <RoutineCard key={edit.id} edit={edit} />
        ))}
      </div>

      <p className="mt-10 max-w-2xl text-xs leading-relaxed text-ink/55">
        Cosmetic products only. Introduce one product at a time and patch-test before full-face use. If
        irritation persists, stop use and consider speaking with a pharmacist or doctor.
      </p>
    </div>
  );
}
