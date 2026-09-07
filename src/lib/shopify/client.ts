import { env } from "@/lib/env";

type GraphQLResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

/**
 * Minimal Shopify Storefront API client.
 *
 * Deliberately not cached here — callers decide. Product reads wrap this in a
 * `use cache` function with a cacheTag; cart mutations must never be cached.
 */
export async function storefront<T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  const endpoint = `https://${env.shopify.storeDomain}/api/${env.shopify.apiVersion}/graphql.json`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": env.shopify.storefrontToken,
    },
    body: JSON.stringify({ query, variables }),
    // Opt out of Next's fetch cache; caching is handled by the caller.
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Shopify Storefront API error: ${response.status} ${response.statusText}`,
    );
  }

  const json = (await response.json()) as GraphQLResponse<T>;

  if (json.errors?.length) {
    throw new Error(
      `Shopify GraphQL error: ${json.errors.map((e) => e.message).join("; ")}`,
    );
  }

  if (!json.data) {
    throw new Error("Shopify Storefront API returned no data");
  }

  return json.data;
}
