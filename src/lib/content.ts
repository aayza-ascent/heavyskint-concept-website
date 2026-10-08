import "server-only";

import { cacheTag } from "next/cache";

import {
  getUpcomingShows,
  getPastShows,
  getNextShow,
  getSiteSettings,
} from "@/lib/sanity/queries";
import {
  getBandsintownUpcomingShows,
  getBandsintownPastShows,
} from "@/lib/bandsintown";
import { getAppleReleases } from "@/lib/apple-music";
import { safe } from "@/lib/safe";
import { env } from "@/lib/env";
import { SHOWS, upcomingShows, pastShows } from "@/lib/fixtures";
import type { FixtureShow } from "@/lib/fixtures";
import { MERCH, merchByHandle } from "@/lib/fixtures-merch";
import { getProducts, getProduct } from "@/lib/shopify/queries";
import type { Product } from "@/lib/shopify/types";
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
 * The same rule for merch, against Shopify rather than Sanity.
 *
 * Separate flag, not a shared one: the two services are connected at different
 * times, and a live Shopify store must never be masked by fixture products just
 * because Sanity is still missing.
 */
const useMerchFixtures =
  process.env.NODE_ENV === "development" && !env.shopify.isConfigured;

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
    `[content] ${label}: service not configured — serving development fixtures. ` +
      `Shows and releases are reconstructed from posters and need band ` +
      `verification; merch prices and stock in fixtures-merch.ts are invented.`,
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

/**
 * Shows come from Bandsintown once it is configured, ahead of both Sanity and
 * the fixtures — it is real data, so even development reads it. The Sanity
 * and fixture paths remain only for a checkout without the key.
 */
const useBandsintown = env.bandsintown.isConfigured;

export async function readUpcomingShows(): Promise<Show[]> {
  if (useBandsintown) {
    return safe("upcomingShows", getBandsintownUpcomingShows, []);
  }
  if (useFixtures) {
    fixtureNotice("upcomingShows");
    return (await fixtureShowSplit()).upcoming;
  }
  return safe("upcomingShows", getUpcomingShows, []);
}

export async function readPastShows(): Promise<Show[]> {
  if (useBandsintown) {
    return safe("pastShows", getBandsintownPastShows, []);
  }
  if (useFixtures) {
    fixtureNotice("pastShows");
    return (await fixtureShowSplit()).past;
  }
  return safe("pastShows", getPastShows, []);
}

export async function readNextShow(): Promise<Show | null> {
  if (useBandsintown) {
    const upcoming = await readUpcomingShows();
    return upcoming.find((show) => !show.cancelled) ?? null;
  }
  if (useFixtures) {
    fixtureNotice("nextShow");
    return (await fixtureShowSplit()).upcoming[0] ?? null;
  }
  return safe("nextShow", getNextShow, null);
}

/**
 * Releases come from Apple Music, which needs no key, so there is no fixture
 * or Sanity path: development and production read the same list.
 */
export async function readReleases(): Promise<Release[]> {
  return safe("releases", getAppleReleases, []);
}

/**
 * How many shows the band has sold out. Their positioning rests on the streak,
 * so it is derived from the data rather than typed into a headline where it
 * would rot.
 */
export async function readSoldOutCount(): Promise<number> {
  const shows = useBandsintown
    ? [...(await readUpcomingShows()), ...(await readPastShows())]
    : useFixtures
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
 * Merch, with the same development-only fixture fallback.
 *
 * Production never substitutes. If Shopify is unconfigured or down, "the store
 * isn't open yet" is the honest answer and `safe()` logs why — the band holds
 * the stock, so an invented product is an invented promise to ship something.
 */
export async function readProducts(): Promise<Product[]> {
  if (useMerchFixtures) {
    fixtureNotice("products");
    return MERCH;
  }
  return safe("products", getProducts, []);
}

/** A single product for the product page. */
export async function readProduct(handle: string): Promise<Product | null> {
  if (useMerchFixtures) {
    fixtureNotice("product");
    return merchByHandle(handle);
  }
  return safe(`product:${handle}`, () => getProduct(handle), null);
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
