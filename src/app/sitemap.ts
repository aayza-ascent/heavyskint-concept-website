import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/shopify/queries";
import { safe } from "@/lib/safe";
import { absoluteUrl } from "@/lib/site";

/**
 * sitemap.xml.
 *
 * `lastModified` is deliberately omitted throughout.
 *
 * The honest value would be each document's `_updatedAt`, which these queries
 * do not select, and the tempting substitutes are all wrong: `new Date()` is an
 * unstable value under Cache Components and would make every page look edited
 * on every build, and a show's own date is when the gig happens, not when the
 * page changed. Google discounts `lastmod` it finds unreliable, so a fabricated
 * one is worse than none. Add it properly by selecting `_updatedAt` in the
 * GROQ projections if crawl freshness ever becomes a real problem.
 *
 * Priorities are relative to each other and nothing else. Shows outranks the
 * home page because it is the page the band actually needs found — a promoter
 * or a fan searching for a date, not for a landing page.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/shows"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/music"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/merch"), changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/about"), changeFrequency: "yearly", priority: 0.5 },
    { url: absoluteUrl("/contact"), changeFrequency: "yearly", priority: 0.5 },
    // Low priority, but indexed: a customer searching "heavyskint returns"
    // should land on the policy rather than on a contact form.
    { url: absoluteUrl("/returns"), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/privacy"), changeFrequency: "yearly", priority: 0.3 },
  ];

  // Empty until Shopify is connected, which is the correct output rather than a
  // failure — `safe` keeps an unreachable store from failing the whole build.
  const products = await safe("sitemap:products", getProducts, []);

  return [
    ...staticRoutes,
    ...products.map((product) => ({
      url: absoluteUrl(`/merch/${product.handle}`),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
