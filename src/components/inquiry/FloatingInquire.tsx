"use client";

import { useEffect, useState } from "react";
import { onIntroDone } from "@/lib/intro";
import Arrow from "@/components/ui/Arrow";
import { useInquiry } from "./InquiryProvider";
import styles from "./FloatingInquire.module.css";

/**
 * Persistent, quiet inquiry CTA. Appears once the hero has scrolled away and
 * steps aside wherever the page already has its own inquiry prompt
 * ([data-floating-cta-hide]: Get in touch, the final CTA, the footer).
 */
export default function FloatingInquire() {
  const { open, isOpen, hasProgress } = useInquiry();
  const [pastHero, setPastHero] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => onIntroDone(() => setReady(true)), []);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setPastHero(window.scrollY > window.innerHeight * 0.85);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const zones = document.querySelectorAll("[data-floating-cta-hide]");
    if (!zones.length) return;
    const visible = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
        setBlocked(visible.size > 0);
      },
      { rootMargin: "0px 0px -10% 0px" }
    );
    zones.forEach((z) => io.observe(z));
    return () => io.disconnect();
  }, []);

  const shown = ready && pastHero && !blocked && !isOpen;

  return (
    <div className={`${styles.wrap} ${shown ? styles.shown : ""}`} aria-hidden={!shown}>
      <a
        href="#get-in-touch"
        className={styles.btn}
        tabIndex={shown ? 0 : -1}
        aria-haspopup="dialog"
        data-inquiry=""
        data-cursor="INQUIRE"
        onClick={(e) => {
          e.preventDefault();
          open("floating");
        }}
      >
        <span className={styles.dot} aria-hidden="true" />
        <span className={styles.desktop}>{hasProgress ? "CONTINUE YOUR INQUIRY" : "INQUIRE"}</span>
        <span className={styles.mobile}>{hasProgress ? "CONTINUE YOUR INQUIRY" : "LET’S CONNECT"}</span>
        <Arrow />
      </a>
    </div>
  );
}
