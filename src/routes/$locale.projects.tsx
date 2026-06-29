import { createFileRoute } from "@tanstack/react-router";

import { ProjectsPage } from "@/features/pages/ProjectsPage";

export const Route = createFileRoute("/$locale/projects")({
  component: ProjectsPage,
});
