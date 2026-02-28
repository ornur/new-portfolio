import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTransitionStore } from "./TransitionStore";
import * as constants from "./constants";
import { useTheme } from "@/hooks/useTheme";

function ClipRect({
  delay,
  initY,
  phase,
}: {
  initY: number;
  delay: number;
  phase: number;
}) {
  return (
    <motion.rect
      x="-5"
      width="120"
      initial={{ height: 0, y: initY }}
      animate={
        phase >= 2 ? { height: constants.SVG_H, y: 0 } : { height: 0, y: initY }
      }
      transition={
        phase === 2
          ? { delay, duration: constants.PATH_TIME, ease: "easeInOut" }
          : { duration: 0 }
      }
    />
  );
}

export default function ScreenTransition() {
  const { isActive, phase } = useTransitionStore();
  const { theme } = useTheme();

  useEffect(() => {
    const entry = constants.PHASE_SCHEDULE[phase];
    if (!entry) return;
    const [fn, ms] = entry;
    const t = setTimeout(fn, ms);
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          className="pointer-events-auto fixed inset-0 z-9999"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: constants.FADE_TIME, ease: "easeInOut" }}
        >
          {/* LEFT PANEL */}
          <motion.div
            className="bg-foreground dark:bg-neon absolute inset-0"
            style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            transition={{ duration: constants.PANEL_TIME, ease: "easeInOut" }}
          />

          {/* RIGHT PANEL */}
          <motion.div
            className="bg-foreground dark:bg-neon absolute inset-0"
            style={{
              clipPath: "polygon(99% 0, 100% 0, 100% 100%, 0 100%, 0 99%)",
            }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            transition={{ duration: constants.PANEL_TIME, ease: "easeInOut" }}
          />

          {/* N SVG — centered over both panels */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: phase === 3 ? 150 : 1 }}
              transition={{ duration: constants.SCALE_TIME, ease: "easeIn" }}
            >
              <svg
                viewBox="0 0 48 51"
                width="270"
                height="300"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {constants.CLIPS.map(({ delay, id, initY }) => (
                    <clipPath key={id} id={id}>
                      <ClipRect initY={initY} delay={delay} phase={phase} />
                    </clipPath>
                  ))}
                </defs>
                <path
                  d={constants.PATHS.left}
                  fill={theme === "dark" ? "var(--background)" : "var(--neon)"}
                  clipPath="url(#clip-n-left)"
                />
                <path
                  d={constants.PATHS.middle}
                  fill={theme === "dark" ? "var(--background)" : "var(--neon)"}
                  clipPath="url(#clip-n-middle)"
                />
                <path
                  d={constants.PATHS.right}
                  fill={theme === "dark" ? "var(--background)" : "var(--neon)"}
                  clipPath="url(#clip-n-right)"
                />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
