import { Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { BadgeCheck, ShieldCheck, Sparkles } from "lucide-react";
import { AddToBagButton } from "@/components/add-to-bag-button";
import { StepIllustration } from "@/components/guide/step-art";
import { guideUrlFor } from "@/lib/guide-content";
import { productSlug } from "@/lib/product-detail";
import { productPrice } from "@/lib/shop-catalog";
import { GUIDE_CAUTION, GUIDE_SOURCING, type GuideView } from "@/components/guide/guide-data";

// The "Glow Story" guide (Muna chose it 2026-10-27): a colour-drenched, app-like guide. Big product stage
// on the aisle colour, swipeable illustrated step cards, sticky shop bar.

const glass = "bg-white/60 backdrop-blur-md ring-1 ring-white/70";

const addButton =
  "rounded-full bg-hanbok-deep text-[12px] font-semibold uppercase tracking-[0.12em] text-background transition-colors hover:bg-hanbok disabled:opacity-60";

export function GuideLookGlow({ view, soldOut }: { view: GuideView; soldOut: string[] }) {
  const { product, guide, aisle, colours, directions, ladder, ladderIndex, photo, size, price } =
    view;
  const buyable = view.sellable && !soldOut.includes(product.priceId);
  const [active, setActive] = useState(0);
  const rail = useRef<HTMLOListElement>(null);

  function onScroll() {
    const el = rail.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    if (!card) return;
    setActive(Math.round(el.scrollLeft / (card.offsetWidth + 12)));
  }

  return (
    <article style={colours} className="mx-auto max-w-3xl pb-32">
      {/* Product stage */}
      <div className="px-3 pt-3 sm:px-6 sm:pt-8">
        <header
          className="relative overflow-hidden rounded-[2rem] px-5 pb-6 pt-5 sm:px-10 sm:pb-10"
          style={{
            background:
              "radial-gradient(70% 55% at 78% 18%, rgba(255,255,255,.95), transparent 70%), radial-gradient(80% 60% at 12% 95%, color-mix(in oklab, var(--aisle) 70%, white), transparent 75%), linear-gradient(165deg, color-mix(in oklab, var(--aisle) 45%, white) 0%, var(--aisle) 100%)",
          }}
        >
          <div className="flex items-center justify-between gap-3">
            <span
              className={`${glass} rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink`}
            >
              How to use
            </span>
            <span
              className={`${glass} rounded-full px-3 py-1.5 text-[11px] font-medium text-[color:var(--aisle-deep)]`}
            >
              {aisle.number} · {aisle.name} <span className="font-hangul">{aisle.ko}</span>
            </span>
          </div>

          <div className="relative mx-auto mt-2 flex h-[17.5rem] items-end justify-center sm:h-[22rem]">
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-6 h-56 w-56 -translate-x-1/2 rounded-full sm:h-72 sm:w-72"
              style={{
                background:
                  "radial-gradient(circle at 35% 30%, #fff 0%, rgba(255,255,255,.55) 38%, rgba(255,255,255,0) 70%)",
              }}
            />
            <div
              aria-hidden="true"
              className="absolute bottom-3 left-1/2 h-6 w-48 -translate-x-1/2 rounded-[50%] bg-ink/25 blur-md"
            />
            <img
              src={product.image}
              alt={`${product.brand} ${product.name}`}
              className="relative max-h-[15.5rem] w-auto max-w-[78%] object-contain drop-shadow-[0_18px_22px_rgba(58,38,32,.22)] sm:max-h-[20rem]"
            />
          </div>

          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--aisle-deep)]">
            {product.brand}
          </p>
          <h1 className="mt-1.5 text-[1.9rem] font-medium leading-[1.08] tracking-[-0.02em] text-ink sm:text-5xl">
            {product.name}
          </h1>
          <div className="mt-4 flex flex-wrap gap-2 text-[12px] text-ink">
            <span className={`${glass} rounded-full px-3 py-1.5`}>{guide.routineStep}</span>
            {size && <span className={`${glass} rounded-full px-3 py-1.5`}>{size}</span>}
            <span className={`${glass} inline-flex items-center gap-1.5 rounded-full px-3 py-1.5`}>
              <BadgeCheck
                className="h-3.5 w-3.5 text-[color:var(--aisle-deep)]"
                aria-hidden="true"
              />
              {directions.fromBrand
                ? `${product.brand}'s own directions`
                : "General routine guidance"}
            </span>
          </div>
        </header>
      </div>

      {/* Routine track */}
      {ladderIndex >= 0 && (
        <section className="mt-9 px-5 sm:px-10">
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Where it sits in your routine
          </h2>
          <ol className="relative mt-5 grid grid-cols-5">
            <span
              aria-hidden="true"
              className="absolute left-[10%] right-[10%] top-[15px] h-[2px] bg-border"
            />
            <span
              aria-hidden="true"
              className="absolute left-[10%] top-[15px] h-[2px] bg-[color:var(--aisle-deep)]"
              style={{ width: `${(ladderIndex / (ladder.length - 1)) * 80}%` }}
            />
            {ladder.map((step, i) => {
              const current = i === ladderIndex;
              return (
                <li
                  key={step.category}
                  className="relative flex flex-col items-center text-center"
                  aria-current={current ? "step" : undefined}
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-semibold tabular-nums ${
                      current
                        ? "bg-[color:var(--aisle-deep)] text-white shadow-[0_0_0_6px_color-mix(in_oklab,var(--aisle)_60%,transparent)]"
                        : i < ladderIndex
                          ? "bg-[color:var(--aisle)] text-ink"
                          : "border-2 border-border bg-background text-muted-foreground"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span
                    className={`mt-2.5 text-[11px] leading-tight ${current ? "font-semibold text-ink" : "text-muted-foreground"}`}
                  >
                    {step.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      {/* Steps */}
      <section className="mt-11">
        <div className="flex items-end justify-between px-5 sm:px-10">
          <h2 className="text-[1.6rem] font-medium leading-none tracking-[-0.02em] text-ink">
            Step by step
          </h2>
          {directions.steps.length > 1 && (
            <p className="text-[12px] text-muted-foreground sm:hidden">Swipe →</p>
          )}
        </div>

        {directions.steps.length > 0 ? (
          <>
            <ol
              ref={rail}
              onScroll={onScroll}
              className="mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 pb-3 [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-10 [&::-webkit-scrollbar]:hidden"
            >
              {directions.steps.map((step, i) => (
                <li
                  key={step.text}
                  className="w-[80%] max-w-[20rem] flex-none snap-start overflow-hidden rounded-[1.75rem] bg-white shadow-[0_14px_34px_-16px_rgba(58,38,32,.35)] ring-1 ring-black/[0.04] sm:w-auto sm:max-w-none"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <StepIllustration art={step.art} className="absolute inset-0 h-full w-full" />
                    <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-[1.05rem] font-semibold leading-none tracking-[-0.02em] text-[color:var(--aisle-deep)] tabular-nums shadow-sm">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-[1.15rem] font-semibold leading-snug text-ink">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-ink/75">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            {directions.steps.length > 1 && (
              <div className="mt-3 flex justify-center gap-1.5 sm:hidden" aria-hidden="true">
                {directions.steps.map((s, i) => (
                  <span
                    key={s.text}
                    className={`h-1.5 rounded-full transition-all ${
                      i === active ? "w-6 bg-[color:var(--aisle-deep)]" : "w-1.5 bg-border"
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <p className="mx-5 mt-5 rounded-3xl bg-secondary p-5 text-[15px] leading-relaxed text-ink/80">
            Follow the directions printed on the pack you received.
          </p>
        )}
      </section>

      {/* Use it with */}
      {view.companions.length > 0 && (
        <section className="mt-11 px-5 sm:px-10">
          <h2 className="text-[1.6rem] font-medium leading-none tracking-[-0.02em] text-ink">
            Use it with
          </h2>
          <p className="mt-2 text-[14px] text-muted-foreground">
            One pick for each of the other steps in your routine.
          </p>
          <ul className="mt-5 space-y-3">
            {view.companions.map(({ step, product: c }) => (
              <li
                key={c.priceId}
                className="flex items-center gap-4 rounded-[1.5rem] bg-white p-3 shadow-[0_10px_28px_-18px_rgba(58,38,32,.45)] ring-1 ring-black/[0.04]"
              >
                <Link
                  to="/product/$slug"
                  params={{ slug: productSlug(c) }}
                  className="flex h-[5.5rem] w-[5.5rem] flex-none items-center justify-center rounded-2xl bg-[color:color-mix(in_oklab,var(--aisle)_35%,white)]"
                >
                  <img
                    src={c.image}
                    alt={`${c.brand} ${c.name}`}
                    className="h-[85%] w-auto object-contain"
                    loading="lazy"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--aisle-deep)]">
                    {step}
                  </p>
                  <Link
                    to="/product/$slug"
                    params={{ slug: productSlug(c) }}
                    className="mt-0.5 block"
                  >
                    <span className="block text-[12px] text-muted-foreground">{c.brand}</span>
                    <span className="block text-[15px] font-semibold leading-snug text-ink">
                      {c.name}
                    </span>
                  </Link>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="text-[14px] font-semibold text-ink tabular-nums">
                      A${productPrice(c)}
                    </span>
                    <a
                      href={guideUrlFor(c)}
                      className="whitespace-nowrap text-[12px] font-medium text-[color:var(--aisle-deep)]"
                    >
                      How to use →
                    </a>
                  </div>
                </div>
                {!soldOut.includes(c.priceId) && (
                  <AddToBagButton
                    priceId={c.priceId}
                    name={c.name}
                    priceLabel={`${c.price} AUD`}
                    accessibleName={`Add ${c.brand} ${c.name} to bag`}
                    className={`${addButton} h-10 flex-none self-end px-3.5 !text-[11px]`}
                  />
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* In practice */}
      {photo && (
        <figure className="relative mx-3 mt-11 overflow-hidden rounded-[2rem] sm:mx-6">
          <img
            src={photo.src}
            alt={photo.alt}
            className="aspect-[4/5] w-full object-cover sm:aspect-[16/9]"
          />
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-5 pt-16 text-white">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-80">
              In practice
            </p>
            <p className="mt-1 text-lg font-medium leading-snug">How it looks on skin</p>
          </figcaption>
        </figure>
      )}

      {/* Hands or pad */}
      {view.showToneChoice && (
        <section className="mt-11 px-5 sm:px-10">
          <h2 className="text-[1.35rem] font-medium tracking-[-0.01em] text-ink">
            Hands or cotton pad?
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              {
                art: "pat" as const,
                title: "Clean hands",
                text: "Press and pat the toner gently across the skin.",
              },
              {
                art: "sweep" as const,
                title: "Cotton pad",
                text: "Saturate the pad sufficiently and sweep it gently across the skin without scrubbing.",
              },
            ].map((o) => (
              <div
                key={o.title}
                className="rounded-3xl bg-[color:color-mix(in_oklab,var(--aisle)_35%,white)] p-4"
              >
                <StepIllustration art={o.art} className="aspect-[4/3] w-full rounded-2xl" />
                <p className="mt-2 text-[15px] font-semibold text-ink">{o.title}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-ink/75">{o.text}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Good to know */}
      {(guide.amountToUse || guide.frequency || guide.proTip) && (
        <section className="mx-5 mt-11 rounded-[1.75rem] bg-ink p-6 text-white sm:mx-10">
          <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--aisle)]">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> Good to know
          </p>
          <dl className="mt-4 space-y-4">
            {guide.amountToUse && (
              <div>
                <dt className="text-[12px] text-white/60">Amount</dt>
                <dd className="mt-0.5 text-[16px] leading-snug">{guide.amountToUse}</dd>
              </div>
            )}
            {guide.frequency && (
              <div>
                <dt className="text-[12px] text-white/60">When</dt>
                <dd className="mt-0.5 text-[16px] leading-snug">{guide.frequency}</dd>
              </div>
            )}
            {guide.proTip && (
              <div>
                <dt className="text-[12px] text-white/60">Note</dt>
                <dd className="mt-0.5 text-[16px] leading-snug">{guide.proTip}</dd>
              </div>
            )}
          </dl>
        </section>
      )}

      {/* Care + sourcing */}
      <section className="mx-5 mt-8 space-y-3 sm:mx-10">
        <div className="flex gap-3 rounded-3xl bg-secondary p-5">
          <ShieldCheck
            className="mt-0.5 h-5 w-5 flex-none text-[color:var(--aisle-deep)]"
            aria-hidden="true"
          />
          <p className="text-[13px] leading-relaxed text-ink/75">{GUIDE_CAUTION}</p>
        </div>
        <div className="rounded-3xl border border-border p-5">
          <p className="text-[13px] leading-relaxed text-ink/75">{GUIDE_SOURCING}</p>
          <Link
            to="/verify/sample"
            className="mt-3 inline-flex text-[13px] font-semibold text-[color:var(--aisle-deep)]"
          >
            See a sample verification record →
          </Link>
        </div>
      </section>

      {/* Sticky shop bar */}
      <div
        data-sticky-bar
        className="fixed inset-x-0 bottom-0 z-40 border-t border-white/60 bg-white/80 backdrop-blur-xl"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <Link
            to="/product/$slug"
            params={{ slug: guide.slug }}
            className="flex min-w-0 flex-1 items-center gap-3"
          >
            <img
              src={product.image}
              alt=""
              className="h-11 w-11 flex-none rounded-xl bg-[color:var(--aisle)] object-contain p-1"
            />
            <span className="min-w-0">
              <span className="block truncate text-[13px] font-semibold text-ink">
                {product.name}
              </span>
              <span className="block text-[12px] text-muted-foreground tabular-nums">
                A${price} · View details
              </span>
            </span>
          </Link>
          {buyable ? (
            <AddToBagButton
              priceId={product.priceId}
              name={product.name}
              priceLabel={`${product.price} AUD`}
              className={`${addButton} h-11 flex-none px-5`}
            />
          ) : (
            <Link
              to="/product/$slug"
              params={{ slug: guide.slug }}
              className={`${addButton} flex h-11 flex-none items-center px-5`}
            >
              View
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
