import { createFileRoute, redirect } from "@tanstack/react-router";

// The newsletter is now published as the Skin Grocer Blog.
export const Route = createFileRoute("/grocery-list/")({
  beforeLoad: () => {
    throw redirect({ to: "/blog" });
  },
});
