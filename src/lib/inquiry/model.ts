/**
 * Inquiry data model — shared by the client flow and the API route.
 * One structured object, one validator, one formatter. No "use client":
 * this module must stay isomorphic.
 */
import {
  budgetRanges,
  currencies,
  eventDays,
  eventTypes,
  guestCounts,
  months,
  preferences,
  services,
  steps,
  VENUE_UNDECIDED,
  type CurrencyCode,
  type StepKey,
} from "@/content/inquiry";

export type Inquiry = {
  name: string;
  email: string;
  phone: string;
  /** 0–11, or null when not chosen. */
  month: number | null;
  year: number | null;
  country: string;
  city: string;
  venue: string;
  eventType: string[];
  eventDays: string;
  guestCount: string;
  services: string[];
  /** Index into budgetRanges[currency], "unsure", or null when not chosen. */
  budget: number | "unsure" | null;
  currency: CurrencyCode;
  /** "What matters most" — optional, multi-select. */
  preferences: string[];
  story: string;
};

export type InquiryErrors = Partial<Record<keyof Inquiry, string>>;

export const emptyInquiry: Inquiry = {
  name: "",
  email: "",
  phone: "",
  month: null,
  year: null,
  country: "",
  city: "",
  venue: "",
  eventType: [],
  eventDays: "",
  guestCount: "",
  services: [],
  budget: null,
  currency: "INR",
  preferences: [],
  story: "",
};

export const LIMITS = { name: 120, email: 200, phone: 32, place: 160, story: 4000 };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** International phone: optional leading +, 7–15 digits (E.164), common separators allowed. */
export function isValidPhone(raw: string): boolean {
  const s = raw.trim();
  if (!/^\+?[\d\s().-]+$/.test(s)) return false;
  const digits = s.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

const ids = (list: { id: string }[]) => new Set(list.map((o) => o.id));
const EVENT_IDS = ids(eventTypes);
const DAY_IDS = ids(eventDays);
const GUEST_IDS = ids(guestCounts);
const SERVICE_IDS = ids(services);
const PREFERENCE_IDS = ids(preferences);

/** Validate the fields that belong to one step. */
export function validateStep(step: StepKey, d: Inquiry): InquiryErrors {
  const e: InquiryErrors = {};
  switch (step) {
    case "you":
      if (!d.name.trim()) e.name = "Please enter your name.";
      break;
    case "reach":
      if (!d.email.trim()) e.email = "Please enter your email address.";
      else if (!EMAIL_RE.test(d.email.trim())) e.email = "Please enter a valid email address.";
      if (!d.phone.trim()) e.phone = "Please enter your WhatsApp or phone number.";
      else if (!isValidPhone(d.phone)) e.phone = "Please enter a valid phone number, including country code (e.g. +1 or +91).";
      break;
    case "date":
      if (d.month === null) e.month = "Please choose a month.";
      if (d.year === null) e.year = "Please choose a year.";
      break;
    case "location":
      if (!d.country.trim()) e.country = "Please tell us the country.";
      if (!d.city.trim()) e.city = "Please tell us the city or region.";
      break;
    case "event":
      if (d.eventType.length === 0) e.eventType = "Please choose at least one type of celebration.";
      break;
    case "services":
      if (d.services.length === 0) e.services = "Please choose at least one service.";
      break;
    case "budget":
      if (d.budget === null) e.budget = "Please choose an approximate range — or “I’m not sure yet”.";
      break;
    case "matters":
    case "story":
      break;
  }
  return e;
}

/** Validate everything (used before submit and again on the server). */
export function validateAll(d: Inquiry): { errors: InquiryErrors; firstInvalidStep: number } {
  let errors: InquiryErrors = {};
  let firstInvalidStep = -1;
  steps.forEach((s, i) => {
    const e = validateStep(s.key, d);
    if (Object.keys(e).length && firstInvalidStep < 0) firstInvalidStep = i;
    errors = { ...errors, ...e };
  });
  return { errors, firstInvalidStep };
}

/**
 * Coerce untrusted input (sessionStorage or a request body) into a clean Inquiry.
 * Unknown option ids are dropped; strings are trimmed to sane limits.
 */
export function sanitizeInquiry(raw: unknown): Inquiry {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const str = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : "");
  const list = (v: unknown, allowed: Set<string>) =>
    Array.isArray(v) ? [...new Set(v.filter((x): x is string => typeof x === "string" && allowed.has(x)))] : [];
  const one = (v: unknown, allowed: Set<string>) => (typeof v === "string" && allowed.has(v) ? v : "");
  const currency = currencies.some((c) => c.code === r.currency) ? (r.currency as CurrencyCode) : "INR";
  const month = typeof r.month === "number" && Number.isInteger(r.month) && r.month >= 0 && r.month < 12 ? r.month : null;
  const year = typeof r.year === "number" && Number.isInteger(r.year) && r.year >= 2000 && r.year <= 2100 ? r.year : null;
  const budget =
    r.budget === "unsure"
      ? "unsure"
      : typeof r.budget === "number" && Number.isInteger(r.budget) && r.budget >= 0 && r.budget < budgetRanges[currency].length
        ? r.budget
        : null;
  return {
    name: str(r.name, LIMITS.name),
    email: str(r.email, LIMITS.email),
    phone: str(r.phone, LIMITS.phone),
    month,
    year,
    country: str(r.country, LIMITS.place),
    city: str(r.city, LIMITS.place),
    venue: str(r.venue, LIMITS.place),
    eventType: list(r.eventType, EVENT_IDS),
    eventDays: one(r.eventDays, DAY_IDS),
    guestCount: one(r.guestCount, GUEST_IDS),
    services: list(r.services, SERVICE_IDS),
    budget,
    currency,
    preferences: list(r.preferences, PREFERENCE_IDS),
    story: str(r.story, LIMITS.story),
  };
}

/* ── human-readable formatting ───────────────────────────────────────── */

const labelOf = (list: { id: string; label: string }[], id: string) => list.find((o) => o.id === id)?.label ?? "";
const titleCase = (s: string) => s.toLowerCase().replace(/(^|[\s(/+–-])(\p{L})/gu, (_, p, c) => p + c.toUpperCase());

export function formatDate(d: Inquiry): string {
  if (d.month === null && d.year === null) return "";
  return [d.month !== null ? titleCase(months[d.month]) : "", d.year ?? ""].filter(Boolean).join(" ");
}
export function formatLocation(d: Inquiry): string {
  return [d.city.trim(), d.country.trim()].filter(Boolean).join(", ");
}
export function formatVenue(d: Inquiry): string {
  return d.venue.trim() || VENUE_UNDECIDED;
}
export function formatEventTypes(d: Inquiry): string {
  return d.eventType.map((id) => titleCase(labelOf(eventTypes, id))).join(", ");
}
export function formatDays(d: Inquiry): string {
  return d.eventDays ? titleCase(labelOf(eventDays, d.eventDays)) : "";
}
export function formatGuests(d: Inquiry): string {
  return d.guestCount ? titleCase(labelOf(guestCounts, d.guestCount)) : "";
}
export function formatServices(d: Inquiry): string {
  return d.services.map((id) => titleCase(labelOf(services, id))).join(", ");
}
export function formatPreferences(d: Inquiry): string {
  return d.preferences.map((id) => titleCase(labelOf(preferences, id))).join(", ");
}
export function formatBudget(d: Inquiry): string {
  if (d.budget === "unsure") return "Not sure yet";
  if (d.budget === null) return "";
  return `${budgetRanges[d.currency][d.budget]} ${d.currency}`;
}

export type SummaryRow = { label: string; value: string; /** The step that edits this field. */ step: StepKey };

/** Ordered label/value pairs — used by the review screen and the webhook payload. */
export function summaryRows(d: Inquiry): SummaryRow[] {
  return [
    { label: "Name", value: d.name.trim(), step: "you" },
    { label: "Email", value: d.email.trim(), step: "reach" },
    { label: "Phone / WhatsApp", value: d.phone.trim(), step: "reach" },
    { label: "Month", value: d.month !== null ? titleCase(months[d.month]) : "", step: "date" },
    { label: "Year", value: d.year !== null ? String(d.year) : "", step: "date" },
    { label: "Country", value: d.country.trim(), step: "location" },
    { label: "City / Region", value: d.city.trim(), step: "location" },
    { label: "Venue", value: formatVenue(d), step: "location" },
    { label: "Event", value: formatEventTypes(d), step: "event" },
    { label: "Number of Days", value: formatDays(d), step: "event" },
    { label: "Guest Count", value: formatGuests(d), step: "event" },
    { label: "Services", value: formatServices(d), step: "services" },
    { label: "Investment Range", value: formatBudget(d), step: "budget" },
    { label: "Preferences", value: formatPreferences(d), step: "matters" },
    { label: "Story", value: d.story.trim(), step: "story" },
  ];
}
