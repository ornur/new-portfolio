"use client";

import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

export interface GlassSurfaceProps {
  backgroundOpacity?: number;
  blueOffset?: number;
  blur?: number;
  borderRadius?: number;
  borderWidth?: number;
  brightness?: number;
  children?: React.ReactNode;
  className?: string;
  displace?: number;
  distortionScale?: number;
  greenOffset?: number;
  height?: number | string;
  mixBlendMode?:
    | "color"
    | "color-burn"
    | "color-dodge"
    | "darken"
    | "difference"
    | "exclusion"
    | "hard-light"
    | "hue"
    | "lighten"
    | "luminosity"
    | "multiply"
    | "normal"
    | "overlay"
    | "plus-darker"
    | "plus-lighter"
    | "saturation"
    | "screen"
    | "soft-light";
  opacity?: number;
  redOffset?: number;
  saturation?: number;
  style?: React.CSSProperties;
  width?: number | string;
  xChannel?: "B" | "G" | "R";
  yChannel?: "B" | "G" | "R";
}

type ContainerStylesParams = {
  backgroundOpacity: number;
  borderRadius: number;
  filterId: string;
  height: number | string;
  isDarkMode: boolean;
  saturation: number;
  style: React.CSSProperties | undefined;
  svgSupported: boolean;
  width: number | string;
};

type GlassFilterProps = {
  blueChannelRef: React.RefObject<null | SVGFEDisplacementMapElement>;
  feImageRef: React.RefObject<null | SVGFEImageElement>;
  filterId: string;
  gaussianBlurRef: React.RefObject<null | SVGFEGaussianBlurElement>;
  greenChannelRef: React.RefObject<null | SVGFEDisplacementMapElement>;
  redChannelRef: React.RefObject<null | SVGFEDisplacementMapElement>;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

// Optimization: Pre-check device types to avoid repeated regex
const isMobileDevice = () => {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
};

function getContainerStyles({
  backgroundOpacity,
  borderRadius,
  filterId,
  height,
  isDarkMode,
  saturation,
  style,
  svgSupported,
  width,
}: ContainerStylesParams): React.CSSProperties {
  const baseStyles: React.CSSProperties = {
    ...style,
    borderRadius: `${borderRadius}px`,
    height: typeof height === "number" ? `${height}px` : height,
    overflow: "hidden",
    position: "relative",
    width: typeof width === "number" ? `${width}px` : width,
  } as React.CSSProperties;

  const isMobile = isMobileDevice();

  // If mobile or SVG not supported, use standard backdrop-filter (FAST)
  if (!svgSupported || isMobile) {
    const blurAmount = isMobile ? "8px" : "12px"; // Reduced blur for mobile
    return {
      ...baseStyles,
      backdropFilter: `blur(${blurAmount}) saturate(${saturation + 0.5})`,
      background: isDarkMode
        ? `rgba(20, 20, 20, ${Math.max(backgroundOpacity, 0.4)})`
        : `rgba(255, 255, 255, ${Math.max(backgroundOpacity, 0.2)})`,
      border: isDarkMode
        ? "1px solid rgba(255, 255, 255, 0.1)"
        : "1px solid rgba(0, 0, 0, 0.1)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      WebkitBackdropFilter: `blur(${blurAmount}) saturate(${saturation + 0.5})`,
    };
  }

  // Desktop / High-end SVG Mode
  return {
    ...baseStyles,
    backdropFilter: `url(#${filterId}) saturate(${saturation})`,
    background: isDarkMode
      ? `hsl(0 0% 0% / ${backgroundOpacity})`
      : `hsl(0 0% 100% / ${backgroundOpacity})`,
    WebkitBackdropFilter: `url(#${filterId}) saturate(${saturation})`,
  };
}
function GlassFilter({
  blueChannelRef,
  feImageRef,
  filterId,
  gaussianBlurRef,
  greenChannelRef,
  redChannelRef,
}: GlassFilterProps) {
  return (
    <svg
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-0"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter
          colorInterpolationFilters="sRGB"
          height="100%"
          id={filterId}
          width="100%"
          x="0%"
          y="0%"
        >
          <feImage
            height="100%"
            preserveAspectRatio="none"
            ref={feImageRef}
            result="map"
            width="100%"
            x="0"
            y="0"
          />
          <feDisplacementMap
            id="redchannel"
            in="SourceGraphic"
            in2="map"
            ref={redChannelRef}
            result="dispRed"
          />
          <feColorMatrix
            in="dispRed"
            result="red"
            type="matrix"
            values="1 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 1 0"
          />
          <feDisplacementMap
            id="greenchannel"
            in="SourceGraphic"
            in2="map"
            ref={greenChannelRef}
            result="dispGreen"
          />
          <feColorMatrix
            in="dispGreen"
            result="green"
            type="matrix"
            values="0 0 0 0 0
                    0 1 0 0 0
                    0 0 0 0 0
                    0 0 0 1 0"
          />
          <feDisplacementMap
            id="bluechannel"
            in="SourceGraphic"
            in2="map"
            ref={blueChannelRef}
            result="dispBlue"
          />
          <feColorMatrix
            in="dispBlue"
            result="blue"
            type="matrix"
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 1 0 0
                    0 0 0 1 0"
          />
          <feBlend in="red" in2="green" mode="screen" result="rg" />
          <feBlend in="rg" in2="blue" mode="screen" result="output" />
          <feGaussianBlur
            in="output"
            ref={gaussianBlurRef}
            stdDeviation="0.7"
          />
        </filter>
      </defs>
    </svg>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

const useDarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return isDark;
};

// ─── Main Component ──────────────────────────────────────────────────────────

const GlassSurface: React.FC<GlassSurfaceProps> = ({
  backgroundOpacity = 0,
  blueOffset = 20,
  blur = 11,
  borderRadius = 20,
  borderWidth = 0.07,
  brightness = 50,
  children,
  className = "",
  displace = 0,
  distortionScale = -180,
  greenOffset = 10,
  height = 80,
  // mixBlendMode = "difference",
  opacity = 0.93,
  redOffset = 0,
  saturation = 1,
  style,
  width = 200,
  xChannel = "R",
  yChannel = "G",
}) => {
  const uniqueId = useId().replace(/:/g, "-");
  const filterId = `glass-filter-${uniqueId}`;
  const [isMobile, setIsMobile] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const feImageRef = useRef<SVGFEImageElement>(null);
  const redChannelRef = useRef<SVGFEDisplacementMapElement>(null);
  const greenChannelRef = useRef<SVGFEDisplacementMapElement>(null);
  const blueChannelRef = useRef<SVGFEDisplacementMapElement>(null);
  const gaussianBlurRef = useRef<SVGFEGaussianBlurElement>(null);

  const isDarkMode = useDarkMode();

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  // Check if browser actually handles SVG filters in backdrop-filter
  const svgSupported = useMemo(() => {
    if (typeof window === "undefined" || typeof document === "undefined")
      return false;
    // Android and Firefox often struggle with complex SVG displacement in backdrop-filter
    const isFirefox = /Firefox/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    if (isFirefox || isAndroid) return false;

    const div = document.createElement("div");
    div.style.backdropFilter = `url(#${filterId})`;
    return div.style.backdropFilter !== "";
  }, [filterId]);

  const generateDisplacementMap = useCallback(() => {
    if (isMobile) return ""; // Don't waste cycles on mobile

    const rect = containerRef.current?.getBoundingClientRect();
    const actualWidth = rect?.width || 400;
    const actualHeight = rect?.height || 200;
    const edgeSize = Math.min(actualWidth, actualHeight) * (borderWidth * 0.5);

    const svgContent = `
      <svg viewBox="0 0 ${actualWidth} ${actualHeight}" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" fill="black"></rect>
        <rect x="${edgeSize}" y="${edgeSize}" width="${actualWidth - edgeSize * 2}" height="${actualHeight - edgeSize * 2}" rx="${borderRadius}" fill="hsl(0 0% ${brightness}% / ${opacity})" style="filter:blur(${blur}px)" />
      </svg>
    `;
    return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
  }, [isMobile, borderRadius, borderWidth, brightness, blur, opacity]);

  const updateDisplacementMap = useCallback(() => {
    if (!isMobile && feImageRef.current) {
      feImageRef.current.setAttribute("href", generateDisplacementMap());
    }
  }, [generateDisplacementMap, isMobile]);

  useEffect(() => {
    if (isMobile) return;

    updateDisplacementMap();
    const channels = [
      { offset: redOffset, ref: redChannelRef },
      { offset: greenOffset, ref: greenChannelRef },
      { offset: blueOffset, ref: blueChannelRef },
    ];

    channels.forEach(({ offset, ref }) => {
      if (ref.current) {
        ref.current.setAttribute(
          "scale",
          (distortionScale + offset).toString(),
        );
        ref.current.setAttribute("xChannelSelector", xChannel);
        ref.current.setAttribute("yChannelSelector", yChannel);
      }
    });

    gaussianBlurRef.current?.setAttribute("stdDeviation", displace.toString());
  }, [
    isMobile,
    updateDisplacementMap,
    displace,
    distortionScale,
    redOffset,
    greenOffset,
    blueOffset,
    xChannel,
    yChannel,
  ]);

  useEffect(() => {
    if (isMobile || !containerRef.current) return;

    const ro = new ResizeObserver(() => {
      requestAnimationFrame(updateDisplacementMap);
    });

    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [isMobile, updateDisplacementMap]);

  const containerStyles = getContainerStyles({
    backgroundOpacity,
    borderRadius,
    filterId,
    height,
    isDarkMode,
    saturation,
    style,
    svgSupported,
    width,
  });

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      ref={containerRef}
      style={containerStyles}
    >
      {!isMobile && svgSupported && (
        <GlassFilter
          blueChannelRef={blueChannelRef}
          feImageRef={feImageRef}
          filterId={filterId}
          gaussianBlurRef={gaussianBlurRef}
          greenChannelRef={greenChannelRef}
          redChannelRef={redChannelRef}
        />
      )}

      <div className="relative z-10 flex h-full w-full items-center justify-center rounded-[inherit] p-2">
        {children}
      </div>
    </div>
  );
};

export default GlassSurface;
