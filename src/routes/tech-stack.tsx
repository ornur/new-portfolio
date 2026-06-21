import { createFileRoute } from "@tanstack/react-router";
import { useScroll } from "motion/react";
import * as motion from "motion/react-m";
import { useRef } from "react";
import { useTranslations } from "use-intl";

import { ScrollDownText } from "@/components/ui/ScrollDownText";
import { transitionStore } from "@/features/loader/TransitionStore";
import getTechLogos from "@/features/tech-stack/logos";
import { LogoSlide } from "@/features/tech-stack/LogoSlide";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useScrollRestore } from "@/hooks/useScrollRestore";
import { useSEO } from "@/hooks/useSEO";

export const Route = createFileRoute("/tech-stack")({
  component: RouteComponent,
});

function RouteComponent() {
  const outerRef = useRef<HTMLDivElement>(null);

  const t = useTranslations("TechStack");
  const { isMobile } = useIsMobile();
  const techLogos = getTechLogos(isMobile, transitionStore.markSvgReady);
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
      <motion.div
        id="scroll-indicator"
        style={{
          backgroundColor: "var(--neon)",
          height: 10,
          left: 0,
          mixBlendMode: "difference",
          originX: 0,
          position: "fixed",
          right: 0,
          scaleX: scrollYProgress,
          top: 0,
          zIndex: 50,
        }}
      />
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
