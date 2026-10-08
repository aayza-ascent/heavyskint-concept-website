import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { CACHE_TAGS } from "@/lib/cache-tags";
import type { Release } from "@/lib/sanity/types";

/**
 * Releases from Apple Music, through the iTunes lookup API.
 *
 * Apple is the release list: whatever heavyskint put out appears here, with its
 * date and cover art, without anyone entering it. The lookup API needs no key.
 * It is cached for a few hours, so a new single shows up on the site within the
 * day it goes live on Apple Music.
 *
 * The one thing Apple can't supply is the band's own smart link, so those are
 * kept below by Apple's release id. A release with no smart link yet falls back
 * to its Apple Music page, so it never shows without a button.
 */
const ARTIST_ID = "1779969828";

/** Smart links by Apple collection id. Add a line when a release gets one. */
const STREAM_LINKS: Record<string, string> = {
  "1838540833": "https://heavyskint.ffm.to/vice",
  "1866899588": "https://heavyskint.ffm.to/whenareyoucomingformejesus",
  "6765784563": "https://vm.group/he-says-she-says-cse-t",
};

type Collection = {
  wrapperType: "collection";
  collectionId: number;
  collectionName: string;
  collectionViewUrl: string;
  artworkUrl100: string;
  releaseDate: string;
  trackCount: number;
};

type Track = {
  wrapperType: "track";
  collectionId: number;
  trackNumber: number;
  trackName: string;
};

async function lookup<T>(entity: "album" | "song"): Promise<T[]> {
  const url = new URL("https://itunes.apple.com/lookup");
  url.searchParams.set("id", ARTIST_ID);
  url.searchParams.set("entity", entity);
  url.searchParams.set("country", "gb");
  url.searchParams.set("limit", "200");

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Apple lookup responded ${response.status}`);
  }

  // The first result is the artist itself; the rest are what was asked for.
  const { results } = (await response.json()) as {
    results: { wrapperType: string }[];
  };
  return results.filter((r) => r.wrapperType !== "artist") as T[];
}

/**
 * Apple titles a single "Vice - Single". The suffix is the release type, and
 * the band writes its titles in lower case, so both are taken from the name.
 */
function parseName(name: string): Pick<Release, "title" | "type"> {
  const match = name.match(/^(.*?)\s+-\s+(Single|EP)$/);
  const title = (match ? match[1] : name).toLowerCase();
  const type = match?.[2] === "Single" ? "single" : match ? "ep" : "album";
  return { title, type };
}

/** Releases, newest first. */
export async function getAppleReleases(): Promise<Release[]> {
  "use cache";
  cacheTag(CACHE_TAGS.releases);
  cacheLife("hours");

  const collections = await lookup<Collection>("album");

  // Singles have nothing to list, so the track lookup only runs for a record
  // with more than one song on it.
  const tracks = collections.some((c) => c.trackCount > 1)
    ? await lookup<Track>("song")
    : [];

  // Apple can list a clean and an explicit version of the same release.
  const seen = new Set<string>();

  return collections
    .sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))
    .flatMap((collection): Release[] => {
      const { title, type } = parseName(collection.collectionName);
      if (seen.has(title)) return [];
      seen.add(title);

      const id = String(collection.collectionId);
      const tracklist =
        collection.trackCount > 1
          ? tracks
              .filter((t) => t.collectionId === collection.collectionId)
              .sort((a, b) => a.trackNumber - b.trackNumber)
              .map((t) => t.trackName.toLowerCase())
          : undefined;

      return [
        {
          _id: `apple-${id}`,
          title,
          type,
          releaseDate: collection.releaseDate.slice(0, 10),
          // The lookup hands back a 100px thumbnail; the size is in the path.
          coverUrl: collection.artworkUrl100.replace(
            /\/\d+x\d+bb\./,
            "/1200x1200bb.",
          ),
          streamUrl: STREAM_LINKS[id] ?? collection.collectionViewUrl,
          tracklist,
        },
      ];
    });
}
