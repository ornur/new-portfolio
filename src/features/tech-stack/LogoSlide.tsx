import { type MotionValue, useTransform } from "motion/react";
import * as motion from "motion/react-m";

export interface TechLogo {
  bgColor: string;
  href: string;
  node: React.ReactNode;
  textColor: string;
  title: string;
}

export function LogoSlide({
  entryNudge = 0,
  fadeRange = 0.25,
  fillThreshold = 0.6,
  gap = 0.3,
  index,
  logo,
  logoCount,
  logoSize = "40vh",
  scrollYProgress,
}: {
  entryNudge?: number;
  fadeRange?: number;
  fillThreshold?: number;
  /** Fraction [0–1] of each logo's scroll window used as a hold/pause after the
   *  fill completes, before the next logo begins. 0 = no gap, 0.5 = half the
   *  window is a pause. Default 0.3. */
  gap?: number;
  index: number;
  logo: TechLogo;
  logoCount: number;
  logoSize?: string;
  scrollYProgress: MotionValue<number>;
}) {
  // Each logo owns a [start, end] slice of the global 0–1 progress.
  const start = index / logoCount;
  const end = (index + 1) / logoCount;

  // Active animation window: shrunk by `gap` so the logo holds fully-revealed
  // for (gap * windowSize) worth of scroll before the next logo kicks in.
  const activeEnd = start + (1 - gap) / logoCount;

  // Map global progress into local 0–1 for this logo's window.
  // useTransform clamps automatically, so local stays at 1 during the hold.
  const local = useTransform(scrollYProgress, [start, activeEnd], [0, 1]);

  // Fill bar: even index → left→right, odd → right→left.
  const fillWidth = useTransform(local, [0, 1], ["0%", "100%"]);
  const fillFromRight = index % 2 !== 0;

  // Icon fades in + rises after fillThreshold is crossed.
  const fadeEnd = Math.min(fillThreshold + fadeRange, 1);
  const logoOpacity = useTransform(local, [fillThreshold, fadeEnd], [0, 1]);
  const logoBounce = useTransform(local, [fillThreshold, fadeEnd], [20, 0], {
    clamp: false,
  });
  const logoY = useTransform(local, [fillThreshold, fadeEnd], [entryNudge, 0]);

  const slideVisibility = useTransform(scrollYProgress, (v) =>
    v >= start && v <= end + 0.5 ? "visible" : "hidden",
  );

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        visibility: slideVisibility,
        zIndex: index + 1 - logoCount,
      }}
    >
      <div
        className="absolute inset-x-0 overflow-hidden"
        style={{ height: "100vh", zIndex: 1 }}
      >
        <motion.div
          className="absolute inset-y-0"
          style={{
            backgroundColor: logo.bgColor,
            width: fillWidth,
            ...(fillFromRight ? { right: 0 } : { left: 0 }),
          }}
        />
      </div>

      <div className="relative" style={{ zIndex: 2 }}>
        <a
          className="flex flex-col items-center gap-2 no-underline"
          href={logo.href}
          rel="noopener noreferrer"
          target="_blank"
        >
          <motion.div
            className="flex flex-col items-center gap-2"
            style={{
              opacity: logoOpacity,
              translateY: logoBounce,
              y: logoY,
            }}
          >
            <div
              className="flex items-center justify-center overflow-hidden rounded-xl"
              style={{
                fontSize: logoSize,
                height: logoSize,
                width: logoSize,
              }}
            >
              {logo.node}
            </div>
            <span
              className="text-3xl font-medium whitespace-nowrap"
              style={{ color: logo.textColor }}
            >
              {logo.title}
            </span>
          </motion.div>
        </a>
      </div>
    </motion.div>
  );
}
