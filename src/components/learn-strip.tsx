import { Link } from "@tanstack/react-router";

/* The Skin Grocer Guide strip, moved from the homepage to Learn. */
export function LearnStrip() {
  const topics: {
    num: string;
    title: string;
    line: string;
    cta: string;
    to: "/learn/hub" | "/learn";
  }[] = [
    {
      num: "01",
      title: "BUILD A SIMPLE ROUTINE",
      line: "Learn the basic order, what may be optional and how to introduce products gradually.",
      cta: "Start with routine basics",
      to: "/learn/hub",
    },
    {
      num: "02",
      title: "UNDERSTAND THE INGREDIENT",
      line: "Explore what commonly discussed skincare ingredients may do, where evidence is limited and which formulas contain them.",
      cta: "Open the ingredient guide",
      to: "/learn",
    },
    {
      num: "03",
      title: "USE PRODUCTS WELL",
      line: "Understand application order, frequency, patch testing and common combinations that may need additional care.",
      cta: "Explore how-to guides",
      to: "/learn/hub",
    },
  ];

  return (
    <section className="border-t border-border/60 bg-paper" aria-labelledby="learn-strip-heading">
      <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">
            THE SKIN GROCER GUIDE
          </p>
          <h2
            id="learn-strip-heading"
            className="mt-4 font-display text-4xl leading-[1.05] text-ink md:text-[2.85rem]"
          >
            Learn enough to <span className="italic text-hanbok-deep">buy with confidence.</span>
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-ink/70">
            Plain-English guidance for understanding routine order, commonly discussed ingredients
            and how to use products more thoughtfully.
          </p>
          <p className="mt-3 text-[12px] uppercase tracking-[0.14em] text-ink/45">
            Evidence, limitations and review dates are shown where relevant.
          </p>
        </div>

        <ul className="mt-14 grid gap-px border-t border-ink/15 md:grid-cols-3 md:border-t-0">
          {topics.map((t) => (
            <li key={t.num} className="border-b border-ink/15 md:border-b-0 md:border-t">
              <Link
                to={t.to}
                className="group flex h-full flex-col p-7 pl-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hanbok-deep md:px-8 md:pl-8"
              >
                <span className="font-display text-3xl italic text-hanbok-gold/80">{t.num}</span>
                <h3 className="mt-6 font-display text-sm uppercase tracking-[0.14em] text-ink transition-colors group-hover:text-hanbok-deep">
                  {t.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/60">{t.line}</p>
                <span className="mt-7 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink">
                  <span className="border-b border-ink/30 pb-0.5 transition-colors group-hover:border-hanbok-deep group-hover:text-hanbok-deep">
                    {t.cta}
                  </span>
                  <span className="transition-transform duration-300 motion-safe:group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <Link
          to="/learn/hub"
          className="group mt-12 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-ink transition hover:text-hanbok-deep"
        >
          <span className="border-b border-ink/30 pb-0.5 transition-colors group-hover:border-hanbok-deep">
            Explore the Learn Hub
          </span>
          <span className="transition-transform duration-300 motion-safe:group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
