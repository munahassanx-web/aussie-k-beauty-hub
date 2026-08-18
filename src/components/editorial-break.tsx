import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/reveal";

/**
 * Editorial storytelling break — a quiet, typographic pause between product
 * grids and story sections. Purely presentational.
 */
export function EditorialBreak({
  eyebrow,
  quote,
  attribution,
  linkTo,
  linkLabel,
  tone = "paper",
}: {
  eyebrow: string;
  quote: string;
  attribution?: string;
  linkTo?: string;
  linkLabel?: string;
  tone?: "paper" | "sand" | "ink";
}) {
  const surface =
    tone === "ink"
      ? "bg-ink text-paper"
      : tone === "sand"
        ? "bg-sand text-ink"
        : "bg-paper text-ink";

  return (
    <section className={`border-y border-border/60 ${surface}`}>
      <div className="mx-auto max-w-4xl px-6 py-24 text-center">
        <Reveal>
          <p className={`eyebrow eyebrow-rule justify-center ${tone === "ink" ? "text-paper/60" : "text-clay"}`}>
            {eyebrow}
          </p>
        </Reveal>
        <Reveal delay={90}>
          <p className="pull-quote mt-7">{quote}</p>
        </Reveal>
        {attribution ? (
          <Reveal delay={160}>
            <p className={`mt-7 text-[11px] uppercase tracking-[0.26em] ${tone === "ink" ? "text-paper/75" : "text-muted-foreground"}`}>
              {attribution}
            </p>
          </Reveal>
        ) : null}
        {linkTo && linkLabel ? (
          <Reveal delay={220}>
            <Link
              to={linkTo}
              className="arrow-slide mt-9 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em]"
            >
              <span className="underline-grow">{linkLabel}</span>
              <span className="arrow">→</span>
            </Link>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
