import { useSyncExternalStore } from "react";

type NavigatorWithDeviceMemory = Navigator & {
  deviceMemory?: number;
};

const MOBILE_BREAKPOINT = 768;
const MIN_MOBILE_DEVICE_MEMORY_GB = 3;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
let webGLSupported: boolean | undefined;

const hasWebGLSupport = () => {
  const canvas = document.createElement("canvas");
  const context =
    canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

  return Boolean(context);
};

export function useCanRender3dSvg(isMobile: boolean) {
  const canRenderOnMobile = useSyncExternalStore(
    subscribeToCapability,
    getMobileCapability,
    getServerCapability,
  );

  return !isMobile || canRenderOnMobile;
}

function getMobileCapability() {
  const { deviceMemory } = navigator as NavigatorWithDeviceMemory;

  return (
    window.innerWidth <= MOBILE_BREAKPOINT &&
    (deviceMemory == null || deviceMemory >= MIN_MOBILE_DEVICE_MEMORY_GB) &&
    !window.matchMedia(REDUCED_MOTION_QUERY).matches &&
    webGLSupported === true
  );
}

function getServerCapability() {
  return false;
}

function subscribeToCapability(onStoreChange: () => void) {
  const reducedMotionQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  // Probe once when subscribing, keeping WebGL allocation out of rendering.
  webGLSupported ??= hasWebGLSupport();

  reducedMotionQuery.addEventListener("change", onStoreChange);
  window.addEventListener("resize", onStoreChange);

  return () => {
    reducedMotionQuery.removeEventListener("change", onStoreChange);
    window.removeEventListener("resize", onStoreChange);
  };
}
