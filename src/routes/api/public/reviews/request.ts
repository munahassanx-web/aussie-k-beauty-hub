import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { dispatchOrderNotification } from "@/lib/email/notifications.server";

// Daily review-request run, called by pg_cron with the project anon/publishable
// key in an `apikey` header (same as the signals harvest). Each paid, delivered
// account order gets one review-request email 21–30 days after delivery. The
// order_notifications ledger (unique per order and kind) makes repeat runs a
// no-op once an order's email is sent.

const MIN_DAYS = 21;
const MAX_DAYS = 30;
const MAX_PER_RUN = 50;

type Row = {
  id: string;
  user_id: string | null;
  line_items: unknown;
  amount_cents: number | null;
  refunded_cents: number | null;
  delivered_at: string | null;
  dispatched_at: string | null;
  shipped_at: string | null;
};

export const Route = createFileRoute("/api/public/reviews/request")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const anonKey =
          process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
        if (!anonKey || request.headers.get("apikey") !== anonKey) {
          return new Response("Unauthorized", { status: 401 });
        }
        const supabase = createClient(
          process.env["SUPABASE_URL"]!,
          process.env["SUPABASE_SERVICE_ROLE_KEY"]!,
        );
        const day = 86_400_000;
        const from = new Date(Date.now() - MAX_DAYS * day).toISOString();
        const to = new Date(Date.now() - MIN_DAYS * day).toISOString();

        // Reviews need a signed-in, verified buyer, so guest orders are skipped.
        const { data, error } = await supabase
          .from("orders")
          .select(
            "id, user_id, line_items, amount_cents, refunded_cents, delivered_at, dispatched_at, shipped_at",
          )
          .eq("status", "paid")
          .is("cancelled_at", null)
          .not("user_id", "is", null)
          .or(
            `and(delivered_at.gte.${from},delivered_at.lte.${to}),and(delivered_at.is.null,dispatched_at.gte.${from},dispatched_at.lte.${to})`,
          )
          .limit(500);
        if (error) return Response.json({ error: error.message }, { status: 500 });

        const { data: done } = await supabase
          .from("order_notifications")
          .select("order_id")
          .eq("kind", "review_request")
          .in("status", ["sent", "skipped"])
          .in(
            "order_id",
            (data ?? []).map((o) => o.id),
          );
        const finished = new Set((done ?? []).map((n: { order_id: string }) => n.order_id));

        const counts: Record<string, number> = {};
        let attempted = 0;
        for (const o of (data ?? []) as Row[]) {
          if (attempted >= MAX_PER_RUN) break;
          if (finished.has(o.id)) continue;
          const refunded = o.refunded_cents ?? 0;
          if (refunded > 0 && o.amount_cents != null && refunded >= o.amount_cents) continue;

          // Don't ask about products this customer has already reviewed.
          const keys = (
            Array.isArray(o.line_items)
              ? (o.line_items as Array<{ lookupKey?: string | null }>)
              : []
          )
            .map((l) => l?.lookupKey)
            .filter((k): k is string => Boolean(k));
          if (keys.length === 0) continue;
          const { data: reviewed } = await supabase
            .from("reviews")
            .select("product_id")
            .eq("customer_id", o.user_id!)
            .in("product_id", keys);
          const reviewedSet = new Set(
            (reviewed ?? []).map((r: { product_id: string }) => r.product_id),
          );
          if (keys.every((k) => reviewedSet.has(k))) continue;

          attempted++;
          const outcome = await dispatchOrderNotification(supabase, o.id, "review_request");
          counts[outcome.status] = (counts[outcome.status] ?? 0) + 1;
        }
        return Response.json({ candidates: data?.length ?? 0, attempted, counts });
      },
    },
  },
});
