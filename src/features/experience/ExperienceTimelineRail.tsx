import { type MotionValue } from "motion/react";
import * as motion from "motion/react-m";

import { cn } from "@/lib/utils";

interface ExperienceTimelineRailProps {
  activeIndex: number;
  className?: string;
  onSelect?: (index: number) => void;
  progress: MotionValue<number>;
  total: number;
}

export function ExperienceTimelineRail({
  activeIndex,
  className,
  onSelect,
  progress,
  total,
}: ExperienceTimelineRailProps) {
  return (
    <div aria-label="Experience timeline" className={cn("relative", className)}>
      <div className="bg-border absolute top-1/2 right-3 left-3 h-px md:top-3 md:bottom-3 md:left-1/2 md:h-auto md:w-px md:-translate-x-1/2" />
      <motion.div
        aria-hidden
        className="bg-foreground/50 absolute top-1/2 right-3 left-3 h-px origin-left md:hidden"
        style={{ scaleX: progress }}
      />
      <motion.div
        aria-hidden
        className="bg-foreground/50 absolute top-3 bottom-3 left-1/2 hidden w-px origin-top -translate-x-1/2 md:block"
        style={{ scaleY: progress }}
      />

      <div className="relative flex items-center justify-between gap-2 md:h-full md:flex-col">
        {Array.from({ length: total }, (_, index) => {
          const isActive = index === activeIndex;
          const isComplete = index < activeIndex;
          const label = `Go to experience step ${index + 1} of ${total}`;

          return (
            <button
              aria-current={isActive ? "step" : undefined}
              aria-label={label}
              className={cn(
                "grid size-5 place-items-center rounded-full border bg-background transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background md:size-6",
                onSelect
                  ? "pointer-events-auto cursor-pointer"
                  : "pointer-events-none",
                isActive
                  ? "border-foreground"
                  : "border-border hover:border-foreground/45",
                isComplete && "border-foreground bg-foreground",
              )}
              key={index}
              onClick={() => onSelect?.(index)}
              type="button"
            >
              <span
                className={cn(
                  "size-1.5 rounded-full transition-colors duration-200 md:size-2",
                  isComplete
                    ? "bg-background"
                    : isActive
                      ? "bg-foreground"
                      : "bg-muted-foreground/40",
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
