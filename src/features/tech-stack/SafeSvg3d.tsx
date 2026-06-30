import { lazy, Suspense } from "react";

import type { LogoDefinition, LogoRenderMode } from "./logoTypes";

import { markRendered } from "./logoRenderUtils";
import { StaticLogo } from "./StaticLogo";
import { Svg3dErrorBoundary } from "./Svg3dErrorBoundary";

const SVG3D = lazy(() =>
  import("3dsvg").then(({ SVG3D }) => ({ default: SVG3D })),
);

type SafeSvg3dProps = {
  logo: LogoDefinition;
  mode: Exclude<LogoRenderMode, "static">;
  onFallback: () => void;
  onRendered?: () => void;
};

export function SafeSvg3d({
  logo,
  mode,
  onFallback,
  onRendered,
}: SafeSvg3dProps) {
  const isMobile3d = mode === "mobile-3d";

  return (
    <Svg3dErrorBoundary onFallback={onFallback}>
      <Suspense fallback={<StaticLogo color={logo.color} svg={logo.svg} />}>
        <SVG3D
          ambientIntensity={isMobile3d ? 0.45 : undefined}
          animate={isMobile3d ? "spin" : "spinFloat"}
          animateSpeed={isMobile3d ? 0.3 : undefined}
          className={isMobile3d ? "pointer-events-none" : "cursor-grab"}
          color={logo.color}
          cursorOrbit={!isMobile3d}
          depth={isMobile3d ? 0.42 : undefined}
          draggable={!isMobile3d}
          fov={isMobile3d ? 40 : undefined}
          intro={isMobile3d ? "fade" : undefined}
          introDuration={isMobile3d ? 0.25 : undefined}
          metalness={0}
          onLoadingChange={
            onRendered
              ? (loading, progress) => {
                  if (!loading && progress === 100) {
                    markRendered(onRendered);
                  }
                }
              : undefined
          }
          opacity={0}
          resetOnIdle={!isMobile3d}
          roughness={1}
          scrollZoom={false}
          shadow={false}
          smoothness={isMobile3d ? 0.04 : undefined}
          svg={logo.svg}
          zoom={isMobile3d ? 7 : undefined}
        />
      </Suspense>
    </Svg3dErrorBoundary>
  );
}
