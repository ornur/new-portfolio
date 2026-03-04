import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { lazy, Suspense, useRef } from "react";

import TimelineCard from "@/components/about/TimelineCard";
import { timelineData } from "@/components/about/timelineData";
import useIsMobile from "@/hooks/useIsMobile";
import { seo } from "@/utils/seo";

const Galaxy = lazy(() => import("@/components/react-bits/Galaxy"));

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: seo({
      description:
        "Learn more about Nurdaulet Orynbasarov — a frontend developer with experience in React, TypeScript, and modern web technologies.",
      title: "About - Nurdaulet Orynbasarov",
      url: "https://nurda.vercel.app/about",
    }),
  }),
});

function About() {
  const containerRef = useRef(null);
  const { isMobile } = useIsMobile();

  // Track scroll progress of the specific container
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end end"],
    target: containerRef,
  });

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
        </Suspense>

        {timelineData.map((item, index) => (
          <TimelineCard
            index={index}
            isMobile={isMobile}
            item={item}
            key={index}
            scrollYProgress={scrollYProgress}
            total={timelineData.length}
          />
        ))}

        {/* Subtle Background Tunnel Guide */}
        <motion.h1
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform text-2xl font-bold text-neutral-500 md:text-4xl"
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.05], [1, 0]),
            pointerEvents: "none",
          }}
        >
          Scroll Down
        </motion.h1>
      </div>
    </div>
  );
}
