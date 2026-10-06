"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { testimonials, SITE_URL } from "@/content/site";
import InquiryCta from "@/components/inquiry/InquiryCta";
import styles from "./Testimonials.module.css";

function QuoteMark() {
  return (
    <svg width="22" height="18" viewBox="0 0 38 30" fill="none" aria-hidden="true" className={styles.quoteSvg}>
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

const CLONES_COUNT = 3;

interface TrackItem {
  testimonial: (typeof testimonials)[number];
  originalIndex: number;
  trackKey: string;
}

const TRACK_ITEMS: TrackItem[] = [
  ...testimonials.slice(-CLONES_COUNT).map((t, idx) => ({
    testimonial: t,
    originalIndex: testimonials.length - CLONES_COUNT + idx,
    trackKey: `pre-${t.couple}-${idx}`,
  })),
  ...testimonials.map((t, idx) => ({
    testimonial: t,
    originalIndex: idx,
    trackKey: `main-${t.couple}-${idx}`,
  })),
  ...testimonials.slice(0, CLONES_COUNT).map((t, idx) => ({
    testimonial: t,
    originalIndex: idx,
    trackKey: `post-${t.couple}-${idx}`,
  })),
];

export default function Testimonials() {
  const root = useRef<HTMLElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isSnapping, setIsSnapping] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [expandedMap, setExpandedMap] = useState<Record<number, boolean>>({});
  const total = testimonials.length;

  const displayIndex = ((activeSlide % total) + total) % total;

  const touchStartX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    if (isSnapping) return;
    setActiveSlide((prev) => prev + 1);
  }, [isSnapping]);

  const prevSlide = useCallback(() => {
    if (isSnapping) return;
    setActiveSlide((prev) => prev - 1);
  }, [isSnapping]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPaused(false);
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    touchStartX.current = null;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (activeSlide >= total) {
      setIsSnapping(true);
      setActiveSlide(0);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsSnapping(false);
        });
      });
    } else if (activeSlide < 0) {
      setIsSnapping(true);
      setActiveSlide(total - 1);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsSnapping(false);
        });
      });
    }
  };

  // Safety snap fallback in case transitionEnd doesn't fire
  useEffect(() => {
    if (activeSlide >= total || activeSlide < 0) {
      const timer = setTimeout(() => {
        setIsSnapping(true);
        setActiveSlide(activeSlide >= total ? 0 : total - 1);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsSnapping(false);
          });
        });
      }, 650);
      return () => clearTimeout(timer);
    }
  }, [activeSlide, total]);

  // Automatic Slider — advances every 5 seconds unless hovered/touched
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const toggleExpanded = (originalIdx: number) => {
    setExpandedMap((prev) => ({ ...prev, [originalIdx]: !prev[originalIdx] }));
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
      aria-label="Client Testimonials and Reviews"
    >
      <div className={`container ${styles.inner}`}>
        {/* Section Header */}
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
        </div>

        {/* Automatic 3-Card Slider Viewport */}
        <div
          className={styles.sliderViewport}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className={styles.sliderTrack}
            onTransitionEnd={handleTransitionEnd}
            style={{
              "--active-index": activeSlide + CLONES_COUNT,
              transition: isSnapping ? "none" : undefined,
            } as React.CSSProperties}
          >
            {TRACK_ITEMS.map(({ testimonial: t, originalIndex, trackKey }) => {
              const [first, ...rest] = t.paragraphs;
              const isExpanded = !!expandedMap[originalIndex];

              return (
                <div key={trackKey} className={styles.cardItem}>
                  {/* Card Header: Avatar & Couple Meta */}
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
                    <QuoteMark />
                  </div>

                  {/* Card Body: Quote Text */}
                  <div className={styles.cardBody}>
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
                          onClick={() => toggleExpanded(originalIndex)}
                          aria-expanded={isExpanded}
                        >
                          {isExpanded ? "READ LESS" : "READ FULL REVIEW"}{" "}
                          <span aria-hidden="true">{isExpanded ? "−" : "+"}</span>
                        </button>
                      )}
                    </blockquote>
                  </div>

                  {/* Card Footer: Action Link */}
                  {(t.link || t.gallerySlug) && (
                    <div className={styles.cardFooter}>
                      {t.link ? (
                        <a
                          className={styles.authenticLink}
                          href={t.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-cursor="VIEW"
                        >
                          INSTAGRAM ↗
                        </a>
                      ) : t.gallerySlug ? (
                        <a
                          className={styles.authenticLink}
                          href={`${SITE_URL}/${t.gallerySlug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-cursor="VIEW"
                        >
                          WEDDING GALLERY ↗
                        </a>
                      ) : null}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Controls & Pagination Bar */}
        <div className={styles.controlsRow}>
          <div className={styles.counterBox} aria-live="polite">
            <span className={styles.counterNum}>{String(displayIndex + 1).padStart(2, "0")}</span>
            <span className={styles.counterSep}>/</span>
            <span className={styles.counterTotal}>{String(total).padStart(2, "0")}</span>
          </div>

          {/* Indicator Dots */}
          <div className={styles.dotsTrack} aria-label="Select review slide">
            {testimonials.map((item, i) => (
              <button
                key={item.couple + i}
                type="button"
                className={`${styles.dotBtn} ${i === displayIndex ? styles.dotActive : ""}`}
                onClick={() => {
                  if (isSnapping) return;
                  setActiveSlide(i);
                }}
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
        <div className={styles.readyBar}>
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
