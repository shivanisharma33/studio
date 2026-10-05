/**
 * Inquiry data model — shared by the client flow and the API route.
 * One structured object, one validator, one formatter. No "use client":
 * this module must stay isomorphic.
 */
import {
  budgetRanges,
  currencies,
  months,
  steps,
  VENUE_UNDECIDED,
  type CurrencyCode,
  type StepKey,
} from "@/content/inquiry";

export type Inquiry = {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  sessionType: string;
  eventDetails: string;
  city: string;
  venue: string;
  month: number | null;
  year: number | null;
  country: string;
  eventType: string[];
  eventDays: string;
  guestCount: string;
  services: string[];
  budget: string;
  currency: CurrencyCode;
  preferences: string[];
  story: string;
};

export type InquiryErrors = Partial<Record<keyof Inquiry, string>>;

export const emptyInquiry: Inquiry = {
  name: "",
  lastName: "",
  email: "",
  phone: "",
  sessionType: "Wedding",
  eventDetails: "",
  city: "",
  venue: "",
  month: null,
  year: null,
  country: "",
  eventType: ["Wedding"],
  eventDays: "",
  guestCount: "",
  services: [],
  budget: "",
  currency: "INR",
  preferences: [],
  story: "",
};

export const LIMITS = { name: 120, email: 200, phone: 32, place: 160, story: 4000 };

export function isValidPhone(raw: string): boolean {
  const s = raw.trim();
  if (!/^\+?[\d\s().-]+$/.test(s)) return false;
  const digits = s.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

/** Validate fields for each step. */
export function validateStep(step: StepKey, d: Inquiry): InquiryErrors {
  const e: InquiryErrors = {};
  if (step === "event") {
    if (!d.city.trim()) e.city = "Venue & City is required.";
    if (!d.eventDetails.trim()) e.eventDetails = "Event & Dates are required.";
    if (!d.budget?.trim()) e.budget = "Please select an estimated budget.";
  } else if (step === "contact") {
    if (!d.name.trim()) e.name = "Your Name is required.";
    if (!d.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email.trim())) e.email = "Please enter a valid email address.";
    if (!d.phone.trim()) e.phone = "Phone number is required.";
    else if (!isValidPhone(d.phone)) e.phone = "Please enter a valid phone number.";
    if (!d.sessionType?.trim()) e.sessionType = "Please select the type of session.";
  }
  return e;
}

/** Validate everything before submit. */
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

export function sanitizeInquiry(raw: unknown): Inquiry {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const str = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : "");
  const currency = currencies.some((c) => c.code === r.currency) ? (r.currency as CurrencyCode) : "INR";
  const session = str(r.sessionType, 80) || "Wedding";
  const budget = str(r.budget, 80);
  return {
    name: str(r.name, LIMITS.name),
    lastName: str(r.lastName, LIMITS.name),
    email: str(r.email, LIMITS.email),
    phone: str(r.phone, LIMITS.phone),
    sessionType: session,
    eventDetails: str(r.eventDetails || r.story, LIMITS.story),
    city: str(r.city, LIMITS.place),
    venue: str(r.venue, LIMITS.place),
    month: null,
    year: null,
    country: str(r.country, LIMITS.place),
    eventType: [session],
    eventDays: "",
    guestCount: "",
    services: [],
    budget,
    currency,
    preferences: [],
    story: str(r.story || r.eventDetails, LIMITS.story),
  };
}

const titleCase = (s: string) => s.toLowerCase().replace(/(^|[\s(/+–-])(\p{L})/gu, (_, p, c) => p + c.toUpperCase());

export function formatDate(d: Inquiry): string {
  if (d.eventDetails.trim()) return d.eventDetails.trim();
  if (d.month === null && d.year === null) return "";
  return [d.month !== null ? titleCase(months[d.month]) : "", d.year ?? ""].filter(Boolean).join(" ");
}
export function formatLocation(d: Inquiry): string {
  return [d.city.trim(), d.country.trim()].filter(Boolean).join(", ");
}
export function formatVenue(d: Inquiry): string {
  return d.venue.trim() || d.city.trim() || VENUE_UNDECIDED;
}
export function formatDays(d: Inquiry): string {
  return d.eventDays || "";
}
export function formatEventTypes(d: Inquiry): string {
  return d.sessionType || d.eventType.join(", ");
}
export function formatGuests(d: Inquiry): string {
  return d.guestCount || "";
}
export function formatServices(d: Inquiry): string {
  return d.services.join(", ");
}
export function formatPreferences(d: Inquiry): string {
  return d.preferences.join(", ");
}
export function formatBudget(d: Inquiry): string {
  return d.budget || "";
}

export type SummaryRow = { label: string; value: string; step: StepKey };

export function summaryRows(d: Inquiry): SummaryRow[] {
  return [
    { label: "Venue & City", value: d.city.trim(), step: "event" },
    { label: "Event & Dates", value: d.eventDetails.trim() || d.story.trim(), step: "event" },
    { label: "Estimated Budget", value: d.budget.trim(), step: "event" },
    { label: "Your Name", value: d.name.trim(), step: "contact" },
    { label: "Phone", value: d.phone.trim(), step: "contact" },
    { label: "Email", value: d.email.trim(), step: "contact" },
    { label: "Type of Session", value: d.sessionType.trim(), step: "contact" },
  ];
}
