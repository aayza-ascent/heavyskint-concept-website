import type { Metadata } from "next";
import { PageHeading } from "@/components/site/PageHeading";
import {
  Prose,
  ProseHeading,
  PolicyIncompleteNotice,
  PolicyFooter,
} from "@/components/site/Prose";
import { TRADER } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Returns",
  description:
    "Cancellations, returns and refunds for heavyskint merch orders.",
};

/**
 * Returns and cancellations.
 *
 * Written against the Consumer Contracts (Information, Cancellation and
 * Additional Charges) Regulations 2013, which govern UK distance selling. The
 * 14-day cancellation right and the 14-day refund window are statutory minima,
 * not choices — the band can be more generous, never less.
 *
 * Deliberately excluded, because they would be wrong: any claim about who pays
 * return postage beyond the default, and any restocking or handling fee. Both
 * are decisions the band has not made, and inventing either creates a term a
 * customer could rely on.
 */
export default function ReturnsPage() {
  return (
    <>
      <PageHeading title="returns">
        Cancellations, returns and refunds.
      </PageHeading>

      <section className="border-t border-smoke px-gutter py-void">
        <PolicyIncompleteNotice />

        <Prose>
          <ProseHeading>Cancelling an order</ProseHeading>
          <p>
            If you are in the UK you have the right to cancel an order for any
            reason within 14 days of receiving it. You do not have to give us a
            reason, and you do not have to have opened the parcel.
          </p>
          <p>
            To cancel, email us
            {TRADER.contactEmail ? (
              <>
                {" "}
                at <a href={`mailto:${TRADER.contactEmail}`}>{TRADER.contactEmail}</a>
              </>
            ) : null}{" "}
            with your order number. Telling us within the 14 days is what
            matters; the goods can come back after that.
          </p>

          <ProseHeading>Sending it back</ProseHeading>
          <p>
            Once you have told us you are cancelling, you have a further 14 days
            to send the items back. Please send them in a condition we could
            reasonably resell — unworn, with any tags still attached. Records
            and other sealed media need to be unopened.
          </p>
          {TRADER.returnsAddress ? (
            <p className="whitespace-pre-line">
              Send returns to:{"\n"}
              {TRADER.returnsAddress}
            </p>
          ) : null}
          <p>
            Get proof of postage. Until a parcel reaches us it is your
            responsibility, and proof of postage is what settles it if a return
            goes missing.
          </p>

          <ProseHeading>Refunds</ProseHeading>
          <p>
            We refund within 14 days of receiving the items back, to the payment
            method you used. That includes the standard delivery you paid to
            receive the order. If you chose a faster delivery option, we refund
            the cost of our standard option rather than the upgrade.
          </p>
          <p>
            You pay the cost of returning items to us, unless they arrived
            faulty, damaged or not as described.
          </p>

          <ProseHeading>Faulty or wrong items</ProseHeading>
          <p>
            This is separate from cancelling, and your rights are stronger.
            Under the Consumer Rights Act 2015 you can ask for a full refund
            within 30 days of delivery if an item is faulty, damaged in transit
            or not what you ordered. After 30 days you are entitled to a repair
            or replacement.
          </p>
          <p>
            In any of those cases we cover the return postage. Email us with
            your order number and a photograph of the problem and we will sort
            it — no need to post anything first.
          </p>

          <ProseHeading>Gig tickets</ProseHeading>
          <p>
            This policy covers merch bought through this site. Tickets are sold
            by the venues and promoters, not by us, so their terms apply and
            refunds go through them. If a show we are playing is cancelled or
            rescheduled, whoever sold you the ticket handles it.
          </p>
          <p>
            The 14-day cancellation right does not apply to tickets for a dated
            event in any case — that is a statutory exception for live events,
            not something we have chosen.
          </p>

          <PolicyFooter />
        </Prose>
      </section>
    </>
  );
}
