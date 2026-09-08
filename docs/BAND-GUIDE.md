# Running the site

Everything on the site that changes — dates, music, photos, merch — you change
yourself. Nothing here needs a developer, and nothing here can break the site.

You never need to "publish the website". You publish a *thing* (a show, a
release), and the site picks it up within seconds.

---

## Two places, and which is which

| You want to change | Go to |
|---|---|
| A gig date, a release, photos, the bio, your links | **the Studio** — `/studio` on the site |
| A t-shirt, a price, stock levels, an order | **Shopify admin** — `admin.shopify.com` |

If you are ever unsure: **the Studio is words and dates. Shopify is anything
with a price.**

---

## Adding a show

1. Go to `/studio` and sign in.
2. **Shows → Upcoming → the pencil/plus icon** to create one.
3. Fill in:
   - **Date and time** — the door time, not the stage time. Use the real time;
     the site works out the format.
   - **Venue** — as people would say it. *King Tut's Wah Wah Hut*, not *Tuts*.
   - **City** and **Country**.
   - **Ticket link** — the page that actually sells the ticket. Leave it empty
     if tickets aren't on sale yet, and the site just won't show a button.
   - **Support acts** — one per line. They appear as `+ Band name`.
   - **Promoter or festival** — only if one is named on the poster.
4. Hit **Publish**.

Refresh the site and it's on `/shows`. If it's your next date, it's on the home
page too.

### When a show sells out

Open the show, switch **Sold out** on, **Publish**. The ticket button is
replaced with a sold-out stamp, and the show is counted in the sold-out total on
the home page.

Don't delete a sold-out show after it happens. The past dates are the band's
argument — a promoter looking at `/shows` is reading a year of sold-out rooms,
and each one you delete makes that case weaker.

### When a show is cancelled

Switch **Cancelled** on rather than deleting it. People who already have tickets
will come looking for exactly that page, and a date that silently vanishes looks
like a mistake.

### Fixing a wrong date

Some dates were reconstructed from old posters and are marked **`[CHECK DATE]`**
in the venue field. If you see that, the date is a guess. Fix the date, delete
the `[CHECK DATE]` text from the venue, and publish.

---

## Adding a release

1. **Studio → Music → create.**
2. **Title** — exactly as it's released, lowercase if that's how it's styled.
3. **Type** — Single, EP or Album.
4. **Release date** — the day it comes out. A future date is fine; put it in
   ahead of time.
5. **Cover artwork** — the square artwork. Upload the biggest version you have;
   the site makes its own smaller copies.
6. **Describe the artwork** — one plain sentence for people using a screen
   reader, and for Google.
7. **Where to listen** — one row per platform. Type the platform name
   (*Spotify*, *Bandcamp*) and paste the link. They appear in the order you put
   them in, so lead with wherever you'd rather people went.
8. **Publish.**

New releases go to the top of `/music` automatically, and into the site's
releases feed.

---

## Photos

**Studio → Photos.** Upload the photo, then fill in **Describe the photo** and
**Photographer**.

Both matter. The description is what someone using a screen reader hears, and
the credit is the photographer's name on their own work — the site leans on
their pictures completely, so it credits them.

---

## Your bio and links

**Studio → Site settings.** One page, always there — you edit it, you don't
create a new one.

- **Biography** — the site uses this everywhere. Edit it here once.
- **Booking email** — shown in the footer.
- **Press kit link** — a Dropbox or Drive link is fine.
- **Social and streaming links** — one row each. Until you add these, the site
  shows no social links at all, on purpose: a wrong Spotify link is worse than
  none.

---

## Merch

All of this is in **Shopify admin**, not the Studio.

### Adding a product

1. **Products → Add product.**
2. Title, description, photos.
3. **Variants** — add sizes (S, M, L, XL). Each size has its own stock count.
4. **Inventory** — switch on **Track quantity** and enter how many you have of
   each size. This is the bit that makes the site honest.
5. **Pricing** — in GBP.
6. Set it to **Active** and save.

It appears on `/merch` within a minute or so.

### Restocking

**Products → the product → Inventory**, and update the number for each size.
That's it. A size that was showing as sold out becomes buyable again on its own.

### Fulfilling an order

1. **Orders** → click the order.
2. Pack it.
3. **Fulfil item**, enter the tracking number if you have one, and confirm.
4. The customer is emailed automatically.

### Selling at a gig

Use **Shopify POS Lite** on your phone.

Take payment through the app rather than by cash or bank transfer. It's the same
stock as the website, so a shirt sold off the table at Tut's drops the website's
count immediately — which is the entire reason the shop is set up this way. Sell
one outside the app and the website will keep offering something you no longer
have.

---

## Things worth knowing

**Changes appear in seconds, not instantly.** If something hasn't shown up after
a minute, hard-refresh the page.

**Empty is a real state, not a bug.** No upcoming dates shows "nothing announced
right now". No products shows "the store isn't open yet". The site is written to
say so plainly rather than look broken.

**Never delete the past.** Old shows and older releases are the record.

**Nobody needs to touch `/studio` but you.** It's kept out of Google entirely.

---

## When something is actually wrong

Check in this order:

1. Is the thing **published** in the Studio, or still a draft? Drafts don't
   appear on the site.
2. If it's merch: is the product **Active**, and does it have **stock**?
3. Hard-refresh.

If it's still wrong after that, it's a developer problem, not yours. Send:

- the page it's on
- what you expected
- what you saw
- a screenshot

---

## Not yet set up

These are outstanding and need a person, not a fix:

- Real dates for the shows marked **`[CHECK DATE]`**.
- Photographer permission for the pictures already on the site, and their
  full-resolution originals.
- Your streaming links (nothing points at Spotify or Bandcamp yet).
- Returns and privacy pages are written but incomplete — they need the trading
  name, address and contact email before the shop can legally open.
