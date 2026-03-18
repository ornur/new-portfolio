import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { useTranslations } from "use-intl/react";

import { useSEO } from "@/hooks/useSEO";
import { useTheme } from "@/hooks/useTheme";

const ShapeGrid = lazy(() => import("@/components/react-bits/ShapeGrid"));

export const Route = createFileRoute("/experience")({
  component: RouteComponent,
});

function RouteComponent() {
  const { theme } = useTheme();
  const t = useTranslations("Experience");
  useSEO({
    description: t("seo.description"),
    title: t("seo.title"),
  });
  return (
    <div className="relative h-screen">
      <Suspense fallback={null}>
        <ShapeGrid
          borderColor={theme === "dark" ? "oklch(0.145 0 0)" : "oklch(1 0 0)"}
          direction="diagonal"
          hoverFillColor={
            theme === "dark"
              ? "oklch(0.9295 0.2025 115.99)"
              : "oklch(0.145 0 0)"
          }
          hoverTrailAmount={30}
          shape="hexagon"
          speed={0.06}
          squareSize={45}
          vinetteColor={theme === "dark" ? "#060010" : "transparent"}
        />
      </Suspense>
    </div>
  );
}
