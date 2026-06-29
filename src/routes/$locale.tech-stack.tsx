import { createFileRoute } from "@tanstack/react-router";

import { TechStackPage } from "@/features/pages/TechStackPage";

export const Route = createFileRoute("/$locale/tech-stack")({
  component: TechStackPage,
});
