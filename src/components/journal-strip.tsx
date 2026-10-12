import { Link } from "@tanstack/react-router";
import { newsletterIssues } from "@/lib/newsletter-issues";
import { trackUi } from "@/lib/analytics";

/** Homepage teaser for the fortnightly journal: the newest issue plus two more. */
export function JournalStrip() {
  const [lead, ...rest] = newsletterIssues.filter((i) => i.published).slice(0, 3);
  if (!lead) return null;

  return (
    <section className="border-t border-border/60 bg-background" aria-labelledby="journal-strip-heading">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">
              The Seoul Signal · every fortnight
            </p>
            <h2 id="journal-strip-heading" className="mt-3 text-[clamp(1.9rem,3vw,2.6rem)] font-light leading-tight tracking-[-0.03em]">
              What Korea is talking about this fortnight.
            </h2>
          </div>
          <Link
            to="/blog"
            onClick={() => trackUi("home_journal_all_click", {})}
            className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground underline underline-offset-4 hover:text-primary"
          >
            All issues →
          </Link>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <Link
            to="/blog/$slug"
            params={{ slug: lead.slug }}
            onClick={() => trackUi("home_journal_issue_click", { issue: lead.number, position: 1 })}
            className="group block"
          >
            <div className="overflow-hidden rounded-sm">
              <img
                src={lead.cover}
                alt={lead.coverAlt}
                loading="lazy"
                decoding="async"
                width={1200}
                height={896}
                className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </div>
            <p className="mt-5 text-[10.5px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              No. {lead.number} · {lead.theme} · {lead.date}
            </p>
            <h3 className="mt-2 text-2xl leading-snug md:text-[28px]">{lead.title}</h3>
            <p className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-muted-foreground">{lead.standfirst}</p>
            <span className="mt-4 inline-block border-b border-foreground pb-0.5 text-[11px] font-semibold uppercase tracking-[0.2em]">
              Read this issue →
            </span>
          </Link>

          <ul className="flex flex-col gap-8">
            {rest.map((issue, i) => (
              <li key={issue.slug}>
                <Link
                  to="/blog/$slug"
                  params={{ slug: issue.slug }}
                  onClick={() => trackUi("home_journal_issue_click", { issue: issue.number, position: i + 2 })}
                  className="group grid grid-cols-[7.5rem_1fr] gap-4 sm:grid-cols-[10rem_1fr]"
                >
                  <div className="overflow-hidden rounded-sm">
                    <img
                      src={issue.cover}
                      alt={issue.coverAlt}
                      loading="lazy"
                      decoding="async"
                      width={320}
                      height={240}
                      className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      No. {issue.number} · {issue.theme}
                    </p>
                    <h3 className="mt-1.5 text-lg leading-snug group-hover:underline group-hover:underline-offset-4">
                      {issue.title}
                    </h3>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
