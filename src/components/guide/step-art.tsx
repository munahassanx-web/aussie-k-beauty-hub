import type { GuideStep, StepArt } from "@/lib/guide-steps";
import creamApply from "@/assets/guide/cream-apply.jpg";
import creamWork from "@/assets/guide/cream-work.jpg";
import creamFinish from "@/assets/guide/cream-finish.jpg";
import gelApply from "@/assets/guide/gel-apply.jpg";
import gelWork from "@/assets/guide/gel-work.jpg";
import gelFinish from "@/assets/guide/gel-finish.jpg";
import liquidApply from "@/assets/guide/liquid-apply.jpg";
import liquidWork from "@/assets/guide/liquid-work.jpg";
import liquidFinish from "@/assets/guide/liquid-finish.jpg";
import dispense from "@/assets/guide/dispense.jpg";
import lather from "@/assets/guide/lather.jpg";
import massage from "@/assets/guide/massage-foam.jpg";
import rinse from "@/assets/guide/rinse.jpg";
import pad from "@/assets/guide/pad.jpg";
import sweep from "@/assets/guide/sweep.jpg";
import pat from "@/assets/guide/pat.jpg";
import spread from "@/assets/guide/spread.jpg";
import absorb from "@/assets/guide/absorb.jpg";
import sun from "@/assets/guide/sun.jpg";
import amount from "@/assets/guide/amount.jpg";
import reapply from "@/assets/guide/reapply.jpg";
import mask from "@/assets/guide/mask.jpg";
import remove from "@/assets/guide/remove.jpg";
import layer from "@/assets/guide/layer.jpg";
import cream from "@/assets/guide/cream.jpg";

// Close-up hands-and-textures photos for the "How to use" steps. They show
// technique only — never results or a specific product.
const PHOTOS: Record<StepArt, { src: string; alt: string }> = {
  dispense: { src: dispense, alt: "Fingertip receiving a small amount of formula" },
  lather: { src: lather, alt: "Wet hands working cleanser into a soft lather" },
  massage: { src: massage, alt: "Fingertips massaging foam over the skin" },
  rinse: { src: rinse, alt: "Cupped hands rinsing the face with water" },
  pad: { src: pad, alt: "Cotton pad being soaked with toner" },
  sweep: { src: sweep, alt: "Cotton pad sweeping gently across the cheek" },
  pat: { src: pat, alt: "Palms gently patting product into the skin" },
  spread: { src: spread, alt: "Fingertips smoothing cream across the cheek" },
  absorb: { src: absorb, alt: "Skin with product settling in" },
  sun: { src: sun, alt: "Sunscreen applied as the final morning step" },
  amount: { src: amount, alt: "Sunscreen measured along two fingers" },
  reapply: { src: reapply, alt: "Sunscreen being reapplied during the day" },
  mask: { src: mask, alt: "Sheet mask being smoothed onto the face" },
  timer: { src: mask, alt: "Sheet mask smoothed against the cheek while it is worn" },
  remove: { src: remove, alt: "Sheet mask being lifted away" },
  layer: { src: layer, alt: "Light textures layered from thinnest to richest" },
};

// Alternate shot used when the same action appears twice in a row.
const ALTERNATES: Partial<Record<StepArt, { src: string; alt: string }>> = {
  spread: { src: cream, alt: "Fingertips gliding cream across the skin" },
};

const SEQUENCES = {
  cream: { apply: creamApply, work: creamWork, finish: creamFinish },
  gel: { apply: gelApply, work: gelWork, finish: gelFinish },
  liquid: { apply: liquidApply, work: liquidWork, finish: liquidFinish },
};

export function StepIllustration({
  art,
  className,
  repeat = false,
  sequence,
  phase,
}: {
  art: StepArt;
  className?: string;
  repeat?: boolean;
  sequence?: GuideStep["sequence"];
  phase?: GuideStep["phase"];
}) {
  const p = sequence && phase ? {
    src: SEQUENCES[sequence][phase],
    alt: phase === "apply" ? "Fingertip applying formula directly onto cheek skin"
      : phase === "work" ? art === "pat" ? "Fingertips gently pressing formula over the cheek" : "Fingertips gently smoothing formula over the cheek"
      : "The same cheek after formula has been spread, illustrating application rather than a skincare result",
  } : (repeat && ALTERNATES[art]) || PHOTOS[art];
  return (
    <img
      src={p.src}
      alt={p.alt}
      loading="lazy"
      width={768}
      height={768}
      className={`object-cover ${className ?? ""}`}
    />
  );
}
