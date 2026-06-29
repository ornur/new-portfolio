import { createFileRoute } from "@tanstack/react-router";

import { ExperiencePage } from "@/features/pages/ExperiencePage";

export const Route = createFileRoute("/$locale/experience")({
  component: ExperiencePage,
});
