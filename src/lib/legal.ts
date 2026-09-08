/**
 * Trader identity and policy dates for the legal pages.
 *
 * Kept in code rather than Sanity on purpose: this is set-once information with
 * legal consequences, not content the band should be able to edit casually
 * between gigs.
 *
 * Every field below is deliberately empty. UK law requires a trader selling at
 * distance to identify itself and give a geographic address, and a privacy
 * notice must name the data controller — none of which can be invented here.
 * While a field is empty the affected page renders an unmissable notice instead
 * of quietly publishing an incomplete policy.
 */

export type TraderDetails = {
  /** Legal entity name. A partnership or sole trader uses the trading name. */
  legalName: string | null;
  /** Geographic address. Required for distance selling; a PO box is not enough. */
  address: string | null;
  /** Where customers reach a human about an order. */
  contactEmail: string | null;
  /** Companies House number, if incorporated. Null for a sole trader/partnership. */
  companyNumber: string | null;
  /** VAT number, if registered. Null below the threshold. */
  vatNumber: string | null;
  /** Where returned goods are sent. Often not the trading address. */
  returnsAddress: string | null;
};

export const TRADER: TraderDetails = {
  legalName: null,
  address: null,
  contactEmail: null,
  companyNumber: null,
  vatNumber: null,
  returnsAddress: null,
};

/** Fields without which a policy page must not present itself as complete. */
const REQUIRED_FOR_POLICY = ["legalName", "address", "contactEmail"] as const;

export function missingTraderDetails(): string[] {
  const labels: Record<string, string> = {
    legalName: "the legal or trading name",
    address: "a geographic address",
    contactEmail: "a contact email address",
    returnsAddress: "a returns address",
  };
  return [...REQUIRED_FOR_POLICY, "returnsAddress"]
    .filter((key) => !TRADER[key as keyof TraderDetails])
    .map((key) => labels[key]);
}

/**
 * When these policies were last reviewed.
 *
 * A hardcoded date, not `new Date()`: it must change only when the text does,
 * and an unstable value would also fail the prerender under Cache Components.
 * Update it whenever either policy is edited.
 */
export const POLICY_LAST_UPDATED = "2026-09-08";
