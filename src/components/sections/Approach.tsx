"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { approach, approachTicker } from "@/content/site";
import { media } from "@/content/media";
import Photo from "@/components/ui/Photo";
import styles from "./Approach.module.css";

/**
 * Our approach — the brand's own three words, each paired with the brand's
 * own sentence. Editorial rows instead of service cards.
 */
export default function Approach() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        q(`.${styles.row}`).forEach((row) => {
          const img = row.querySelector(`.${styles.img}`);
          const inner = row.querySelector(`.${styles.imgInner}`);
          const title = row.querySelectorAll(".line > span");
          gsap.fromTo(
            img,
            { clipPath: "inset(0 0 100% 0)" },
            { clipPath: "inset(0 0 0% 0)", duration: 1.6, ease: "expo.inOut", scrollTrigger: { trigger: row, start: "top 75%", once: true } }
          );
          gsap.fromTo(
            inner,
            { scale: 1.2 },
            { scale: 1, duration: 2.2, ease: "expo.out", scrollTrigger: { trigger: row, start: "top 75%", once: true } }
          );
          gsap.fromTo(
            title,
            { yPercent: 110 },
            { yPercent: 0, duration: 1.4, ease: "expo.out", stagger: 0.12, scrollTrigger: { trigger: row, start: "top 75%", once: true } }
          );
          gsap.to(inner, {
            yPercent: 10,
            ease: "none",
            scrollTrigger: { trigger: row, start: "top bottom", end: "bottom top", scrub: true },
          });
        });
      });

      mm.add(MQ.reduced, () => {
        gsap.set(q(`.${styles.img}`), { clipPath: "none" });
        gsap.set(q(".line > span"), { yPercent: 0 });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className={`section ${styles.wrap}`} aria-labelledby="approach-title">
      <div className="container">
        <div className={styles.head}>
          <p className="meta-sm" data-reveal>
            06 &nbsp;—&nbsp; OUR APPROACH
          </p>
          <h2 id="approach-title" className={`serif-i ${styles.headTitle}`} data-reveal>
            Our approach will always inclined towards —
          </h2>
        </div>

        <div className={styles.rows}>
          {approach.map((a, i) => {
            const words = a.title.split(" ");
            return (
              <article className={`${styles.row} ${i % 2 === 1 ? styles.flip : ""}`} key={a.n}>
                <div className={styles.img}>
                  <div className={styles.imgInner}>
                    <Photo photo={media.approach[i]} sizes="(min-width: 1024px) 34vw, 100vw" />
                  </div>
                </div>
                <div className={styles.text}>
                  <span className={`meta-sm ${styles.num}`}>{a.n}</span>
                  <h3 className={`serif ${styles.title}`}>
                    {words.map((w, j) => (
                      <span className="line" key={j}>
                        <span className={j === words.length - 1 ? styles.italic : undefined}>{w}</span>
                      </span>
                    ))}
                  </h3>
                  <p className={styles.body} data-reveal>
                    {a.body}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className={styles.ticker} aria-hidden="true">
        <div className={styles.tickerTrack}>
          {[...approachTicker, ...approachTicker].map((t, i) => (
            <span className={`meta ${styles.tickerItem}`} key={i}>
              {t}
              <span className={styles.tickerDot}>·</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
