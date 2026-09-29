"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { brand } from "@/content/site";
import styles from "./BrandStatement.module.css";

const STATEMENT = ["WE CAPTURE", "THE MOMENTS", "YOU FELT."];

const PHILOSOPHY = [brand.statements.cinematic, brand.statements.cultures, brand.statements.approach];

function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span className={styles.w} key={i}>
          {w}{" "}
        </span>
      ))}
    </>
  );
}

export default function BrandStatement() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        // Giant lines: masked rise + clip reveal, staggered on entry.
        gsap.fromTo(
          q(`.${styles.big} .line > span`),
          { yPercent: 110, clipPath: "inset(0 0 100% 0)" },
          {
            yPercent: 0,
            clipPath: "inset(0 0 0% 0)",
            duration: 1.6,
            ease: "expo.out",
            stagger: 0.16,
            scrollTrigger: { trigger: q(`.${styles.big}`)[0], start: "top 78%", once: true },
          }
        );

        // Philosophy: words brighten with the scroll (reads like a slow pan).
        q(`.${styles.p}`).forEach((p) => {
          gsap.fromTo(
            p.querySelectorAll(`.${styles.w}`),
            { opacity: 0.16 },
            {
              opacity: 1,
              stagger: 0.02,
              ease: "none",
              scrollTrigger: { trigger: p, start: "top 82%", end: "bottom 50%", scrub: 0.6 },
            }
          );
        });

        gsap.fromTo(
          q(`.${styles.rule}`),
          { scaleX: 0 },
          { scaleX: 1, duration: 1.6, ease: "power4.inOut", scrollTrigger: { trigger: q(`.${styles.rule}`)[0], start: "top 85%", once: true } }
        );
      });

      mm.add(MQ.reduced, () => {
        gsap.set(q(".line > span"), { yPercent: 0, clipPath: "none" });
        gsap.set(q(`.${styles.w}`), { opacity: 1 });
        gsap.set(q(`.${styles.rule}`), { scaleX: 1 });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className={`section ${styles.wrap}`} aria-labelledby="statement">
      <div className="container">
        <p className="meta-sm" data-reveal>
          02 &nbsp;—&nbsp; BRAND POSITIONING
        </p>
        <h2 id="statement" className={`serif ${styles.big}`}>
          {STATEMENT.map((l, i) => (
            <span className="line" key={i}>
              <span className={i === 2 ? styles.italic : undefined}>{l}</span>
            </span>
          ))}
        </h2>

        <div className={styles.rule} />

        <div className={styles.grid}>
          <div className={styles.aside} data-reveal>
            <span className="meta-sm">{brand.regions.join(" · ")}</span>
            <span className="meta-sm champagne">DOCUMENTARY &amp; EDITORIAL STYLE WEDDING PHOTOGRAPHY</span>
          </div>
          <div className={styles.body}>
            {PHILOSOPHY.map((t, i) => (
              <p className={`${styles.p} ${i === 2 ? "serif-i " + styles.pAccent : ""}`} key={i}>
                <Words text={t} />
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
