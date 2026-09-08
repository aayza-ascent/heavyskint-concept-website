import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og/card";

/* Shows. A shared date link is usually someone selling the gig to a friend, so the card argues rather than lists. */
export const alt = "heavyskint live dates. The live record.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({ label: "Shows", title: "the live record." });
}
