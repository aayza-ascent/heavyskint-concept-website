# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary — the new listener.** Someone who has just heard a track, caught a support slot, or been
sent a link, deciding in seconds whether this band is for them. They arrive cold, on a phone, often
late at night after a gig or from a social post. Their job is to work out what heavyskint sounds like
and whether it is worth following, and the site's job is to turn that curiosity into a listen, a
follow, or a ticket.

Confirmed secondary audiences, each with a real job on the site:

- **Existing fans** — checking for new dates, new releases, and merch drops.
- **Merch buyers** — fans and gig-goers buying physical stock in GBP.
- **Promoters and bookers** — vetting the band and finding a booking route via the contact form.
- **The band-side editor** — one named band member who maintains show dates and merch themselves,
  without touching code or contacting the developer. Two admin surfaces serve them:
  Sanity Studio at `/studio` for "website stuff", Shopify admin for "merch stuff".

## Product Purpose

The official home of heavyskint: a Glasgow five-piece. The site carries show dates, music,
merch, and a booking route, and it is the only surface the band fully controls — every other place
they exist (streaming, Instagram, ticketing) is rented.

Success is a cold visitor leaving as a follower, a ticket-holder, or a customer, and the band adding
a show or restocking a shirt on their own, in seconds, without a deploy.

## Positioning

heavyskint's claim is live: since emerging in early 2025 they have sold out every show they have
played across Scotland, and were recognised as one of the country's most exciting live acts at the
most recent Scottish Live Music Awards. That record is factual and non-copyable — a neighbouring
band cannot truthfully claim it.

The sound draws on 90s shoegaze, grunge, and alt-rock, with a soulful tinge and an unfiltered
intensity. Performances are raw and unpredictable; that unpredictability is the product, not a
rough edge to smooth over.

**Band members:** Jacob Hunter (vocals), Jamie Kelly (guitar), Sean Reilly (guitar),
Maddie Thomasset (bass), Joel Walker (drums).

## Operating Context

- **UK / Scotland, GBP.** UK pricing, UK shipping carriers, UK consumer law, `en-GB` dates,
  UK sizing.
- **The band holds stock and sells it at shows.** Merch runs off a phone at the merch table via
  Shopify POS Lite, decrementing the same inventory pool the website reads. Sell fifteen shirts at a
  Friday gig and the site must not keep selling them on Saturday. This single fact drove the entire
  stack choice and rules out cart-only and link-in-bio solutions.
- **One editor, two admin surfaces.** Publishing in either system fires a signature-verified webhook
  that revalidates only the affected cache tag, so content is live in seconds with no deploy. The
  `/studio` page links out to Shopify admin so there is one URL to remember.
- **Accounts are band-owned.** Every service is registered under a band-owned email with the
  developer added as a collaborator, so the band's business continues independently of the developer.
- Handover includes `docs/BAND-GUIDE.md` plus short screen recordings of the real tasks: add a show,
  add a product, restock, fulfil an order, run POS at a gig.

## Capabilities and Constraints

**Surfaces:** home (hero, next show, featured merch), `/shows`, `/merch`, `/merch/[handle]`,
`/music`, `/about`, `/contact` (booking enquiries), `/studio` (embedded Sanity Studio).

**Content model (Sanity, editor-facing):**

- `show` — date, venue, city, country, ticket URL, `soldOut`, `cancelled`, support acts. Upcoming
  and past are split in GROQ against `now()`, so a show rolls into the past without anyone
  republishing.
- `release` — title, type (album / EP / single), cover, release date, streaming links, tracklist.
- `galleryImage` — image, alt, credit.
- `siteSettings` — bio, socials, press kit URL, booking email.

Schemas are written for a non-technical editor: plain-English field titles, help text, validation,
useful previews.

**Commerce (Shopify, headless):** product grid and PDP with size/colour variants; Cart API
(`cartCreate` / `cartLinesAdd`) with the cart ID in an `httpOnly` cookie and mutations as server
actions; checkout is a redirect to `cart.checkoutUrl`. Payment never touches our origin.
`checkoutCreate` is deprecated and removed — Cart API plus `checkoutUrl` is the only supported path.

**Technical constraints:**

- Next.js 16 App Router, TypeScript, Tailwind v4. Cache tags over time-based ISR.
- Server-only secrets; only `NEXT_PUBLIC_*` reaches the browser.
- Webhook signatures are mandatory on both revalidate routes (Sanity signature header; Shopify
  HMAC-SHA256), or anyone can force cache churn.
- Never proxy Shopify product images through our origin.
- The contact form needs rate limiting and a honeypot.
- Committed quality bars: Lighthouse ≥ 95 mobile across all four categories, no horizontal scroll at
  360px, and `next/image` throughout.

**UK legal and commercial facts:**

- Consumer Contracts Regulations 2013 give a 14-day right to cancel; a returns/cancellation policy is
  legally required.
- UK GDPR requires a privacy policy. Analytics is cookieless (Cloudflare Web Analytics) and Shopify's
  checkout handles its own consent on its own domain, so **the site needs no cookie banner** — a
  design decision worth protecting, since banners wreck a first impression.
- The band is under the £90,000 VAT registration threshold, so charges no VAT and cannot reclaim it.
- Shopify cannot generate UK return labels; returns are a manual process.

**Explicitly undecided — record, do not invent:**

- Domain availability on `.co.uk` and `.com` (unresolved, and could still force a name decision).
- UK shipping zones and rates; whether the band ships internationally.
- Returns policy content beyond the 14-day legal minimum.
- Newsletter at launch, and which provider.
- Named site manager and which email owns the accounts.
- Whether shows are later synced from Bandsintown rather than hand-entered.

## Brand Commitments

- **The name is always lowercase, and carries a terminal full stop: `heavyskint.`** Including
  sentence-initial and in the page title. Confirmed against the King Tut's, Edinburgh and London
  posters, where the mark prints with the period; the older McChuills handbill omits it and is
  superseded. The current code capitalises it in `metadata.title` and the homepage `h1`; that is a
  bug to fix, not a precedent.
- Band member names and instruments as listed under Positioning.
- **The palette is achromatic, and that is the defined colour system** — confirmed by the band after
  measurement showed 0.000 mean saturation across all 157 band-authored images. Ink black, bone
  photocopier paper, and blown white are the brand colours; any hue is a departure. Exact values and
  their provenance live in DESIGN.md, which is the authority for them.
- **Reference sites and visual direction exist** — the band has a direction, with a sense of what
  specifically they like. Not yet supplied.
- **Pending, and blocking parts of the design work:** logo as vector (SVG/AI/EPS, not a JPEG off
  Instagram) with lockups and clear-space rules; typefaces with **confirmed web-embedding licences** —
  desktop licences frequently do not cover webfonts, which is a genuine legal trap here.
- Geist Sans / Geist Mono in `src/app/layout.tsx` are placeholders, deliberately generic so nobody
  mistakes them for a design decision. The homepage is intentionally unstyled for the same reason.

## Evidence on Hand

**Real press quotes, usable as-is with attribution:**

- "Chaos done right" — *Music News Monthly*
- "They are going to be all over the UK, if not, the world" — *It's All Indie*
- "Equal parts vintage rock and youthful recklessness" — *The Indie Scene*

**Real proof points:** sold out every show played across Scotland since emerging in early 2025;
recognised as one of the country's most exciting live acts at the most recent Scottish Live Music
Awards.

**Confirmed to exist at launch:** confirmed upcoming shows, released music with artwork, merch in
stock, and press photos / artwork.

**Not yet in the repository.** `heavyskint-insta-images/` and `docs/` are empty; `public/` holds only
create-next-app placeholder SVGs. Real photography, artwork, and the logo must be supplied before the
surfaces that depend on them can be built.

**Absences that must never be fabricated:** no streaming or follower counts, no ticket or merch sales
figures, no customer testimonials, no venue or festival names beyond what the band supplies, no
merch pricing, no release titles or dates. Press quotes are limited to the three above.

## Product Principles

1. **Live reputation is the argument.** The sold-out run, the awards recognition, and the raw
   performances are the strongest true things about this band. Every surface should lean on real
   live proof rather than adjectives.
2. **Built for a cold visitor on a phone.** The primary user arrives knowing nothing and decides in
   seconds. Sound and identity must land before anything asks them to navigate.
3. **The band must stay self-sufficient.** Anything the band needs to change often — dates, stock,
   copy, photos — belongs in Sanity or Shopify, never hardcoded. A change that needs a developer is a
   design failure.
4. **Real content only.** The band has genuine shows, music, merch, photography, and press. Nothing
   on this site is placeholder text or invented proof.
5. **Unfiltered, not unfinished.** The band's intensity and unpredictability should come through in
   the work, while the commerce and booking paths stay precise and trustworthy.

## Accessibility & Inclusion

No user-specific accessibility requirement has been established beyond the committed baseline:
keyboard-only navigation through nav, cart, and forms; visible focus states; `prefers-reduced-motion`
respected throughout; and no horizontal scroll at 360px width.
