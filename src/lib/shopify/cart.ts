import "server-only";
import { cookies } from "next/headers";
import { storefront } from "./client";
import type { Cart } from "./types";

const CART_COOKIE = "heavyskint_cart_id";

const CART_FRAGMENT = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      nodes {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            price {
              amount
              currencyCode
            }
            image {
              url
              altText
              width
              height
            }
            product {
              title
              handle
            }
          }
        }
      }
    }
  }
`;

type RawCart = Omit<Cart, "lines"> & { lines: { nodes: Cart["lines"] } };

function normalise(raw: RawCart): Cart {
  return { ...raw, lines: raw.lines.nodes };
}

/** Read the current cart, or null if there isn't one yet. */
export async function getCart(): Promise<Cart | null> {
  const cartId = (await cookies()).get(CART_COOKIE)?.value;
  if (!cartId) return null;

  const data = await storefront<{ cart: RawCart | null }>(
    /* GraphQL */ `
      ${CART_FRAGMENT}
      query Cart($id: ID!) {
        cart(id: $id) {
          ...CartFields
        }
      }
    `,
    { id: cartId },
  );

  // Shopify expires carts after ~10 days of inactivity; treat a dead id as empty.
  return data.cart ? normalise(data.cart) : null;
}

/**
 * Add a variant to the cart, creating the cart if needed.
 *
 * The cart id lives in an httpOnly cookie so it survives refreshes and can't be
 * read by client JS.
 */
export async function addToCart(
  variantId: string,
  quantity = 1,
): Promise<Cart> {
  const cookieStore = await cookies();
  const existingId = cookieStore.get(CART_COOKIE)?.value;

  if (existingId) {
    const data = await storefront<{
      cartLinesAdd: { cart: RawCart | null; userErrors: { message: string }[] };
    }>(
      /* GraphQL */ `
        ${CART_FRAGMENT}
        mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
          cartLinesAdd(cartId: $cartId, lines: $lines) {
            cart {
              ...CartFields
            }
            userErrors {
              message
            }
          }
        }
      `,
      { cartId: existingId, lines: [{ merchandiseId: variantId, quantity }] },
    );

    const { cart, userErrors } = data.cartLinesAdd;
    if (userErrors.length) throw new Error(userErrors[0].message);
    if (cart) return normalise(cart);
    // Cart id was stale — fall through and create a fresh one.
  }

  const data = await storefront<{
    cartCreate: { cart: RawCart | null; userErrors: { message: string }[] };
  }>(
    /* GraphQL */ `
      ${CART_FRAGMENT}
      mutation CartCreate($lines: [CartLineInput!]!) {
        cartCreate(input: { lines: $lines }) {
          cart {
            ...CartFields
          }
          userErrors {
            message
          }
        }
      }
    `,
    { lines: [{ merchandiseId: variantId, quantity }] },
  );

  const { cart, userErrors } = data.cartCreate;
  if (userErrors.length) throw new Error(userErrors[0].message);
  if (!cart) throw new Error("Failed to create cart");

  cookieStore.set(CART_COOKIE, cart.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 10, // ~matches Shopify's own cart lifetime
  });

  return normalise(cart);
}

/** Set a line's quantity. Passing 0 removes the line. */
export async function updateCartLine(
  lineId: string,
  quantity: number,
): Promise<Cart | null> {
  const cartId = (await cookies()).get(CART_COOKIE)?.value;
  if (!cartId) return null;

  if (quantity <= 0) {
    const data = await storefront<{
      cartLinesRemove: { cart: RawCart | null };
    }>(
      /* GraphQL */ `
        ${CART_FRAGMENT}
        mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
          cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
            cart {
              ...CartFields
            }
          }
        }
      `,
      { cartId, lineIds: [lineId] },
    );
    return data.cartLinesRemove.cart
      ? normalise(data.cartLinesRemove.cart)
      : null;
  }

  const data = await storefront<{ cartLinesUpdate: { cart: RawCart | null } }>(
    /* GraphQL */ `
      ${CART_FRAGMENT}
      mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart {
            ...CartFields
          }
        }
      }
    `,
    { cartId, lines: [{ id: lineId, quantity }] },
  );

  return data.cartLinesUpdate.cart
    ? normalise(data.cartLinesUpdate.cart)
    : null;
}
