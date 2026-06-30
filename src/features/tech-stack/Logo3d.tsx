import { useState } from "react";

import type { LogoDefinition, LogoRenderMode } from "./logoTypes";

import { SafeSvg3d } from "./SafeSvg3d";
import { StaticLogo } from "./StaticLogo";

export function Logo3d({
  logo,
  mode,
  onRendered,
}: {
  logo: LogoDefinition;
  mode: Exclude<LogoRenderMode, "static">;
  onRendered?: () => void;
}) {
  const [fallback, setFallback] = useState(false);

  if (fallback) {
    return (
      <StaticLogo color={logo.color} onRendered={onRendered} svg={logo.svg} />
    );
  }

  return (
    <SafeSvg3d
      logo={logo}
      mode={mode}
      onFallback={() => setFallback(true)}
      onRendered={onRendered}
    />
  );
}
