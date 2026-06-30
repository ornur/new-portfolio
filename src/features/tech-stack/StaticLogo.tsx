import { useEffect } from "react";

import { markRendered } from "./logoRenderUtils";

const staticSvg = (svg: string, color: string) => (
  <div
    className="h-full w-full [&_svg]:h-full [&_svg]:w-full"
    dangerouslySetInnerHTML={{
      __html: svg
        .replace('height="200px"', 'height="100%"')
        .replace('width="200px"', 'width="100%"'),
    }}
    style={{ color }}
  />
);

export function StaticLogo({
  color,
  onRendered,
  svg,
}: {
  color: string;
  onRendered?: () => void;
  svg: string;
}) {
  useEffect(() => {
    markRendered(onRendered);
  }, [onRendered]);

  return staticSvg(svg, color);
}
