"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  gsap.defaults({ ease: "power3.out", duration: 1 });
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/** Cinematic easings shared across the site. */
export const EASE = {
  out: "power3.out",
  cine: "expo.out",
  inOut: "power2.inOut",
  slow: "power1.inOut",
} as const;

/** Media queries used with gsap.matchMedia — complex motion only where it belongs. */
export const MQ = {
  motion: "(prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
  desktop: "(min-width: 1024px)",
  touch: "(hover: none), (pointer: coarse)",
} as const;

export { gsap, ScrollTrigger, useGSAP };
