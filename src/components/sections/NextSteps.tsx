"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import InquiryCta from "@/components/inquiry/InquiryCta";
import Countdown from "@/components/ui/Countdown";
import styles from "./NextSteps.module.css";

/**
 * WHAT HAPPENS NEXT — the path from inquiry to booking. The supporting lines
 * come from the studio's own FAQ ("How to book", "Customised packages",
 * "Photography style"); no timelines or response times are promised.
 */
const STEPS = [
  {
    title: ["YOU SHARE", "YOUR STORY"],
    body: "Through the inquiry — your date, your place, your celebration and what matters most to you.",
  },
  {
    title: ["WE UNDERSTAND", "YOUR VISION"],
    body: "Our approach is centered around understanding your vision first.",
  },
  {
    title: ["WE DISCUSS YOUR DATE", "& REQUIREMENTS"],
    body: "We connect with you to discuss your requirements and guide you through the booking process.",
  },
  {
    title: ["WE CURATE A", "CUSTOM PROPOSAL"],
    body: "Once we understand your event details, we create a proposal that best fits your requirements.",
  },
  {
    title: ["WE MOVE FORWARD", "TOGETHER"],
    body: "Your vision with our artistic approach — memories that feel natural, timeless, and truly personal.",
  },
];

export default function NextSteps() {
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
          {
            yPercent: 0,
            duration: 1.5,
            ease: "expo.out",
            stagger: 0.12,
            scrollTrigger: { trigger: q(`.${styles.title}`)[0], start: "top 80%", once: true },
          },
        );
        // The hairline draws down the list as you read it.
        gsap.fromTo(
          q(`.${styles.spineFill}`),
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: q(`.${styles.list}`)[0], start: "top 70%", end: "bottom 60%", scrub: true },
          },
        );
        q(`.${styles.step}`).forEach((step) => {
          gsap.fromTo(
            step.querySelectorAll(".line > span"),
            { yPercent: 110 },
            { yPercent: 0, duration: 1.2, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: step, start: "top 82%", once: true } },
          );
          gsap.fromTo(
            step.querySelectorAll("[data-step-fade]"),
            { autoAlpha: 0, y: 16 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 1,
              ease: "expo.out",
              stagger: 0.06,
              scrollTrigger: { trigger: step, start: "top 80%", once: true },
            },
          );
          // The step nearest the middle of the screen is "now".
          gsap.timeline({
            scrollTrigger: { trigger: step, start: "top 60%", end: "bottom 40%", toggleClass: { targets: step, className: styles.active } },
          });
        });
      });
      mm.add(MQ.reduced, () => {
        gsap.set(q(".line > span"), { yPercent: 0 });
        gsap.set(q(`.${styles.spineFill}`), { scaleY: 1 });
        q(`.${styles.step}`).forEach((s) => s.classList.add(styles.active));
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="next-steps" className={`section ${styles.wrap}`} aria-labelledby="next-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.aside}>
          <p className="meta-sm" data-reveal>
            09 &nbsp;—&nbsp; THE PROCESS
          </p>
          <h2 id="next-title" className={`serif ${styles.title}`}>
            <span className="line">
              <span>WHAT HAPPENS</span>
            </span>
            <span className="line">
              <span className={styles.italic}>NEXT?</span>
            </span>
          </h2>
          <p className={styles.lede} data-reveal>
            Every celebration is unique — this is how we get to know yours.
          </p>
          <div className={styles.cta} data-reveal>
            <InquiryCta source="next-steps" primary boxed cursor="BEGIN">
              CHECK YOUR DATE
            </InquiryCta>
          </div>
          <Countdown />
        </div>

        <div className={styles.listWrap}>
          <span className={styles.spine} aria-hidden="true">
            <span className={styles.spineFill} />
          </span>
          <ol className={styles.list}>
            {STEPS.map((s, i) => (
              <li key={s.body} className={styles.step}>
                <span className={`serif ${styles.num}`} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className={styles.stepCopy}>
                  <h3 className={`serif ${styles.stepTitle}`}>
                    <span className="sr-only">Step {i + 1}: </span>
                    {s.title.map((l, j) => (
                      <span className="line" key={l}>
                        <span className={j === s.title.length - 1 ? styles.italic : undefined}>{l}</span>
                      </span>
                    ))}
                  </h3>
                  <p className={styles.stepBody} data-step-fade>
                    {s.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
