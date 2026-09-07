import { getNextShow } from "@/lib/sanity/queries";
import { getProducts } from "@/lib/shopify/queries";
import { safe } from "@/lib/safe";

/**
 * Homepage.
 *
 * Structure only — visual design is Phase 4 (`/impeccable shape`, then build
 * against DESIGN.md). Deliberately unstyled so the design pass starts from the
 * band's system rather than from placeholder decisions made here.
 */
export default async function HomePage() {
  const nextShow = await safe("home:nextShow", getNextShow, null);
  const products = await safe("home:products", getProducts, []);
  const featured = products.slice(0, 3);

  return (
    <main>
      <section aria-labelledby="hero-heading">
        <h1 id="hero-heading">Heavyskint</h1>
      </section>

      <section aria-labelledby="next-show-heading">
        <h2 id="next-show-heading">Next show</h2>
        {nextShow ? (
          <p>
            {new Date(nextShow.date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}{" "}
            — {nextShow.venue}, {nextShow.city}
          </p>
        ) : (
          <p>No shows announced yet.</p>
        )}
      </section>

      <section aria-labelledby="featured-merch-heading">
        <h2 id="featured-merch-heading">Merch</h2>
        {featured.length > 0 ? (
          <ul>
            {featured.map((product) => (
              <li key={product.id}>{product.title}</li>
            ))}
          </ul>
        ) : (
          <p>Store coming soon.</p>
        )}
      </section>
    </main>
  );
}
