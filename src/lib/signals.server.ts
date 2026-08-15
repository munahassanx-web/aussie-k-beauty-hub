// Seoul Signal research pipeline — harvesting, scoring, drafting, fact-checking.
// Server-only helpers. Never import from client components.

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { SHOP_PRODUCTS } from "@/lib/shop-catalog";

export type HarvestedItem = {
  source: string;
  source_url: string;
  title: string;
  excerpt: string | null;
  brand: string | null;
  ingredient: string | null;
  topic: string | null;
  score: number;
  mentions: number;
  published_at: string | null;
  raw: Record<string, unknown>;
};

const INGREDIENTS = [
  "PDRN", "exosome", "niacinamide", "retinal", "retinol", "ceramide", "centella", "cica",
  "snail mucin", "propolis", "ginseng", "mugwort", "rice", "heartleaf", "houttuynia",
  "hyaluronic", "peptide", "collagen", "azelaic", "tranexamic", "arbutin", "BHA", "AHA",
  "PHA", "vitamin C", "panthenol", "squalane", "polyglutamic", "madecassoside", "beta-glucan",
];

const BRANDS = [
  "Anua", "Beauty of Joseon", "Medicube", "Torriden", "Skin1004", "Biodance", "Round Lab",
  "Aestura", "Wellage", "beplain", "Dr.G", "Tirtir", "S.Nature", "Isntree", "Numbuzin",
  "Mixsoon", "Goodal", "Sungboon", "Ma:nyo", "VT Cosmetics", "Rovectin", "Abib", "Mediheal",
  "Innisfree", "Laneige", "Sulwhasoo", "COSRX", "Etude", "Hanyul", "Illiyoon",
];

function detect(list: string[], text: string): string | null {
  const lower = text.toLowerCase();
  const hit = list.find((k) => lower.includes(k.toLowerCase()));
  return hit ?? null;
}

/** Recency-weighted engagement score. Fresh + loud ranks highest. */
function velocityScore(engagement: number, publishedMs: number | null): number {
  const ageDays = publishedMs ? Math.max(0, (Date.now() - publishedMs) / 86_400_000) : 30;
  const decay = Math.exp(-ageDays / 14); // half-life ≈ 10 days
  return Math.round(Math.log10(engagement + 10) * 100 * decay * 100) / 100;
}

// ---------------------------------------------------------------- Reddit

const SUBREDDITS = ["AsianBeauty", "KoreanBeauty", "SkincareAddiction", "30PlusSkinCare"];

// Reddit's public JSON blocks most datacentre IPs, so this is best-effort only;
// the Firecrawl harvester covers Reddit properly via site: search.
export async function harvestReddit(): Promise<HarvestedItem[]> {
  const out: HarvestedItem[] = [];
  for (const sub of SUBREDDITS) {
    try {
      const res = await fetch(
        `https://www.reddit.com/r/${sub}/top.json?t=week&limit=40`,
        { headers: { "User-Agent": "SkinGrocerSignal/1.0 (research)" } },
      );
      if (!res.ok) continue;
      const json = (await res.json()) as {
        data?: { children?: Array<{ data: Record<string, unknown> }> };
      };
      for (const child of json.data?.children ?? []) {
        const d = child.data as {
          title?: string; selftext?: string; permalink?: string;
          ups?: number; num_comments?: number; created_utc?: number;
        };
        if (!d.title || !d.permalink) continue;
        const text = `${d.title} ${d.selftext ?? ""}`;
        const publishedMs = d.created_utc ? d.created_utc * 1000 : null;
        const engagement = (d.ups ?? 0) + (d.num_comments ?? 0) * 3;
        out.push({
          source: `reddit/r/${sub}`,
          source_url: `https://www.reddit.com${d.permalink}`,
          title: d.title.slice(0, 300),
          excerpt: (d.selftext ?? "").slice(0, 800) || null,
          brand: detect(BRANDS, text),
          ingredient: detect(INGREDIENTS, text),
          topic: sub,
          score: velocityScore(engagement, publishedMs),
          mentions: d.num_comments ?? 0,
          published_at: publishedMs ? new Date(publishedMs).toISOString() : null,
          raw: { ups: d.ups ?? 0, comments: d.num_comments ?? 0 },
        });
      }
    } catch {
      // A single dead source must never take the whole harvest down.
    }
  }
  return out;
}

// ---------------------------------------------------------------- YouTube

export async function harvestYouTube(apiKey: string | undefined): Promise<HarvestedItem[]> {
  if (!apiKey) return [];
  const queries = ["올리브영 추천", "korean skincare new release", "K뷰티 신제품"];
  const out: HarvestedItem[] = [];
  const publishedAfter = new Date(Date.now() - 21 * 86_400_000).toISOString();
  for (const q of queries) {
    try {
      const url = new URL("https://www.googleapis.com/youtube/v3/search");
      url.searchParams.set("part", "snippet");
      url.searchParams.set("type", "video");
      url.searchParams.set("maxResults", "20");
      url.searchParams.set("order", "viewCount");
      url.searchParams.set("publishedAfter", publishedAfter);
      url.searchParams.set("q", q);
      url.searchParams.set("key", apiKey);
      const res = await fetch(url);
      if (!res.ok) continue;
      const json = (await res.json()) as {
        items?: Array<{ id?: { videoId?: string }; snippet?: Record<string, string> }>;
      };
      for (const it of json.items ?? []) {
        const vid = it.id?.videoId;
        const s = it.snippet;
        if (!vid || !s?.title) continue;
        const text = `${s.title} ${s.description ?? ""}`;
        const publishedMs = s.publishedAt ? Date.parse(s.publishedAt) : null;
        out.push({
          source: "youtube",
          source_url: `https://www.youtube.com/watch?v=${vid}`,
          title: s.title.slice(0, 300),
          excerpt: (s.description ?? "").slice(0, 600) || null,
          brand: detect(BRANDS, text),
          ingredient: detect(INGREDIENTS, text),
          topic: q,
          score: velocityScore(500, publishedMs),
          mentions: 1,
          published_at: publishedMs ? new Date(publishedMs).toISOString() : null,
          raw: { channel: s.channelTitle ?? "" },
        });
      }
    } catch {
      // ignore this query
    }
  }
  return out;
}

// ------------------------------------------------------- Firecrawl (web/KR)

const FIRECRAWL_QUERIES: Array<{ query: string; source: string; freshness: string }> = [
  { query: "올리브영 랭킹 스킨케어 신제품", source: "web/olive-young", freshness: "qdr:m" },
  { query: "화해 스킨케어 랭킹 리뷰 신제품", source: "web/hwahae", freshness: "qdr:m" },
  { query: "korean skincare trend new ingredient launch", source: "web/korea", freshness: "qdr:m" },
  { query: "site:reddit.com/r/AsianBeauty korean skincare", source: "reddit/r/AsianBeauty", freshness: "qdr:w" },
  { query: "site:reddit.com/r/KoreanBeauty routine recommendation", source: "reddit/r/KoreanBeauty", freshness: "qdr:w" },
  { query: "site:reddit.com/r/SkincareAddiction korean product", source: "reddit/r/SkincareAddiction", freshness: "qdr:w" },
];

export async function harvestFirecrawl(
  firecrawlKey: string | undefined,
  lovableKey: string | undefined,
): Promise<HarvestedItem[]> {
  if (!firecrawlKey) return [];
  const gateway = firecrawlKey.startsWith("lovc_");
  if (gateway && !lovableKey) return [];
  const endpoint = gateway
    ? "https://connector-gateway.lovable.dev/firecrawl/v2/search"
    : "https://api.firecrawl.dev/v2/search";
  const headers: Record<string, string> = gateway
    ? {
        "Content-Type": "application/json",
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": firecrawlKey,
      }
    : { "Content-Type": "application/json", Authorization: `Bearer ${firecrawlKey}` };

  const out: HarvestedItem[] = [];
  for (const q of FIRECRAWL_QUERIES) {
    const { query, source, freshness } = q;
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({ query, limit: 8, tbs: freshness }),
      });
      if (!res.ok) {
        console.error(`[signals] firecrawl ${res.status}: ${await res.text()}`);
        continue;
      }
      const json = (await res.json()) as {
        data?: Array<{ url?: string; title?: string; description?: string }> | {
          web?: Array<{ url?: string; title?: string; description?: string }>;
        };
      };
      const rows = Array.isArray(json.data) ? json.data : (json.data?.web ?? []);
      for (const r of rows) {
        if (!r.url || !r.title) continue;
        const text = `${r.title} ${r.description ?? ""}`;
        out.push({
          source,
          source_url: r.url,
          title: r.title.slice(0, 300),
          excerpt: (r.description ?? "").slice(0, 800) || null,
          brand: detect(BRANDS, text),
          ingredient: detect(INGREDIENTS, text),
          topic: query,
          score: velocityScore(300, Date.now()),
          mentions: 1,
          published_at: null,
          raw: { query },
        });
      }
    } catch {
      // ignore this query
    }
  }
  return out;
}

// ---------------------------------------------------------------- Storage

export function adminClient() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient<Database>(url, key, { auth: { persistSession: false } });
}

export async function saveSignals(items: HarvestedItem[]): Promise<number> {
  if (items.length === 0) return 0;
  const client = adminClient();
  const seen = new Set<string>();
  const rows = items.filter((i) => {
    const k = `${i.source}|${i.source_url}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  const { error, count } = await client
    .from("signal_items")
    .upsert(rows as never, { onConflict: "source,source_url", count: "exact" });
  if (error) throw new Error(`Saving signals failed: ${error.message}`);
  return count ?? rows.length;
}

// ---------------------------------------------------------------- AI drafting

const AI_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

async function callAI(apiKey: string, system: string, user: string): Promise<string> {
  const res = await fetch(AI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "google/gemini-2.5-pro",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      response_format: { type: "json_object" },
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    if (res.status === 429) throw new Error("AI rate limit reached — try again in a minute.");
    if (res.status === 402) throw new Error("AI credits exhausted — top up in Settings → Workspace.");
    throw new Error(`AI request failed [${res.status}]: ${body}`);
  }
  const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  return json.choices?.[0]?.message?.content ?? "{}";
}

function catalogueSummary(): string {
  return SHOP_PRODUCTS.map(
    (p) => `${p.brand} — ${p.name} — ${p.price} — ${p.category} — ${p.concerns.join("/")} — ${p.image}`,
  ).join("\n");
}

const DRAFT_SYSTEM = `You are the research editor for "The Skin Grocery List", the fortnightly newsletter of Skin Grocer, a Melbourne K-beauty retailer.

Voice: dry, specific, Australian, anti-hype. Never use marketing filler. Australian spelling (moisturise, ageing). Always tie advice to Australian climate (UV index, air-con, hard water, Melbourne vs Brisbane).

Rules:
- Use ONLY facts supported by the supplied SIGNALS. Every factual claim must be traceable to a signal URL.
- Never invent clinical results, statistics, review counts or prices.
- Product picks MUST come from the supplied CATALOGUE, copied verbatim (name, brand, price, image path). If nothing in the catalogue fits, say so in "gaps".
- Return strict JSON only.

JSON shape:
{
  "issue": {
    "title": string, "theme": string, "standfirst": string,
    "bigQuestion": { "question": string, "body": [string,string,string,string],
      "pick": { "name": string, "brand": string, "price": string, "image": string, "note": string, "reasons": [string,string,string] } },
    "seoul": { "ingredient": string, "koreaHeat": string, "australiaHeat": string, "whatIsIt": string,
      "whyKoreansLove": string, "shouldAussiesCare": string,
      "tryIt": [{ "name": string, "brand": string, "price": string, "image": string, "note": string }] },
    "aisle": [{ "emoji": string, "concern": string, "pick": string, "brand": string, "why": string, "image": string }],
    "fiveMinute": { "intro": string, "steps": [{ "step": string, "what": string, "pick": string, "brand": string, "image": string }], "closer": string },
    "everyone": { "topic": string, "body": [string,string,string] },
    "weTriedIt": { "product": string, "brand": string, "duration": string, "image": string,
      "scores": [{ "label": string, "value": string }], "verdict": string },
    "basket": { "forWho": string, "items": [{ "name": string, "brand": string, "price": string, "image": string, "note": string }] },
    "askTheGrocer": { "prompt": string, "options": [string,string,string,string] }
  },
  "sources": [{ "claim": string, "url": string }],
  "gaps": [string],
  "coverPrompt": string
}`;

export async function draftIssue(
  apiKey: string,
  signals: Array<{ title: string; excerpt: string | null; source: string; source_url: string; brand: string | null; ingredient: string | null; score: number }>,
  issueNumber: string,
): Promise<Record<string, unknown>> {
  const signalBlock = signals
    .map((s, i) => `[${i + 1}] (${s.source}, score ${s.score}) ${s.title}\n${s.excerpt ?? ""}\n${s.source_url}`)
    .join("\n\n");
  const content = await callAI(
    apiKey,
    DRAFT_SYSTEM,
    `Draft issue ${issueNumber}.\n\nSIGNALS (last fortnight, ranked by momentum):\n${signalBlock}\n\nCATALOGUE (name — brand — price — category — concerns — image):\n${catalogueSummary()}`,
  );
  return JSON.parse(content) as Record<string, unknown>;
}

const CHECK_SYSTEM = `You are a sceptical fact-checker for an Australian skincare retailer. You are given a newsletter draft and the raw source signals it was written from.

For every factual claim in the draft (ingredient science, Korean market behaviour, product attributes, prices), decide:
- "supported": directly backed by a supplied source or uncontroversial textbook dermatology
- "unsupported": no source backs it, or it overstates a source
- "risky": a medical/efficacy claim that could mislead or breach Australian therapeutic advertising rules

Return strict JSON:
{ "verdict": "pass" | "revise", "summary": string,
  "claims": [{ "claim": string, "status": "supported"|"unsupported"|"risky", "note": string, "source": string }] }
List at most 25 claims, worst first.`;

export async function factCheck(
  apiKey: string,
  draft: unknown,
  signals: Array<{ title: string; source_url: string; excerpt: string | null }>,
): Promise<Record<string, unknown>> {
  const content = await callAI(
    apiKey,
    CHECK_SYSTEM,
    `DRAFT:\n${JSON.stringify(draft).slice(0, 60_000)}\n\nSOURCES:\n${signals
      .map((s) => `- ${s.title} — ${s.source_url}\n  ${(s.excerpt ?? "").slice(0, 300)}`)
      .join("\n")}`,
  );
  return JSON.parse(content) as Record<string, unknown>;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

// ---------------------------------------------------------------- Cover art

const COVER_STYLE =
  "Editorial magazine cover photograph for a Korean-beauty newsletter. Minimal-luxury, natural light, " +
  "warm neutral palette (cream, sand, soft charcoal), high white space, no text, no words, no logos, " +
  "no watermarks, shallow depth of field, matte film grain, 4:5 portrait crop.";

/** Generates an issue cover with the Lovable AI image model and stores it privately. */
export async function generateCover(
  apiKey: string,
  draftId: string,
  prompt: string,
): Promise<{ path: string }> {
  const res = await fetch(AI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash-image",
      messages: [{ role: "user", content: `${COVER_STYLE}\n\nSubject: ${prompt}` }],
      modalities: ["image", "text"],
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    if (res.status === 429) throw new Error("Image rate limit reached — try again in a minute.");
    if (res.status === 402) throw new Error("AI credits exhausted — top up in Settings → Workspace.");
    throw new Error(`Cover generation failed [${res.status}]: ${body}`);
  }
  const json = (await res.json()) as {
    choices?: Array<{ message?: { images?: Array<{ image_url?: { url?: string } }> } }>;
  };
  const dataUrl = json.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  if (!dataUrl?.startsWith("data:")) throw new Error("No image returned by the model.");

  const base64 = dataUrl.slice(dataUrl.indexOf(",") + 1);
  const binary = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const path = `${draftId}/${Date.now()}.png`;
  const { error } = await adminClient()
    .storage.from("newsletter-covers")
    .upload(path, binary, { contentType: "image/png", upsert: true });
  if (error) throw new Error(`Cover upload failed: ${error.message}`);
  return { path };
}

export async function readCover(path: string): Promise<ArrayBuffer | null> {
  const { data, error } = await adminClient().storage.from("newsletter-covers").download(path);
  if (error || !data) return null;
  return await data.arrayBuffer();
}
