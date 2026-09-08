import type { Show, Release } from "@/lib/sanity/types";

/**
 * Real archive content, reconstructed from the band's own posters and captions.
 *
 * Two jobs:
 *   1. Development preview when Sanity isn't wired up yet, so the design is
 *      verified against real string lengths — "Humber Street Sesh",
 *      "Elephant's Head, Camden", three support acts on one line — instead of
 *      against an empty state or lorem.
 *   2. The seed source for Sanity (see sanity/seed.ts), so the band starts with
 *      their own history already in the CMS rather than a blank dataset.
 *
 * ⚠ VERIFY BEFORE PUBLISHING. Dates and venues here are read off gig posters
 * and Instagram captions, not supplied by the band. Entries carrying
 * `unverifiedDate: true` had only a month to go on and the day is a placeholder.
 * Nothing in this file should reach production un-checked.
 */

export type FixtureShow = Show & {
  /** Only a month was stated in the source; the day needs confirming. */
  unverifiedDate?: boolean;
  /** Promoter or festival the show ran under, where one was named. */
  presentedBy?: string;
};

/** Sorted oldest → newest. Split into upcoming/past at query time, not here. */
export const SHOWS: FixtureShow[] = [
  {
    _id: "show-tuts-2025-08",
    date: "2025-08-29",
    venue: "King Tut's Wah Wah Hut",
    city: "Glasgow",
    country: "Scotland",
    soldOut: true,
    cancelled: false,
    unverifiedDate: true,
  },
  {
    _id: "show-qmu-2025-09",
    date: "2025-09-18",
    venue: "Queen Margaret Union",
    city: "Glasgow",
    country: "Scotland",
    soldOut: false,
    cancelled: false,
    unverifiedDate: true,
  },
  {
    _id: "show-swg3-2025-10",
    date: "2025-10-29",
    venue: "SWG3",
    city: "Glasgow",
    country: "Scotland",
    soldOut: false,
    cancelled: false,
  },
  {
    _id: "show-mcchuills-2025-11",
    date: "2025-11-21",
    venue: "McChuills",
    city: "Glasgow",
    country: "Scotland",
    soldOut: true,
    cancelled: false,
    supportActs: ["The Violets", "Braes"],
    presentedBy: "SMC",
  },
  {
    _id: "show-tuts-2026-01",
    date: "2026-01-10",
    venue: "King Tut's Wah Wah Hut",
    city: "Glasgow",
    country: "Scotland",
    soldOut: true,
    cancelled: false,
    supportActs: ["Allsorts", "Dirty Mike", "Eyes Of Home"],
  },
  {
    _id: "show-1990-2026-02",
    date: "2026-02-14",
    venue: "1990",
    city: "Glasgow",
    country: "Scotland",
    soldOut: true,
    cancelled: false,
    supportActs: ["Tuesday Club", "Whissker", "Alesia"],
    presentedBy: "Slay Sessions",
  },
  {
    _id: "show-houseguest-2026-04",
    date: "2026-04-04",
    venue: "Nice N Sleazy",
    city: "Glasgow",
    country: "Scotland",
    soldOut: false,
    cancelled: false,
    presentedBy: "Houseguest Fest",
  },
  {
    _id: "show-sneaky-2026-05",
    date: "2026-05-06",
    venue: "Sneaky Pete's",
    city: "Edinburgh",
    country: "Scotland",
    soldOut: true,
    cancelled: false,
    supportActs: ["Oedipus And The Mama's Boys"],
    presentedBy: "DF Concerts",
  },
  {
    _id: "show-elephants-head-2026-07",
    date: "2026-07-31",
    venue: "Elephant's Head, Camden",
    city: "London",
    country: "England",
    soldOut: false,
    cancelled: false,
    presentedBy: "SMC + Product 85",
  },
  {
    _id: "show-humber-street-2026-08",
    date: "2026-08-01",
    venue: "Humber Street Sesh",
    city: "Hull",
    country: "England",
    soldOut: false,
    cancelled: false,
  },
  {
    _id: "show-art-school-2026-09",
    date: "2026-09-05",
    venue: "The Art School",
    city: "Glasgow",
    country: "Scotland",
    soldOut: false,
    cancelled: false,
    presentedBy: "No A Mean City V",
    unverifiedDate: true,
  },
  {
    _id: "show-tenement-trail-2026-10",
    date: "2026-10-10",
    venue: "Tenement Trail",
    city: "Glasgow",
    country: "Scotland",
    soldOut: false,
    cancelled: false,
  },
  {
    _id: "show-jacaranda-2026-11",
    date: "2026-11-14",
    venue: "Jacaranda",
    city: "Liverpool",
    country: "England",
    soldOut: false,
    cancelled: false,
    unverifiedDate: true,
  },
];

export const RELEASES: Release[] = [
  {
    _id: "release-he-says-she-says",
    title: "he says, she says",
    type: "single",
    releaseDate: "2026-05-28",
  },
  {
    _id: "release-jesus",
    title: "when are you coming for me jesus?",
    type: "single",
    releaseDate: "2026-02-06",
  },
  {
    _id: "release-vice",
    title: "vice",
    type: "single",
    releaseDate: "2025-10-24",
  },
];

/**
 * Real press quotes, usable as-is with attribution. This is the complete set —
 * PRODUCT.md records that no other press exists, and nothing here may be
 * invented or embellished.
 */
export const PRESS = [
  { quote: "Chaos done right", source: "Music News Monthly" },
  {
    quote: "They are going to be all over the UK, if not, the world",
    source: "It's All Indie",
  },
  {
    quote: "Equal parts vintage rock and youthful recklessness",
    source: "The Indie Scene",
  },
] as const;

/** Upcoming shows relative to `now`, soonest first. */
export function upcomingShows(now = new Date()): FixtureShow[] {
  return SHOWS.filter((s) => new Date(s.date) >= now && !s.cancelled).sort(
    (a, b) => a.date.localeCompare(b.date),
  );
}

/** Past shows relative to `now`, most recent first. */
export function pastShows(now = new Date()): FixtureShow[] {
  return SHOWS.filter((s) => new Date(s.date) < now).sort((a, b) =>
    b.date.localeCompare(a.date),
  );
}
