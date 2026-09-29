"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { contact } from "@/content/site";
import Arrow from "@/components/ui/Arrow";
import styles from "./Contact.module.css";

type Status = "idle" | "sending" | "sent" | "error";

export default function Contact() {
  const root = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          q(`.${styles.title} .line > span`),
          { yPercent: 110 },
          { yPercent: 0, duration: 1.5, ease: "expo.out", stagger: 0.12, scrollTrigger: { trigger: q(`.${styles.title}`)[0], start: "top 80%", once: true } }
        );
        gsap.fromTo(
          q(`.${styles.field}`),
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 1.2, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: q(`.${styles.form}`)[0], start: "top 80%", once: true } }
        );
      });
      mm.add(MQ.reduced, () => {
        gsap.set(q(".line > span"), { yPercent: 0 });
        gsap.set(q(`.${styles.field}`), { autoAlpha: 1 });
      });
    },
    { scope: root }
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error || "Something went wrong.");
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <section ref={root} id="get-in-touch" className={`section ${styles.wrap}`} aria-labelledby="contact-title">
      <div className="container">
        <p className="meta-sm" data-reveal>
          10 &nbsp;—&nbsp; GET IN TOUCH
        </p>
        <h2 id="contact-title" className={`serif ${styles.title}`}>
          <span className="line">
            <span>WE’RE SO GLAD</span>
          </span>
          <span className="line">
            <span className={styles.italic}>YOU FOUND US.</span>
          </span>
        </h2>

        <div className={styles.grid}>
          <div className={styles.aside}>
            <p className={styles.intro} data-reveal>
              {contact.intro}
            </p>
            <p className={styles.intro} data-reveal style={{ ["--d" as string]: "0.08s" }}>
              {contact.intro2}
            </p>

            <div className={styles.direct} data-reveal style={{ ["--d" as string]: "0.16s" }}>
              <span className="meta-sm">OR — EMAIL US AT</span>
              <a href={`mailto:${contact.email}`} className={`serif ${styles.email}`} data-cursor="EXPLORE">
                {contact.email}
              </a>
              <ul className={styles.social}>
                <li>
                  <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className="cta" data-cursor="EXPLORE">
                    <span>INSTAGRAM</span>
                    <Arrow />
                  </a>
                </li>
                <li>
                  <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className="cta" data-cursor="EXPLORE">
                    <span>WHATSAPP</span>
                    <Arrow />
                  </a>
                </li>
                <li>
                  <a href={contact.youtube} target="_blank" rel="noopener noreferrer" className="cta" data-cursor="EXPLORE">
                    <span>YOUTUBE</span>
                    <Arrow />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <form className={styles.form} onSubmit={onSubmit} noValidate={false}>
            {status === "sent" ? (
              <div className={styles.success} role="status" aria-live="polite">
                <span className={`serif ${styles.successBig}`}>{contact.success}</span>
                <span className="meta-sm">WE’LL DO OUR BEST TO GET BACK TO YOU AS SOON AS POSSIBLE.</span>
                <button type="button" className={`meta-sm ${styles.again}`} onClick={() => setStatus("idle")}>
                  SEND ANOTHER MESSAGE <span aria-hidden="true">→</span>
                </button>
              </div>
            ) : (
              <>
                <div className={styles.field}>
                  <label htmlFor="c-name" className="meta-sm">
                    NAME
                  </label>
                  <input id="c-name" name="name" type="text" autoComplete="name" required minLength={2} placeholder="Your name" />
                </div>
                <div className={styles.field}>
                  <label htmlFor="c-email" className="meta-sm">
                    EMAIL
                  </label>
                  <input id="c-email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
                </div>
                <div className={styles.field}>
                  <label htmlFor="c-message" className="meta-sm">
                    EVENT DETAILS / MESSAGE
                  </label>
                  <textarea
                    id="c-message"
                    name="message"
                    rows={5}
                    required
                    minLength={10}
                    placeholder="Dates, locations, celebrations, and the story you’d like us to capture"
                  />
                </div>
                {/* honeypot */}
                <div className={styles.hp} aria-hidden="true">
                  <label htmlFor="c-website">Website</label>
                  <input id="c-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                </div>

                <div className={styles.actions}>
                  <button type="submit" className="cta cta--primary" disabled={status === "sending"} data-cursor="SEND" data-magnetic="">
                    <span>{status === "sending" ? "SENDING" : `${contact.submit.toUpperCase()}`}</span>
                    <Arrow />
                  </button>
                  {status === "error" && (
                    <p className={`meta-sm ${styles.error}`} role="alert">
                      {error}
                    </p>
                  )}
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
