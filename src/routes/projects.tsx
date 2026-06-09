import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { useTranslations } from "use-intl/react";

import { ProjectsCarousel } from "@/features/projects/carousel";
import { useSEO } from "@/hooks/useSEO";
import { useTheme } from "@/hooks/useTheme";

const Ferrofluid = lazy(() => import("@/components/backgrounds/Ferrofluid"));

export const Route = createFileRoute("/projects")({
  component: RouteComponent,
});

function RouteComponent() {
  const { theme } = useTheme();
  const t = useTranslations("Projects");
  const colors = theme === "dark" ? ["#e2f72e"] : ["#ffffff"];

  useSEO({
    description: t("seo.description"),
    title: t("seo.title"),
  });
  return (
    <div className="relative h-full w-full">
      <Suspense fallback={null}>
        <Ferrofluid
          colors={colors}
          flowDirection="up"
          fluidity={0.12}
          glow={3}
          mouseInteraction={false}
          opacity={1}
          rimWidth={0.2}
          scale={1.0}
          sharpness={3.5}
          shimmer={1.2}
          speed={0.2}
          turbulence={0.01}
        />
      </Suspense>
      <ProjectsCarousel />
    </div>
  );
}
