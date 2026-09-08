import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og/card";

/* Merch index. Individual products set their own OG image from the Shopify product photo in generateMetadata, which beats a generated card. */
export const alt = "heavyskint merch. Shipped from Scotland.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({ label: "Merch", title: "shipped from scotland." });
}
