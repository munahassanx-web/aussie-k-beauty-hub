import { NewsletterForm } from "@/components/newsletter-form";
import { AISLES } from "@/lib/aisles";

const PERKS = [
  "New arrivals from Korea",
  "Plain-English routine notes",
  "Sent occasionally, never daily",
];

/** Homepage community invitation: the Glass Skin Club newsletter. */
export function GlassSkinClubInvite() {
  return (
    <section id="join-the-club" className="scroll-mt-20 bg-background">
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">
          THE GLASS SKIN CLUB · 물광
        </p>
        <h2 className="mt-4 display-section text-ink">
          join the club. <span className="italic text-hanbok-deep">skip the noise.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-ink/70">
          For people who want Korean skincare explained simply: what is new, what it does and where
          it goes in your routine.
        </p>
        <ul className="mt-8 flex flex-wrap justify-center gap-2">
          {Object.values(AISLES).map((a) => (
            <li
              key={a.number}
              className={`rounded-full px-3 py-1 text-xs font-medium text-ink ${a.bg}`}
            >
              <span className="tabular-nums font-semibold">{a.number}</span> {a.name}
            </li>
          ))}
        </ul>
        <div className="mx-auto mt-10 max-w-md text-left">
          <NewsletterForm source="homepage" />
        </div>
        <ul className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[11px] uppercase tracking-[0.12em] text-ink/55">
          {PERKS.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
