"use client";

import { useCallback, useRef, useState } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { testimonials, SITE_URL } from "@/content/site";
import { galleries } from "@/content/media";
import Photo from "@/components/ui/Photo";
import styles from "./Testimonials.module.css";

/**
 * Cinematic testimonial viewer — one real testimonial at a time, verbatim.
 * Background: the couple's own gallery where one exists; otherwise a quiet
 * dark stage (no borrowed photographs).
 */
export default function Testimonials() {
  const root = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [busy, setBusy] = useState(false);
  const total = testimonials.length;
  const t = testimonials[index];
  const [first, ...rest] = t.paragraphs;

  const go = useCallback(
    (dir: 1 | -1) => {
      if (busy) return;
      const next = (index + dir + total) % total;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const q = quoteRef.current;
      if (!q || reduced) {
        setIndex(next);
        setExpanded(false);
        return;
      }
      setBusy(true);
      gsap.to(q, {
        autoAlpha: 0,
        x: dir * -48,
        duration: 0.55,
        ease: "power3.in",
        onComplete: () => {
          setIndex(next);
          setExpanded(false);
          gsap.fromTo(q, { autoAlpha: 0, x: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 1.1, ease: "expo.out", onComplete: () => setBusy(false) });
        },
      });
    },
    [busy, index, total]
  );

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
      });
      mm.add(MQ.reduced, () => gsap.set(q(".line > span"), { yPercent: 0 }));
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="testimonials"
      className={styles.wrap}
      aria-labelledby="testimonials-title"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
    >
      {/* Backgrounds — slow crossfade */}
      <div className={styles.bgs} aria-hidden="true">
        {testimonials.map((item, i) =>
          item.gallerySlug ? (
            <div className={`${styles.bg} ${i === index ? styles.bgOn : ""}`} key={item.couple}>
              <Photo photo={galleries[item.gallerySlug][1]} sizes="100vw" quality={70} />
            </div>
          ) : null
        )}
        <div className={styles.bgVeil} />
      </div>

      <div className={`container ${styles.inner}`}>
        <div className={styles.head}>
          <p className="meta-sm" data-reveal>
            07 &nbsp;—&nbsp; TESTIMONIALS
          </p>
          <h2 id="testimonials-title" className={`serif ${styles.title}`}>
            {["REAL EMOTIONS.", "REAL STORIES.", "REAL WORDS."].map((l, i) => (
              <span className="line" key={l}>
                <span className={i === 2 ? styles.italic : undefined}>{l}</span>
              </span>
            ))}
          </h2>
        </div>

        <figure className={styles.viewer}>
          <span className={`serif ${styles.bigIndex}`} aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div ref={quoteRef} className={styles.quoteWrap}>
            <blockquote className={styles.quote}>
              <p className={`serif ${styles.q}`}>
                <span className={styles.mark} aria-hidden="true">
                  “
                </span>
                {first}
              </p>
              {rest.length > 0 && (
                <>
                  <div className={`${styles.more} ${expanded ? styles.moreOpen : ""}`} aria-hidden={!expanded}>
                    <div className={styles.moreInner}>
                      {rest.map((p, i) => (
                        <p key={i} className={styles.p}>
                          {p}
                        </p>
                      ))}
                    </div>
                  </div>
                  <button type="button" className={`meta-sm ${styles.toggle}`} onClick={() => setExpanded((v) => !v)} aria-expanded={expanded}>
                    {expanded ? "READ LESS" : "READ THE FULL NOTE"} <span aria-hidden="true">{expanded ? "−" : "+"}</span>
                  </button>
                </>
              )}
            </blockquote>
            <figcaption className={styles.caption}>
              <span className={`serif ${styles.couple}`}>{t.couple}</span>
              {t.gallerySlug && (
                <a className="meta-sm" href={`${SITE_URL}/${t.gallerySlug}`} target="_blank" rel="noopener noreferrer" data-cursor="VIEW">
                  VIEW THE GALLERY →
                </a>
              )}
              {t.link && (
                <a className="meta-sm" href={t.link} target="_blank" rel="noopener noreferrer" data-cursor="VIEW">
                  ON INSTAGRAM →
                </a>
              )}
            </figcaption>
          </div>

          <div className={styles.controls}>
            <button type="button" className={`meta-sm ${styles.navBtn}`} onClick={() => go(-1)} data-cursor="PREV" data-magnetic="">
              <span aria-hidden="true">←</span> PREVIOUS
            </button>
            <span className={`meta-sm ${styles.counter}`} aria-live="polite">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            <button type="button" className={`meta-sm ${styles.navBtn}`} onClick={() => go(1)} data-cursor="NEXT" data-magnetic="">
              NEXT <span aria-hidden="true">→</span>
            </button>
          </div>
        </figure>
      </div>
    </section>
  );
}
