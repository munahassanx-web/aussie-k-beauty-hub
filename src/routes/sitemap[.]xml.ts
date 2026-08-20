import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { SHOP_PRODUCTS } from "@/lib/shop-catalog";
import { productSlug } from "@/lib/product-detail";
import { newsletterIssues } from "@/lib/newsletter-issues";
import { learnArticles } from "@/lib/learn-articles";
import { ingredientSlug } from "@/lib/product-catalog";

const BASE_URL = "https://skingrocer.com.au";

type Entry = {
  path: string;
  priority?: string;
  changefreq?: string;
  lastmod?: string;
};

const STATIC_ENTRIES: Entry[] = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/shop", priority: "0.9", changefreq: "daily" },
  { path: "/brands", priority: "0.8", changefreq: "weekly" },
  { path: "/skin-concerns", priority: "0.8", changefreq: "weekly" },
  { path: "/learn", priority: "0.8", changefreq: "weekly" },
  { path: "/learn/hub", priority: "0.7", changefreq: "weekly" },
  { path: "/routines", priority: "0.7", changefreq: "weekly" },
  { path: "/consultation", priority: "0.7", changefreq: "monthly" },
  { path: "/about", priority: "0.7", changefreq: "monthly" },
  { path: "/reviews", priority: "0.7", changefreq: "weekly" },
  { path: "/blog", priority: "0.8", changefreq: "weekly" },
  { path: "/club", priority: "0.6", changefreq: "monthly" },
  { path: "/journey", priority: "0.5", changefreq: "monthly" },
  { path: "/faq", priority: "0.6", changefreq: "monthly" },
  { path: "/contact", priority: "0.6", changefreq: "monthly" },
  { path: "/shipping-policy", priority: "0.3", changefreq: "yearly" },
  { path: "/returns-policy", priority: "0.3", changefreq: "yearly" },
  { path: "/privacy-policy", priority: "0.3", changefreq: "yearly" },
  { path: "/terms-and-conditions", priority: "0.3", changefreq: "yearly" },
];

async function publishedIssueEntries(): Promise<Entry[]> {
  try {
    const { publicClient } = await import("@/lib/signals.server");
    const { data, error } = await publicClient()
      .from("newsletter_drafts")
      .select("slug,published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(500);
    if (error || !data) return [];
    return (data as { slug: string; published_at: string | null }[])
      .filter((r) => r.slug)
      .map((r) => ({
        path: `/blog/${r.slug}`,
        priority: "0.7",
        changefreq: "monthly",
        lastmod: r.published_at ? new Date(r.published_at).toISOString().slice(0, 10) : undefined,
      }));
  } catch {
    return [];
  }
}

async function ingredientEntries(): Promise<Entry[]> {
  try {
    const { publicClient } = await import("@/lib/signals.server");
    const { data, error } = await publicClient()
      .from("ingredients")
      .select("name_english")
      .order("name_english")
      .limit(1000);
    if (error || !data) return [];
    return (data as { name_english: string }[])
      .filter((r) => r.name_english)
      .map((r) => ({
        path: `/learn/${ingredientSlug(r.name_english)}`,
        priority: "0.6",
        changefreq: "monthly",
      }));
  } catch {
    return [];
  }
}

function dedupe(entries: Entry[]): Entry[] {
  const seen = new Set<string>();
  return entries.filter((e) => {
    if (seen.has(e.path)) return false;
    seen.add(e.path);
    return true;
  });
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const productEntries: Entry[] = SHOP_PRODUCTS.map((p) => ({
          path: `/product/${productSlug(p)}`,
          priority: p.comingSoon ? "0.5" : "0.8",
          changefreq: "weekly",
        }));

        const guideEntries: Entry[] = SHOP_PRODUCTS.map((p) => ({
          path: `/guide/${productSlug(p)}`,
          priority: "0.5",
          changefreq: "monthly",
        }));

        const staticIssueEntries: Entry[] = newsletterIssues.map((i) => ({
          path: `/blog/${i.slug}`,
          priority: "0.7",
          changefreq: "monthly",
        }));

        const articleEntries: Entry[] = learnArticles.map((a) => ({
          path: `/learn/article/${a.slug}`,
          priority: "0.6",
          changefreq: "monthly",
        }));

        const [dbIssues, ingredients] = await Promise.all([
          publishedIssueEntries(),
          ingredientEntries(),
        ]);

        const entries = dedupe([
          ...STATIC_ENTRIES,
          ...productEntries,
          ...guideEntries,
          ...dbIssues,
          ...staticIssueEntries,
          ...articleEntries,
          ...ingredients,
        ]);

        const urls = entries.map((e) =>
          [
            "  <url>",
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            "  </url>",
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...urls,
          "</urlset>",
        ].join("\n");

        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
