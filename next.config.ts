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
    ],
  },
};

export default nextConfig;
