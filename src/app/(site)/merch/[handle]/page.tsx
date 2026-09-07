import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/shopify/queries";
import { formatMoney } from "@/lib/format";

type Props = { params: Promise<{ handle: string }> };

/*
 * NOTE: add `generateStaticParams` once Shopify is connected.
 *
 * Under Cache Components it must return at least one result, so it cannot be
 * added while the store is unconfigured (it would return an empty array and
 * fail the build). With a live store it should return every product handle,
 * making each PDP fully static, with webhook revalidation keeping it fresh:
 *
 *   export async function generateStaticParams() {
 *     const products = await getProducts()
 *     return products.map((product) => ({ handle: product.handle }))
 *   }
 */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle).catch(() => null);

  if (!product) return { title: "Merch" };

  return {
    title: product.title,
    description: product.description.slice(0, 160),
    openGraph: product.featuredImage
      ? { images: [{ url: product.featuredImage.url }] }
      : undefined,
  };
}

/**
 * The params-dependent half, isolated behind Suspense.
 *
 * Under Cache Components, awaiting `params` in the page body would block the
 * whole route from prerendering. Isolating it here lets Next serve a static
 * shell immediately and stream the product in.
 */
async function ProductDetail({ params }: Props) {
  const { handle } = await params;
  const product = await getProduct(handle).catch(() => null);

  if (!product) notFound();

  return (
    <>
      <h1>{product.title}</h1>

      {product.featuredImage && (
        <Image
          src={product.featuredImage.url}
          alt={product.featuredImage.altText ?? product.title}
          width={product.featuredImage.width}
          height={product.featuredImage.height}
          priority
        />
      )}

      <p>{formatMoney(product.priceRange.minVariantPrice)}</p>
      <p>{product.description}</p>

      {/*
        Variant picker + add-to-cart is Phase 3. Variant data (sizes, stock,
        per-variant price) is already fetched, so the UI is what remains.
      */}
      <ul>
        {product.variants.map((variant) => (
          <li key={variant.id}>
            {variant.title}
            {!variant.availableForSale && " — sold out"}
          </li>
        ))}
      </ul>
    </>
  );
}

export default function ProductPage({ params }: Props) {
  return (
    <main>
      <Suspense fallback={<p>Loading…</p>}>
        <ProductDetail params={params} />
      </Suspense>
    </main>
  );
}
