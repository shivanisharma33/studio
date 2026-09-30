"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { brand, cta } from "@/content/site";
import { media } from "@/content/media";
import Photo from "@/components/ui/Photo";
import Arrow from "@/components/ui/Arrow";
import InquiryCta from "@/components/inquiry/InquiryCta";
import styles from "./FinalCta.module.css";

export default function FinalCta() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const content = q(`.${styles.content}`)[0];
        gsap.fromTo(
          q(`.${styles.media}`),
          { scale: 1.05 },
          { scale: 1, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } }
        );
        gsap.fromTo(
          q(`.${styles.title} .line > span`),
          { yPercent: 110 },
          { yPercent: 0, duration: 1.5, ease: "expo.out", stagger: 0.12, scrollTrigger: { trigger: content || el, start: "top 85%", once: true } }
        );
        gsap.fromTo(
          q("[data-cta-fade]"),
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 1.2, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: content || el, start: "top 85%", once: true } }
        );
      });
      mm.add(MQ.reduced, () => {
        gsap.set(q(".line > span"), { yPercent: 0 });
        gsap.set(q("[data-cta-fade]"), { autoAlpha: 1 });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className={styles.wrap} aria-labelledby="final-title" data-floating-cta-hide="">
      <div className={styles.media}>
        <Photo photo={media.finalCta} sizes="100vw" quality={85} style={{ objectPosition: "center 50%" }} />
      </div>
      <div className={styles.shade} />

      <div className={`container ${styles.content}`}>
        <span className={styles.eyebrow} data-cta-fade>
          15 &nbsp;—&nbsp; FINAL CINEMATIC CTA &nbsp;·&nbsp; {brand.regions.join("  ·  ")}
        </span>
        <h2 id="final-title" className={`serif ${styles.title}`}>
          <span className="line">
            <span>YOUR STORY DESERVES</span>
          </span>
          <span className="line">
            <span className={styles.italic}>TO BE REMEMBERED.</span>
          </span>
        </h2>

        <p className={styles.lead} data-cta-fade>
          With a cinematic approach and an eye for genuine moments, we transform real emotions into lasting memories — preserving every chapter of your celebration with timeless artistry across North America, India, and worldwide.
        </p>

        <div className={styles.row}>
          <div className={styles.meta} data-cta-fade>
            <span className={`meta-sm champagne`}>BOOKINGS OPEN 2026–2027</span>
            <span className="meta-sm">{brand.positioning.join("  ·  ")}</span>
            <span className="meta-sm">{brand.limitedDates.toUpperCase()}</span>
          </div>
          <div className={styles.ctas} data-cta-fade>
            <InquiryCta source="final" primary boxed cursor="BEGIN">
              LET’S CREATE SOMETHING TIMELESS
            </InquiryCta>
            <Link href="#portfolio" className="cta cta--secondary" data-cursor="EXPLORE" data-magnetic="">
              <span>{cta.seeOurMagic}</span>
              <Arrow />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
