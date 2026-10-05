"use client";

import { useState } from "react";
import { faq } from "@/content/site";
import styles from "./Faq.module.css";

/** Renders **bold** markers from the verbatim site copy as <strong>. */
function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("**") ? <strong key={i}>{p.slice(2, -2)}</strong> : <span key={i}>{p}</span>
      )}
    </>
  );
}







export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className={`section ${styles.wrap}`} aria-labelledby="faq-title">
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.aside}>
            <p className="meta-sm" data-reveal>
              13 &nbsp;—&nbsp; FAQ
            </p>
            <h2 id="faq-title" className={`serif ${styles.title}`} data-reveal>
              {faq.heading.slice(0, 1)}
              <span className={styles.italic}>&amp;</span>
              {faq.heading.slice(2)}
            </h2>
            <p className={styles.intro} data-reveal>
              {faq.intro}
            </p>
          </div>

          <ol className={styles.list} data-reveal>
            {faq.items.map((item, i) => {
              const isOpen = open === i;
              return (
                <li
                  key={item.n}
                  className={`${styles.item} ${isOpen ? styles.itemOpen : ""}`}
                  onMouseEnter={() => setOpen(i)}
                >
                  <button
                    type="button"
                    className={styles.trigger}
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpen(isOpen ? null : i);
                    }}
                    aria-expanded={isOpen}
                    aria-controls={`faq-${item.n}`}
                    data-cursor={isOpen ? "CLOSE" : "OPEN"}
                  >
                    <span className={`meta-sm ${styles.num}`}>{item.n}</span>
                    <span className={styles.labels}>
                      <span className={`meta ${styles.label}`}>{item.label}</span>
                      <span className={`serif ${styles.q}`}>{item.q}</span>
                    </span>
                    <span className={styles.plus} aria-hidden="true">
                      <span />
                      <span />
                    </span>
                  </button>
                  <div id={`faq-${item.n}`} className={styles.panel} role="region" aria-hidden={!isOpen}>
                    <div className={styles.panelInner}>
                      <p className={styles.a}>
                        <Rich text={item.a} />
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
