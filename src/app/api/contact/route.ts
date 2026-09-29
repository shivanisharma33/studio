import { NextResponse } from "next/server";
import { sanitizeInquiry, summaryRows, validateAll } from "@/lib/inquiry/model";

/**
 * Inquiry endpoint. Re-validates the structured inquiry with the same rules as
 * the client, then forwards it to CONTACT_WEBHOOK_URL (Formspree / Make / Zapier /
 * your own mailer). Without a webhook the inquiry is only logged in development;
 * in production it returns 503 so the visitor is never told a message was sent
 * when it was not — the flow then offers WhatsApp with their details pre-filled.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot — bots fill hidden fields.
  if (typeof body.website === "string" && body.website) return NextResponse.json({ ok: true });

  const inquiry = sanitizeInquiry(body);
  const { errors } = validateAll(inquiry);
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, error: "Please complete every required field.", fields: errors }, { status: 422 });
  }

  const rows = summaryRows(inquiry);
  const payload = {
    ...inquiry,
    // Readable fields for mailers that just print the JSON body.
    summary: rows.map((r) => `${r.label}: ${r.value || "—"}`).join("\n"),
    _subject: `Wedding inquiry — ${inquiry.name.trim()}`,
    _replyto: inquiry.email.trim(),
    source: "studiokunalphotography.com",
    submittedAt: new Date().toISOString(),
  };

  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (!webhook) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] inquiry (no CONTACT_WEBHOOK_URL — dev log only)\n" + payload.summary);
      return NextResponse.json({ ok: true, delivered: false });
    }
    console.error("[contact] CONTACT_WEBHOOK_URL is not configured — inquiry not delivered.");
    return NextResponse.json(
      { ok: false, error: "Our inquiry form is temporarily unavailable. Please continue on WhatsApp or email us directly." },
      { status: 503 }
    );
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`Webhook ${res.status}`);
  } catch (err) {
    console.error("[contact] webhook failed", err);
    return NextResponse.json({ ok: false, error: "Please try again, or continue on WhatsApp." }, { status: 502 });
  }

  return NextResponse.json({ ok: true, delivered: true });
}
