"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { brand, contact } from "@/content/site";
import { media, type Photo as PhotoT } from "@/content/media";
import {
  copy,
  countryPicks,
  currencyForCountry,
  eventDays,
  eventTypes,
  guestCounts,
  months,
  promotedYears,
  services,
  steps,
  VENUE_UNDECIDED,
  yearOptions,
  type CurrencyCode,
} from "@/content/inquiry";
import { LIMITS, summaryRows, validateAll, validateStep, type Inquiry } from "@/lib/inquiry/model";
import { whatsappUrl } from "@/lib/inquiry/whatsapp";
import { submitInquiry } from "@/lib/inquiry/submit";
import { track } from "@/lib/inquiry/analytics";
import Photo from "@/components/ui/Photo";
import Arrow from "@/components/ui/Arrow";
import { ChoiceGroup, FieldError, TextField } from "./Fields";
import BudgetSelector from "./BudgetSelector";
import { REVIEW, stepName, type FlowState, type Phase } from "./types";
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

/** Background photograph per screen — soft, dark, blurred; changes gently between chapters. */
const BACKDROPS: PhotoT[] = [media.hero, media.story[0], media.global, media.reveal, media.investment, media.finalCta];
const BACKDROP_FOR_VIEW = [0, 0, 1, 2, 3, 3, 4, 5, 5];

/** Which step each review row edits. */
const ROW_STEP: Record<string, number> = {
  Name: 0,
  Email: 1,
  "Phone / WhatsApp": 1,
  "Wedding Date": 2,
  Location: 3,
  Venue: 3,
  "Event Type": 4,
  "Events / Days": 4,
  "Guest Count": 4,
  Services: 5,
  "Approx. Investment": 6,
  Story: 7,
};

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), textarea, select, [tabindex]:not([tabindex="-1"])';

export default function InquiryFlow({ state, setState, phase, setPhase, restored, onDismissRestored, onReset, onClose }: Props) {
  const { data, view, reached } = state;
  const rootRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const animating = useRef(false);
  const dir = useRef(1);
  const sendingRef = useRef(false);
  const closingRef = useRef(false);
  const reduced = useRef(false);

  const [showErrors, setShowErrors] = useState(false);
  const [touched, setTouched] = useState<Set<keyof Inquiry>>(new Set());
  const [returnToReview, setReturnToReview] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [errorDetail, setErrorDetail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [seenBackdrops, setSeenBackdrops] = useState<Set<number>>(() => new Set([BACKDROP_FOR_VIEW[view]]));

  const screen: "steps" | "success" | "error" =
    phase === "success" ? "success" : phase === "error" || (phase === "sending" && retrying) ? "error" : "steps";
  const screenKey = screen === "steps" ? `v${view}` : screen;
  const stepKey = view < REVIEW ? steps[view].key : null;
  const errors = useMemo(() => (stepKey ? validateStep(stepKey, data) : {}), [stepKey, data]);
  const err = (f: keyof Inquiry) => (showErrors || touched.has(f) ? errors[f] : undefined);
  const backdrop = screen === "steps" ? BACKDROP_FOR_VIEW[view] : BACKDROPS.length - 1;
  const wa = whatsappUrl(data);

  const update = useCallback(
    (patch: Partial<Inquiry>) => setState((s) => ({ ...s, data: { ...s.data, ...patch } })),
    [setState]
  );
  const touch = (f: keyof Inquiry) => () => {
    if (String(data[f] ?? "").trim()) setTouched((t) => new Set(t).add(f));
  };

  useEffect(() => {
    setSeenBackdrops((s) => (s.has(backdrop) ? s : new Set(s).add(backdrop)));
  }, [backdrop]);

  /* ── open: lock page scroll, reveal like a new chapter ─────────────── */
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

  /* ── keyboard: Esc closes, Tab stays inside the dialog ─────────────── */
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
        firstEl.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [requestClose]);

  /* ── screen transitions: current leaves left, next arrives from the right ── */
  const leave = useCallback((then: () => void, direction = 1, force = false) => {
    // Mid-transition navigation is ignored — except outcomes, which must always land.
    if (animating.current) return force ? then() : undefined;
    dir.current = direction;
    const panel = panelRef.current;
    if (!panel || reduced.current) return then();
    animating.current = true;
    gsap.to(panel, {
      x: -direction * 56,
      autoAlpha: 0,
      duration: 0.32,
      ease: "power2.in",
      onComplete: then,
    });
  }, []);

  const pendingErrors = useRef(false);
  const goTo = useCallback(
    (next: number, opts: { showErrors?: boolean } = {}) => {
      if (next === view && screen === "steps") return;
      onDismissRestored();
      leave(
        () => {
          pendingErrors.current = Boolean(opts.showErrors);
          setState((s) => ({ ...s, view: next, reached: Math.max(s.reached, next) }));
        },
        next >= view ? 1 : -1
      );
    },
    [view, screen, leave, setState, onDismissRestored]
  );

  useLayoutEffect(() => {
    setShowErrors(pendingErrors.current);
    pendingErrors.current = false;
    setTouched(new Set());
    bodyRef.current?.scrollTo({ top: 0 });
    const panel = panelRef.current;
    if (!panel) return;
    const focusFirst = () => {
      if (screenKey === `v${REVIEW}`) return;
      const target =
        panel.querySelector<HTMLElement>('[aria-invalid="true"]') ??
        panel.querySelector<HTMLElement>("input:not([type=range]):not([tabindex='-1']), textarea") ??
        panel.querySelector<HTMLElement>("h2");
      target?.focus({ preventScroll: true });
    };
    const lines = panel.querySelectorAll(".line > span");
    if (reduced.current) {
      gsap.fromTo(panel, { autoAlpha: 0, x: 0 }, { autoAlpha: 1, duration: 0.3, onComplete: () => (animating.current = false) });
      gsap.set(lines, { yPercent: 0 });
      focusFirst();
      return;
    }
    const tl = gsap.timeline({
      onComplete: () => {
        animating.current = false;
      },
    });
    tl.fromTo(panel, { x: dir.current * 56, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.65, ease: "expo.out" }, 0);
    tl.fromTo(lines, { yPercent: 110 }, { yPercent: 0, duration: 0.7, ease: "expo.out", stagger: 0.07 }, 0.05);
    tl.fromTo(
      panel.querySelectorAll("[data-rise]"),
      { autoAlpha: 0, y: 18 },
      { autoAlpha: 1, y: 0, duration: 0.6, ease: "expo.out", stagger: 0.05, clearProps: "transform" },
      0.18
    );
    // Focus after the panel is visible so mobile keyboards don't jump mid-slide.
    tl.call(focusFirst, [], 0.3);
    return () => {
      tl.kill();
      animating.current = false;
    };
  }, [screenKey]);

  /* ── step completion ───────────────────────────────────────────────── */
  const trackStep = () => {
    if (!stepKey) return;
    track("step_completed", { step: stepKey, index: view + 1 });
    if (stepKey === "date") track("date_selected", { month: data.month !== null ? months[data.month] : "", year: data.year ?? "" });
    if (stepKey === "location") track("location_selected", { country: data.country.trim(), venue_known: data.venue.trim() !== "" && data.venue !== VENUE_UNDECIDED });
    if (stepKey === "event") track("event_type_selected", { types: data.eventType.join(","), days: data.eventDays, guests: data.guestCount });
    if (stepKey === "services") track("service_selected", { services: data.services.join(",") });
    if (stepKey === "budget") track("budget_selected", { currency: data.currency, range: data.budget === null ? "" : String(data.budget) });
  };

  const next = () => {
    if (animating.current || !stepKey) return;
    if (Object.keys(errors).length) {
      setShowErrors(true);
      requestAnimationFrame(() => {
        panelRef.current?.querySelector<HTMLElement>('[aria-invalid="true"], fieldset[aria-describedby] button')?.focus();
      });
      return;
    }
    trackStep();
    if (returnToReview) {
      setReturnToReview(false);
      goTo(REVIEW);
    } else goTo(view + 1);
  };

  const back = () => {
    if (view > 0) goTo(view - 1);
  };

  const edit = (step: number) => {
    setReturnToReview(true);
    goTo(step);
  };

  const jump = (i: number) => {
    if (i === view || i > reached || phase === "sending") return;
    if (i > view && Object.keys(errors).length) {
      setShowErrors(true);
      return;
    }
    goTo(i);
  };

  /* ── submission ────────────────────────────────────────────────────── */
  const send = async () => {
    if (sendingRef.current) return;
    const { firstInvalidStep } = validateAll(data);
    if (firstInvalidStep >= 0) {
      setReturnToReview(true);
      if (screen !== "steps") setPhase("form");
      goTo(firstInvalidStep, { showErrors: true });
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
      track("inquiry_submitted", { currency: data.currency, services: data.services.join(",") });
    } else {
      track("inquiry_failed");
      setErrorDetail(res.error);
    }
    // From the error screen a retry that fails again just stays put.
    if (!res.ok && screen === "error") finish();
    else leave(finish, 1, true);
  };

  const retry = () => {
    setRetrying(true);
    void send();
  };

  const onWhatsApp = (from: string) => () => track("whatsapp_clicked", { from, step: stepName(view), phase });

  /* ── currency follows the country until the visitor picks one ─────── */
  const setCountry = (country: string) => {
    const inferred = currencyForCountry(country);
    setState((s) => ({
      ...s,
      data: { ...s.data, country, currency: !s.currencyTouched && inferred ? inferred : s.data.currency },
    }));
  };
  const setCurrency = (currency: CurrencyCode) =>
    setState((s) => ({ ...s, currencyTouched: true, data: { ...s.data, currency } }));

  /* ── render helpers ────────────────────────────────────────────────── */
  const heading = (lines: readonly string[], kicker?: string) => (
    <header className={styles.qHead}>
      {kicker && (
        <p className={`meta-sm ${styles.kicker}`} data-rise>
          {kicker}
        </p>
      )}
      <h2 className={`serif ${styles.question}`} tabIndex={-1}>
        {lines.map((l, i) => (
          <span className="line" key={l}>
            <span className={i === lines.length - 1 ? styles.qItalic : undefined}>{l}</span>
          </span>
        ))}
      </h2>
    </header>
  );

  const now = new Date();
  const years = yearOptions(now);

  const renderStep = () => {
    const s = steps[view];
    switch (s.key) {
      case "you":
        return (
          <>
            {heading(s.heading, s.kicker)}
            <div className={styles.fields} data-rise>
              <TextField
                label="YOUR NAME"
                value={data.name}
                onChange={(v) => update({ name: v })}
                onBlur={touch("name")}
                placeholder="Enter your name"
                autoComplete="name"
                maxLength={LIMITS.name}
                error={err("name")}
                large
              />
            </div>
          </>
        );
      case "reach":
        return (
          <>
            {heading(s.heading, s.kicker)}
            <div className={styles.fields} data-rise>
              <TextField
                label="EMAIL"
                type="email"
                value={data.email}
                onChange={(v) => update({ email: v })}
                onBlur={touch("email")}
                placeholder="you@example.com"
                autoComplete="email"
                inputMode="email"
                maxLength={LIMITS.email}
                error={err("email")}
              />
              <TextField
                label="WHATSAPP / PHONE"
                type="tel"
                value={data.phone}
                onChange={(v) => update({ phone: v })}
                onBlur={touch("phone")}
                placeholder="+1 … or +91 …"
                autoComplete="tel"
                inputMode="tel"
                maxLength={LIMITS.phone}
                hint="Include your country code — we work across North America and India."
                error={err("phone")}
              />
            </div>
          </>
        );
      case "date": {
        const thisYear = now.getFullYear();
        const pastMonth = (m: number) => data.year === thisYear && m < now.getMonth();
        const promoted = data.year !== null && promotedYears.includes(data.year);
        return (
          <>
            {heading(s.heading, s.kicker)}
            <div className={styles.fields}>
              <fieldset className={styles.group} data-rise aria-describedby={err("month") ? "err-month" : undefined}>
                <legend className={`meta-sm ${styles.label}`}>MONTH</legend>
                <div className={`${styles.choices} ${styles.cols_months}`} role="radiogroup" aria-label="Month">
                  {months.map((m, i) => (
                    <button
                      key={m}
                      type="button"
                      role="radio"
                      aria-checked={data.month === i}
                      disabled={pastMonth(i)}
                      className={`${styles.choice} ${styles.choiceCompact} ${data.month === i ? styles.choiceOn : ""}`}
                      onClick={() => update({ month: i })}
                    >
                      <span className={styles.check} aria-hidden="true" />
                      <span className={styles.choiceLabel}>{m}</span>
                    </button>
                  ))}
                </div>
                <FieldError id="err-month" message={err("month")} />
              </fieldset>

              <fieldset className={styles.group} data-rise aria-describedby={err("year") ? "err-year" : undefined}>
                <legend className={`meta-sm ${styles.label}`}>YEAR</legend>
                <div className={`${styles.choices} ${styles.cols_four}`} role="radiogroup" aria-label="Year">
                  {years.map((y) => {
                    const open = promotedYears.includes(y);
                    return (
                      <button
                        key={y}
                        type="button"
                        role="radio"
                        aria-checked={data.year === y}
                        className={`${styles.choice} ${styles.yearBtn} ${open ? styles.yearOpen : ""} ${data.year === y ? styles.choiceOn : ""}`}
                        onClick={() =>
                          update({ year: y, month: y === thisYear && data.month !== null && data.month < now.getMonth() ? null : data.month })
                        }
                      >
                        <span className={styles.check} aria-hidden="true" />
                        <span className={`serif ${styles.yearNum}`}>{y}</span>
                        {open && <span className={`meta-sm ${styles.yearTag}`}>BOOKINGS OPEN</span>}
                      </button>
                    );
                  })}
                </div>
                <FieldError id="err-year" message={err("year")} />
                <div className={`${styles.note} ${data.year !== null ? styles.noteOn : ""}`} aria-live="polite">
                  <p className={`${styles.noteInner} ${promoted ? styles.noteMeta : ""}`}>
                    {data.year === null ? "" : promoted ? copy.yearOpen : copy.yearCheck}
                  </p>
                </div>
              </fieldset>
            </div>
          </>
        );
      }
      case "location":
        return (
          <>
            {heading(s.heading, s.kicker)}
            <p className={`meta-sm champagne ${styles.support}`} data-rise>
              {copy.regions}
            </p>
            <div className={styles.fields} data-rise>
              <div className={styles.withPicks}>
                <TextField
                  label="COUNTRY"
                  value={data.country}
                  onChange={setCountry}
                  onBlur={touch("country")}
                  placeholder="Country"
                  autoComplete="country-name"
                  maxLength={LIMITS.place}
                  error={err("country")}
                />
                <div className={styles.picks} aria-label="Quick country picks">
                  {countryPicks.map((c) => (
                    <button
                      key={c.label}
                      type="button"
                      aria-pressed={data.country === c.label}
                      className={`${styles.pick} ${data.country === c.label ? styles.pickOn : ""}`}
                      onClick={() => setCountry(c.label)}
                    >
                      {c.label.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <TextField
                label="CITY / REGION"
                value={data.city}
                onChange={(v) => update({ city: v })}
                onBlur={touch("city")}
                placeholder="City or region"
                autoComplete="address-level2"
                maxLength={LIMITS.place}
                error={err("city")}
              />
              <div className={styles.withPicks}>
                <TextField
                  label="VENUE"
                  value={data.venue}
                  onChange={(v) => update({ venue: v })}
                  placeholder={`Venue name or “${VENUE_UNDECIDED}”`}
                  maxLength={LIMITS.place}
                  optional
                />
                <div className={styles.picks}>
                  <button
                    type="button"
                    aria-pressed={data.venue === VENUE_UNDECIDED}
                    className={`${styles.pick} ${data.venue === VENUE_UNDECIDED ? styles.pickOn : ""}`}
                    onClick={() => update({ venue: data.venue === VENUE_UNDECIDED ? "" : VENUE_UNDECIDED })}
                  >
                    NOT DECIDED YET
                  </button>
                </div>
              </div>
            </div>
          </>
        );
      case "event":
        return (
          <>
            {heading(s.heading, s.kicker)}
            <div className={styles.fields}>
              <div data-rise>
                <ChoiceGroup
                  legend="EVENT TYPE"
                  options={eventTypes}
                  multiple
                  value={data.eventType}
                  onChange={(v) => update({ eventType: v })}
                  error={err("eventType")}
                  columns="three"
                />
              </div>
              <div data-rise>
                <ChoiceGroup
                  legend="NUMBER OF EVENTS / DAYS"
                  options={eventDays}
                  value={data.eventDays}
                  onChange={(v) => update({ eventDays: v })}
                  optional
                  columns="auto"
                  size="small"
                />
              </div>
              <div data-rise>
                <ChoiceGroup
                  legend="APPROXIMATE GUEST COUNT"
                  options={guestCounts}
                  value={data.guestCount}
                  onChange={(v) => update({ guestCount: v })}
                  optional
                  columns="auto"
                  size="small"
                />
              </div>
            </div>
          </>
        );
      case "services":
        return (
          <>
            {heading(s.heading, s.kicker)}
            <div className={styles.fields} data-rise>
              <ChoiceGroup
                legend="SERVICES"
                options={services}
                multiple
                value={data.services}
                onChange={(v) => update({ services: v })}
                error={err("services")}
                columns="two"
              />
            </div>
          </>
        );
      case "budget":
        return (
          <>
            {heading(s.heading, s.kicker)}
            <p className={styles.lede} data-rise>
              {copy.budgetIntro}
            </p>
            <div className={styles.fields} data-rise>
              <BudgetSelector
                budget={data.budget}
                currency={data.currency}
                error={err("budget")}
                onBudget={(b) => update({ budget: b })}
                onCurrency={setCurrency}
              />
            </div>
          </>
        );
      case "story":
        return (
          <>
            {heading(s.heading, s.kicker)}
            <p className={styles.lede} data-rise>
              {copy.storyPrompt}
            </p>
            <div className={styles.fields} data-rise>
              <div className={`${styles.field} ${styles.fieldArea}`}>
                <label htmlFor="inq-story" className={`meta-sm ${styles.label}`}>
                  YOUR STORY<span className={styles.optional}> — OPTIONAL</span>
                </label>
                <div className={styles.inputWrap}>
                  <textarea
                    id="inq-story"
                    rows={6}
                    value={data.story}
                    maxLength={LIMITS.story}
                    onChange={(e) => update({ story: e.target.value })}
                    placeholder={copy.storyPlaceholder}
                  />
                  <span className={styles.underline} aria-hidden="true" />
                </div>
                <span className={`meta-sm ${styles.count}`} aria-hidden="true">
                  {data.story.length} / {LIMITS.story}
                </span>
              </div>
            </div>
          </>
        );
    }
  };

  const rows = summaryRows(data);
  const sending = phase === "sending";

  const renderReview = () => (
    <>
      {heading(["HERE’S WHAT", "WE KNOW SO FAR."], `${data.name.trim().split(/\s+/)[0]?.toUpperCase() || "YOUR"} — YOUR STORY, SO FAR`)}
      <dl className={styles.summary}>
        {rows.map((r) => (
          <div key={r.label} className={`${styles.row} ${r.label === "Story" ? styles.rowWide : ""}`} data-rise>
            <dt className="meta-sm">{r.label.toUpperCase()}</dt>
            <dd className={r.value ? undefined : styles.empty}>{r.value || "—"}</dd>
            <button
              type="button"
              className={`meta-sm ${styles.edit}`}
              onClick={() => edit(ROW_STEP[r.label])}
              disabled={sending}
              aria-label={`Edit ${r.label}`}
            >
              EDIT <Arrow />
            </button>
          </div>
        ))}
      </dl>

      <section className={styles.final} aria-labelledby="inq-final" data-rise>
        <p className="meta-sm champagne">READY TO CONNECT?</p>
        <p id="inq-final" className={`serif ${styles.finalTitle}`}>
          LET’S CREATE
          <br />
          SOMETHING
          <br />
          <em>TIMELESS.</em>
        </p>
        {/* honeypot — bots fill hidden fields */}
        <div className={styles.hp} aria-hidden="true">
          <label htmlFor="inq-website">Website</label>
          <input id="inq-website" type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
        </div>
        <div className={styles.finalActions}>
          <SendButton sending={sending} onClick={send} />
          <a href={wa} target="_blank" rel="noopener noreferrer" className="cta" onClick={onWhatsApp("review")} data-cursor="WHATSAPP">
            <span>OR CONTINUE ON WHATSAPP</span>
            <Arrow />
          </a>
        </div>
        <button type="button" className={`meta-sm ${styles.textBtn}`} onClick={() => goTo(REVIEW - 1)} disabled={sending}>
          <Arrow dir="left" /> EDIT DETAILS
        </button>
      </section>
    </>
  );

  const renderSuccess = () => (
    <div className={styles.outcome} role="status">
      <p className={`meta-sm champagne ${styles.sent}`} data-rise>
        <span className={styles.sentMark} aria-hidden="true" /> INQUIRY SENT
      </p>
      <h2 className={`serif ${styles.outcomeTitle}`} tabIndex={-1}>
        <span className="line">
          <span>YOUR STORY</span>
        </span>
        <span className="line">
          <span className={styles.qItalic}>IS ON ITS WAY.</span>
        </span>
      </h2>
      <p className={styles.lede} data-rise>
        Thank you for reaching out to {brand.name}. {copy.followUp}
      </p>
      <p className={`meta-sm ${styles.touch}`} data-rise>
        WE’LL BE IN TOUCH.
      </p>
      <div className={styles.outcomeActions} data-rise>
        <a href={wa} target="_blank" rel="noopener noreferrer" className="cta cta--primary cta--boxed" onClick={onWhatsApp("success")}>
          <span>CONTINUE ON WHATSAPP</span>
          <Arrow />
        </a>
        <button type="button" className="cta" onClick={requestClose}>
          <span>RETURN TO THE WEBSITE</span>
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
        <SendButton sending={sending} onClick={retry} label="TRY AGAIN" />
        <a href={wa} target="_blank" rel="noopener noreferrer" className="cta cta--primary" onClick={onWhatsApp("error")}>
          <span>CONTINUE ON WHATSAPP</span>
          <Arrow />
        </a>
      </div>
      <p className={`meta-sm ${styles.touch}`} data-rise>
        OR EMAIL US AT{" "}
        <a href={`mailto:${contact.email}`} className={styles.mail}>
          {contact.email}
        </a>
      </p>
    </div>
  );

  const progress = Math.min(view, REVIEW) / REVIEW;
  const isForm = screen === "steps" && view < REVIEW;

  return (
    <div
      ref={rootRef}
      className={`${styles.overlay} ${screen !== "steps" ? styles.overlayOutcome : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={`Wedding inquiry — ${brand.name}`}
    >
      {/* soft photographic backdrop — one layer per chapter, crossfaded */}
      <div className={`${styles.backdrops} ${screen === "success" ? styles.backdropsSuccess : ""}`} aria-hidden="true">
        {BACKDROPS.map((p, i) =>
          seenBackdrops.has(i) ? (
            <div key={p.src} className={`${styles.backdrop} ${i === backdrop ? styles.backdropOn : ""}`}>
              <Photo photo={{ src: p.src, alt: "" }} sizes="60vw" quality={45} />
            </div>
          ) : null
        )}
        <div className={styles.veil} />
      </div>

      <div className={styles.chrome}>
        <div className={styles.brand}>
          <span className={`serif ${styles.brandTop}`}>{brand.wordmark[0]}</span>
          <span className={`meta-sm ${styles.brandSub}`}>THE INQUIRY</span>
        </div>

        {screen === "steps" && (
          <nav className={styles.progress} aria-label="Inquiry progress">
            <ol className={styles.rail}>
              {[...steps.map((s) => s.label), "CONNECT"].map((label, i) => (
                <li key={label}>
                  <button
                    type="button"
                    className={`${styles.railItem} ${i === view ? styles.railOn : ""} ${i < view ? styles.railDone : ""}`}
                    onClick={() => jump(i)}
                    disabled={i > reached || sending}
                    aria-current={i === view ? "step" : undefined}
                  >
                    <span className={styles.railNum}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={styles.railLabel}>{label}</span>
                  </button>
                </li>
              ))}
            </ol>
            <div className={styles.compact} aria-hidden="true">
              <span className="meta-sm">
                {view < REVIEW ? (
                  <>
                    <span className={styles.compactNow}>{String(view + 1).padStart(2, "0")}</span> / {String(REVIEW).padStart(2, "0")} —{" "}
                    {steps[view].label}
                  </>
                ) : (
                  <span className={styles.compactNow}>REVIEW — CONNECT</span>
                )}
              </span>
            </div>
            <div className={styles.track} aria-hidden="true">
              <span className={styles.trackFill} style={{ transform: `scaleX(${Math.max(progress, 0.02)})` }} />
            </div>
          </nav>
        )}

        <button type="button" className={`meta-sm ${styles.close}`} onClick={requestClose} disabled={sending} data-cursor="CLOSE">
          <span className={styles.closeText}>CLOSE</span> <span aria-hidden="true">×</span>
        </button>
      </div>

      <p className="sr-only" aria-live="polite">
        {screen === "steps" ? (view < REVIEW ? `Step ${view + 1} of ${REVIEW}: ${steps[view].label}` : "Review your inquiry") : ""}
      </p>

      <form
        className={styles.frame}
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (isForm) next();
        }}
      >
        <div ref={bodyRef} className={styles.body} data-lenis-prevent>
          {restored && isForm && (
            <div className={styles.restored}>
              <span className="meta-sm">WELCOME BACK — WE KEPT YOUR DETAILS FOR THIS SESSION.</span>
              <button
                type="button"
                className={`meta-sm ${styles.textBtn}`}
                onClick={() => {
                  dir.current = -1;
                  onReset();
                }}
              >
                START OVER
              </button>
            </div>
          )}
          <div ref={panelRef} key={screenKey} className={`${styles.panel} ${view === REVIEW && screen === "steps" ? styles.panelWide : ""}`}>
            {screen === "success" ? renderSuccess() : screen === "error" ? renderError() : view < REVIEW ? renderStep() : renderReview()}
          </div>
        </div>

        {isForm && (
          <div className={styles.foot}>
            <div className={styles.footInner}>
              {view > 0 ? (
                <button type="button" className={`cta ${styles.back}`} onClick={back}>
                  <Arrow dir="left" />
                  <span>BACK</span>
                </button>
              ) : (
                <span className={`meta-sm ${styles.footNote}`}>{brand.booking.toUpperCase()}</span>
              )}
              <div className={styles.footRight}>
                <span className={`meta-sm ${styles.enterHint}`} aria-hidden="true">
                  PRESS ENTER ↵
                </span>
                <button type="submit" className="cta cta--primary cta--boxed" data-cursor="NEXT">
                  <span>{returnToReview ? "BACK TO SUMMARY" : view === REVIEW - 1 ? "REVIEW MY STORY" : "CONTINUE"}</span>
                  <Arrow />
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

function SendButton({ sending, onClick, label = "SEND MY INQUIRY" }: { sending: boolean; onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      className={`cta cta--primary cta--boxed ${styles.send} ${sending ? styles.sending : ""}`}
      onClick={onClick}
      disabled={sending}
      aria-busy={sending}
      data-cursor="SEND"
    >
      <span>{sending ? "SENDING YOUR STORY…" : label}</span>
      {!sending && <Arrow />}
      <span className={styles.sendLine} aria-hidden="true" />
    </button>
  );
}
