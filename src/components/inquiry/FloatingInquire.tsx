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

  // In mobile view: CONSTANT and always visible (including in hero section from the start).
  // On desktop: Appears once hero is scrolled away and steps aside in contact zones.
  // Both hide only while the inquiry modal is actively open.
  const shown = !isOpen && (isMobile ? true : (ready && pastHero && !blocked));

  return (
    <div
      className={`${styles.wrap} ${shown ? styles.shown : ""}`}
      data-inquiry-open={isOpen ? "true" : "false"}
      aria-hidden={isOpen}
    >
      <WhatsAppLink text={GREETING} from="floating" className={styles.wa} tabIndex={shown ? 0 : -1} aria-label="Chat on WhatsApp">
        <svg className={styles.waIcon} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
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
