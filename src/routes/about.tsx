import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown } from "lucide-react";
import { Baby, Rocket, School, Star, University } from "lucide-react";
import { useScroll, useTransform } from "motion/react";
import * as motion from "motion/react-m";
import { lazy, Suspense, useRef } from "react";
import { useTranslations } from "use-intl";

import TimelineCard from "@/components/about/TimelineCard";
import useIsMobile from "@/hooks/useIsMobile";
import { useScrollRestore } from "@/hooks/useScrollRestore";
import { getTranslations } from "@/i18n/getTranslations";
import { seo } from "@/utils/seo";

const Galaxy = lazy(() => import("@/components/react-bits/Galaxy"));

export const Route = createFileRoute("/about")({
  component: About,
  head: () => {
    const t = getTranslations("About");
    return {
      meta: seo({
        description: t("seo.description"),
        title: t("seo.title"),
        url: "https://nurda.vercel.app/about",
      }),
    };
  },
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

  const t = useTranslations("About.data");
  const data = [
    {
      date: t("2004.date"),
      desc: t("2004.desc"),
      icon: Baby,
      title: t("2004.title"),
    },
    {
      date: t("2016.date"),
      desc: t("2016.desc"),
      icon: School,
      title: t("2016.title"),
    },
    {
      date: t("2022.date"),
      desc: t("2022.desc"),
      icon: University,
      title: t("2022.title"),
    },
    {
      date: t("2023.date"),
      desc: t("2023.desc"),
      icon: Rocket,
      title: t("2023.title"),
    },
    {
      date: t("Today.date"),
      desc: t("Today.desc"),
      icon: Star,
      title: t("Today.title"),
    },
  ];

  return (
    <div className="h-[500vh] bg-black" ref={containerRef}>
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
          {isMobile ? null : (
            <Galaxy
              density={1.1}
              glowIntensity={0.2}
              hueShift={140}
              mouseInteraction={false}
              mouseRepulsion={false}
              repulsionStrength={0}
              rotationSpeed={0}
              saturation={0}
              speed={0.2}
              starSpeed={3}
              transparent
              twinkleIntensity={3}
            />
          )}
        </Suspense>

        {data.map((item, index) => (
          <TimelineCard
            index={index}
            isMobile={isMobile}
            item={item}
            key={index}
            scrollYProgress={scrollYProgress}
            total={data.length}
          />
        ))}

        <motion.h1
          className="pointer-events-none absolute top-1/2 left-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 transform items-center gap-2 text-2xl font-bold text-nowrap text-neutral-500 opacity-0 md:text-4xl"
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.05], [1, 0]),
            pointerEvents: "none",
          }}
        >
          <ArrowDown
            className="animate-[caret-blink_1.7s_infinite_ease-out]"
            size={32}
          />
          Scroll Down
          <ArrowDown
            className="animate-[caret-blink_1.7s_infinite_ease-out]"
            size={32}
          />
        </motion.h1>
      </div>
    </div>
  );
}
