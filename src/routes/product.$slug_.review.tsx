import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { findProductBySlug, productSlug } from '@/lib/product-detail';
import { WriteReview } from '@/components/product-reviews';

export const Route = createFileRoute('/product/$slug_/review')({
  loader: ({ params }) => {
    const p = findProductBySlug(params.slug);
    if (!p) throw notFound();
    return { name: `${p.brand} ${p.name}` };
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `Review ${loaderData.name} — Skin Grocer` : 'Write a review — Skin Grocer';
    const description = 'Share your experience and photos of a product you bought from Skin Grocer.';
    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary' },
        { name: 'robots', content: 'noindex' },
      ],
    };
  },
  component: ReviewPage,
});

function ReviewPage() {
  const { slug } = Route.useParams();
  const p = findProductBySlug(slug)!;
  return (
    <section className="mx-auto max-w-2xl px-6 py-16">
      <Link
        to="/product/$slug"
        params={{ slug: productSlug(p) }}
        hash="reviews"
        className="text-sm text-muted-foreground underline"
      >
        ← Back to product
      </Link>
      <div className="mt-6 flex items-center gap-4">
        {p.image && (
          <img src={p.image} alt={`${p.brand} ${p.name}`} className="h-20 w-20 rounded-xl border border-border object-cover" />
        )}
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{p.brand}</p>
          <h1 className="font-display text-3xl text-foreground">Review {p.name}</h1>
        </div>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        Tell other customers how it felt and add photos of the texture or packaging. Your review shows
        on the product page once it has been checked.
      </p>
      <WriteReview productId={p.priceId} productName={p.name} brand={p.brand} startOpen />
    </section>
  );
}
