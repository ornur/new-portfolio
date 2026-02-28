import { useSyncExternalStore } from "react";

type Phase = 0 | 1 | 2 | 3;

type State = {
  isActive: boolean;
  phase: Phase;
};

type Store = State & {
  start: () => void;
  draw: () => void;
  scaleUp: () => void;
  fadeContent: () => void;
};

let state: State = { isActive: false, phase: 0 };
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((fn) => fn());

export const transitionStore: Store = {
  draw:        () => { state = { ...state, phase: 2 };        notify(); },
  fadeContent: () => { state = { isActive: false, phase: 0 }; notify(); },
  get isActive() { return state.isActive; },
  get phase()    { return state.phase; },
  scaleUp:     () => { state = { ...state, phase: 3 };        notify(); },
  start:       () => { state = { isActive: true,  phase: 1 }; notify(); },
};

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

const getSnapshot = () => state;

export function useTransitionStore() {
  return useSyncExternalStore(subscribe, getSnapshot);
}
