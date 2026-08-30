import { Link } from "@tanstack/react-router";
import { RESTOCK_DISCOUNT_PERCENT } from "@/lib/shop-catalog";
import ritualScene from "@/assets/ritual-scene.webp";

/**
 * Recurring "Restock" purchase programme teaser.
 *
 * NOT YET OPERATIONAL — do not render on the public homepage until the
 * recurring-purchase programme is fully built out:
 * clearly identified eligible products, working recurring payments, exact
 * billing frequency, transparent recurring pricing/discount, shipping-cost
 * explanation, stock-unavailability handling, customer pause/skip/cancel
 * controls, an account-management page, renewal and order-confirmation
 * emails, recurring-purchase terms and privacy disclosures, and tested
 * checkout/cancellation plus mobile and accessibility journeys.
 */
export default function RestockCta() {
  const steps = [
    {
      n: "01",
      title: "Choose an eligible essential",
      copy: "A small set of routine staples can be ordered as a monthly Restock — look for the Restock option on the product.",
    },
    {
      n: "02",
      title: "Set it up with an account",
      copy: `Restock orders repeat monthly at ${RESTOCK_DISCOUNT_PERCENT}% off the one-time price, and are kept with your account.`,
    },
    {
      n: "03",
      title: "Change your mind any time",
      copy: "Cancel a Restock from your account and it simply stops at the end of the current period.",
    },
  ];

  return (
    <section className="relative overflow-hidden" aria-labelledby="restock-heading">
      <div className="absolute inset-0">
        <img src={ritualScene} alt="" loading="lazy" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-hanbok-deep/55 md:bg-gradient-to-r md:from-hanbok-deep/80 md:via-hanbok-deep/55 md:to-hanbok-deep/15" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="max-w-xl text-paper">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-paper/70">
            Replenishment, made simple
          </p>
          <h2 id="restock-heading" className="display-section mt-4">
            The products you finish.{" "}
            <span className="italic">Before you run out.</span>
          </h2>
          <p className="lede mt-5 text-paper/80">
            For the essentials that earn a permanent place in your routine, make
            restocking one less thing to remember.
          </p>
        </div>

        <div className="mt-14 max-w-3xl border-t border-paper/25">
          {steps.map((s) => (
            <div
              key={s.n}
              className="grid gap-2 border-b border-paper/20 py-6 md:grid-cols-[4rem_1fr] md:gap-8"
            >
              <span className="font-display text-sm italic text-paper/60">{s.n}</span>
              <div>
                <h3 className="text-[12px] font-semibold uppercase tracking-[0.18em] text-paper">
                  {s.title}
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-paper/75">{s.copy}</p>
              </div>
            </div>
          ))}
        </div>

        <Link
          to="/shop"
          className="group mt-10 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-paper"
        >
          <span className="border-b border-paper/40 pb-1 transition-colors group-hover:border-paper">
            Browse restockable essentials
          </span>
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </section>
  );
}
