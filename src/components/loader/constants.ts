import { transitionStore } from "@/contexts/TransitionContext";

export const PANEL_TIME = 0.5;
export const PATH_TIME = 0.25;
export const SCALE_TIME = 0.6;
export const FADE_TIME = 0.2;
export const DRAW_TOTAL = PATH_TIME * 3 + 0.15; // sequential: left → middle → right + small buffer before scaling
export const SVG_H = 51;

// SVG path data
export const PATHS = {
  left: "M 17.43,22.82 12.67,50.4 H -1.74344e-6 L 8.89,-8.10623e-6 h 13.02 z",
  middle: "M 38.92,50.4 H 26.25 L 17.43,22.82 8.89,-8.10623e-6 H 21.91 L 30.59,25.76 Z",
  right: "M 47.74,-8.10623e-6 38.92,50.4 H 26.25 L 30.59,25.76 35.14,-8.10623e-6 Z",
};

export const CLIPS = [
  { delay: 0, id: "clip-n-left", initY: SVG_H },
  { delay: PATH_TIME, id: "clip-n-middle", initY: 0 },
  { delay: PATH_TIME * 2, id: "clip-n-right", initY: SVG_H },
] as const;

// Phase → [action, delay ms] — stable module-level map, no re-creation on render
const { draw, fadeContent, scaleUp } = transitionStore;
export const PHASE_SCHEDULE: Partial<Record<number, [() => void, number]>> = {
  1: [draw, PANEL_TIME * 1000],
  2: [scaleUp, DRAW_TOTAL * 1000],
  3: [fadeContent, SCALE_TIME * 1000],
};