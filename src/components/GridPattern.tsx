"use client";

import * as motion from "motion/react-m";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

interface GridPatternProps {
  className?: string;
  duration?: number;
  height?: number;
  maxOpacity?: number;
  numSquares?: number;
  strokeDasharray?: number;
  width?: number;
  x?: number;
  y?: number;
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
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full fill-gray-400/30 stroke-gray-400/30",
        className,
      )}
      ref={containerRef}
      {...props}
    >
      <defs>
        <pattern
          height={height}
          id={id}
          patternUnits="userSpaceOnUse"
          width={width}
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
      <rect fill={`url(#${id})`} height="100%" width="100%" />
      <svg className="overflow-visible" x={x} y={y}>
        {squares.map(({ id: squareId, pos: [x, y] }, index) => (
          <motion.rect
            animate={{ opacity: maxOpacity }}
            fill={theme === "dark" ? "var(--neon)" : "var(--foreground)"}
            height={height - 1}
            initial={{ opacity: 0 }}
            key={squareId}
            onAnimationComplete={() => updateSquarePosition(squareId)}
            strokeWidth="0"
            transition={{
              delay: index * 0.1,
              duration,
              repeat: 1,
              repeatType: "reverse",
            }}
            width={width - 1}
            x={x * width + 1}
            y={y * height + 1}
          />
        ))}
      </svg>
    </svg>
  );
}
