import type { Metadata } from "next";
import Image from "next/image";
import { readReleases } from "@/lib/content";
import { PageHeading } from "@/components/site/PageHeading";
import { ArrowUpRight } from "@/components/ui/Icon";
import { RELEASE_COVERS } from "@/lib/images";
import { urlForImage } from "@/lib/sanity/image";
import { env } from "@/lib/env";
import { longDate, isoDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Music",
  description: "heavyskint releases — singles, EPs and albums.",
};

const TYPE_LABEL = { single: "Single", ep: "EP", album: "Album" } as const;

/**
 * Music.
 *
 * Each release is a full-width band with its artwork at square, because the
 * artwork is the strongest thing on this page — staged monochrome tableaux, all
 * shot for these songs. Shrinking them into a grid of thumbnails would waste
 * the one asset the page exists to show.
 *
 * Streaming links come from Sanity so the band can add a platform themselves.
 * Where none are set the release still reads as a release rather than showing
 * dead buttons.
 */
export default async function MusicPage() {
  const releases = await readReleases();

  return (
    <>
      <PageHeading title="music" />

      {releases.length > 0 ? (
        <div>
          {releases.map((release, index) => {
            // Sanity artwork wins once uploaded; the shipped covers are the
            // fallback so the page is never empty during build-out.
            // Guarded on isConfigured: the image builder reads the project id,
            // which throws when Sanity isn't wired up yet.
            const sanityCover =
              release.cover && env.sanity.isConfigured
                ? urlForImage(release.cover).width(1200).height(1200).url()
                : undefined;
            const fallback = RELEASE_COVERS[release.title];
            const coverSrc = sanityCover ?? fallback?.src;
            const coverAlt = fallback?.alt ?? `Cover artwork for ${release.title}`;

            return (
              <article
                key={release._id}
                className="border-t border-smoke px-gutter py-void"
              >
                <div className="grid grid-cols-1 gap-gap md:grid-cols-[minmax(0,26rem)_1fr] md:gap-void">
                  {coverSrc ? (
                    <div className="hs-grain relative aspect-square overflow-hidden">
                      <Image
                        src={coverSrc}
                        alt={coverAlt}
                        fill
                        priority={index === 0}
                        sizes="(min-width: 768px) 26rem, 100vw"
                        className="object-cover"
                      />
                    </div>
                  ) : null}

                  <div>
                    <h2 className="hs-headline text-ink-white">
                      {release.title}
                    </h2>
                    <p className="hs-label mt-block text-smoke">
                      {TYPE_LABEL[release.type]}
                      <span className="mx-tight">·</span>
                      <time dateTime={isoDate(release.releaseDate)}>
                        {longDate(release.releaseDate)}
                      </time>
                    </p>

                    {release.tracklist && release.tracklist.length > 0 ? (
                      <ol className="mt-gap">
                        {release.tracklist.map((track, i) => (
                          <li
                            key={track}
                            className="flex gap-block border-t border-smoke py-block"
                          >
                            <span className="hs-label w-[2ch] text-smoke">
                              {i + 1}
                            </span>
                            <span className="hs-title text-ink-white">
                              {track}
                            </span>
                          </li>
                        ))}
                      </ol>
                    ) : null}

                    {release.links && release.links.length > 0 ? (
                      <ul className="mt-gap flex flex-wrap gap-block">
                        {release.links.map((link) => (
                          <li key={link.url}>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hs-label inline-flex items-center gap-tight whitespace-nowrap border border-smoke px-[28px] py-block text-ink-white no-underline transition-colors duration-[120ms] ease-[steps(2,end)] hover:bg-ink-raised hover:text-flash"
                            >
                              {link.platform}
                              <ArrowUpRight className="text-[1.15em]" />
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="hs-meta mt-gap text-smoke">
                        Streaming links haven&rsquo;t been added for this
                        release yet.
                      </p>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="border-t border-smoke px-gutter py-void">
          <p className="hs-headline text-ink-white">nothing out yet</p>
          <p className="hs-body mt-block text-smoke">
            Releases appear here as they come out.
          </p>
        </div>
      )}
    </>
  );
}
