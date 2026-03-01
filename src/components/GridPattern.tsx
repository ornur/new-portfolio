"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";

interface GridPatternProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  duration?: number;
  className?: string;
  numSquares?: number;
  maxOpacity?: number;
  strokeDasharray?: number;
}

export function GridPattern({
  className,
  duration = 4,
  height = 40,
  maxOpacity = 0.5,
  numSquares = 50,
  strokeDasharray = 0,
  width = 40,
  x = -1,
  y = -1,
  ...props
}: GridPatternProps) {
  const id = useId();
  const containerRef = useRef(null);
  const { theme } = useTheme();
  // Use a ref so ResizeObserver always reads fresh dimensions without triggering re-renders
  const dimensionsRef = useRef({ height: 0, width: 0 });

  const getPos = useCallback(() => {
    return [
      Math.floor((Math.random() * dimensionsRef.current.width) / width),
      Math.floor((Math.random() * dimensionsRef.current.height) / height),
    ];
  }, [width, height]);

  const generateSquares = useCallback(
    (count: number) => {
      return Array.from({ length: count }, (_, i) => ({
        id: i,
        pos: getPos(),
      }));
    },
    [getPos],
  );

  const [squares, setSquares] = useState<{ id: number; pos: number[] }[]>([]);

  // Function to update a single square's position
  const updateSquarePosition = (id: number) => {
    setSquares((currentSquares) =>
      currentSquares.map((sq) =>
        sq.id === id ? { ...sq, pos: getPos() } : sq,
      ),
    );
  };

  // Resize observer — setSquares is called from an external system callback, not effect body
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        dimensionsRef.current = {
          height: entry.contentRect.height,
          width: entry.contentRect.width,
        };
        setSquares(generateSquares(numSquares));
      }
    });

    const currentContainer = containerRef.current;
    if (currentContainer) {
      resizeObserver.observe(currentContainer);
    }

    return () => {
      if (currentContainer) {
        resizeObserver.unobserve(currentContainer);
      }
    };
  }, [generateSquares, numSquares]);

  return (
    <svg
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full fill-gray-400/30 stroke-gray-400/30",
        className,
      )}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
      <svg x={x} y={y} className="overflow-visible">
        {squares.map(({ id, pos: [x, y] }, index) => (
          <motion.rect
            initial={{ opacity: 0 }}
            animate={{ opacity: maxOpacity }}
            transition={{
              delay: index * 0.1,
              duration,
              repeat: 1,
              repeatType: "reverse",
            }}
            onAnimationComplete={() => updateSquarePosition(id)}
            key={`${x}-${y}-${index}`}
            width={width - 1}
            height={height - 1}
            x={x * width + 1}
            y={y * height + 1}
            fill={theme === "dark" ? "var(--neon)" : "var(--foreground)"}
            strokeWidth="0"
          />
        ))}
      </svg>
    </svg>
  );
}
