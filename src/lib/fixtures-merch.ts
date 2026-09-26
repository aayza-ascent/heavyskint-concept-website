import { IMAGES } from "@/lib/images";
import type { Product, ProductVariant } from "@/lib/shopify/types";

/**
 * Development-only merch fixtures.
 *
 * Kept apart from `fixtures.ts` on purpose. That file is reconstructed archive —
 * shows and releases the band actually played and released. This one is not:
 *
 *   ⚠ NOTHING HERE IS REAL COMMERCE. Prices, sizes and stock levels are
 *   invented so the merch grid, the sold-out state and the product page can be
 *   designed and reviewed against something. Only the tee's photography is
 *   real. The moment Shopify is connected these are never read again — see
 *   `useMerchFixtures` in content.ts, which requires development AND an
 *   unconfigured store.
 *
 * They exist for two reasons:
 *   1. An empty grid hides every layout problem real products cause — a title
 *      that wraps to two lines, a sold-out stamp over a pale image, a price
 *      column that has to stay aligned.
 *   2. The Shopify-only concept in `shopify-concept/` shows the same three
 *      products. Comparing a populated store against an empty one would make
 *      that decision on the wrong grounds.
 */

const GBP = (pounds: number) => ({
  amount: pounds.toFixed(2),
  currencyCode: "GBP",
});

const variant = (
  id: string,
  title: string,
  pounds: number,
  available: boolean,
  quantity: number | null = null,
): ProductVariant => ({
  id,
  title,
  availableForSale: available,
  quantityAvailable: quantity,
  price: GBP(pounds),
  selectedOptions: [{ name: "Size", value: title }],
});

export const MERCH: Product[] = [
  {
    id: "fixture-tour-tee",
    handle: "tour-tee",
    title: "tour tee",
    description:
      "Black heavyweight cotton. Wordmark and the lying-down line drawing, front print.",
    featuredImage: {
      url: IMAGES.merchTee.src,
      altText: IMAGES.merchTee.alt,
      width: IMAGES.merchTee.width,
      height: IMAGES.merchTee.height,
    },
    images: [
      {
        url: IMAGES.merchTee.src,
        altText: IMAGES.merchTee.alt,
        width: IMAGES.merchTee.width,
        height: IMAGES.merchTee.height,
      },
    ],
    priceRange: { minVariantPrice: GBP(25) },
    availableForSale: true,
    variants: [
      variant("fixture-tee-s", "S", 25, true, 4),
      variant("fixture-tee-m", "M", 25, true, 7),
      // One size out of stock on purpose: the sold-out variant state is the
      // one most likely to be wrong, and it only shows up if something uses it.
      variant("fixture-tee-l", "L", 25, false, 0),
      variant("fixture-tee-xl", "XL", 25, true, 2),
    ],
  },
  {
    // No photography yet. The empty frame is a real state the band will see
    // between creating a product and uploading a shot, so it is worth designing
    // rather than discovering later.
    id: "fixture-longsleeve",
    handle: "vice-longsleeve",
    title: "vice longsleeve",
    description: "Long sleeve with sleeve print. Photography to come.",
    featuredImage: null,
    images: [],
    priceRange: { minVariantPrice: GBP(32) },
    availableForSale: true,
    variants: [
      variant("fixture-ls-m", "M", 32, true, 3),
      variant("fixture-ls-l", "L", 32, true, 5),
    ],
  },
  {
    // Entirely sold out: exercises the grid's sold-out stamp and the product
    // page's disabled add-to-cart.
    id: "fixture-tote",
    handle: "tote",
    title: "tote bag",
    description: "Screen-printed cotton tote. Photography to come.",
    featuredImage: null,
    images: [],
    priceRange: { minVariantPrice: GBP(12) },
    availableForSale: false,
    variants: [variant("fixture-tote-os", "One size", 12, false, 0)],
  },
];

/** A fixture product by handle, for the product page. */
export function merchByHandle(handle: string): Product | null {
  return MERCH.find((product) => product.handle === handle) ?? null;
}
