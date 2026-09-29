"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { splitTitle } from "@/lib/films";
import type { Film } from "@/content/site";
import { cta, contact } from "@/content/site";
import { youtubePoster } from "@/content/media";
import Arrow from "@/components/ui/Arrow";
import Cta from "@/components/ui/Cta";
import InquiryCta from "@/components/inquiry/InquiryCta";
import styles from "./CinematicFilms.module.css";

function FilmLightbox({ id, onClose }: { id: string; onClose: () => void }) {
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
    <div className={styles.lightbox} role="dialog" aria-modal="true" aria-label="Film viewer">
      <button type="button" className={`meta-sm ${styles.close}`} onClick={onClose} data-cursor="CLOSE">
        CLOSE <span aria-hidden="true">×</span>
      </button>
      <div className={styles.player}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&color=white`}
          title="Studio Kunal Photography — film"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}

export default function CinematicFilms({ films }: { films: Film[] }) {
  const root = useRef<HTMLElement>(null);
  const [playing, setPlaying] = useState<string | null>(null);
  const featured = films[0];
  const featuredTitle = featured.title ? splitTitle(featured.title) : null;

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
          { yPercent: 0, duration: 1.5, ease: "expo.out", stagger: 0.14, scrollTrigger: { trigger: q(`.${styles.title}`)[0], start: "top 80%", once: true } }
        );
        // Video reveal: the screen scales from a letterboxed slit into a full frame.
        gsap.fromTo(
          q(`.${styles.screen}`),
          { clipPath: "inset(38% 6% 38% 6%)", scale: 0.96 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: q(`.${styles.screen}`)[0], start: "top 90%", end: "top 30%", scrub: 0.6 },
          }
        );
        gsap.fromTo(
          q(`.${styles.poster}`),
          { scale: 1.15 },
          { scale: 1, ease: "none", scrollTrigger: { trigger: q(`.${styles.screen}`)[0], start: "top bottom", end: "bottom top", scrub: true } }
        );
        gsap.fromTo(
          q(`.${styles.imagineTitle} .line > span`),
          { yPercent: 110 },
          { yPercent: 0, duration: 1.5, ease: "expo.out", stagger: 0.14, scrollTrigger: { trigger: q(`.${styles.imagine}`)[0], start: "top 78%", once: true } }
        );
      });
      mm.add(MQ.reduced, () => {
        gsap.set(q(".line > span"), { yPercent: 0 });
        gsap.set(q(`.${styles.screen}`), { clipPath: "none", scale: 1 });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="cinematic-films" className={`section ${styles.wrap}`} aria-labelledby="films-title">
      <div className="container">
        <div className={styles.head}>
          <div>
            <p className="meta-sm" data-reveal>
              03 &nbsp;—&nbsp; CINEMATIC FILMS
            </p>
            <h2 id="films-title" className={`serif ${styles.title}`}>
              <span className="line">
                <span>CINEMATIC</span>
              </span>
              <span className="line">
                <span className={styles.italic}>FILMS</span>
              </span>
            </h2>
          </div>
          <p className={`serif-i ${styles.lede}`} data-reveal>
            Some memories should move.
          </p>
        </div>
      </div>

      {/* Featured film — full-bleed cinema screen */}
      <div className={styles.stage}>
        <button
          type="button"
          className={styles.screen}
          onClick={() => setPlaying(featured.id)}
          data-cursor="PLAY"
          aria-label={featuredTitle ? `Play film: ${featuredTitle.main}` : "Play film"}
        >
          <div className={styles.poster}>
            <Image
              src={youtubePoster(featured.id)}
              alt={featuredTitle ? `${featuredTitle.main} — film still` : "Studio Kunal Photography film still"}
              fill
              sizes="100vw"
              quality={80}
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className={styles.screenShade} />
          <span className={styles.play}>
            <span className={styles.playRing} />
            <span className={`meta-sm ${styles.playLabel}`}>
              {cta.playFilm} <Arrow />
            </span>
          </span>
          <span className={styles.caption}>
            <span className="meta-sm">FEATURED FILM</span>
            {featuredTitle ? (
              <>
                <span className={`serif ${styles.captionTitle}`}>{featuredTitle.main}</span>
                {featuredTitle.sub && <span className="meta-sm champagne">{featuredTitle.sub}</span>}
              </>
            ) : (
              <span className={`serif ${styles.captionTitle}`}>Film 01</span>
            )}
          </span>
        </button>
      </div>

      {/* Film index — the nine films embedded on the studio's Cinematic Films page */}
      <div className="container">
        <ol className={styles.list} aria-label="All films">
          {films.map((f, i) => {
            const t = f.title ? splitTitle(f.title) : null;
            return (
              <li key={f.id} data-reveal style={{ ["--d" as string]: `${(i % 4) * 0.06}s` }}>
                <button type="button" className={styles.row} onClick={() => setPlaying(f.id)} data-cursor="PLAY">
                  <span className={`meta-sm ${styles.rowNum}`}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={styles.rowTitle}>
                    <span className={`serif ${styles.rowMain}`}>{t ? t.main : `Film ${String(i + 1).padStart(2, "0")}`}</span>
                    {t?.sub && <span className={`meta-sm ${styles.rowSub}`}>{t.sub}</span>}
                  </span>
                  <span className={styles.rowThumb} aria-hidden="true">
                    <Image src={youtubePoster(f.id)} alt="" fill sizes="220px" style={{ objectFit: "cover" }} />
                  </span>
                  <span className={`meta-sm ${styles.rowPlay}`}>
                    <span>{cta.watchTheFilm}</span> <Arrow />
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className={styles.after} data-reveal>
          <span className="meta-sm">MORE FILMS ON THE STUDIO&apos;S CHANNEL</span>
          <div className={styles.afterCtas}>
            <Cta href={contact.youtube} external cursor="EXPLORE">
              YOUTUBE
            </Cta>
          </div>
        </div>

        {/* After the films — invite the visitor into their own */}
        <div className={styles.imagine}>
          <h3 className={`serif ${styles.imagineTitle}`}>
            <span className="line">
              <span>IMAGINE</span>
            </span>
            <span className="line">
              <span className={styles.imagineItalic}>YOUR STORY.</span>
            </span>
          </h3>
          <div className={styles.imagineCopy} data-reveal>
            <p>Every celebration has a rhythm, a feeling, a moment that deserves to be remembered.</p>
            <InquiryCta source="film" primary boxed cursor="BEGIN">
              TELL US ABOUT YOUR STORY
            </InquiryCta>
          </div>
        </div>
      </div>

      {playing && <FilmLightbox id={playing} onClose={() => setPlaying(null)} />}
    </section>
  );
}
