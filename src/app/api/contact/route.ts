import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { env } from "@/lib/env";

/**
 * Booking and press enquiries.
 *
 * Promoters are a confirmed audience with a real job on this site, so this
 * path has to be dependable: it accepts a plain form POST and redirects back
 * with a status, which means it works with JavaScript disabled and degrades to
 * a normal page load rather than a silent failure.
 *
 * Three protections, because an open form on a band site becomes a spam relay
 * within a week:
 *   1. A honeypot field people never see and bots reliably fill.
 *   2. A minimum time-on-page, since bots submit instantly.
 *   3. Per-IP rate limiting.
 */

const MAX_LENGTHS = { name: 120, email: 200, message: 4000 } as const;
const MIN_SECONDS_ON_PAGE = 3;
const RATE_LIMIT = { max: 5, windowMs: 60 * 60 * 1000 } as const;

/**
 * In-memory rate limiting.
 *
 * ⚠ Per-instance only. On Vercel each serverless instance keeps its own map, so
 * a determined sender can get more than `max` through by hitting cold
 * instances. It stops the common case — one bot hammering one endpoint — and
 * costs nothing. If real abuse shows up, move this to Upstash Redis or Vercel
 * KV, keyed the same way.
 */
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT.windowMs,
  );
  recent.push(now);
  hits.set(ip, recent);

  // Keep the map from growing without bound on a long-lived instance.
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
  const url = new URL("/contact", request.url);
  url.searchParams.set("status", status);
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

  // 1. Honeypot. A person never sees this field; a bot fills everything.
  //    Answer as though it succeeded, so the sender learns nothing.
  if (value("company")) return back(request, "sent");

  // 2. Instant submissions are automated. The form stamps when it rendered.
  const renderedAt = Number(value("t"));
  if (
    Number.isFinite(renderedAt) &&
    renderedAt > 0 &&
    Date.now() - renderedAt < MIN_SECONDS_ON_PAGE * 1000
  ) {
    return back(request, "sent");
  }

  // 3. Rate limit.
  if (rateLimited(clientIp(request))) return back(request, "rate-limited");

  const name = value("name");
  const email = value("email");
  const message = value("message");

  if (!name || !email || !message) return back(request, "incomplete");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return back(request, "email");
  if (
    name.length > MAX_LENGTHS.name ||
    email.length > MAX_LENGTHS.email ||
    message.length > MAX_LENGTHS.message
  ) {
    return back(request, "too-long");
  }

  // Newlines in a header would let a sender inject extra headers.
  const safeName = name.replace(/[\r\n]+/g, " ");

  try {
    const resend = new Resend(env.resendApiKey);
    await resend.emails.send({
      // Must be a verified domain in Resend. Once the band's domain is live
      // this becomes something like "site@heavyskint.com".
      from: `heavyskint site <onboarding@resend.dev>`,
      to: [env.bookingEmailTo],
      replyTo: email,
      subject: `Booking enquiry — ${safeName}`,
      text: [
        `Name: ${safeName}`,
        `Email: ${email}`,
        "",
        message,
        "",
        "— Sent from the contact form on heavyskint.",
      ].join("\n"),
    });
  } catch (error) {
    // Logged so a delivery outage is visible in Vercel logs rather than
    // looking to the band like nobody is getting in touch.
    console.error("[contact] send failed:", error);
    return back(request, "error");
  }

  return back(request, "sent");
}

/** A GET here is someone pasting the URL; send them to the form. */
export async function GET(request: NextRequest) {
  return NextResponse.redirect(new URL("/contact", request.url), 303);
}
