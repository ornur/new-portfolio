import {
  type MotionValue,
  useMotionValueEvent,
  useTransform,
} from "motion/react";
import * as motion from "motion/react-m";
import { useState } from "react";

export interface TechLogo {
  bgColor: string;
  href: string;
  node: React.ReactNode;
  textColor: string;
  title: string;
}

const FIRST_SLIDE_WEIGHT = 0.4;
const FILL_THRESHOLD = 0.6;
const FADE_RANGE = 0.25;
const HOLD_RATIO = 0.3;

export function LogoSlide({
  deferInactiveLogo = false,
  index,
  logo,
  logoCount,
  logoSize = "40vh",
  scrollYProgress,
}: {
  deferInactiveLogo?: boolean;
  index: number;
  logo: TechLogo;
  logoCount: number;
  logoSize?: string;
  scrollYProgress: MotionValue<number>;
}) {
  const isFirstSlide = index === 0;
  const totalWeight = logoCount - 1 + FIRST_SLIDE_WEIGHT;
  const start = isFirstSlide
    ? 0
    : (FIRST_SLIDE_WEIGHT + index - 1) / totalWeight;
  const end = (FIRST_SLIDE_WEIGHT + index) / totalWeight;
  const activeEnd = start + (end - start) * (1 - HOLD_RATIO);
  const local = useTransform(scrollYProgress, [start, activeEnd], [0, 1]);
  const renderPadding = (end - start) * 0.75;
  const isWithinRenderRange = (value: number) =>
    value >= start - renderPadding && value <= end + renderPadding;
  const [isNearActiveSlide, setIsNearActiveSlide] = useState(() =>
    isWithinRenderRange(scrollYProgress.get()),
  );
  const shouldRenderLogo = !deferInactiveLogo || isNearActiveSlide;

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const nextIsNearActiveSlide = isWithinRenderRange(value);
    setIsNearActiveSlide((current) =>
      current === nextIsNearActiveSlide ? current : nextIsNearActiveSlide,
    );
  });

  const animatedFillWidth = useTransform(local, [0, 1], ["0%", "100%"]);
  const fadeEnd = Math.min(FILL_THRESHOLD + FADE_RANGE, 1);
  const animatedLogoOpacity = useTransform(
    local,
    [FILL_THRESHOLD, fadeEnd],
    [0, 1],
  );
  const animatedLogoBounce = useTransform(
    local,
    [FILL_THRESHOLD, fadeEnd],
    [20, 0],
    {
      clamp: false,
    },
  );
  const fillWidth = isFirstSlide ? "100%" : animatedFillWidth;
  const logoOpacity = isFirstSlide ? 1 : animatedLogoOpacity;
  const logoBounce = isFirstSlide ? 0 : animatedLogoBounce;

  const slideVisibility = useTransform(scrollYProgress, (v) =>
    v >= start && v <= end + 0.5 ? "visible" : "hidden",
  );
  const slidePointerEvents = useTransform(scrollYProgress, (v) =>
    v >= start && v <= end ? "auto" : "none",
  );
  const slideZIndex = useTransform(scrollYProgress, (v) =>
    v >= start && v <= end ? 1000 : index + 1 - logoCount,
  );

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        pointerEvents: slidePointerEvents,
        visibility: slideVisibility,
        zIndex: slideZIndex,
      }}
    >
      <motion.div
        className="absolute inset-y-0"
        style={{
          backgroundColor: logo.bgColor,
          width: fillWidth,
          zIndex: 1,
          ...(index % 2 ? { right: 0 } : { left: 0 }),
        }}
      />

      <div className="relative" style={{ zIndex: 2 }}>
        <motion.div
          className="flex flex-col items-center gap-2"
          style={{
            opacity: logoOpacity,
            translateY: logoBounce,
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
            {shouldRenderLogo ? logo.node : null}
          </div>
          <a
            className="flex flex-col items-center gap-2 no-underline"
            href={logo.href}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span
              className="text-3xl font-medium whitespace-nowrap"
              style={{ color: logo.textColor }}
            >
              {logo.title}
            </span>
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
}
