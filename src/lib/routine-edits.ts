import { SHOP_PRODUCTS } from "@/lib/shop-catalog";

export type RoutineSlot = {
  priceId: string;
  role: string;
  why: string;
};

export type RoutineEdit = {
  id: "essential-hydration" | "tone-glow-support" | "barrier-comfort";
  number: string;
  name: string;
  purpose: string;
  field: string;
  accent: string;
  core: RoutineSlot[];
  optional?: RoutineSlot & { label: string; caution?: string };
  morning: string[];
  evening: string[];
  whyThree: string;
  cautions: string[];
};

export const BUILD_LATER = {
  heading: "Build later, if needed",
  body: "Start with the three-product core. Introduce additional products only after your skin has had time to adjust.",
};

export const ROUTINE_EDITS: RoutineEdit[] = [
  {
    id: "essential-hydration",
    number: "01",
    name: "The Essential Hydration Edit",
    purpose: "For skin that often feels tight, dehydrated or uncomfortable and needs a simple everyday starting point.",
    field: "bg-[#eef2f6]",
    accent: "text-hanbok-deep",
    core: [
      { priceId: "round_lab_1025_dokdo_cleanser_150ml_onetime", role: "Gentle cleanse", why: "Removes sunscreen and daily buildup without stripping the skin." },
      { priceId: "torriden_dive_in_serum_onetime", role: "Lightweight hydration", why: "Adds a light hydrating step under moisturiser." },
      { priceId: "aestura_atobarrier365_cream_onetime", role: "Moisturising support", why: "Helps reduce water loss and keeps the routine comfortable." },
    ],
    optional: { priceId: "wellage_real_hyaluronic_toner_200ml_onetime", label: "Optional hydrating layer", role: "Extra hydrating layer", why: "A toner may add another hydrating layer, but the core routine can work without it." },
    morning: ["Serum if wanted", "Moisturiser", "Appropriate sun protection"],
    evening: ["Cleanser", "Serum", "Moisturiser"],
    whyThree: "One cleanse, one hydrating step, one moisturiser. Three products cover the everyday basics without duplicating the same job twice.",
    cautions: ["Introduce one new product at a time, about a week apart.", "Patch-test on a small area of the inner forearm or jawline before full-face use.", "Cleanse once in the evening; twice daily only if it stays comfortable.", "Sun protection is part of any daytime routine and is bought separately.", "Stop use if persistent stinging, redness or itching occurs."],
  },
  {
    id: "tone-glow-support",
    number: "02",
    name: "The Tone + Glow Support Edit",
    purpose: "For customers who want to support hydration and improve the appearance of uneven-looking tone without building a long routine.",
    field: "bg-[#f6efe6]",
    accent: "text-clay",
    core: [
      { priceId: "torriden_balanceful_cleansing_gel_onetime", role: "Cleanse", why: "Removes sunscreen and daily buildup before the next steps." },
      { priceId: "beauty_of_joseon_glow_serum_propolis_plus_niacinamide_30ml_onetime", role: "Targeted tone and hydration support", why: "Supports hydration and the appearance of uneven-looking tone in one step." },
      { priceId: "torriden_dive_in_soothing_cream_onetime", role: "Moisturise", why: "Helps reduce water loss and keeps the routine comfortable." },
    ],
    optional: { priceId: "biodance_bio_collagen_real_deep_mask_onetime", label: "Optional occasional mask", role: "Occasional hydrating mask", why: "A mask can be a pleasant occasional hydrating step, but the core routine works without it." },
    morning: ["Serum if wanted", "Moisturiser", "Appropriate sun protection"],
    evening: ["Cleanser", "Serum", "Moisturiser"],
    whyThree: "Cleanse, one supportive serum, moisturise. The serum carries the tone-support role so nothing else needs to repeat it.",
    cautions: ["Introduce one new product at a time, about a week apart.", "Patch-test before full-face use, particularly if you react to bee-derived ingredients such as propolis.", "Niacinamide is usually well tolerated; reduce frequency if your skin feels warm or flushed.", "Avoid layering with strong exfoliants or retinoids in the same routine while you are settling in.", "Masks are occasional, not daily. Stop use if persistent irritation occurs."],
  },
  {
    id: "barrier-comfort",
    number: "03",
    name: "The Barrier-Comfort Edit",
    purpose: "A simple, active-free starting routine for skin that feels easily unsettled or overcomplicated.",
    field: "bg-[#eef2ec]",
    accent: "text-[#3f5c46]",
    core: [
      { priceId: "beplain_mung_bean_ph_balanced_cleansing_foam_80ml_onetime", role: "Gentle cleanse", why: "A low-fuss pH-balanced cleanse that removes the day without a stripped feeling." },
      { priceId: "beplain_cicaful_ampoule_30ml_onetime", role: "Lightweight soothing support", why: "Adds a light soothing step without introducing an active." },
      { priceId: "aestura_atobarrier365_cream_onetime", role: "Moisturising and barrier support", why: "Helps reduce water loss and keeps the routine comfortable." },
    ],
    morning: ["Ampoule if wanted", "Moisturiser", "Appropriate sun protection"],
    evening: ["Cleanser", "Ampoule", "Moisturiser"],
    whyThree: "Cleanse, soothe, moisturise — and nothing else. Fewer variables makes it easier to tell what your skin is responding to.",
    cautions: ["Introduce one new product at a time, about a week apart.", "Patch-test before full-face use.", "Keep the core routine active-free while your skin settles.", "Do not combine exfoliants and retinoids in the same routine.", "If discomfort persists, or skin is broken or painful, consider speaking with a pharmacist or doctor."],
  },
];

export function routineById(id: string) {
  return ROUTINE_EDITS.find((routine) => routine.id === id);
}

export function routineProduct(priceId: string) {
  return SHOP_PRODUCTS.find((product) => product.priceId === priceId);
}

export function routinePrice(priceId: string) {
  const product = routineProduct(priceId);
  return product ? Number(product.price.replace(/[^0-9.]/g, "")) || 0 : 0;
}

export function routineMoney(value: number) {
  return `A$${value.toFixed(0)}`;
}
