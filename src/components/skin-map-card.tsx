import { FACE_ZONES, zoneSummary, type FaceZone, type FaceZones } from "@/lib/skin-quiz";
import type { SkinFeel } from "@/lib/routine-matching";

const LABEL: Record<SkinFeel, string> = {
  dry: "Dry-leaning",
  oily: "Oily-leaning",
  combination: "Combination",
  balanced: "Balanced",
  unsure: "Still getting to know it",
};

/** Same hotspot layout as the face map, drawn small. */
const DOT: Record<FaceZone, { x: number; y: number }> = {
  forehead: { x: 50, y: 25.4 },
  nose: { x: 50, y: 44.6 },
  "left-cheek": { x: 36.6, y: 50 },
  "right-cheek": { x: 63.4, y: 50 },
  chin: { x: 50, y: 62 },
};

/** Results header: skin type plus the zones the person mapped. */
export function SkinMapCard({ skinFeel, zones }: { skinFeel: SkinFeel; zones: FaceZones | null }) {
  return (
    <div className="mt-5 flex items-center gap-5 rounded-2xl border border-border bg-paper p-4">
      {zones && (
        <div className="relative aspect-[720/964] w-20 shrink-0 overflow-hidden rounded-xl bg-[#efe6dc]">
          <div className="absolute inset-0 origin-[50%_44%] scale-[1.45]">
            <img
              src="/quiz/face.webp"
              alt=""
              width={720}
              height={964}
              className="h-full w-full object-cover"
            />
            {FACE_ZONES.map((z) => {
              const kind = zones.shine.includes(z.id)
                ? "bg-aisle-honey"
                : zones.tight.includes(z.id)
                  ? "bg-aisle-hydration"
                  : null;
              if (!kind) return null;
              return (
                <span
                  key={z.id}
                  aria-hidden
                  className={`absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-1 ring-white/80 ${kind}`}
                  style={{ left: `${DOT[z.id].x}%`, top: `${DOT[z.id].y}%` }}
                />
              );
            })}
          </div>
        </div>
      )}
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Your skin type
        </p>
        <p className="mt-1 text-xl font-light text-ink">{LABEL[skinFeel]}</p>
        {zones && (
          <p className="mt-1 text-[13px] leading-relaxed text-ink/70">{zoneSummary(zones)}</p>
        )}
        {zones && (
          <p className="mt-2 flex gap-4 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-aisle-honey" /> shine
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-aisle-hydration" /> tight
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
