import { Suspense } from "react";
import { PosterButton } from "@/components/ui/PosterButton";
import { FormTimestamp } from "@/components/ui/FormTimestamp";

/**
 * Mailing list sign-up.
 *
 * A plain form POST to /api/newsletter, for the same reason the contact form
 * is one: it works with JavaScript off and fails as a page load rather than
 * silently. The handler redirects back to `#mailing-list` with
 * `?newsletter=<status>`, which the notice below reads.
 *
 * Consent is the act of submitting this form, so the copy says exactly what
 * people are signing up to and that they can leave — PECR wants it specific
 * and informed, not a pre-ticked box. The privacy page describes the rest.
 */

const MESSAGES: Record<string, { tone: "ok" | "problem"; text: string }> = {
  subscribed: {
    tone: "ok",
    text: "You're on the list. New shows and releases will reach you first.",
  },
  email: {
    tone: "problem",
    text: "That email address doesn't look right — check it and try again.",
  },
  "rate-limited": {
    tone: "problem",
    text: "That's several sign-ups in a short time. Try again in an hour.",
  },
  unavailable: {
    tone: "problem",
    text: "Sign-ups aren't open quite yet. Check back soon.",
  },
  error: {
    tone: "problem",
    text: "Something went wrong signing you up. Try again in a moment.",
  },
};

function StatusNotice({ status }: { status?: string }) {
  const message = status ? MESSAGES[status] : undefined;
  if (!message) return null;

  return (
    // No red or green: state is carried by the bone bar and the wording.
    <div
      role="status"
      className="mt-step flex flex-wrap items-center gap-block border border-smoke p-block"
    >
      <span className="hs-label bg-bone px-tight py-hair text-ink">
        {message.tone === "ok" ? "Signed up" : "Not signed up"}
      </span>
      <p className="hs-body text-ink-white">{message.text}</p>
    </div>
  );
}

async function MailingListStatus({
  searchParams,
}: {
  searchParams: Promise<{ newsletter?: string | string[] }>;
}) {
  const { newsletter } = await searchParams;
  return (
    <StatusNotice
      status={typeof newsletter === "string" ? newsletter : undefined}
    />
  );
}

export function MailingList({
  searchParams,
}: {
  searchParams: Promise<{ newsletter?: string | string[] }>;
}) {
  return (
    <section
      id="mailing-list"
      aria-labelledby="mailing-list-heading"
      className="border-t border-smoke px-gutter py-void"
    >
      <h2 id="mailing-list-heading" className="hs-headline text-ink-white">
        mailing list
      </h2>
      <p className="hs-body mt-block max-w-[36rem] text-smoke">
        New shows and releases, straight to your inbox before anywhere else.
        Not often, and you can unsubscribe from any email.
      </p>

      {/* Reading the query string would block the page from prerendering, so
          the notice streams in behind its own boundary. */}
      <Suspense fallback={null}>
        <MailingListStatus searchParams={searchParams} />
      </Suspense>

      <form
        action="/api/newsletter"
        method="post"
        className="mt-step flex max-w-[36rem] flex-col gap-block sm:flex-row sm:items-end"
      >
        <div className="flex-1">
          <label htmlFor="newsletter-email" className="hs-label block text-smoke">
            Email address
          </label>
          <input
            id="newsletter-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="hs-body mt-tight w-full border border-smoke bg-ink-raised px-block py-[14px] text-flash transition-colors duration-[120ms] ease-[steps(2,end)] focus:border-flash focus:outline-none"
          />
        </div>

        <FormTimestamp />

        {/* Honeypot — off-screen for people, tempting to bots. */}
        <div
          aria-hidden="true"
          className="absolute left-[-9999px] h-px w-px overflow-hidden"
        >
          <label htmlFor="newsletter-company">Company</label>
          <input
            id="newsletter-company"
            name="company"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <PosterButton type="submit">Sign up</PosterButton>
      </form>
    </section>
  );
}
