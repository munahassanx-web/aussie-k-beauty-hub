import { useRef, useState } from "react";
import { FACE_ZONES, skinFeelFromZones, type FaceZone, type FaceZones } from "@/lib/skin-quiz";
import type { SkinFeel } from "@/lib/routine-matching";

/** Zone hotspots as a percentage of the face image (720 × 964). */
const ZONE_BOX: Record<FaceZone, { x: number; y: number; w: number; h: number }> = {
  forehead: { x: 50, y: 25.4, w: 27, h: 9.5 },
  nose: { x: 50, y: 44.6, w: 9.5, h: 12 },
  "left-cheek": { x: 36.6, y: 50, w: 13, h: 13 },
  "right-cheek": { x: 63.4, y: 50, w: 13, h: 13 },
  chin: { x: 50, y: 62, w: 13, h: 6.5 },
};

type Mode = "shine" | "tight";

const COPY: Record<Mode, { title: string; hint: string; next: string }> = {
  shine: {
    title: "Where does shine show up by midday?",
    hint: "Tap every area that looks glossy a few hours after cleansing.",
    next: "Next: where it feels tight",
  },
  tight: {
    title: "Where does it feel tight or dry?",
    hint: "Tap the areas that feel tight after cleansing or look flaky.",
    next: "See my skin type",
  },
};

/**
 * Interactive face map: people mark shine, then tightness, zone by zone, the
 * way a skin therapist reads oil and dryness. The face tilts with the pointer
 * for a sense of depth.
 */
export function FaceMap({
  onComplete,
  onDescribeInstead,
  compact = false,
}: {
  onComplete: (skinFeel: SkinFeel, zones: FaceZones) => void;
  onDescribeInstead?: () => void;
  compact?: boolean;
}) {
  const [mode, setMode] = useState<Mode>("shine");
  const [zones, setZones] = useState<FaceZones>({ shine: [], tight: [] });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const stage = useRef<HTMLDivElement>(null);

  const toggle = (z: FaceZone) =>
    setZones((cur) => {
      const list = cur[mode];
      return { ...cur, [mode]: list.includes(z) ? list.filter((x) => x !== z) : [...list, z] };
    });

  const advance = () => {
    if (mode === "shine") setMode("tight");
    else onComplete(skinFeelFromZones(zones), zones);
  };

  const onMove = (e: React.PointerEvent) => {
    const el = stage.current;
    if (!el || e.pointerType === "touch") return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: -py * 10, y: px * 12 });
  };

  const selected = zones[mode];
  const other = mode === "tight" ? zones.shine : [];

  return (
    <div className="text-ink">
      <div className="flex items-center gap-2" role="tablist" aria-label="Face map steps">
        {(["shine", "tight"] as Mode[]).map((m, i) => (
          <span
            key={m}
            role="tab"
            aria-selected={mode === m}
            className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
              mode === m ? "bg-ink text-paper" : "bg-ink/5 text-ink/50"
            }`}
          >
            {i + 1} · {m === "shine" ? "Shine" : "Tightness"}
          </span>
        ))}
      </div>
      <p
        className={`mt-4 font-light leading-snug ${compact ? "text-xl" : "text-[1.55rem] md:text-[1.7rem]"}`}
      >
        {COPY[mode].title}
      </p>
      <p className="mt-2 text-[13px] leading-relaxed text-ink/60">{COPY[mode].hint}</p>

      <div
        className={`mt-5 grid items-center gap-5 ${compact ? "sm:grid-cols-[minmax(0,15rem)_1fr]" : "sm:grid-cols-[minmax(0,17rem)_1fr]"}`}
      >
        <div
          ref={stage}
          onPointerMove={onMove}
          onPointerLeave={() => setTilt({ x: 0, y: 0 })}
          className="mx-auto w-full max-w-[17rem] [perspective:900px]"
        >
          <div
            className="face-map-float relative aspect-[720/964] overflow-hidden rounded-[2rem] bg-[#efe6dc] shadow-[0_30px_60px_-30px_rgba(46,30,25,0.45)] transition-transform duration-300 ease-out [transform-style:preserve-3d]"
            style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
          >
            <div className="absolute inset-0 origin-[50%_44%] scale-[1.45]">
              <img
                src="/quiz/face.webp"
                alt=""
                width={720}
                height={964}
                className="absolute inset-0 h-full w-full object-cover"
                draggable={false}
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_70%_at_30%_10%,rgba(255,255,255,0.35),transparent_55%)]"
              />
              {FACE_ZONES.map((z) => {
                const b = ZONE_BOX[z.id];
                const on = selected.includes(z.id);
                const marked = other.includes(z.id);
                return (
                  <button
                    key={z.id}
                    type="button"
                    aria-pressed={on}
                    aria-label={`${z.label}${on ? ", selected" : ""}`}
                    onClick={() => toggle(z.id)}
                    className={`face-zone absolute rounded-[50%] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink ${
                      on
                        ? mode === "shine"
                          ? "face-zone--shine"
                          : "face-zone--tight"
                        : marked
                          ? "face-zone--marked"
                          : "face-zone--idle"
                    }`}
                    style={{
                      left: `${b.x - b.w / 2}%`,
                      top: `${b.y - b.h / 2}%`,
                      width: `${b.w}%`,
                      height: `${b.h}%`,
                      transform: "translateZ(24px)",
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div>
          <ul className="flex flex-wrap gap-2">
            {FACE_ZONES.map((z) => {
              const on = selected.includes(z.id);
              return (
                <li key={z.id}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggle(z.id)}
                    className={`rounded-full border px-3.5 py-1.5 text-[13px] transition-colors ${
                      on ? "border-ink bg-ink text-paper" : "border-ink/15 hover:border-ink"
                    }`}
                  >
                    {z.label}
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={advance}
              className="min-h-11 rounded-full bg-ink px-6 text-[11px] font-medium uppercase tracking-[0.16em] text-paper transition-colors hover:bg-primary"
            >
              {selected.length === 0
                ? mode === "shine"
                  ? "No shine, next"
                  : "None, see my skin type"
                : COPY[mode].next}
            </button>
            {mode === "tight" && (
              <button
                type="button"
                onClick={() => setMode("shine")}
                className="min-h-11 px-1 text-[11px] uppercase tracking-[0.14em] text-ink/55 hover:text-ink"
              >
                ← Back
              </button>
            )}
          </div>
          {onDescribeInstead && (
            <button
              type="button"
              onClick={onDescribeInstead}
              className="mt-4 text-[12.5px] text-ink/55 underline underline-offset-4 hover:text-ink"
            >
              Not sure? Describe it in words instead
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
