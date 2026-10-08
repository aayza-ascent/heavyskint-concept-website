import type { Metadata } from "next";
import { PageHeading } from "@/components/site/PageHeading";
import {
  Prose,
  ProseHeading,
  PolicyIncompleteNotice,
  PolicyFooter,
} from "@/components/site/Prose";
import { TRADER } from "@/lib/legal";
import { MERCH_ONLINE } from "@/lib/site";
import { env } from "@/lib/env";

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
 * emails and stores nothing (src/app/api/contact/route.ts), an opt-in mailing
 * list held in Mailchimp (src/app/api/newsletter/route.ts), no analytics, no
 * tracking pixels. Shows (Bandsintown) and releases (Apple Music) are fetched
 * by the server, so the visitor's browser never contacts either. Fonts are
 * self-hosted by next/font and covers go through /_next/image for the same
 * reason. The shop sections only render while MERCH_ONLINE is true, and the
 * mailing list wording follows whether MAILCHIMP_API_KEY is set.
 *
 * If any of that changes — Cloudflare Web Analytics, a newsletter, an embedded
 * player — this page changes in the same commit. A privacy notice that
 * describes an older version of the site is a compliance problem, not a
 * documentation one.
 */
export default function PrivacyPage() {
  // Without the key, the sign-up form hands visitors to Mailchimp's own page.
  const signsUpOnSite = Boolean(env.mailchimp.apiKey);

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
            advertising pixels, and no third-party cookies.
          </p>
          <p>
            {MERCH_ONLINE
              ? "Three things do involve your data: emailing us through the contact form, joining the mailing list, and buying something. All three are below."
              : "Two things do involve your data: emailing us through the contact form, and joining the mailing list. Both are below."}
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
            and message are emailed through Resend, our email provider, to the
            two people who handle the band&rsquo;s bookings. That email is the
            only copy. The message is not saved to a
            database, and there is no CRM behind it.
          </p>
          <p>
            To stop the form being used to send spam, we keep a count of recent
            submissions per IP address in the server&rsquo;s memory for one
            hour. It is a count and a timestamp, not your message, and it is
            gone when the server restarts. Nothing is written to disk. The
            mailing list sign-up works the same way.
          </p>
          <p>
            The lawful basis is legitimate interest: you contacted us, and we
            need to be able to read and reply.
          </p>

          <ProseHeading>The mailing list</ProseHeading>
          {signsUpOnSite ? (
            <p>
              If you sign up, your email address is sent to Mailchimp, our
              mailing list provider, and used only to tell you about new shows
              and releases. Mailchimp emails you once to confirm, and you are not
              on the list until you do. Your address is never sold or shared.
            </p>
          ) : (
            <p>
              Signing up takes you to our page on Mailchimp, our mailing list
              provider, where you enter your email address. It is stored by
              Mailchimp and used only to tell you about new shows and releases.
              It is never sold or shared. That page is Mailchimp&rsquo;s, and
              its own privacy notice covers it.
            </p>
          )}
          <p>
            Mailchimp records whether each email is opened and which links in
            it are clicked, which tells us whether anyone is reading. That
            happens in the email, not on this site.
          </p>
          <p>
            Every email has an unsubscribe link, and using it takes you off the
            list straight away. You can also email us and we will remove you.
          </p>
          <p>
            The lawful basis is consent: you asked to be on the list, and you
            can withdraw that at any time.
          </p>

          {MERCH_ONLINE ? (
            <>
              <ProseHeading>Buying merch</ProseHeading>
              <p>
                The shop runs on Shopify. When you check out you leave this site
                for Shopify&rsquo;s own hosted checkout, and your name, address
                and payment details are given to Shopify, not to us. Card
                details never reach this website at any point.
              </p>
              <p>
                We see what we need to post your order — what you bought, where
                it is going, and your contact details — through the Shopify
                admin.
              </p>
              <p>
                The lawful basis is performance of a contract: we cannot send
                you a t-shirt without an address.
              </p>
            </>
          ) : null}

          <ProseHeading>Cookies</ProseHeading>
          {MERCH_ONLINE ? (
            <>
              <p>
                One, and only if you add something to your bag. It is called{" "}
                <code>heavyskint_cart_id</code>, it holds a Shopify cart
                identifier, and it exists so your bag survives a page refresh.
                It is httpOnly, so no JavaScript on the page can read it, and it
                expires after about ten days.
              </p>
              <p>
                It is strictly necessary for a shop, which is why there is no
                cookie banner. A banner asking permission for a functional cart
                cookie would be theatre.
              </p>
            </>
          ) : (
            <p>
              None. Nothing on this site sets a cookie for visitors, which is
              why there is no cookie banner. The band&rsquo;s editing area, at
              /studio, uses Sanity&rsquo;s sign-in cookies, but only for band
              members who sign in there.
            </p>
          )}

          <ProseHeading>Who else touches your data</ProseHeading>
          <ul>
            <li>
              <strong>Vercel</strong> hosts the site and keeps short-lived
              server logs, which include IP addresses.
            </li>
            {MERCH_ONLINE ? (
              <li>
                <strong>Shopify</strong> handles the shop, checkout and payment.
              </li>
            ) : null}
            <li>
              <strong>Resend</strong> delivers contact-form emails.
            </li>
            <li>
              <strong>Mailchimp</strong> holds the mailing list and sends its
              emails.
            </li>
            <li>
              <strong>Sanity</strong> stores some of the site&rsquo;s text and
              photos. No visitor data goes near it.
            </li>
          </ul>
          <p>
            Show dates come from Bandsintown and releases and their artwork from
            Apple Music. This site&rsquo;s server fetches them itself, so your
            browser never contacts either, and the fonts are served from this
            site too.
          </p>

          <p>
            Some of these process data outside the UK. Where they do, they rely
            on the UK&rsquo;s approved transfer mechanisms, and each publishes
            its own privacy notice with the detail.
          </p>

          <ProseHeading>Links to other sites</ProseHeading>
          <p>
            Some buttons take you somewhere else. Tickets, RSVP and Notify me go
            to Bandsintown. Stream goes to the release&rsquo;s smart link or to
            Apple Music, and the band&rsquo;s social links go to those
            platforms. Once you are there, that site&rsquo;s own privacy notice
            and cookies apply, not this one.
          </p>

          <ProseHeading>Your rights</ProseHeading>
          <p>
            You can ask us for a copy of what we hold about you, ask us to
            correct or delete it, or object to how we use it. Email us and we
            will answer within a month.
          </p>
          {MERCH_ONLINE ? (
            <p>
              For anything to do with an order, Shopify holds the record, so
              tell us the order number and we will retrieve it. If you are
              unhappy with how we have handled a request you can complain to the
              Information Commissioner&rsquo;s Office at{" "}
              <a href="https://ico.org.uk">ico.org.uk</a>.
            </p>
          ) : (
            <p>
              If you are unhappy with how we have handled a request you can
              complain to the Information Commissioner&rsquo;s Office at{" "}
              <a href="https://ico.org.uk">ico.org.uk</a>.
            </p>
          )}

          <ProseHeading>How long we keep things</ProseHeading>
          <p>
            Enquiry emails stay in the band&rsquo;s inbox as long as they are
            useful, and get deleted when they are not. Mailing list addresses
            are kept until you unsubscribe.
            {MERCH_ONLINE
              ? " Order records are kept for six years, because HMRC requires it."
              : null}
          </p>

          <PolicyFooter />
        </Prose>
      </section>
    </>
  );
}
