import { readReleases } from "@/lib/content";
import { safe } from "@/lib/safe";
import { absoluteUrl, siteUrl } from "@/lib/site";

/**
 * RSS feed of releases.
 *
 * Served at /releases.xml. Named for what it carries rather than /feed.xml,
 * because it is not a blog and never will be — the band publishes music, not
 * posts, and a reader subscribing here wants to know the day a track lands.
 *
 * A Route Handler rather than a Metadata file convention, since Next has no
 * built-in RSS convention. It reads only cached content and no request-time
 * API, so it prerenders at build and is revalidated by the Sanity webhook
 * through the same `releases` cache tag as the /music page.
 */

const TYPE_LABEL = { single: "Single", ep: "EP", album: "Album" } as const;

/** XML text escaping. Release titles are editor-authored, so this is required. */
function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET() {
  const releases = await safe("rss:releases", readReleases, []);

  const items = releases
    .map((release) => {
      const label = TYPE_LABEL[release.type];
      /*
       * A release has no page of its own, so every item points at /music. The
       * guid is the Sanity document id and is marked not-a-permalink, which is
       * what keeps a reader from treating six items sharing one link as one
       * item.
       */
      const links = (release.links ?? [])
        .map((link) => `${link.platform}: ${link.url}`)
        .join("\n");

      return `    <item>
      <title>${escapeXml(release.title)}</title>
      <link>${absoluteUrl("/music")}</link>
      <guid isPermaLink="false">${escapeXml(release._id)}</guid>
      <pubDate>${new Date(release.releaseDate).toUTCString()}</pubDate>
      <category>${label}</category>
      <description>${escapeXml(
        links ? `${label} by heavyskint.\n\n${links}` : `${label} by heavyskint.`,
      )}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>heavyskint. — releases</title>
    <link>${siteUrl}</link>
    <description>New music from heavyskint, a five-piece from Glasgow.</description>
    <language>en-gb</language>
    <atom:link href="${absoluteUrl("/releases.xml")}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
