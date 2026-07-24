import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type ChatAnswer = {
  answer: string;
  ingredients: Array<{
    id: string;
    name: string;
    slug: string;
    what_it_does: string;
  }>;
  products: Array<{
    productId: string;
    name: string;
    brand: string;
  }>;
};

type IngredientRow = {
  id: string;
  name_english: string;
  category: string | null;
  what_it_does: string | null;
  good_for: string[] | null;
  avoid_if: string[] | null;
};

type LinkRow = {
  product_id: string;
  ingredient_id: string;
  is_hero_ingredient: boolean;
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const askSkinQuestion = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const q = (input as { question?: unknown })?.question;
    if (typeof q !== "string" || q.trim().length === 0) throw new Error("Question required");
    if (q.length > 500) throw new Error("Question too long");
    return { question: q.trim() };
  })
  .handler(async ({ data }): Promise<ChatAnswer> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");

    const supaUrl = process.env.SUPABASE_URL!;
    const supaKey = process.env.SUPABASE_PUBLISHABLE_KEY!;
    const supabase = createClient<Database>(supaUrl, supaKey, {
      auth: { persistSession: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (supaKey.startsWith("sb_") && h.get("Authorization") === `Bearer ${supaKey}`) {
            h.delete("Authorization");
          }
          h.set("apikey", supaKey);
          return fetch(input, { ...init, headers: h });
        },
      },
    });

    // Product catalog (mirror of src/lib/product-catalog.ts, kept minimal for server)
    const CATALOG: Record<string, { name: string; brand: string }> = {
      relief_sun_onetime: { name: "Relief Sun SPF50+", brand: "Beauty of Joseon" },
      anua_heartleaf_cleansing_oil: { name: "Heartleaf Pore Control Cleansing Oil", brand: "Anua" },
      cosrx_ahabha_toner: { name: "AHA/BHA Clarifying Treatment Toner", brand: "COSRX" },
      boj_glow_serum: { name: "Glow Serum: Propolis + Niacinamide", brand: "Beauty of Joseon" },
      biodance_collagen_mask: { name: "Bio-Collagen Real Deep Mask", brand: "BIODANCE" },
      torriden_divein_serum: { name: "DIVE-IN Low Molecular Hyaluronic Acid Serum", brand: "Torriden" },
      roundlab_1025_dokdo_cream: { name: "1025 Dokdo Cream", brand: "Round Lab" },
      skin1004_centella_ampoule: { name: "Madagascar Centella Ampoule", brand: "SKIN1004" },
      numbuzin_no3_softening_serum: { name: "No.3 Skin Softening Serum", brand: "Numbuzin" },
    };

    const [{ data: ings, error: ingErr }, { data: links, error: linkErr }] = await Promise.all([
      supabase
        .from("ingredients")
        .select("id, name_english, category, what_it_does, good_for, avoid_if"),
      supabase
        .from("product_ingredients")
        .select("product_id, ingredient_id, is_hero_ingredient"),
    ]);
    if (ingErr) throw new Error(ingErr.message);
    if (linkErr) throw new Error(linkErr.message);

    const ingredients = (ings ?? []) as IngredientRow[];
    const productLinks = (links ?? []) as LinkRow[];

    // Compact context for the model
    const ingredientCtx = ingredients.map((i) => ({
      id: i.id,
      name: i.name_english,
      category: i.category,
      what_it_does: i.what_it_does,
      good_for: i.good_for ?? [],
      avoid_if: i.avoid_if ?? [],
    }));
    const productCtx = Object.entries(CATALOG).map(([productId, meta]) => {
      const heroIds = productLinks
        .filter((l) => l.product_id === productId && l.is_hero_ingredient)
        .map((l) => l.ingredient_id);
      return { productId, name: meta.name, brand: meta.brand, hero_ingredient_ids: heroIds };
    });

    const systemPrompt = `You are a warm, plain-English skincare guide for Skin Grocer, a Melbourne K-beauty retailer.
Answer in 2-4 short sentences. No jargon. Never invent ingredients or products.
Only reference ingredients from the provided INGREDIENTS list (return their ids) and only recommend products from the PRODUCTS list (return their productIds).
Pick 1-3 relevant ingredients and 1-2 matching products. If the question isn't about skin, politely say you can only help with skincare and set both arrays to [].
Respond as strict JSON matching this shape:
{"answer": string, "ingredient_ids": string[], "product_ids": string[]}`;

    const userPrompt = `Question: ${data.question}

INGREDIENTS:
${JSON.stringify(ingredientCtx)}

PRODUCTS:
${JSON.stringify(productCtx)}`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-3.6-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      if (res.status === 429) throw new Error("Too many requests — please try again in a moment.");
      if (res.status === 402) throw new Error("AI service temporarily unavailable.");
      throw new Error(`AI error: ${text.slice(0, 200)}`);
    }

    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = json.choices?.[0]?.message?.content ?? "{}";
    let parsed: { answer?: string; ingredient_ids?: string[]; product_ids?: string[] } = {};
    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = { answer: content, ingredient_ids: [], product_ids: [] };
    }

    const ingMap = new Map(ingredients.map((i) => [i.id, i]));
    const chosenIngredients = (parsed.ingredient_ids ?? [])
      .map((id) => ingMap.get(id))
      .filter((v): v is IngredientRow => Boolean(v))
      .slice(0, 3)
      .map((i) => ({
        id: i.id,
        name: i.name_english,
        slug: slugify(i.name_english),
        what_it_does: i.what_it_does ?? "",
      }));

    const chosenProducts = (parsed.product_ids ?? [])
      .filter((id) => CATALOG[id])
      .slice(0, 2)
      .map((id) => ({ productId: id, name: CATALOG[id].name, brand: CATALOG[id].brand }));

    return {
      answer: parsed.answer ?? "Sorry, I couldn't put that together. Try rephrasing?",
      ingredients: chosenIngredients,
      products: chosenProducts,
    };
  });
