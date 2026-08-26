import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, BadgeCheck, Sparkles, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SHOP_PRODUCTS } from "@/lib/shop-catalog";
import { productSlug } from "@/lib/product-detail";
import campaignImage from "@/assets/hero-editorial-campaign.jpg";
import tonerCutout from "@/assets/haruharu-toner-cutout.png";

const FEATURED_PRICE_ID = "haruharu_wonder_black_rice_hyaluronic_toner_150ml_onetime";

/**
 * Rhode-inspired full-bleed editorial hero: campaign photography fills the
 * frame, copy sits quiet and low-left, one confident consultation CTA.
 */
export function CampaignHero() {
  const stageRef = useRef<HTMLElement>(null);

  const featured = SHOP_PRODUCTS.find((p) => p.priceId === FEATURED_PRICE_ID);

  // Gentle parallax drift on the campaign image.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const media = stage.querySelector<HTMLElement>("[data-campaign-media]");
    if (!media) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = stage.getBoundingClientRect();
        const progress = Math.min(Math.max(-rect.top / rect.height, 0), 1);
        media.style.transform = `scale(1.08) translateY(${progress * 4}%)`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={stageRef}
      aria-labelledby="campaign-heading"
      className="relative isolate overflow-hidden bg-[#EDE6DC] text-[#2B2118]"
    >
      {/* Full-bleed campaign photography */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <div data-campaign-media className="h-full w-full will-change-transform">
          <img
            src={campaignImage}
            alt=""
            width={1920}
            height={1200}
            fetchPriority="high"
            className="h-full w-full animate-[campaign-settle_2.4s_ease-out] object-cover object-[68%_center]"
          />
        </div>
        {/* Legibility wash — light on the copy side, keeps skin tones intact */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#F3EDE4] via-[#F3EDE4]/70 to-transparent md:bg-gradient-to-r md:from-[#F3EDE4]/90 md:via-[#F3EDE4]/20 md:to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#F3EDE4]/70 to-transparent md:from-[#F3EDE4]/50" />
      </div>

      {/* Copy — low and left, Rhode cadence */}
      <div className="relative z-10 mx-auto flex min-h-[86svh] w-full max-w-7xl items-end px-6 pb-20 pt-24 md:min-h-[92svh] md:px-12 md:pb-24">
        <div className="max-w-xl">
          <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#7A6A58]">
            <span className="h-px w-8 bg-[#7A6A58]" />
            Seoul verified · Dispatched from Melbourne
          </p>
          <h1
            id="campaign-heading"
            className="mt-6 font-masthead text-[clamp(3rem,7vw,6.25rem)] leading-[0.92] tracking-tight"
          >
            Your skin,
            <span className="block italic text-[#9A6B4F]">properly read.</span>
          </h1>
          <p className="mt-6 max-w-md text-[15px] font-light leading-relaxed text-[#4C4034]">
            Authentic Korean skincare, matched to your skin through a free
            skin-clinic-grade consultation — then delivered to your door by morning.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-5">
            <Button
              asChild
              className="h-13 rounded-full bg-[#2B2118] px-9 py-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#F6F1E9] shadow-lg shadow-[#2B2118]/20 transition-colors hover:bg-[#4A3A2B]"
            >
              <Link to="/consultation" search={{}}>
                Start my consultation <Sparkles />
              </Link>
            </Button>
            <Link
              to="/shop"
              className="group inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#2B2118]/80 transition hover:text-[#2B2118]"
            >
              Shop the shelf
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Quiet trust line */}
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] font-medium uppercase tracking-[0.2em] text-[#7A6A58]">
            <span className="inline-flex items-center gap-1.5">
              <BadgeCheck className="h-3.5 w-3.5" /> 100% authentic, checked in Seoul
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5" /> Next-day Melbourne dispatch
            </span>
          </div>
        </div>
      </div>

      {/* Featured product card — floating, Glossier-minimal */}
      {featured && (
        <Link
          to="/product/$slug"
          params={{ slug: productSlug(featured) }}
          className="group absolute bottom-10 right-8 z-20 hidden w-52 rounded-2xl border border-white/50 bg-white/55 p-4 shadow-xl shadow-[#2B2118]/10 backdrop-blur-xl transition hover:bg-white/70 lg:block xl:right-14"
        >
          <div className="flex h-40 items-center justify-center">
            <img
              src={tonerCutout}
              alt={`${featured.brand} ${featured.name}`}
              loading="lazy"
              className="max-h-full w-auto object-contain drop-shadow-[0_16px_20px_rgba(43,33,24,0.18)] transition-transform duration-500 group-hover:-translate-y-1"
            />
          </div>
          <div className="mt-3 border-t border-[#2B2118]/10 pt-3">
            <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#7A6A58]">
              {featured.brand}
            </p>
            <p className="mt-1 font-masthead text-sm italic leading-snug text-[#2B2118]">
              {featured.name}
            </p>
            <p className="mt-2 flex items-center justify-between text-xs font-semibold text-[#2B2118]">
              {featured.price}
              <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.18em] text-[#7A6A58] transition group-hover:text-[#2B2118]">
                View <ArrowUpRight className="h-3 w-3" />
              </span>
            </p>
          </div>
        </Link>
      )}
    </section>
  );
}
