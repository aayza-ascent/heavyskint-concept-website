import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { formatMoney } from "@/lib/format";
import { readProducts } from "@/lib/content";
import { PageHeading } from "@/components/site/PageHeading";
import { Tag } from "@/components/ui/Tag";
import type { Product } from "@/lib/shopify/types";
import { MERCH_ONLINE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Merch",
  description: MERCH_ONLINE
    ? "Official heavyskint merch. Shipped from Scotland."
    : "heavyskint merch is sold at shows. Not currently sold online.",
};

/**
 * Merch.
 *
 * The band holds the stock and sells it at shows off the same inventory, so
 * "sold out" is a normal state here rather than an error — it gets the bone
 * flag and stays visible instead of disappearing from the grid, because a
 * shirt that sells out is also proof the shirt is worth having.
 */
export default async function MerchPage() {
  // The shop is closed (src/lib/site.ts). The route stays up so an old link or
  // a typed URL gets a plain answer rather than a 404.
  if (!MERCH_ONLINE) {
    return (
      <>
        <PageHeading title="merch" />
        <section className="border-t border-smoke px-gutter py-void">
          <p className="hs-headline text-ink-white">
            currently not selling merch online
          </p>
          <p className="hs-body mt-block text-smoke">
            Merch is on the table at every show.
          </p>
        </section>
      </>
    );
  }

  const products: Product[] = await readProducts();

  return (
    <>
      <PageHeading title="merch" />

      {products.length > 0 ? (
        <section className="border-t border-smoke px-gutter py-void">
          <ul className="grid grid-cols-2 gap-step md:grid-cols-3 md:gap-gap">
            {products.map((product) => (
              <li key={product.id}>
                <Link
                  href={`/merch/${product.handle}`}
                  className="group block no-underline"
                >
                  <div className="hs-grain relative aspect-[4/5] overflow-hidden border border-smoke bg-ink-raised transition-colors duration-[120ms] ease-[steps(2,end)] group-hover:border-flash">
                    {product.featuredImage ? (
                      <Image
                        src={product.featuredImage.url}
                        alt={product.featuredImage.altText ?? product.title}
                        fill
                        sizes="(min-width: 768px) 33vw, 50vw"
                        className="object-cover"
                      />
                    ) : null}
                    {!product.availableForSale ? (
                      <div className="absolute left-block top-block">
                        <Tag>Sold out</Tag>
                      </div>
                    ) : null}
                  </div>
                  <h2 className="hs-title mt-block text-ink-white transition-colors duration-[120ms] ease-[steps(2,end)] group-hover:text-flash">
                    {product.title}
                  </h2>
                  <p className="hs-label mt-hair text-smoke">
                    {formatMoney(product.priceRange.minVariantPrice)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section className="border-t border-smoke px-gutter py-void">
          <p className="hs-headline text-ink-white">
            the store isn&rsquo;t open yet
          </p>
          <p className="hs-body mt-block text-smoke">
            Until it is, merch is on the table at every show — cash or card.
          </p>
        </section>
      )}
    </>
  );
}
