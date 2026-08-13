import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ingredientSlug } from "@/lib/product-catalog";

type Ingredient = {
  id: string;
  name_english: string;
  name_korean: string | null;
  name_chinese: string | null;
  category: string;
  what_it_does: string;
  good_for: string[];
};

async function fetchAllIngredients(): Promise<Ingredient[]> {
  const { data, error } = await supabase
    .from("ingredients")
    .select("id, name_english, name_korean, name_chinese, category, what_it_does, good_for")
    .order("name_english");
  if (error) throw error;
  return (data ?? []) as Ingredient[];
}

export const Route = createFileRoute("/learn/")({
  head: () => ({
    meta: [
      { title: "Learn — Ingredient Encyclopedia | Skin Grocer" },
      {
        name: "description",
        content:
          "A plain-English encyclopedia of the K-beauty ingredients we stock — what each one does, who it suits, and which products it lives in.",
      },
      { property: "og:title", content: "Learn — Ingredient Encyclopedia | Skin Grocer" },
      {
        property: "og:description",
        content:
          "Search and browse every ingredient in our catalog, written for real people — not chemists.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/learn" }],
  }),
  component: LearnPage,
});

function LearnPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["ingredients-all"],
    queryFn: fetchAllIngredients,
    staleTime: 10 * 60_000,
  });

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = useMemo(() => {
    const set = new Set<string>();
    (data ?? []).forEach((i) => set.add(i.category));
    return ["all", ...Array.from(set).sort()];
  }, [data]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data ?? []).filter((i) => {
      if (activeCategory !== "all" && i.category !== activeCategory) return false;
      if (!q) return true;
      return (
        i.name_english.toLowerCase().includes(q) ||
        (i.name_korean ?? "").toLowerCase().includes(q) ||
        (i.name_chinese ?? "").toLowerCase().includes(q) ||
        i.what_it_does.toLowerCase().includes(q)
      );
    });
  }, [data, query, activeCategory]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <header className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.24em] text-primary">The encyclopedia</p>
        <h1 className="mt-4 font-display text-5xl leading-tight text-foreground md:text-6xl">
          Every ingredient, <em className="not-italic text-primary">in plain English.</em>
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          No jargon. No chemistry degree required. Search any ingredient on your
          shelf — we'll tell you what it actually does, who it suits, and which
          products in our catalog contain it.
        </p>
      </header>

      <div className="mt-12 space-y-4">
        <div className="relative max-w-xl">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search ingredients — try 'niacinamide' or 'hydration'"
            className="w-full rounded-full border border-border bg-background px-6 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((c) => {
            const active = c === activeCategory;
            return (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.14em] transition-colors ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-foreground/70 hover:border-primary hover:text-primary"
                }`}
              >
                {c === "all" ? "All" : c}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-12">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading the encyclopedia…</p>
        ) : isError ? (
          <p className="text-sm text-muted-foreground">
            Something went wrong loading ingredients. Please refresh.
          </p>
        ) : visible.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No ingredients match that search. Try clearing filters.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((i) => (
              <li key={i.id}>
                <Link
                  to="/learn/$slug"
                  params={{ slug: ingredientSlug(i.name_english) }}
                  className="group block h-full rounded-2xl border border-border bg-background p-6 transition-colors hover:border-primary"
                >
                  <p
                    className="text-[10px] font-semibold uppercase tracking-[0.2em]"
                    style={{ color: "#1F2A37" }}
                  >
                    {i.category}
                  </p>
                  <h2 className="mt-3 font-display text-xl text-foreground group-hover:text-primary">
                    {i.name_english}
                  </h2>
                  {(i.name_korean || i.name_chinese) && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {[i.name_korean, i.name_chinese].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {i.what_it_does}
                  </p>
                  <p className="mt-4 text-[11px] uppercase tracking-[0.2em] text-primary">
                    Read more →
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
