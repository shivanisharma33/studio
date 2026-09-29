"use client";

import { useEffect, useRef, useState } from "react";
import { onIntroDone } from "@/lib/intro";
import { track } from "@/lib/inquiry/analytics";
import Arrow from "@/components/ui/Arrow";
import { useInquiry } from "./InquiryProvider";
import styles from "./ExitIntent.module.css";

/**
 * A quiet "before you go" card — never a page-blocking modal.
 * ▸ Desktop (fine pointer) only: it listens for the cursor leaving through the top
 *   of the window. Touch devices have no reliable exit signal, so nothing is shown.
 * ▸ At most once per session, and never for someone who has already opened the inquiry.
 * ▸ Armed only after the visitor has spent a little time with the page.
 */
const SEEN_KEY = "sk-exit-intent-seen";
const ARM_AFTER_MS = 12000;

function seen(): boolean {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}
function markSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    /* storage unavailable — the in-memory flag below still limits it to one showing */
  }
}

export default function ExitIntent() {
  const { open, isOpen, hasProgress } = useInquiry();
  const [visible, setVisible] = useState(false);
  const shownOnce = useRef(false);
  const blockRef = useRef(false);

  useEffect(() => {
    blockRef.current = isOpen || hasProgress;
  }, [isOpen, hasProgress]);

  // Anyone who opens the inquiry has already said yes — never interrupt them later.
  useEffect(() => {
    if (isOpen) {
      markSeen();
      shownOnce.current = true;
      setVisible(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches || seen()) return;
    let armed = false;
    let timer = 0;
    const offIntro = onIntroDone(() => {
      timer = window.setTimeout(() => (armed = true), ARM_AFTER_MS);
    });
    const onOut = (e: MouseEvent) => {
      if (!armed || shownOnce.current || blockRef.current || e.relatedTarget || e.clientY > 8) return;
      if (seen()) return;
      shownOnce.current = true;
      markSeen();
      setVisible(true);
      track("exit_intent_shown");
    };
    document.documentElement.addEventListener("mouseout", onOut);
    return () => {
      offIntro();
      clearTimeout(timer);
      document.documentElement.removeEventListener("mouseout", onOut);
    };
  }, []);

  const dismiss = () => {
    setVisible(false);
    track("exit_intent_dismissed");
  };

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setVisible(false);
      track("exit_intent_dismissed");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible]);

  return (
    <aside
      className={`${styles.card} ${visible ? styles.on : ""}`}
      role="dialog"
      aria-modal="false"
      aria-labelledby="exit-title"
      aria-hidden={!visible}
    >
      <button type="button" className={styles.close} onClick={dismiss} tabIndex={visible ? 0 : -1} aria-label="Close" data-cursor="CLOSE">
        ×
      </button>
      <p className="meta-sm champagne">BEFORE YOU GO…</p>
      <p id="exit-title" className={`serif ${styles.title}`}>
        Planning your wedding? <em>Let us check your date.</em>
      </p>
      <div className={styles.actions}>
        <a
          href="#get-in-touch"
          className="cta cta--primary"
          aria-haspopup="dialog"
          tabIndex={visible ? 0 : -1}
          data-cursor="BEGIN"
          onClick={(e) => {
            e.preventDefault();
            setVisible(false);
            track("exit_intent_accepted");
            track("exit_intent_cta_clicked");
            open("exit-intent");
          }}
        >
          <span>CHECK MY DATE</span>
          <Arrow />
        </a>
        <button type="button" className="cta" onClick={dismiss} tabIndex={visible ? 0 : -1}>
          <span>KEEP EXPLORING</span>
          <Arrow />
        </button>
      </div>
    </aside>
  );
}
