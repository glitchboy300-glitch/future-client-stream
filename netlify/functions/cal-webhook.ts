import type { Handler } from "@netlify/functions";
import crypto from "node:crypto";

/* =========================================================
   Cal.com Webhook Handler — v2
   Last updated: 2026-05-22

   Receives BOOKING_CREATED (and BOOKING_CANCELLED) events
   and schedules a 3-email pre-call asset sequence via Resend.

   Env vars (set in Netlify):
   - RESEND_API_KEY      (required)
   - CAL_WEBHOOK_SECRET  (required — HMAC-SHA256 verification)

   v2 changes vs v1 (which was misfiring as observed 2026-05-22):
   - FIX  scheduledAt → scheduled_at  (Resend API expects snake_case;
          v1 sent camelCase which Resend silently ignored,
          so all 3 emails fired immediately on every booking).
   - FIX  Email 2 schedule  = call_time - 24h
          (v1 was "tomorrow at 2pm UTC" relative to booking).
   - FIX  Email 3 schedule  = call_time - 1h
          (v1 was "day of call at 9am UTC").
   - ADD  Idempotency-Key header on every Resend call,
          keyed on bookingUid + email index. Cal.com webhook
          retries become no-ops at Resend.
   - ADD  HMAC-SHA256 verification of incoming Cal.com webhook
          via the X-Cal-Signature-256 header. Rejects forged requests.
   - ADD  Sequential sends with per-email try/catch so a
          single failure does not 5xx the handler and trigger a
          retry storm.
   - ADD  Past-time check on Email 2 / 3 — skip if scheduled time
          is in the past (booking < 24h or < 1h before call).
   ========================================================= */

const RESEND_API = "https://api.resend.com/emails";
const FROM_EMAIL = "Muawaz <muawaz@genspeak.io>";

const GAMMA_RESULTS =
  "https://gamma.app/docs/Social-Proof-uvhjwd6f3xp02pz";
const GAMMA_SCRIPTS =
  "https://gamma.app/docs/How-We-Create-Your-Scripts-xizvcfbtokplsr7";

// Resend's hard limit on scheduled_at is 30 days in the future.
// If a call is booked further out, we skip scheduling Email 2/3
// and log it — Muawaz can send those manually closer to the date.
const RESEND_MAX_SCHEDULE_MS = 29 * 24 * 60 * 60 * 1000;

// Resend's minimum scheduled_at is 60 seconds in the future.
// Anything closer gets a 422 "must be a future date" error.
// We add the safety floor so the past-time check skips those.
const RESEND_MIN_SCHEDULE_MS = 60 * 1000;

// -------------------------------------------------------------
// Types
// -------------------------------------------------------------

interface CalBooking {
  triggerEvent: string;
  payload: {
    uid: string;
    title: string;
    startTime: string; // ISO 8601
    endTime: string;
    attendees: {
      name: string;
      email: string;
      timeZone?: string;
    }[];
    organizer: {
      name: string;
      email: string;
      timeZone: string;
    };
  };
}

export type EmailToSend = {
  to: string;
  subject: string;
  html: string;
  text: string;
  scheduledAt: Date | null;
  idempotencyKey: string;
  emailIndex: 1 | 2 | 3;
};

// -------------------------------------------------------------
// Date helpers
// -------------------------------------------------------------

function formatDate(isoTime: string, timeZone: string): string {
  return new Date(isoTime).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone,
  });
}

function formatTime(isoTime: string, timeZone: string): string {
  return new Date(isoTime).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
    timeZone,
  });
}

// -------------------------------------------------------------
// Email bodies (HTML + plain text)
// -------------------------------------------------------------

function email1Html(firstName: string, prettyDate: string, prettyTime: string): string {
  return `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#f6f7f9;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f6f7f9;">
  <tr><td align="center" style="padding:24px 12px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;background:#ffffff;border-radius:8px;padding:32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#1a1a1a;">
      <tr><td>
        <p style="margin:0 0 16px;">Hey ${firstName},</p>
        <p style="margin:0 0 16px;">Your call is booked in. Nice one.</p>
        <p style="margin:0 0 16px;">Just to re-confirm, it's <strong>${prettyDate} at ${prettyTime}</strong>.</p>
        <p style="margin:0 0 16px;">Buzzing for it.</p>
        <p style="margin:0 0 24px;">Please also accept the calendar invite in your inbox so it appears in your schedule. It won't show up otherwise.</p>

        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />

        <p style="margin:0 0 16px;">Below is the key info on us, so you can do your due diligence quickly.</p>
        <p style="margin:0 0 24px;">Skim what's most useful, ignore the rest.</p>

        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />

        <p style="margin:0 0 16px;"><a href="${GAMMA_RESULTS}" style="color:#1a73e8;font-weight:600;text-decoration:none;">Client Results &amp; Our Portfolio</a>. What previous clients say, plus the actual results we've gotten. The goal is to get you results just like them. If not better.</p>
        <p style="margin:0 0 16px;">You'll also see our client videos, strategy, and thumbnails inside.</p>

        <p style="margin:24px 0 16px;"><a href="${GAMMA_SCRIPTS}" style="color:#1a73e8;font-weight:600;text-decoration:none;">How We Create Your Technical Scripts</a>. The most common question we get. This pack covers how the scripts stay accurate to your knowledge and how we save you time.</p>

        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />

        <p style="margin:0 0 16px;">We'll send a couple more emails before our call with more info on how we can help you drive more leads.</p>
        <p style="margin:0 0 16px;">Want to make this clear: the call is all about you. Your business, your goals, and how we can help.</p>
        <p style="margin:0 0 24px;">Looking forward to it.</p>

        <p style="margin:0 0 16px;">Mo</p>
        <p style="margin:0;font-size:13px;color:#6b7280;">P.S. Questions before the call? Just reply to this email. Happy to help.</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

function email1Text(firstName: string, prettyDate: string, prettyTime: string): string {
  return `Hey ${firstName},

Your call is booked in. Nice one.

Just to re-confirm, it's ${prettyDate} at ${prettyTime}.

Buzzing for it.

Please also accept the calendar invite in your inbox so it appears in your schedule. It won't show up otherwise.

---

Below is the key info on us, so you can do your due diligence quickly.

Skim what's most useful, ignore the rest.

---

Client Results and Our Portfolio: ${GAMMA_RESULTS}
What previous clients say, plus the actual results we've gotten. The goal is to get you results just like them. If not better.

You'll also see our client videos, strategy, and thumbnails inside.

How We Create Your Technical Scripts: ${GAMMA_SCRIPTS}
The most common question we get. This pack covers how the scripts stay accurate to your knowledge and how we save you time.

---

We'll send a couple more emails before our call with more info on how we can help you drive more leads.

Want to make this clear: the call is all about you. Your business, your goals, and how we can help.

Looking forward to it.

Mo

P.S. Questions before the call? Just reply to this email. Happy to help.`;
}

function email2Html(firstName: string): string {
  return `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#f6f7f9;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f6f7f9;">
  <tr><td align="center" style="padding:24px 12px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;background:#ffffff;border-radius:8px;padding:32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#1a1a1a;">
      <tr><td>
        <p style="margin:0 0 16px;">Hey ${firstName},</p>
        <p style="margin:0 0 16px;">Quick one before our call tomorrow.</p>
        <p style="margin:0 0 16px;">You probably have a couple of questions. I answered the most common ones below so we can go deeper on your business instead of mechanics.</p>
        <p style="margin:0 0 24px;">See you tomorrow. Buzzing for it.</p>

        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />

        <p style="margin:0 0 8px;"><strong>Is this a DFY offer?</strong></p>
        <p style="margin:0 0 16px;">Yes. The entire point of working with us is so you do less work, not more.</p>
        <p style="margin:0 0 16px;">The only thing you do is record your content.</p>
        <p style="margin:0 0 24px;">If we ever ask you to do anything more than record, we'll refund you in full plus an extra $1,000 for the annoyance. You record 2-3 hours a week. That's it.</p>

        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />

        <p style="margin:0 0 8px;"><strong>How do you create the scripts for me?</strong></p>
        <p style="margin:0 0 16px;">We analyze your existing content, case studies, and website to capture your voice and expertise.</p>
        <p style="margin:0 0 16px;">Then we write scripts tailored to you. Accurate to your knowledge, in your style.</p>
        <p style="margin:0 0 16px;">Want longer detailed scripts? Bullet points? Something in between? We do all three. Whatever makes you comfortable on camera.</p>
        <p style="margin:0 0 16px;">Every time you record, your script is waiting for you. Zero work from you.</p>
        <p style="margin:0 0 24px;">More on this: <a href="${GAMMA_SCRIPTS}" style="color:#1a73e8;font-weight:600;text-decoration:none;">How We Create Your Technical Scripts</a></p>

        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />

        <p style="margin:0 0 8px;"><strong>How much time will this actually take from me?</strong></p>
        <p style="margin:0 0 16px;">You record 2-3 hours a week. That's it.</p>
        <p style="margin:0 0 16px;">We handle scripts, editing, thumbnails, lead magnets, email sequences, and optimization.</p>
        <p style="margin:0 0 24px;">Other agencies make you handle strategy and lead gen. We don't. You record once a week and focus on your business. We turn the recordings into a lead system.</p>

        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />

        <p style="margin:0 0 16px;">In case you haven't looked yet:</p>
        <p style="margin:0 0 24px;"><a href="${GAMMA_RESULTS}" style="color:#1a73e8;font-weight:600;text-decoration:none;">Client Results &amp; Our Portfolio</a>. Videos, lead magnets, thumbnails, real results.</p>

        <p style="margin:0;">Mo</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

function email2Text(firstName: string): string {
  return `Hey ${firstName},

Quick one before our call tomorrow.

You probably have a couple of questions. I answered the most common ones below so we can go deeper on your business instead of mechanics.

See you tomorrow. Buzzing for it.

---

Is this a DFY offer?

Yes. The entire point of working with us is so you do less work, not more.

The only thing you do is record your content.

If we ever ask you to do anything more than record, we'll refund you in full plus an extra $1,000 for the annoyance. You record 2-3 hours a week. That's it.

---

How do you create the scripts for me?

We analyze your existing content, case studies, and website to capture your voice and expertise.

Then we write scripts tailored to you. Accurate to your knowledge, in your style.

Want longer detailed scripts? Bullet points? Something in between? We do all three. Whatever makes you comfortable on camera.

Every time you record, your script is waiting for you. Zero work from you.

More on this: ${GAMMA_SCRIPTS}

---

How much time will this actually take from me?

You record 2-3 hours a week. That's it.

We handle scripts, editing, thumbnails, lead magnets, email sequences, and optimization.

Other agencies make you handle strategy and lead gen. We don't. You record once a week and focus on your business. We turn the recordings into a lead system.

---

In case you haven't looked yet:

Client Results and Our Portfolio: ${GAMMA_RESULTS}
Videos, lead magnets, thumbnails, real results.

Mo`;
}

function email3Html(firstName: string, prettyTime: string): string {
  return `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#f6f7f9;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f6f7f9;">
  <tr><td align="center" style="padding:24px 12px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;background:#ffffff;border-radius:8px;padding:32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#1a1a1a;">
      <tr><td>
        <p style="margin:0 0 16px;">Hey ${firstName},</p>
        <p style="margin:0 0 16px;">We're on in an hour at <strong>${prettyTime}</strong>.</p>
        <p style="margin:0 0 24px;">Excited to dig into your business.</p>

        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />

        <p style="margin:0 0 8px;"><strong>Worried we can't script properly for your niche?</strong></p>
        <p style="margin:0 0 16px;">Fair concern. Outsourcing often gets you generic scripts that lack the technical depth your audience expects.</p>
        <p style="margin:0 0 16px;">Here's how we make it work.</p>
        <p style="margin:0 0 16px;">One 60-minute onboarding call. You share your business, offer, and audience. That's your only setup task.</p>
        <p style="margin:0 0 16px;">From there we mine your existing content across platforms, gather your social proof, and study your landing pages to learn the niche.</p>
        <p style="margin:0 0 16px;">We build a content hub for the strategy, write a full content plan for lead gen, and get your approval on it.</p>
        <p style="margin:0 0 16px;">Then we write custom scripts in your voice, tailored for conversion, in whatever length you prefer.</p>
        <p style="margin:0 0 16px;">Your commitment: 2-3 hours a week to record.</p>
        <p style="margin:0 0 24px;">If we ever ask for more than that, we refund you plus $1,000 for not keeping our word.</p>

        <p style="margin:0 0 24px;">More info: <a href="${GAMMA_SCRIPTS}" style="color:#1a73e8;font-weight:600;text-decoration:none;">How We Create Your Technical Scripts</a></p>

        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />

        <p style="margin:0 0 16px;">If you haven't looked yet:</p>
        <p style="margin:0 0 24px;"><a href="${GAMMA_RESULTS}" style="color:#1a73e8;font-weight:600;text-decoration:none;">Client Results</a>. Videos, lead magnets, thumbnails, shorts, and email sequences.</p>

        <p style="margin:0;">Mo</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

function email3Text(firstName: string, prettyTime: string): string {
  return `Hey ${firstName},

We're on in an hour at ${prettyTime}.

Excited to dig into your business.

---

Worried we can't script properly for your niche?

Fair concern. Outsourcing often gets you generic scripts that lack the technical depth your audience expects.

Here's how we make it work.

One 60-minute onboarding call. You share your business, offer, and audience. That's your only setup task.

From there we mine your existing content across platforms, gather your social proof, and study your landing pages to learn the niche.

We build a content hub for the strategy, write a full content plan for lead gen, and get your approval on it.

Then we write custom scripts in your voice, tailored for conversion, in whatever length you prefer.

Your commitment: 2-3 hours a week to record.

If we ever ask for more than that, we refund you plus $1,000 for not keeping our word.

More info: ${GAMMA_SCRIPTS}

---

If you haven't looked yet:

Client Results and Our Portfolio: ${GAMMA_RESULTS}
Videos, lead magnets, thumbnails, shorts, and email sequences.

Mo`;
}

// -------------------------------------------------------------
// Build the 3-email plan
// -------------------------------------------------------------

export function buildEmails(booking: CalBooking, now: Date): EmailToSend[] {
  const attendee = booking.payload.attendees[0];
  if (!attendee) throw new Error("No attendee found");
  if (!booking.payload.uid) throw new Error("No booking uid found");

  const attendeeTz =
    attendee.timeZone || booking.payload.organizer.timeZone || "UTC";
  const callTime = new Date(booking.payload.startTime);
  const firstName = attendee.name.split(" ")[0] || "there";
  const prettyDate = formatDate(booking.payload.startTime, attendeeTz);
  const prettyTime = formatTime(booking.payload.startTime, attendeeTz);
  const uid = booking.payload.uid;

  const email2Time = new Date(callTime.getTime() - 24 * 60 * 60 * 1000);
  const email3Time = new Date(callTime.getTime() - 60 * 60 * 1000);

  const emails: EmailToSend[] = [];

  // Email 1 — Immediate confirmation
  emails.push({
    to: attendee.email,
    subject: "please confirm the call (if you haven't already)",
    html: email1Html(firstName, prettyDate, prettyTime),
    text: email1Text(firstName, prettyDate, prettyTime),
    scheduledAt: null,
    idempotencyKey: `${uid}-email-1`,
    emailIndex: 1,
  });

  // Email 2 — 24h before call (skip if <60s future or beyond Resend window)
  // Resend's scheduled_at minimum is 60 seconds in the future; we use that
  // as a safety floor to avoid 422 errors under clock skew.
  const e2Delta = email2Time.getTime() - now.getTime();
  if (e2Delta > RESEND_MIN_SCHEDULE_MS && e2Delta <= RESEND_MAX_SCHEDULE_MS) {
    emails.push({
      to: attendee.email,
      subject: `quick one before our call, ${firstName}`,
      html: email2Html(firstName),
      text: email2Text(firstName),
      scheduledAt: email2Time,
      idempotencyKey: `${uid}-email-2`,
      emailIndex: 2,
    });
  }

  // Email 3 — 1h before call (skip if <60s future or beyond Resend window)
  const e3Delta = email3Time.getTime() - now.getTime();
  if (e3Delta > RESEND_MIN_SCHEDULE_MS && e3Delta <= RESEND_MAX_SCHEDULE_MS) {
    emails.push({
      to: attendee.email,
      subject: `we're on today, ${firstName}`,
      html: email3Html(firstName, prettyTime),
      text: email3Text(firstName, prettyTime),
      scheduledAt: email3Time,
      idempotencyKey: `${uid}-email-3`,
      emailIndex: 3,
    });
  }

  return emails;
}

// -------------------------------------------------------------
// Resend API call (with idempotency)
// -------------------------------------------------------------

export async function sendEmail(
  apiKey: string,
  email: EmailToSend
): Promise<{ id: string }> {
  const body: Record<string, unknown> = {
    from: FROM_EMAIL,
    to: email.to,
    subject: email.subject,
    html: email.html,
    text: email.text,
  };
  if (email.scheduledAt) {
    // CRITICAL: Resend API expects snake_case — sending camelCase
    // silently drops the field and the email fires immediately.
    body.scheduled_at = email.scheduledAt.toISOString();
  }

  const res = await fetch(RESEND_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      // Idempotency-Key dedupes retries server-side at Resend
      // for a 24h window. Cal.com retry storms become no-ops.
      "Idempotency-Key": email.idempotencyKey,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(
      `Resend ${res.status} for ${email.idempotencyKey}: ${err}`
    );
  }
  return (await res.json()) as { id: string };
}

// -------------------------------------------------------------
// Cal.com HMAC signature verification
// -------------------------------------------------------------

export function verifyCalSignature(
  rawBody: string,
  signatureHeader: string | undefined,
  secret: string
): boolean {
  if (!signatureHeader) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  // Constant-time compare to avoid timing attacks
  const expectedBuf = Buffer.from(expected);
  const givenBuf = Buffer.from(signatureHeader);
  if (expectedBuf.length !== givenBuf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, givenBuf);
}

// -------------------------------------------------------------
// Netlify handler
// -------------------------------------------------------------

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Missing RESEND_API_KEY");
    return { statusCode: 500, body: "Server misconfigured" };
  }

  const webhookSecret = process.env.CAL_WEBHOOK_SECRET;
  const rawBody = event.body || "";

  // Verify signature if a secret is configured. If you haven't set
  // CAL_WEBHOOK_SECRET in Netlify yet, this is skipped — set it ASAP.
  if (webhookSecret) {
    const sig = event.headers["x-cal-signature-256"] ||
      event.headers["X-Cal-Signature-256"];
    if (!verifyCalSignature(rawBody, sig, webhookSecret)) {
      console.warn("Invalid Cal.com signature");
      return { statusCode: 401, body: "Invalid signature" };
    }
  }

  let data: CalBooking;
  try {
    data = JSON.parse(rawBody) as CalBooking;
  } catch (err) {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  if (data.triggerEvent !== "BOOKING_CREATED") {
    return {
      statusCode: 200,
      body: `Ignored event: ${data.triggerEvent}`,
    };
  }

  let emails: EmailToSend[];
  try {
    emails = buildEmails(data, new Date());
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("buildEmails error:", msg);
    return { statusCode: 400, body: msg };
  }

  // Sequential sends with per-email error isolation.
  // We never throw out of the handler on a single email failure —
  // a 5xx response triggers Cal.com retries which would re-fire the
  // already-sent emails.
  const results: {
    emailIndex: number;
    status: "sent" | "failed";
    resendId?: string;
    error?: string;
  }[] = [];

  for (let i = 0; i < emails.length; i++) {
    const email = emails[i];
    // Resend free tier is 2 req/sec. Sleep 600ms between sends
    // (except before the first one) to stay safely under the limit.
    if (i > 0) {
      await new Promise((r) => setTimeout(r, 600));
    }
    try {
      const { id } = await sendEmail(apiKey, email);
      results.push({
        emailIndex: email.emailIndex,
        status: "sent",
        resendId: id,
      });
      console.log(
        `[email ${email.emailIndex}] sent to ${email.to} (resendId=${id}, key=${email.idempotencyKey})`
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      results.push({
        emailIndex: email.emailIndex,
        status: "failed",
        error: msg,
      });
      console.error(`[email ${email.emailIndex}] FAILED:`, msg);
      // continue — don't bail on the remaining emails
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      bookingUid: data.payload.uid,
      attendee: data.payload.attendees[0]?.email,
      callTime: data.payload.startTime,
      results,
    }),
  };
};
