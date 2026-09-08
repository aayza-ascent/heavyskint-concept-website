import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og/card";

/* About. */
export const alt = "About heavyskint. A five-piece from Glasgow.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({ label: "About", title: "a five-piece from glasgow." });
}
