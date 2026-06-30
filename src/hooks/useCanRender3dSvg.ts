import { useEffect, useState } from "react";

type NavigatorWithDeviceMemory = Navigator & {
  deviceMemory?: number;
};

const MOBILE_BREAKPOINT = 768;
const MIN_MOBILE_DEVICE_MEMORY_GB = 3;

const hasWebGLSupport = () => {
  const canvas = document.createElement("canvas");
  const context =
    canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

  return Boolean(context);
};

export function useCanRender3dSvg(isMobile: boolean) {
  const [canRender, setCanRender] = useState(!isMobile);

  useEffect(() => {
    if (!isMobile) {
      setCanRender(true);
      return;
    }

    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const checkCapability = () => {
      const navigatorWithMemory = navigator as NavigatorWithDeviceMemory;
      const deviceMemory = navigatorWithMemory.deviceMemory;
      const hasEnoughMemory =
        deviceMemory == null || deviceMemory >= MIN_MOBILE_DEVICE_MEMORY_GB;
      const isMobileViewport = window.innerWidth <= MOBILE_BREAKPOINT;

      setCanRender(
        isMobileViewport &&
          hasEnoughMemory &&
          !reducedMotionQuery.matches &&
          hasWebGLSupport(),
      );
    };

    checkCapability();

    reducedMotionQuery.addEventListener("change", checkCapability);
    window.addEventListener("resize", checkCapability);

    return () => {
      reducedMotionQuery.removeEventListener("change", checkCapability);
      window.removeEventListener("resize", checkCapability);
    };
  }, [isMobile]);

  return canRender;
}
