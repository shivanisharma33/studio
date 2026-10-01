"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { onIntroDone } from "@/lib/intro";
import { media } from "@/content/media";
import Photo from "@/components/ui/Photo";
import Arrow from "@/components/ui/Arrow";
import InquiryCta from "@/components/inquiry/InquiryCta";
import styles from "./Hero.module.css";

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Initial state (hidden until the curtain lifts)
      gsap.set(q(`.${styles.media}`), { autoAlpha: 0, scale: 1.04 });
      gsap.set(q(".line > span"), { yPercent: 115 });
      gsap.set(q("[data-hero-fade]"), { autoAlpha: 0, y: 18 });

      const off = onIntroDone(() => {
        if (reduced) {
          gsap.set(q(`.${styles.media}`), { autoAlpha: 1, scale: 1 });
          gsap.set(q(".line > span"), { yPercent: 0 });
          gsap.set(q("[data-hero-fade]"), { autoAlpha: 1, y: 0 });
          return;
        }
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.to(q(`.${styles.media}`), { autoAlpha: 1, duration: 2.2, ease: "power2.out" }, 0)
          .to(q(`.${styles.media}`), { scale: 1, duration: 3.2, ease: "power2.out" }, 0)
          .to(q(`.${styles.eyebrow}`), { autoAlpha: 1, y: 0, duration: 1.2 }, 0.4)
          .to(q(`.${styles.headline} .line > span`), { yPercent: 0, duration: 1.5, stagger: 0.14 }, 0.5)
          .to(q("[data-hero-fade]"), { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.1 }, 1.2);
      });

      // Slow parallax + fade as the story scrolls on.
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.to(q(`.${styles.media}`), {
          yPercent: 8,
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
        <Photo
          photo={media.hero}
          sizes="100vw"
          priority
          quality={90}
          style={{ objectFit: "cover", objectPosition: "70% 48%" }}
        />
        <div className={styles.shade} />
      </div>

      <div className={`container ${styles.content}`}>
        <div className={styles.eyebrow} data-hero-fade>
          <span className={styles.eyebrowLine} aria-hidden="true" />
          <span className={styles.eyebrowText}>FROM NORTH AMERICA TO INDIA</span>
        </div>

        <h1 className={`serif ${styles.headline}`}>
          <span className="line">
            <span className={styles.headlineRow}>WE CAPTURE</span>
          </span>
          <span className="line">
            <span className={styles.headlineRow}>STORIES THAT</span>
          </span>
          <span className="line">
            <span className={`${styles.headlineRow} ${styles.headlineGold}`}>LAST FOREVER.</span>
          </span>
        </h1>

        <div className={styles.bottom}>
          <p className={styles.support} data-hero-fade>
            Studio Kunal Photography is an international photography company dedicated to capturing timeless stories with authenticity and emotion.
          </p>

          <div className={styles.ctas} data-hero-fade>
            <InquiryCta source="hero" primary boxed cursor="BEGIN" className={styles.primaryBtn}>
              GET IN TOUCH
            </InquiryCta>
            <Link href="#portfolio" className={styles.secondaryBtn} data-cursor="EXPLORE">
              <span>EXPLORE PORTFOLIO</span>
              <Arrow />
            </Link>
          </div>
        </div>

        <div className={styles.scroll} data-hero-fade aria-hidden="true">
          <span className={styles.scrollText}>SCROLL TO EXPLORE</span>
          <span className={styles.scrollDivider}>|</span>
          <span className={styles.scrollArrow}>↓</span>
        </div>
      </div>
    </section>
  );
}
