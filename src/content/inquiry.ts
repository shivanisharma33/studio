/**
 * INQUIRY FLOW — copy and option lists for the wedding inquiry.
 */

export type Option = { id: string; label: string };

export type CurrencyCode = "INR" | "USD" | "CAD";

export const currencies: { code: CurrencyCode; symbol: string; label: string }[] = [
  { code: "INR", symbol: "₹", label: "₹ INR" },
  { code: "USD", symbol: "$", label: "$ USD" },
  { code: "CAD", symbol: "$", label: "$ CAD" },
];

export const budgetRanges: Record<CurrencyCode, string[]> = {
  INR: ["Under ₹1L", "₹1L – ₹2L", "₹2L – ₹3L", "₹3L – ₹5L", "₹5L – ₹7L", "₹7L – ₹10L", "₹10L+"],
  USD: ["Under $3K", "$3K – $5K", "$5K – $8K", "$8K – $12K", "$12K – $20K", "$20K – $30K", "$30K+"],
  CAD: ["Under $3K", "$3K – $5K", "$5K – $8K", "$8K – $12K", "$20K – $30K", "$30K+"],
};

export const countryPicks: { label: string; currency: CurrencyCode }[] = [
  { label: "Canada", currency: "CAD" },
  { label: "United States", currency: "USD" },
  { label: "India", currency: "INR" },
];

export function currencyForCountry(country: string): CurrencyCode | null {
  const c = country.trim().toLowerCase();
  if (!c) return null;
  if (/^(india|bharat|in)$/.test(c)) return "INR";
  if (/^(canada|ca)$/.test(c)) return "CAD";
  if (/^(united states( of america)?|usa|us|u\.s\.a?\.?|america)$/.test(c)) return "USD";
  return null;
}

export const months = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
];

export const promotedYears = [2026, 2027];

export function yearOptions(now = new Date()): number[] {
  const y = now.getFullYear();
  return [y, y + 1, y + 2, y + 3, y + 4];
}

export const eventTypes: Option[] = [];
export const eventDays: Option[] = [];
export const guestCounts: Option[] = [];
export const services: Option[] = [];
export const preferences: Option[] = [];
export const VENUE_UNDECIDED = "Not decided yet";

export const steps = [
  { key: "event", label: "EVENT DETAILS", kicker: "STEP 1 OF 2", heading: ["EVENT", "DETAILS"] },
  { key: "contact", label: "CONTACT DETAILS", kicker: "STEP 2 OF 2", heading: ["CONTACT", "DETAILS"] },
] as const;

export type StepKey = (typeof steps)[number]["key"];

export const budgetList: string[] = [
  "₹1.5L – ₹2.5L",
  "₹2.5L – ₹4L",
  "₹4L – ₹6L",
  "₹6L – ₹10L",
  "₹10L+",
  "Under $5,000 USD/CAD",
  "$5,000 – $10,000 USD/CAD",
  "$10,000+ USD/CAD",
  "Flexible / Custom",
];

export const copy = {
  budgetIntro: "Pricing is customized around your needs, vision, location and story.",
  budgetThanks: "Thank you.",
  budgetUnsure: "We’ll discuss your vision during consultation.",
  dateReceived: "DATE REQUEST RECEIVED — WE’LL CHECK YOUR DATE.",
  regions: "NORTH AMERICA · INDIA · DESTINATION WEDDINGS",
  storyPrompt: "Event Details & Dates",
  storyPlaceholder: "Tell us about your event details and dates...",
  followUp: "We’ll do our best to get back to you as soon as possible.",
};
