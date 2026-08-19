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
 * The Seoul Signal — editorial dispatch from Skin Grocer's Korean point of view.
 */
export function SeoulSignalStrip() {
  return (
    <section className="bg-ink px-6 py-20 text-paper md:py-24" aria-labelledby="seoul-signal-home">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: masthead / manifesto + newsletter signup */}
          <div className="flex flex-col">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-paper/70">
              THE SEOUL SIGNAL
            </p>
            <h2
              id="seoul-signal-home"
              className="mt-6 max-w-xl font-display text-[34px] leading-[1.02] md:text-[56px]"
            >
              Closer to Seoul. Clearer about what matters.
            </h2>
            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-paper/75">
              A Skin Grocer editorial dispatch on the ingredients, formulas and conversations
              shaping Korean skincare — translated into what is actually useful to know.
            </p>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-paper/75">
              Less hype. More context. Read what is changing, what is worth understanding and what
              may deserve a place in your routine.
            </p>

            <div className="mt-10 max-w-md">
              <p className="text-[12px] uppercase tracking-[0.2em] text-paper/60">
                THE DISPATCH, BY EMAIL
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-paper/75">
                New Skin Grocer editorial notes when there is something worth sending.
              </p>
              <div className="mt-4">
                <NewsletterForm source="homepage" variant="dark" />
              </div>
            </div>
          </div>

          {/* Right: latest issue + article index + understated links */}
          <div className="flex flex-col gap-8">
            {latestIssue && (
              <Link
                to="/blog/$slug"
                params={{ slug: latestIssue.slug }}
                className="group block border border-paper/20 transition-colors hover:border-paper/50"
              >
                <img
                  src={latestIssue.cover}
                  alt={latestIssue.coverAlt}
                  loading="lazy"
                  className="aspect-[16/10] w-full object-cover"
                />
                <div className="border-t border-paper/20 p-6">
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

            <div className="flex flex-col">
              {signals.map((a, i) => (
                <Link
                  key={a.slug}
                  to="/learn/article/$slug"
                  params={{ slug: a.slug }}
                  className="group border-t border-paper/20 py-5 transition-colors hover:border-paper/50"
                >
                  <div className="flex items-start gap-4">
                    <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-paper/75">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-paper/75">
                        {a.meta} · {a.read}
                      </p>
                      <h3 className="mt-1 font-display text-lg leading-snug transition-colors group-hover:text-paper">
                        {a.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
              <div className="border-t border-paper/20" />
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Link
                to="/blog"
                className="group text-[13px] tracking-wide text-paper/80 transition-colors hover:text-paper"
              >
                Read all issues{" "}
                <span className="inline-block transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
              <Link
                to="/learn/hub"
                className="group text-[13px] tracking-wide text-paper/80 transition-colors hover:text-paper"
              >
                Explore the Learn Hub{" "}
                <span className="inline-block transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
