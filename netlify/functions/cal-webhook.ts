import type { Handler } from "@netlify/functions";

/* =========================================================
   Cal.com Webhook Handler
   Receives BOOKING_CREATED events and schedules 3 emails
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
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function formatTime(time: string): string {
  const d = new Date(time);
  return d.toLocaleTimeString("en-US", {
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
  const prettyDate = formatDate(callTime);
  const prettyTimeWithTz = formatTime(callTime);

  const GAMMA_RESULTS = "https://gamma.app/docs/Social-Proof-uvhjwd6f3xp02pz";
  const GAMMA_SCRIPTS = "https://gamma.app/docs/How-We-Create-Your-Scripts-xizvcfbtokplsr7";

  return [
    // ── Email 1: Immediate confirmation ──
    {
      to: email,
      subject: "please confirm the call (if you haven't already)",
      html: `
<div style="font-family: Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #222;">
  <p>Hey ${firstName},</p>

  <p>Your call is booked in, nice one.</p>

  <p>Just to re-confirm it's… <strong>${prettyDate} &amp; ${prettyTimeWithTz}</strong></p>

  <p>Buzzing for it.</p>

  <p>Please also accept the calendar invite in your inbox so it's added to your calendar schedule. It won't appear in your calendar otherwise.</p>

  <hr style="border: none; border-top: 1px solid #ddd; margin: 24px 0;" />

  <p>Also we put together all the key info below for you as we know more information is definitely going to be important for you as a smart business owner.</p>

  <p>So you can do your due diligence quickly.</p>

  <p>There is a lot of information there, so naturally just go through the ones that you think will be the most useful to you!</p>

  <hr style="border: none; border-top: 1px solid #ddd; margin: 24px 0;" />

  <p><a href="${GAMMA_RESULTS}" style="font-weight: bold; color: #1a73e8;">Client Results &amp; Our Portfolio</a>: See what previous clients say about us and most importantly the actual results we have got for people. The goal is to get you results just like them. If not better.</p>

  <p>You can also see our client:</p>
  <ul>
    <li>Videos</li>
    <li>Strategy</li>
    <li>Thumbnails</li>
  </ul>

  <p><a href="${GAMMA_SCRIPTS}" style="font-weight: bold; color: #1a73e8;">How We Create Your Technical Scripts</a>: One of the most common questions we get is… "how will you create the scripts for me?" This is typically because entrepreneurs are either, wondering how much time they will have to invest, or whether the scripts will be accurate. In this pack we explain how we solve both and save you a ton of time.</p>

  <hr style="border: none; border-top: 1px solid #ddd; margin: 24px 0;" />

  <p>We will also be sending you a couple more emails before our call that will provide even more information about how we can help you drive more leads.</p>

  <p>Want to also make it clear… the call is all about you!</p>

  <p>Your business, your goals &amp; how we can potentially help you achieve them.</p>

  <p>Looking forward to it.</p>

  <p>MO</p>

  <p style="font-size: 13px; color: #555;">P.S. If you've got questions beyond what's covered above, just drop me a message. Always happy to help out before we jump on the call!</p>
</div>
      `.trim(),
      scheduledAt: null,
    },

    // ── Email 2: Day 2 at 2pm – FAQ / objection handler ──
    {
      to: email,
      subject: `quick one before our call, ${firstName}`,
      html: `
<div style="font-family: Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #222;">
  <p>Hey ${firstName},</p>

  <p>Just before our call wanted to send you this.</p>

  <p>You likely have a couple of questions before our call.</p>

  <p>So we answered the most common questions we get below for you.</p>

  <p>See you soon ${firstName}, buzzing for it.</p>

  <hr style="border: none; border-top: 1px solid #ddd; margin: 24px 0;" />

  <p><strong>Is This A DFY Offer?</strong></p>

  <p>Yes!</p>

  <p>Of course it is a DFY offer.</p>

  <p>The entire point of working with us is so you have to do less work not more.</p>

  <p>The only thing you have to do is record your content.</p>

  <p>Outside of that 1 task.</p>

  <p>We will NEVER, EVER ask you to do anything more.</p>

  <p>And if we do, we'll give you a full refund and an extra $1000 for annoying you.</p>

  <p>We are here to make your life as easy as possible.</p>

  <p>And that means recording content once a week for 2-3 hours and being done.</p>

  <hr style="border: none; border-top: 1px solid #ddd; margin: 24px 0;" />

  <p><strong>How Do You Create The Scripts for Me?</strong></p>

  <p>We analyze your existing content, case studies, and website to capture your unique voice and expertise.</p>

  <p>Then we create scripts tailored specifically to you. Accurate to your knowledge and written in your style.</p>

  <p>Want longer detailed scripts? We'll do that. Want shorter bullet-point scripts? We'll do that. Want something in between? We'll do that too.</p>

  <p>Whatever makes you most comfortable, that's what we create.</p>

  <p>Every time you record, your personalized script is waiting for you.</p>

  <p>Zero work required from you. As long as you have some existing content online, we can tailor everything.</p>

  <p>You record once a week and you're done.</p>

  <p>Even More Info About Scripts: <a href="${GAMMA_SCRIPTS}" style="font-weight: bold; color: #1a73e8;">How We Create Your Technical Scripts</a></p>

  <hr style="border: none; border-top: 1px solid #ddd; margin: 24px 0;" />

  <p><strong>How Much Time/Work Will This Actually Take From Me?</strong></p>

  <p>You're already running a business and serving clients. The last thing you need is spending hours on content creation, video editing, and lead generation.</p>

  <p>That's why most entrepreneurs fail with content. It's too much work.</p>

  <p>Here's how we make your life easier: You record once a week. That's it.</p>

  <p>We handle everything else. Scripts, editing, thumbnails, lead magnets, email sequences, and optimization.</p>

  <p>Your time commitment? 2-3 hours weekly to record.</p>

  <p>While other agencies make you handle strategy and lead generation, we do all the heavy lifting. You record once a week and focus on your business.</p>

  <p>We turn that into a complete lead generation system.</p>

  <p>If we EVER ask you to do anything besides record content, we'll refund you plus an extra $1000 for not doing what we promised.</p>

  <p>You record once a week. You're done.</p>

  <hr style="border: none; border-top: 1px solid #ddd; margin: 24px 0;" />

  <p>In case you haven't had a chance to look:</p>

  <p><a href="${GAMMA_RESULTS}" style="font-weight: bold; color: #1a73e8;">Client Results &amp; Our Portfolio</a>: See what previous clients say about us and most importantly the actual results we have got for people. The goal is to get you results just like them. If not better.</p>

  <p>You can also see our client:</p>
  <ul>
    <li>Videos</li>
    <li>Lead Magnets</li>
    <li>Thumbnails</li>
  </ul>

  <p>MO</p>
</div>
      `.trim(),
      scheduledAt: setTimeTo(addDays(bookedAt, 1), 14).toISOString(),
    },

    // ── Email 3: Morning of call at 9am ──
    {
      to: email,
      subject: `we're on today, ${firstName}`,
      html: `
<div style="font-family: Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #222;">
  <p>Hey ${firstName},</p>

  <p>We are booked in for today at <strong>${prettyTimeWithTz}</strong>.</p>

  <p>Proper excited to get more into your business.</p>

  <hr style="border: none; border-top: 1px solid #ddd; margin: 24px 0;" />

  <p><strong>Unsure If We Can Script Properly For You &amp; Your Niche?</strong></p>

  <p>As a busy entrepreneur, you've got no time to script videos or handle content tasks.</p>

  <p>Yet, outsourcing often feels risky because you might get low-quality scripts or ones that lack the technical depth your niche demands.</p>

  <p>We make it simple with a clear process that cuts out the hassle.</p>

  <p>First, you join a single 60-minute onboarding call to share details about your business, offer, and audience.</p>

  <p>That's your only step.</p>

  <p>From there, we dig into your existing content across platforms, gather social proof, and study your landing pages to understand your niche deeply.</p>

  <p>We build a content hub to store all this info, create a full content plan for lead generation, and get your approval on it.</p>

  <p>Then, we write custom scripts that match your unique voice and style, tailored for conversions and adapted to your preferences, whether you like them long or short.</p>

  <p>Your time commitment?</p>

  <p>Just 2 to 3 hours a week to record.</p>

  <p>We handle everything else, transforming your videos into a lead generation system.</p>

  <p>If we ever ask you to do more than record, we'll refund you plus an extra $1000 for not keeping our word.</p>

  <p>Even More Info: <a href="${GAMMA_SCRIPTS}" style="font-weight: bold; color: #1a73e8;">How We Create Your Technical Scripts</a></p>

  <hr style="border: none; border-top: 1px solid #ddd; margin: 24px 0;" />

  <p>In case you haven't had a chance to look:</p>

  <p><a href="${GAMMA_RESULTS}" style="font-weight: bold; color: #1a73e8;">Client Results</a>: See what previous clients say about us and most importantly the actual results we have got for people. The goal is to get you results just like them. If not better.</p>

  <p>You can also see our client:</p>
  <ul>
    <li>Videos</li>
    <li>Lead Magnets</li>
    <li>Thumbnails</li>
    <li>Shorts</li>
    <li>Email sequences</li>
  </ul>

  <p>MO</p>
</div>
      `.trim(),
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
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: "Missing RESEND_API_KEY" };
  }

  try {
    const data: CalBooking = JSON.parse(event.body || "{}");

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
