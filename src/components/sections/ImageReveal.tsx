"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { brand } from "@/content/site";
import { media } from "@/content/media";
import Photo from "@/components/ui/Photo";
import styles from "./ImageReveal.module.css";

/**
 * Pinned scene: a small centred frame grows to a full-viewport cinematic
 * frame (width first, then height), while metadata surfaces on top.
 */
export default function ImageReveal() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        const frame = q(`.${styles.frame}`)[0];
        const img = q(`.${styles.img}`)[0];
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "+=180%",
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
          },
        });
        tl.fromTo(frame, { width: "34vw", height: "42vh" }, { width: "100vw", height: "42vh", ease: "power2.inOut", duration: 1 })
          .to(frame, { height: "100vh", ease: "power2.inOut", duration: 1 })
          .fromTo(img, { scale: 1.25 }, { scale: 1, ease: "none", duration: 2 }, 0)
          .fromTo(q(`.${styles.caption}`), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 1.5)
          .fromTo(q(`.${styles.veil}`), { opacity: 0.1 }, { opacity: 0.55, duration: 0.6 }, 1.4);
      });

      mm.add(MQ.reduced, () => {
        gsap.set(q(`.${styles.frame}`), { width: "100vw", height: "100vh" });
        gsap.set(q(`.${styles.caption}`), { autoAlpha: 1 });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className={styles.scene} aria-label="Cinematic frame">
      <div className={styles.frame}>
        <div className={styles.img}>
          <Photo photo={media.reveal} sizes="100vw" quality={80} />
        </div>
        <div className={styles.veil} />
        <div className={`${styles.caption}`}>
          <span className="meta-sm">03 &nbsp;—&nbsp; WHAT WE CAPTURE</span>
          <span className={`serif ${styles.captionBig}`}>Cinematic storytelling. Timeless memories.</span>
          <span className="meta-sm">{brand.positioning.join("  /  ")}</span>
        </div>
      </div>
    </section>
  );
}
