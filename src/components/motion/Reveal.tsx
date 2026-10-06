"use client";

import { useEffect } from "react";

/**
 * One IntersectionObserver for every [data-reveal] element on the page.
 * Cheap, GPU-only (opacity/transform), and it degrades to "visible" under
 * prefers-reduced-motion via CSS.
 */
export default function Reveal() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => el.classList.add("is-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("is-in");
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 }
    );

    const observeUnrevealed = () => {
      const els = document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)");
      els.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add("is-in");
        } else {
          io.observe(el);
        }
      });
    };

    observeUnrevealed();

    let mo: MutationObserver | null = null;
    if ("MutationObserver" in window) {
      mo = new MutationObserver(() => {
        observeUnrevealed();
      });
      mo.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      io.disconnect();
      if (mo) mo.disconnect();
    };
  }, []);
  return null;
}
