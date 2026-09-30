"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { storyFrames } from "@/content/site";
import { media } from "@/content/media";
import Photo from "@/components/ui/Photo";
import styles from "./PortfolioStory.module.css";

/**
 * Story through photography — one frame at a time. Pinned; each scroll step
 * crossfades to the next photograph while the editorial text reflects the true emotion of each frame.
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
        const cards = q(`.${styles.card}`);
        const n = imgs.length;

        gsap.set(imgs, { autoAlpha: 0, scale: 1.12 });
        gsap.set(cards, { autoAlpha: 0, yPercent: 40 });
        gsap.set(imgs[0], { autoAlpha: 1, scale: 1.04 });
        gsap.set(cards[0], { autoAlpha: 1, yPercent: 0 });

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
            .to(cards[i - 1], { autoAlpha: 0, yPercent: -40, duration: 0.45, ease: "power2.in" }, at)
            .to(imgs[i], { autoAlpha: 1, scale: 1.04, duration: 0.8, ease: "power2.out" }, at + 0.1)
            .to(cards[i], { autoAlpha: 1, yPercent: 0, duration: 0.6, ease: "expo.out" }, at + 0.25);
        }
        tl.to({}, { duration: 0.6 }); // breathing room on the final frame
      });

      mm.add(MQ.reduced, () => {
        gsap.set(q(`.${styles.frame}`), { autoAlpha: 1, scale: 1, position: "relative", height: "70vh" });
        gsap.set(q(`.${styles.card}`), { autoAlpha: 1, yPercent: 0, position: "relative" });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="wedding-experience" className={styles.scene} aria-label="The Wedding Experience">
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
          <div className={styles.header}>
            <span className="meta-sm">06 &nbsp;—&nbsp; THE WEDDING EXPERIENCE</span>
            <h2 className={`serif ${styles.headline}`}>
              PRESERVING <span className={styles.headlineItalic}>HOW IT FELT</span>
            </h2>
          </div>
          <span className={`meta-sm ${styles.count}`}>
            <span ref={counter}>01</span> / {String(frames.length).padStart(2, "0")}
          </span>
        </div>
        <div className={styles.cards} aria-live="polite">
          {storyFrames.map((frame, i) => (
            <div className={styles.card} key={i}>
              <span className={`serif ${styles.word}`}>
                {frame.word.replace("THE ", "")}
                <em className={styles.the}>the</em>
              </span>
              <p className={`serif-i ${styles.tagline}`}>
                {frame.tagline}
              </p>
            </div>
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
