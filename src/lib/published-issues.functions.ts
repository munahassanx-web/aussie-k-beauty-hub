// Public reads for newsletter issues that have been approved and published from
// the Seoul Signal desk. No auth: RLS exposes only rows with status = 'published'.
import { createServerFn } from "@tanstack/react-start";
import type { NewsletterIssue } from "@/lib/newsletter-issues";

type Row = {
  id: string;
  issue_number: string;
  slug: string;
  title: string;
  theme: string | null;
  cover_url: string | null;
  cover_alt: string | null;
  published_at: string | null;
  content: unknown;
};

function toIssue(row: Row): NewsletterIssue {
  const content = (row.content ?? {}) as { issue?: Record<string, unknown> };
  const i = (content.issue ?? {}) as Record<string, never>;
  const cover = row.cover_url ? `/api/public/issue-cover/${row.id}` : "";
  return {
    number: row.issue_number,
    slug: row.slug,
    title: row.title,
    theme: row.theme ?? "",
    date: row.published_at
      ? `Fortnight of ${new Date(row.published_at).toLocaleDateString("en-AU", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}`
      : "",
    published: true,
    cover,
    coverAlt: row.cover_alt ?? `Cover art for ${row.title}`,
    standfirst: (i.standfirst as string) ?? "",
    bigQuestion: i.bigQuestion ?? { question: "", body: [], pick: { name: "", brand: "", note: "", reasons: [] } },
    seoul: i.seoul ?? {
      ingredient: "",
      koreaHeat: "",
      australiaHeat: "",
      whatIsIt: "",
      whyKoreansLove: "",
      shouldAussiesCare: "",
      tryIt: [],
    },
    aisle: i.aisle ?? [],
    fiveMinute: i.fiveMinute ?? { intro: "", steps: [], closer: "" },
    everyone: { image: cover, imageAlt: row.cover_alt ?? row.title, ...(i.everyone ?? { topic: "", body: [] }) },
    weTriedIt: i.weTriedIt ?? { product: "", brand: "", duration: "", scores: [], verdict: "" },
    basket: i.basket ?? { forWho: "", items: [] },
    askTheGrocer: i.askTheGrocer ?? { prompt: "", options: [] },
  } as NewsletterIssue;
}

async function fetchPublished(slug?: string): Promise<Row[]> {
  const { publicClient } = await import("@/lib/signals.server");
  let query = publicClient()
    .from("newsletter_drafts")
    .select("id,issue_number,slug,title,theme,cover_url,cover_alt,published_at,content")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(24);
  if (slug) query = query.eq("slug", slug);
  const { data, error } = await query;
  if (error) return [];
  return (data ?? []) as unknown as Row[];
}

export const listPublishedIssues = createServerFn({ method: "GET" }).handler(async () => {
  const rows = await fetchPublished();
  return rows.map(toIssue);
});

export const getPublishedIssue = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => {
    const slug = (input as { slug?: unknown })?.slug;
    if (typeof slug !== "string" || slug.length < 2 || slug.length > 80) throw new Error("Invalid slug");
    return { slug };
  })
  .handler(async ({ data }) => {
    const rows = await fetchPublished(data.slug);
    return rows.length ? toIssue(rows[0]) : null;
  });
