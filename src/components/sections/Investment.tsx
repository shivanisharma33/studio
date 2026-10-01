"use client";

import { Fragment, useRef, useState, useEffect } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { investment } from "@/content/site";
import { media } from "@/content/media";
import Photo from "@/components/ui/Photo";
import InquiryCta from "@/components/inquiry/InquiryCta";
import Arrow from "@/components/ui/Arrow";
import styles from "./Investment.module.css";

function InvestmentLightbox({ id, onClose }: { id: string; onClose: () => void }) {
  useEffect(() => {
    const lenis = window.__lenis;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
      document.documentElement.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className={styles.lightbox} role="dialog" aria-modal="true" aria-label="Investment film viewer">
      <button type="button" className={`meta-sm ${styles.close}`} onClick={onClose} data-cursor="CLOSE">
        CLOSE <span aria-hidden="true">×</span>
      </button>
      <div className={styles.player}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&color=white`}
          title="Studio Kunal Photography — Investment film"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}

/** How a proposal takes shape — the factors the studio names on its Investment page. */
const CHAIN = ["YOUR CELEBRATION", "YOUR REQUIREMENTS", "YOUR LOCATION", "YOUR VISION", "YOUR STORY", "YOUR CUSTOM PROPOSAL"];

export default function Investment() {
  const root = useRef<HTMLElement>(null);
  const [playing, setPlaying] = useState(false);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        q(`.${styles.big}`).forEach((h) => {
          gsap.fromTo(
            h.querySelectorAll(".line > span"),
            { yPercent: 110 },
            { yPercent: 0, duration: 1.5, ease: "expo.out", stagger: 0.12, scrollTrigger: { trigger: h, start: "top 82%", once: true } }
          );
        });
        gsap.to(q(`.${styles.photoInner}`), {
          yPercent: 16,
          ease: "none",
          scrollTrigger: { trigger: q(`.${styles.photo}`)[0], start: "top bottom", end: "bottom top", scrub: true },
        });
        // Each part of the chain lights up in turn as it is read — ending on the proposal.
        gsap.fromTo(
          q(`.${styles.chainPart}`),
          { opacity: 0.16 },
          { opacity: 1, ease: "none", stagger: 0.5, scrollTrigger: { trigger: q(`.${styles.chain}`)[0], start: "top 80%", end: "bottom 50%", scrub: 0.6 } }
        );
      });
      mm.add(MQ.reduced, () => {
        gsap.set(q(".line > span"), { yPercent: 0 });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="investment" className={`section ${styles.wrap}`} aria-labelledby="investment-title">
      <div className="container">
        <p className="meta-sm" data-reveal>
          11 &nbsp;—&nbsp; INVESTMENT / CUSTOM EXPERIENCE
        </p>

        <div className={styles.grid}>
          <div className={styles.copy}>
            <h2 id="investment-title" className={`serif ${styles.big}`}>
              <span className="line">
                <span>EVERY STORY</span>
              </span>
              <span className="line">
                <span className={styles.italic}>IS DIFFERENT.</span>
              </span>
            </h2>

            <p className={styles.body} data-reveal>
              {investment.body}
            </p>

            <div className={styles.factors}>
              <span className="meta-sm">HOW YOUR PROPOSAL TAKES SHAPE</span>
              <p className={`serif ${styles.chain}`}>
                {CHAIN.map((c, i) => (
                  <Fragment key={c}>
                    {i > 0 && (
                      <span className={`${styles.chainPart} ${styles.chainArrow}`} aria-hidden="true">
                        →
                      </span>
                    )}{" "}
                    <span className={`${styles.chainPart} ${i === CHAIN.length - 1 ? styles.chainLast : ""}`}>{c}</span>{" "}
                  </Fragment>
                ))}
              </p>
            </div>

            <div className={styles.ctaRow} data-reveal>
              <InquiryCta source="investment" primary boxed>
                DISCUSS YOUR VISION
              </InquiryCta>
            </div>
          </div>

          <div className={styles.photo} data-reveal>
            <button
              type="button"
              className={styles.photoBtn}
              onClick={() => setPlaying(true)}
              data-cursor="PLAY FILM"
              aria-label="Play Harkeet & Nina — Fall in Love Again & Again"
            >
              <div className={styles.photoInner}>
                <Photo photo={media.investment} sizes="(min-width: 1024px) 26vw, 100vw" />
              </div>
              <div className={styles.playOverlay}>
                <span className={styles.playCircle}>
                  <span className={styles.playTriangle} />
                </span>
                <span className={`meta-sm ${styles.playLabel}`}>WATCH FILM</span>
              </div>
            </button>
            <span className={`meta-sm ${styles.photoCap}`}>HARKEET &amp; NINA · ESHOOT FILM</span>
          </div>
        </div>
      </div>

      {playing && investment.filmId && (
        <InvestmentLightbox id={investment.filmId} onClose={() => setPlaying(false)} />
      )}
    </section>
  );
}
