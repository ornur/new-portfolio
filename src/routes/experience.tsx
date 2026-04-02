import { createFileRoute } from "@tanstack/react-router";
import { useScroll } from "motion/react";
import * as motion from "motion/react-m";
import { lazy, Suspense, useRef } from "react";
import { useTranslations } from "use-intl/react";

import ExperienceCard from "@/components/experience/ExperienceSection";
import { ScrollDownText } from "@/components/ScrollDownText";
import { useSEO } from "@/hooks/useSEO";
import { useTheme } from "@/hooks/useTheme";

const ShapeGrid = lazy(() => import("@/components/react-bits/ShapeGrid"));

export const Route = createFileRoute("/experience")({
  component: RouteComponent,
});

function RouteComponent() {
  const { theme } = useTheme();
  const t = useTranslations("Experience");

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end end"],
    target: containerRef,
  });

  useSEO({
    description: t("seo.description"),
    title: t("seo.title"),
  });
  return (
    <div className="relative min-h-screen" ref={containerRef}>
      <ScrollDownText />
      <motion.div
        id="scroll-indicator"
        style={{
          backgroundColor: "var(--neon)",
          height: 10,
          left: 0,
          originX: 0,
          position: "fixed",
          right: 0,
          scaleX: scrollYProgress,
          top: 0,
          zIndex: 50,
        }}
      />
      <Suspense fallback={null}>
        <ShapeGrid
          borderColor={theme === "dark" ? "oklch(1 0 0)" : "oklch(1 0 0)"}
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
      <ExperienceCard scrollYProgress={scrollYProgress} />
    </div>
  );
}
