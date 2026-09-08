import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/shopify/queries";
import { getCart } from "@/lib/shopify/cart";
import { formatMoney } from "@/lib/format";
import { PosterButton } from "@/components/ui/PosterButton";
import { Tag } from "@/components/ui/Tag";
import { ArrowUpRight } from "@/components/ui/Icon";
import { addVariantToCart } from "./actions";

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

const CART_MESSAGES: Record<string, string> = {
  added: "Added to your bag.",
  "no-variant": "Pick a size first.",
  error: "That couldn't be added. Try again in a moment.",
};

/**
 * The bag, once something is in it.
 *
 * Reads a cookie, so it is dynamic and streams in behind its own boundary
 * rather than blocking the product from prerendering. Checkout is a straight
 * redirect to Shopify's hosted checkout — payment never touches our origin.
 */
async function CartBar() {
  const cart = await getCart().catch(() => null);
  if (!cart || cart.totalQuantity === 0) return null;

  return (
    <div className="mt-gap flex flex-wrap items-center gap-block border border-smoke p-block">
      <span className="hs-label bg-bone px-tight py-hair text-ink">
        {cart.totalQuantity} in bag
      </span>
      <span className="hs-body text-ink-white">
        {formatMoney(cart.cost.subtotalAmount)}
      </span>
      <a
        href={cart.checkoutUrl}
        className="hs-label ml-auto inline-flex items-center gap-tight whitespace-nowrap bg-bone px-[28px] py-block text-ink no-underline transition-colors duration-[120ms] ease-[steps(2,end)] hover:bg-flash hover:text-void"
      >
        Checkout
        <ArrowUpRight className="text-[1.15em]" />
      </a>
    </div>
  );
}

/**
 * The params-dependent half, isolated behind Suspense.
 *
 * Under Cache Components, awaiting `params` in the page body would block the
 * whole route from prerendering. Isolating it here lets Next serve a static
 * shell immediately and stream the product in.
 */
async function ProductDetail({
  params,
  searchParams,
}: Props & { searchParams: Promise<{ cart?: string | string[] }> }) {
  const [{ handle }, { cart }] = await Promise.all([params, searchParams]);
  const cartStatus = typeof cart === "string" ? cart : undefined;
  const product = await getProduct(handle).catch(() => null);

  if (!product) notFound();

  const images = product.images.length > 0 ? product.images : [];
  const firstAvailable = product.variants.find((v) => v.availableForSale);
  // A single unnamed variant is Shopify's "no options" default — showing a
  // size picker with one nameless choice in it would be noise.
  const hasRealVariants =
    product.variants.length > 1 ||
    (product.variants[0]?.title ?? "Default Title") !== "Default Title";
  const notice = cartStatus ? CART_MESSAGES[cartStatus] : undefined;

  return (
    <div className="grid grid-cols-1 gap-void border-t border-smoke px-gutter py-void md:grid-cols-2 md:gap-chasm">
      <div>
        {product.featuredImage ? (
          <div className="hs-grain relative aspect-[4/5] overflow-hidden border border-smoke bg-ink-raised">
            <Image
              src={product.featuredImage.url}
              alt={product.featuredImage.altText ?? product.title}
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        ) : null}

        {images.length > 1 ? (
          <ul className="mt-step grid grid-cols-4 gap-tight">
            {images.slice(1, 5).map((image) => (
              <li
                key={image.url}
                className="hs-grain relative aspect-square overflow-hidden border border-smoke bg-ink-raised"
              >
                <Image
                  src={image.url}
                  alt={image.altText ?? product.title}
                  fill
                  sizes="12vw"
                  className="object-cover"
                />
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div>
        <h1 className="hs-headline text-ink-white">{product.title}</h1>

        <div className="mt-block flex flex-wrap items-center gap-block">
          <p className="hs-label text-smoke">
            {formatMoney(product.priceRange.minVariantPrice)}
          </p>
          {!product.availableForSale ? <Tag>Sold out</Tag> : null}
        </div>

        {product.description ? (
          <p className="hs-body mt-gap text-ink-white">{product.description}</p>
        ) : null}

        {notice ? (
          <p
            role="status"
            className="mt-gap border border-smoke p-block hs-body text-ink-white"
          >
            {notice}
          </p>
        ) : null}

        {product.availableForSale && firstAvailable ? (
          <form action={addVariantToCart} className="mt-gap">
            <input type="hidden" name="handle" value={product.handle} />

            {hasRealVariants ? (
              <fieldset>
                <legend className="hs-label text-smoke">Size</legend>
                <div className="mt-tight flex flex-wrap gap-tight">
                  {product.variants.map((variant) => (
                    <label
                      key={variant.id}
                      className={`hs-label inline-flex cursor-pointer items-center whitespace-nowrap border px-block py-tight transition-colors duration-[120ms] ease-[steps(2,end)] ${
                        variant.availableForSale
                          ? "border-smoke text-ink-white hover:border-flash hover:text-flash has-[:checked]:bg-bone has-[:checked]:text-ink"
                          : "cursor-not-allowed border-ash text-smoke line-through"
                      }`}
                    >
                      <input
                        type="radio"
                        name="variantId"
                        value={variant.id}
                        defaultChecked={variant.id === firstAvailable.id}
                        disabled={!variant.availableForSale}
                        required
                        className="sr-only"
                      />
                      {variant.title}
                    </label>
                  ))}
                </div>
              </fieldset>
            ) : (
              <input
                type="hidden"
                name="variantId"
                value={firstAvailable.id}
              />
            )}

            <div className="mt-step">
              <PosterButton type="submit">Add to bag</PosterButton>
            </div>
          </form>
        ) : (
          <div className="mt-gap">
            <PosterButton variant="disabled" href="/merch">
              Sold out
            </PosterButton>
            <p className="hs-meta mt-block text-smoke">
              Restocks get announced first on the shows page and at the merch
              table.
            </p>
          </div>
        )}

        <Suspense fallback={null}>
          <CartBar />
        </Suspense>
      </div>
    </div>
  );
}

export default function ProductPage(props: PageProps<"/merch/[handle]">) {
  return (
    <Suspense
      fallback={
        <div className="border-t border-smoke px-gutter py-void">
          <p className="hs-label text-smoke">Loading</p>
        </div>
      }
    >
      <ProductDetail
        params={props.params}
        searchParams={props.searchParams}
      />
    </Suspense>
  );
}
