"use client";

/**
 * Analytics-ready inquiry events. No third-party dependency: every event is
 *   1. dispatched as a DOM CustomEvent "sk:analytics" (listen from anywhere), and
 *   2. pushed to window.dataLayer / window.gtag if a tag manager is added later.
 * Never pass personal data (name, email, phone, story) as event properties.
 */
export type InquiryEvent =
  | "inquiry_opened"
  | "inquiry_started"
  | "step_completed"
  | "date_selected"
  | "location_selected"
  | "event_type_selected"
  | "service_selected"
  | "budget_selected"
  | "inquiry_submitted"
  | "inquiry_failed"
  | "whatsapp_clicked"
  | "inquiry_abandoned";

type Props = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: InquiryEvent, props: Props = {}) {
  if (typeof window === "undefined") return;
  try {
    window.dispatchEvent(new CustomEvent("sk:analytics", { detail: { event, ...props } }));
    window.dataLayer?.push({ event, ...props });
    window.gtag?.("event", event, props);
    if (process.env.NODE_ENV !== "production") console.debug("[analytics]", event, props);
  } catch {
    /* analytics must never break the flow */
  }
}
