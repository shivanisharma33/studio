"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { emptyInquiry, sanitizeInquiry, type Inquiry } from "@/lib/inquiry/model";
import { track } from "@/lib/inquiry/analytics";
import { REVIEW, stepName, type FlowState, type Phase } from "./types";
import InquiryFlow from "./InquiryFlow";
import FloatingInquire from "./FloatingInquire";

/**
 * One inquiry flow for the whole page. Every CTA calls open(source); the flow's
 * state lives here (a single structured object) so closing and reopening
 * continues where the visitor left off. Progress is mirrored to sessionStorage —
 * it survives a reload in the same tab and is gone when the tab closes.
 */

type Ctx = {
  isOpen: boolean;
  hasProgress: boolean;
  open: (source: string) => void;
};

const InquiryContext = createContext<Ctx | null>(null);

export function useInquiry(): Ctx {
  const ctx = useContext(InquiryContext);
  if (!ctx) throw new Error("useInquiry must be used inside <InquiryProvider>");
  return ctx;
}

const STORAGE_KEY = "sk-inquiry-v1";
const initial: FlowState = { data: emptyInquiry, view: 0, reached: 0, currencyTouched: false };

const isStarted = (d: Inquiry) => JSON.stringify(d) !== JSON.stringify(emptyInquiry);

function load(): FlowState | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Partial<FlowState>;
    const clampView = (n: unknown) => (typeof n === "number" && n >= 0 && n <= REVIEW ? Math.floor(n) : 0);
    return {
      data: sanitizeInquiry(p.data),
      view: clampView(p.view),
      reached: clampView(p.reached),
      currencyTouched: Boolean(p.currencyTouched),
    };
  } catch {
    return null;
  }
}

export default function InquiryProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [state, setState] = useState<FlowState>(initial);
  const [phase, setPhase] = useState<Phase>("form");
  const [restored, setRestored] = useState(false);
  const hydrated = useRef(false);
  const startedTracked = useRef(false);
  const returnFocus = useRef<HTMLElement | null>(null);

  // Restore this tab's progress once on mount.
  useEffect(() => {
    const saved = load();
    if (saved && isStarted(saved.data)) {
      setState(saved);
      setRestored(true);
      startedTracked.current = true;
    }
    hydrated.current = true;
  }, []);

  // Mirror progress to sessionStorage (never localStorage — nothing persists past the tab).
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      if (phase === "success" || !isStarted(state.data)) sessionStorage.removeItem(STORAGE_KEY);
      else sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable (private mode) — the in-memory state still works */
    }
    if (!startedTracked.current && isStarted(state.data)) {
      startedTracked.current = true;
      track("inquiry_started");
    }
  }, [state, phase]);

  const open = useCallback((source: string) => {
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setOpen(true);
    track("inquiry_opened", { source });
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    if (phase === "success") {
      // A finished inquiry starts fresh next time.
      setState(initial);
      setPhase("form");
      setRestored(false);
      startedTracked.current = false;
    } else {
      if (isStarted(state.data)) track("inquiry_abandoned", { step: stepName(state.view) });
      if (phase === "error") setPhase("form");
      if (isStarted(state.data)) setRestored(true);
    }
    requestAnimationFrame(() => returnFocus.current?.focus({ preventScroll: true }));
  }, [phase, state]);

  const reset = useCallback(() => {
    setState(initial);
    setPhase("form");
    setRestored(false);
  }, []);

  // Deep link: /#inquire opens the flow.
  useEffect(() => {
    const check = () => {
      if (window.location.hash === "#inquire") {
        open("deep-link");
        history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    };
    check();
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
  }, [open]);

  // Leaving the page mid-inquiry counts as abandonment.
  useEffect(() => {
    if (!isOpen) return;
    const onHide = () => {
      if (phase !== "success" && isStarted(state.data)) track("inquiry_abandoned", { step: stepName(state.view), reason: "pagehide" });
    };
    window.addEventListener("pagehide", onHide);
    return () => window.removeEventListener("pagehide", onHide);
  }, [isOpen, phase, state]);

  const ctx = useMemo<Ctx>(() => ({ isOpen, hasProgress: isStarted(state.data) && phase !== "success", open }), [isOpen, state.data, phase, open]);

  return (
    <InquiryContext.Provider value={ctx}>
      {children}
      <FloatingInquire />
      {isOpen && (
        <InquiryFlow
          state={state}
          setState={setState}
          phase={phase}
          setPhase={setPhase}
          restored={restored}
          onDismissRestored={() => setRestored(false)}
          onReset={reset}
          onClose={close}
        />
      )}
    </InquiryContext.Provider>
  );
}
