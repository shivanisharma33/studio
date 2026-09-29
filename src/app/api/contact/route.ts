import { NextResponse } from "next/server";

/**
 * Inquiry endpoint. Validates, then forwards to CONTACT_WEBHOOK_URL when set
 * (Formspree / Make / Zapier / your own mailer). Without it, the inquiry is
 * logged server-side so the form still completes during development.
 */
export async function POST(req: Request) {
  let body: { name?: string; email?: string; message?: string; website?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot — bots fill hidden fields.
  if (body.website) return NextResponse.json({ ok: true });

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const message = (body.message ?? "").trim();

  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 10) {
    return NextResponse.json({ ok: false, error: "Please complete every field." }, { status: 422 });
  }

  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name, email, message, source: "studiokunalphotography.com" }),
      });
      if (!res.ok) throw new Error(`Webhook ${res.status}`);
    } catch (err) {
      console.error("[contact] webhook failed", err);
      return NextResponse.json({ ok: false, error: "We couldn’t send your message. Please email us directly." }, { status: 502 });
    }
  } else {
    console.info("[contact] inquiry", { name, email, message });
  }

  return NextResponse.json({ ok: true });
}
