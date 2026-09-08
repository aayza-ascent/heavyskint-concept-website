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
