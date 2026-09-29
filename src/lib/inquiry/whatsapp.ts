import { contact } from "@/content/site";
import {
  formatBudget,
  formatDate,
  formatDays,
  formatEventTypes,
  formatGuests,
  formatLocation,
  formatPreferences,
  formatServices,
  type Inquiry,
} from "./model";

/** Keep the pre-filled text comfortably inside URL limits on every platform. */
const MAX_STORY = 900;

/** The studio's real WhatsApp number — digits only, taken from the link on the live site. */
const PHONE = contact.whatsapp.split("?")[0].replace(/\D/g, "");

/** A short opener for the floating "Chat on WhatsApp" button (no inquiry data yet). */
export const GREETING = "Hi Studio Kunal Photography! I’d love to know more about your wedding photography & cinematography.";

/** Build the pre-filled WhatsApp message from whatever the visitor has entered so far. */
export function buildWhatsAppMessage(d: Inquiry): string {
  const rows: [string, string][] = [
    ["Name", d.name.trim()],
    ["Wedding Date", formatDate(d)],
    ["Location", formatLocation(d)],
    ["Venue", d.venue.trim()],
    ["Event", formatEventTypes(d)],
    ["Event Days", formatDays(d)],
    ["Guest Count", formatGuests(d)],
    ["Services", formatServices(d)],
    ["Approx. Investment", formatBudget(d)],
    ["What Matters Most", formatPreferences(d)],
  ];
  const details = rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`);

  let story = d.story.trim();
  if (story.length > MAX_STORY) story = story.slice(0, MAX_STORY).trimEnd() + "…";

  return [
    "Hi Studio Kunal Photography! I’d love to discuss my wedding photography/cinematography.",
    details.length ? "\n" + details.join("\n") : "",
    story ? `\nA little about our story:\n${story}` : "",
    "\nCould you please check our date and share the next steps?",
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Link to the studio's WhatsApp with the text pre-filled (encodeURIComponent).
 * ▸ "app" (default, and what the server renders): wa.me — opens the WhatsApp app on
 *   phones and offers Desktop/Web on computers.
 * ▸ "web": WhatsApp Web directly — used on desktop once the client knows it is one.
 */
export function whatsappLink(text: string, target: "app" | "web" = "app"): string {
  const t = encodeURIComponent(text);
  return target === "web" ? `https://web.whatsapp.com/send?phone=${PHONE}&text=${t}` : `https://wa.me/${PHONE}?text=${t}`;
}

export function whatsappUrl(d: Inquiry, target: "app" | "web" = "app"): string {
  return whatsappLink(buildWhatsAppMessage(d), target);
}
