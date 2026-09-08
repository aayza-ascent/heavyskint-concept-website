import "server-only";

import { cacheTag } from "next/cache";

import {
  getUpcomingShows,
  getPastShows,
  getNextShow,
  getReleases,
  getSiteSettings,
} from "@/lib/sanity/queries";
import { safe } from "@/lib/safe";
import { env } from "@/lib/env";
import { SHOWS, RELEASES, upcomingShows, pastShows } from "@/lib/fixtures";
import type { FixtureShow } from "@/lib/fixtures";
import { CACHE_TAGS } from "@/lib/cache-tags";
import type { Show, Release, SiteSettings } from "@/lib/sanity/types";

/**
 * Content reads for the site, with a development-only fixture fallback.
 *
 * Sanity is the source of truth. Until the band's project exists there is
 * nothing to read, and designing against a permanently empty page hides every
 * layout problem that real content causes — a three-act support line, a venue
 * name that wraps, a sold-out flag next to a long city. So in development only,
 * reads fall back to the reconstructed archive in `fixtures.ts`.
 *
 * Production never substitutes. If Sanity is unconfigured or down in
 * production, the empty state is the honest answer and `safe()` logs why.
 */
const useFixtures =
  process.env.NODE_ENV === "development" && !env.sanity.isConfigured;

/**
 * Warns that a render is fixture-backed, once per read path per server process.
 *
 * The point is to make sure a fixture render is never mistaken for real data,
 * and one warning per path does that. Warning on every read instead put two
 * lines in the terminal for every page load and buried the actual errors.
 */
const noticed = new Set<string>();
function fixtureNotice(label: string) {
  if (noticed.has(label)) return;
  noticed.add(label);
  console.warn(
    `[content] ${label}: Sanity not configured — serving development fixtures ` +
      `from src/lib/fixtures.ts. Dates are reconstructed from posters and need ` +
      `band verification.`,
  );
}

/**
 * The fixture shows, split into upcoming and past — cached.
 *
 * Splitting needs a "now", and reading the clock while prerendering is an
 * unstable value under Cache Components: it can differ between renders, so
 * Next refuses to bake it into static output. Caching the result is the
 * sanctioned fix — every visitor sees the same split until the entry
 * revalidates.
 *
 * That is also exactly what the real path does. In production the split runs
 * in GROQ against Sanity's own `now()`, inside a `use cache` query tagged with
 * the same key, so this keeps development and production behaving alike rather
 * than papering over a difference.
 *
 * Only ever reached in development — see `useFixtures`.
 */
async function fixtureShowSplit(): Promise<{
  upcoming: FixtureShow[];
  past: FixtureShow[];
}> {
  "use cache";
  cacheTag(CACHE_TAGS.shows);

  const now = new Date();
  return { upcoming: upcomingShows(now), past: pastShows(now) };
}

export async function readUpcomingShows(): Promise<Show[]> {
  if (useFixtures) {
    fixtureNotice("upcomingShows");
    return (await fixtureShowSplit()).upcoming;
  }
  return safe("upcomingShows", getUpcomingShows, []);
}

export async function readPastShows(): Promise<Show[]> {
  if (useFixtures) {
    fixtureNotice("pastShows");
    return (await fixtureShowSplit()).past;
  }
  return safe("pastShows", getPastShows, []);
}

export async function readNextShow(): Promise<Show | null> {
  if (useFixtures) {
    fixtureNotice("nextShow");
    return (await fixtureShowSplit()).upcoming[0] ?? null;
  }
  return safe("nextShow", getNextShow, null);
}

export async function readReleases(): Promise<Release[]> {
  if (useFixtures) {
    fixtureNotice("releases");
    return RELEASES;
  }
  return safe("releases", getReleases, []);
}

/**
 * How many shows the band has sold out. Their positioning rests on the streak,
 * so it is derived from the data rather than typed into a headline where it
 * would rot.
 */
export async function readSoldOutCount(): Promise<number> {
  const shows = useFixtures
    ? SHOWS
    : await safe("soldOutCount", async () => {
        const [upcoming, past] = await Promise.all([
          getUpcomingShows(),
          getPastShows(),
        ]);
        return [...upcoming, ...past];
      }, []);

  return shows.filter((s) => s.soldOut && !s.cancelled).length;
}

/**
 * Site-wide settings: bio, socials, press kit, booking address.
 *
 * Deliberately has no fixture. Streaming and social URLs have not been supplied
 * (PRODUCT.md records the absence), and inventing them would put a broken link
 * in the footer of every page. Absent settings render as absent.
 */
export async function readSiteSettings(): Promise<SiteSettings | null> {
  if (useFixtures) return null;
  return safe("siteSettings", getSiteSettings, null);
}
