/**
 * Centralised cache tags.
 *
 * Every cached read tags itself with one of these, and the webhook route
 * handlers invalidate by the same constant. Keeping them in one file is what
 * stops a typo in a webhook from silently never invalidating anything.
 */
export const CACHE_TAGS = {
  shows: "shows",
  releases: "releases",
  gallery: "gallery",
  siteSettings: "site-settings",
  products: "products",
  product: (handle: string) => `product:${handle}`,
} as const;

/** Tags invalidated when *any* Sanity document is published. */
export const SANITY_TAGS_BY_TYPE: Record<string, readonly string[]> = {
  show: [CACHE_TAGS.shows],
  release: [CACHE_TAGS.releases],
  galleryImage: [CACHE_TAGS.gallery],
  siteSettings: [CACHE_TAGS.siteSettings],
  productMeta: [CACHE_TAGS.products],
};
