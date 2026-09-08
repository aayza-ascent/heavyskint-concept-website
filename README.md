# heavyskint.

The band's site. Next.js 16 (App Router, Turbopack, Cache Components), Sanity
for content, Shopify Storefront for merch.

## See it running

```bash
pnpm install
pnpm dev
```

Then open **http://localhost:3000**.

Use `pnpm`, not `npm` — the lockfile is `pnpm-lock.yaml` and the repo is a pnpm
workspace. `npm run dev` would work but leaves a competing `package-lock.json`.

With no `.env.local`, the site runs on built-in fixtures: 13 real shows and 3
real releases reconstructed from the band's posters, so every page has content
to render. Merch is empty, because there is nothing to fake a real store with —
`/merch` shows its genuine empty state.

The Studio is at **/studio**. Until Sanity is connected it shows a setup notice
rather than a broken editor.

## Scripts

| | |
|---|---|
| `pnpm dev` | Dev server on :3000 |
| `pnpm build` | Production build — must pass before every deploy |
| `pnpm start` | Serve a production build |
| `pnpm typecheck` | Route typegen, then `tsc --noEmit` |
| `pnpm lint` | ESLint |
| `pnpm detect` | Design detector — scans for contrast, rhythm and overflow defects |
| `pnpm seed` | One-off: writes the fixture shows and releases into Sanity |

CI runs typecheck, lint, build and detect on every push and pull request, with
no secrets set — which is a real test, since the site is built to render empty
states when Sanity and Shopify are unconfigured.

## Connecting the real services

Copy `.env.example` to `.env.local` and fill in what you have; each variable is
documented there, including which are server-only. Nothing is required to run
the site locally.

Only `NEXT_PUBLIC_*` reaches the browser. The Storefront token, Sanity write
token and Resend key are server-side and must stay that way.

## Where things live

| | |
|---|---|
| `PRODUCT.md` | What this product is, who it's for, and what must never be fabricated |
| `DESIGN.md` | The visual system — every colour traced to a measured source |
| `.impeccable/design.json` | Machine-readable sidecar to DESIGN.md |
| `src/styles/tokens.css` | The tokens themselves. A brand change is a one-file change |
| `docs/BAND-GUIDE.md` | For the band: adding shows, releases, merch, running POS at a gig |
| `sanity/schemas/` | Content model, written for one non-technical editor |
| `assets/fonts/` | Build-time fonts for OG cards only — not served to browsers |

`PRODUCT.md` and `DESIGN.md` have to sit at the repo root: the design tooling
reads them from there and the path isn't configurable. `AGENTS.md` is rewritten
at the root by `next dev`, so it stays too.

## Before launch

Tracked in `docs/BAND-GUIDE.md` and `heavyskint-website-plan.md` (local only),
but the blocking ones:

- Fill in `src/lib/legal.ts` — the returns and privacy pages announce that
  they're incomplete until you do, and a UK trader selling at a distance
  legally needs those details.
- Change the `from` address in `src/app/api/contact/route.ts` off Resend's
  sandbox, or contact-form delivery fails in production.
- Set `NEXT_PUBLIC_SITE_URL`, or the sitemap, OG images and canonical URLs all
  say `localhost:3000`.
- Replace `public/press/` with full-resolution originals and confirm the
  photographers' permission.
