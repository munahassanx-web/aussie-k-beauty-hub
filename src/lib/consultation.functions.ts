import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { CONSULT_PRODUCTS, CONSULT_PRODUCT_MAP } from "@/lib/consult-catalog";

const MODEL = "google/gemini-3.6-flash";

export type ConsultAnswers = {
  skinType: string;
  concerns: string[];
  familiarity: string;
  gaps: string[];
  sunExposure: string;
  indoorAir: string;
  budget: string;
  freeText: string;
  name?: string;
};

export type ConsultationResult = {
  opening: string;
  routine: Array<{ priceId: string; why: string }>;
  closing: string;
};

function catalogBlock() {
  return CONSULT_PRODUCTS.map(
    (p) =>
      `- id: ${p.priceId} | ${p.brand} ${p.name} (${p.price} AUD) | step: ${p.step} | hero: ${p.heroIngredients} | best for: ${p.bestFor}`,
  ).join("\n");
}

function personaPrompt(a: ConsultAnswers) {
  return `You are a Skin Grocer consultant — a Melbourne-based K-beauty retailer run by a small team who source authentic Korean skincare and ship same-day locally.

Voice: warm, genuinely expert, like a trusted friend who happens to know everything about K-beauty. Never salesy. Never corporate-generic. Never clinical. Australian English, AUD prices.

Rules:
- Reference this person's actual answers back to them, specifically. Never a generic reply.
- Calibrate depth to their familiarity: "${a.familiarity}". If they said they're past the beginner brands, do NOT explain what an essence is or why SPF matters — talk to them like a peer.
- Australian conditions: high UV year-round, plus air-conditioning and indoor heating that dehydrate skin. Korean routines need adjusting for this — say so when relevant.
- Only ever recommend products from the catalogue by their exact id. Never invent products or ingredients.
- Keep it to 3-6 routine steps. Fewer, better-reasoned steps beat a long list.
- Respect their budget band: "${a.budget}".

THEIR ANSWERS
Name: ${a.name || "not given"}
Skin type: ${a.skinType}
Top concerns: ${a.concerns.join(", ") || "not specified"}
K-beauty familiarity: ${a.familiarity}
Missing from current routine: ${a.gaps.join(", ") || "not specified"}
Sun exposure: ${a.sunExposure}
Indoor heating / air-conditioning: ${a.indoorAir}
Budget per month: ${a.budget}
In their own words: ${a.freeText || "(nothing added)"}

CATALOGUE
${catalogBlock()}`;
}

function gatewayKey() {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");
  return apiKey;
}

async function callGateway(body: Record<string, unknown>) {
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${gatewayKey()}`,
    },
    body: JSON.stringify({ model: MODEL, ...body }),
  });
  if (!res.ok) {
    const text = await res.text();
    if (res.status === 429) throw new Error("We're getting a lot of consultations right now — try again in a moment.");
    if (res.status === 402) throw new Error("Our consultation service is briefly unavailable. Please try again shortly.");
    throw new Error(`Consultation error: ${text.slice(0, 200)}`);
  }
  const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  return json.choices?.[0]?.message?.content ?? "";
}

export const runConsultation = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const a = input as { answers?: ConsultAnswers };
    if (!a?.answers?.skinType) throw new Error("Incomplete consultation");
    const ans = a.answers;
    return {
      answers: {
        ...ans,
        freeText: (ans.freeText ?? "").slice(0, 1200),
        name: (ans.name ?? "").slice(0, 80),
      } as ConsultAnswers,
    };
  })
  .handler(async ({ data }): Promise<ConsultationResult> => {
    const content = await callGateway({
      messages: [
        { role: "system", content: personaPrompt(data.answers) },
        {
          role: "user",
          content: `Write my consultation. Respond as strict JSON:
{"opening": string, "routine": [{"priceId": string, "why": string}], "closing": string}

- "opening": 2-4 warm sentences that name my specific answers back to me (concerns, climate/AC situation, familiarity level) and set up the logic of the routine.
- "routine": 3-6 steps in the order I'd use them, morning through evening. "why" is ONE sentence tying that product to MY specific concern — never a product blurb.
- "closing": 1-2 sentences inviting me to ask a follow-up question right here in the chat.`,
        },
      ],
      response_format: { type: "json_object" },
    });

    let parsed: Partial<ConsultationResult> = {};
    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = {};
    }

    const routine = (parsed.routine ?? [])
      .filter((r) => r && CONSULT_PRODUCT_MAP[r.priceId])
      .slice(0, 6)
      .map((r) => ({ priceId: r.priceId, why: String(r.why ?? "") }));

    return {
      opening:
        parsed.opening ??
        "Here's the routine we'd build for you — based on what you told us about your skin and the conditions you're in day to day.",
      routine,
      closing:
        parsed.closing ??
        "Anything you'd like to dig into? Ask below and we'll answer like we would in person.",
    };
  });

export const askConsultantFollowUp = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const i = input as {
      answers?: ConsultAnswers;
      history?: Array<{ role: "user" | "assistant"; content: string }>;
      question?: string;
    };
    if (!i?.answers?.skinType) throw new Error("Missing consultation context");
    if (!i.question?.trim()) throw new Error("Question required");
    return {
      answers: i.answers,
      history: (i.history ?? []).slice(-8),
      question: i.question.trim().slice(0, 800),
    };
  })
  .handler(async ({ data }) => {
    const reply = await callGateway({
      messages: [
        {
          role: "system",
          content: `${personaPrompt(data.answers)}

You already gave them their routine. Answer follow-up questions conversationally in 2-5 sentences. Plain text, no markdown headings, no JSON. Reference their answers where it's genuinely relevant. If something is outside skincare or needs a doctor (prescription actives, suspected medical conditions), say so kindly.`,
        },
        ...data.history.map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content: data.question },
      ],
    });
    return { reply: reply || "Sorry — that didn't come through. Mind asking again?" };
  });

export const saveConsultationLead = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const i = input as {
      name?: string;
      email?: string;
      skinType?: string;
      concerns?: string[];
      gaps?: string[];
      budget?: string;
      consent?: boolean;
      recommended?: string[];
    };
    if (!i?.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(i.email)) throw new Error("A valid email is required");
    if (i.consent !== true) throw new Error("Marketing consent must be explicitly given");
    return {
      name: (i.name ?? "").slice(0, 80),
      email: i.email.slice(0, 200),
      skinType: i.skinType ?? null,
      concerns: i.concerns ?? [],
      gaps: i.gaps ?? [],
      budget: i.budget ?? null,
      recommended: i.recommended ?? [],
    };
  })
  .handler(async ({ data }) => {
    const url = process.env.SUPABASE_URL!;
    const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
    const supabase = createClient<Database>(url, key, {
      auth: { persistSession: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });

    const { error } = await supabase.from("quiz_responses").insert({
      customer_id: null,
      name: data.name || null,
      email: data.email,
      skin_type: data.skinType,
      skin_concerns: data.concerns,
      current_routine_gaps: data.gaps,
      budget_band: data.budget,
      recommended_products: data.recommended,
      marketing_consent: true,
      source: "consultation",
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
