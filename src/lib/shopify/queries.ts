import { cacheTag } from "next/cache";
import { storefront } from "./client";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { env } from "@/lib/env";
import type { Product } from "./types";

const PRODUCT_FRAGMENT = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    availableForSale
    featuredImage {
      url
      altText
      width
      height
    }
    images(first: 10) {
      nodes {
        url
        altText
        width
        height
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 100) {
      nodes {
        id
        title
        availableForSale
        quantityAvailable
        price {
          amount
          currencyCode
        }
        selectedOptions {
          name
          value
        }
      }
    }
  }
`;

type RawProduct = Omit<Product, "images" | "variants"> & {
  images: { nodes: Product["images"] };
  variants: { nodes: Product["variants"] };
};

function normalise(raw: RawProduct): Product {
  return {
    ...raw,
    images: raw.images.nodes,
    variants: raw.variants.nodes,
  };
}

/** All products for the merch grid. */
export async function getProducts(): Promise<Product[]> {
  "use cache";
  cacheTag(CACHE_TAGS.products);
  if (!env.shopify.isConfigured) return [];

  const data = await storefront<{ products: { nodes: RawProduct[] } }>(
    /* GraphQL */ `
      ${PRODUCT_FRAGMENT}
      query Products {
        products(first: 100, sortKey: BEST_SELLING) {
          nodes {
            ...ProductFields
          }
        }
      }
    `,
  );

  return data.products.nodes.map(normalise);
}

/** A single product by handle, for the PDP. */
export async function getProduct(handle: string): Promise<Product | null> {
  "use cache";
  // Tagged both individually and collectively, so a single product webhook
  // busts just this page while a bulk change can bust everything.
  cacheTag(CACHE_TAGS.products, CACHE_TAGS.product(handle));
  if (!env.shopify.isConfigured) return null;

  const data = await storefront<{ product: RawProduct | null }>(
    /* GraphQL */ `
      ${PRODUCT_FRAGMENT}
      query Product($handle: String!) {
        product(handle: $handle) {
          ...ProductFields
        }
      }
    `,
    { handle },
  );

  return data.product ? normalise(data.product) : null;
}
