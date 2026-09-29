import { contact } from "@/content/site";
import {
  formatBudget,
  formatDate,
  formatDays,
  formatEventTypes,
  formatGuests,
  formatLocation,
  formatServices,
  type Inquiry,
} from "./model";

/** Keep the pre-filled text comfortably inside URL limits on every platform. */
const MAX_STORY = 900;

/** Build the pre-filled WhatsApp message from whatever the visitor has entered so far. */
export function buildWhatsAppMessage(d: Inquiry): string {
  const rows: [string, string][] = [
    ["Name", d.name.trim()],
    ["Email", d.email.trim()],
    ["Wedding Date", formatDate(d)],
    ["Location", formatLocation(d)],
    ["Venue", d.venue.trim()],
    ["Event Type", formatEventTypes(d)],
    ["Events / Days", formatDays(d)],
    ["Services", formatServices(d)],
    ["Guest Count", formatGuests(d)],
    ["Approx. Investment", formatBudget(d)],
  ];
  const details = rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`);

  let story = d.story.trim();
  if (story.length > MAX_STORY) story = story.slice(0, MAX_STORY).trimEnd() + "…";

  return [
    "Hi Studio Kunal Photography! I’d love to discuss my wedding photography/cinematography.",
    details.length ? "\n" + details.join("\n") : "",
    story ? `\nHere’s a little about our story:\n${story}` : "",
    "\nI’d love to know more about availability and the next steps.",
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * wa.me link to the studio's real WhatsApp (the number linked on the live site).
 * wa.me opens the app on mobile and WhatsApp Web / Desktop on desktop.
 */
export function whatsappUrl(d: Inquiry): string {
  const base = contact.whatsapp.split("?")[0];
  return `${base}?text=${encodeURIComponent(buildWhatsAppMessage(d))}`;
}
