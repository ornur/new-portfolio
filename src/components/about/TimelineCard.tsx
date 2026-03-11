import type { LucideIcon } from "lucide-react";

import { type MotionValue, useTransform } from "motion/react";
import * as motion from "motion/react-m";
import { lazy, Suspense } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GlassSurface = lazy(() => import("@/components/react-bits/GlassSurface"));

interface TimelineCardProps {
  index: number;
  isMobile: boolean;
  item: TimelineItem;
  scrollYProgress: MotionValue<number>;
  total: number;
}

interface TimelineItem {
  date: string;
  desc: string;
  icon: LucideIcon;
  title: string;
}

export default function TimelineCard({
  index,
  isMobile,
  item,
  scrollYProgress,
  total,
}: TimelineCardProps) {
  const cardDuration = 1 / total;
  const start = index * cardDuration;
  const maxAt = start + cardDuration * 0.3;
  const shrinkStart = start + cardDuration * 0.7;
  const end = start + cardDuration;
  const isLastData = index === total - 1;

  const scale = useTransform(
    scrollYProgress,
    isLastData ? [start, maxAt] : [start, maxAt, shrinkStart, end],
    isLastData
      ? [0, isMobile ? 1 : 1.3]
      : [0, isMobile ? 1 : 1.3, isMobile ? 1 : 1.3, 0],
  );

  const visibility = useTransform(scrollYProgress, (v) =>
    isLastData || (v >= start && v <= end + 0.001) ? "visible" : "hidden",
  );

  return (
    <motion.div
      className="absolute"
      style={{
        scale,
        visibility,
        zIndex: total - index,
      }}
    >
      <Suspense fallback={null}>
        <GlassSurface
          blueOffset={20}
          borderRadius={50}
          brightness={70}
          className="overflow-hidden"
          displace={0.1}
          distortionScale={-150}
          greenOffset={10}
          height={"100%"}
          mixBlendMode="screen"
          opacity={0.93}
          redOffset={0}
          width={isMobile ? "85vw" : "25vw"}
        >
          <Card className="h-full w-full border-none bg-transparent">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className="text-primary rounded-full p-3">
                <item.icon size={32} />
              </div>
              <div>
                <p className="font-mono text-sm tracking-widest uppercase">
                  {item.date}
                </p>
                <CardTitle className="text-foreground text-base font-bold md:text-2xl">
                  {item.title}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-foreground text-justify text-xs leading-relaxed md:text-lg">
              {item.desc}
            </CardContent>
          </Card>
        </GlassSurface>
      </Suspense>
    </motion.div>
  );
}
