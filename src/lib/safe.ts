/**
 * Run a data read, falling back rather than throwing.
 *
 * Two reasons this exists:
 *  1. Before the band's Sanity/Shopify accounts are connected, the site should
 *     still build and render empty states rather than fail.
 *  2. In production, a brief upstream outage should degrade one section, not
 *     take down the page. An empty shows list beats a 500.
 *
 * Errors are logged so outages stay visible in Vercel logs instead of silently
 * looking like "the band hasn't added anything yet".
 */
export async function safe<T>(
  label: string,
  read: () => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    return await read();
  } catch (error) {
    console.error(`[data] ${label} failed:`, error);
    return fallback;
  }
}
