import { createFileRoute } from "@tanstack/react-router";
import { Baby, Rocket, School, Star, University } from "lucide-react";
import { useScroll } from "motion/react";
import * as motion from "motion/react-m";
import { lazy, Suspense, useRef } from "react";
import { useTranslations } from "use-intl";

import { ScrollDownText } from "@/components/ui/ScrollDownText";
import TimelineCard from "@/features/about/TimelineCard";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useScrollRestore } from "@/hooks/useScrollRestore";
import { useSEO } from "@/hooks/useSEO";

const Galaxy = lazy(() => import("@/components/backgrounds/Galaxy"));

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  const containerRef = useRef(null);
  const { isMobile } = useIsMobile();
  useScrollRestore("/about");

  // Track scroll progress of the specific container
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end end"],
    target: containerRef,
  });

  const t = useTranslations("About");

  useSEO({
    description: t("seo.description"),
    title: t("seo.title"),
  });

  const data = [
    {
      date: t("data.2004.date"),
      desc: t("data.2004.desc"),
      icon: Baby,
      title: t("data.2004.title"),
    },
    {
      date: t("data.2016.date"),
      desc: t("data.2016.desc"),
      icon: School,
      title: t("data.2016.title"),
    },
    {
      date: t("data.2022.date"),
      desc: t("data.2022.desc"),
      icon: University,
      title: t("data.2022.title"),
    },
    {
      date: t("data.2023.date"),
      desc: t("data.2023.desc"),
      icon: Rocket,
      title: t("data.2023.title"),
    },
    {
      date: t("data.Today.date"),
      desc: t("data.Today.desc"),
      icon: Star,
      title: t("data.Today.title"),
    },
  ];

  return (
    <div className="h-[500vh] bg-black dark:bg-black" ref={containerRef}>
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
      <div className="sticky top-0 grid h-screen w-screen place-items-center overflow-hidden">
        <Suspense fallback={null}>
          <Galaxy
            density={1.1}
            glowIntensity={0.2}
            hueShift={140}
            mouseInteraction={true}
            mouseRepulsion={false}
            repulsionStrength={0}
            rotationSpeed={0}
            saturation={0}
            speed={0.2}
            starSpeed={3}
            transparent
            twinkleIntensity={3}
          />
        </Suspense>

        {data.map((item, index) => (
          <TimelineCard
            index={index}
            isMobile={isMobile}
            item={item}
            key={item.date}
            scrollYProgress={scrollYProgress}
            total={data.length}
          />
        ))}
      </div>
    </div>
  );
}
