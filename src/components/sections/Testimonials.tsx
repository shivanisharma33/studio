"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { testimonials, SITE_URL } from "@/content/site";
import InquiryCta from "@/components/inquiry/InquiryCta";
import styles from "./Testimonials.module.css";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={styles.googleSvg}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function VerifiedCheck() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function QuoteMark() {
  return (
    <svg width="30" height="24" viewBox="0 0 38 30" fill="none" aria-hidden="true" className={styles.quoteSvg}>
      <path d="M0 30V18C0 8.064 6.72 2.112 16.32 0.192L17.76 4.032C11.52 5.76 8.16 9.6 7.68 15.12H15.84V30H0ZM22.08 30V18C22.08 8.064 28.8 2.112 38.4 0.192L39.84 4.032C33.6 5.76 30.24 9.6 29.76 15.12H37.92V30H22.08Z" fill="currentColor" />
    </svg>
  );
}

function getInitials(couple: string) {
  const parts = couple.split(/&|and/i).map((s) => s.trim());
  if (parts.length >= 2 && parts[0] && parts[1]) {
    return `${parts[0][0]}&${parts[1][0]}`;
  }
  return couple.slice(0, 2).toUpperCase();
}

export default function Testimonials() {
  const root = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [expandedMap, setExpandedMap] = useState<Record<number, boolean>>({});
  const total = testimonials.length;

  const nextSlide = useCallback(() => {
    setIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Automatic Slider — advances every 5 seconds unless hovered/touched
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const toggleExpanded = (i: number) => {
    setExpandedMap((prev) => ({ ...prev, [i]: !prev[i] }));
  };

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
        if (e.key === "ArrowRight") nextSlide();
        if (e.key === "ArrowLeft") prevSlide();
      }}
      tabIndex={0}
      aria-label="Client Testimonials and Google Reviews"
    >
      <div className={`container ${styles.inner}`}>
        {/* Section Header with authentic Google Review trust badge */}
        <div className={styles.head}>
          <div className={styles.headLeft}>
            <p className="meta-sm" data-reveal>
              09 &nbsp;—&nbsp; TESTIMONIALS &amp; CLIENT STORIES
            </p>
            <h2 id="testimonials-title" className={`serif ${styles.title}`}>
              <span className={styles.headerLine}>
                Real Emotions. Real Stories. <em className={styles.italic}>Real Words.</em>
              </span>
            </h2>
          </div>

          {/* Authentic Google Reviews Trust Badge */}
          <div className={styles.googleTrustCard}>
            <div className={styles.googleIconBox}>
              <GoogleIcon />
            </div>
            <div className={styles.googleTrustInfo}>
              <div className={styles.googleTopRow}>
                <span className={styles.googleRatingVal}>5.0</span>
                <span className={styles.googleStars} aria-label="5 out of 5 stars">
                  ★★★★★
                </span>
                <span className={styles.googleReviewsCount}>40+ Reviews</span>
              </div>
              <span className={styles.googleTrustSub}>
                Verified Client Reviews · Canada &amp; India
              </span>
            </div>
          </div>
        </div>

        {/* Automatic 3-Card Slider Viewport */}
        <div
          className={styles.sliderViewport}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <div
            className={styles.sliderTrack}
            style={{ "--active-index": index } as React.CSSProperties}
          >
            {testimonials.map((t, i) => {
              const [first, ...rest] = t.paragraphs;
              const isExpanded = !!expandedMap[i];

              return (
                <div key={t.couple + i} className={styles.cardItem}>
                  {/* Card Header: Avatar & Source Badge */}
                  <div className={styles.cardHeader}>
                    <div className={styles.authorBadge}>
                      <div className={styles.avatarCircle}>
                        <span>{getInitials(t.couple)}</span>
                      </div>
                      <div className={styles.authorMeta}>
                        <h3 className={`serif ${styles.coupleHeading}`}>{t.couple}</h3>
                        <p className={styles.coupleSub}>
                          {t.event} &nbsp;·&nbsp; {t.location}
                        </p>
                      </div>
                    </div>

                    <div className={styles.sourceGroup}>
                      {t.source === "google" && (
                        <span className={`${styles.sourceBadge} ${styles.badgeGoogle}`}>
                          <GoogleIcon />
                          <span>Google</span>
                          <span className={styles.verifiedTick}>
                            <VerifiedCheck />
                          </span>
                        </span>
                      )}
                      {t.source === "instagram" && (
                        <span className={`${styles.sourceBadge} ${styles.badgeInstagram}`}>
                          <InstagramIcon />
                          <span>Instagram</span>
                          <span className={styles.verifiedTick}>
                            <VerifiedCheck />
                          </span>
                        </span>
                      )}
                      {t.source === "client" && (
                        <span className={`${styles.sourceBadge} ${styles.badgeClient}`}>
                          <span>Verified</span>
                          <span className={styles.verifiedTick}>
                            <VerifiedCheck />
                          </span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Rating Stars & Quote */}
                  <div className={styles.cardBody}>
                    <div className={styles.starsRow}>
                      <span className={styles.starsGold} aria-label="5 star rating">
                        ★★★★★
                      </span>
                      <QuoteMark />
                    </div>

                    <blockquote className={styles.quoteBlock}>
                      <p className={styles.quoteLead}>“{first}”</p>

                      {rest.length > 0 && (
                        <div
                          className={`${styles.accordion} ${isExpanded ? styles.accordionOpen : ""}`}
                          aria-hidden={!isExpanded}
                        >
                          <div className={styles.accordionInner}>
                            {rest.map((p, pIdx) => (
                              <p key={pIdx} className={styles.quoteBody}>
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
                          onClick={() => toggleExpanded(i)}
                          aria-expanded={isExpanded}
                        >
                          {isExpanded ? "READ LESS" : "READ FULL REVIEW"}{" "}
                          <span aria-hidden="true">{isExpanded ? "−" : "+"}</span>
                        </button>
                      )}
                    </blockquote>
                  </div>

                  {/* Card Footer: Action Link & Verified Badge */}
                  <div className={styles.cardFooter}>
                    <span className={styles.documentedPill}>
                      <VerifiedCheck /> Verified Story
                    </span>

                    {t.link && (
                      <a
                        className={styles.authenticLink}
                        href={t.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="VIEW"
                      >
                        <InstagramIcon />
                        <span>INSTAGRAM ↗</span>
                      </a>
                    )}
                    {t.gallerySlug && !t.link && (
                      <a
                        className={styles.authenticLink}
                        href={`${SITE_URL}/${t.gallerySlug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="VIEW"
                      >
                        <span>GALLERY ↗</span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Controls & Pagination Bar */}
        <div className={styles.controlsRow}>
          <div className={styles.counterBox} aria-live="polite">
            <span className={styles.counterNum}>{String(index + 1).padStart(2, "0")}</span>
            <span className={styles.counterSep}>/</span>
            <span className={styles.counterTotal}>{String(total).padStart(2, "0")}</span>
            {isPaused && <span className={styles.pausePill}>PAUSED ON HOVER</span>}
          </div>

          {/* Indicator Dots */}
          <div className={styles.dotsTrack} aria-label="Select review slide">
            {testimonials.map((item, i) => (
              <button
                key={item.couple + i}
                type="button"
                className={`${styles.dotBtn} ${i === index ? styles.dotActive : ""}`}
                onClick={() => setIndex(i)}
                aria-label={`Go to review by ${item.couple}`}
                title={item.couple}
              >
                <span className={styles.dotIndicator} />
              </button>
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className={styles.navArrows}>
            <button
              type="button"
              className={styles.circleBtn}
              onClick={prevSlide}
              aria-label="Previous review"
              data-cursor="PREV"
              data-magnetic=""
            >
              ←
            </button>
            <button
              type="button"
              className={styles.circleBtn}
              onClick={nextSlide}
              aria-label="Next review"
              data-cursor="NEXT"
              data-magnetic=""
            >
              →
            </button>
          </div>
        </div>

        {/* Bottom invitation bar */}
        <div className={styles.readyBar} data-reveal>
          <div className={styles.readyLeft}>
            <p className={`serif ${styles.readyTitle}`}>
              Ready to craft your <em>own story?</em>
            </p>
            <p className={styles.readySub}>
              Dates for 2026–2027 are booking quickly across Canada and India.
            </p>
          </div>
          <InquiryCta source="testimonials" primary cursor="BEGIN">
            CHECK YOUR DATE
          </InquiryCta>
        </div>
      </div>
    </section>
  );
}
