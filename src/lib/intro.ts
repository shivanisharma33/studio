"use client";

/**
 * Tiny intro bus: the preloader announces when the curtain has lifted so the
 * hero can start its choreography exactly on cue. If the preloader was
 * skipped (reduced motion / already seen) the flag is set immediately.
 */
declare global {
  interface Window {
    __skIntroDone?: boolean;
  }
}

const EVENT = "sk:intro-done";

export function markIntroDone() {
  if (typeof window === "undefined") return;
  window.__skIntroDone = true;
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function onIntroDone(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  if (window.__skIntroDone) {
    cb();
    return () => {};
  }
  const handler = () => cb();
  window.addEventListener(EVENT, handler, { once: true });
  return () => window.removeEventListener(EVENT, handler);
}
