import type { CSSProperties } from "react";

import { type Variants } from "motion/react";
import * as motion from "motion/react-m";

import { cn } from "@/lib/utils";

type SpinningTextProps = {
  children: string;
  className?: string;
  fontSize?: number;
  radius?: number;
  reverse?: boolean;
  style?: CSSProperties;
  variants: {
    container: Variants;
    item: Variants;
  };
};

export function SpinningText({
  children,
  className,
  fontSize = 1,
  radius = 5,
  reverse = false,
  style,
  variants,
}: SpinningTextProps) {
  const letters = children.split("");
  const totalLetters = letters.length;

  const containerVariants = {
    visible: { rotate: reverse ? -360 : 360 },
    ...variants.container,
  };

  return (
    <motion.div
      animate="visible"
      className={cn("relative", className)}
      initial="hidden"
      style={{
        ...style,
      }}
      variants={containerVariants}
    >
      {letters.map((letter, index) => (
        <motion.span
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 inline-block"
          key={`${index}-${letter}`}
          style={
            {
              "--font-size": fontSize,
              "--index": index,
              "--radius": radius,
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
          variants={variants.item}
        >
          {letter}
        </motion.span>
      ))}
      <span className="sr-only">{children}</span>
    </motion.div>
  );
}
