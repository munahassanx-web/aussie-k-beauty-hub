import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { consultantCatalogBlock } from "@/lib/consultation.server-data";

const MODEL = "google/gemini-3.6-flash";

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
    if (res.status === 429) throw new Error("We're getting a lot of questions right now — try again in a moment.");
    if (res.status === 402) throw new Error("Our consultation service is briefly unavailable. Please try again shortly.");
    throw new Error(`Consultation error: ${text.slice(0, 200)}`);
  }
  const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  return json.choices?.[0]?.message?.content ?? "";
}

/**
 * Follow-up questions about a routine that was already built deterministically
 * on the client (see src/lib/routine-matching.ts). The model never picks the
 * routine — it only explains the one we generated, using the real catalogue.
 */
export const askConsultantFollowUp = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const i = input as {
      profile?: string;
      routine?: string[];
      history?: Array<{ role: "user" | "assistant"; content: string }>;
      question?: string;
    };
    if (!i?.question?.trim()) throw new Error("Question required");
    return {
      profile: (i.profile ?? "").slice(0, 1200),
      routine: (i.routine ?? []).slice(0, 10).map((r) => String(r).slice(0, 200)),
      history: (i.history ?? []).slice(-8),
      question: i.question.trim().slice(0, 800),
    };
  })
  .handler(async ({ data }) => {
    const reply = await callGateway({
      messages: [
        {
          role: "system",
          content: `You are a Skin Grocer consultant — a Melbourne-based K-beauty retailer stocking authentic Korean skincare, dispatched from Melbourne.

Voice: warm, expert, plainly spoken. Australian English, AUD prices. Never salesy, never clinical.

Rules:
- Only ever reference products from the catalogue below. Never invent products, ingredients, claims or clinical outcomes.
- Never diagnose a skin condition. If something sounds medical, kindly suggest a GP or dermatologist.
- If the catalogue can't answer something, say so plainly rather than guessing.
- Answer in 2-5 sentences of plain text. No markdown headings, no JSON.

THEIR SKIN PROFILE
${data.profile || "(not provided)"}

THE ROUTINE WE ALREADY RECOMMENDED
${data.routine.map((r) => `- ${r}`).join("\n") || "(none)"}

FULL CATALOGUE
${consultantCatalogBlock()}`,
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
