"use client";

import type { Inquiry } from "./model";

/**
 * Submission layer. Defaults to the site's own API route (/api/contact), which
 * validates and forwards server-side to CONTACT_WEBHOOK_URL. To post straight to
 * a public form endpoint instead (e.g. Formspree), set NEXT_PUBLIC_INQUIRY_ENDPOINT.
 * Never put private API keys in NEXT_PUBLIC_* variables.
 */
const ENDPOINT = process.env.NEXT_PUBLIC_INQUIRY_ENDPOINT || "/api/contact";

export type SubmitResult = { ok: true } | { ok: false; error: string };

export async function submitInquiry(data: Inquiry, honeypot: string): Promise<SubmitResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ ...data, website: honeypot, source: "inquiry-flow" }),
      signal: controller.signal,
    });
    let json: { ok?: boolean; error?: string } = {};
    try {
      json = await res.json();
    } catch {
      /* non-JSON response */
    }
    // Third-party endpoints may not return { ok }, so trust the HTTP status unless ok is explicitly false.
    if (!res.ok || json.ok === false) return { ok: false, error: json.error || "Please try again." };
    return { ok: true };
  } catch {
    return { ok: false, error: "Please check your connection and try again." };
  } finally {
    clearTimeout(timer);
  }
}
