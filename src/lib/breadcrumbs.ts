const SITE_ORIGIN = "https://skingrocer.com.au";

export type BreadcrumbItem = { name: string; path: string };

/**
 * BreadcrumbList JSON-LD script descriptor for route head().scripts.
 * `path` may be absolute or site-relative; every item resolves to the
 * real absolute URL of that step.
 */
export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    type: "application/ld+json" as const,
    children: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        item: /^https?:\/\//i.test(item.path) ? item.path : `${SITE_ORIGIN}${item.path}`,
      })),
    }),
  };
}
