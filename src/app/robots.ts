import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

/**
 * robots.txt.
 *
 * Cached at build time: nothing here reads a request-time API.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        // The Studio. Already noindex via its own metadata, but there is no
        // reason to spend crawl budget on an editor login either way.
        "/studio",
        // Route handlers. /api/contact only answers POST, and the revalidate
        // endpoints are webhook targets.
        "/api/",
      ],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
