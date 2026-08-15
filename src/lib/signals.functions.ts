import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  adminClient,
  draftIssue,
  factCheck,
  harvestFirecrawl,
  harvestReddit,
  generateCover,
  harvestYouTube,
  saveSignals,
  slugify,
} from "@/lib/signals.server";

export type FactCheckReport = {
  verdict?: string;
  summary?: string;
  claims?: Array<{ claim?: string; status?: string; note?: string; source?: string }>;
};

async function assertAdmin(supabase: { rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: unknown }> }, userId: string) {
  const { data, error } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (error || data !== true) throw new Error("Unauthorized: admin only");
}

export const runHarvest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase as never, context.userId);
    const [reddit, youtube, web] = await Promise.all([
      harvestReddit(),
      harvestYouTube(process.env["GOOGLE_API_KEY"]),
      harvestFirecrawl(process.env["FIRECRAWL_API_KEY"], process.env["LOVABLE_API_KEY"]),
    ]);
    const all = [...reddit, ...youtube, ...web];
    const saved = await saveSignals(all);
    return {
      saved,
      counts: { reddit: reddit.length, youtube: youtube.length, web: web.length },
      youtubeEnabled: Boolean(process.env["GOOGLE_API_KEY"]),
      firecrawlEnabled: Boolean(process.env["FIRECRAWL_API_KEY"]),
    };
  });

export const listSignals = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase as never, context.userId);
    const { data, error } = await adminClient()
      .from("signal_items")
      .select("id,source,source_url,title,excerpt,brand,ingredient,score,mentions,published_at,harvested_at")
      .order("score", { ascending: false })
      .limit(120);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const listDrafts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase as never, context.userId);
    const { data, error } = await adminClient()
      .from("newsletter_drafts")
      .select("id,issue_number,slug,title,theme,status,created_at,approved_at")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getDraft = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const id = (input as { id?: unknown })?.id;
    if (typeof id !== "string" || id.length < 10) throw new Error("Draft id required");
    return { id };
  })
  .handler(async ({ context, data }) => {
    await assertAdmin(context.supabase as never, context.userId);
    const { data: row, error } = await adminClient()
      .from("newsletter_drafts")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) throw new Error("Draft not found");
    return row;
  });

export const generateDraft = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase as never, context.userId);
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");
    const client = adminClient();

    const since = new Date(Date.now() - 21 * 86_400_000).toISOString();
    const { data: signals, error } = await client
      .from("signal_items")
      .select("id,title,excerpt,source,source_url,brand,ingredient,score")
      .gte("harvested_at", since)
      .order("score", { ascending: false })
      .limit(45);
    if (error) throw new Error(error.message);
    if (!signals || signals.length === 0) throw new Error("No recent signals — run a harvest first.");

    const { count } = await client
      .from("newsletter_drafts")
      .select("id", { count: "exact", head: true });
    const issueNumber = String((count ?? 0) + 2).padStart(2, "0");

    const result = await draftIssue(apiKey, signals as never, issueNumber);
    const issue = (result.issue ?? {}) as Record<string, unknown>;
    const title = String(issue.title ?? `Issue ${issueNumber}`);

    const { data: inserted, error: insErr } = await client
      .from("newsletter_drafts")
      .insert({
        issue_number: issueNumber,
        slug: slugify(title),
        title,
        theme: String(issue.theme ?? ""),
        status: "draft",
        content: result as never,
        source_signal_ids: signals.map((s) => s.id),
      })
      .select("id")
      .single();
    if (insErr) throw new Error(insErr.message);
    return { id: inserted.id };
  });

export const runFactCheck = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const id = (input as { id?: unknown })?.id;
    if (typeof id !== "string") throw new Error("Draft id required");
    return { id };
  })
  .handler(async ({ context, data }) => {
    await assertAdmin(context.supabase as never, context.userId);
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");
    const client = adminClient();
    const { data: draft, error } = await client
      .from("newsletter_drafts")
      .select("id,content,source_signal_ids")
      .eq("id", data.id)
      .single();
    if (error) throw new Error(error.message);

    const ids = (draft.source_signal_ids ?? []) as string[];
    const { data: signals } = await client
      .from("signal_items")
      .select("title,source_url,excerpt")
      .in("id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]);

    const report = (await factCheck(apiKey, draft.content, (signals ?? []) as never)) as FactCheckReport;
    const { error: upErr } = await client
      .from("newsletter_drafts")
      .update({ factcheck: report as never, status: "checked", updated_at: new Date().toISOString() })
      .eq("id", data.id);
    if (upErr) throw new Error(upErr.message);
    return report;
  });

export const setDraftStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const { id, status } = (input ?? {}) as { id?: unknown; status?: unknown };
    if (typeof id !== "string") throw new Error("Draft id required");
    if (status !== "approved" && status !== "rejected" && status !== "draft") {
      throw new Error("Invalid status");
    }
    return { id, status };
  })
  .handler(async ({ context, data }) => {
    await assertAdmin(context.supabase as never, context.userId);
    const { error } = await adminClient()
      .from("newsletter_drafts")
      .update({
        status: data.status,
        approved_at: data.status === "approved" ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const amIAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await (context.supabase as never as {
      rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown }>;
    }).rpc("has_role", { _user_id: context.userId, _role: "admin" });
    return { admin: data === true };
  });

export const generateIssueCover = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const { id, prompt } = (input ?? {}) as { id?: unknown; prompt?: unknown };
    if (typeof id !== "string") throw new Error("Draft id required");
    return { id, prompt: typeof prompt === "string" ? prompt.slice(0, 800) : "" };
  })
  .handler(async ({ context, data }) => {
    await assertAdmin(context.supabase as never, context.userId);
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");
    const client = adminClient();
    const { data: draft, error } = await client
      .from("newsletter_drafts")
      .select("id,title,theme,content")
      .eq("id", data.id)
      .single();
    if (error) throw new Error(error.message);

    const content = (draft.content ?? {}) as { coverPrompt?: string };
    const prompt =
      data.prompt || content.coverPrompt || `${draft.title}. ${draft.theme ?? ""}`;

    const { path } = await generateCover(apiKey, draft.id, prompt);
    const { error: upErr } = await client
      .from("newsletter_drafts")
      .update({
        cover_url: path,
        cover_alt: `Cover art for ${draft.title}`,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.id);
    if (upErr) throw new Error(upErr.message);
    return { coverUrl: `/api/public/issue-cover/${draft.id}?v=${Date.now()}` };
  });

export const publishDraft = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const { id, publish } = (input ?? {}) as { id?: unknown; publish?: unknown };
    if (typeof id !== "string") throw new Error("Draft id required");
    return { id, publish: publish !== false };
  })
  .handler(async ({ context, data }) => {
    await assertAdmin(context.supabase as never, context.userId);
    const client = adminClient();
    const { data: draft, error } = await client
      .from("newsletter_drafts")
      .select("id,slug,title,cover_url,content")
      .eq("id", data.id)
      .single();
    if (error) throw new Error(error.message);
    if (data.publish && !draft.cover_url) {
      throw new Error("Generate a cover image before publishing.");
    }
    const now = new Date().toISOString();
    const { error: upErr } = await client
      .from("newsletter_drafts")
      .update({
        status: data.publish ? "published" : "approved",
        approved_at: now,
        published_at: data.publish ? now : null,
        updated_at: now,
      })
      .eq("id", data.id);
    if (upErr) throw new Error(upErr.message);
    return { ok: true, slug: draft.slug, published: data.publish };
  });
