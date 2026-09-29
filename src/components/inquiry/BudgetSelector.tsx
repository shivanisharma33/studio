"use client";

import { useEffect, useId, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { budgetRanges, copy, currencies, type CurrencyCode } from "@/content/inquiry";
import type { Inquiry } from "@/lib/inquiry/model";
import { FieldError } from "./Fields";
import styles from "./InquiryFlow.module.css";

type Props = {
  budget: Inquiry["budget"];
  currency: CurrencyCode;
  error?: string;
  onBudget: (b: Inquiry["budget"]) => void;
  onCurrency: (c: CurrencyCode) => void;
};

/**
 * Approximate investment — an inquiry qualification range, never a package.
 * Slider + clickable range labels; the displayed range rolls softly on change.
 */
export default function BudgetSelector({ budget, currency, error, onBudget, onCurrency }: Props) {
  const ranges = budgetRanges[currency];
  const id = useId();
  const valueRef = useRef<HTMLSpanElement>(null);
  const first = useRef(true);
  const sliderIndex = typeof budget === "number" ? budget : Math.floor(ranges.length / 2);
  const display = budget === "unsure" ? "Not sure yet" : budget === null ? "Choose a range" : ranges[budget];
  const pct = (sliderIndex / (ranges.length - 1)) * 100;

  // Soft vertical roll of the displayed range — no counting or flashing numbers.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const el = valueRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(el, { yPercent: 40, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.55, ease: "expo.out", overwrite: true });
  }, [display]);

  return (
    <div className={styles.budget}>
      <div className={styles.budgetTop}>
        <div className={styles.currency} role="radiogroup" aria-label="Currency">
          {currencies.map((c) => (
            <button
              key={c.code}
              type="button"
              role="radio"
              aria-checked={currency === c.code}
              className={`${styles.currencyBtn} ${currency === c.code ? styles.currencyOn : ""}`}
              onClick={() => onCurrency(c.code)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <span className={`meta-sm ${styles.notPackage}`}>APPROXIMATE INVESTMENT RANGE — NOT A PACKAGE PRICE</span>
      </div>

      <div className={styles.budgetDisplay} aria-live="polite">
        <span className="meta-sm">APPROXIMATE INVESTMENT</span>
        <span className={styles.budgetValueMask}>
          <span ref={valueRef} className={`serif ${styles.budgetValue} ${budget === null ? styles.budgetEmpty : ""}`}>
            {display}
            {typeof budget === "number" && <span className={`meta-sm ${styles.budgetCode}`}>{currency}</span>}
          </span>
        </span>
      </div>

      <div
        className={`${styles.slider} ${typeof budget !== "number" ? styles.sliderIdle : ""}`}
        style={{ ["--pct" as string]: `${pct}%` }}
      >
        <label htmlFor={id} className="sr-only">
          Approximate investment range
        </label>
        <input
          id={id}
          type="range"
          min={0}
          max={ranges.length - 1}
          step={1}
          value={sliderIndex}
          aria-valuetext={typeof budget === "number" ? `${ranges[budget]} ${currency}` : "Not chosen"}
          aria-describedby={error ? `${id}-err` : undefined}
          onChange={(e) => onBudget(Number(e.target.value))}
          // A tap on the thumb without moving still counts as a choice.
          onPointerUp={(e) => typeof budget !== "number" && onBudget(Number((e.target as HTMLInputElement).value))}
        />
        <ol className={styles.ticks}>
          {ranges.map((r, i) => (
            <li key={r} style={{ ["--i" as string]: i, ["--n" as string]: ranges.length - 1 }}>
              <button
                type="button"
                tabIndex={-1}
                className={`${styles.tick} ${budget === i ? styles.tickOn : ""}`}
                onClick={() => onBudget(i)}
              >
                {r}
              </button>
            </li>
          ))}
        </ol>
        <div className={styles.tickEnds} aria-hidden="true">
          <span>{ranges[0]}</span>
          <span>{ranges[ranges.length - 1]}</span>
        </div>
      </div>

      <button
        type="button"
        className={`${styles.choice} ${styles.unsure} ${budget === "unsure" ? styles.choiceOn : ""}`}
        aria-pressed={budget === "unsure"}
        onClick={() => onBudget(budget === "unsure" ? null : "unsure")}
      >
        <span className={styles.check} aria-hidden="true" />
        <span className={styles.choiceLabel}>I’M NOT SURE YET</span>
      </button>

      <div className={`${styles.note} ${budget !== null ? styles.noteOn : ""}`} aria-live="polite">
        <p className={styles.noteInner}>{budget === "unsure" ? copy.budgetUnsure : budget !== null ? copy.budgetThanks : ""}</p>
      </div>
      <FieldError id={`${id}-err`} message={error} />
    </div>
  );
}
