import { useSyncExternalStore } from "react";

// ─── Phase ──────────────────────────────────────────────────────────────────
export const Phase = {
  drawing: 2,
  idle: 0,
  panelsIn: 1,
  scaling: 3,
} as const;
type Phase = (typeof Phase)[keyof typeof Phase];

// ─── State ───────────────────────────────────────────────────────────────────
type State = {
  isActive: boolean;
  phase: Phase;
};

type TransitionStore = State & {
  /** Promise that resolves when the draw animation is done */
  awaitDrawComplete: () => Promise<void>;
  /** Promise that resolves when the entering page's SVG3D is ready */
  awaitSvgReady: () => Promise<void>;
  /** Kick off the transition (panels slide in) */
  begin: () => void;
  /** End the transition and return to idle */
  finish: () => void;
  /** Signal that the draw animation finished; unblocks awaitDrawComplete() */
  markDrawComplete: () => void;
  /** Signal that the SVG3D render is ready; unblocks awaitSvgReady() */
  markSvgReady: () => void;
  /** Advance to the drawing phase */
  startDrawing: () => void;
  /** Advance to the scale-up phase (called after nav resolves) */
  startScaling: () => void;
};

// ─── Internal state ──────────────────────────────────────────────────────────
let state: State = { isActive: false, phase: Phase.idle };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((fn) => fn());

let resolveDrawComplete: (() => void) | null = null;
let drawCompletePromise: Promise<void> = Promise.resolve();
let resolveSvgReady: (() => void) | null = null;
let svgReadyPromise: Promise<void> = Promise.resolve();

// ─── Store ───────────────────────────────────────────────────────────────────
export const transitionStore: TransitionStore = {
  awaitDrawComplete: () => drawCompletePromise,
  awaitSvgReady: () => svgReadyPromise,

  begin: () => {
    drawCompletePromise = new Promise<void>((res) => {
      resolveDrawComplete = res;
    });
    svgReadyPromise = new Promise<void>((res) => {
      resolveSvgReady = res;
    });
    state = { isActive: true, phase: Phase.panelsIn };
    emit();
  },

  finish: () => {
    state = { isActive: false, phase: Phase.idle };
    emit();
  },

  get isActive() {
    return state.isActive;
  },

  markDrawComplete: () => {
    resolveDrawComplete?.();
    resolveDrawComplete = null;
  },

  markSvgReady: () => {
    resolveSvgReady?.();
    resolveSvgReady = null;
  },

  get phase() {
    return state.phase;
  },

  startDrawing: () => {
    state = { ...state, phase: Phase.drawing };
    emit();
  },
  startScaling: () => {
    state = { ...state, phase: Phase.scaling };
    emit();
  },
};

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

export function useTransitionStore() {
  return useSyncExternalStore(subscribe, () => state);
}
