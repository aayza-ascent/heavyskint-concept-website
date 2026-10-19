import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next 16 unified caching: enables `use cache` + cacheTag + PPR by default.
  // This is what lets the band publish a show and see it live without a deploy.
  cacheComponents: true,

  images: {
    remotePatterns: [
      // Sanity image CDN — editorial images (press shots, gallery, artwork)
      { protocol: "https", hostname: "cdn.sanity.io" },
      // Shopify CDN — product imagery. Never proxy these through our origin.
      { protocol: "https", hostname: "cdn.shopify.com" },
      // Apple Music artwork — release covers, from the iTunes lookup API.
      { protocol: "https", hostname: "*.mzstatic.com" },
      // Smart link artwork — covers for upcoming releases, from their presave
      // pages on vm.group (Linkfire) and ffm.to (Feature.fm).
      { protocol: "https", hostname: "linkstorage.linkfire.com" },
      { protocol: "https", hostname: "i.ffmcdn.com" },
    ],
  },
};

export default nextConfig;
