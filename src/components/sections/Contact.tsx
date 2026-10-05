"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { contact } from "@/content/site";
import { track } from "@/lib/inquiry/analytics";
import Arrow from "@/components/ui/Arrow";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import styles from "./Contact.module.css";

export default function Contact() {
  const root = useRef<HTMLElement>(null);
  const [name, setName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; contactInfo?: string; details?: string }>({});

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          q(`.${styles.title}`),
          { autoAlpha: 0, y: 30 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.2,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 80%", once: true },
          }
        );
        gsap.fromTo(
          q(`.${styles.photoCol}`),
          { autoAlpha: 0, x: -30 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 1.2,
            ease: "expo.out",
            delay: 0.15,
            scrollTrigger: { trigger: el, start: "top 75%", once: true },
          }
        );
        gsap.fromTo(
          q(`.${styles.formCol}`),
          { autoAlpha: 0, x: 30 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 1.2,
            ease: "expo.out",
            delay: 0.25,
            scrollTrigger: { trigger: el, start: "top 75%", once: true },
          }
        );
      });
      mm.add(MQ.reduced, () => {
        gsap.set(q(`.${styles.title}, .${styles.photoCol}, .${styles.formCol}`), { autoAlpha: 1, x: 0, y: 0 });
      });
    },
    { scope: root }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const errs: { name?: string; contactInfo?: string; details?: string } = {};
    if (!name.trim()) errs.name = "Please enter your name.";
    if (!contactInfo.trim()) errs.contactInfo = "Please enter your email or phone number.";
    if (!details.trim()) errs.details = "Please share details about your event requirements.";

    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }
    setFieldErrors({});
    setSubmitting(true);

    try {
      track("inquiry_completed", { source: "direct_form" });
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          direct: true,
          name: name.trim(),
          contact: contactInfo.trim(),
          details: details.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Unable to send message at this time.");
      }

      setSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please connect with us directly via email or WhatsApp.";
      setServerError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section ref={root} id="get-in-touch" className={`section ${styles.wrap}`} aria-labelledby="contact-title" data-floating-cta-hide="">
      <div className="container">
        {/* Centered Heading */}
        <div className={styles.header}>
          <p className="meta-sm" data-reveal>
            14 &nbsp;—&nbsp; GET IN TOUCH / INQUIRY
          </p>
          <h2 id="contact-title" className={`serif ${styles.title}`}>
            {contact.heading}
          </h2>
        </div>

        {/* 2-Column Editorial Showcase Grid */}
        <div className={styles.grid}>
          {/* Left Column: Portrait Photo with Parasol */}
          <div className={styles.photoCol}>
            <div className={styles.photoFrame}>
              <Image
                src="/images/contact-couple-hd.jpg"
                alt="Studio Kunal Photography luxury wedding couple walking down the aisle"
                fill
                sizes="(min-width: 1024px) 460px, (min-width: 768px) 50vw, 100vw"
                className={styles.photo}
                quality={95}
                priority
              />
              <div className={styles.photoOverlay} />
            </div>
          </div>

          {/* Right Column: Intro Copy & Clean Underline Form */}
          <div className={styles.formCol}>
            <p className={styles.intro}>
              {contact.intro} {contact.intro2}
            </p>

            {submitted ? (
              <div className={styles.successCard}>
                <div className={styles.successIcon} aria-hidden="true">
                  ✓
                </div>
                <h3 className={`serif ${styles.successHeading}`}>Thank you, {name}!</h3>
                <p className={styles.successText}>
                  {contact.success} We have received your event requirements and look forward to connecting with you shortly.
                </p>
                <div className={styles.successActions}>
                  <a
                    href={contact.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.successWaBtn}
                  >
                    <WhatsAppIcon size={18} />
                    <span>CHAT DIRECTLY ON WHATSAPP</span>
                    <Arrow />
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setName("");
                      setContactInfo("");
                      setDetails("");
                    }}
                    className={styles.resetBtn}
                  >
                    Send another message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form} noValidate>
                {/* Field 1: Name */}
                <div className={`${styles.field} ${fieldErrors.name ? styles.fieldError : ""}`}>
                  <label htmlFor="contact-name" className={styles.label}>
                    Name <span className={styles.asterisk}>*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    placeholder="Your name"
                    className={styles.input}
                    autoComplete="name"
                    required
                  />
                  {fieldErrors.name && <span className={styles.errorHint}>{fieldErrors.name}</span>}
                </div>

                {/* Field 2: Email / Phone Number */}
                <div className={`${styles.field} ${fieldErrors.contactInfo ? styles.fieldError : ""}`}>
                  <label htmlFor="contact-info" className={styles.label}>
                    Email / Phone Number <span className={styles.asterisk}>*</span>
                  </label>
                  <input
                    id="contact-info"
                    type="text"
                    name="contactInfo"
                    value={contactInfo}
                    onChange={(e) => {
                      setContactInfo(e.target.value);
                      if (fieldErrors.contactInfo) setFieldErrors((prev) => ({ ...prev, contactInfo: undefined }));
                    }}
                    placeholder="email@example.com or +1 (555) 000-0000"
                    className={styles.input}
                    autoComplete="email"
                    required
                  />
                  {fieldErrors.contactInfo && <span className={styles.errorHint}>{fieldErrors.contactInfo}</span>}
                </div>

                {/* Field 3: Event Details */}
                <div className={`${styles.field} ${fieldErrors.details ? styles.fieldError : ""}`}>
                  <label htmlFor="contact-details" className={styles.label}>
                    Event Details (including dates and other specific details) <span className={styles.asterisk}>*</span>
                  </label>
                  <textarea
                    id="contact-details"
                    name="details"
                    rows={3}
                    value={details}
                    onChange={(e) => {
                      setDetails(e.target.value);
                      if (fieldErrors.details) setFieldErrors((prev) => ({ ...prev, details: undefined }));
                    }}
                    placeholder="Share as many details as you can about your requirements, dates, city/venue..."
                    className={styles.textarea}
                    required
                  />
                  {fieldErrors.details && <span className={styles.errorHint}>{fieldErrors.details}</span>}
                </div>

                {serverError && <p className={styles.serverAlert}>{serverError}</p>}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className={styles.submitBtn}
                  data-cursor="SUBMIT"
                >
                  <span>{submitting ? "SUBMITTING..." : "SUBMIT"}</span>
                  <Arrow />
                </button>
              </form>
            )}

            {/* Direct Channels Footnote */}
            <div className={styles.directBar}>
              <span className="meta-sm">OR REACH OUT DIRECTLY:</span>
              <div className={styles.directLinks}>
                <a href={`mailto:${contact.email}`} className={styles.directLink}>
                  <span>{contact.email}</span>
                </a>
                <span className={styles.directSep}>·</span>
                <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className={styles.directLink}>
                  <WhatsAppIcon size={15} />
                  <span>WhatsApp</span>
                </a>
                <span className={styles.directSep}>·</span>
                <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className={styles.directLink}>
                  <span>Instagram</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
