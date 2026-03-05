import { useAnimation, useInView } from "motion/react";
import * as motion from "motion/react-m";
import { useEffect, useRef } from "react";

interface BoxRevealProps {
  boxColor?: string;
  children: React.ReactNode;
  duration?: number;
  width?: "100%" | "fit-content";
}

export const BoxReveal = ({
  boxColor,
  children,
  duration,
  width = "fit-content",
}: BoxRevealProps) => {
  const mainControls = useAnimation();
  const slideControls = useAnimation();

  const ref = useRef(null);
  const isInView = useInView(ref);

  useEffect(() => {
    if (isInView) {
      slideControls.start("visible");
      mainControls.start("visible");
    } else {
      slideControls.start("hidden");
      mainControls.start("hidden");
    }
  }, [isInView, mainControls, slideControls]);

  return (
    <div ref={ref} style={{ overflow: "hidden", position: "relative", width }}>
      <motion.div
        animate={mainControls}
        initial="hidden"
        transition={{ delay: 0.25, duration: duration ? duration : 0.5 }}
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
      >
        {children}
      </motion.div>

      <motion.div
        animate={slideControls}
        initial="hidden"
        style={{
          background: boxColor ? boxColor : "#5046e6",
          bottom: 4,
          left: 0,
          position: "absolute",
          right: 0,
          top: 4,
          zIndex: 20,
        }}
        transition={{ duration: duration ? duration : 0.5, ease: "easeIn" }}
        variants={{
          hidden: { left: 0 },
          visible: { left: "100%" },
        }}
      />
    </div>
  );
};
