"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { brand, contact } from "@/content/site";
import { media } from "@/content/media";
import { budgetList, copy } from "@/content/inquiry";
import { LIMITS, validateStep, type Inquiry } from "@/lib/inquiry/model";
import { buildWhatsAppMessage } from "@/lib/inquiry/whatsapp";
import { submitInquiry } from "@/lib/inquiry/submit";
import { track } from "@/lib/inquiry/analytics";
import Photo from "@/components/ui/Photo";
import Arrow from "@/components/ui/Arrow";
import WhatsAppLink from "./WhatsAppLink";
import { stepName, type FlowState, type Phase } from "./types";
import styles from "./InquiryFlow.module.css";

type Props = {
  state: FlowState;
  setState: React.Dispatch<React.SetStateAction<FlowState>>;
  phase: Phase;
  setPhase: (p: Phase) => void;
  restored: boolean;
  onDismissRestored: () => void;
  onReset: () => void;
  onClose: () => void;
};

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), textarea, select, [tabindex]:not([tabindex="-1"])';

const SESSION_OPTIONS = [
  { id: "Wedding", label: "Wedding" },
  { id: "Pre-Wedding", label: "Pre-Wedding" },
  { id: "Proposal / Engagement", label: "Proposal & Engagement" },
  { id: "Cinematic Film", label: "Cinematic Film" },
  { id: "Destination Wedding", label: "Destination Wedding" },
  { id: "Other", label: "Other Story" },
];

export default function InquiryFlow({ state, setState, phase, setPhase, restored, onReset, onClose }: Props) {
  const { data, view } = state;
  const rootRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const animating = useRef(false);
  const sendingRef = useRef(false);
  const closingRef = useRef(false);
  const reduced = useRef(false);

  const [showErrors, setShowErrors] = useState(false);
  const [touched, setTouched] = useState<Set<keyof Inquiry>>(new Set());
  const [retrying, setRetrying] = useState(false);
  const [errorDetail, setErrorDetail] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const stepIdx = view === 1 ? 1 : 0;
  const stepKey = stepIdx === 1 ? "contact" : "event";

  const screen: "steps" | "success" | "error" =
    phase === "success" ? "success" : phase === "error" || (phase === "sending" && retrying) ? "error" : "steps";
  const screenKey = screen === "steps" ? `v${stepIdx}` : screen;

  const errors = useMemo(() => validateStep(stepKey, data), [stepKey, data]);
  const err = (f: keyof Inquiry) => (showErrors || touched.has(f) ? errors[f] : undefined);
  const waText = buildWhatsAppMessage(data);

  const update = useCallback(
    (patch: Partial<Inquiry>) => setState((s) => ({ ...s, data: { ...s.data, ...patch } })),
    [setState]
  );

  const touch = (f: keyof Inquiry) => () => {
    if (String(data[f] ?? "").trim()) setTouched((t) => new Set(t).add(f));
  };

  useLayoutEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = window.__lenis;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const el = rootRef.current;
    if (el) {
      if (reduced.current) gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 });
      else
        gsap.fromTo(
          el,
          { clipPath: "inset(100% 0% 0% 0%)", autoAlpha: 1 },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "expo.inOut", clearProps: "clipPath" }
        );
    }
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
    };
  }, []);

  const requestClose = useCallback(() => {
    if (sendingRef.current || closingRef.current) return;
    closingRef.current = true;
    const el = rootRef.current;
    if (!el) return onClose();
    gsap.to(el, { autoAlpha: 0, duration: reduced.current ? 0.2 : 0.5, ease: "power2.inOut", onComplete: onClose });
  }, [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        requestClose();
        return;
      }
      if (e.key !== "Tab" || !rootRef.current) return;
      const items = [...rootRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((n) => n.offsetParent !== null);
      if (!items.length) return;
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        lastEl.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [requestClose]);

  const leave = useCallback((then: () => void) => {
    const panel = panelRef.current;
    if (!panel || reduced.current) return then();
    animating.current = true;
    gsap.to(panel, {
      autoAlpha: 0,
      y: -16,
      duration: 0.24,
      ease: "power2.in",
      onComplete: then,
    });
  }, []);

  const nextStep = () => {
    const errs = validateStep("event", data);
    if (Object.keys(errs).length > 0) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    leave(() => {
      setState((s) => ({ ...s, view: 1, reached: Math.max(s.reached, 1) }));
      if (bodyRef.current) bodyRef.current.scrollTop = 0;
    });
  };

  const prevStep = () => {
    setShowErrors(false);
    leave(() => {
      setState((s) => ({ ...s, view: 0 }));
      if (bodyRef.current) bodyRef.current.scrollTop = 0;
    });
  };

  const send = async () => {
    if (sendingRef.current) return;
    const errs = validateStep("contact", data);
    if (Object.keys(errs).length > 0) {
      setShowErrors(true);
      return;
    }
    sendingRef.current = true;
    setPhase("sending");
    const res = await submitInquiry(data, honeypot);
    const finish = () => {
      sendingRef.current = false;
      setRetrying(false);
      setPhase(res.ok ? "success" : "error");
    };
    if (res.ok) {
      track("inquiry_completed", { currency: data.currency });
    } else {
      track("inquiry_failed");
      setErrorDetail(res.error);
    }
    if (!res.ok && screen === "error") finish();
    else leave(finish);
  };

  const retry = () => {
    setRetrying(true);
    void send();
  };

  const waTrack = { step: stepName(view), phase };
  const sending = phase === "sending";

  const renderForm = () => (
    <div className={styles.formContainer}>
      {/* Floating Glassmorphic 2-Step Card */}
      <div className={styles.formCard} data-rise>
        {/* Header: —— REQUEST A QUOTE —— */}
        <div className={styles.quoteHeader}>
          <span className={styles.lineDecor} />
          <h2 className={styles.quoteTitle}>REQUEST A QUOTE</h2>
          <span className={styles.lineDecor} />
        </div>

        {/* Progress Bar & Step Counter */}
        <div className={styles.progressContainer}>
          <div className={styles.counterRow}>
            <span className={styles.stepCounter}>{stepIdx === 0 ? "1 / 2" : "2 / 2"}</span>
          </div>
          <div className={styles.progressBarTrack} role="progressbar" aria-valuenow={stepIdx === 0 ? 50 : 100} aria-valuemin={0} aria-valuemax={100}>
            <div
              className={styles.progressBarFill}
              style={{ width: stepIdx === 0 ? "50%" : "100%" }}
            />
          </div>
        </div>

        {/* Step 1: Event Details */}
        {stepIdx === 0 && (
          <div className={styles.stepContent} key="step-1">
            <h3 className={styles.stepSectionTitle}>Event Details</h3>

            <div className={styles.stepFields}>
              {/* Venue & City * */}
              <div className={styles.inputCell}>
                <input
                  type="text"
                  className={`${styles.boxedInput} ${err("city") ? styles.inputError : ""}`}
                  placeholder="Venue & City *"
                  value={data.city}
                  onChange={(e) => update({ city: e.target.value })}
                  onBlur={touch("city")}
                  maxLength={LIMITS.place}
                />
                {err("city") && <span className={styles.fieldErrorText}>{err("city")}</span>}
              </div>

              {/* Event & Dates (e.g. Wedding on 11th March) * */}
              <div className={styles.inputCell}>
                <input
                  type="text"
                  className={`${styles.boxedInput} ${err("eventDetails") ? styles.inputError : ""}`}
                  placeholder="Event & Dates (e.g. Wedding on 11th March) *"
                  value={data.eventDetails}
                  onChange={(e) => update({ eventDetails: e.target.value, story: e.target.value })}
                  onBlur={touch("eventDetails")}
                  maxLength={LIMITS.story}
                />
                {err("eventDetails") && <span className={styles.fieldErrorText}>{err("eventDetails")}</span>}
              </div>

              {/* Estimated Budget * with Dropdown */}
              <div className={styles.inputCell}>
                <div className={styles.selectWrapper}>
                  <select
                    className={`${styles.boxedSelect} ${err("budget") ? styles.inputError : ""} ${!data.budget ? styles.selectPlaceholder : ""}`}
                    value={data.budget}
                    onChange={(e) => update({ budget: e.target.value })}
                    onBlur={touch("budget")}
                  >
                    <option value="" disabled>Estimated Budget *</option>
                    {budgetList.map((b) => (
                      <option key={b} value={b} className={styles.selectOption}>
                        {b}
                      </option>
                    ))}
                  </select>
                  <span className={styles.selectChevron} aria-hidden="true">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                      <path d="M1.5 1.75L6 6.25L10.5 1.75" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
                {err("budget") && <span className={styles.fieldErrorText}>{err("budget")}</span>}
              </div>
            </div>

            {/* Next Circular Arrow Button at bottom right */}
            <div className={styles.step1Actions}>
              <button
                type="button"
                className={styles.circleNextBtn}
                onClick={nextStep}
                aria-label="Next step: Contact Details"
              >
                <Arrow />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Personal / Contact Details */}
        {stepIdx === 1 && (
          <div className={styles.stepContent} key="step-2">
            <h3 className={styles.stepSectionTitle}>Personal Details</h3>

            <div className={styles.stepFields}>
              {/* Your Name * */}
              <div className={styles.inputCell}>
                <input
                  type="text"
                  className={`${styles.boxedInput} ${err("name") ? styles.inputError : ""}`}
                  placeholder="Your Name *"
                  value={data.name}
                  onChange={(e) => update({ name: e.target.value })}
                  onBlur={touch("name")}
                  autoComplete="name"
                  maxLength={LIMITS.name}
                />
                {err("name") && <span className={styles.fieldErrorText}>{err("name")}</span>}
              </div>

              {/* Phone Number * */}
              <div className={styles.inputCell}>
                <input
                  type="tel"
                  className={`${styles.boxedInput} ${err("phone") ? styles.inputError : ""}`}
                  placeholder="Phone Number (e.g. +91 98765 43210) *"
                  value={data.phone}
                  onChange={(e) => update({ phone: e.target.value })}
                  onBlur={touch("phone")}
                  autoComplete="tel"
                  maxLength={LIMITS.phone}
                />
                {err("phone") && <span className={styles.fieldErrorText}>{err("phone")}</span>}
              </div>

              {/* Email Address * */}
              <div className={styles.inputCell}>
                <input
                  type="email"
                  className={`${styles.boxedInput} ${err("email") ? styles.inputError : ""}`}
                  placeholder="Email Address *"
                  value={data.email}
                  onChange={(e) => update({ email: e.target.value })}
                  onBlur={touch("email")}
                  autoComplete="email"
                  maxLength={LIMITS.email}
                />
                {err("email") && <span className={styles.fieldErrorText}>{err("email")}</span>}
              </div>

              {/* Type of Session with Adorable Chips */}
              <div className={styles.inputCell}>
                <label className={styles.miniLabel}>
                  Type of Session <span className={styles.req}>*</span>
                </label>
                <div className={styles.sessionChipsGrid}>
                  {SESSION_OPTIONS.map((item) => {
                    const selected = data.sessionType === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={`${styles.sessionChip} ${selected ? styles.sessionChipActive : ""}`}
                        onClick={() => update({ sessionType: item.id, eventType: [item.id] })}
                      >
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
                {err("sessionType") && <span className={styles.fieldErrorText}>{err("sessionType")}</span>}
              </div>
            </div>

            {/* Bot Honeypot */}
            <div className={styles.hp} aria-hidden="true">
              <label htmlFor="inq-website">Website</label>
              <input
                id="inq-website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            {/* Step 2 Actions: Back button & Submit Button */}
            <div className={styles.step2Actions}>
              <button
                type="button"
                className={styles.circleBackBtn}
                onClick={prevStep}
                aria-label="Previous step: Event Details"
              >
                <span className={styles.backArrow}>←</span>
              </button>

              <button
                type="button"
                className={`${styles.luxurySubmitBtn} ${sending ? styles.btnDisabled : ""}`}
                onClick={send}
                disabled={sending}
              >
                <span>{sending ? "CHECKING AVAILABILITY…" : "SUBMIT REQUEST"}</span>
                <Arrow />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className={styles.outcome} role="status">
      <p className={`meta-sm champagne ${styles.sent}`} data-rise>
        <span className={styles.sentMark} aria-hidden="true" /> INQUIRY SENT
      </p>
      <h2 className={`serif ${styles.outcomeTitle}`} tabIndex={-1}>
        <span className="line">
          <span>YOUR LOVE STORY</span>
        </span>
        <span className="line">
          <span className={styles.qItalic}>IS ON ITS WAY.</span>
        </span>
      </h2>
      <div className={styles.outcomeCopy} data-rise>
        <p className={styles.lede}>Thank you for reaching out to {brand.name}.</p>
        <p className={styles.lede}>We can&apos;t wait to learn more about your wedding celebration.</p>
        <p className={styles.lede}>{copy.followUp}</p>
      </div>
      <div className={styles.outcomeActions} data-rise>
        <WhatsAppLink text={waText} from="success" trackProps={waTrack} className="cta cta--primary cta--boxed">
          <span>CONTINUE ON WHATSAPP</span>
          <Arrow />
        </WhatsAppLink>
        <button type="button" className="cta" onClick={requestClose}>
          <span>BACK TO THE EXPERIENCE</span>
          <Arrow />
        </button>
      </div>
    </div>
  );

  const renderError = () => (
    <div className={styles.outcome} role="alert">
      <p className={`meta-sm ${styles.failed}`} data-rise>
        NOT SENT
      </p>
      <h2 className={`serif ${styles.outcomeTitle}`} tabIndex={-1}>
        <span className="line">
          <span>YOUR STORY</span>
        </span>
        <span className="line">
          <span className={styles.qItalic}>DIDN’T GO THROUGH.</span>
        </span>
      </h2>
      <p className={styles.lede} data-rise>
        Please try again. {errorDetail && errorDetail !== "Please try again." ? errorDetail : ""} Your details are still here — nothing
        you entered has been lost.
      </p>
      <div className={styles.outcomeActions} data-rise>
        <button type="button" className={styles.luxurySubmitBtn} onClick={retry} disabled={sending}>
          <span>{sending ? "SENDING..." : "TRY AGAIN"}</span>
          <Arrow />
        </button>
        <WhatsAppLink text={waText} from="error" trackProps={waTrack} className="cta cta--primary">
          <span>CONTINUE ON WHATSAPP</span>
          <Arrow />
        </WhatsAppLink>
      </div>
      <p className={`meta-sm ${styles.touch}`} data-rise>
        OR EMAIL US AT{" "}
        <a href={`mailto:${contact.email}`} className={styles.mail}>
          {contact.email}
        </a>
      </p>
    </div>
  );

  return (
    <div
      ref={rootRef}
      className={`${styles.overlay} ${screen !== "steps" ? styles.overlayOutcome : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={`Wedding inquiry — ${brand.name}`}
    >
      {/* Background Image with Cinematic Blurry Effect */}
      <div className={styles.backdrops} aria-hidden="true">
        <div className={styles.bgImageWrap}>
          <Photo photo={media.contact || media.hero} sizes="100vw" quality={85} priority />
        </div>
        <div className={styles.veil} />
      </div>

      <div className={styles.chrome}>
        <div className={styles.brand}>
          <span className={`serif ${styles.brandTop}`}>{brand.wordmark[0]}</span>
          <span className={`meta-sm ${styles.brandSub}`}>CHECK YOUR DATE</span>
        </div>

        <button type="button" className={`meta-sm ${styles.close}`} onClick={requestClose} disabled={sending} data-cursor="CLOSE">
          <span className={styles.closeText}>CLOSE</span> <span aria-hidden="true">×</span>
        </button>
      </div>

      <form
        className={styles.frame}
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (stepIdx === 0) nextStep();
          else void send();
        }}
      >
        <div ref={bodyRef} className={styles.body} data-lenis-prevent>
          {restored && screen === "steps" && (
            <div className={styles.restored}>
              <span className="meta-sm">WELCOME BACK — WE KEPT YOUR DETAILS FOR THIS SESSION.</span>
              <button
                type="button"
                className={`meta-sm ${styles.textBtn}`}
                onClick={onReset}
              >
                START OVER
              </button>
            </div>
          )}
          <div ref={panelRef} key={screenKey} className={styles.panel}>
            {screen === "success" ? renderSuccess() : screen === "error" ? renderError() : renderForm()}
          </div>
        </div>
      </form>
    </div>
  );
}
