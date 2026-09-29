"use client";

import { useEffect, useState } from "react";
import { COUNTDOWN_DATE, COUNTDOWN_ENABLED, COUNTDOWN_LABEL } from "@/content/countdown";
import styles from "./Countdown.module.css";

const TARGET = COUNTDOWN_ENABLED && COUNTDOWN_DATE ? Date.parse(COUNTDOWN_DATE) : NaN;

function remaining(now: number) {
  const ms = Math.max(0, TARGET - now);
  const s = Math.floor(ms / 1000);
  return { ms, days: Math.floor(s / 86400), hours: Math.floor(s / 3600) % 24, minutes: Math.floor(s / 60) % 60, seconds: s % 60 };
}

/**
 * Renders only when a real deadline is configured (see content/countdown.ts).
 * Nothing is rendered on the server, so there is no hydration mismatch and no
 * layout reserved for a timer that is switched off.
 */
export default function Countdown() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    if (Number.isNaN(TARGET)) return;
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (Number.isNaN(TARGET) || now === null) return null;
  const r = remaining(now);
  if (r.ms <= 0) return null;

  const units: [number, string][] = [
    [r.days, "DAYS"],
    [r.hours, "HOURS"],
    [r.minutes, "MIN"],
    [r.seconds, "SEC"],
  ];

  return (
    <div className={styles.wrap} role="timer" aria-label={`${COUNTDOWN_LABEL} — ${r.days} days remaining`}>
      {COUNTDOWN_LABEL && <p className="meta-sm champagne">{COUNTDOWN_LABEL}</p>}
      <div className={styles.units} aria-hidden="true">
        {units.map(([v, l]) => (
          <span key={l} className={styles.unit}>
            <span className={`serif ${styles.num}`}>{String(v).padStart(2, "0")}</span>
            <span className="meta-sm">{l}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
