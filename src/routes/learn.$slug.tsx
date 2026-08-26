import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchIngredientBySlug } from "@/lib/ingredient-detail";
import { useBuyNow } from "@/hooks/use-buy-now";

export const Route = createFileRoute("/learn/$slug")({
  loader: ({ params, context }) =>
    context.queryClient.ensureQueryData({
      queryKey: ["ingredient", params.slug],
      queryFn: () => fetchIngredientBySlug(params.slug),
    }),
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Ingredient not found | Skin Grocer" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const i = loaderData.ingredient;
    const title = `${i.name_english} — What it does | Skin Grocer`;
    const desc = i.what_it_does;
    const url = `https://skingrocer.com.au/learn/${params.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <p className="text-sm text-muted-foreground">Couldn't load this ingredient.</p>
      <p className="mt-2 text-xs text-muted-foreground/70">{error.message}</p>
      <Link to="/learn" className="mt-6 inline-block text-sm text-primary underline">
        Back to the encyclopedia
      </Link>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <p className="font-display text-3xl text-foreground">Ingredient not found</p>
      <p className="mt-3 text-sm text-muted-foreground">
        We don't have this one in the encyclopedia yet.
      </p>
      <Link to="/learn" className="mt-6 inline-block text-sm text-primary underline">
        Back to the encyclopedia
      </Link>
    </div>
  ),
  component: IngredientDetailPage,
});

function IngredientDetailPage() {
  const { slug } = Route.useParams();
  const { data } = useQuery({
    queryKey: ["ingredient", slug],
    queryFn: () => fetchIngredientBySlug(slug),
  });
  const { buy, modal } = useBuyNow();

  if (!data) return null;
  const { ingredient: i, products } = data;

  return (
    <article className="mx-auto max-w-4xl px-6 py-16 md:py-24">
      <Link
        to="/learn"
        className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground hover:text-primary"
      >
        ← The encyclopedia
      </Link>

      <header className="mt-8 border-b border-border pb-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
          {i.category}
        </p>
        <h1 className="mt-4 font-display text-5xl leading-tight text-foreground md:text-6xl">
          {i.name_english}
        </h1>
        {(i.name_korean || i.name_chinese) && (
          <p className="mt-3 text-base text-muted-foreground">
            {[i.name_korean, i.name_chinese].filter(Boolean).join(" · ")}
          </p>
        )}
        {i.also_known_as?.length > 0 && (
          <p className="mt-2 text-sm text-muted-foreground">
            Also known as: <span className="text-foreground/80">{i.also_known_as.join(", ")}</span>
          </p>
        )}
      </header>

      <section className="mt-10 grid gap-10 md:grid-cols-3">
        <div className="md:col-span-2 space-y-10">
          <div>
            <h2 className="font-display text-2xl text-foreground">What it actually does</h2>
            <p className="mt-4 text-lg leading-relaxed text-foreground/85">{i.what_it_does}</p>
          </div>

          {i.how_to_use && (
            <div>
              <h2 className="font-display text-2xl text-foreground">How to use it</h2>
              <p className="mt-4 text-base leading-relaxed text-foreground/85">{i.how_to_use}</p>
            </div>
          )}

          {i.science_note && (
            <div className="rounded-2xl border border-border bg-secondary/30 p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                The science, in plain English
              </p>
              <p className="mt-3 text-base leading-relaxed text-foreground/85">{i.science_note}</p>
            </div>
          )}

          {i.common_myth && (
            <div className="rounded-2xl border-l-4 border-primary bg-secondary p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                Myth vs reality
              </p>
              <p className="mt-3 text-base leading-relaxed text-foreground/85">{i.common_myth}</p>
            </div>
          )}

          {(i.pairs_well_with?.length > 0 || i.avoid_pairing_with?.length > 0) && (
            <div className="grid gap-6 sm:grid-cols-2">
              {i.pairs_well_with?.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                    Pairs well with
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {i.pairs_well_with.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full border border-border bg-background px-2.5 py-0.5 text-[11px] text-foreground/80"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {i.avoid_pairing_with?.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-clay">
                    Don't layer with
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {i.avoid_pairing_with.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full border border-border bg-background px-2.5 py-0.5 text-[11px] text-foreground/80"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>


        <aside className="space-y-6 rounded-2xl border border-border bg-secondary/40 p-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
              Good for
            </p>
            {i.good_for.length ? (
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {i.good_for.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-border bg-background px-2.5 py-0.5 text-[11px] text-foreground/80"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-xs text-muted-foreground">—</p>
            )}
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-clay">
              Approach with care
            </p>
            {i.avoid_if.length ? (
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {i.avoid_if.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-border bg-background px-2.5 py-0.5 text-[11px] text-foreground/80"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-xs text-muted-foreground">
                Broadly well-tolerated across skin types.
              </p>
            )}
          </div>
        </aside>
      </section>

      <section className="mt-16 border-t border-border pt-10">
        <h2 className="font-display text-3xl text-foreground">
          Shop products with {i.name_english}
        </h2>
        {products.length === 0 ? (
          <p className="mt-4 text-sm italic text-muted-foreground">
            No products in our catalog are tagged with this ingredient yet — check back soon.
          </p>
        ) : (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {products.map((p) => (
              <li
                key={p.productId}
                className={
                  p.isHero
                    ? "rounded-2xl border-2 border-primary bg-secondary p-5"
                    : "rounded-2xl border border-border bg-background p-5"
                }
              >
                <div className="flex gap-4">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-20 w-20 flex-shrink-0 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-secondary text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                      {p.brand.slice(0, 3) || "SG"}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    {p.isHero && (
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                        Hero ingredient
                      </p>
                    )}
                    {p.brand && (
                      <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                        {p.brand}
                      </p>
                    )}
                    <p className="font-display text-base text-foreground">{p.name}</p>
                    <div className="mt-3 flex items-center gap-3">
                      {p.priceId && p.priceLabel ? (
                        <>
                          <span className="text-sm text-foreground">{p.priceLabel}</span>
                          <button
                            onClick={() =>
                              buy({
                                priceId: p.priceId!,
                                name: p.name,
                                priceLabel: p.priceLabel!,
                              })
                            }
                            className="text-[11px] font-medium uppercase tracking-[0.15em] text-primary hover:underline"
                          >
                            Buy →
                          </button>
                        </>
                      ) : (
                        <Link
                          to="/shop"
                          className="text-[11px] uppercase tracking-[0.15em] text-primary hover:underline"
                        >
                          View in shop →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {modal}
    </article>
  );
}
