import { createFileRoute } from "@tanstack/react-router";
import {
  harvestFirecrawl,
  harvestReddit,
  harvestYouTube,
  saveSignals,
} from "@/lib/signals.server";

// Scheduled harvest endpoint. Call every few days with:
//   curl -X POST -H "x-cron-secret: $SIGNAL_CRON_SECRET" https://<site>/api/public/signals/harvest
export const Route = createFileRoute("/api/public/signals/harvest")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["SIGNAL_CRON_SECRET"];
        if (!secret) return new Response("Not configured", { status: 503 });
        if (request.headers.get("x-cron-secret") !== secret) {
          return new Response("Unauthorized", { status: 401 });
        }
        const [reddit, youtube, web] = await Promise.all([
          harvestReddit(),
          harvestYouTube(process.env["YOUTUBE_API_KEY"]),
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
