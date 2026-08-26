import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowDown, ArrowRight, Check, QrCode, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import observatoryArtwork from "@/assets/skin-grocer-orbit-observatory.jpg.asset.json";

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
  const dragStart = useRef<number | null>(null);
  const [rotation, setRotation] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);

  const setPointer = (event: ReactPointerEvent<HTMLElement>) => {
    const bounds = stageRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    stageRef.current?.style.setProperty("--observatory-x", x.toFixed(3));
    stageRef.current?.style.setProperty("--observatory-y", y.toFixed(3));
    const previousX = dragStart.current;
    if (previousX !== null) {
      setRotation((current) => current + (event.clientX - previousX) * 0.18);
      dragStart.current = event.clientX;
    }
  };

  const stopDrag = (event: ReactPointerEvent<HTMLElement>) => {
    const wasDragging = dragStart.current !== null;
    dragStart.current = null;
    if (wasDragging && event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
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
      aria-labelledby="observatory-heading"
      className="observatory-stage group relative isolate min-h-[calc(100svh-7rem)] cursor-grab overflow-hidden bg-observatory-deep text-observatory-porcelain active:cursor-grabbing md:min-h-[calc(100svh-10rem)]"
      onPointerMove={setPointer}
      onPointerDown={(event) => {
        if ((event.target as HTMLElement).closest("button, a")) return;
        dragStart.current = event.clientX;
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerUp={stopDrag}
      onPointerCancel={stopDrag}
    >
      <div aria-hidden="true" className="observatory-media absolute inset-0">
        <img
          src={observatoryArtwork.url}
          alt=""
          width={1536}
          height={864}
          fetchPriority="high"
          className="observatory-image h-full w-full object-cover object-[62%_center]"
          style={{ "--observatory-drag": `${rotation}deg` } as React.CSSProperties}
        />
        <div className="observatory-depth absolute inset-0" />
        <div className="observatory-vignette absolute inset-0" />
        <div className="observatory-orbit absolute left-[43%] top-[52%] hidden h-[24rem] w-[44rem] -translate-y-1/2 rounded-[50%] border border-observatory-citron/70 shadow-[0_0_22px_var(--observatory-citron-soft)] md:block" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-7rem)] max-w-[1600px] flex-col justify-between px-6 pb-6 pt-8 md:min-h-[calc(100svh-10rem)] md:px-10 md:pb-8 lg:px-16">
        <div className="flex items-center justify-between gap-4 text-[9px] font-medium uppercase tracking-[0.24em] text-observatory-orchid/80 md:text-[10px]">
          <span>Product observatory · 001</span>
          <span className="hidden items-center gap-2 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-observatory-citron shadow-[0_0_12px_var(--observatory-citron)]" />
            Drag to inspect
          </span>
        </div>

        <div className="grid flex-1 items-center md:grid-cols-12">
          <div className="max-w-xl py-14 md:col-span-5 md:py-10">
            <p className="mb-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-observatory-citron">
              <span className="h-px w-8 bg-current" />
              Seoul sourced. Skin assured.
            </p>
            <h1
              id="observatory-heading"
              className="max-w-[10ch] font-masthead text-[clamp(3.6rem,7.2vw,7.7rem)] font-black uppercase leading-[0.82]"
            >
              Know your skin. Know your skincare.
            </h1>
            <p className="mt-7 max-w-[42ch] text-sm leading-7 text-observatory-porcelain/78 md:text-base">
              Authentic Korean skincare, checked before it reaches you. A thorough skin consultation
              turns the Seoul shelf into a routine made for your skin—not somebody else&apos;s trend.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                className="h-12 rounded-none bg-observatory-citron px-7 text-[10px] font-bold uppercase tracking-[0.2em] text-observatory-deep hover:bg-observatory-porcelain"
                onClick={() => setActiveHotspot("routine")}
              >
                Start my consultation <Sparkles />
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-none border-observatory-porcelain/35 bg-transparent px-7 text-[10px] uppercase tracking-[0.2em] text-observatory-porcelain shadow-none hover:bg-observatory-porcelain hover:text-observatory-deep"
              >
                <Link to="/shop">Shop the Seoul edit <ArrowRight /></Link>
              </Button>
            </div>
          </div>

          <div className="relative hidden h-full min-h-[30rem] md:col-span-7 md:block">
            <HotspotButton
              label="Seoul verified"
              className="left-[27%] top-[40%]"
              active={activeHotspot === "verified"}
              onClick={() => setActiveHotspot(activeHotspot === "verified" ? null : "verified")}
            />
            <HotspotButton
              label="Your routine"
              className="right-[7%] top-[53%]"
              active={activeHotspot === "routine"}
              onClick={() => setActiveHotspot(activeHotspot === "routine" ? null : "routine")}
            />
            <HotspotButton
              label="QR guidance"
              className="bottom-[20%] right-[15%]"
              active={activeHotspot === "guide"}
              onClick={() => setActiveHotspot(activeHotspot === "guide" ? null : "guide")}
            />
          </div>
        </div>

        <div className="flex items-end justify-between gap-6 border-t border-observatory-orchid/20 pt-5">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[9px] uppercase tracking-[0.2em] text-observatory-orchid/70 md:text-[10px]">
            <span>Verified in Melbourne</span>
            <span>Personalised routine</span>
            <span>QR how-to guide</span>
          </div>
          <a href="#skin-grocer-promise" className="hidden items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-observatory-orchid/70 transition hover:text-observatory-citron sm:flex">
            Enter the story <ArrowDown className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {activeHotspot ? (
        <div className="absolute inset-x-4 bottom-20 z-30 mx-auto max-w-md border border-observatory-orchid/25 bg-observatory-deep/90 p-5 shadow-2xl backdrop-blur-xl md:bottom-auto md:left-auto md:right-10 md:top-24 md:mx-0 md:w-[25rem]">
          {activeHotspot === "routine" ? (
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-observatory-citron">Consultation · Question 01</p>
              <h2 className="mt-3 font-masthead text-3xl leading-tight">What does your skin do by 3pm?</h2>
              <div className="mt-5 grid grid-cols-2 gap-2">
                {answers.map((answer) => (
                  <Button
                    key={answer.value}
                    variant="outline"
                    className="h-auto min-h-12 whitespace-normal rounded-none border-observatory-orchid/25 bg-transparent px-3 py-3 text-left text-[11px] leading-4 text-observatory-porcelain shadow-none hover:border-observatory-citron hover:bg-observatory-citron hover:text-observatory-deep"
                    onClick={() => chooseAnswer(answer.value)}
                  >
                    {answer.label}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex gap-4">
              <span className="mt-1 flex h-9 w-9 flex-none items-center justify-center rounded-full bg-observatory-citron text-observatory-deep">
                {activeHotspot === "verified" ? <Check className="h-4 w-4" /> : <QrCode className="h-4 w-4" />}
              </span>
              <div>
                <p className="font-masthead text-2xl">{hotspotCopy[activeHotspot].title}</p>
                <p className="mt-2 text-sm leading-6 text-observatory-orchid/80">{hotspotCopy[activeHotspot].body}</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2 text-observatory-orchid hover:bg-observatory-orchid/10 hover:text-observatory-porcelain"
            onClick={() => setActiveHotspot(null)}
            aria-label="Close detail"
          >
            ×
          </Button>
        </div>
      ) : null}
    </section>
  );
}

function HotspotButton({ label, className, active, onClick }: { label: string; className: string; active: boolean; onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      aria-pressed={active}
      className={`observatory-hotspot absolute h-auto rounded-full bg-transparent p-0 text-observatory-porcelain hover:bg-transparent hover:text-observatory-citron ${className}`}
    >
      <span className="relative flex h-11 w-11 items-center justify-center rounded-full border border-observatory-citron/60 bg-observatory-deep/45 backdrop-blur-md">
        <span className="h-1.5 w-1.5 rounded-full bg-observatory-citron" />
      </span>
      <span className="border-b border-observatory-orchid/30 pb-1 text-[9px] uppercase tracking-[0.2em]">{label}</span>
    </Button>
  );
}