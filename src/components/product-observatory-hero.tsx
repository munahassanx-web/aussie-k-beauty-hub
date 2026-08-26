import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowDown, ArrowRight, BadgeCheck, QrCode, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import tonerBottle from "@/assets/haruharu-toner-cutout.png";

type Hotspot = "verified" | "routine" | "guide";
type SkinAnswer = "dry" | "oily" | "combination" | "often";

const answers: { label: string; value: SkinAnswer }[] = [
  { label: "Tight or dry", value: "dry" },
  { label: "Shiny by midday", value: "oily" },
  { label: "Oily T-zone, dry cheeks", value: "combination" },
  { label: "Red and reactive", value: "often" },
];

const hotspotCopy: Record<Exclude<Hotspot, "routine">, { title: string; body: string }> = {
  verified: {
    title: "Seoul verified",
    body: "Sourced from Seoul and checked by our Melbourne team before dispatch.",
  },
  guide: {
    title: "Scan to know how",
    body: "Your order-linked QR guide shows where every product belongs in your routine.",
  },
};

export function ProductObservatoryHero() {
  const navigate = useNavigate();
  const stageRef = useRef<HTMLElement>(null);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);

  const setPointer = (event: ReactPointerEvent<HTMLElement>) => {
    const bounds = stageRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    stageRef.current?.style.setProperty("--sanctuary-x", x.toFixed(3));
    stageRef.current?.style.setProperty("--sanctuary-y", y.toFixed(3));
  };

  const chooseAnswer = (answer: SkinAnswer) => {
    const skinFeel = answer === "often" ? "unsure" : answer;
    window.localStorage.setItem(
      "sg-consultation-v2",
      JSON.stringify({
        draft: {
          skinFeel,
          primaryConcern: answer === "often" ? "sensitivity" : null,
          secondaryConcern: null,
          reactivity: answer === "often" ? "often" : null,
          experience: null,
          depth: null,
          texture: null,
        },
        done: false,
        heroStarted: true,
      }),
    );
    void navigate({ to: "/consultation", search: {} });
  };

  return (
    <section
      ref={stageRef}
      aria-labelledby="sanctuary-heading"
      onPointerMove={setPointer}
      className="group relative isolate min-h-[calc(100svh-7rem)] overflow-hidden bg-sanctuary-bg text-sanctuary-ink md:min-h-[calc(100svh-10rem)]"
    >
      {/* Ambient washes */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-[10%] -top-[10%] h-[50%] w-[50%] rounded-full bg-sanctuary-sage opacity-70 blur-[120px]" />
        <div className="absolute -bottom-[5%] -right-[5%] h-[40%] w-[40%] rounded-full bg-sanctuary-sage-deep opacity-50 blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(var(--sanctuary-ink)_1px,transparent_1px),linear-gradient(90deg,var(--sanctuary-ink)_1px,transparent_1px)] [background-size:100px_100px]" />
      </div>

      {/* Top UI strip */}
      <div className="pointer-events-none absolute inset-x-0 top-6 z-20 flex items-center justify-between px-6 text-[9px] uppercase tracking-[0.3em] text-sanctuary-muted md:px-12 md:top-10">
        <span className="flex gap-8">
          <span>Clinical session · 001</span>
          <span className="hidden md:inline">Interactive</span>
        </span>
        <span className="flex items-center gap-2 font-bold text-sanctuary-ink">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sanctuary-ink" />
          Move to explore
        </span>
      </div>

      <div className="relative z-10 mx-auto grid min-h-[calc(100svh-7rem)] w-full max-w-7xl items-center gap-12 px-6 pb-20 pt-24 md:px-12 md:min-h-[calc(100svh-10rem)] lg:grid-cols-2 lg:pb-16">
        {/* Editorial column */}
        <div className="flex flex-col items-start">
          <p className="mb-8 flex items-center gap-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-sanctuary-muted">
            <span className="h-px w-8 bg-sanctuary-line" />
            Seoul Sourced. Skin Assured.
          </p>
          <h1
            id="sanctuary-heading"
            className="font-masthead text-[clamp(3.2rem,6.5vw,6.5rem)] italic leading-[0.88] tracking-tight"
          >
            Know your{" "}
            <span className="block not-italic font-black tracking-tighter">skin.</span>
            Know your{" "}
            <span className="block not-italic font-black tracking-tighter text-sanctuary-gold-deep">skincare.</span>
          </h1>

          <div className="mb-10 mt-10 max-w-md rounded-2xl border border-white/50 bg-white/40 p-7 backdrop-blur-md">
            <p className="text-sm leading-relaxed text-sanctuary-muted">
              Authentic Korean skincare, checked before it reaches you. A thorough skin consultation
              turns the Seoul shelf into a routine made for your skin—not somebody else&apos;s trend.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button
              className="h-14 rounded-full bg-sanctuary-gold px-8 text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-xl shadow-sanctuary-gold/30 hover:bg-sanctuary-gold-deep"
              onClick={() => setActiveHotspot("routine")}
            >
              Start my consultation <Sparkles />
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-14 rounded-full border-sanctuary-line bg-transparent px-8 text-[11px] font-bold uppercase tracking-[0.2em] text-sanctuary-ink shadow-none hover:bg-white"
            >
              <Link to="/shop">Shop the Seoul edit <ArrowRight /></Link>
            </Button>
          </div>
        </div>

        {/* Product stage */}
        <div className="relative hidden min-h-[34rem] items-center justify-center lg:flex">
          {/* Light glow */}
          <div
            aria-hidden="true"
            className="absolute h-[24rem] w-[24rem] rounded-full bg-white opacity-60 blur-[80px]"
            style={{
              transform:
                "translate(calc(var(--sanctuary-x, 0) * -24px), calc(var(--sanctuary-y, 0) * -16px))",
            }}
          />
          {/* Orbit ring */}
          <div
            aria-hidden="true"
            className="absolute h-[15rem] w-[30rem] -rotate-[25deg] rounded-[100%] border border-sanctuary-line/70 shadow-[inset_0_0_20px_rgba(255,255,255,0.5)]"
            style={{
              transform:
                "rotate(-25deg) translate(calc(var(--sanctuary-x, 0) * 30px), calc(var(--sanctuary-y, 0) * 18px))",
            }}
          />
          {/* Bottle */}
          <img
            src={tonerBottle}
            alt="Haruharu Wonder Black Rice Hyaluronic Toner 150ml"
            width={471}
            height={1296}
            fetchPriority="high"
            className="relative z-10 h-[30rem] w-auto drop-shadow-[0_30px_50px_rgba(0,0,0,0.14)] transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
            style={{
              transform:
                "translate(calc(var(--sanctuary-x, 0) * 40px), calc(var(--sanctuary-y, 0) * 24px)) scale(1.01)",
            }}
          />

          <HotspotButton
            label="Seoul verified"
            className="right-[6%] top-[24%]"
            active={activeHotspot === "verified"}
            onClick={() => setActiveHotspot(activeHotspot === "verified" ? null : "verified")}
          />
          <HotspotButton
            label="Clinic guidance"
            className="bottom-[32%] left-[2%]"
            active={activeHotspot === "guide"}
            onClick={() => setActiveHotspot(activeHotspot === "guide" ? null : "guide")}
          />

          {/* Dispatch badge */}
          <div className="absolute bottom-0 right-0 z-20 flex items-center gap-4 rounded-2xl border border-sanctuary-line bg-white/60 p-4 backdrop-blur-md">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-sanctuary-line text-sanctuary-muted">
              <BadgeCheck className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-[10px] font-bold uppercase tracking-tight text-sanctuary-ink">
                Personalised routine
              </span>
              <span className="block text-[9px] uppercase tracking-[0.2em] text-sanctuary-muted">
                Melbourne dispatch
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Detail / quiz panel */}
      {activeHotspot ? (
        <div className="absolute inset-x-4 bottom-20 z-30 mx-auto max-w-md rounded-2xl border border-sanctuary-line bg-white/85 p-6 shadow-2xl backdrop-blur-xl md:bottom-auto md:left-auto md:right-10 md:top-28 md:mx-0 md:w-[25rem]">
          {activeHotspot === "routine" ? (
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-sanctuary-gold-deep">
                Consultation · Question 01
              </p>
              <h2 className="mt-3 font-masthead text-3xl leading-tight">What does your skin do by 3pm?</h2>
              <div className="mt-5 grid grid-cols-2 gap-2">
                {answers.map((answer) => (
                  <Button
                    key={answer.value}
                    variant="outline"
                    className="h-auto min-h-12 whitespace-normal rounded-xl border-sanctuary-line bg-transparent px-3 py-3 text-left text-[11px] leading-4 text-sanctuary-ink shadow-none hover:border-sanctuary-gold hover:bg-sanctuary-gold hover:text-white"
                    onClick={() => chooseAnswer(answer.value)}
                  >
                    {answer.label}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex gap-4">
              <span className="mt-1 flex h-9 w-9 flex-none items-center justify-center rounded-full bg-sanctuary-gold text-white">
                {activeHotspot === "verified" ? <BadgeCheck className="h-4 w-4" /> : <QrCode className="h-4 w-4" />}
              </span>
              <div>
                <p className="font-masthead text-2xl">{hotspotCopy[activeHotspot].title}</p>
                <p className="mt-2 text-sm leading-6 text-sanctuary-muted">{hotspotCopy[activeHotspot].body}</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2 text-sanctuary-muted hover:bg-sanctuary-sage hover:text-sanctuary-ink"
            onClick={() => setActiveHotspot(null)}
            aria-label="Close detail"
          >
            ×
          </Button>
        </div>
      ) : null}

      {/* Bottom strip */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-6 border-t border-sanctuary-line/60 px-6 py-5 text-[9px] uppercase tracking-[0.25em] text-sanctuary-muted md:px-12 md:text-[10px]">
        <span className="flex flex-wrap gap-x-8 gap-y-2">
          <span>Verified in Melbourne</span>
          <span>Personalised routine</span>
          <span>QR how-to guide</span>
        </span>
        <a
          href="#skin-grocer-promise"
          className="hidden items-center gap-2 transition hover:text-sanctuary-gold-deep sm:flex"
        >
          Enter the story <ArrowDown className="h-3.5 w-3.5" />
        </a>
      </div>
    </section>
  );
}

function HotspotButton({
  label,
  className,
  active,
  onClick,
}: {
  label: string;
  className: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      aria-pressed={active}
      className={`group/spot absolute z-20 h-auto flex-col items-center gap-2 rounded-full bg-transparent p-0 hover:bg-transparent ${className}`}
    >
      <span className="relative flex h-4 w-4 items-center justify-center">
        <span
          className={`absolute inset-0 rounded-full bg-sanctuary-gold ${active ? "" : "animate-ping opacity-60"}`}
        />
        <span className="relative h-3 w-3 rounded-full border border-white bg-sanctuary-gold shadow" />
      </span>
      <span
        className={`whitespace-nowrap rounded-full border border-sanctuary-line bg-white/80 px-3 py-1 text-[9px] uppercase tracking-[0.2em] text-sanctuary-ink backdrop-blur transition ${
          active ? "opacity-100" : "opacity-70 group-hover/spot:opacity-100"
        }`}
      >
        {label}
      </span>
    </Button>
  );
}
