import { createFileRoute } from "@tanstack/react-router";
import { RoutineDetailPage } from "@/components/routine-detail-page";
import { routineById } from "@/lib/routine-edits";

const routine = routineById("tone-glow-support");

export const Route = createFileRoute("/routines/tone-glow-support")({
  head: () => ({ meta: [
    { title: "Tone + Glow Support Routine | Skin Grocer" },
    { name: "description", content: "Review Skin Grocer’s three-step Tone + Glow Support Edit, current products, prices and application order." },
    { property: "og:title", content: "Tone + Glow Support Routine | Skin Grocer" },
    { property: "og:description", content: "A considered Korean skincare routine supporting hydration and uneven-looking tone." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Page,
});

function Page() {
  if (!routine) return null;
  return <RoutineDetailPage routine={routine} />;
}