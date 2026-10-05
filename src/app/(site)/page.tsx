import Image from "next/image";
import Link from "next/link";
import {
  readNextShow,
  readReleases,
  readSoldOutCount,
  readProducts,
} from "@/lib/content";
import { PRESS } from "@/lib/fixtures";
import { IMAGES, RELEASE_COVERS } from "@/lib/images";
import { MERCH_ONLINE, STREAMING } from "@/lib/site";
import { PosterButton } from "@/components/ui/PosterButton";
import { ShowStatus } from "@/components/ui/Tag";
import { Lockup } from "@/components/ui/Wordmark";
import { MailingList } from "@/components/site/MailingList";
import { showDate, isoDate, longDate, formatMoney } from "@/lib/format";

/**
 * Home.
 *
 * Mode: Persuade. The visitor this page is built for arrives cold, on a phone,
 * having just heard a track or been sent a link, and decides in seconds. So the
 * page leads with the strongest true thing the band owns — the sold-out record —
 * rather than with a welcome, and the only things above the fold are that claim,
 * what they sound like, and the next date.
 *
 * Composition follows the poster frame: the band's own lockup sits over the
 * photograph of all five of them, the words follow on the black beneath it,
 * and the black between blocks does the pacing.
 */
export default async function HomePage(props: PageProps<"/">) {
  const [nextShow, releases, soldOutCount, products] = await Promise.all([
    readNextShow(),
    readReleases(),
    readSoldOutCount(),
    MERCH_ONLINE ? readProducts() : [],
  ]);

  const featured = products.slice(0, 3);
  const latest = releases[0];

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────
          The whole band, with their own lockup — the face-down figure over
          the wordmark — in the open concrete above their heads. Nothing else
          sits on the photograph: the introduction follows below it. */}
      <section className="hs-grain relative isolate flex min-h-[88svh] flex-col overflow-hidden">
        <Image
          src={IMAGES.bandBridge.src}
          alt={IMAGES.bandBridge.alt}
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-[center_65%]"
        />
        {/* Tonal layering, not a gradient scrim — the system's own depth
            mechanism. One step of ink so the mark holds against the
            mid-grey concrete without burying the band. */}
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-ink/45" />

        <div className="px-gutter pt-void">
          <h1 className="hs-pass">
            <Lockup
              title="heavyskint."
              className="w-[min(100%,34rem)] text-ink-white"
            />
          </h1>
        </div>
      </section>

      <section className="px-gutter py-void">
        <p className="hs-body max-w-[40rem] text-ink-white">
          A five-piece from Glasgow: 90s shoegaze, grunge and alt-rock with a
          soulful tinge and an unfiltered intensity.
        </p>

        <div className="mt-gap flex flex-wrap items-center gap-block">
          <PosterButton href="/shows">All shows</PosterButton>
          <PosterButton href="/music" variant="ghost">
            Listen
          </PosterButton>
        </div>
      </section>

      {/* ── Next show ─────────────────────────────────────────
          The one thing a convinced visitor can act on right now, so it gets
          its own surface rather than a row in
           a list. */}
      <section
        aria-labelledby="next-show"
        className="border-t border-smoke px-gutter py-void"
      >
        <h2 id="next-show" className="hs-label text-smoke">
          Next show
        </h2>

        {nextShow ? (
          <div className="mt-step flex flex-col gap-step md:flex-row md:items-end md:justify-between">
            <div>
              <p className="hs-headline mt-block text-ink-white">
                {nextShow.venue}
              </p>
              <p className="hs-label mt-tight text-smoke">
                <time dateTime={isoDate(nextShow.date)}>
                  {showDate(nextShow.date)}
                </time>
                {"  "}
                {nextShow.city}
              </p>
              {nextShow.supportActs && nextShow.supportActs.length > 0 ? (
                <p className="hs-label mt-tight text-smoke">
                  {nextShow.supportActs.map((a) => `+ ${a}`).join("  ")}
                </p>
              ) : null}
            </div>

            <div className="flex items-center gap-block">
              <ShowStatus
                soldOut={nextShow.soldOut}
                cancelled={nextShow.cancelled}
              />
              {nextShow.ticketUrl &&
              !nextShow.soldOut &&
              !nextShow.cancelled ? (
                <PosterButton href={nextShow.ticketUrl} external>
                  Tickets
                </PosterButton>
              ) : (
                <PosterButton href="/shows" variant="ghost">
                  All dates
                </PosterButton>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-step">
            <p className="hs-headline text-ink-white">
              nothing announced right now
            </p>
            <p className="hs-body mt-block text-smoke">
              New dates go up here first.
            </p>
          </div>
        )}
      </section>

      {/* ── The record ────────────────────────────────────────
          Proof, not adjectives. The press quote runs at headline size over the
          crowd photograph that demonstrates it, so the claim and its evidence
          are the same object. */}
      <section
        aria-labelledby="the-record"
        className="hs-grain relative isolate overflow-hidden"
      >
        <Image
          src={IMAGES.liveCrowd.src}
          alt={IMAGES.liveCrowd.alt}
          fill
          sizes="100vw"
          className="-z-10 object-cover"
        />
        {/* Tonal, not a gradient scrim: one step of ink over the photograph so
            the quote holds contrast without washing the image out. */}
        <div className="-z-10 absolute inset-0 bg-ink/70" />

        <div className="px-gutter py-chasm">
          <h2 id="the-record" className="hs-label text-smoke">
            The live record
          </h2>

          <blockquote className="mt-step">
            <p className="hs-headline text-flash">
              &ldquo;{PRESS[0].quote}&rdquo;
            </p>
            <footer className="hs-label mt-block text-ink-white">
              {PRESS[0].source}
            </footer>
          </blockquote>

          <p className="hs-body mt-gap text-ink-white">
            {soldOutCount > 0
              ? `${soldOutCount} sold-out shows and counting. `
              : null}
            Named one of the country&rsquo;s most exciting live acts at the
            Scottish Live Music Awards.
          </p>

          <ul className="mt-gap flex flex-col gap-step">
            {PRESS.slice(1).map((item) => (
              <li key={item.source} className="hs-body text-ink-white">
                &ldquo;{item.quote}&rdquo;
                <span className="hs-label ml-tight text-smoke">
                  {item.source}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Music ─────────────────────────────────────────────
          Newest first and lead-weighted: the latest single gets the large
          frame, the back catalogue sits beside it. */}
      <section
        aria-labelledby="music"
        className="border-t border-smoke px-gutter py-void"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-block">
          <h2 id="music" className="hs-headline text-ink-white">
            music
          </h2>
          <Link
            href="/music"
            className="hs-label text-ink-white underline transition-colors duration-[120ms] ease-[steps(2,end)] hover:text-flash"
          >
            Every release
          </Link>
        </div>

        <ul className="mt-step flex flex-wrap gap-block">
          {STREAMING.map((link) => (
            <li key={link.platform}>
              <PosterButton href={link.url} variant="ghost" external>
                {link.platform}
              </PosterButton>
            </li>
          ))}
        </ul>

        {releases.length > 0 && latest ? (
          <div className="mt-gap grid grid-cols-1 gap-gap md:grid-cols-[1fr_1fr]">
            <article>
              {RELEASE_COVERS[latest.title] ? (
                <div className="hs-grain relative aspect-square overflow-hidden">
                  <Image
                    src={RELEASE_COVERS[latest.title].src}
                    alt={RELEASE_COVERS[latest.title].alt}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : null}
              <h3 className="hs-title mt-block text-ink-white">
                {latest.title}
              </h3>
              <p className="hs-label mt-tight text-smoke">
                <time dateTime={isoDate(latest.releaseDate)}>
                  {longDate(latest.releaseDate)}
                </time>
              </p>
              {latest.links && latest.links.length > 0 ? (
                <ul className="mt-block flex flex-wrap gap-x-step gap-y-tight">
                  {latest.links.map((link) => (
                    <li key={link.url}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hs-label text-ink-white underline transition-colors duration-[120ms] ease-[steps(2,end)] hover:text-flash"
                      >
                        {link.platform}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>

            <ul className="flex flex-col">
              {releases.slice(1).map((release) => (
                <li
                  key={release._id}
                  className="flex items-center gap-block border-t border-smoke py-step"
                >
                  {RELEASE_COVERS[release.title] ? (
                    <div className="hs-grain relative h-[72px] w-[72px] shrink-0 overflow-hidden">
                      <Image
                        src={RELEASE_COVERS[release.title].src}
                        alt={RELEASE_COVERS[release.title].alt}
                        fill
                        sizes="72px"
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                  <div>
                    <h3 className="hs-title text-ink-white">{release.title}</h3>
                    <p className="hs-label mt-hair text-smoke">
                      <time dateTime={isoDate(release.releaseDate)}>
                        {longDate(release.releaseDate)}
                      </time>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="hs-body mt-step text-smoke">
            Releases will appear here as they come out.
          </p>
        )}
      </section>

      {/* ── Merch ─────────────────────────────────────────────
          Stock is held by the band and sold at shows through the same
          inventory, so an out-of-stock state here is normal and gets said
          plainly rather than hidden.

          The grid is switched off while MERCH_ONLINE is false (src/lib/site.ts):
          the band isn't selling online yet, and the section says that instead. */}
      {!MERCH_ONLINE ? (
        <section
          aria-labelledby="merch"
          className="border-t border-smoke px-gutter py-void"
        >
          <h2 id="merch" className="hs-headline text-ink-white">
            merch
          </h2>
          <p className="hs-title mt-step text-ink-white">
            currently not selling merch online
          </p>
          <p className="hs-body mt-tight text-smoke">
            Merch is on the table at every show.
          </p>
        </section>
      ) : (
        <section
          aria-labelledby="merch"
          className="border-t border-smoke px-gutter py-void"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-block">
            <h2 id="merch" className="hs-headline text-ink-white">
              merch
            </h2>
            {featured.length > 0 ? (
              <Link
                href="/merch"
                className="hs-label text-ink-white underline transition-colors duration-[120ms] ease-[steps(2,end)] hover:text-flash"
              >
                Everything
              </Link>
            ) : null}
          </div>

          {featured.length > 0 ? (
            <ul className="mt-gap grid grid-cols-2 gap-step md:grid-cols-3">
              {featured.map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/merch/${product.handle}`}
                    className="group block"
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
                    </div>
                    <h3 className="hs-title mt-block text-ink-white">
                      {product.title}
                    </h3>
                    <p className="hs-label mt-hair text-smoke">
                      {product.availableForSale
                        ? formatMoney(product.priceRange.minVariantPrice)
                        : "Sold out"}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-step">
              <p className="hs-title text-ink-white">
                the store isn&rsquo;t open yet
              </p>
              <p className="hs-body mt-tight text-smoke">
                Until it is, merch is on the table at every show.
              </p>
            </div>
          )}
        </section>
      )}

      <MailingList searchParams={props.searchParams} />

      {/* Minimal, and only facts the band has confirmed. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MusicGroup",
            name: "heavyskint",
            sameAs: STREAMING.map((link) => link.url),
            genre: ["Shoegaze", "Grunge", "Alternative rock"],
            foundingLocation: {
              "@type": "Place",
              name: "Glasgow, Scotland",
            },
            description:
              "A five-piece from Glasgow: 90s shoegaze, grunge and alt-rock with a soulful tinge and an unfiltered intensity.",
            member: [
              "Jacob Hunter",
              "Jamie Kelly",
              "Sean Reilly",
              "Maddie Thomasset",
              "Joel Walker",
            ].map((name) => ({ "@type": "Person", name })),
          }),
        }}
      />
    </>
  );
}
