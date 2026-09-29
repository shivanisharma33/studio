/**
 * COUNTDOWN — only for a REAL Studio Kunal deadline (an actual booking window,
 * consultation deadline or event). Off by default: when disabled, or when the
 * date is missing, invalid or already past, the timer does not render at all.
 *
 * Enable here, or without a code change via environment variables:
 *   NEXT_PUBLIC_COUNTDOWN_ENABLED=true
 *   NEXT_PUBLIC_COUNTDOWN_DATE=2027-01-31T23:59:59-05:00   (include the timezone offset)
 *   NEXT_PUBLIC_COUNTDOWN_LABEL=…                          (describe the real deadline)
 *
 * Never use this to invent scarcity ("only 3 dates left", "closing soon").
 */
export const COUNTDOWN_ENABLED = process.env.NEXT_PUBLIC_COUNTDOWN_ENABLED === "true" || false;
export const COUNTDOWN_DATE = process.env.NEXT_PUBLIC_COUNTDOWN_DATE || ""; // "YYYY-MM-DDTHH:mm:ss±hh:mm"
export const COUNTDOWN_LABEL = process.env.NEXT_PUBLIC_COUNTDOWN_LABEL || "";
