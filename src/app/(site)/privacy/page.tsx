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
  title: "Privacy",
  description:
    "What heavyskint.com does with your data, and what it doesn't collect.",
};

/**
 * Privacy notice.
 *
 * Describes only what this codebase actually does. Every claim below is
 * checkable against source, and the boring answer is the true one: one
 * httpOnly cookie for the cart (src/lib/shopify/cart.ts), a contact form that
 * emails and stores nothing (src/app/api/contact/route.ts), no analytics, no
 * tracking pixels, no marketing list.
 *
 * If any of that changes — Cloudflare Web Analytics, a newsletter, an embedded
 * player — this page changes in the same commit. A privacy notice that
 * describes an older version of the site is a compliance problem, not a
 * documentation one.
 */
export default function PrivacyPage() {
  return (
    <>
      <PageHeading title="privacy">
        What happens to your data here, and what we don&rsquo;t collect.
      </PageHeading>

      <section className="border-t border-smoke px-gutter py-void">
        <PolicyIncompleteNotice />

        <Prose>
          <ProseHeading>The short version</ProseHeading>
          <p>
            We don&rsquo;t track you. There are no analytics on this site, no
            advertising pixels, and no third-party cookies. We don&rsquo;t have
            a mailing list, so there is nothing to unsubscribe from.
          </p>
          <p>
            Two things do involve your data: emailing us through the contact
            form, and buying something. Both are below.
          </p>

          <ProseHeading>Who we are</ProseHeading>
          {TRADER.legalName && TRADER.address ? (
            <p className="whitespace-pre-line">
              {TRADER.legalName} is the data controller for this site.{"\n"}
              {TRADER.address}
              {TRADER.contactEmail ? (
                <>
                  {"\n"}
                  <a href={`mailto:${TRADER.contactEmail}`}>
                    {TRADER.contactEmail}
                  </a>
                </>
              ) : null}
            </p>
          ) : (
            <p>
              The data controller for this site has not been recorded yet. See
              the notice above.
            </p>
          )}

          <ProseHeading>The contact form</ProseHeading>
          <p>
            When you send a booking or press enquiry, your name, email address
            and message are emailed to the band through Resend, our email
            provider. That email is the only copy. The message is not saved to a
            database, and there is no CRM behind it.
          </p>
          <p>
            To stop the form being used to send spam, we keep a count of recent
            submissions per IP address in the server&rsquo;s memory for one
            hour. It is a count and a timestamp, not your message, and it is
            gone when the server restarts. Nothing is written to disk.
          </p>
          <p>
            The lawful basis is legitimate interest: you contacted us, and we
            need to be able to read and reply.
          </p>

          <ProseHeading>Buying merch</ProseHeading>
          <p>
            The shop runs on Shopify. When you check out you leave this site for
            Shopify&rsquo;s own hosted checkout, and your name, address and
            payment details are given to Shopify, not to us. Card details never
            reach this website at any point.
          </p>
          <p>
            We see what we need to post your order — what you bought, where it
            is going, and your contact details — through the Shopify admin.
          </p>
          <p>
            The lawful basis is performance of a contract: we cannot send you a
            t-shirt without an address.
          </p>

          <ProseHeading>Cookies</ProseHeading>
          <p>
            One, and only if you add something to your bag. It is called{" "}
            <code>heavyskint_cart_id</code>, it holds a Shopify cart
            identifier, and it exists so your bag survives a page refresh. It is
            httpOnly, so no JavaScript on the page can read it, and it expires
            after about ten days.
          </p>
          <p>
            It is strictly necessary for a shop, which is why there is no cookie
            banner. A banner asking permission for a functional cart cookie
            would be theatre.
          </p>

          <ProseHeading>Who else touches your data</ProseHeading>
          <ul>
            <li>
              <strong>Vercel</strong> hosts the site and keeps short-lived
              server logs, which include IP addresses.
            </li>
            <li>
              <strong>Shopify</strong> handles the shop, checkout and payment.
            </li>
            <li>
              <strong>Resend</strong> delivers contact-form emails.
            </li>
            <li>
              <strong>Sanity</strong> stores the site&rsquo;s content — show
              dates, releases, photos. No visitor data goes near it.
            </li>
          </ul>
          <p>
            Some of these process data outside the UK. Where they do, they rely
            on the UK&rsquo;s approved transfer mechanisms, and each publishes
            its own privacy notice with the detail.
          </p>

          <ProseHeading>Your rights</ProseHeading>
          <p>
            You can ask us for a copy of what we hold about you, ask us to
            correct or delete it, or object to how we use it. Email us and we
            will answer within a month.
          </p>
          <p>
            For anything to do with an order, Shopify holds the record, so tell
            us the order number and we will retrieve it. If you are unhappy with
            how we have handled a request you can complain to the Information
            Commissioner&rsquo;s Office at{" "}
            <a href="https://ico.org.uk">ico.org.uk</a>.
          </p>

          <ProseHeading>How long we keep things</ProseHeading>
          <p>
            Enquiry emails stay in the band&rsquo;s inbox as long as they are
            useful, and get deleted when they are not. Order records are kept
            for six years, because HMRC requires it.
          </p>

          <PolicyFooter />
        </Prose>
      </section>
    </>
  );
}
