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
    document.body.classList.add("is-loading");
    return () => document.body.classList.remove("is-loading");
  }, []);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const finish = () => {
        document.body.classList.remove("is-loading");
        markIntroDone();
        setDone(true);
      };

      if (reduced) {
        gsap.to(el, { autoAlpha: 0, duration: 0.4, delay: 0.3, onComplete: finish });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "expo.out" }, onComplete: finish });
      tl.set(el, { autoAlpha: 1 })
        .fromTo(
          `.${styles.word} .line > span`,
          { yPercent: 110 },
          { yPercent: 0, duration: 1.3, stagger: 0.12 },
          0.25
        )
        .fromTo(`.${styles.meta}`, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.9 }, 0.9)
        .fromTo(`.${styles.rule}`, { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: "power4.inOut" }, 0.7)
        .to(`.${styles.word} .line > span`, { yPercent: -110, duration: 0.9, ease: "power4.in", stagger: 0.06 }, 2.15)
        .to(`.${styles.meta}`, { autoAlpha: 0, duration: 0.4 }, 2.15)
        .to(`.${styles.rule}`, { scaleX: 0, transformOrigin: "right", duration: 0.7, ease: "power4.in" }, 2.3)
        .to(el, { clipPath: "inset(0 0 100% 0)", duration: 1.25, ease: "power4.inOut" }, 2.75);
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
