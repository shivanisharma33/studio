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
  home[0],
  home[3],
  home[9],
  home[11],
  home[13],
  home[15],
  home[16],
  home[18],
  home[19],
];

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

function PinIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

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
        x: dir * -18,
        scale: 0.99,
        duration: 0.28,
        ease: "power2.in",
        onComplete: () => {
          setIndex(next);
          setExpanded(false);
          gsap.fromTo(
            card,
            { autoAlpha: 0, x: dir * 18, scale: 0.99 },
            {
              autoAlpha: 1,
              x: 0,
              scale: 1,
              duration: 0.5,
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
      aria-label="Client Testimonials and Google Reviews"
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

        {/* Main Showcase Review Card */}
        <div className={styles.showcase}>
          <div ref={cardRef} className={styles.card}>
            {/* Left: Authentic Couple Photo & Story Attribution */}
            <div className={styles.portraitCol}>
              <div className={styles.portraitFrame}>
                <Photo
                  photo={currentPhoto}
                  sizes="(min-width: 1024px) 460px, 100vw"
                  quality={88}
                  priority
                />
                <div className={styles.portraitVignette} />
                <div className={styles.portraitMetaBar}>
                  <div className={styles.portraitLocation}>
                    <PinIcon />
                    <span>{t.location}</span>
                  </div>
                  <div className={styles.portraitEventPill}>{t.event}</div>
                </div>
              </div>
            </div>

            {/* Right: Authentic Client Review */}
            <div className={styles.narrativeCol}>
              {/* Review Verification Header */}
              <div className={styles.reviewHeader}>
                <div className={styles.sourceTagGroup}>
                  {t.source === "google" && (
                    <span className={`${styles.sourceBadge} ${styles.badgeGoogle}`}>
                      <GoogleIcon />
                      <span>{t.sourceLabel}</span>
                      <span className={styles.verifiedTick}>
                        <VerifiedCheck />
                      </span>
                    </span>
                  )}
                  {t.source === "instagram" && (
                    <span className={`${styles.sourceBadge} ${styles.badgeInstagram}`}>
                      <InstagramIcon />
                      <span>{t.sourceLabel}</span>
                      <span className={styles.verifiedTick}>
                        <VerifiedCheck />
                      </span>
                    </span>
                  )}
                  {t.source === "client" && (
                    <span className={`${styles.sourceBadge} ${styles.badgeClient}`}>
                      <span>{t.sourceLabel}</span>
                      <span className={styles.verifiedTick}>
                        <VerifiedCheck />
                      </span>
                    </span>
                  )}
                  <span className={styles.starsGold} aria-label="5 star rating">
                    ★★★★★
                  </span>
                </div>

                <div className={styles.counterBox} aria-live="polite">
                  <span className={styles.counterNum}>{String(index + 1).padStart(2, "0")}</span>
                  <span className={styles.counterSep}>/</span>
                  <span className={styles.counterTotal}>{String(total).padStart(2, "0")}</span>
                </div>
              </div>

              {/* Author / Couple Info */}
              <div className={styles.coupleHeader}>
                <h3 className={`serif ${styles.coupleHeading}`}>{t.couple}</h3>
                <p className={styles.coupleSub}>
                  {t.event} &nbsp;·&nbsp; {t.location}
                </p>
              </div>

              {/* Review Text Body */}
              <blockquote className={styles.quoteBlock}>
                <p className={styles.quoteLead}>“{first}”</p>
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
                    {expanded ? "READ LESS" : "READ FULL REVIEW"}{" "}
                    <span aria-hidden="true">{expanded ? "−" : "+"}</span>
                  </button>
                )}
              </blockquote>

              {/* Authentic Action Links & Navigation Row */}
              <div className={styles.bottomRow}>
                <div className={styles.proofLinks}>
                  {t.link && (
                    <a
                      className={styles.authenticLink}
                      href={t.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="VIEW"
                    >
                      <InstagramIcon />
                      <span>VIEW ON INSTAGRAM ↗</span>
                    </a>
                  )}
                  {t.gallerySlug && (
                    <a
                      className={styles.authenticLink}
                      href={`${SITE_URL}/${t.gallerySlug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="VIEW"
                    >
                      <span>VIEW WEDDING GALLERY ↗</span>
                    </a>
                  )}
                  <span className={styles.documentedPill}>
                    <VerifiedCheck /> Verified Story
                  </span>
                </div>

                {/* Dot Pagination Controls */}
                <div className={styles.dotsTrack} aria-label="Select review">
                  {testimonials.map((item, i) => (
                    <button
                      key={item.couple}
                      type="button"
                      className={`${styles.dotBtn} ${i === index ? styles.dotActive : ""}`}
                      onClick={() => goTo(i)}
                      aria-label={`Go to review by ${item.couple}`}
                      title={item.couple}
                    >
                      <span className={styles.dotIndicator} />
                    </button>
                  ))}
                </div>

                <div className={styles.navArrows}>
                  <button
                    type="button"
                    className={styles.circleBtn}
                    onClick={() => go(-1)}
                    aria-label="Previous review"
                    data-cursor="PREV"
                    data-magnetic=""
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    className={styles.circleBtn}
                    onClick={() => go(1)}
                    aria-label="Next review"
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
