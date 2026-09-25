# heavyskint — status, open questions and handling

Working reference for the build. The full stack rationale and costings live in
`heavyskint-website-plan.md` at the repo root (local only, gitignored); this
picks up where that leaves off and tracks what is actually built, what is
blocked, and on whom.

**Last reviewed:** 2026-09-25

---

## 1. Where the project stands

The site is **built and verified, but not connected**. `pnpm typecheck`, `pnpm lint`,
`pnpm build` and `pnpm detect` all pass, and CI runs the same four on every push
with no secrets set — which is a real test, because the site is written to render
genuine empty states when Sanity and Shopify are absent.

### What exists

| Area | State |
|---|---|
| **Framework** | Next.js 16.3.4, App Router, Turbopack, `cacheComponents: true` (PPR by default) |
| **Design system** | *The Photocopied Dark* — `DESIGN.md` + `.impeccable/design.json` + `src/styles/tokens.css`. Every colour traced to a measured source |
| **Pages** | home, shows, music, merch, merch/[handle], about, contact, privacy, returns |
| **Content layer** | Sanity schemas (show, release, galleryImage, siteSettings), typed GROQ queries, Studio at `/studio`, seed script |
| **Merch layer** | Shopify Storefront client, cached product reads, Cart API module, add-to-cart server action |
| **Webhooks** | `/api/revalidate/sanity` (signature-verified), `/api/revalidate/shopify` (HMAC-SHA256, timing-safe) |
| **Contact** | `/api/contact` with rate limiting and honeypot, via Resend |
| **SEO** | per-route OG cards generated from the design system, `sitemap.ts`, `robots.ts`, `releases.xml` |
| **Components** | 6 site + 6 UI components, all built on tokens |
| **CI** | GitHub Actions: typecheck, lint, build, design detector |
| **Docs** | `PRODUCT.md`, `DESIGN.md`, `README.md`, `docs/BAND-GUIDE.md` |

### What is deliberately not built

- **No account exists yet** — Sanity, Shopify, Vercel, Resend, domain. All need
  the band's payment details and must be created under their ownership.
- **Variant picker / cart UI** is written but **has never run against a real
  store**. `src/app/(site)/merch/[handle]/actions.ts` carries an explicit
  ⚠ UNVERIFIED marker.
- **No analytics** yet (Cloudflare Web Analytics, once the domain exists).
- **No newsletter** — deliberately deferred, see §6.

### Running on fixtures

With no `.env.local`, the site renders from `src/lib/fixtures.ts`: **13 shows and
3 releases** reconstructed from the band's own posters and Instagram captions.
This exists so the design was verified against real string lengths rather than
lorem. It is also the seed source for Sanity (`pnpm seed`).

> **5 of the 13 shows carry `unverifiedDate: true`** — only a month was legible in
> the source, so the day is a placeholder. These surface in the Studio as
> `[CHECK DATE]` in the venue field.

---

## 2. Things to confirm

Grouped by who can actually answer. ⛔ = blocks launch.

### From the band

| # | Question | Why it matters |
|---|---|---|
| 1 ⛔ | **Legal trading name and structure** — sole trader, partnership, or limited company? | Fills `TRADER.legalName`. See §5 for why this is not a formality in Scotland |
| 2 ⛔ | **Geographic trading address** | Legally required for distance selling. A PO box is not sufficient |
| 3 ⛔ | **Customer contact email** for orders | Required on the returns policy |
| 4 ⛔ | **Returns address** | Often not the trading address |
| 5 ⛔ | **Is "sold out every show since early 2025" literally true?** | Stated as fact in `PRODUCT.md` and on the site. See §5 |
| 6 ⛔ | **Scottish Live Music Awards — nominated or won?** | The source caption says *nominated*; the site says *recognised*. See §5 |
| 7 ⛔ | **Photographer permission** for every image in `public/press/`, plus full-resolution originals | Currently Instagram-derived. Copyright and quality both |
| 8 | Real dates for the 5 `[CHECK DATE]` shows | Wrong gig dates are worse than absent ones |
| 9 | Streaming and social links | Nothing points at Spotify or Bandcamp yet |
| 10 | Shipping regions — UK only, or international? | Determines Shopify zones and whether IOSS becomes relevant |
| 11 | Company number and VAT number, if either applies | Must be displayed if they exist |
| 12 | Who is the named site manager? | One person, per the plan. They own the Studio login |

### Your decisions

| # | Question | Notes |
|---|---|---|
| 13 ⛔ | **Domain name** — check `.co.uk` and `.com` availability together | ~£12/yr combined at cost. Can force a name decision, so do it first |
| 14 | GitHub remote — band-owned org, or yours? | No remote exists yet. I have not pushed anywhere |
| 15 | Shopify billed monthly (£25) or annually (£19/mo)? | ~£72/yr difference |
| 16 | Who holds the account passwords? | See the ownership table in the plan — accounts should be band-owned, you as collaborator |

### Before the shop opens

| # | Item | Where |
|---|---|---|
| 17 ⛔ | Fill in `src/lib/legal.ts` | Returns and privacy pages announce their own incompleteness until you do |
| 18 ⛔ | Move Resend `from` off the sandbox address | `src/app/api/contact/route.ts:117` still uses `onboarding@resend.dev` — delivery fails in production |
| 19 ⛔ | Set `NEXT_PUBLIC_SITE_URL` in Vercel | Otherwise sitemap, OG images and canonicals all say `localhost:3000` |
| 20 ⛔ | Exercise the cart against a real store | Add to cart → refresh → complete a test-mode order. This path is unverified |
| 21 | Verify POS Lite decrements website stock | The requirement the whole stack was chosen for. Test it, don't assume it |
| 22 | ICO data protection fee — self-assess and pay | See §5 |

---

## 3. How Shopify will be handled

### The model

Shopify owns products, inventory, orders, payments, tax and fulfilment. The site
never touches payment data — customers are handed to Shopify's hosted checkout
via `cart.checkoutUrl`, so PCI scope stays effectively nil.

```
Band → Shopify admin ──┐
                       ├──→ Storefront API → our custom product pages
Band → POS Lite (gigs) ┘                            │
                                                     ▼
                                Customer → Shopify hosted checkout
```

### Why this shape

The band holds stock **and** sells at shows off the same pool. POS Lite (free on
Basic) writes to the same inventory the website reads, so a shirt sold at Tut's
drops the site's count immediately. That single requirement is what ruled out
Big Cartel, Stripe-only and link-in-bio setups.

### What is already written

- `src/lib/shopify/client.ts` — Storefront GraphQL client, no caching (callers decide)
- `src/lib/shopify/queries.ts` — product reads wrapped in `'use cache'` + `cacheTag`
- `src/lib/shopify/cart.ts` — Cart API: create, add, update, remove. Cart id in an `httpOnly` cookie
- `src/app/(site)/merch/[handle]/actions.ts` — add-to-cart server action ⚠ unverified
- `src/app/api/revalidate/shopify/route.ts` — HMAC-verified webhook

### Important: the cache is not the oversell guard

Product data is cached with `'max'` staleness, which is safe because **Shopify
re-checks stock at checkout** and rejects an order it cannot fulfil. That is what
actually protects the band when a gig sale and a web sale race each other. Don't
over-engineer the cache to compensate for something it was never doing.

### Setup steps, in order

1. Create the store under a **band-owned** email; you take a collaborator account
2. Shopify Payments **on** — Basic adds a 2% penalty on third-party gateways
3. Settings → Apps → Develop apps → enable **Storefront API**, copy the token
4. Set UK shipping zones and rates; decide on international (question 10)
5. Webhooks → `products/create`, `products/update`, `products/delete`,
   `inventory_levels/update` → `https://<domain>/api/revalidate/shopify`
6. Products: **Track quantity ON** per variant — this is what makes the site honest
7. Install POS Lite on the band's phone, test a sale, confirm the site's count drops
8. Once live, add `generateStaticParams` back to `merch/[handle]/page.tsx` — the
   exact code is in a comment there. It cannot exist while the store is empty,
   because Cache Components requires it to return at least one result

### UK caveats

- **Evri and DPD** get Shopify's negotiated rates; **Royal Mail** labels can be
  bought in-admin but at **standard rates, not discounted**
- **Return labels cannot be generated in Shopify for UK merchants** (US only).
  Returns are a manual process unless you add an app like ReturnZap
- Payment rates: **2.0% + 25p online** (cheaper than the US), in-person lower again

---

## 4. How Sanity Studio will be handled

### The model

Studio is embedded at `/studio` — same domain, one login, no separate app to
deploy. `robots: noindex` keeps it out of search entirely.

**The split the band is taught:** *the Studio is words and dates. Shopify is
anything with a price.* That line is in `docs/BAND-GUIDE.md` and it is
deliberately the only rule they need to remember.

### Why two surfaces, not one

Products could be mirrored into Sanity, but Shopify must remain the source of
truth for inventory or the POS guarantee breaks. Two surfaces is the honest
answer, and it maps to how the band already thinks about the work.

### What is already written

- `sanity.config.ts` — Studio config with a custom sidebar: **Shows** (split
  Upcoming / Past / All), **Music**, **Photos**, then **Site settings**
- Site settings is a **singleton** — cannot be duplicated, deleted or unpublished,
  so nobody ever wonders which one is live
- Shows split by `date >= now()` in the structure filter, so a gig moves to Past
  on its own with no republishing
- `sanity/schemas/` — four types, written with plain-English field titles and help text
- `src/app/studio/[[...tool]]/` — renders a **setup notice**, not a broken editor,
  until a project id exists
- `sanity/seed.mts` — one-off, writes the 13 fixture shows and 3 releases in

> `StudioClient.tsx` must stay a Client Component. Importing `sanity.config.ts`
> from the server graph resolves `swr` to its `react-server` build and the build
> fails with *"Export default doesn't exist in target module"*. The reason is
> commented in the file — don't refactor it away.

### Setup steps, in order

1. Create the project at `sanity.io/manage` under a **band-owned** email
2. Set `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`
3. Add the band's editor as a user — free tier is **20 seats**, so no cost pressure
4. Create a write token, run `pnpm seed` **once**, then revoke it
5. **Fix the 5 `[CHECK DATE]` shows** with the band before anyone else sees them
6. Webhook: `sanity.io/manage` → API → Webhooks, payload `{ "_type": _type, "_id": _id }`,
   secret matching `SANITY_REVALIDATE_SECRET`, pointing at `/api/revalidate/sanity`
7. CORS: add the production origin in `sanity.io/manage` or the Studio won't load

---

## 5. Legal — Scotland / UK

> Not legal advice — I'm not a lawyer. These are the points that apply to a
> Glasgow-based band selling merch online, with sources. Items marked **⚖** are
> worth twenty minutes with a solicitor before the shop opens.

### Scotland-specific — these differ from England

**⚖ Scottish partnerships have separate legal personality.** Unlike an English
partnership, a Scottish general partnership is a legal person in its own right:
it can own assets, contract, sue and be sued in the partnership's name. This
matters because **five people sharing gig and merch income may already be a
Scottish general partnership without having chosen to be one**, with unlimited
liability for each partner. It directly determines what goes in
`TRADER.legalName` and who is actually on the hook if something goes wrong.
Worth an explicit decision rather than a default.

**⚖ Governing law clause must say Scotland.** Almost every free e-commerce T&Cs
template defaults to "the laws of England and Wales". For a Scotland-based
trader that is simply wrong, and Shopify's own policy templates will not fix it
for you. The clause should specify **Scots law and the Scottish courts**.

**Disputes run differently.** A consumer claim in Scotland goes through **Simple
Procedure** in the sheriff court (up to £5,000), not the English small claims
track. Prescription periods also differ under the Prescription and Limitation
(Scotland) Act 1973 — generally five years rather than six.

### UK-wide (applies fully in Scotland)

| Area | Requirement | State |
|---|---|---|
| **Consumer Contracts Regs 2013** | 14-day cancellation from receipt; trader identity and **geographic address** given pre-contract (PO box insufficient) | Returns page written; blocked on `legal.ts` |
| **Consumer Rights Act 2015** | Goods as described, satisfactory quality, fit for purpose; 30-day short-term right to reject | Covered in returns page |
| **UK GDPR / DPA 2018** | Privacy notice naming the **data controller** | Privacy page written; blocked on `legal.ts` |
| **ICO data protection fee** | Registration + annual fee. **Tier 1 = £52** (turnover ≤£632k or ≤10 staff), −£5 by direct debit | ⛔ Not done. Run the ICO self-assessment |
| **PECR** | Cookie/marketing consent | **No banner needed** — analytics is cookieless and checkout is on Shopify's domain |
| **VAT** | Threshold **£90,000** rolling 12 months (unchanged since April 2024) | Band almost certainly below — no VAT on merch |
| **DMCC Act 2024** | CMA now has **direct fining powers** for consumer-law breaches, commencing in stages through 2026 | Raises the stakes on the claims below |

### ⚖ Two claims on the site that need verifying

This is the item I'd action first, because it is both an accuracy problem and,
on a commercial site, a small but real misleading-practices risk under CPUT/DMCC.

1. **"Sold out every show since early 2025"** — stated as a factual proof point
   in `PRODUCT.md`. If it is literally true, it is a genuinely strong claim.
   If it is *nearly* true, it needs rewording.

2. **The Scottish Live Music Awards claim is currently overstated.** The site
   says the band "were **recognised** as one of the country's most exciting live
   acts at the most recent Scottish Live Music Awards." The source caption in
   `public/press/manifest.json` reads *"SCOTTISH LIVE MUSIC AWARDS — yes people,
   we've been **nominated**"*. Nominated is not the same as recognised or won.
   Confirm the outcome and correct `PRODUCT.md` either way.

### ⚖ Image rights

Everything in `public/press/` was derived from Instagram posts — the original
filenames are still recorded in `manifest.json`. Two problems: the band posting
a photo does not transfer the photographer's copyright, and these are low-res
derivatives (~1400px) rather than originals. Get written permission and
full-resolution files, or replace them. The site leans on this photography
completely, so it is not a detail.

### Not currently applicable

- **PRS/PPL** — for public performance and broadcast, not merch sales. Relevant
  to the band's gigging, not this site
- **Mechanical licensing** — only if they press physical copies of songs they
  don't wholly own
- **EU IOSS** — only if they ship into the EU at volume (question 10)

---

## 6. Other open considerations

**Newsletter.** Deferred on purpose. Doing it properly means PECR consent, a
working unsubscribe and a lawful basis — it is a small compliance surface of its
own, not a checkbox. Resend Audiences is the natural fit when the band wants it.

**Bandsintown sync.** Optional. If the band already maintains Bandsintown, one
update syndicates to Spotify and Facebook, and show dates could be pulled from
there instead of hand-entered. Only worth it if they genuinely keep it current —
otherwise it's a second stale surface.

**The `AGENTS.md` block at the repo root** is rewritten by `next dev` on every
run. Committing it with your work keeps the tree clean; deleting it just
recreates it.

**`PRODUCT.md` and `DESIGN.md` must stay at the repo root.** The design tooling
reads them from there and the path isn't configurable.

**The design detector runs in CI** (`pnpm detect`) and **exits 2 on findings**, so
a contrast or rhythm regression fails the build rather than shipping quietly. It
is pinned to major 4 so a breaking release can't fail yesterday's passing build.

**Impeccable's engine binary is gitignored** (12MB, darwin-arm64). `npx impeccable
install` re-fetches it. `DESIGN.md` — the contract — is tracked; the tool is not.

**Maintenance terms** should be agreed separately from the build: dependency
updates, uptime expectations, and what counts as a change request versus new
work. Worth settling before launch rather than after the first 2am request.

---

## 7. Cost reference

Carried forward from the plan so it's in one place.

```
Vercel Pro          ~£15.00/mo   (billed $20 USD — drifts with FX)
Shopify Basic        £25.00/mo   (£19/mo billed annually)
Sanity Free           £0.00      (20 seats)
Resend Free           £0.00      (3k emails/mo)
Domain (.com)         £0.65/mo   (~£7.73/yr at cost, Cloudflare)
──────────────────────────────
ex VAT              ~£41/mo
inc VAT @20%        ~£49/mo      (~£42/mo with Shopify annual)
```

**Quote the band the inc-VAT figure.** Below the £90k threshold they cannot
reclaim VAT, so ~£49/mo is their real cost.

One-off: **ICO data protection fee £52/yr** (£47 by direct debit) — not in the
monthly figure above and easy to forget.

---

## Sources

- [ICO data protection fee](https://ico.org.uk/for-organisations/data-protection-fee/data-protection-fee/)
- [Scottish general partnerships: separate legal personality](https://uk.practicallaw.thomsonreuters.com/w-019-2048)
- [Distance selling — House of Commons Library](https://commonslibrary.parliament.uk/research-briefings/sn05761/)
- [Consumer Contracts Regulations](https://harperjames.co.uk/article/distance-selling-contracts-and-the-consumer-contracts-regulations/)
- [UK VAT threshold](https://www.freeagent.com/rates/vat/)
- [Selling via online platforms — Business Companion](https://www.businesscompanion.info/focus/guidance-for-online-businesses/selling-goods-via-online-platforms)
