"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import styles from "./Cursor.module.css";

/**
 * Cinematic cursor — desktop / fine-pointer only.
 * A small dot that expands into a labelled disc over [data-cursor] targets
 * (VIEW / EXPLORE / PLAY / VIEW STORY / DRAG) and gently magnetises
 * [data-magnetic] elements. Never rendered on touch devices.
 */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled || !dot.current || !ring.current || !label.current) return;
    document.body.classList.add("has-cursor");

    const d = dot.current;
    const r = ring.current;
    const l = label.current;

    const xDot = gsap.quickTo(d, "x", { duration: 0.12, ease: "power3" });
    const yDot = gsap.quickTo(d, "y", { duration: 0.12, ease: "power3" });
    const xRing = gsap.quickTo(r, "x", { duration: 0.42, ease: "power3" });
    const yRing = gsap.quickTo(r, "y", { duration: 0.42, ease: "power3" });

    let current: HTMLElement | null = null;
    let magnet: HTMLElement | null = null;

    const setLabel = (text: string | null) => {
      if (text) {
        l.textContent = text;
        r.classList.add(styles.active);
        d.classList.add(styles.hidden);
      } else {
        r.classList.remove(styles.active);
        d.classList.remove(styles.hidden);
      }
    };

    const onMove = (e: MouseEvent) => {
      xDot(e.clientX);
      yDot(e.clientY);
      xRing(e.clientX);
      yRing(e.clientY);

      const target = (e.target as HTMLElement).closest?.("[data-cursor]") as HTMLElement | null;
      if (target !== current) {
        current = target;
        setLabel(target?.dataset.cursor ?? null);
      }

      const m = (e.target as HTMLElement).closest?.("[data-magnetic]") as HTMLElement | null;
      if (m !== magnet) {
        if (magnet) gsap.to(magnet, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
        magnet = m;
      }
      if (magnet) {
        const b = magnet.getBoundingClientRect();
        const dx = e.clientX - (b.left + b.width / 2);
        const dy = e.clientY - (b.top + b.height / 2);
        gsap.to(magnet, { x: dx * 0.18, y: dy * 0.22, duration: 0.5, ease: "power3.out" });
      }
    };

    const onDown = () => r.classList.add(styles.down);
    const onUp = () => r.classList.remove(styles.down);
    const onLeave = () => gsap.to([d, r], { opacity: 0, duration: 0.3 });
    const onEnter = () => gsap.to([d, r], { opacity: 1, duration: 0.3 });

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      document.body.classList.remove("has-cursor");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={dot} className={styles.dot} aria-hidden="true" />
      <div ref={ring} className={styles.ring} aria-hidden="true">
        <span ref={label} className={styles.label} />
      </div>
    </>
  );
}
