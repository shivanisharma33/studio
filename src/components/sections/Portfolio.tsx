"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ, ScrollTrigger } from "@/lib/gsap";
import { portfolio, cta, SITE_URL, brand } from "@/content/site";
import { galleries } from "@/content/media";
import Photo from "@/components/ui/Photo";
import Cta from "@/components/ui/Cta";
import Arrow from "@/components/ui/Arrow";
import styles from "./Portfolio.module.css";

/**
 * "Our Work, Your Stories" — eight chapters, one per real gallery.
 * Desktop: pinned horizontal film-strip. Touch / narrow: vertical chapters.
 * Every VIEW STORY link opens the studio's actual gallery page.
 */
export default function Portfolio() {
  const root = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      const pin = pinRef.current;
      const track = trackRef.current;
      if (!el || !pin || !track) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      // Title reveal (all devices with motion)
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          q(`.${styles.title} .line > span`),
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 1.5,
            ease: "expo.out",
            stagger: 0.14,
            scrollTrigger: { trigger: q(`.${styles.title}`)[0], start: "top 80%", once: true },
          }
        );
      });

      // Horizontal choreography — desktop + motion only.
      mm.add(`${MQ.motion} and ${MQ.desktop}`, () => {
        const distance = () => track.scrollWidth - window.innerWidth;
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const n = Math.min(portfolio.length, Math.max(1, Math.round(self.progress * (portfolio.length - 1)) + 1));
              if (counterRef.current) counterRef.current.textContent = String(n).padStart(2, "0");
              if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`;
            },
          },
        });

        // Per-chapter parallax + typographic drift inside the strip.
        q(`.${styles.chapter}`).forEach((ch) => {
          const img = ch.querySelector(`.${styles.imgInner}`);
          const txt = ch.querySelector(`.${styles.text}`);
          const small = ch.querySelector(`.${styles.small}`);
          gsap.fromTo(
            img,
            { xPercent: -6, scale: 1.12 },
            {
              xPercent: 6,
              scale: 1,
              ease: "none",
              scrollTrigger: { containerAnimation: tween, trigger: ch, start: "left right", end: "right left", scrub: true },
            }
          );
          gsap.fromTo(
            txt,
            { x: 80 },
            { x: -40, ease: "none", scrollTrigger: { containerAnimation: tween, trigger: ch, start: "left right", end: "right left", scrub: true } }
          );
          if (small) {
            gsap.fromTo(
              small,
              { y: 60 },
              { y: -60, ease: "none", scrollTrigger: { containerAnimation: tween, trigger: ch, start: "left right", end: "right left", scrub: true } }
            );
          }
        });

        return () => ScrollTrigger.refresh();
      });

      // Vertical fallback reveal (tablet/mobile or reduced motion)
      mm.add(`(max-width: 1023px), ${MQ.reduced}`, () => {
        gsap.set(q(`.${styles.title} .line > span`), { yPercent: 0 });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="portfolio" className={styles.wrap} aria-labelledby="portfolio-title">
      <div className={`container ${styles.intro}`}>
        <p className="meta-sm" data-reveal>
          02 &nbsp;—&nbsp; PORTFOLIO
        </p>
        <h2 id="portfolio-title" className={`serif ${styles.title}`}>
          <span className="line">
            <span>OUR WORK,</span>
          </span>
          <span className="line">
            <span className={styles.titleItalic}>YOUR STORIES</span>
          </span>
        </h2>
        <p className={styles.lede} data-reveal>
          {brand.statements.cinematic}
        </p>
      </div>

      <div ref={pinRef} className={styles.pin}>
        <div ref={trackRef} className={styles.track}>
          {portfolio.map((p, i) => {
            const photos = galleries[p.slug];
            const flip = i % 2 === 1;
            return (
              <article className={`${styles.chapter} ${flip ? styles.flip : ""}`} key={p.slug}>
                <a
                  href={`${SITE_URL}/${p.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.img}
                  data-cursor="VIEW STORY"
                  aria-label={`${p.title} — view story`}
                >
                  <div className={styles.imgInner}>
                    <Photo photo={photos[0]} sizes="(min-width: 1024px) 58vw, 100vw" />
                  </div>
                  <div className={styles.shade} />
                </a>

                {photos[1] && (
                  <div className={styles.small} aria-hidden="true">
                    <Photo photo={photos[1]} sizes="(min-width: 1024px) 18vw, 40vw" />
                  </div>
                )}

                <div className={styles.text}>
                  <span className={`serif ${styles.num}`}>{p.n}</span>
                  <h3 className={`serif ${styles.name}`}>{p.title}</h3>
                  <div className={styles.metaRow}>
                    <span className="meta-sm">STUDIO KUNAL PHOTOGRAPHY</span>
                    <span className="meta-sm champagne">CHAPTER {p.n} / {String(portfolio.length).padStart(2, "0")}</span>
                  </div>
                  <a
                    href={`${SITE_URL}/${p.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cta"
                    data-cursor="VIEW STORY"
                    data-magnetic=""
                  >
                    <span>{cta.viewStory}</span>
                    <Arrow />
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        <div className={styles.progress} aria-hidden="true">
          <span className={`meta-sm ${styles.counter}`}>
            <span ref={counterRef}>01</span> / {String(portfolio.length).padStart(2, "0")}
          </span>
          <div className={styles.barTrack}>
            <div ref={barRef} className={styles.bar} />
          </div>
          <span className="meta-sm">SCROLL</span>
        </div>
      </div>

      <div className={`container ${styles.after}`} data-reveal>
        <span className="meta-sm">THE FULL PORTFOLIO</span>
        <Cta href={`${SITE_URL}/portfolio`} external cursor="EXPLORE" primary>
          {cta.viewFullStory}
        </Cta>
      </div>
    </section>
  );
}
