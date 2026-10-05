import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { env } from "@/lib/env";

/**
 * Mailing list sign-up.
 *
 * Adds the address as a Resend contact in the band's segment. Resend then owns
 * the list: broadcasts are sent from its dashboard, and every broadcast carries
 * an unsubscribe link Resend honours itself, so there is no unsubscribe route
 * to build or keep working here.
 *
 * Same protections as the contact form — honeypot, minimum time-on-page, and
 * per-IP rate limiting — because an open sign-up form is how a list fills with
 * junk addresses and the sender reputation goes with it.
 */

const MAX_EMAIL_LENGTH = 200;
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

  // Not configured is a real state before launch, not a failure: say so
  // honestly rather than pretend the address was saved.
  const segmentId = env.newsletterSegmentId;
  if (!segmentId || !process.env.RESEND_API_KEY) {
    console.warn(
      "[newsletter] RESEND_NEWSLETTER_SEGMENT_ID or RESEND_API_KEY unset",
    );
    return back(request, "unavailable");
  }

  try {
    const resend = new Resend(env.resendApiKey);
    const { error } = await resend.contacts.create({
      email,
      unsubscribed: false,
      segments: [{ id: segmentId }],
    });
    // Someone signing up twice is already on the list — tell them so, rather
    // than reporting a failure for getting what they asked for.
    if (error && !/already exists/i.test(error.message)) {
      console.error("[newsletter] create contact failed:", error);
      return back(request, "error");
    }
  } catch (error) {
    console.error("[newsletter] create contact failed:", error);
    return back(request, "error");
  }

  return back(request, "subscribed");
}

/** A GET here is someone pasting the URL; send them to the form. */
export async function GET(request: NextRequest) {
  const url = new URL("/", request.url);
  url.hash = "mailing-list";
  return NextResponse.redirect(url, 303);
}
