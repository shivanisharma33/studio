"use client";

import { useEffect, useState } from "react";
import { onIntroDone } from "@/lib/intro";
import { track } from "@/lib/inquiry/analytics";
import { GREETING } from "@/lib/inquiry/whatsapp";
import Arrow from "@/components/ui/Arrow";
import { useInquiry } from "./InquiryProvider";
import WhatsAppLink from "./WhatsAppLink";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import styles from "./FloatingInquire.module.css";

/**
 * Persistent "CHECK YOUR DATE" CTA with a WhatsApp companion.
 * In mobile view: CONSTANT and always visible (never invisible on scroll or in hero/footer).
 * On desktop: Appears once the hero has scrolled away and steps aside in contact zones.
 * Both hide while the inquiry modal is actively open.
 */
export default function FloatingInquire() {
  const { open, isOpen, hasProgress } = useInquiry();
  const [pastHero, setPastHero] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [ready, setReady] = useState(() => typeof window !== "undefined" && !!window.__skIntroDone);
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth <= 900);

  useEffect(() => {
    const off = onIntroDone(() => setReady(true));
    const timer = setTimeout(() => setReady(true), 1000);
    return () => {
      off?.();
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth <= 900);
    };
    onResize();
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

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

  // CONSTANT and always visible across all screens right from website load in Hero section.
  // Hides only while the inquiry modal is actively open or in explicit hide zones.
  const shown = !isOpen && !blocked;

  return (
    <div
      className={`${styles.wrap} ${shown ? styles.shown : ""}`}
      data-inquiry-open={isOpen ? "true" : "false"}
      aria-hidden={isOpen}
    >
      <WhatsAppLink text={GREETING} from="floating" className={styles.wa} tabIndex={shown ? 0 : -1} aria-label="Chat on WhatsApp">
        <WhatsAppIcon size={46} className={styles.waIcon} />
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
