import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  ClipboardList,
  Mail,
  MessageSquareText,
  Sparkles,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SHOP_PRODUCTS } from "@/lib/shop-catalog";
import { productSlug } from "@/lib/product-detail";
import tonerCutout from "@/assets/haruharu-toner-cutout.png";

const FEATURED_PRICE_ID = "haruharu_wonder_black_rice_hyaluronic_toner_150ml_onetime";

const TICKER_ITEMS = [
  "SEOUL VERIFIED",
  "MELBOURNE DISPATCH",
  "FREE SKIN CONSULTATION",
  "HARUHARU WONDER",
  "BEAUTY OF JOSEON",
  "MEDICUBE",
  "ROUND LAB",
  "TORRIDEN",
  "AESTURA",
  "BIODANCE",
];

/**
 * "Dispatch" hero — a bold typographic masthead that leads with the free
 * clinic-grade consultation. Deep hanbok navy field, giant Bodoni headline,
 * a consultation "report card" the visitor immediately understands, and a
 * running brand ticker. No campaign photography: type and product do the work.
 */
export function DispatchHero() {
  const featured = SHOP_PRODUCTS.find((p) => p.priceId === FEATURED_PRICE_ID);

  return (
    <section
      aria-labelledby="dispatch-heading"
      className="relative isolate overflow-hidden bg-hanbok-deep text-paper"
    >
      {/* Subtle vertical grooves — packaging-inspired texture */}
      <div aria-hidden="true" className="absolute inset-0 opacity-[0.06]">
        <div className="absolute left-1/5 top-0 h-full w-px bg-paper" />
        <div className="absolute left-2/5 top-0 h-full w-px bg-paper" />
        <div className="absolute left-3/5 top-0 h-full w-px bg-paper" />
        <div className="absolute left-4/5 top-0 h-full w-px bg-paper" />
      </div>
      {/* Warm glow behind the card */}
      <div
        aria-hidden="true"
        className="absolute -right-40 top-1/3 h-[34rem] w-[34rem] rounded-full bg-grocer-butter/15 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-24 md:px-12 md:pb-32 md:pt-32">
        <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-grocer-butter">
          <span className="h-px w-8 bg-grocer-butter" />
          Skin Grocer · Australia&rsquo;s K-beauty grocer
        </p>

        {/* Masthead headline */}
        <h1
          id="dispatch-heading"
          className="mt-8 font-masthead text-[clamp(3.2rem,8.5vw,7.5rem)] leading-[0.9] tracking-tight"
        >
          <span className="block animate-[rise_0.9s_ease-out_both]">A skin clinic,</span>
          <span className="block animate-[rise_0.9s_ease-out_0.15s_both] italic text-grocer-butter">
            in your inbox.
          </span>
        </h1>

        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:items-end">
          {/* Pitch + CTAs */}
          <div className="lg:col-span-6">
            <p className="max-w-md text-[15px] font-light leading-relaxed text-paper/80">
              Answer a few questions and receive a thorough, skin-clinic-grade
              consultation — a personalised Korean routine with exact products,
              order of use and why — sent free to your phone or email. Not a
              two-question quiz. A real read of your skin.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Button
                asChild
                className="h-13 rounded-full bg-grocer-butter px-9 py-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-hanbok-deep shadow-lg shadow-black/25 transition-colors hover:bg-paper"
              >
                <Link to="/consultation" search={{}}>
                  Start my free consultation <Sparkles />
                </Link>
              </Button>
              <Link
                to="/shop"
                className="group inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-paper/70 transition hover:text-paper"
              >
                Shop the shelf
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] font-medium uppercase tracking-[0.2em] text-paper/50">
              <span className="inline-flex items-center gap-1.5">
                <BadgeCheck className="h-3.5 w-3.5" /> 100% authentic, checked in Seoul
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5" /> Next-day Melbourne dispatch
              </span>
            </div>
          </div>

          {/* Consultation report card */}
          <div className="relative lg:col-span-6">
            <div className="relative ml-auto max-w-md rounded-2xl bg-paper p-7 text-ink shadow-2xl shadow-black/30 md:p-8">
              <div className="flex items-center justify-between border-b border-ink/10 pb-4">
                <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-clay">
                  <ClipboardList className="h-3.5 w-3.5" /> Your skin report
                </p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/40">
                  Free · 24h
                </p>
              </div>

              <ul className="mt-5 space-y-4">
                {[
                  {
                    icon: MessageSquareText,
                    title: "A real read of your skin",
                    line: "Concerns, current routine, climate and lifestyle — weighed together.",
                  },
                  {
                    icon: ClipboardList,
                    title: "Your exact routine, step by step",
                    line: "Named products, order of use, morning and night.",
                  },
                  {
                    icon: Mail,
                    title: "Sent to your phone or email",
                    line: "Yours to keep, shop from, and come back to.",
                  },
                ].map((row, i) => (
                  <li key={row.title} className="flex gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-hanbok-deep/5 text-hanbok-deep">
                      <row.icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-display text-sm uppercase tracking-[0.12em]">
                        {String(i + 1).padStart(2, "0")} — {row.title}
                      </p>
                      <p className="mt-1 text-[13px] leading-relaxed text-ink/60">{row.line}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <Link
                to="/consultation"
                search={{}}
                className="group mt-6 flex items-center justify-between rounded-xl bg-hanbok-deep px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-paper transition-colors hover:bg-hanbok-deep/90"
              >
                Begin — takes 2 minutes
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>

              {/* Floating product cutout */}
              {featured && (
                <Link
                  to="/product/$slug"
                  params={{ slug: productSlug(featured) }}
                  className="group/bottle absolute -left-16 -top-14 hidden w-28 animate-[float-slow_7s_ease-in-out_infinite] md:block"
                  aria-label={`${featured.brand} ${featured.name}`}
                >
                  <img
                    src={tonerCutout}
                    alt=""
                    loading="lazy"
                    className="w-full drop-shadow-[0_18px_24px_rgba(0,0,0,0.35)] transition-transform duration-500 group-hover/bottle:-translate-y-1.5"
                  />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Brand ticker */}
      <div className="relative z-10 border-t border-paper/15 py-4">
        <div className="flex overflow-hidden" aria-hidden="true">
          <div className="flex min-w-full shrink-0 animate-marquee items-center">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span
                key={`${item}-${i}`}
                className="mx-6 flex items-center gap-6 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.3em] text-paper/60"
              >
                {item}
                <span className="h-1 w-1 rounded-full bg-grocer-butter/70" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
