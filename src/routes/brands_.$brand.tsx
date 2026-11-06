import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { BRANDS, findBrand, productsForBrand } from "@/lib/brand-pages";
import { breadcrumbJsonLd } from "@/lib/breadcrumbs";
import { ProductCard } from "@/components/product-card";

const BASE = "https://skingrocer.com.au";

export const Route = createFileRoute("/brands_/$brand")({
  loader: ({ params }) => {
    const brand = findBrand(params.brand);
    if (!brand) throw notFound();
    return { brand };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return { meta: [{ title: "Brand not found | Skin Grocer" }, { name: "robots", content: "noindex" }] };
    }
    const { brand } = loaderData;
    const title = `${brand.name} in Australia — Genuine Stock | Skin Grocer`;
    const description = `Shop genuine ${brand.name} skincare in Australia. ${brand.tag}. Locally stocked in Melbourne and dispatched across Australia.`.slice(0, 160);
    const url = `${BASE}/brands/${params.brand}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Brands", path: "/brands" },
          { name: brand.name, path: `/brands/${params.brand}` },
        ]),
      ],
    };
  },
  component: BrandPage,
});

function BrandPage() {
  const { brand } = Route.useLoaderData();
  const products = productsForBrand(brand.name);
  const others = BRANDS.filter((b) => b.slug !== brand.slug);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link> /{" "}
        <Link to="/brands" className="hover:text-foreground">Brands</Link> /{" "}
        <span className="text-foreground">{brand.name}</span>
      </nav>

      <header className="mt-8 grid items-center gap-10 md:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-primary">Korean skincare brand</p>
          <h1 className="mt-3 text-5xl font-light tracking-tight text-foreground md:text-6xl">
            Genuine {brand.name} in Australia
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">{brand.tag}.</p>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Skin Grocer sources {brand.name} through established Korean wholesale supply partners.
            It's stocked in Melbourne and dispatched across Australia. Delivery timing depends on your
            postcode and the Australia Post service you choose.
          </p>
        </div>
        <img
          src={brand.hero}
          alt={`${brand.name} product`}
          width={640}
          height={640}
          className="mx-auto h-72 w-auto object-contain"
        />
      </header>

      <section className="mt-16" aria-labelledby="brand-products">
        <h2 id="brand-products" className="text-2xl text-foreground">
          {brand.name} at Skin Grocer ({products.length})
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.priceId || p.name} product={p} />
          ))}
        </div>
      </section>

      <section className="mt-20" aria-labelledby="other-brands">
        <h2 id="other-brands" className="text-xl text-foreground">More brands</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {others.map((b) => (
            <li key={b.slug}>
              <Link
                to="/brands/$brand"
                params={{ brand: b.slug }}
                className="inline-block rounded-full border border-border px-4 py-2 text-sm text-foreground hover:bg-muted"
              >
                {b.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
