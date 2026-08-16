import { Link } from "@tanstack/react-router";
import { getLearnArticle } from "@/lib/learn-articles";
import { newsletterIssues } from "@/lib/newsletter-issues";
import { NewsletterForm } from "@/components/newsletter-form";

const signals = [
  getLearnArticle("new-launch-watchlist")!,
  getLearnArticle("seoul-vs-tiktok")!,
  getLearnArticle("prevention-over-repair")!,
];

const latestIssue = newsletterIssues.find((i) => i.published) ?? newsletterIssues[0];

/**
 * Homepage placement of The Seoul Signal — the fortnightly Korea market read.
 * Positioned high on the page so it doesn't stay buried in the Learn Hub.
 */
export function SeoulSignalStrip() {
  return (
    <section className="bg-ink px-6 py-20 text-paper md:py-24" aria-labelledby="seoul-signal-home">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-paper/25 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-paper/70">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-grocer-tomato" />
              The Seoul Signal · Free · Fortnightly
            </p>
            <h2
              id="seoul-signal-home"
              className="mt-6 max-w-xl font-display text-[34px] leading-[1.02] md:text-[56px]"
            >
              You&rsquo;re buying what Korea
              <span className="text-grocer-tomato"> finished with a year ago.</span>
            </h2>
            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-paper/75">
              By the time a Korean product is marketed to you here, Seoul has already reviewed it,
              ranked it, and in a lot of cases moved on. That lag is why your routine keeps feeling
              one step behind and why you keep paying full price for last season&rsquo;s hero.
            </p>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-paper/75">
              Every fortnight we read Korean-language reviews, Olive Young ranking movement and
              Seoul shelf data, and publish what&rsquo;s actually working — plus the trends not worth
              your money. Free to read, no product pitch.
            </p>


            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-paper/20 pt-8">
              {[
                { n: "Every 2 weeks", l: "New issue published" },
                { n: "12–18 mo", l: "The lag we close" },
                { n: "10M+", l: "Korean reviews tracked" },
              ].map((s) => (
                <div key={s.l}>
                  <dt className="font-display text-xl leading-none md:text-2xl">{s.n}</dt>
                  <dd className="mt-2 text-[11px] uppercase leading-snug tracking-[0.14em] text-paper/55">
                    {s.l}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-10 max-w-md">
              <p className="text-[12px] uppercase tracking-[0.2em] text-paper/60">
                Get each issue by email
              </p>
              <NewsletterForm source="homepage" variant="dark" />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {latestIssue && (
              <Link
                to="/grocery-list/$slug"
                params={{ slug: latestIssue.slug }}
                className="group block overflow-hidden rounded-sm border border-paper/20 transition-colors hover:border-paper/60"
              >
                <img
                  src={latestIssue.cover}
                  alt={latestIssue.coverAlt}
                  loading="lazy"
                  className="h-44 w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <div className="p-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-paper/60">
                    Latest issue {latestIssue.number} · {latestIssue.theme}
                  </p>
                  <h3 className="mt-3 font-display text-2xl leading-tight">{latestIssue.title}</h3>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-paper/65">
                    {latestIssue.standfirst}
                  </p>
                </div>
              </Link>
            )}

            <div className="grid gap-4">
              {signals.map((a) => (
                <Link
                  key={a.slug}
                  to="/learn/article/$slug"
                  params={{ slug: a.slug }}
                  className="group border-t border-paper/20 pt-4 transition-colors hover:border-paper"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-paper/55">
                    {a.meta} · {a.read}
                  </p>
                  <h3 className="mt-2 font-display text-lg leading-snug group-hover:text-accent">
                    {a.title}
                  </h3>
                </Link>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/grocery-list"
                className="rounded-full bg-paper px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-ink transition-opacity hover:opacity-85"
              >
                Read all issues
              </Link>
              <Link
                to="/learn/hub"
                className="rounded-full border border-paper/40 px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-paper transition-colors hover:border-paper"
              >
                The full Seoul Signal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
