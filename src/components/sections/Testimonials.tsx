"use client";

import { useCallback, useRef, useState } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { testimonials, SITE_URL } from "@/content/site";
import { galleries, home, type Photo as PhotoT } from "@/content/media";
import Photo from "@/components/ui/Photo";
import InquiryCta from "@/components/inquiry/InquiryCta";
import styles from "./Testimonials.module.css";

/** Curated photography pairings for each testimonial from the studio's real body of work */
const couplePhotos: PhotoT[] = [
  galleries["aman-mrinal"]?.[0] || home[3],
  galleries["deep-payal"]?.[0] || home[2],
  galleries["varinder-param-at-noor-mahal"]?.[0] || home[11],
  galleries["nooreen-jugraj"]?.[0] || home[13],
  galleries["akshita-rajat-a-lovestory-from-toronto-downtown"]?.[0] || home[7],
  galleries["raman-akash-love-straight-outta-panjab"]?.[0] || home[15],
  galleries["the-house-of-rituals-india"]?.[0] || home[16],
  galleries["the-fashion-vault"]?.[0] || home[18],
  galleries["aman-mrinal"]?.[1] || home[9],
];

export default function Testimonials() {
  const root = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [busy, setBusy] = useState(false);
  const total = testimonials.length;
  const t = testimonials[index];
  const [first, ...rest] = t.paragraphs;
  const currentPhoto = couplePhotos[index] || galleries[t.gallerySlug || ""]?.[0] || home[index % home.length];

  const transitionTo = useCallback(
    (next: number, dir: 1 | -1) => {
      if (busy) return;
      const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const card = cardRef.current;
      if (!card || reduced) {
        setIndex(next);
        setExpanded(false);
        return;
      }
      setBusy(true);
      gsap.to(card, {
        autoAlpha: 0,
        x: dir * -20,
        scale: 0.985,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setIndex(next);
          setExpanded(false);
          gsap.fromTo(
            card,
            { autoAlpha: 0, x: dir * 20, scale: 0.985 },
            {
              autoAlpha: 1,
              x: 0,
              scale: 1,
              duration: 0.55,
              ease: "expo.out",
              onComplete: () => setBusy(false),
            }
          );
        },
      });
    },
    [busy]
  );

  const go = useCallback(
    (dir: 1 | -1) => {
      const next = (index + dir + total) % total;
      transitionTo(next, dir);
    },
    [index, total, transitionTo]
  );

  const goTo = useCallback(
    (target: number) => {
      if (target === index) return;
      transitionTo(target, target > index ? 1 : -1);
    },
    [index, transitionTo]
  );

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          q(`.${styles.headerLine}`),
          { yPercent: 100, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.2,
            ease: "expo.out",
            scrollTrigger: { trigger: q(`.${styles.head}`)[0], start: "top 85%", once: true },
          }
        );
      });
      mm.add(MQ.reduced, () => gsap.set(q(`.${styles.headerLine}`), { yPercent: 0, opacity: 1 }));
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
      tabIndex={0}
      aria-label="Client Testimonials"
    >
      {/* Subtle ambient crossfade background */}
      <div className={styles.bgs} aria-hidden="true">
        {couplePhotos.map((photo, i) => (
          <div className={`${styles.bg} ${i === index ? styles.bgOn : ""}`} key={i}>
            <Photo photo={photo} sizes="100vw" quality={60} />
          </div>
        ))}
        <div className={styles.bgVeil} />
      </div>

      <div className={`container ${styles.inner}`}>
        {/* Balanced, aligned header */}
        <div className={styles.head}>
          <div className={styles.headLeft}>
            <p className="meta-sm" data-reveal>
              09 &nbsp;—&nbsp; TESTIMONIALS
            </p>
            <h2 id="testimonials-title" className={`serif ${styles.title}`}>
              <span className={styles.headerLine}>
                Real Emotions. Real Stories. <em className={styles.italic}>Real Words.</em>
              </span>
            </h2>
          </div>

          <div className={styles.ratingBadge}>
            <div className={styles.stars} aria-hidden="true">
              ★★★★★
            </div>
            <div className={styles.badgeText}>
              <span className={styles.badgeScore}>5.0 STAR RATING</span>
              <span className={styles.badgeSub}>Across North America &amp; India</span>
            </div>
          </div>
        </div>

        {/* 2-Column Aligned Showcase Card */}
        <div className={styles.showcase}>
          <div ref={cardRef} className={styles.card}>
            {/* Left: Couple Portrait & Details */}
            <div className={styles.portraitCol}>
              <div className={styles.portraitFrame}>
                <Photo
                  photo={currentPhoto}
                  sizes="(min-width: 1024px) 410px, 100vw"
                  quality={85}
                  priority
                />
                <div className={styles.portraitOverlay} />
                <div className={styles.portraitInfo}>
                  <span className={`meta-sm ${styles.verifiedChip}`}>
                    <span className={styles.goldDot} /> VERIFIED WEDDING
                  </span>
                  <h3 className={`serif ${styles.coupleName}`}>{t.couple}</h3>
                  <div className={styles.linksRow}>
                    {t.gallerySlug && (
                      <a
                        className={`meta-sm ${styles.mediaLink}`}
                        href={`${SITE_URL}/${t.gallerySlug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="VIEW"
                      >
                        VIEW FULL GALLERY →
                      </a>
                    )}
                    {t.link && (
                      <a
                        className={`meta-sm ${styles.mediaLink}`}
                        href={t.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="VIEW"
                      >
                        ON INSTAGRAM →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Testimonial & Controls */}
            <div className={styles.narrativeCol}>
              <div className={styles.quoteTop}>
                <div className={styles.quoteHeaderRow}>
                  <span className={styles.quoteGlyph} aria-hidden="true">
                    “
                  </span>
                  <span className={`meta-sm ${styles.counter}`} aria-live="polite">
                    {String(index + 1).padStart(2, "0")}
                    <span className={styles.counterDivider}>/</span>
                    {String(total).padStart(2, "0")}
                  </span>
                </div>

                <blockquote className={styles.quoteBlock}>
                  <p className={`serif ${styles.quoteLead}`}>{first}</p>
                  {rest.length > 0 && (
                    <div
                      className={`${styles.accordion} ${expanded ? styles.accordionOpen : ""}`}
                      aria-hidden={!expanded}
                    >
                      <div className={styles.accordionInner}>
                        {rest.map((p, i) => (
                          <p key={i} className={styles.quoteBody}>
                            {p}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                  {rest.length > 0 && (
                    <button
                      type="button"
                      className={`meta-sm ${styles.expandBtn}`}
                      onClick={() => setExpanded((v) => !v)}
                      aria-expanded={expanded}
                    >
                      {expanded ? "READ LESS" : "READ FULL STORY"} <span aria-hidden="true">{expanded ? "−" : "+"}</span>
                    </button>
                  )}
                </blockquote>
              </div>

              {/* Integrated Navigation Footer */}
              <div className={styles.cardFooter}>
                <div className={styles.dotsTrack} aria-label="Select testimonial">
                  {testimonials.map((item, i) => (
                    <button
                      key={item.couple}
                      type="button"
                      className={`${styles.dotBtn} ${i === index ? styles.dotActive : ""}`}
                      onClick={() => goTo(i)}
                      aria-label={`Go to testimonial by ${item.couple}`}
                      title={item.couple}
                    >
                      <span className={styles.dotIndicator} />
                    </button>
                  ))}
                </div>

                <div className={styles.navActions}>
                  <button
                    type="button"
                    className={styles.circleBtn}
                    onClick={() => go(-1)}
                    aria-label="Previous testimonial"
                    data-cursor="PREV"
                    data-magnetic=""
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    className={styles.circleBtn}
                    onClick={() => go(1)}
                    aria-label="Next testimonial"
                    data-cursor="NEXT"
                    data-magnetic=""
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compact bottom invitation */}
        <div className={styles.readyBar} data-reveal>
          <p className={`serif ${styles.readyTitle}`}>
            Ready to craft your <em>own story?</em>
          </p>
          <InquiryCta source="testimonials" primary cursor="BEGIN">
            CHECK YOUR DATE
          </InquiryCta>
        </div>
      </div>
    </section>
  );
}
