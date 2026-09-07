import crypto from "node:crypto";
import { revalidateTag } from "next/cache";
import { env } from "@/lib/env";
import { CACHE_TAGS } from "@/lib/cache-tags";

/**
 * Shopify webhook -> targeted cache invalidation.
 *
 * Configure in Shopify admin -> Settings -> Notifications -> Webhooks:
 *   URL:    https://heavyskint.com/api/revalidate/shopify
 *   Events: products/create, products/update, products/delete,
 *           inventory_levels/update
 *   Format: JSON
 *
 * Note on inventory: this cache is a performance layer, not the oversell
 * guard. Shopify re-checks stock at checkout and rejects an order that can no
 * longer be fulfilled, which is what actually protects the band when a gig
 * sale and a web sale race each other.
 */

/** Timing-safe compare that tolerates unequal lengths without throwing. */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function POST(request: Request): Promise<Response> {
  const hmacHeader = request.headers.get("x-shopify-hmac-sha256");
  if (!hmacHeader) {
    return Response.json({ message: "Missing HMAC header" }, { status: 401 });
  }

  const rawBody = await request.text();

  const computed = crypto
    .createHmac("sha256", env.shopify.webhookSecret)
    .update(rawBody, "utf8")
    .digest("base64");

  if (!safeEqual(computed, hmacHeader)) {
    return Response.json({ message: "Invalid signature" }, { status: 401 });
  }

  const topic = request.headers.get("x-shopify-topic") ?? "unknown";

  const tags = new Set<string>([CACHE_TAGS.products]);

  // Product events carry a handle, so we can additionally bust that one PDP.
  if (topic.startsWith("products/")) {
    try {
      const payload = JSON.parse(rawBody) as { handle?: string };
      if (payload.handle) tags.add(CACHE_TAGS.product(payload.handle));
    } catch {
      // Body already passed HMAC, so this is a shape change, not an attack.
      // Falling back to the collection tag is still correct.
    }
  }

  for (const tag of tags) {
    revalidateTag(tag, "max");
  }

  return Response.json({
    revalidated: true,
    topic,
    tags: [...tags],
    now: Date.now(),
  });
}
