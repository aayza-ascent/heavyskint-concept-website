# Two versions, honestly compared

Both are built. Both use the same design system, the same photography and the
same 13 shows, so this is a decision about **architecture**, not looks.

- **Headless** — Next.js + Sanity + Shopify. Repo root. `pnpm dev` → :3000
- **Theme** — Shopify only. `shopify-concept/`. `pnpm preview` → :4321

---

## The short version

| | Headless | Theme |
|---|---|---|
| Monthly cost | **~£41 ex VAT** (~£49 inc) | **~£25 ex VAT** (~£30 inc), £19/mo billed annually |
| Accounts to own | Shopify, Sanity, Vercel, Resend, domain | Shopify, domain |
| Places the band logs in | **Two** — Studio and Shopify admin | **One** — Shopify admin |
| Language | TypeScript throughout | Liquid + CSS |
| Cart code we maintain | ~190 lines, **currently unverified** | None — `{% form 'product' %}` |
| Contact form | API route + Resend + verified domain + rate limiting | None — `{% form 'contact' %}` |
| Cache/webhook machinery | Cache tags, HMAC verification, revalidation | None |
| Deploys | Git push → CI → Vercel | `shopify theme push` |
| If they leave Shopify | Site survives, swap the commerce layer | Site goes with it |

---

## Where the theme genuinely wins

**One admin.** The headless build has an unavoidable split: dates and copy in
Sanity Studio, anything with a price in Shopify. The band guide reduces it to a
rule — *"the Studio is words and dates, Shopify is anything with a price"* — but
it is still two logins and two mental models. The theme has one.

**No sync machinery at all.** A large share of the headless codebase exists only
because the frontend is separate from the backends: `src/lib/cache-tags.ts`, two
signature-verified webhook routes, `revalidateTag`, the `isConfigured` guards,
and the Cache Components constraints we kept hitting. In the theme, `product` is
a native Liquid object. A stock change in admin is live on the next request.
There is nothing to invalidate and nothing to get wrong.

**The cart is free.** Compare:

```liquid
{% form 'product', product %}
  <select name="id">…</select>
  <button type="submit">Add to cart</button>
{% endform %}
```

against `src/lib/shopify/cart.ts` — `cartCreate`, `cartLinesAdd`,
`cartLinesUpdate`, `cartLinesRemove`, an `httpOnly` cookie, a server action and
a redirect to `checkoutUrl`. That module is **still marked ⚠ UNVERIFIED**
because it has never run against a real store. The Liquid form carries no such
risk: it is Shopify's own.

**The contact form is free too.** `{% form 'contact' %}` posts to Shopify and
delivers to the store's contact email, with its own spam handling. The headless
build needs an API route, a Resend account, an API key, a verified sending
domain, and hand-rolled rate limiting and a honeypot — and its `from` address is
still on Resend's sandbox.

**Cheaper, and fewer things to keep alive.** No Vercel, no Sanity, no Resend. One
bill, one vendor, one place to be broken.

---

## Where the headless build genuinely wins

**TypeScript.** The whole stack is TS, which is what you actually work in. The
theme is Liquid — not hard, but not the same job.

**Clean URLs.** `/shows` and `/merch` versus Shopify's fixed `/pages/shows` and
`/collections/merch`. Shopify's URL structure is not configurable.

**Sorting content.** GROQ does `*[_type == "show" && date >= now()] | order(date asc)`.
Liquid **cannot sort metaobject entries by a field value** — I hit this building
the theme. The upcoming/past split works (comparing epoch timestamps), but the
*order* relies on the band keeping entries ordered by date in the admin. It is a
real limitation, not a detail: it means a show added out of order appears out of
order until someone drags it.

**Generated OG cards.** The headless build renders a per-route social card from
the design system at build time. A theme would need static images made by hand
and re-made whenever the design changes.

**Fonts.** The theme loads Archivo from Google Fonts because a theme has no
build step to subset with. The Next build subsets and self-hosts it.

**Typed content with validation.** Sanity schemas enforce field types, required
fields and help text. Metaobjects have field types but less validation and no
custom document previews.

**The design detector runs in CI.** `pnpm detect` fails the build on a contrast
or rhythm regression. There is no equivalent gate on a theme push.

**Portability.** If the band ever leaves Shopify, the headless site keeps
working and the commerce layer gets swapped. The theme goes with the platform.

---

## What I'd say to the band

If the question is *"which is easier for us to run?"* — **the theme**, clearly.
One login, one bill, and nothing between changing a price and it being live.

If the question is *"which is better as a long-lived asset?"* — **headless**, but
the margin is narrower than it looks on paper, and it is mostly about not being
tied to Shopify.

The honest framing: the headless build is the better *engineering* answer and the
theme is the better *band* answer. The brief asked for something the band can
manage themselves, which points at the theme.

## What I'd say about the money

The gap is roughly **£19/month inc VAT** — about £230 a year. That is real for a
band, but it is not the main argument. The main argument is that the theme has
perhaps a third of the moving parts, and every one removed is one that cannot
break at 2am before a tour announcement.

---

## What is not proven yet in either

Both versions share the same open items — trader details, photographer
permission, the awards claim, the five unverified dates. See
`docs/PROJECT-STATUS.md` at the repo root.

Specific to this comparison:

- The theme has **never run on a real Shopify store**. The preview harness
  renders it faithfully, but a store will surface things a harness cannot —
  particularly metaobject ordering and how the theme editor feels to the band.
- The headless cart has never run against a real store either. Neither cart path
  is proven; the difference is that one of them is Shopify's code and one is
  ours.
- If both are kept alive, the design system has to be maintained twice. That is
  a reason to decide reasonably soon rather than sit on both.
