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
        gsap.fromTo(
          q(`.${styles.media}`),
          { scale: 1.05 },
          { scale: 1, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top top", scrub: true } }
        );
        gsap.fromTo(
          q(`.${styles.title} .line > span`),
          { yPercent: 110 },
          { yPercent: 0, duration: 1.6, ease: "expo.out", stagger: 0.14, scrollTrigger: { trigger: el, start: "top 55%", once: true } }
        );
        gsap.fromTo(
          q("[data-cta-fade]"),
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 1.2, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: el, start: "top 45%", once: true } }
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
        <Photo photo={media.finalCta} sizes="100vw" quality={80} />
      </div>
      <div className={styles.shade} />

      <div className={`container ${styles.content}`}>
        <span className="meta-sm" data-cta-fade>
          {brand.regions.join("  ·  ")}
        </span>
        <h2 id="final-title" className={`serif ${styles.title}`}>
          {["YOUR STORY", "DESERVES", "TO BE REMEMBERED."].map((l, i) => (
            <span className="line" key={l}>
              <span className={i === 2 ? styles.italic : undefined}>{l}</span>
            </span>
          ))}
        </h2>

        <div className={styles.row}>
          <div className={styles.meta} data-cta-fade>
            <span className={`meta-sm champagne`}>BOOKINGS OPEN 2026–2027</span>
            <span className="meta-sm">{brand.positioning.join("  ·  ")}</span>
            <span className="meta-sm">{brand.limitedDates.toUpperCase()}</span>
          </div>
          <div className={styles.ctas} data-cta-fade>
            <InquiryCta source="final-cta" primary boxed>
              {cta.letsConnect}
            </InquiryCta>
            <Link href="#portfolio" className="cta" data-cursor="EXPLORE" data-magnetic="">
              <span>{cta.seeOurMagic}</span>
              <Arrow />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
