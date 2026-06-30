import { useScroll } from "motion/react";
import * as motion from "motion/react-m";
import { useRef } from "react";
import { useTranslations } from "use-intl";

import { ScrollDownText } from "@/components/ui/ScrollDownText";
import { transitionStore } from "@/features/loader/TransitionStore";
import getTechLogos from "@/features/tech-stack/logos";
import { LogoSlide } from "@/features/tech-stack/LogoSlide";
import { useCanRender3dSvg } from "@/hooks/useCanRender3dSvg";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useScrollRestore } from "@/hooks/useScrollRestore";
import { useSEO } from "@/hooks/useSEO";

export function TechStackPage() {
  const outerRef = useRef<HTMLDivElement>(null);

  const t = useTranslations("TechStack");
  const { isLoading, isMobile } = useIsMobile();
  const effectiveIsMobile = isLoading || isMobile;
  const canRender3dSvg = useCanRender3dSvg(effectiveIsMobile);
  const techLogos = getTechLogos(
    effectiveIsMobile,
    canRender3dSvg,
    transitionStore.markSvgReady,
  );
  const useMobile3dProfile = effectiveIsMobile && canRender3dSvg;
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
        height: `calc(${techLogos.length * (effectiveIsMobile ? 750 : 2000)}px)`,
      }}
    >
      <ScrollDownText />
      <motion.div
        className="scroll-progress-indicator scroll-progress-indicator--difference"
        id="scroll-indicator"
        style={{
          scaleX: scrollYProgress,
        }}
      />
      <div className="sticky top-0 h-screen overflow-hidden">
        {techLogos.map((logo, i) => (
          <LogoSlide
            deferInactiveLogo={useMobile3dProfile}
            index={i}
            key={logo.title}
            logo={logo}
            logoCount={techLogos.length}
            logoSize={effectiveIsMobile ? "30vh" : "65vh"}
            renderPaddingRatio={useMobile3dProfile ? 0.08 : 0.75}
            scrollYProgress={scrollYProgress}
          />
        ))}
      </div>
    </div>
  );
}
