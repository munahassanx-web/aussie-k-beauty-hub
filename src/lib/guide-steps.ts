// Turns a product's directions into short, illustrated steps for the
// "How to use" guide. Wording is never changed: each sentence of the source
// directions becomes one step, and only a short label and a picture are added.

import type { ShopProduct } from "@/lib/shop-catalog";
import { howToUse, productSlug, supplyRestricted } from "@/lib/product-detail";
import { applicationForSlug } from "@/lib/product-application-data";
import { AISLES, aisleFor, type Aisle } from "@/lib/aisles";

export type StepArt =
  | "dispense"
  | "lather"
  | "massage"
  | "rinse"
  | "pad"
  | "sweep"
  | "pat"
  | "spread"
  | "absorb"
  | "sun"
  | "amount"
  | "reapply"
  | "mask"
  | "timer"
  | "remove"
  | "layer";

export type GuideStep = { title: string; text: string; art: StepArt };

const TITLES: Record<StepArt, [string, string]> = {
  dispense: ["Dispense", "Take a little more"],
  lather: ["Work into a lather", "Build the foam"],
  massage: ["Massage in", "Keep massaging"],
  rinse: ["Rinse", "Rinse again"],
  pad: ["Soak a pad", "Refresh the pad"],
  sweep: ["Sweep gently", "Sweep again"],
  pat: ["Pat it in", "Press it in"],
  spread: ["Apply", "Smooth it over"],
  absorb: ["Let it absorb", "Give it a moment"],
  sun: ["Last step, morning", "Finish with SPF"],
  amount: ["Use enough", "Top up"],
  reapply: ["Reapply outdoors", "Reapply again"],
  mask: ["Apply the mask", "Smooth the mask"],
  timer: ["Leave it on", "Wait"],
  remove: ["Remove", "Lift away"],
  layer: ["Next step", "Carry on"],
};

// Order matters: the first match wins.
const RULES: Array<[RegExp, StepArt]> = [
  [/reapply/, "reapply"],
  [/finger-length|two fingers/, "amount"],
  [/\bminutes?\b|leave (it )?on|leave for/, "timer"],
  [/\bremove|peel|take off/, "remove"],
  [/rinse|wash off/, "rinse"],
  [/lather|foam/, "lather"],
  [/massage/, "massage"],
  [/wipe|sweep/, "sweep"],
  [/\bpad\b|cotton/, "pad"],
  [/\bmask\b|sheet/, "mask"],
  [/\bpat\b|\bpress|tap/, "pat"],
  [/absorb/, "absorb"],
  [/sunscreen|morning routine|\bspf\b/, "sun"],
  [/^follow with|next step|remaining steps/, "layer"],
  [/dispense|\bpump|squeeze/, "dispense"],
];

function artFor(sentence: string, isMask: boolean): StepArt {
  const s = sentence.toLowerCase();
  // Mask directions often combine application/removal with a wear duration.
  // Show the physical action rather than letting the time keyword win.
  if (isMask) {
    if (/\b(?:apply|place|unfold)\b/.test(s)) return "mask";
    if (/\b(?:remove|peel|take off)\b/.test(s)) return "remove";
  }
  for (const [pattern, art] of RULES) if (pattern.test(s)) return art;
  return "spread";
}

function sentences(text: string): string[] {
  return text
    .split(/(?<=[.!])\s+(?=[A-Z])/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export type GuideDirections = {
  steps: GuideStep[];
  /** True when the steps are the brand's own directions for this SKU. */
  fromBrand: boolean;
};

export function guideDirections(p: ShopProduct): GuideDirections {
  if (supplyRestricted(p)) return { steps: [], fromBrand: false };
  const brand = applicationForSlug(productSlug(p));
  const source = brand?.steps.length ? brand.steps : howToUse(p);
  const used = new Map<StepArt, number>();
  const steps = source.flatMap(sentences).map((text) => {
    const art = artFor(text, p.category === "Masks");
    const n = used.get(art) ?? 0;
    used.set(art, n + 1);
    const title = /if preferred|may be used/i.test(text)
      ? "Or use a cotton pad"
      : TITLES[art][Math.min(n, 1)];
    return { title, text, art };
  });
  return { steps, fromBrand: Boolean(brand?.steps.length) };
}

/** The product's skin-goal aisle, used to colour its guide. */
export function guideAisle(p: ShopProduct): Aisle {
  return aisleFor(p.concerns) ?? AISLES.glass;
}

export type AisleKey = keyof typeof AISLES;

export function aisleKey(aisle: Aisle): AisleKey {
  return (Object.keys(AISLES) as AisleKey[]).find((k) => AISLES[k] === aisle) ?? "glass";
}

/** A product-accurate "in use" photo, when the gallery has one. */
export function applyPhoto(gallery: Array<{ src: string; alt: string }>) {
  return gallery.slice(1).find((g) => /press|smooth|appl|tapp|pat|massag|sweep|wip/i.test(g.alt));
}
