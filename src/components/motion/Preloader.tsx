"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { markIntroDone } from "@/lib/intro";
import { brand } from "@/content/site";
import styles from "./Preloader.module.css";

/**
 * Cinematic opening:
 *   black → wordmark appears → thin line expands → curtain lifts (hero reveals)
 * Under prefers-reduced-motion it simply fades out.
 */
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("sk_intro_seen")) {
        markIntroDone();
        setDone(true);
        return;
      }
    } catch {}
    document.body.classList.add("is-loading");
    return () => document.body.classList.remove("is-loading");
  }, []);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      try {
        if (sessionStorage.getItem("sk_intro_seen")) {
          markIntroDone();
          setDone(true);
          return;
        }
      } catch {}
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const finish = () => {
        try {
          sessionStorage.setItem("sk_intro_seen", "1");
        } catch {}
        document.body.classList.remove("is-loading");
        markIntroDone();
        setDone(true);
      };

      if (reduced) {
        gsap.to(el, { autoAlpha: 0, duration: 0.2, onComplete: finish });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "expo.out" }, onComplete: finish });
      tl.set(el, { autoAlpha: 1 })
        .fromTo(
          `.${styles.word} .line > span`,
          { yPercent: 110 },
          { yPercent: 0, duration: 0.5, stagger: 0.06 },
          0.05
        )
        .fromTo(`.${styles.meta}`, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.2)
        .fromTo(`.${styles.rule}`, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: "power3.inOut" }, 0.2)
        .to(`.${styles.word} .line > span`, { yPercent: -110, duration: 0.35, ease: "power3.in", stagger: 0.03 }, 0.6)
        .to(`.${styles.meta}`, { autoAlpha: 0, duration: 0.2 }, 0.6)
        .to(`.${styles.rule}`, { scaleX: 0, transformOrigin: "right", duration: 0.25, ease: "power3.in" }, 0.65)
        .to(el, { clipPath: "inset(0 0 100% 0)", duration: 0.5, ease: "expo.inOut" }, 0.75);
    },
    { scope: root }
  );

  if (done) return null;

  return (
    <div ref={root} className={styles.root} aria-hidden="true">
      <div className={styles.inner}>
        <div className={`${styles.word} serif`}>
          {brand.wordmark.map((w) => (
            <span className="line" key={w}>
              <span>{w}</span>
            </span>
          ))}
        </div>
        <div className={styles.rule} />
        <div className={`${styles.meta} meta-sm`}>{brand.regions.join("  ·  ")}</div>
      </div>
    </div>
  );
}
