import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og/card";

/* Site default. Inherited by any route without its own card, so it carries the band's strongest true claim rather than a generic name-and-tagline. */
export const alt = "heavyskint. Sold out every show in Scotland.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({ label: "Glasgow", title: "sold out every show in scotland." });
}
