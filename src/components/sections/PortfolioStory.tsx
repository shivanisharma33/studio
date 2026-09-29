"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { storyWords } from "@/content/site";
import { media } from "@/content/media";
import Photo from "@/components/ui/Photo";
import styles from "./PortfolioStory.module.css";

/**
 * Story through photography — one frame at a time. Pinned; each scroll step
 * crossfades to the next photograph while the editorial word changes.
 * The words are creative labels, not descriptions of the specific images.
 */
export default function PortfolioStory() {
  const root = useRef<HTMLElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const frames = media.story;

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        const imgs = q(`.${styles.frame}`);
        const words = q(`.${styles.word}`);
        const n = imgs.length;

        gsap.set(imgs, { autoAlpha: 0, scale: 1.12 });
        gsap.set(words, { autoAlpha: 0, yPercent: 40 });
        gsap.set(imgs[0], { autoAlpha: 1, scale: 1.04 });
        gsap.set(words[0], { autoAlpha: 1, yPercent: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: () => `+=${n * 90}%`,
            pin: true,
            scrub: 0.9,
            anticipatePin: 1,
            onUpdate: (self) => {
              const i = Math.min(n, Math.floor(self.progress * n) + 1);
              if (counter.current) counter.current.textContent = String(i).padStart(2, "0");
            },
          },
        });

        for (let i = 1; i < n; i++) {
          const at = i;
          tl.to(imgs[i - 1], { autoAlpha: 0, scale: 1.0, duration: 0.6, ease: "power2.inOut" }, at)
            .to(words[i - 1], { autoAlpha: 0, yPercent: -40, duration: 0.45, ease: "power2.in" }, at)
            .to(imgs[i], { autoAlpha: 1, scale: 1.04, duration: 0.8, ease: "power2.out" }, at + 0.1)
            .to(words[i], { autoAlpha: 1, yPercent: 0, duration: 0.6, ease: "expo.out" }, at + 0.25);
        }
        tl.to({}, { duration: 0.6 }); // breathing room on the final frame
      });

      mm.add(MQ.reduced, () => {
        gsap.set(q(`.${styles.frame}`), { autoAlpha: 1, scale: 1, position: "relative", height: "70vh" });
        gsap.set(q(`.${styles.word}`), { autoAlpha: 1, yPercent: 0, position: "relative" });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className={styles.scene} aria-label="Story through photography">
      <div className={styles.stack}>
        {frames.map((p, i) => (
          <div className={styles.frame} key={i}>
            <Photo photo={p} sizes="100vw" quality={78} />
          </div>
        ))}
        <div className={styles.veil} />
      </div>

      <div className={styles.overlay}>
        <div className={styles.top}>
          <span className="meta-sm">06 &nbsp;—&nbsp; THE WEDDING EXPERIENCE</span>
          <span className={`meta-sm ${styles.count}`}>
            <span ref={counter}>01</span> / {String(frames.length).padStart(2, "0")}
          </span>
        </div>
        <div className={styles.words} aria-live="polite">
          {storyWords.map((w, i) => (
            <span className={`serif ${styles.word}`} key={i}>
              {w.replace("THE ", "")}
              <em className={styles.the}>the</em>
            </span>
          ))}
        </div>
        <div className={styles.bottom}>
          <span className="meta-sm">WE DON&apos;T SIMPLY DOCUMENT A WEDDING.</span>
          <span className="meta-sm champagne">WE PRESERVE HOW IT FELT.</span>
        </div>
      </div>
    </section>
  );
}
