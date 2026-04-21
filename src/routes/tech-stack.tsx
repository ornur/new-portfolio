import { createFileRoute } from "@tanstack/react-router";
import { useScroll } from "motion/react";
import { lazy, Suspense, useRef } from "react";
import { useTranslations } from "use-intl";

import { ScrollDownText } from "@/components/ui/ScrollDownText";
import getTechLogos from "@/features/tech-stack/logos";
import { LogoSlide } from "@/features/tech-stack/LogoSlide";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useScrollRestore } from "@/hooks/useScrollRestore";
import { useSEO } from "@/hooks/useSEO";
import { useTheme } from "@/hooks/useTheme";

export const Route = createFileRoute("/tech-stack")({
  component: RouteComponent,
});

const SVG3D = lazy(() =>
  import("3dsvg").then((mod) => ({
    default: mod.SVG3D,
  })),
);

function RouteComponent() {
  const { theme } = useTheme();
  const outerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("TechStack");
  const { isMobile } = useIsMobile();
  const techLogos = getTechLogos(isMobile);
  useScrollRestore("/tech-stack");
  useSEO({
    description: t("seo.description"),
    title: t("seo.title"),
  });

  const { scrollYProgress } = useScroll({
    offset: ["start start", "end end"],
    target: outerRef,
  });

  return (
    <div
      ref={outerRef}
      style={{
        height: `calc(${techLogos.length * (isMobile ? 750 : 2000)}px)`,
      }}
    >
      <ScrollDownText />
      <div className="absolute top-1/2 left-1/2 z-0 h-1/3 w-3/4 -translate-x-1/2 -translate-y-1/2 transform md:h-3/4 md:w-1/3">
        {isMobile ? (
          <h1 className="text-center text-5xl font-bold tracking-wide text-nowrap opacity-35">
            TECH STACK
          </h1>
        ) : (
          <Suspense fallback={null}>
            <SVG3D
              ambientIntensity={0.1}
              animate="swing"
              className="cursor-grab font-bold text-nowrap opacity-70"
              color={theme === "dark" ? "#e2f72e" : "black"}
              // cursorOrbit
              lightIntensity={0.1}
              material="plastic"
              resetDelay={1}
              resetOnIdle
              shadow={false}
              text={"TECH STACK"}
              zoom={6.5}
            />
          </Suspense>
        )}
      </div>
      <div className="sticky top-0 h-screen overflow-hidden">
        {techLogos.map((logo, i) => (
          <LogoSlide
            index={i}
            key={logo.title}
            logo={logo}
            logoCount={techLogos.length}
            logoSize={isMobile ? "30vh" : "65vh"}
            scrollYProgress={scrollYProgress}
          />
        ))}
      </div>
    </div>
  );
}
