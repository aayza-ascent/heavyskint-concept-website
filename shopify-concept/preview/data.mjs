/**
 * Preview data, shaped like Shopify's Liquid objects.
 *
 * Shows and releases mirror src/lib/fixtures.ts in the Next.js build exactly,
 * so the two versions can be compared on identical content.
 *
 * ⚠ PRODUCTS ARE NOT REAL STOCK. There is no store yet, so three products exist
 * purely so the merch grid and product page can be seen. The tee uses the
 * band's real shirt photography; the other two use release artwork as stand-in
 * images. No pricing or stock level here is real.
 */

/** Wrap a plain value as a Shopify metaobject field: `{{ entry.field.value }}`. */
const f = (value) => ({ value });

const show = (date, venue, city, country, opts = {}) => ({
  date: f(date),
  venue: f(venue),
  city: f(city),
  country: f(country),
  sold_out: f(opts.soldOut ?? false),
  cancelled: f(opts.cancelled ?? false),
  ticket_url: f(opts.ticketUrl ?? ""),
  support_acts: f(opts.supportActs ?? []),
  presented_by: f(opts.presentedBy ?? ""),
});

/** Ordered oldest → newest, matching how the band would order them in admin. */
export const SHOWS = [
  show("2025-08-29", "King Tut's Wah Wah Hut", "Glasgow", "Scotland", { soldOut: true }),
  show("2025-09-18", "Queen Margaret Union", "Glasgow", "Scotland"),
  show("2025-10-29", "SWG3", "Glasgow", "Scotland"),
  show("2025-11-21", "McChuills", "Glasgow", "Scotland", {
    soldOut: true, supportActs: ["The Violets", "Braes"], presentedBy: "SMC",
  }),
  show("2026-01-10", "King Tut's Wah Wah Hut", "Glasgow", "Scotland", {
    soldOut: true, supportActs: ["Allsorts", "Dirty Mike", "Eyes Of Home"],
  }),
  show("2026-02-14", "1990", "Glasgow", "Scotland", {
    soldOut: true, supportActs: ["Tuesday Club", "Whissker", "Alesia"], presentedBy: "Slay Sessions",
  }),
  show("2026-04-04", "Nice N Sleazy", "Glasgow", "Scotland", { presentedBy: "Houseguest Fest" }),
  show("2026-05-06", "Sneaky Pete's", "Edinburgh", "Scotland", {
    soldOut: true, supportActs: ["Oedipus And The Mama's Boys"], presentedBy: "DF Concerts",
  }),
  show("2026-07-31", "Elephant's Head, Camden", "London", "England", { presentedBy: "SMC + Product 85" }),
  show("2026-08-01", "Humber Street Sesh", "Hull", "England"),
  show("2026-09-05", "The Art School", "Glasgow", "Scotland", { presentedBy: "No A Mean City V" }),
  show("2026-10-10", "Tenement Trail", "Glasgow", "Scotland"),
  show("2026-11-14", "Jacaranda", "Liverpool", "England"),
];

const release = (title, type, date, cover, alt) => ({
  title: f(title),
  type: f(type),
  release_date: f(date),
  cover: f(cover),
  cover_alt: f(alt),
  links: f([]),
});

/** Newest first — the order the band would keep them in admin. */
export const RELEASES = [
  release("he says, she says", "Single", "2026-05-28", "press-artwork-hesays.webp", "Artwork for the single 'he says, she says'"),
  release("when are you coming for me jesus?", "Single", "2026-02-06", "press-artwork-jesus.webp", "Artwork for the single 'when are you coming for me jesus?'"),
  release("vice", "Single", "2025-10-24", "press-artwork-vice.webp", "Artwork for the single 'vice'"),
];

const variant = (id, title, price, available) => ({
  id, title, price, available,
});

const product = (handle, title, price, image, description, variants) => ({
  id: handle,
  handle,
  title,
  url: `/products/${handle}`,
  price,
  description,
  available: variants.some((v) => v.available),
  featured_image: image
    ? { src: image.src, alt: `${title}`, width: image.w, height: image.h }
    : null,
  variants,
});

/** ⚠ Placeholder. No real store, no real stock, no real prices. */
export const PRODUCTS = [
  // The only product with real photography — the band's actual shirt.
  product("tour-tee", "tour tee", 2500, { src: "merch-tee.png", w: 1498, h: 1494 },
    "<p>Black heavyweight cotton. Wordmark and the lying-down line drawing, front print.</p>", [
      variant("v-s", "S", 2500, true),
      variant("v-m", "M", 2500, true),
      variant("v-l", "L", 2500, false),
      variant("v-xl", "XL", 2500, true),
    ]),
  // No photography yet — the empty frame is what the band will actually see in
  // the grid before they upload a product shot.
  product("vice-longsleeve", "vice longsleeve", 3200, null,
    "<p>Long sleeve with sleeve print. Placeholder copy for the preview.</p>", [
      variant("v2-m", "M", 3200, true),
      variant("v2-l", "L", 3200, true),
    ]),
  product("tote", "tote bag", 1200, null,
    "<p>Screen-printed cotton tote. Placeholder copy for the preview.</p>", [
      variant("v3-os", "One size", 1200, false),
    ]),
];

export const COLLECTION = {
  title: "Merch",
  url: "/collections/merch",
  products: PRODUCTS,
};

export const MENU = [
  { title: "Shows", url: "/pages/shows" },
  { title: "Music", url: "/pages/music" },
  { title: "Merch", url: "/collections/merch" },
  { title: "About", url: "/pages/about" },
  { title: "Contact", url: "/pages/contact" },
];

export const ABOUT_CONTENT = `
<p>heavyskint are a five-piece from Glasgow: 90s shoegaze, grunge and alt-rock
with a soulful tinge and an unfiltered intensity.</p>
<p>Since emerging in early 2025 they have sold out rooms across Scotland, from
King Tut's to Sneaky Pete's, and were nominated at the Scottish Live Music
Awards.</p>
<p><em>Placeholder bio for the preview — the band edits this in Shopify admin
under Content → Pages.</em></p>
`;
