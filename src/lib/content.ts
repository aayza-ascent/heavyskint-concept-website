import "server-only";

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

/** Logged once per read path so a fixture render is never mistaken for real data. */
function fixtureNotice(label: string) {
  console.warn(
    `[content] ${label}: Sanity not configured — serving development fixtures ` +
      `from src/lib/fixtures.ts. Dates are reconstructed from posters and need ` +
      `band verification.`,
  );
}

export async function readUpcomingShows(): Promise<Show[]> {
  if (useFixtures) {
    fixtureNotice("upcomingShows");
    return upcomingShows();
  }
  return safe("upcomingShows", getUpcomingShows, []);
}

export async function readPastShows(): Promise<Show[]> {
  if (useFixtures) {
    fixtureNotice("pastShows");
    return pastShows();
  }
  return safe("pastShows", getPastShows, []);
}

export async function readNextShow(): Promise<Show | null> {
  if (useFixtures) {
    fixtureNotice("nextShow");
    return upcomingShows()[0] ?? null;
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
