import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listPendingReviews, moderateReview, MODERATION_REASONS } from "@/lib/reviews.functions";
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

const REASON_LABELS: Record<string, string> = {
  spam: "Spam",
  abuse_or_harassment: "Abuse or harassment",
  personal_information: "Personal information",
  unrelated_to_product: "Unrelated to the product",
  unlawful_content: "Unlawful content",
  unsupported_medical_claims: "Unsupported medical claims",
  duplicate_submission: "Duplicate submission",
  not_genuine: "Evidence the review is not genuine",
};

/**
 * Approve publishes immediately. Rejecting or removing always records a
 * documented reason — a review is never rejected merely for being critical.
 */
function ModerationActions({
  id,
  busy,
  onAct,
}: {
  id: string;
  busy: boolean;
  onAct: (status: "approved" | "rejected" | "removed", reason?: string) => void;
}) {
  const [reason, setReason] = useState<string>("");
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <button
        type="button"
        disabled={busy}
        onClick={() => onAct("approved")}
        className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
      >
        Approve
      </button>
      <label htmlFor={`reason-${id}`} className="sr-only">
        Moderation reason
      </label>
      <select
        id={`reason-${id}`}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
      >
        <option value="">Select a documented reason…</option>
        {MODERATION_REASONS.map((r) => (
          <option key={r} value={r}>
            {REASON_LABELS[r]}
          </option>
        ))}
      </select>
      <button
        type="button"
        disabled={busy || !reason}
        onClick={() => onAct("rejected", reason)}
        className="rounded-full border border-border px-5 py-2 text-sm text-foreground disabled:opacity-40"
      >
        Reject
      </button>
      <button
        type="button"
        disabled={busy || !reason}
        onClick={() => onAct("removed", reason)}
        className="rounded-full border border-border px-5 py-2 text-sm text-foreground disabled:opacity-40"
      >
        Remove
      </button>
    </div>
  );
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
  const moderate = useServerFn(moderateReview);

  const pendingQ = useQuery({
    queryKey: ["pending-reviews"],
    queryFn: () => fetchPending(),
    enabled: Boolean(user),
    retry: false,
  });

  const act = useMutation({
    mutationFn: (vars: { id: string; status: "approved" | "rejected" | "removed"; reason?: string }) =>
      moderate({ data: vars }),
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
              {r.title && <p className="mt-3 font-medium text-foreground">{r.title}</p>}
              <p className="mt-2 text-sm text-foreground/85">{r.review_text}</p>
              <ModerationActions
                id={r.id}
                busy={act.isPending}
                onAct={(status, reason) => act.mutate({ id: r.id, status, reason })}
              />
            </article>
          ))}
        </div>
      )}
    </Shell>
  );
}
