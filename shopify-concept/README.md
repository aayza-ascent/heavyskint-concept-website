# heavyskint — the Shopify-only version

The same site, built entirely inside Shopify. No Vercel, no Sanity, no Next.js.

This exists so the band can look at both versions and decide. For the honest
side-by-side, read **[docs/COMPARISON.md](docs/COMPARISON.md)**.

## See it running

```bash
pnpm install --ignore-workspace
pnpm preview
```

Then open **http://localhost:4321**.

Or, from the repo root, start it the same way as the Next.js app:

```bash
pnpm --dir shopify-concept run preview
```

## What's in here

| | |
|---|---|
| `theme/` | A real, uploadable Shopify theme. This is the deliverable |
| `preview/` | A local harness that renders the theme without a Shopify store |
| `out/` | Generated preview HTML (gitignored) |
| `docs/COMPARISON.md` | The two versions, honestly compared |
| `docs/SHOPIFY-SETUP.md` | Metaobject definitions and store setup to deploy this |

## What is real and what is not

**Real:** the theme. Every `.liquid` file, the CSS, the section schemas and the
content model are production shapes. Uploading `theme/` to a Shopify store and
creating the metaobject definitions gives you this site.

**Real:** the shows and releases. They mirror `src/lib/fixtures.ts` in the
Next.js build exactly — the same 13 shows and 3 releases, so the two versions
can be compared on identical content. Five of those dates are still unverified;
see `docs/PROJECT-STATUS.md` at the repo root.

**Not real:** the three products. There is no store yet, so `preview/data.mjs`
invents a tee, a longsleeve and a tote purely so the merch grid and product page
can be seen. They use release artwork as stand-in photography. No real stock, no
real prices.

**Not real:** the preview harness. `preview/render.mjs` emulates only the parts
of Shopify Liquid this theme actually uses — `{% section %}`, `{% form %}`,
`{% schema %}`, `asset_url`, `image_url`, `money`. It is scaffolding for looking
at the theme before an account exists, not a Shopify emulator. The theme is what
ships; this file does not.

## Deploying it for real

See `docs/SHOPIFY-SETUP.md`. In short:

1. Create the store, create the `show` and `release` metaobject definitions
2. `shopify theme push` from `theme/`
3. Create the pages (Shows, Music, About, Contact) and assign the templates
4. Build the `merch` collection and the Navigation menu
5. Enter the shows — or import them from the fixtures

## The design system is shared

`theme/assets/theme.css` is a hand port of `src/styles/tokens.css` from the
Next.js build. Same measured colours, same type scale, same spacing, same
dither. That is deliberate: the two versions should differ in **architecture**,
not in how they look, so the choice is made on the right grounds.

If the design changes, it now has to change in two places. That is a real cost
of keeping both alive, and a reason not to keep both alive for long.
