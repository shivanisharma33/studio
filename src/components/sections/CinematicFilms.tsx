"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP, MQ } from "@/lib/gsap";
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
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards");
  const [category, setCategory] = useState<string>("all");
  const [playing, setPlaying] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const INITIAL_COUNT = 4;

  const toggleShowMore = () => {
    setShowAll((prev) => !prev);
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 120);
  };

  const featured = films[0];
  const featuredTitle = featured.title ? splitTitle(featured.title) : null;

  // Filter films based on selected category
  const filteredFilms = useMemo(() => {
    if (category === "all") return films;
    return films.filter((f) => {
      const raw = `${f.title || ""}`.toLowerCase();
      if (category === "ceremonies") {
        return raw.includes("mehndi") || raw.includes("sangeet") || raw.includes("haldi") || raw.includes("ceremony");
      }
      if (category === "eshoot") {
        return raw.includes("eshoot") || raw.includes("pre-wedding") || raw.includes("love story") || raw.includes("again & again");
      }
      if (category === "weddings") {
        return !raw.includes("eshoot") && !raw.includes("mehndi");
      }
      return true;
    });
  }, [films, category]);

  const displayedFilms = showAll ? filteredFilms : filteredFilms.slice(0, INITIAL_COUNT);

  const getFilmMeta = (f: Film, index: number) => {
    const t = f.title ? splitTitle(f.title) : null;
    const raw = `${f.title || ""} ${t?.sub || ""}`.toLowerCase();

    let badge = "WEDDING FILM";
    let locationTag = "CANADA";

    if (raw.includes("mehndi") || raw.includes("sangeet") || raw.includes("haldi") || raw.includes("ceremony")) {
      badge = raw.includes("mehndi") ? "MEHNDI CEREMONY" : "CEREMONY";
      locationTag = "TORONTO, ON";
    } else if (raw.includes("eshoot") || raw.includes("pre-wedding") || raw.includes("again & again") || raw.includes("love story")) {
      badge = "PRE-WEDDING E-SHOOT";
      locationTag = "TORONTO DOWNTOWN";
    } else if (raw.includes("hindu") || raw.includes("anand karaj")) {
      badge = raw.includes("hindu") ? "HINDU WEDDING" : "ANAND KARAJ";
      locationTag = "CANADA / DESTINATION";
    } else {
      badge = "CINEMATIC HIGHLIGHT";
      locationTag = "CANADA / DESTINATION";
    }

    const mainTitle = t ? t.main : `Film ${String(index + 1).padStart(2, "0")}`;
    const subTitle = t?.sub || "Studio Kunal Photography Canada";

    return { mainTitle, subTitle, badge, locationTag };
  };

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
              04 &nbsp;—&nbsp; CINEMATIC FILMS
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
              quality={95}
              priority
              style={{ objectFit: "cover" }}
            />
          </div>

          <div className={styles.bgVideoWrap} aria-hidden="true">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${featured.id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${featured.id}&playsinline=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&fs=0`}
              className={styles.bgIframe}
              title={featuredTitle ? featuredTitle.main : "Featured film preview"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              tabIndex={-1}
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

      {/* Film index — Cinema Cards & Editorial List with view toggle */}
      <div className="container">
        {/* Controls Bar: Categories & Layout Switcher */}
        <div className={styles.controlsBar} data-reveal>
          <div className={styles.controlsLeft}>
            <span className={`meta-sm ${styles.archiveLabel}`}>CINEMATIC ARCHIVE</span>
            <span className={styles.filmCountBadge}>
              <span className={styles.countDot} />
              {films.length} FILMS
            </span>
          </div>

          <div className={styles.filterTabs} role="tablist" aria-label="Filter films">
            <button
              type="button"
              className={`${styles.filterTab} ${category === "all" ? styles.filterTabActive : ""}`}
              onClick={() => {
                setCategory("all");
                setTimeout(() => ScrollTrigger.refresh(), 100);
              }}
              aria-selected={category === "all"}
            >
              ALL ({films.length})
            </button>
            <button
              type="button"
              className={`${styles.filterTab} ${category === "weddings" ? styles.filterTabActive : ""}`}
              onClick={() => {
                setCategory("weddings");
                setTimeout(() => ScrollTrigger.refresh(), 100);
              }}
              aria-selected={category === "weddings"}
            >
              WEDDINGS
            </button>
            <button
              type="button"
              className={`${styles.filterTab} ${category === "ceremonies" ? styles.filterTabActive : ""}`}
              onClick={() => {
                setCategory("ceremonies");
                setTimeout(() => ScrollTrigger.refresh(), 100);
              }}
              aria-selected={category === "ceremonies"}
            >
              CEREMONIES
            </button>
            <button
              type="button"
              className={`${styles.filterTab} ${category === "eshoot" ? styles.filterTabActive : ""}`}
              onClick={() => {
                setCategory("eshoot");
                setTimeout(() => ScrollTrigger.refresh(), 100);
              }}
              aria-selected={category === "eshoot"}
            >
              PRE-WEDDING
            </button>
          </div>

          <div className={styles.viewSwitcher} role="group" aria-label="Layout mode">
            <button
              type="button"
              className={`${styles.switchBtn} ${viewMode === "cards" ? styles.switchBtnActive : ""}`}
              onClick={() => {
                setViewMode("cards");
                setTimeout(() => ScrollTrigger.refresh(), 100);
              }}
              aria-pressed={viewMode === "cards"}
              title="Show as Cinema Cards"
            >
              <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <rect x="1" y="1" width="6" height="6" rx="1.5" />
                <rect x="9" y="1" width="6" height="6" rx="1.5" />
                <rect x="1" y="9" width="6" height="6" rx="1.5" />
                <rect x="9" y="9" width="6" height="6" rx="1.5" />
              </svg>
              <span>CARDS</span>
            </button>
            <button
              type="button"
              className={`${styles.switchBtn} ${viewMode === "list" ? styles.switchBtnActive : ""}`}
              onClick={() => {
                setViewMode("list");
                setTimeout(() => ScrollTrigger.refresh(), 100);
              }}
              aria-pressed={viewMode === "list"}
              title="Show as Editorial List"
            >
              <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <rect x="1" y="2" width="14" height="2.5" rx="1" />
                <rect x="1" y="6.75" width="14" height="2.5" rx="1" />
                <rect x="1" y="11.5" width="14" height="2.5" rx="1" />
              </svg>
              <span>LIST</span>
            </button>
          </div>
        </div>

        {/* View Mode: Cinema Cards Grid */}
        {viewMode === "cards" ? (
          <div className={styles.gridWrap}>
            <ul className={styles.grid} aria-label="Cinematic Film Cards">
              {displayedFilms.map((f: Film, i: number) => {
                const originalIndex = films.findIndex((orig) => orig.id === f.id);
                const idx = originalIndex >= 0 ? originalIndex : i;
                const { mainTitle, subTitle, badge, locationTag } = getFilmMeta(f, idx);

                return (
                  <li key={f.id} data-reveal style={{ ["--d" as string]: `${(i % 4) * 0.08}s` }}>
                    <button
                      type="button"
                      className={styles.card}
                      onClick={() => setPlaying(f.id)}
                      data-cursor="PLAY"
                      aria-label={`Play film: ${mainTitle}`}
                    >
                      <div className={styles.cardMedia}>
                        <div className={styles.cardPoster}>
                          <Image
                            src={youtubePoster(f.id)}
                            alt={`${mainTitle} — film still`}
                            fill
                            sizes="(max-width: 900px) 100vw, (max-width: 1400px) 50vw, 700px"
                            quality={85}
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                        <div className={styles.cardShade} />

                        <div className={styles.cardTop}>
                          <span className={styles.cardNum}>FILM {String(idx + 1).padStart(2, "0")}</span>
                          <span className={styles.cardQuality}>
                            <span className={styles.recDot} />
                            4K CINEMA
                          </span>
                        </div>

                        <div className={styles.cardPlayWrap}>
                          <div className={styles.cardPlay}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                              <polygon points="5,3 19,12 5,21" />
                            </svg>
                          </div>
                          <span className={`meta-sm ${styles.cardPlayText}`}>WATCH FILM</span>
                        </div>
                      </div>

                      <div className={styles.cardInfo}>
                        <div className={styles.cardMetaRow}>
                          <span className={styles.cardTag}>{badge}</span>
                          <span className={styles.cardLocation}>{locationTag}</span>
                        </div>
                        <h3 className={`serif ${styles.cardTitle}`}>{mainTitle}</h3>
                        {subTitle && <p className={styles.cardSubtitle}>{subTitle}</p>}

                        <div className={styles.cardFooter}>
                          <div className={styles.cardSound} aria-hidden="true">
                            <span className={styles.cardSoundBar} />
                            <span className={styles.cardSoundBar} />
                            <span className={styles.cardSoundBar} />
                            <span className={styles.cardSoundBar} />
                          </div>
                          <span className={styles.cardWatch}>
                            <span>WATCH THE FILM</span> <Arrow />
                          </span>
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          /* View Mode: Elevated Editorial List */
          <ol className={styles.list} aria-label="All films list">
            {displayedFilms.map((f: Film, i: number) => {
              const originalIndex = films.findIndex((orig) => orig.id === f.id);
              const idx = originalIndex >= 0 ? originalIndex : i;
              const { mainTitle, subTitle, badge } = getFilmMeta(f, idx);

              return (
                <li key={f.id} data-reveal style={{ ["--d" as string]: `${(i % 4) * 0.06}s` }}>
                  <button type="button" className={styles.row} onClick={() => setPlaying(f.id)} data-cursor="PLAY">
                    <span className={`meta-sm ${styles.rowNum}`}>{String(idx + 1).padStart(2, "0")}</span>
                    <span className={styles.rowTitle}>
                      <span className={`serif ${styles.rowMain}`}>{mainTitle}</span>
                      <span className={styles.rowMetaLine}>
                        <span className={styles.rowBadge}>{badge}</span>
                        {subTitle && <span className={`meta-sm ${styles.rowSub}`}>{subTitle}</span>}
                      </span>
                    </span>
                    <span className={styles.rowThumb} aria-hidden="true">
                      <Image src={youtubePoster(f.id)} alt="" fill sizes="260px" style={{ objectFit: "cover" }} />
                      <span className={styles.rowThumbPlay}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="5,3 19,12 5,21" />
                        </svg>
                      </span>
                    </span>
                    <span className={`meta-sm ${styles.rowPlay}`}>
                      <span>{cta.watchTheFilm}</span> <Arrow />
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        )}

        {filteredFilms.length > INITIAL_COUNT && (
          <div className={styles.showMoreWrap}>
            <button
              type="button"
              className={styles.showMoreBtn}
              onClick={toggleShowMore}
              data-cursor={showAll ? "COLLAPSE" : "EXPAND"}
              aria-expanded={showAll}
            >
              <span className={styles.showMoreLine} />
              <span className={styles.showMorePill}>
                <span className={styles.showMoreIcon}>{showAll ? "−" : "+"}</span>
                <span>{showAll ? "SHOW LESS" : `SHOW MORE FILMS (${filteredFilms.length - INITIAL_COUNT} MORE)`}</span>
              </span>
              <span className={styles.showMoreLine} />
            </button>
          </div>
        )}

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
            <InquiryCta source="film" primary boxed cursor="BEGIN" className={styles.imagineBtn}>
              TELL US ABOUT YOUR STORY
            </InquiryCta>
          </div>
        </div>
      </div>

      {playing && <FilmLightbox id={playing} onClose={() => setPlaying(null)} />}
    </section>
  );
}
