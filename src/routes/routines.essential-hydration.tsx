import { createFileRoute } from "@tanstack/react-router";
import { RoutineDetailPage } from "@/components/routine-detail-page";
import { routineById } from "@/lib/routine-edits";

const routine = routineById("essential-hydration");

export const Route = createFileRoute("/routines/essential-hydration")({
  head: () => ({ meta: [
    { title: "Essential Hydration Routine | Skin Grocer" },
    { name: "description", content: "Review Skin Grocer’s three-step Essential Hydration Edit, current products, prices and application order." },
    { property: "og:title", content: "Essential Hydration Routine | Skin Grocer" },
    { property: "og:description", content: "A considered three-step Korean skincare routine for skin that feels tight or dehydrated." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Page,
});

function Page() {
  if (!routine) return null;
  return <RoutineDetailPage routine={routine} />;
}