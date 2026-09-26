# Deploying the theme to a real store

What has to exist in Shopify before `theme/` will render. Roughly an hour.

---

## 1. Metaobject definitions

**Settings → Custom data → Metaobjects.** These replace Sanity's schemas, and
the field keys below must match exactly — the templates read them by key.

### `show`

| Field name | Key | Type | Notes |
|---|---|---|---|
| Date and time | `date` | Date and time | Door time, not stage time |
| Venue | `venue` | Single line text | As people say it — *King Tut's Wah Wah Hut*, not *Tuts* |
| City | `city` | Single line text | |
| Country | `country` | Single line text | |
| Ticket link | `ticket_url` | URL | Leave empty and the site shows "On sale soon" |
| Sold out | `sold_out` | True or false | |
| Cancelled | `cancelled` | True or false | Switch this on rather than deleting |
| Support acts | `support_acts` | Single line text, **list** | One per line, shown as `+ Name` |
| Promoter or festival | `presented_by` | Single line text | Only if named on the poster |

> **Turn on "Storefronts" access** for the definition, or Liquid cannot read it.

> ⚠ **Order entries by date in the admin.** Liquid cannot sort metaobject
> entries by a field value, so the list renders in admin order. This is the one
> place the theme is genuinely worse than the Sanity build, which sorts in GROQ.
> A show added out of order needs dragging into place.

### `release`

| Field name | Key | Type |
|---|---|---|
| Title | `title` | Single line text |
| Type | `type` | Single line text (Single / EP / Album) |
| Release date | `release_date` | Date |
| Cover artwork | `cover` | File (image) |
| Describe the artwork | `cover_alt` | Single line text |
| Where to listen | `links` | Metaobject reference, **list** → `streaming_link` |

Keep entries **newest first** — the music section gives `releases[0]` the large
frame.

### `streaming_link`

| Field name | Key | Type |
|---|---|---|
| Platform | `platform` | Single line text |
| URL | `url` | URL |

Shopify metaobjects have no nested objects, so a release's links are a list of
references to these. Slightly more clicking than Sanity's inline array — worth
knowing before the band meets it.

---

## 2. Push the theme

```bash
npm install -g @shopify/cli
cd shopify-concept/theme
shopify theme push --store heavyskint.myshopify.com
```

Use `shopify theme dev` to work against the store with live reload.

---

## 3. Pages and templates

**Content → Pages.** Create each, then set its template in **Theme template**:

| Page | Handle | Template |
|---|---|---|
| Shows | `shows` | `page.shows` |
| Music | `music` | `page.music` |
| About | `about` | `page.about` |
| Contact | `contact` | `page.contact` |

About is the only one whose body text is edited in the page itself; the others
render from metaobjects and ignore their content field.

---

## 4. Collection and navigation

- **Products → Collections → Create.** Title *Merch*, handle `merch`. Manual, or
  automated on a `merch` tag.
- **Content → Menus → Main menu.** Shows, Music, Merch, About, Contact. The
  header reads this, so the band can reorder it without a developer.

---

## 5. Theme settings

**Online Store → Themes → Customise.**

- **Footer** — booking email, Spotify, Bandcamp, Instagram. Nothing renders
  until filled in: a wrong Spotify link is worse than none.
- **Hero** — headline, intro, background photograph.
- **The live record** — press quotes, and the awards line.

> ⚠ The awards line defaults to *"Nominated at the Scottish Live Music Awards."*
> The source caption says nominated; the Next.js build currently says
> *recognised*. Confirm which is true before publishing either.

---

## 6. Policies

**Settings → Policies.** Shopify hosts these at `/policies/...`, which the footer
links to. Refund and privacy policies are legally required before selling — the
trader identity and geographic address still have to come from the band. See
`docs/PROJECT-STATUS.md` at the repo root.

---

## 7. Content

Shows and releases have to be entered. Thirteen shows and three releases are in
`preview/data.mjs`, mirroring the Next.js fixtures.

There is no seed script here — the Shopify Admin API would need a custom app and
an access token, which is more setup than typing 13 entries. If the band picks
this version and wants it automated, it is a couple of hours with the Admin API.

**Five of the 13 dates are unverified** and need confirming with the band first.
