/**
 * INQUIRY FLOW — copy and option lists for the multi-step wedding inquiry.
 *
 * ▸ Budget ranges are INQUIRY QUALIFICATION brackets, not Studio Kunal prices.
 *   The live site states "no fixed packages — customized pricing"; the UI labels
 *   every range "APPROXIMATE INVESTMENT RANGE — NOT A PACKAGE PRICE".
 * ▸ Each currency has its own brackets. Nothing is converted between currencies.
 *   Tune the brackets with the studio before launch — nothing else needs to change.
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
  CAD: ["Under $3K", "$3K – $5K", "$5K – $8K", "$8K – $12K", "$12K – $20K", "$20K – $30K", "$30K+"],
};

/** Quick picks for the country field — the regions the studio names on its site. */
export const countryPicks: { label: string; currency: CurrencyCode }[] = [
  { label: "Canada", currency: "CAD" },
  { label: "United States", currency: "USD" },
  { label: "India", currency: "INR" },
];

/** Infer a default currency from free-text country input. Returns null when unknown. */
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

/** Years the live site promotes: "Bookings Open for 2026–2027". */
export const promotedYears = [2026, 2027];

/** This year plus the next four (2026 → 2030 today). */
export function yearOptions(now = new Date()): number[] {
  const y = now.getFullYear();
  return [y, y + 1, y + 2, y + 3, y + 4];
}

export const eventTypes: Option[] = [
  { id: "wedding", label: "WEDDING" },
  { id: "engagement", label: "ENGAGEMENT" },
  { id: "pre-wedding", label: "PRE-WEDDING" },
  { id: "reception", label: "RECEPTION" },
  { id: "destination-wedding", label: "DESTINATION WEDDING" },
  { id: "other", label: "OTHER" },
];

export const eventDays: Option[] = [
  { id: "1", label: "1 DAY" },
  { id: "2", label: "2 DAYS" },
  { id: "3", label: "3 DAYS" },
  { id: "4+", label: "4+ DAYS" },
  { id: "unsure", label: "NOT SURE YET" },
];

export const guestCounts: Option[] = [
  { id: "<50", label: "UNDER 50" },
  { id: "50-100", label: "50–100" },
  { id: "100-250", label: "100–250" },
  { id: "250-500", label: "250–500" },
  { id: "500+", label: "500+" },
  { id: "unsure", label: "NOT SURE YET" },
];

export const services: Option[] = [
  { id: "photography", label: "PHOTOGRAPHY" },
  { id: "cinematography", label: "CINEMATOGRAPHY" },
  { id: "photo-cine", label: "PHOTOGRAPHY + CINEMATOGRAPHY" },
  { id: "pre-wedding", label: "PRE-WEDDING" },
  { id: "other", label: "OTHER" },
];

/** "What matters most" — multi-select, optional. */
export const preferences: Option[] = [
  { id: "natural-moments", label: "NATURAL MOMENTS" },
  { id: "cinematic-films", label: "CINEMATIC FILMS" },
  { id: "editorial-portraits", label: "EDITORIAL PORTRAITS" },
  { id: "emotional-storytelling", label: "EMOTIONAL STORYTELLING" },
  { id: "traditional-moments", label: "TRADITIONAL MOMENTS" },
  { id: "candid-photography", label: "CANDID PHOTOGRAPHY" },
  { id: "destination-coverage", label: "DESTINATION COVERAGE" },
  { id: "full-experience", label: "FULL WEDDING EXPERIENCE" },
  { id: "other", label: "OTHER" },
];

export const VENUE_UNDECIDED = "Not decided yet";

/** Step chapters — label shown in the progress rail, heading lines shown large. */
export const steps = [
  { key: "you", label: "YOU", kicker: "LET’S START WITH YOU.", heading: ["WHAT SHOULD WE", "CALL YOU?"] },
  { key: "reach", label: "REACH", kicker: "SO WE CAN CONTINUE THE CONVERSATION.", heading: ["WHERE CAN WE", "REACH YOU?"] },
  { key: "date", label: "DATE", kicker: "LET’S CHECK YOUR DATE.", heading: ["WHEN IS YOUR STORY", "HAPPENING?"] },
  { key: "location", label: "LOCATION", kicker: "WHERE WILL IT TAKE PLACE?", heading: ["WHERE WILL", "IT HAPPEN?"] },
  { key: "event", label: "EVENT", kicker: "THE SHAPE OF YOUR CELEBRATION.", heading: ["TELL US ABOUT", "THE CELEBRATION."] },
  { key: "services", label: "SERVICES", kicker: "DOCUMENTARY · EDITORIAL · CINEMATIC", heading: ["WHAT WOULD YOU LIKE", "US TO CREATE?"] },
  { key: "budget", label: "INVESTMENT", kicker: "EVERY STORY IS DIFFERENT.", heading: ["WHAT ARE YOU PLANNING", "TO INVEST IN YOUR STORY?"] },
  { key: "matters", label: "PRIORITIES", kicker: "CHOOSE AS MANY AS FEEL RIGHT.", heading: ["WHAT MATTERS", "MOST TO YOU?"] },
  { key: "story", label: "STORY", kicker: "IN YOUR OWN WORDS.", heading: ["TELL US A LITTLE", "ABOUT YOUR STORY."] },
] as const;

export type StepKey = (typeof steps)[number]["key"];

export const copy = {
  budgetIntro:
    "Every celebration is unique, which is why our pricing is customized around your needs, vision, event details, requirements, location and story.",
  budgetThanks: "Thank you — this helps us understand how to shape the right experience for you.",
  budgetUnsure: "That’s completely fine. We’ll discuss your vision and requirements during the consultation.",
  /** Shown once a month and year are chosen — acknowledges the request, never implies availability. */
  dateReceived: "DATE REQUEST RECEIVED — WE’LL CHECK YOUR DATE.",
  regions: "NORTH AMERICA · INDIA · DESTINATION WEDDINGS",
  storyPrompt: "Optional — but often our favourite part to read.",
  storyPlaceholder:
    "Tell us about your celebration, your vision, what you’re looking for, or anything you want us to know.",
  /** From the live site's Get In Touch page — no response-time promise. */
  followUp: "We’ll do our best to get back to you as soon as possible.",
};
