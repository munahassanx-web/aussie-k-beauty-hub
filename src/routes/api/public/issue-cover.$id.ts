// Serves newsletter cover art for published issues from private storage.
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/issue-cover/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const id = String(params.id ?? "");
        if (!/^[0-9a-f-]{36}$/i.test(id)) return new Response("Not found", { status: 404 });

        const { adminClient, readCover } = await import("@/lib/signals.server");
        const { data, error } = await adminClient()
          .from("newsletter_drafts")
          .select("cover_url,status")
          .eq("id", id)
          .maybeSingle();
        if (error || !data?.cover_url) return new Response("Not found", { status: 404 });

        const bytes = await readCover(data.cover_url);
        if (!bytes) return new Response("Not found", { status: 404 });

        return new Response(bytes, {
          headers: {
            "Content-Type": "image/png",
            "Cache-Control":
              data.status === "published" ? "public, max-age=86400" : "private, max-age=60",
          },
        });
      },
    },
  },
});
