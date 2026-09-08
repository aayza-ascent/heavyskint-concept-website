import { longDate } from "@/lib/format";
import { missingTraderDetails, POLICY_LAST_UPDATED } from "@/lib/legal";

/**
 * The reading column, for the legal pages.
 *
 * These are the only Read-mode surfaces on the site, and they get treated as
 * such: a constrained measure, generous leading, and headings that scan — a
 * customer reading this is usually mid-problem and looking for one specific
 * sentence. The rest of the world still applies (ink ground, lowercase display
 * heading, zero radius); what changes is that nothing competes with the text.
 *
 * `hs-body` already sets leading 1.5. The measure cap is what does the work:
 * at the page gutter, unconstrained prose would run to well over 100 characters
 * on a desktop viewport, which is unreadable regardless of leading.
 */
export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="hs-body max-w-[62ch] text-ink-white [&_a]:underline [&_a]:decoration-smoke [&_a:hover]:decoration-ink-white [&_h2]:mt-void [&_h2]:first:mt-0 [&_li]:mt-tight [&_p]:mt-step [&_p]:first:mt-0 [&_ul]:mt-step [&_ul]:list-disc [&_ul]:pl-block">
      {children}
    </div>
  );
}

/** Section heading inside a Prose column. */
export function ProseHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="hs-title text-ink-white">{children}</h2>;
}

/**
 * States plainly that a policy is not finished.
 *
 * A half-written policy is worse than an obviously unfinished one: a customer
 * who reads an incomplete returns policy has still been given terms, and a
 * privacy notice with no named controller does not satisfy UK GDPR. So rather
 * than hiding the gap behind plausible text, the page says which details are
 * missing, in bone — the loudest thing in the system.
 *
 * Fill in TRADER in src/lib/legal.ts and this disappears on its own.
 */
export function PolicyIncompleteNotice() {
  const missing = missingTraderDetails();
  if (missing.length === 0) return null;

  return (
    <div className="mb-void bg-bone px-step py-block text-ink">
      <p className="hs-label">Not ready to publish</p>
      <p className="hs-body mt-tight max-w-[62ch] text-paper-shadow">
        This policy is incomplete. It is still missing{" "}
        {`${new Intl.ListFormat("en-GB", {
          style: "long",
          type: "conjunction",
        }).format(missing)}.`}{" "}
        Add them to <code>src/lib/legal.ts</code> before the store opens —
        selling at a distance in the UK requires them.
      </p>
    </div>
  );
}

/** Review date, closing a policy page. */
export function PolicyFooter() {
  return (
    <p className="hs-label mt-void text-smoke">
      Last updated{" "}
      <time dateTime={POLICY_LAST_UPDATED}>
        {longDate(POLICY_LAST_UPDATED)}
      </time>
    </p>
  );
}
