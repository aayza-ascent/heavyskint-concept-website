import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og/card";

/* Music. Deliberately not naming a single release: this card is cached at build time and would go stale the day the next one lands. */
export const alt = "heavyskint releases. Every release.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({ label: "Music", title: "every release." });
}
