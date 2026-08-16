import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listPendingReviews, setReviewApproval } from "@/lib/reviews.functions";
import { useAuth } from "@/hooks/use-auth";
import { SHOP_PRODUCTS } from "@/lib/shop-catalog";
import { Stars } from "@/components/product-reviews";

export const Route = createFileRoute("/admin/reviews")({
  head: () => ({
    meta: [
      { title: "Pending reviews — Skin Grocer admin" },
      { name: "description", content: "Internal moderation desk for customer product reviews awaiting approval." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Pending reviews — Skin Grocer admin" },
      { property: "og:description", content: "Approve or remove pending customer reviews." },
    ],
  }),
  component: ReviewDesk,
});

function productLabel(productId: string) {
  const p = SHOP_PRODUCTS.find((x) => x.priceId === productId);
  return p ? `${p.brand} ${p.name}` : productId;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Admin</p>
      <h1 className="mt-3 font-display text-4xl text-foreground">Pending reviews</h1>
      <div className="mt-8">{children}</div>
    </main>
  );
}

function ReviewDesk() {
  const { user, loading } = useAuth();
  const qc = useQueryClient();
  const fetchPending = useServerFn(listPendingReviews);
  const moderate = useServerFn(setReviewApproval);

  const pendingQ = useQuery({
    queryKey: ["pending-reviews"],
    queryFn: () => fetchPending(),
    enabled: Boolean(user),
    retry: false,
  });

  const act = useMutation({
    mutationFn: (vars: { id: string; approved: boolean }) => moderate({ data: vars }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pending-reviews"] }),
  });

  if (loading) return <Shell><p className="text-sm text-muted-foreground">Loading…</p></Shell>;
  if (!user) {
    return (
      <Shell>
        <p className="text-sm text-muted-foreground">
          <Link to="/auth" className="underline">Sign in</Link> with an admin account to moderate reviews.
        </p>
      </Shell>
    );
  }
  if (pendingQ.isError) {
    return <Shell><p className="text-sm text-destructive">Admin access required.</p></Shell>;
  }

  const rows = pendingQ.data ?? [];

  return (
    <Shell>
      {pendingQ.isLoading ? (
        <p className="text-sm text-muted-foreground">Loading pending reviews…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nothing waiting for approval.</p>
      ) : (
        <div className="space-y-4">
          {rows.map((r) => (
            <article key={r.id} className="rounded-2xl border border-border p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {productLabel(r.product_id)}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <Stars n={r.rating} />
                <span className="text-sm text-foreground">{r.customer_name ?? "Customer"}</span>
                {r.verified_purchase && (
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-foreground">
                    Verified Purchase
                  </span>
                )}
                <span className="text-xs text-muted-foreground">
                  {new Date(r.created_at).toLocaleDateString("en-AU")}
                </span>
              </div>
              <p className="mt-3 text-sm text-foreground/85">"{r.review_text}"</p>
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  disabled={act.isPending}
                  onClick={() => act.mutate({ id: r.id, approved: true })}
                  className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
                >
                  Approve
                </button>
                <button
                  type="button"
                  disabled={act.isPending}
                  onClick={() => act.mutate({ id: r.id, approved: false })}
                  className="rounded-full border border-border px-5 py-2 text-sm text-foreground disabled:opacity-60"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </Shell>
  );
}
