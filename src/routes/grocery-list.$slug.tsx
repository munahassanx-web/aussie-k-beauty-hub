import { createFileRoute, redirect } from "@tanstack/react-router";

// Old newsletter issue URLs now live under /blog/<slug>.
export const Route = createFileRoute("/grocery-list/$slug")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/blog/$slug", params: { slug: params.slug } });
  },
});
