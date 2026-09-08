"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { addToCart } from "@/lib/shopify/cart";

/**
 * Add a variant to the cart, then return to the product page with a result.
 *
 * The cart id is set as an httpOnly cookie inside `addToCart`, so this has to
 * be a server action rather than a client fetch.
 *
 * ⚠ UNVERIFIED. This path has never run against a real store — Shopify isn't
 * connected yet — so it is written to the Cart API contract but not tested.
 * Exercise it before launch: add to cart, refresh, then complete a test-mode
 * order.
 */
export async function addVariantToCart(formData: FormData) {
  const handle = String(formData.get("handle") ?? "");
  const variantId = String(formData.get("variantId") ?? "");

  if (!handle) redirect("/merch");
  if (!variantId) redirect(`/merch/${handle}?cart=no-variant`);

  try {
    await addToCart(variantId, 1);
  } catch (error) {
    console.error("[cart] add failed:", error);
    redirect(`/merch/${handle}?cart=error`);
  }

  revalidatePath(`/merch/${handle}`);
  redirect(`/merch/${handle}?cart=added`);
}
