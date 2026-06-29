import { createFileRoute } from "@tanstack/react-router";

import { HomePage } from "@/features/pages/HomePage";

export const Route = createFileRoute("/$locale/")({
  component: HomePage,
});
