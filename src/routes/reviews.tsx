import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Stars } from "@/components/product-reviews";
import { SHOP_PRODUCTS } from "@/lib/shop-catalog";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Customer Reviews — Skin Grocer" },
      {
        name: "description",
        content:
          "Verified customer reviews of Korean skincare bought from Skin Grocer. Only reviews from real, completed orders are published here.",
      },
      { property: "og:title", content: "Customer Reviews — Skin Grocer" },
      {
        property: "og:description",
        content: "Only reviews from real, completed Skin Grocer orders are published here.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://skingrocer.com.au/reviews" },
    ],
    links: [{ rel: "canonical", href: "https://skingrocer.com.au/reviews" }],
  }),
  component: Reviews,
});

type Row = {
  id: string;
  product_id: string;
  rating: number;
  review_text: string | null;
  customer_name: string | null;
  verified_purchase: boolean | null;
  created_at: string;
};

async function fetchApproved() {
  const { data, error } = await supabase
    .from("reviews")
    .select("id, product_id, rating, review_text, customer_name, verified_purchase, created_at")
    .eq("approved", true)
    .order("created_at", { ascending: false })
    .limit(60);
  if (error) throw error;
  return (data ?? []) as unknown as Row[];
}

function productLabel(id: string) {
  const p = SHOP_PRODUCTS.find((x) => x.priceId === id);
  if (!p) return id;
  return `${p.brand} ${p.name}`;
}

const SITE_URL = "https://skingrocer.com.au";

/**
 * Structured data for the reviews page, built only from real approved reviews.
 * AggregateRating is emitted only when at least one review exists — no invented numbers.
 */
function buildReviewsJsonLd(reviews: Row[]) {
  const org: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Skin Grocer",
    url: SITE_URL,
  };

  if (reviews.length > 0) {
    const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    org.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Number(average.toFixed(1)),
      reviewCount: reviews.length,
    };
    org.review = reviews.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.customer_name ?? "Skin Grocer customer" },
      datePublished: r.created_at,
      reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5, worstRating: 1 },
      ...(r.review_text ? { reviewBody: r.review_text } : {}),
      itemReviewed: { "@type": "Product", name: productLabel(r.product_id) },
    }));
  }

  return org;
}

function Reviews() {
  const { data, isLoading } = useQuery({ queryKey: ["all-reviews"], queryFn: fetchApproved });
  const reviews = data ?? [];
  const jsonLd = isLoading ? null : buildReviewsJsonLd(reviews);

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <section className="mx-auto max-w-4xl px-6 py-24">
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Reviews</p>
        <h1 className="mt-6 font-display text-4xl leading-[1.05] text-foreground md:text-6xl">
          Only reviews from{" "}
          <em className="not-italic text-primary">real orders.</em>
        </h1>
        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          We don't write reviews, buy them, or borrow them from elsewhere. A review appears here only
          after someone has bought the product from us and chosen to write about it.
        </p>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-4xl px-6 py-16">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading reviews…</p>
          ) : reviews.length === 0 ? (
            <div>
              <h2 className="font-display text-2xl text-foreground">No published reviews yet</h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                We're a young store and we'd rather show nothing than something invented. When
                reviews start arriving, each one will carry:
              </p>
              <dl className="mt-10 divide-y divide-border border-y border-border">
                {[
                  ["01", "The exact product purchased", "Tied to a completed order, named by brand and size — not a generic 'Skin Grocer' rating."],
                  ["02", "Skin context, only if shared", "Skin type or concern appears only when the customer chooses to write it. We never infer age, skin type or results."],
                  ["03", "The real experience", "Their own words, how long they used it, and the rating they gave — published unedited once checked for spam."],
                ].map(([n, t, d]) => (
                  <div key={n} className="grid gap-2 py-8 md:grid-cols-[4rem_1fr]">
                    <dt className="text-xs tracking-[0.24em] text-muted-foreground">{n}</dt>
                    <dd>
                      <p className="font-display text-xl text-foreground">{t}</p>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d}</p>
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-10 text-sm text-muted-foreground">
                Bought something from us? You can leave a review on that product's page — the option
                appears once we can match your order.
              </p>
              <Link
                to="/shop"
                className="mt-6 inline-flex border-b border-foreground pb-1 text-sm font-medium text-foreground"
              >
                Browse products
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border border-y border-border">
              {reviews.map((r) => (
                <figure key={r.id} className="grid gap-3 py-8 md:grid-cols-[1fr_2fr]">
                  <div>
                    <Stars n={r.rating} />
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {productLabel(r.product_id)}
                    </p>
                  </div>
                  <div>
                    <blockquote className="text-base leading-relaxed text-foreground/90">
                      "{r.review_text}"
                    </blockquote>
                    <figcaption className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>{r.customer_name ?? "Skin Grocer customer"}</span>
                      <span>· {new Date(r.created_at).toLocaleDateString("en-AU")}</span>
                      {r.verified_purchase && <span>· Verified purchase</span>}
                    </figcaption>
                  </div>
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
