"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useInquiry } from "@/components/inquiry/InquiryProvider";
import { track } from "@/lib/inquiry/analytics";
import styles from "./AnnouncementBar.module.css";

type Announcement = {
  id: string;
  statusTag: string;
  lead: string;
  detail: string;
  cta: string;
  ctaMobile?: string;
  action: { type: "inquiry"; source: string } | { type: "link"; href: string };
};

const ANNOUNCEMENTS: Announcement[] = [
  {
    id: "booking",
    statusTag: "CALENDAR 2026–2027",
    lead: "Bookings Open for 2026–2027",
    detail: "Limited prime dates remaining across North America & India",
    cta: "Check Availability",
    ctaMobile: "Check Dates",
    action: { type: "inquiry", source: "announcement_calendar" },
  },
  {
    id: "destinations",
    statusTag: "GLOBAL PRESENCE",
    lead: "Now Documenting Worldwide",
    detail: "Toronto · Vancouver · New Delhi · Destinations",
    cta: "Check Your Date",
    ctaMobile: "Inquire",
    action: { type: "inquiry", source: "announcement_destinations" },
  },
  {
    id: "films",
    statusTag: "CINEMATIC FILMS",
    lead: "Timeless 4K Wedding Cinema",
    detail: "Authentic emotions & editorial visual storytelling",
    cta: "Explore Films",
    ctaMobile: "Explore",
    action: { type: "link", href: "#cinematic-films" },
  },
];

export default function AnnouncementBar() {
  const { open } = useInquiry();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const advance = useCallback(() => {
    setCurrentIndex((curr) => {
      setPreviousIndex(curr);
      return (curr + 1) % ANNOUNCEMENTS.length;
    });
  }, []);

  // Automatically cycle one by one without requiring user interaction
  useEffect(() => {
    timerRef.current = setInterval(advance, 3800);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [advance]);

  const handleAction = (announcement: Announcement) => {
    if (announcement.action.type === "inquiry") {
      track("announcement_cta_clicked");
      open(announcement.action.source);
    } else {
      const target = document.querySelector(announcement.action.href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const current = ANNOUNCEMENTS[currentIndex];

  return (
    <aside className={styles.bar} aria-label="Announcements">
      <div className={styles.inner}>
        {/* Left: Status with live breathing dot */}
        <div className={styles.status}>
          <span className={styles.pulseDot} aria-hidden="true" />
          <span className={styles.statusTag}>{current.statusTag}</span>
        </div>

        {/* Center: Automatic vertical ticker rolling one by one */}
        <div className={styles.ticker} aria-live="polite">
          {ANNOUNCEMENTS.map((item, i) => {
            const isActive = i === currentIndex;
            const isExit = i === previousIndex;
            const cls = [
              styles.slide,
              isActive && styles.active,
              isExit && styles.exit,
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <div
                key={item.id}
                className={cls}
                onClick={() => handleAction(item)}
                title="Click to explore"
              >
                <strong className={styles.messageHighlight}>{item.lead}</strong>
                <span className={styles.slideDivider}>{" \u2014 "}</span>
                <span className={styles.detail}>{item.detail}</span>
              </div>
            );
          })}
        </div>

        {/* Right: Interactive CTA pill */}
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.ctaPill}
            onClick={() => handleAction(current)}
            data-cursor="BEGIN"
            aria-label={`${current.lead} - ${current.cta}`}
          >
            <span className={styles.ctaDesktop}>{current.cta}</span>
            <span className={styles.ctaMobile}>{current.ctaMobile || current.cta}</span>
            <span className={styles.ctaArrow} aria-hidden="true">{"\u2192"}</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
