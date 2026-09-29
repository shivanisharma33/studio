"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ, ScrollTrigger } from "@/lib/gsap";
import { brand } from "@/content/site";
import { media } from "@/content/media";
import Photo from "@/components/ui/Photo";
import styles from "./GlobalPresence.module.css";

/**
 * North America ↔ India — an abstract line between the studio's two homes.
 * No map, no cities, no offices: only what the brand states.
 */
export default function GlobalPresence() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        gsap.fromTo(
          q(`.${styles.title} .line > span`),
          { yPercent: 110 },
          { yPercent: 0, duration: 1.5, ease: "expo.out", stagger: 0.14, scrollTrigger: { trigger: q(`.${styles.title}`)[0], start: "top 80%", once: true } }
        );

        const path = el.querySelector<SVGPathElement>(`.${styles.arc}`)!;
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: { trigger: q(`.${styles.map}`)[0], start: "top 75%", end: "bottom 45%", scrub: 0.8 },
        });

        // A single light travels the line — the journey itself.
        const dot = q(`.${styles.traveller}`)[0];
        ScrollTrigger.create({
          trigger: q(`.${styles.map}`)[0],
          start: "top 75%",
          end: "bottom 45%",
          scrub: 0.8,
          onUpdate: (self) => {
            const p = path.getPointAtLength(self.progress * len);
            dot.setAttribute("cx", String(p.x));
            dot.setAttribute("cy", String(p.y));
          },
        });

        gsap.fromTo(
          q(`.${styles.node}`),
          { scale: 0, transformOrigin: "center" },
          { scale: 1, duration: 1.2, ease: "expo.out", stagger: 0.5, scrollTrigger: { trigger: q(`.${styles.map}`)[0], start: "top 70%", once: true } }
        );

        gsap.fromTo(
          q(`.${styles.particle}`),
          { opacity: 0 },
          { opacity: 0.6, duration: 2, stagger: { each: 0.08, from: "random" }, scrollTrigger: { trigger: q(`.${styles.map}`)[0], start: "top 70%", once: true } }
        );

        gsap.to(q(`.${styles.photoInner}`), {
          yPercent: 14,
          ease: "none",
          scrollTrigger: { trigger: q(`.${styles.photo}`)[0], start: "top bottom", end: "bottom top", scrub: true },
        });
      });

      mm.add(MQ.reduced, () => {
        gsap.set(q(".line > span"), { yPercent: 0 });
        gsap.set(q(`.${styles.node}`), { scale: 1 });
        gsap.set(q(`.${styles.particle}`), { opacity: 0.5 });
      });
    },
    { scope: root }
  );

  // Deterministic faint particles (no randomness at render → no hydration mismatch)
  const particles = Array.from({ length: 28 }, (_, i) => ({
    x: 60 + ((i * 137) % 1080),
    y: 40 + ((i * 89) % 300),
    r: 0.8 + (i % 3) * 0.5,
  }));

  return (
    <section ref={root} className={`section ${styles.wrap}`} aria-labelledby="global-title">
      <div className="container">
        <p className="meta-sm" data-reveal>
          05 &nbsp;—&nbsp; {brand.regions.join(" & ")}
        </p>
        <h2 id="global-title" className={`serif ${styles.title}`}>
          <span className="line">
            <span>FROM NORTH AMERICA</span>
          </span>
          <span className="line">
            <span className={styles.italic}>TO INDIA.</span>
          </span>
        </h2>

        <div className={styles.map} aria-hidden="true">
          <svg viewBox="0 0 1200 380" className={styles.svg} preserveAspectRatio="none">
            {particles.map((p, i) => (
              <circle key={i} className={styles.particle} cx={p.x} cy={p.y} r={p.r} />
            ))}
            <path className={styles.arcGhost} d="M 120 300 C 380 40, 820 40, 1080 300" />
            <path className={styles.arc} d="M 120 300 C 380 40, 820 40, 1080 300" />
            <circle className={styles.node} cx="120" cy="300" r="5" />
            <circle className={styles.node} cx="1080" cy="300" r="5" />
            <circle className={styles.traveller} cx="120" cy="300" r="3.5" />
          </svg>
          <span className={`meta-sm ${styles.labelL}`}>NORTH AMERICA</span>
          <span className={`meta-sm ${styles.labelR}`}>INDIA</span>
        </div>

        <div className={styles.grid}>
          <div className={styles.copy}>
            <p className={styles.p} data-reveal>
              {brand.statements.reach}
            </p>
            <p className={`serif-i ${styles.pBig}`} data-reveal style={{ ["--d" as string]: "0.1s" }}>
              {brand.statements.cultures}
            </p>
          </div>
          <div className={styles.photo} data-reveal>
            <div className={styles.photoInner}>
              <Photo photo={media.global} sizes="(min-width: 1024px) 40vw, 100vw" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
