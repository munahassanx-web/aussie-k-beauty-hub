import { createFileRoute } from "@tanstack/react-router";
import { RoutineDetailPage } from "@/components/routine-detail-page";
import { routineById } from "@/lib/routine-edits";

const routine = routineById("barrier-comfort");

export const Route = createFileRoute("/routines/barrier-comfort")({
  head: () => ({ meta: [
    { title: "Barrier-Comfort Routine | Skin Grocer" },
    { name: "description", content: "Review Skin Grocer’s active-free three-step Barrier-Comfort Edit, current products, prices and application order." },
    { property: "og:title", content: "Barrier-Comfort Routine | Skin Grocer" },
    { property: "og:description", content: "A simple, active-free Korean skincare routine for skin that feels easily unsettled." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Page,
});

function Page() {
  if (!routine) return null;
  return <RoutineDetailPage routine={routine} />;
}