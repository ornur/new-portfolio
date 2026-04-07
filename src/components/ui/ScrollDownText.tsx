import type { Variants } from "motion/react";

import * as motion from "motion/react-m";

import { useIsMobile } from "@/hooks/useIsMobile";

const TEXT = "SCROLL DOWN • SCROLL DOWN • ";

export function ScrollDownText() {
  const { isMobile } = useIsMobile();
  const letters = TEXT.split("");
  const totalLetters = letters.length;

  const containerVariants: Variants = {
    visible: {
      animationDelay: 5000,
      opacity: 1,
      rotate: 360,
      transition: {
        bounce: 0,
        delay: 2, // Wait 4 seconds for the rotation
        delayChildren: 2, // Start animating children after 4 seconds
        duration: 6,
        ease: "linear",
        repeat: Infinity,
        staggerChildren: 0.03,
        type: "spring",
      },
      transitionDelay: 5000,
    },
  };

  return (
    <div className="text-background dark:text-neon pointer-events-none fixed top-0 right-0 z-1 -translate-x-9 translate-y-10 text-center whitespace-nowrap mix-blend-difference md:-translate-x-15 md:translate-y-16">
      <motion.div
        animate="visible"
        className="relative"
        initial="hidden"
        variants={containerVariants}
      >
        {letters.map((letter, index) => (
          <motion.span
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 inline-block"
            key={`${index}-${letter}`}
            style={
              {
                "--font-size": isMobile ? 0.5 : 0.7,
                "--index": index,
                "--radius": isMobile ? 5 : 6,
                "--total": totalLetters,
                fontSize: `calc(var(--font-size, 2) * 1rem)`,
                transform: `
                        translate(-50%, -50%)
                        rotate(calc(360deg / var(--total) * var(--index)))
                        translateY(calc(var(--radius, 5) * -1ch))
                      `,
                transformOrigin: "center",
              } as React.CSSProperties
            }
            variants={{
              hidden: {
                filter: "blur(4px)",
                opacity: 0,
              },
              visible: {
                filter: "blur(0px)",
                opacity: 1,
              },
            }}
          >
            {letter}
          </motion.span>
        ))}
        <span className="sr-only">{TEXT}</span>
      </motion.div>
    </div>
  );
}
