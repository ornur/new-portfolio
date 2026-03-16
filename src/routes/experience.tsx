import { createFileRoute } from "@tanstack/react-router";

import { ShapeGrid } from "@/components/react-bits/ShapeGrid";
import { useTheme } from "@/hooks/useTheme";

export const Route = createFileRoute("/experience")({
  component: RouteComponent,
});

function RouteComponent() {
  const { theme } = useTheme();
  return (
    <div className="relative h-screen">
      <ShapeGrid
        borderColor={theme === "dark" ? "oklch(0.145 0 0)" : "oklch(1 0 0)"}
        direction="diagonal"
        hoverFillColor={
          theme === "dark" ? "oklch(0.9295 0.2025 115.99)" : "oklch(0.145 0 0)"
        }
        hoverTrailAmount={30}
        shape="hexagon"
        speed={0.06}
        squareSize={45}
        vinetteColor={theme === "dark" ? "#060010" : "transparent"}
      />
    </div>
  );
}
