import { revalidateTag } from "next/cache";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { env } from "@/lib/env";
import { SANITY_TAGS_BY_TYPE } from "@/lib/cache-tags";

/**
 * Sanity publish webhook -> targeted cache invalidation.
 *
 * Configure in sanity.io/manage -> API -> Webhooks:
 *   URL:     https://heavyskint.com/api/revalidate/sanity
 *   Dataset: production
 *   Trigger: Create, Update, Delete
 *   Secret:  same value as SANITY_REVALIDATE_SECRET
 *   Payload: { "_type": _type, "_id": _id }
 *
 * The signature check is not optional: without it anyone who learns this URL
 * can force cache churn on every request.
 */
export async function POST(request: Request): Promise<Response> {
  const signature = request.headers.get(SIGNATURE_HEADER_NAME);
  if (!signature) {
    return Response.json({ message: "Missing signature" }, { status: 401 });
  }

  // Must be the raw body text — re-encoding JSON can change byte order and
  // produce a false signature mismatch.
  const body = await request.text();

  const valid = await isValidSignature(
    body,
    signature,
    env.sanity.webhookSecret,
  );
  if (!valid) {
    return Response.json({ message: "Invalid signature" }, { status: 401 });
  }

  let payload: { _type?: string; _id?: string };
  try {
    payload = JSON.parse(body);
  } catch {
    return Response.json({ message: "Malformed JSON" }, { status: 400 });
  }

  const documentType = payload._type;
  if (!documentType) {
    return Response.json({ message: "Missing _type" }, { status: 400 });
  }

  // Unknown types are accepted but no-op, so adding a schema without updating
  // this map degrades to "not instantly live", never to a 500 in Sanity's UI.
  const tags = SANITY_TAGS_BY_TYPE[documentType] ?? [];
  for (const tag of tags) {
    // 'max' = serve stale while revalidating in the background. Correct for
    // editorial content, where a few seconds of staleness is invisible.
    revalidateTag(tag, "max");
  }

  return Response.json({
    revalidated: tags.length > 0,
    documentType,
    tags,
    now: Date.now(),
  });
}
