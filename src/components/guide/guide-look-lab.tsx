import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { BadgeCheck, ChevronDown, Droplet, Layers, ShieldCheck } from 'lucide-react';
import { StepIllustration } from '@/components/guide/step-art';
import { GUIDE_CAUTION, GUIDE_SOURCING, type GuideView } from '@/components/guide/guide-data';

// Option B, "Ritual Lab": clean, precise and high-tech. Product in a lab-grid
// tile, an at-a-glance bento, a vertical illustrated timeline and a floating
// dark shop bar.

function Corner({ className }: { className: string }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute h-3 w-3 border-[color:var(--aisle-deep)]/50 ${className}`}
    />
  );
}

export function GuideLookLab({ view }: { view: GuideView }) {
  const { product, guide, aisle, colours, directions, ladder, ladderIndex, photo, size, price } =
    view;
  const [method, setMethod] = useState<'hands' | 'pad'>('hands');

  return (
    <article style={colours} className="mx-auto max-w-2xl px-4 pb-32 pt-5 sm:px-6 sm:pt-10">
      <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
        <span>How to use</span>
        <span className="tabular-nums">
          Guide · {aisle.number} {aisle.name}
        </span>
      </div>

      {/* Product tile */}
      <div
        className="relative mt-3 flex aspect-[4/3.6] items-center justify-center overflow-hidden rounded-[1.75rem] bg-white ring-1 ring-border"
        style={{
          backgroundImage:
            'linear-gradient(color-mix(in oklab, var(--aisle) 30%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklab, var(--aisle) 30%, transparent) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
          backgroundPosition: 'center',
        }}
      >
        <div
          aria-hidden="true"
          className="absolute h-[70%] w-[70%] rounded-full opacity-90 blur-2xl"
          style={{ background: 'radial-gradient(circle, var(--aisle) 0%, transparent 70%)' }}
        />
        <Corner className="left-4 top-4 border-l-2 border-t-2" />
        <Corner className="right-4 top-4 border-r-2 border-t-2" />
        <Corner className="bottom-4 left-4 border-b-2 border-l-2" />
        <Corner className="bottom-4 right-4 border-b-2 border-r-2" />
        <img
          src={product.image}
          alt={`${product.brand} ${product.name}`}
          className="relative h-[80%] w-auto max-w-[70%] object-contain drop-shadow-[0_16px_20px_rgba(58,38,32,.2)]"
        />
        <span className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/85 px-3 py-1 text-[11px] font-medium text-ink shadow-sm ring-1 ring-border backdrop-blur">
          {directions.fromBrand ? (
            <span className="inline-flex items-center gap-1.5">
              <BadgeCheck className="h-3.5 w-3.5 text-[color:var(--aisle-deep)]" aria-hidden="true" />
              Directions from {product.brand}
            </span>
          ) : (
            'General routine guidance'
          )}
        </span>
      </div>

      <header className="mt-6">
        <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[color:var(--aisle-deep)]">
          {product.brand}
        </p>
        <h1 className="mt-1.5 text-[2rem] font-light leading-[1.08] tracking-[-0.025em] text-ink sm:text-[2.6rem]">
          {product.name}
        </h1>
        {size && <p className="mt-2 text-[14px] text-muted-foreground">{size}</p>}
      </header>

      {/* At a glance */}
      <section className="mt-6 grid grid-cols-2 gap-2.5" aria-label="At a glance">
        {ladderIndex >= 0 && (
          <div className="col-span-2 rounded-3xl bg-white p-4 ring-1 ring-border">
            <div className="flex items-baseline justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Routine position
              </p>
              <p className="text-[13px] font-semibold text-ink tabular-nums">
                {ladderIndex + 1} of {ladder.length}
              </p>
            </div>
            <div className="mt-3 grid grid-cols-5 gap-1.5">
              {ladder.map((step, i) => (
                <div key={step.category} aria-current={i === ladderIndex ? 'step' : undefined}>
                  <span
                    className={`block h-2 rounded-full ${
                      i === ladderIndex
                        ? 'bg-[color:var(--aisle-deep)]'
                        : i < ladderIndex
                          ? 'bg-[color:var(--aisle)]'
                          : 'bg-secondary'
                    }`}
                  />
                  <span
                    className={`mt-2 block text-[10.5px] leading-tight ${
                      i === ladderIndex ? 'font-semibold text-ink' : 'text-muted-foreground'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="rounded-3xl bg-[color:var(--aisle)] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/60">Skin goal</p>
          <p className="mt-3 font-hangul text-[1.6rem] leading-none text-ink">{aisle.ko}</p>
          <p className="mt-1.5 text-[13px] font-medium text-ink">{aisle.name}</p>
        </div>
        <div className="rounded-3xl bg-white p-4 ring-1 ring-border">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {guide.amountToUse ? 'Amount' : 'Steps'}
          </p>
          {guide.amountToUse ? (
            <>
              <Droplet className="mt-3 h-6 w-6 text-[color:var(--aisle-deep)]" aria-hidden="true" />
              <p className="mt-1.5 text-[13px] font-medium leading-snug text-ink">{guide.amountToUse}</p>
            </>
          ) : (
            <>
              <Layers className="mt-3 h-6 w-6 text-[color:var(--aisle-deep)]" aria-hidden="true" />
              <p className="mt-1.5 text-[13px] font-medium text-ink">
                {directions.steps.length || 'See pack'} {directions.steps.length === 1 ? 'step' : directions.steps.length ? 'steps' : ''}
              </p>
            </>
          )}
        </div>
      </section>

      {/* Method */}
      <section className="mt-10">
        <h2 className="text-[1.5rem] font-light tracking-[-0.02em] text-ink">The method</h2>
        {directions.steps.length > 0 ? (
          <ol className="relative mt-5 space-y-3">
            <span
              aria-hidden="true"
              className="absolute bottom-10 left-[2.4rem] top-10 w-px bg-gradient-to-b from-[color:var(--aisle-deep)] to-[color:var(--aisle)]"
            />
            {directions.steps.map((step, i) => (
              <li
                key={step.text}
                className="relative grid grid-cols-[4.8rem_1fr] items-center gap-4 rounded-[1.5rem] bg-white p-3 pr-4 shadow-[0_10px_28px_-18px_rgba(58,38,32,.45)] ring-1 ring-border"
              >
                <div
                  className="flex aspect-square items-center justify-center rounded-2xl"
                  style={{
                    background: 'linear-gradient(150deg, #fff, color-mix(in oklab, var(--aisle) 60%, white))',
                  }}
                >
                  <StepIllustration art={step.art} className="h-[78%] w-[78%]" />
                </div>
                <div className="py-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--aisle-deep)] tabular-nums">
                    Step {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="mt-0.5 text-[1.05rem] font-semibold leading-snug text-ink">{step.title}</h3>
                  <p className="mt-1 text-[14px] leading-relaxed text-ink/75">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-4 rounded-3xl bg-secondary p-5 text-[15px] leading-relaxed text-ink/80">
            Follow the directions printed on the pack you received.
          </p>
        )}
      </section>

      {/* Hands or pad */}
      {view.showToneChoice && (
        <section className="mt-10 rounded-[1.75rem] bg-white p-4 ring-1 ring-border">
          <h2 className="text-[1.05rem] font-semibold text-ink">Hands or cotton pad?</h2>
          <div className="mt-3 grid grid-cols-2 rounded-full bg-secondary p-1 text-[13px] font-medium" role="tablist">
            {(['hands', 'pad'] as const).map((m) => (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={method === m}
                onClick={() => setMethod(m)}
                className={`rounded-full py-2 transition ${method === m ? 'bg-white text-ink shadow-sm' : 'text-muted-foreground'}`}
              >
                {m === 'hands' ? 'Clean hands' : 'Cotton pad'}
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-4">
            <StepIllustration art={method === 'hands' ? 'pat' : 'sweep'} className="h-20 w-20 flex-none" />
            <p className="text-[14px] leading-relaxed text-ink/80">
              {method === 'hands'
                ? 'Press and pat the toner gently across the skin.'
                : 'Saturate the pad sufficiently and sweep it gently across the skin without scrubbing.'}
            </p>
          </div>
        </section>
      )}

      {/* In practice */}
      {photo && (
        <figure className="mt-10">
          <img src={photo.src} alt={photo.alt} className="aspect-[4/3] w-full rounded-[1.75rem] object-cover" />
          <figcaption className="mt-2 text-[12px] text-muted-foreground">In practice</figcaption>
        </figure>
      )}

      {/* Notes */}
      <section className="mt-10 divide-y divide-border overflow-hidden rounded-[1.75rem] bg-white ring-1 ring-border">
        {(guide.frequency || guide.proTip) && (
          <details className="group p-5" open>
            <summary className="flex cursor-pointer list-none items-center justify-between text-[15px] font-semibold text-ink">
              Good to know
              <ChevronDown className="h-4 w-4 transition group-open:rotate-180" aria-hidden="true" />
            </summary>
            <div className="mt-3 space-y-2 text-[14px] leading-relaxed text-ink/80">
              {guide.frequency && <p>{guide.frequency}</p>}
              {guide.proTip && <p>{guide.proTip}</p>}
            </div>
          </details>
        )}
        <details className="group p-5">
          <summary className="flex cursor-pointer list-none items-center justify-between text-[15px] font-semibold text-ink">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[color:var(--aisle-deep)]" aria-hidden="true" />
              Safe use
            </span>
            <ChevronDown className="h-4 w-4 transition group-open:rotate-180" aria-hidden="true" />
          </summary>
          <p className="mt-3 text-[14px] leading-relaxed text-ink/75">{GUIDE_CAUTION}</p>
        </details>
        <details className="group p-5">
          <summary className="flex cursor-pointer list-none items-center justify-between text-[15px] font-semibold text-ink">
            Sourcing
            <ChevronDown className="h-4 w-4 transition group-open:rotate-180" aria-hidden="true" />
          </summary>
          <p className="mt-3 text-[14px] leading-relaxed text-ink/75">{GUIDE_SOURCING}</p>
          <Link to="/verify/sample" className="mt-3 inline-flex text-[13px] font-semibold text-[color:var(--aisle-deep)]">
            See a sample verification record →
          </Link>
        </details>
      </section>

      {/* Floating shop bar */}
      <div data-sticky-bar className="fixed inset-x-0 bottom-0 z-40 px-3" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.75rem)' }}>
        <Link
          to="/product/$slug"
          params={{ slug: guide.slug }}
          className="mx-auto flex max-w-2xl items-center gap-3 rounded-full bg-hanbok-deep p-2 pr-5 text-background shadow-[0_18px_40px_-14px_rgba(58,38,32,.6)]"
        >
          <img src={product.image} alt="" className="h-11 w-11 flex-none rounded-full bg-white object-contain p-1" />
          <span className="min-w-0 flex-1 truncate text-[13px] font-medium">{product.name}</span>
          <span className="flex-none text-[13px] font-semibold">Shop · A${price}</span>
        </Link>
      </div>
    </article>
  );
}
