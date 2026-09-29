"use client";

import { useEffect, useState } from "react";
import { onIntroDone } from "@/lib/intro";
import { track } from "@/lib/inquiry/analytics";
import { GREETING } from "@/lib/inquiry/whatsapp";
import Arrow from "@/components/ui/Arrow";
import { useInquiry } from "./InquiryProvider";
import WhatsAppLink from "./WhatsAppLink";
import styles from "./FloatingInquire.module.css";

/**
 * Persistent, quiet "CHECK YOUR DATE" CTA with a smaller WhatsApp companion.
 * Appears once the hero has scrolled away, hides while the inquiry is open, and
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
      <WhatsAppLink text={GREETING} from="floating" className={styles.wa} tabIndex={shown ? 0 : -1} aria-label="Chat on WhatsApp">
        <svg className={styles.waIcon} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3.2a8.8 8.8 0 0 0-7.6 13.2L3.2 20.8l4.5-1.2A8.8 8.8 0 1 0 12 3.2Z" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
          <path d="M9.1 7.9c.2-.4.4-.4.7-.4h.5c.2 0 .4 0 .5.4l.7 1.6c.1.2 0 .4-.1.6l-.5.6c-.1.1-.2.3 0 .5.6 1 1.4 1.8 2.4 2.3.2.1.4.1.5 0l.6-.7c.2-.2.4-.2.6-.1l1.5.7c.2.1.4.2.4.4 0 .5-.1 1.1-.6 1.5-.5.4-1.3.6-2.1.4-1.7-.4-3.8-2-4.8-3.8-.7-1.2-.9-2.4-.6-3.1.1-.2.3-.4.3-.5Z" fill="currentColor" />
        </svg>
        <span className={styles.waText}>CHAT ON WHATSAPP</span>
        <span className={styles.waText}>
          <Arrow />
        </span>
      </WhatsAppLink>
      <a
        href="#get-in-touch"
        className={styles.btn}
        tabIndex={shown ? 0 : -1}
        aria-haspopup="dialog"
        data-inquiry=""
        data-cursor="BEGIN"
        onClick={(e) => {
          e.preventDefault();
          track("sticky_cta_clicked");
          open("sticky");
        }}
      >
        <span className={styles.dot} aria-hidden="true" />
        <span>{hasProgress ? "CONTINUE YOUR INQUIRY" : "CHECK YOUR DATE"}</span>
        <Arrow />
      </a>
    </div>
  );
}
