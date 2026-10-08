import { NextResponse, type NextRequest } from "next/server";
import { createHash } from "node:crypto";
import { env } from "@/lib/env";

/**
 * Mailing list sign-up.
 *
 * Adds the address to the band's Mailchimp audience. Mailchimp then owns the
 * list: campaigns are sent from its dashboard, and every campaign carries an
 * unsubscribe link Mailchimp honours itself, so there is no unsubscribe route
 * to build or keep working here.
 *
 * New addresses go in as "pending", so Mailchimp sends a confirmation email
 * and nobody is on the list without having clicked it. That is double opt-in,
 * which is what makes the consent provable under PECR.
 *
 * Same protections as the contact form — honeypot, minimum time-on-page, and
 * per-IP rate limiting — because an open sign-up form is how a list fills with
 * junk addresses and the sender reputation goes with it.
 */

const MAX_EMAIL_LENGTH = 200;

/** The band's hosted sign-up page, used when the API key isn't set. */
const MAILCHIMP_LANDING_PAGE = "https://mailchi.mp/dbc5812d8359/heavyskint";

/**
 * Adds or re-adds an address, returning the notice to show.
 *
 * A PUT to the member's hash is idempotent: a new address is created pending,
 * and someone already on the list is told so instead of shown an error. A
 * past unsubscriber who signs up again is set back to pending, so they confirm
 * by email like anyone new.
 */
async function subscribe(apiKey: string, email: string): Promise<string> {
  // The key ends in its datacentre, e.g. "…-us22", which names the API host.
  const dc = apiKey.split("-").pop();
  const hash = createHash("md5").update(email).digest("hex");
  const url = `https://${dc}.api.mailchimp.com/3.0/lists/${env.mailchimp.audienceId}/members/${hash}`;
  const headers = {
    Authorization: `Basic ${Buffer.from(`heavyskint:${apiKey}`).toString("base64")}`,
    "Content-Type": "application/json",
  };

  const put = (body: Record<string, string>) =>
    fetch(url, { method: "PUT", headers, body: JSON.stringify(body) });

  let response = await put({ email_address: email, status_if_new: "pending" });
  let member = (await response.json()) as { status?: string; title?: string };

  if (response.ok && (member.status === "unsubscribed" || member.status === "cleaned")) {
    response = await put({ email_address: email, status: "pending" });
    member = await response.json();
  }

  if (!response.ok) {
    // Mailchimp rejects addresses it judges fake or undeliverable as an
    // "Invalid Resource" — to the visitor, that is a bad address.
    if (member.title === "Invalid Resource") return "email";
    throw new Error(`${response.status} ${member.title ?? ""}`.trim());
  }

  return member.status === "subscribed" ? "already" : "confirm";
}
const MIN_SECONDS_ON_PAGE = 2;
const RATE_LIMIT = { max: 5, windowMs: 60 * 60 * 1000 } as const;

/** ⚠ Per-instance only, like /api/contact — see the note there. */
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT.windowMs,
  );
  recent.push(now);
  hits.set(ip, recent);

  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_LIMIT.windowMs)) hits.delete(key);
    }
  }

  return recent.length > RATE_LIMIT.max;
}

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

function back(request: NextRequest, status: string) {
  const url = new URL("/", request.url);
  url.searchParams.set("newsletter", status);
  url.hash = "mailing-list";
  // 303 so the browser follows with GET and a refresh doesn't resubmit.
  return NextResponse.redirect(url, 303);
}

export async function POST(request: NextRequest) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return back(request, "error");
  }

  const value = (key: string) => {
    const raw = form.get(key);
    return typeof raw === "string" ? raw.trim() : "";
  };

  // 1. Honeypot. Answer as though it succeeded, so the sender learns nothing.
  if (value("company")) return back(request, "subscribed");

  // 2. Instant submissions are automated.
  const renderedAt = Number(value("t"));
  if (
    Number.isFinite(renderedAt) &&
    renderedAt > 0 &&
    Date.now() - renderedAt < MIN_SECONDS_ON_PAGE * 1000
  ) {
    return back(request, "subscribed");
  }

  // 3. Rate limit.
  if (rateLimited(clientIp(request))) return back(request, "rate-limited");

  const email = value("email").toLowerCase();
  if (
    !email ||
    email.length > MAX_EMAIL_LENGTH ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return back(request, "email");
  }

  // Without an API key the sign-up still works: the visitor finishes on the
  // band's Mailchimp page instead of on the site.
  const apiKey = env.mailchimp.apiKey;
  if (!apiKey) {
    console.warn("[newsletter] MAILCHIMP_API_KEY unset, sending to landing page");
    return NextResponse.redirect(MAILCHIMP_LANDING_PAGE, 303);
  }

  try {
    return back(request, await subscribe(apiKey, email));
  } catch (error) {
    console.error("[newsletter] Mailchimp subscribe failed:", error);
    return back(request, "error");
  }
}

/** A GET here is someone pasting the URL; send them to the form. */
export async function GET(request: NextRequest) {
  const url = new URL("/", request.url);
  url.hash = "mailing-list";
  return NextResponse.redirect(url, 303);
}
