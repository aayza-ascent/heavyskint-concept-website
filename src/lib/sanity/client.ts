import { createClient, type SanityClient } from "next-sanity";
import { env } from "@/lib/env";

let client: SanityClient | undefined;

/**
 * Lazily-constructed Sanity client.
 *
 * Constructed on first use rather than at module load, so a missing env var
 * surfaces as a caught read error (and a graceful empty state) instead of
 * crashing the build while collecting page data.
 */
export function getSanityClient(): SanityClient {
  if (!client) {
    client = createClient({
      projectId: env.sanity.projectId,
      dataset: env.sanity.dataset,
      apiVersion: env.sanity.apiVersion,
      // We cache via `use cache` + cacheTag, invalidated by webhook. Sanity's
      // CDN would add a second layer of staleness we cannot invalidate.
      useCdn: false,
    });
  }
  return client;
}
