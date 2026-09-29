"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { onIntroDone } from "@/lib/intro";
import { brand, cta } from "@/content/site";
import { media } from "@/content/media";
import Photo from "@/components/ui/Photo";
import Lines from "@/components/ui/Lines";
import Arrow from "@/components/ui/Arrow";
import styles from "./Hero.module.css";

const HEADLINE = ["FROM NORTH AMERICA", "TO INDIA,", "WE CAPTURE STORIES", "THAT LAST FOREVER."];

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Initial state (hidden until the curtain lifts)
      gsap.set(q(`.${styles.media}`), { autoAlpha: 0, scale: 1.08 });
      gsap.set(q(".line > span"), { yPercent: 115 });
      gsap.set(q("[data-hero-fade]"), { autoAlpha: 0, y: 18 });
      gsap.set(q(`.${styles.rule}`), { scaleX: 0 });

      const off = onIntroDone(() => {
        if (reduced) {
          gsap.set(q(`.${styles.media}`), { autoAlpha: 1, scale: 1 });
          gsap.set(q(".line > span"), { yPercent: 0 });
          gsap.set(q("[data-hero-fade]"), { autoAlpha: 1, y: 0 });
          gsap.set(q(`.${styles.rule}`), { scaleX: 1 });
          return;
        }
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.to(q(`.${styles.media}`), { autoAlpha: 1, duration: 2.2, ease: "power2.out" }, 0)
          .to(q(`.${styles.media}`), { scale: 1, duration: 3.2, ease: "power2.out" }, 0)
          .to(q(`.${styles.rule}`), { scaleX: 1, duration: 1.6, ease: "power4.inOut" }, 0.5)
          .to(q(`.${styles.headline} .line > span`), { yPercent: 0, duration: 1.5, stagger: 0.14 }, 0.7)
          .to(q("[data-hero-fade]"), { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.1 }, 1.5);
      });

      // Slow parallax + fade as the story scrolls on.
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.to(q(`.${styles.media}`), {
          yPercent: 18,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to(q(`.${styles.content}`), {
          yPercent: -12,
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "75% top", scrub: true },
        });
        gsap.to(q(`.${styles.scroll} .${styles.scrollArrow}`), {
          y: 8,
          repeat: -1,
          yoyo: true,
          duration: 1.1,
          ease: "sine.inOut",
        });
      });

      return () => {
        off();
        mm.revert();
      };
    },
    { scope: root }
  );

  return (
    <section ref={root} id="main" className={styles.hero} aria-label="Introduction">
      <div className={styles.media}>
        <Photo photo={media.hero} sizes="100vw" priority quality={82} />
        <div className={styles.shade} />
      </div>

      <div className={`container ${styles.content}`}>
        <div className={styles.top}>
          <span className="meta-sm" data-hero-fade>
            {brand.regions.join("  ·  ")}
          </span>
          <span className={`meta-sm ${styles.booking}`} data-hero-fade>
            {brand.booking.toUpperCase()}
          </span>
        </div>

        <div className={styles.rule} />

        <h1 className={`serif ${styles.headline}`}>
          <Lines lines={HEADLINE} />
        </h1>

        <div className={styles.bottom}>
          <p className={styles.support} data-hero-fade>
            {brand.statements.intro}
          </p>

          <div className={styles.meta} data-hero-fade>
            <ul className={styles.tags} aria-label="Style">
              {brand.positioning.map((t) => (
                <li key={t} className="meta-sm">
                  {t}
                </li>
              ))}
            </ul>
            <div className={styles.ctas}>
              <Link href="#portfolio" className="cta cta--primary" data-cursor="EXPLORE" data-magnetic="">
                <span>{cta.seeOurMagic}</span>
                <Arrow />
              </Link>
              <Link href="#get-in-touch" className="cta" data-cursor="EXPLORE" data-magnetic="">
                <span>{cta.letsConnect}</span>
                <Arrow />
              </Link>
            </div>
          </div>
        </div>

        <div className={`meta-sm ${styles.scroll}`} data-hero-fade aria-hidden="true">
          <span>SCROLL TO EXPLORE</span>
          <span className={styles.scrollArrow}>↓</span>
        </div>
      </div>
    </section>
  );
}
