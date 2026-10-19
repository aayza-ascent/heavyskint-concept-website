import type { Metadata } from "next";
import Image from "next/image";
import { readReleases, readUpcomingReleases } from "@/lib/content";
import { PageHeading } from "@/components/site/PageHeading";
import { releaseCover } from "@/lib/images";
import { longDate, isoDate } from "@/lib/format";
import { STREAMING } from "@/lib/site";
import { PosterButton } from "@/components/ui/PosterButton";
import { Tag } from "@/components/ui/Tag";

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
 * Releases, dates and artwork come from Apple Music. Each release has one
 * Stream button: the band's smart link where there is one, which lists every
 * platform, otherwise the release's Apple Music page.
 *
 * A presave on the Linktree for something Apple doesn't list yet goes first,
 * tagged Upcoming, with its artwork and title from the presave page. No date:
 * the presave page doesn't give one.
 */
export default async function MusicPage() {
  const [releases, upcoming] = await Promise.all([
    readReleases(),
    readUpcomingReleases(),
  ]);

  return (
    <>
      <PageHeading title="music" />

      {/* Artist-level first, for anyone who just wants to follow. */}
      <ul className="flex flex-wrap gap-block px-gutter pb-gap">
        {STREAMING.map((link) => (
          <li key={link.platform}>
            <PosterButton href={link.url} external>
              {link.platform}
            </PosterButton>
          </li>
        ))}
      </ul>

      {upcoming.map((release, index) => (
        <article
          key={release.url}
          className="border-t border-smoke px-gutter py-void"
        >
          <div className="grid grid-cols-1 gap-gap md:grid-cols-[minmax(0,26rem)_1fr] md:gap-void">
            {release.coverUrl ? (
              <div className="hs-grain relative aspect-square overflow-hidden">
                <Image
                  src={release.coverUrl}
                  alt={`Cover for ${release.title}`}
                  fill
                  priority={index === 0}
                  sizes="(min-width: 768px) 26rem, 100vw"
                  className="object-cover"
                />
              </div>
            ) : null}

            <div>
              <Tag>Upcoming</Tag>
              <h2 className="hs-headline mt-block text-ink-white">
                {release.title}
              </h2>

              <div className="mt-gap">
                <PosterButton href={release.url} external>
                  Presave
                </PosterButton>
              </div>
            </div>
          </div>
        </article>
      ))}

      {releases.length > 0 ? (
        <div>
          {releases.map((release, index) => {
            const cover = releaseCover(release);

            return (
              <article
                key={release._id}
                className="border-t border-smoke px-gutter py-void"
              >
                <div className="grid grid-cols-1 gap-gap md:grid-cols-[minmax(0,26rem)_1fr] md:gap-void">
                  {cover ? (
                    <div className="hs-grain relative aspect-square overflow-hidden">
                      <Image
                        src={cover.src}
                        alt={cover.alt}
                        fill
                        priority={index === 0 && upcoming.length === 0}
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

                    {release.streamUrl ? (
                      <div className="mt-gap">
                        <PosterButton href={release.streamUrl} external>
                          Stream
                        </PosterButton>
                      </div>
                    ) : null}
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
