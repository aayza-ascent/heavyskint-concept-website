import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/lib/shopify/queries";
import { safe } from "@/lib/safe";
import { formatMoney } from "@/lib/format";
import type { Product } from "@/lib/shopify/types";

export const metadata: Metadata = {
  title: "Merch",
  description: "Official Heavyskint merchandise.",
};

export default async function MerchPage() {
  const products = await safe("merch:products", getProducts, [] as Product[]);

  return (
    <main>
      <h1>Merch</h1>

      {products.length > 0 ? (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              <Link href={`/merch/${product.handle}`}>
                {product.featuredImage && (
                  <Image
                    src={product.featuredImage.url}
                    alt={product.featuredImage.altText ?? product.title}
                    width={product.featuredImage.width}
                    height={product.featuredImage.height}
                  />
                )}
                <span>{product.title}</span>
                <span>{formatMoney(product.priceRange.minVariantPrice)}</span>
                {!product.availableForSale && <span>Sold out</span>}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>The store isn&apos;t live yet. Check back soon.</p>
      )}
    </main>
  );
}
