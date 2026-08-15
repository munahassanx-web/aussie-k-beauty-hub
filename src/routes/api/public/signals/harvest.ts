import { createFileRoute } from "@tanstack/react-router";
import {
  harvestFirecrawl,
  harvestReddit,
  harvestYouTube,
  saveSignals,
} from "@/lib/signals.server";

// Scheduled harvest endpoint, called fortnightly by pg_cron with the project
// anon/publishable key in an `apikey` header. A legacy x-cron-secret is still accepted.
export const Route = createFileRoute("/api/public/signals/harvest")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const anonKey =
          process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
        const legacySecret = process.env["SIGNAL_CRON_SECRET"];
        const apiKey = request.headers.get("apikey");
        const authorized =
          (Boolean(anonKey) && apiKey === anonKey) ||
          (Boolean(legacySecret) && request.headers.get("x-cron-secret") === legacySecret);
        if (!authorized) {
          return new Response("Unauthorized", { status: 401 });
        }
        const [reddit, youtube, web] = await Promise.all([
          harvestReddit(),
          harvestYouTube(process.env["GOOGLE_API_KEY"]),
          harvestFirecrawl(process.env["FIRECRAWL_API_KEY"], process.env["LOVABLE_API_KEY"]),
        ]);
        const saved = await saveSignals([...reddit, ...youtube, ...web]);
        return Response.json({
          saved,
          counts: { reddit: reddit.length, youtube: youtube.length, web: web.length },
        });
      },
    },
  },
});
