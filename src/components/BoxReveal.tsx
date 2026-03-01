import { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "motion/react";

interface BoxRevealProps {
  boxColor?: string;
  duration?: number;
  children: React.ReactNode;
  width?: "fit-content" | "100%";
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
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ delay: 0.25, duration: duration ? duration : 0.5 }}
      >
        {children}
      </motion.div>

      <motion.div
        variants={{
          hidden: { left: 0 },
          visible: { left: "100%" },
        }}
        initial="hidden"
        animate={slideControls}
        transition={{ duration: duration ? duration : 0.5, ease: "easeIn" }}
        style={{
          background: boxColor ? boxColor : "#5046e6",
          bottom: 4,
          left: 0,
          position: "absolute",
          right: 0,
          top: 4,
          zIndex: 20,
        }}
      />
    </div>
  );
};
