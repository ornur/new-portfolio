import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/$locale")({
  beforeLoad: ({ params }) => {
    if (params.locale !== "kk" && params.locale !== "ru") {
      throw redirect({ to: "/" });
    }
  },
  component: Outlet,
});
