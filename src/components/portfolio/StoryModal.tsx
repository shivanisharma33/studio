"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getStoryGallery, storySlugs } from "@/content/stories";
import { portfolio } from "@/content/site";
import InquiryCta from "@/components/inquiry/InquiryCta";
import Arrow from "@/components/ui/Arrow";
import styles from "./StoryModal.module.css";

interface StoryModalProps {
  slug: string | null;
  onClose: () => void;
  onSelectStory?: (slug: string) => void;
}

export default function StoryModal({ slug, onClose, onSelectStory }: StoryModalProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const gallery = slug ? getStoryGallery(slug) : undefined;
  const portfolioItem = slug ? portfolio.find((p) => p.slug === slug) : undefined;

  const currentIndex = slug ? storySlugs.indexOf(slug) : -1;
  const prevSlug = currentIndex > 0 ? storySlugs[currentIndex - 1] : storySlugs[storySlugs.length - 1];
  const nextSlug = currentIndex < storySlugs.length - 1 ? storySlugs[currentIndex + 1] : storySlugs[0];

  useEffect(() => {
    if (!slug) return;
    const lenis = window.__lenis;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedPhoto) {
          setSelectedPhoto(null);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
      document.documentElement.style.overflow = "";
    };
  }, [slug, selectedPhoto, onClose]);

  if (!slug || !gallery) return null;

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true" aria-label={gallery.title}>
      {/* Top Header Bar */}
      <div className={styles.topBar}>
        <div className={styles.storyMeta}>
          <span className={styles.chapterBadge}>
            CHAPTER {portfolioItem?.n || String(currentIndex + 1).padStart(2, "0")} / {String(storySlugs.length).padStart(2, "0")}
          </span>
          <span className={styles.locationBadge}>{gallery.location.toUpperCase()}</span>
          <span className={styles.countBadge}>{gallery.images.length} FRAMES</span>
        </div>

        <div className={styles.topActions}>
          {onSelectStory && (
            <div className={styles.navArrows}>
              <button
                type="button"
                className={styles.arrowBtn}
                onClick={() => onSelectStory(prevSlug)}
                aria-label="Previous story"
                data-cursor="PREV"
              >
                ←
              </button>
              <button
                type="button"
                className={styles.arrowBtn}
                onClick={() => onSelectStory(nextSlug)}
                aria-label="Next story"
                data-cursor="NEXT"
              >
                →
              </button>
            </div>
          )}
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            data-cursor="CLOSE"
            aria-label="Close story viewer"
          >
            <span>CLOSE</span>
            <span aria-hidden="true">✕</span>
          </button>
        </div>
      </div>

      {/* Scrollable Gallery Content */}
      <div className={styles.scrollArea}>
        {/* Story Title Hero */}
        <div className={styles.storyHero}>
          <p className="meta-sm champagne">
            {gallery.category.toUpperCase()} CELEBRATION · STUDIO KUNAL
          </p>
          <h2 className={`serif ${styles.storyTitle}`}>{gallery.title}</h2>
          <p className={styles.storyLocation}>{gallery.location}</p>
        </div>

        {/* Gallery Grid */}
        <div className={styles.galleryGrid}>
          {gallery.images.map((url, i) => {
            const isVideo = url.endsWith(".mp4") || url.includes("video_proxies");
            const isWide = i === 0 || i % 7 === 0;

            return (
              <div
                key={url}
                className={`${styles.itemWrap} ${isWide ? styles.itemWide : ""}`}
                onClick={() => !isVideo && setSelectedPhoto(url)}
                data-cursor={isVideo ? undefined : "ZOOM"}
              >
                {isVideo ? (
                  <div className={styles.videoContainer}>
                    <video
                      src={url}
                      autoPlay
                      loop
                      muted
                      playsInline
                      controls
                      className={styles.videoPlayer}
                    />
                    <span className={styles.videoTag}>MOTION STILL</span>
                  </div>
                ) : (
                  <div className={styles.imgContainer}>
                    <Image
                      src={url}
                      alt={`${gallery.title} — photograph ${i + 1}`}
                      fill
                      sizes={isWide ? "100vw" : "(min-width: 1024px) 50vw, 100vw"}
                      quality={85}
                      className={styles.galleryImg}
                      loading={i < 4 ? "eager" : "lazy"}
                    />
                    <div className={styles.imgHoverOverlay}>
                      <span className={styles.zoomIcon}>+</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Story Footer & Next Story Invitation */}
        <div className={styles.modalFooter}>
          <div className={styles.footerInner}>
            <span className="meta-sm">YOUR STORY DESERVES TO BE DOCUMENTED</span>
            <h3 className={`serif ${styles.footerTitle}`}>Ready to preserve your celebration?</h3>
            <div className={styles.footerCtas}>
              <div onClick={onClose}>
                <InquiryCta source={`story-${slug}`} primary cursor="BEGIN">
                  CHECK YOUR DATE
                </InquiryCta>
              </div>
              {onSelectStory && (
                <button
                  type="button"
                  className={styles.nextStoryBtn}
                  onClick={() => onSelectStory(nextSlug)}
                  data-cursor="NEXT STORY"
                >
                  <span>EXPLORE NEXT STORY</span>
                  <Arrow />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Single Photo Zoom Lightbox */}
      {selectedPhoto && (
        <div
          className={styles.zoomBackdrop}
          onClick={() => setSelectedPhoto(null)}
          role="dialog"
          aria-label="Enlarged photo"
        >
          <button
            type="button"
            className={styles.zoomClose}
            onClick={() => setSelectedPhoto(null)}
            data-cursor="CLOSE"
          >
            ✕
          </button>
          <div className={styles.zoomContent} onClick={(e) => e.stopPropagation()}>
            <Image
              src={selectedPhoto}
              alt="Enlarged gallery frame"
              fill
              quality={95}
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
