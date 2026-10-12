import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { trackUi } from "@/lib/analytics";
import authenticityCardV2 from "@/assets/authenticity-card-v2.webp.asset.json";

/* "Why Skin Grocer": the journey and proof section, moved from the homepage to About. */
const WHY_JOURNEY = [
  "KOREAN SUPPLY PARTNER",
  "RECEIVED IN MELBOURNE",
  "SKIN GROCER CHECK",
  "QR VERIFICATION RECORD",
  "ROUTINE GUIDANCE",
];

const WHY_PROOF = [
  {
    n: "01",
    title: "Sourced through Korean supply partners",
    copy: "Products are purchased through approved Korean wholesale supply partners, with supplier and purchase records retained as part of our receiving process.",
  },
  {
    n: "02",
    title: "Checked when received in Melbourne",
    copy: "When stock arrives, our team reconciles the shipment against supplier records, product identity, quantity, visible packaging, condition and seals where the brand supplies them.",
    note: "This is a documented receiving check—not laboratory testing or independent certification.",
  },
  {
    n: "03",
    title: "A record you can actually open",
    copy: "Orders are sealed with a Skin Grocer authenticity card. Its QR code opens the verification record associated with that order and shows the details recorded by our Melbourne team.",
    cta: true,
  },
  {
    n: "04",
    title: "Guidance after your order arrives",
    copy: "Product-by-product guidance helps customers understand application order, frequency and where each purchase may fit within a routine.",
    note: "Cosmetic education only—not medical advice or diagnosis.",
  },
];

const SAMPLE_RECORD_FIELDS: [string, string][] = [
  ["Record type", "Batch verification record"],
  ["Status", "Example — not a live order record"],
  ["Card reference", "SG-SAMPLE"],
  ["Received in Melbourne", "26 August 2026"],
  ["Date checked", "28 August 2026"],
];

const SAMPLE_RECORD_CHECKS = [
  "Supplier and purchase-record match",
  "Product and order reconciliation",
  "Visible packaging and condition review",
];

/** Renders a genuine QR for the public sample record; no decorative placeholder. */
function SampleRecordQr() {
  const [qr, setQr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const url = `${window.location.origin}/verify/sample`;
    void import("qrcode").then(({ default: QRCode }) =>
      QRCode.toDataURL(url, { errorCorrectionLevel: "M", margin: 2, scale: 8 }).then((data) => {
        if (!cancelled) setQr(data);
      }),
    );
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex items-center gap-4">
      <div className="h-24 w-24 shrink-0 rounded-sm border border-ink/15 bg-white p-1.5">
        {qr ? (
          <img
            src={qr}
            alt="QR code linking to the Skin Grocer public sample verification record at /verify/sample"
            width={96}
            height={96}
            className="h-full w-full"
          />
        ) : (
          <div aria-hidden="true" className="h-full w-full bg-ink/5" />
        )}
      </div>
      <div className="text-sm leading-relaxed text-ink/70">
        <p className="font-semibold text-ink">Scan the public example</p>
        <Link
          to="/verify/sample"
          onClick={() => trackUi("authenticity_record_open", { from: "why_qr_link" })}
          className="mt-1 inline-block underline underline-offset-4 hover:text-hanbok-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-hanbok-deep"
        >
          Or open /verify/sample
        </Link>
      </div>
    </div>
  );
}

export function WhyPillars() {
  return (
    <section className="relative overflow-hidden bg-paper" aria-labelledby="why-heading">
      <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">
            Why Skin Grocer
          </p>
          <h2 id="why-heading" className="display-section mt-4 text-ink">
            Know where it came from.{" "}
            <span className="italic text-hanbok-deep">Know what to do with it.</span>
          </h2>
          <p className="lede mt-5 text-ink/70">
            We created Skin Grocer to remove two common uncertainties from buying Korean skincare
            online: whether the product has travelled through a documented supply process, and how
            it belongs in your routine once it arrives.
          </p>
        </div>

        <div className="mt-14 grid gap-10 md:grid-cols-12 md:items-start md:gap-12">
          {/* Retained, founder-approved authenticity photograph */}
          <div className="md:col-span-5">
            <div className="overflow-hidden rounded-2xl bg-ink">
              <img
                src={authenticityCardV2.url}
                alt="A Skin Grocer authenticity card with a wax seal and a scannable QR code, resting among Korean skincare in original branded packaging"
                loading="lazy"
                width={1024}
                height={1280}
                className="h-full w-full object-cover"
              />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-ink/55">
              DOCUMENTED RECEIVING AND ORDER CHECK
            </p>
          </div>

          <div className="md:col-span-7">
            {/* Verification journey — vertical, never compressed to a hairline */}
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/60">
              The verification journey
            </h3>
            <ol className="mt-4 space-y-0">
              {WHY_JOURNEY.map((step, i) => (
                <li key={step}>
                  <div className="flex items-center gap-4 rounded-sm border border-ink/10 bg-white/60 px-4 py-3">
                    <span className="font-display text-sm italic text-hanbok-deep/50">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ink">
                      {step}
                    </span>
                  </div>
                  {i < WHY_JOURNEY.length - 1 && (
                    <div aria-hidden="true" className="py-1 pl-6 text-grocer-butter">
                      ↓
                    </div>
                  )}
                </li>
              ))}
            </ol>

            {/* Genuine sample record preview */}
            <div className="mt-10 rounded-sm border border-ink/15 bg-white p-6 shadow-[0_20px_50px_-40px_rgba(0,0,0,0.5)] transition-shadow motion-safe:hover:shadow-[0_28px_60px_-36px_rgba(0,0,0,0.55)]">
              <div className="h-px w-12 bg-grocer-butter" />
              <h3 className="mt-4 font-display text-xl text-ink">Sample verification record</h3>
              <dl className="mt-4 border-y border-ink/10">
                {SAMPLE_RECORD_FIELDS.map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-baseline justify-between gap-4 border-b border-ink/10 py-2.5 last:border-b-0"
                  >
                    <dt className="text-[11px] uppercase tracking-[0.16em] text-ink/60">{k}</dt>
                    <dd className="text-sm text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
              <ul className="mt-4 space-y-2">
                {SAMPLE_RECORD_CHECKS.map((c) => (
                  <li
                    key={c}
                    className="flex items-start gap-3 text-sm leading-relaxed text-ink/75"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1 w-1 shrink-0 rounded-full bg-grocer-butter"
                    />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>

              <h4 className="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/60">
                What “verified by Skin Grocer” means
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                The batch completed Skin Grocer’s documented receiving and verification procedure.
                It does not mean the product was laboratory tested or independently certified unless
                the record specifically states otherwise.
              </p>

              <div className="mt-6 border-t border-ink/10 pt-6">
                <SampleRecordQr />
              </div>
            </div>
          </div>
        </div>

        {/* Four proof cards */}
        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_PROOF.map((p) => (
            <li
              key={p.n}
              className="flex flex-col rounded-sm border border-ink/12 bg-white/70 p-6 transition-colors hover:border-ink/30"
            >
              <span className="font-display text-2xl italic text-hanbok-deep/35">{p.n}</span>
              <h3 className="mt-3 font-display text-lg leading-snug text-ink">{p.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/70">{p.copy}</p>
              {p.note && <p className="mt-3 text-xs leading-relaxed text-ink/55">{p.note}</p>}
              {p.cta && (
                <div className="mt-4">
                  <Link
                    to="/verify/sample"
                    onClick={() => trackUi("authenticity_record_open", { from: "why_proof_card" })}
                    className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-hanbok-deep underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-hanbok-deep"
                  >
                    View a sample verification record
                    <span aria-hidden="true">→</span>
                  </Link>
                  <p className="mt-2 text-xs text-ink/55">
                    Public example · Not a live customer order
                  </p>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
