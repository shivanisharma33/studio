"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import { onIntroDone } from "@/lib/intro";
import { brand, nav } from "@/content/site";
import InquiryCta from "@/components/inquiry/InquiryCta";
import AnnouncementBar from "@/components/ui/AnnouncementBar";
import styles from "./Navigation.module.css";

export default function Navigation() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Enter after the preloader lifts.
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      gsap.set(el, { autoAlpha: 0, y: -12 });
      const off = onIntroDone(() => {
        gsap.to(el, { autoAlpha: 1, y: 0, duration: 1.2, ease: "expo.out", delay: 0.35 });
      });
      return off;
    },
    { scope: root }
  );

  // Frost after leaving the hero; stay constantly visible on scroll.
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 40);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock scroll while the mobile menu is open.
  useEffect(() => {
    const lenis = window.__lenis;
    if (open) {
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.documentElement.style.overflow = "";
    }
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header
      ref={root}
      className={[
        styles.header,
        scrolled && styles.scrolled,
        open && styles.open,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <AnnouncementBar />
      <div className={styles.bar}>
        <Link href="#main" className={styles.brand} aria-label={`${brand.name} — back to top`} data-cursor="EXPLORE">
          <span className={`serif ${styles.brandTop}`}>{brand.wordmark[0]}</span>
          <span className={`meta-sm ${styles.brandSub}`}>{brand.wordmark[1]}</span>
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={styles.link} data-cursor="EXPLORE" data-magnetic="">
                  <span className={styles.label}>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.right}>
          <InquiryCta source="nav" primary boxed className={styles.connect} cursor="BEGIN">
            CHECK YOUR DATE
          </InquiryCta>
          <button
            type="button"
            className={styles.burger}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Mobile / tablet menu */}
      <div id="mobile-menu" className={styles.menu} aria-hidden={!open}>
        <ul>
          {nav.map((item, i) => (
            <li key={item.href} style={{ transitionDelay: open ? `${0.08 + i * 0.06}s` : "0s" }}>
              <Link href={item.href} onClick={() => setOpen(false)} className={styles.menuLink}>
                <span className={`serif ${styles.menuLabel}`}>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className={styles.menuFoot}>
          <span className="meta-sm">{brand.regions.join(" · ")}</span>
          <span className="meta-sm champagne">{brand.booking}</span>
        </div>
      </div>
    </header>
  );
}
