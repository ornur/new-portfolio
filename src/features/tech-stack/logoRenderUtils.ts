export const markRendered = (onRendered?: () => void) => {
  if (!onRendered) return;
  window.requestAnimationFrame(onRendered);
};
