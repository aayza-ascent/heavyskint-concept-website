/**
 * The site's own public identity.
 *
 * Safe in a Client Component — unlike `env`, everything here is already public
 * by definition. Kept separate for exactly that reason.
 */

/**
 * Canonical origin, no trailing slash.
 *
 * Falls back to localhost so `pnpm build` and `pnpm dev` work before the domain
 * exists. Set NEXT_PUBLIC_SITE_URL in Vercel the moment it does: canonical URLs,
 * OG image URLs, the sitemap and robots.txt are all built from this, and a
 * production build carrying localhost is silently wrong rather than broken.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

/** Absolute URL for a site-root-relative path. */
export function absoluteUrl(path: string): string {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Whether the online shop is open.
 *
 * Off for launch: the band isn't selling merch online yet, only at shows. While
 * this is false the Merch nav item, the home merch grid, product pages and the
 * returns link are all switched off, and /merch says so plainly. Every merch
 * code path is left in place behind this one flag — set it to `true` once the
 * Shopify store is live and stocked, and the shop comes back unchanged.
 */
export const MERCH_ONLINE = false;

/**
 * Where to listen, artist-level.
 *
 * Verified against each platform on 5 Oct 2026: both profiles list exactly the
 * three singles in `fixtures.ts`. Per-release links live on each release.
 */
export const STREAMING = [
  {
    platform: "Spotify",
    url: "https://open.spotify.com/artist/70RKsp6wffaFI7Qfzct3cT",
  },
  {
    platform: "Apple Music",
    url: "https://music.apple.com/gb/artist/heavyskint/1779969828",
  },
] as const;
