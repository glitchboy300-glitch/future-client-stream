import type { Handler } from "@netlify/functions";
import crypto from "node:crypto";

/* =========================================================
   cal-webhook-selftest — Netlify Scheduled Function

   Runs daily (configured in netlify.toml).
   Posts a synthetic BOOKING_CREATED to the live cal-webhook
   function and asserts all 3 emails return status: "sent".

   On failure, posts a Slack alert via SLACK_ALERT_WEBHOOK_URL.

   What this catches:
   - Netlify function crashed / 5xx
   - RESEND_API_KEY expired or revoked
   - Resend service outage
   - genspeak.io domain DKIM/SPF broken
   - Code regression that broke the handler
   - CAL_WEBHOOK_SECRET mismatch

   What this does NOT catch:
   - Cal.com webhook disconnected from event type
     (handled by manual weekly smoke-test booking)

   Env vars (set in Netlify):
   - URL                       (auto-set by Netlify, site root URL)
   - CAL_WEBHOOK_SECRET        (same as main handler)
   - SELFTEST_EMAIL            (monitoring inbox, e.g. mmuawaz1+selftest@gmail.com)
   - SLACK_ALERT_WEBHOOK_URL   (optional, for failure alerts)

   netlify.toml schedule snippet:
   [functions."cal-webhook-selftest"]
     schedule = "0 4 * * *"   # 04:00 UTC = 09:00 Asia/Karachi
   ========================================================= */

const SITE_URL = process.env.URL;
const SECRET = process.env.CAL_WEBHOOK_SECRET;
const TEST_EMAIL = process.env.SELFTEST_EMAIL;
const SLACK_URL = process.env.SLACK_ALERT_WEBHOOK_URL || "";

async function alertFail(message: string): Promise<void> {
  console.error(`[selftest] ALERT: ${message}`);
  if (!SLACK_URL) return;
  try {
    await fetch(SLACK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `:rotating_light: cal-webhook selftest FAILED\n${message}`,
      }),
    });
  } catch (err) {
    console.error("[selftest] slack alert failed:", err);
  }
}

export const handler: Handler = async () => {
  if (!SITE_URL || !SECRET || !TEST_EMAIL) {
    await alertFail(
      "selftest env vars missing: URL, CAL_WEBHOOK_SECRET, or SELFTEST_EMAIL"
    );
    return { statusCode: 500, body: "missing env" };
  }

  const webhookUrl = `${SITE_URL}/.netlify/functions/cal-webhook`;
  const now = new Date();
  const callTime = new Date(now.getTime() + 26 * 60 * 60 * 1000);
  const uid = `selftest-${now.toISOString().slice(0, 10)}-${Date.now()}`;

  const payload = {
    triggerEvent: "BOOKING_CREATED",
    payload: {
      uid,
      title: "SELFTEST — Get. More. Leads.",
      startTime: callTime.toISOString(),
      endTime: new Date(callTime.getTime() + 30 * 60 * 1000).toISOString(),
      attendees: [
        {
          name: "Self Test",
          email: TEST_EMAIL,
          timeZone: "America/New_York",
        },
      ],
      organizer: {
        name: "Muawaz",
        email: "muawaz@genspeak.io",
        timeZone: "Asia/Karachi",
      },
    },
  };

  const rawBody = JSON.stringify(payload);
  const signature = crypto
    .createHmac("sha256", SECRET)
    .update(rawBody)
    .digest("hex");

  console.log(`[selftest] POST ${webhookUrl} uid=${uid}`);

  let response: Response;
  try {
    response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Cal-Signature-256": signature,
      },
      body: rawBody,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await alertFail(`Fetch threw: ${msg}`);
    return { statusCode: 500, body: "fetch failed" };
  }

  const text = await response.text();
  console.log(`[selftest] response ${response.status}: ${text}`);

  if (response.status !== 200) {
    await alertFail(`HTTP ${response.status}: ${text.slice(0, 500)}`);
    return { statusCode: 500, body: "non-200 from webhook" };
  }

  let result: any;
  try {
    result = JSON.parse(text);
  } catch {
    await alertFail(`Non-JSON response: ${text.slice(0, 500)}`);
    return { statusCode: 500, body: "non-json" };
  }

  const failures: string[] = [];
  for (const idx of [1, 2, 3]) {
    const r = result.results?.find((x: any) => x.emailIndex === idx);
    if (!r) {
      failures.push(`Email ${idx}: missing from response`);
    } else if (r.status !== "sent") {
      failures.push(`Email ${idx}: status=${r.status} error=${r.error}`);
    }
  }

  if (failures.length > 0) {
    await alertFail(
      `Webhook 200 but some emails failed:\n${failures.join("\n")}`
    );
    return { statusCode: 500, body: "email failures" };
  }

  console.log("[selftest] PASS");
  return {
    statusCode: 200,
    body: JSON.stringify({
      ok: true,
      uid,
      resendIds: result.results.map((r: any) => r.resendId),
    }),
  };
};
