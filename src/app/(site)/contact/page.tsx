import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeading } from "@/components/site/PageHeading";
import { PosterButton } from "@/components/ui/PosterButton";
import { Field, TextArea } from "@/components/ui/Field";
import { FormTimestamp } from "@/components/ui/FormTimestamp";
import { readSiteSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description: "Booking and press enquiries for heavyskint.",
};

/**
 * Booking and press enquiries.
 *
 * A plain form POST to /api/contact rather than a client-side fetch: promoters
 * are a confirmed audience, and a booking route that silently fails when a
 * script doesn't load is worse than one that reloads the page. The handler
 * redirects back here with `?status=`.
 */

const MESSAGES: Record<string, { tone: "ok" | "problem"; text: string }> = {
  sent: {
    tone: "ok",
    text: "Message sent. The band will get back to you.",
  },
  incomplete: {
    tone: "problem",
    text: "Add your name, email and a message, then send it again.",
  },
  email: {
    tone: "problem",
    text: "That email address doesn't look right — check it and send again.",
  },
  "too-long": {
    tone: "problem",
    text: "That message is longer than the form accepts. Trim it and try again.",
  },
  "rate-limited": {
    tone: "problem",
    text: "That's several messages in a short time. Try again in an hour, or email directly.",
  },
  error: {
    tone: "problem",
    text: "Something went wrong sending that. Try again, or email directly.",
  },
};

function StatusNotice({ status }: { status?: string }) {
  const message = status ? MESSAGES[status] : undefined;
  if (!message) return null;

  return (
    // No red or green: state is carried by the bone bar and the wording.
    <div
      role="status"
      className="mb-gap flex flex-wrap items-center gap-block border border-smoke p-block"
    >
      <span className="hs-label bg-bone px-tight py-hair text-ink">
        {message.tone === "ok" ? "Sent" : "Not sent"}
      </span>
      <p className="hs-body text-ink-white">{message.text}</p>
    </div>
  );
}

async function ContactStatus({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  return <StatusNotice status={status} />;
}

export default async function ContactPage(props: PageProps<"/contact">) {
  const settings = await readSiteSettings();

  return (
    <>
      <PageHeading title="contact">
        Booking, press, or anything else. This reaches the band directly.
      </PageHeading>

      <section className="border-t border-smoke px-gutter py-void">
        <div className="max-w-[36rem]">
          {/* Reading the query string would block the page from prerendering,
              so the status notice streams in behind its own boundary. */}
          <Suspense fallback={null}>
            <ContactStatus searchParams={props.searchParams} />
          </Suspense>

          <form
            action="/api/contact"
            method="post"
            className="flex flex-col gap-step"
          >
            <Field
              name="name"
              label="Your name"
              required
              autoComplete="name"
            />
            <Field
              name="email"
              label="Email"
              type="email"
              required
              autoComplete="email"
              hint="So the band can reply."
            />
            <TextArea
              name="message"
              label="Message"
              required
              hint="If it's a booking: venue, city, date and capacity save a round of emails."
            />

            {/* Stamps when the form became interactive. Submissions faster
                than a few seconds are automated. */}
            <FormTimestamp />

            {/* Honeypot — off-screen for people, tempting to bots. Not
                display:none, which some bots skip. */}
            <div
              aria-hidden="true"
              className="absolute left-[-9999px] h-px w-px overflow-hidden"
            >
              <label htmlFor="company">Company</label>
              <input
                id="company"
                name="company"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="mt-block">
              <PosterButton type="submit">Send message</PosterButton>
            </div>
          </form>

          {settings?.bookingEmail ? (
            <p className="hs-meta mt-gap text-smoke">
              Or email{" "}
              <a
                href={`mailto:${settings.bookingEmail}`}
                className="text-ink-white underline transition-colors duration-[120ms] ease-[steps(2,end)] hover:text-flash"
              >
                {settings.bookingEmail}
              </a>
              .
            </p>
          ) : null}
        </div>
      </section>
    </>
  );
}
