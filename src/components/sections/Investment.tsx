"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { investment, cta } from "@/content/site";
import { media } from "@/content/media";
import Photo from "@/components/ui/Photo";
import InquiryCta from "@/components/inquiry/InquiryCta";
import styles from "./Investment.module.css";

const FACTORS = ["NEEDS", "VISION", "EVENT DETAILS", "REQUIREMENTS", "LOCATION", "THE STORY YOU WANT US TO CAPTURE"];

export default function Investment() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        q(`.${styles.big}`).forEach((h) => {
          gsap.fromTo(
            h.querySelectorAll(".line > span"),
            { yPercent: 110 },
            { yPercent: 0, duration: 1.5, ease: "expo.out", stagger: 0.12, scrollTrigger: { trigger: h, start: "top 82%", once: true } }
          );
        });
        gsap.to(q(`.${styles.photoInner}`), {
          yPercent: 16,
          ease: "none",
          scrollTrigger: { trigger: q(`.${styles.photo}`)[0], start: "top bottom", end: "bottom top", scrub: true },
        });
        gsap.fromTo(
          q(`.${styles.factor}`),
          { autoAlpha: 0, x: -16 },
          { autoAlpha: 1, x: 0, duration: 1, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: q(`.${styles.factors}`)[0], start: "top 85%", once: true } }
        );
      });
      mm.add(MQ.reduced, () => {
        gsap.set(q(".line > span"), { yPercent: 0 });
        gsap.set(q(`.${styles.factor}`), { autoAlpha: 1 });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="investment" className={`section ${styles.wrap}`} aria-labelledby="investment-title">
      <div className="container">
        <p className="meta-sm" data-reveal>
          08 &nbsp;—&nbsp; INVESTMENT
        </p>

        <div className={styles.grid}>
          <div className={styles.copy}>
            <h2 id="investment-title" className={`serif ${styles.big}`}>
              <span className="line">
                <span>EVERY STORY</span>
              </span>
              <span className="line">
                <span className={styles.italic}>IS DIFFERENT.</span>
              </span>
            </h2>
            <p className={`serif ${styles.big} ${styles.bigSecond}`} aria-hidden="false">
              <span className="line">
                <span>EVERY CELEBRATION</span>
              </span>
              <span className="line">
                <span>DESERVES A</span>
              </span>
              <span className="line">
                <span className={styles.italic}>PERSONAL APPROACH.</span>
              </span>
            </p>

            <p className={styles.body} data-reveal>
              {investment.body}
            </p>

            <div className={styles.factors} aria-label="Each quote is curated around">
              <span className="meta-sm">EACH QUOTE IS CURATED AROUND</span>
              <ul>
                {FACTORS.map((f, i) => (
                  <li key={f} className={`${styles.factor}`}>
                    <span className={`meta-sm ${styles.factorNum}`}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={`serif ${styles.factorText}`}>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.ctaRow} data-reveal>
              <span className="meta-sm">NO FIXED PACKAGES — TELL US ABOUT YOUR CELEBRATION</span>
              <InquiryCta source="investment" primary>
                {cta.discussYourStory}
              </InquiryCta>
            </div>
          </div>

          <div className={styles.photo} data-reveal>
            <div className={styles.photoInner}>
              <Photo photo={media.investment} sizes="(min-width: 1024px) 38vw, 100vw" />
            </div>
            <span className={`meta-sm ${styles.photoCap}`}>NO FIXED PACKAGES — CUSTOMIZED PRICING</span>
          </div>
        </div>
      </div>
    </section>
  );
}
