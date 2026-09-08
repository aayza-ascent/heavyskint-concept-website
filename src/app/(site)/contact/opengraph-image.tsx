import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og/card";

/* Contact. Addressed to the promoter who is the actual audience for this page. */
export const alt = "Book heavyskint. Booking and press enquiries.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({ label: "Booking", title: "get us on your bill." });
}
