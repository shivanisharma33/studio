"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { contact } from "@/content/site";
import { steps } from "@/content/inquiry";
import Arrow from "@/components/ui/Arrow";
import InquiryCta from "@/components/inquiry/InquiryCta";
import { useInquiry } from "@/components/inquiry/InquiryProvider";
import styles from "./Contact.module.css";

export default function Contact() {
  const root = useRef<HTMLElement>(null);
  const { hasProgress } = useInquiry();

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
          { yPercent: 0, duration: 1.5, ease: "expo.out", stagger: 0.12, scrollTrigger: { trigger: q(`.${styles.title}`)[0], start: "top 80%", once: true } }
        );
        gsap.fromTo(
          q(`.${styles.chapter}`),
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 1.2, ease: "expo.out", stagger: 0.06, scrollTrigger: { trigger: q(`.${styles.launch}`)[0], start: "top 80%", once: true } }
        );
      });
      mm.add(MQ.reduced, () => {
        gsap.set(q(".line > span"), { yPercent: 0 });
        gsap.set(q(`.${styles.chapter}`), { autoAlpha: 1 });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="get-in-touch" className={`section ${styles.wrap}`} aria-labelledby="contact-title" data-floating-cta-hide="">
      <div className="container">
        <p className="meta-sm" data-reveal>
          10 &nbsp;—&nbsp; GET IN TOUCH
        </p>
        <h2 id="contact-title" className={`serif ${styles.title}`}>
          <span className="line">
            <span>WE’RE SO GLAD</span>
          </span>
          <span className="line">
            <span className={styles.italic}>YOU FOUND US.</span>
          </span>
        </h2>

        <div className={styles.grid}>
          <div className={styles.aside}>
            <p className={styles.intro} data-reveal>
              {contact.intro}
            </p>
            <p className={styles.intro} data-reveal style={{ ["--d" as string]: "0.08s" }}>
              {contact.intro2}
            </p>

            <div className={styles.direct} data-reveal style={{ ["--d" as string]: "0.16s" }}>
              <span className="meta-sm">OR — EMAIL US AT</span>
              <a href={`mailto:${contact.email}`} className={`serif ${styles.email}`} data-cursor="EXPLORE">
                {contact.email}
              </a>
              <ul className={styles.social}>
                <li>
                  <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className="cta" data-cursor="EXPLORE">
                    <span>INSTAGRAM</span>
                    <Arrow />
                  </a>
                </li>
                <li>
                  <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className="cta" data-cursor="EXPLORE">
                    <span>WHATSAPP</span>
                    <Arrow />
                  </a>
                </li>
                <li>
                  <a href={contact.youtube} target="_blank" rel="noopener noreferrer" className="cta" data-cursor="EXPLORE">
                    <span>YOUTUBE</span>
                    <Arrow />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.launch}>
            <p className="meta-sm champagne" data-reveal>
              LET’S UNDERSTAND YOUR STORY.
            </p>
            <p className={`serif ${styles.launchTitle}`} data-reveal style={{ ["--d" as string]: "0.06s" }}>
              Tell us about your celebration — <em>one chapter at a time.</em>
            </p>
            <ol className={styles.chapters} aria-label="What we’ll ask">
              {steps.map((s, i) => (
                <li key={s.key} className={styles.chapter}>
                  <span className={`meta-sm ${styles.chapterNum}`}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={`meta-sm ${styles.chapterLabel}`}>{s.label}</span>
                </li>
              ))}
            </ol>
            <div className={styles.actions} data-reveal style={{ ["--d" as string]: "0.1s" }}>
              <InquiryCta source="contact" primary boxed cursor="BEGIN">
                {hasProgress ? "CONTINUE YOUR INQUIRY" : "BEGIN YOUR INQUIRY"}
              </InquiryCta>
              <span className="meta-sm">{steps.length} SHORT CHAPTERS · REVIEW EVERYTHING BEFORE YOU SEND</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
