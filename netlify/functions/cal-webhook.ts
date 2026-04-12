import type { Handler } from "@netlify/functions";

/* =========================================================
   Cal.com Webhook Handler
   Receives BOOKING_CREATED events and schedules 4 emails
   via Resend API.

   Env vars needed in Netlify:
   - RESEND_API_KEY
   - CAL_WEBHOOK_SECRET (optional, for verification)
   ========================================================= */

const RESEND_API = "https://api.resend.com/emails";
const FROM_EMAIL = "Muawaz <muawaz@genspeak.io>";

interface CalBooking {
  triggerEvent: string;
  payload: {
    title: string;
    startTime: string;
    endTime: string;
    attendees: { name: string; email: string }[];
    organizer: {
      name: string;
      email: string;
      timeZone: string;
    };
  };
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function setTimeTo(date: Date, hour: number): Date {
  const result = new Date(date);
  result.setUTCHours(hour, 0, 0, 0);
  return result;
}

function formatDate(time: string): string {
  const d = new Date(time);
  return d.toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

function buildEmails(
  name: string,
  email: string,
  callTime: string,
  bookedAt: Date
) {
  const callDate = new Date(callTime);
  const firstName = name.split(" ")[0];
  const prettyTime = formatDate(callTime);

  return [
    // Email 1: Immediate confirmation
    {
      to: email,
      subject: `${firstName}, your discovery call is booked`,
      html: `
        <h2>Hey ${firstName},</h2>
        <p>Your call is confirmed for <strong>${prettyTime}</strong>.</p>
        <p>Here is what we will cover:</p>
        <ul>
          <li>Your current YouTube strategy (and what is holding it back)</li>
          <li>How we build a full content funnel that books calls for you</li>
          <li>Whether this is the right fit for your business</li>
        </ul>
        <p>While you wait, check out the videos on your <a href="https://genspeak.io/confirmed">confirmation page</a>. They answer the 3 biggest questions people have before we talk.</p>
        <p>Talk soon,<br/>Muawaz<br/>GenSpeak</p>
      `,
      scheduledAt: null, // send immediately
    },
    // Email 2: Day 2 - Case study / proof
    {
      to: email,
      subject: `How our clients get 20+ calls/mo from YouTube`,
      html: `
        <h2>Hey ${firstName},</h2>
        <p>Wanted to share something quick before our call.</p>
        <p>Most coaches and course creators we work with were stuck in the same place: good offer, no consistent way to get it in front of people.</p>
        <p>Here is what changed for them:</p>
        <ul>
          <li>Strategic content that attracts buyers (not just viewers)</li>
          <li>A funnel that turns every video into a lead machine</li>
          <li>Full done-for-you execution so they focus on delivery</li>
        </ul>
        <p>See the results on our <a href="https://genspeak.io/confirmed">confirmation page</a>.</p>
        <p>Talk soon,<br/>Muawaz</p>
      `,
      scheduledAt: setTimeTo(addDays(bookedAt, 1), 14).toISOString(),
    },
    // Email 3: Day 3 - FAQ / objection handler
    {
      to: email,
      subject: `Quick answers before our call, ${firstName}`,
      html: `
        <h2>Hey ${firstName},</h2>
        <p>Before we talk, here are the 3 questions everyone asks:</p>
        <p><strong>"Is this done-for-me?"</strong><br/>Yes. We handle ideation, scripts, editing, thumbnails, SEO, short-form, lead magnets, and email sequences. You show up on camera. We do everything else.</p>
        <p><strong>"What results can I expect?"</strong><br/>Most clients see consistent lead flow within 60-90 days. We engineer content to book calls, not just get views.</p>
        <p><strong>"How much does it cost?"</strong><br/>Packages range from $3,000 to $8,000 depending on scope. We will find the right fit on the call.</p>
        <p>Watch the full breakdowns here: <a href="https://genspeak.io/confirmed">genspeak.io/confirmed</a></p>
        <p>See you soon,<br/>Muawaz</p>
      `,
      scheduledAt: setTimeTo(addDays(bookedAt, 2), 14).toISOString(),
    },
    // Email 4: Morning of call - final reminder
    {
      to: email,
      subject: `Ready for today?`,
      html: `
        <h2>Hey ${firstName},</h2>
        <p>Just a quick reminder: we are talking today at <strong>${prettyTime}</strong>.</p>
        <p>To get the most out of our 30 minutes:</p>
        <ul>
          <li>Have your current YouTube channel open (if you have one)</li>
          <li>Know your current monthly revenue and target</li>
          <li>Think about what "success" looks like in 90 days</li>
        </ul>
        <p>Talk soon,<br/>Muawaz<br/>GenSpeak</p>
      `,
      scheduledAt: setTimeTo(callDate, 9).toISOString(),
    },
  ];
}

async function sendEmail(
  apiKey: string,
  { to, subject, html, scheduledAt }: {
    to: string;
    subject: string;
    html: string;
    scheduledAt: string | null;
  }
) {
  const body: Record<string, unknown> = {
    from: FROM_EMAIL,
    to,
    subject,
    html,
  };
  if (scheduledAt) {
    body.scheduledAt = scheduledAt;
  }

  const res = await fetch(RESEND_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend API error: ${res.status} ${err}`);
  }
  return res.json();
}

export const handler: Handler = async (event) => {
  // Only accept POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: "Missing RESEND_API_KEY" };
  }

  try {
    const data: CalBooking = JSON.parse(event.body || "{}");

    // Only process new bookings
    if (data.triggerEvent !== "BOOKING_CREATED") {
      return { statusCode: 200, body: "Ignored event: " + data.triggerEvent };
    }

    const attendee = data.payload.attendees[0];
    if (!attendee) {
      return { statusCode: 400, body: "No attendee found" };
    }

    const now = new Date();
    const emails = buildEmails(
      attendee.name,
      attendee.email,
      data.payload.startTime,
      now
    );

    // Send all 4 emails (first one immediately, rest scheduled)
    const results = await Promise.all(
      emails.map((e) => sendEmail(apiKey, e))
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Email sequence scheduled",
        attendee: attendee.email,
        emailsSent: results.length,
      }),
    };
  } catch (err) {
    console.error("Webhook error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err instanceof Error ? err.message : "Unknown error",
      }),
    };
  }
};
