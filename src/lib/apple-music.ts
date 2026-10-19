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
 * The one thing Apple can't supply is the band's own smart link. Each release
 * looks for one in this order:
 *   1. STREAM_LINKS below, by Apple's release id — to override what the site
 *      finds, or keep a link once it leaves the Linktree.
 *   2. The band's Linktree. Any vm.group or ffm.to link on it is matched to a
 *      release by the title of the page it opens, so a new smart link (or a
 *      presave link, which becomes the streaming link on release day) is
 *      picked up as soon as it's added there, whatever the button says.
 *   3. heavyskint.ffm.to/<title>, the pattern the band's ffm.to links follow:
 *      the title in lower case with everything but letters and digits removed.
 *      Used only if that page exists. vm.group links end in a random code, so
 *      they can't be guessed this way.
 *   4. The release's Apple Music page, so it never shows without a button.
 */
const ARTIST_ID = "1779969828";

const LINKTREE_URL = "https://linktr.ee/heavyskint";

/** Hosts of the smart link services the band has released through. */
const SMART_LINK_HOST = /(^|\.)(vm\.group|ffm\.to)$/;

/** Smart links by Apple collection id. Only needed to override the Linktree. */
const STREAM_LINKS: Record<string, string> = {
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

/** "When Are You Coming For Me Jesus?" → heavyskint.ffm.to/whenareyoucomingformejesus */
function ffmUrl(title: string): string {
  return `https://heavyskint.ffm.to/${title.toLowerCase().replace(/[^a-z0-9]/g, "")}`;
}

/**
 * Whether a smart link exists. ffm.to answers 200 for a live link and 404 for
 * anything else. A slow or failed check counts as missing, so ffm.to being
 * down costs a release its smart link for one cache period, not the page.
 */
async function exists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: "HEAD",
      redirect: "manual",
      signal: AbortSignal.timeout(5000),
    });
    return response.status === 200;
  } catch {
    return false;
  }
}

/**
 * A title reduced to its letters and digits, without the band's name, so a
 * smart link page titled "heavyskint - He Says, She Says" or "Vice - heavyskint"
 * matches the release "he says, she says" or "vice".
 */
function titleKey(title: string): string {
  return title
    .toLowerCase()
    .replace(/&[#a-z0-9]+;/g, "")
    .replace(/heavyskint/g, "")
    .replace(/[^a-z0-9]/g, "");
}

/** The <title> of a page, or undefined if it can't be read in time. */
async function pageTitle(url: string): Promise<string | undefined> {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!response.ok) return undefined;
    return (await response.text()).match(/<title>([^<]*)<\/title>/i)?.[1];
  } catch {
    return undefined;
  }
}

/**
 * The smart links on the band's Linktree, by title key. The links sit in the
 * page's Next.js data. If the Linktree can't be read or its layout changes, this
 * finds nothing and releases fall through to the ffm.to guess.
 */
async function linktreeSmartLinks(): Promise<Map<string, string>> {
  const found = new Map<string, string>();
  try {
    const response = await fetch(LINKTREE_URL, {
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return found;
    const data = (await response.text()).match(
      /<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/,
    )?.[1];
    if (!data) return found;

    const links: { url?: string }[] =
      JSON.parse(data)?.props?.pageProps?.account?.links ?? [];
    const urls = new Set<string>();
    for (const link of links) {
      if (!link.url) continue;
      const url = new URL(link.url);
      // Drop the tracking parameters Instagram and others add.
      if (SMART_LINK_HOST.test(url.hostname)) urls.add(url.origin + url.pathname);
    }

    await Promise.all(
      [...urls].map(async (url) => {
        const title = await pageTitle(url);
        const key = title && titleKey(title);
        if (key && !found.has(key)) found.set(key, url);
      }),
    );
  } catch {
    // Treated as no links, as above.
  }
  return found;
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

  const releases = collections
    .sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))
    .flatMap((collection): (Release & { appleUrl: string })[] => {
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
          streamUrl: STREAM_LINKS[id],
          appleUrl: collection.collectionViewUrl,
          tracklist,
        },
      ];
    });

  const linktree = await linktreeSmartLinks();

  // Checked in parallel, and only for releases without a link found so far.
  return Promise.all(
    releases.map(async ({ appleUrl, ...release }) => {
      if (release.streamUrl) return release;
      const fromLinktree = linktree.get(titleKey(release.title));
      if (fromLinktree) return { ...release, streamUrl: fromLinktree };
      const guess = ffmUrl(release.title);
      return {
        ...release,
        streamUrl: (await exists(guess)) ? guess : appleUrl,
      };
    }),
  );
}
