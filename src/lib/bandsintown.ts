import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { CACHE_TAGS } from "@/lib/cache-tags";
import { env } from "@/lib/env";
import type { Show } from "@/lib/sanity/types";

/**
 * Upcoming shows from Bandsintown.
 *
 * The band already lists every date on Bandsintown, so that is where upcoming
 * shows are read from — one place to add a gig, and the site follows. The past
 * archive stays in Sanity, which carries the sold-out record reconstructed from
 * posters that Bandsintown does not hold.
 *
 * Bandsintown has no webhooks, so the read is cached for an hour and refreshed
 * in the background. A new date is on the site within the hour, no deploy.
 */
const ARTIST = "id_15594545";
const BAND_NAME = "heavyskint";

type BandsintownEvent = {
  id: string;
  url: string;
  /** Venue-local wall time with no offset, e.g. "2026-10-10T13:00:00". */
  datetime: string;
  title: string;
  venue: { name: string; city: string; country: string };
  lineup: string[];
  offers: { type: string; url: string; status: string }[];
  sold_out?: boolean;
};

/**
 * Bandsintown's datetime is local to the venue and carries no offset, so only
 * the calendar date is kept. Parsing the full string would read it in the
 * server's zone and could tip a late set onto the next day once formatted for
 * Europe/London. The site only shows the date anyway.
 */
function trigger(eventUrl: string, action: "rsvp_going" | "notify_me") {
  const url = new URL(eventUrl);
  url.searchParams.set("trigger", action);
  return url.toString();
}

function toShow(event: BandsintownEvent): Show {
  const tickets = event.offers.find((o) => o.type === "Tickets");
  const title = event.title.trim();

  return {
    _id: `bandsintown-${event.id}`,
    date: event.datetime.slice(0, 10),
    venue: event.venue.name,
    city: event.venue.city,
    country: event.venue.country,
    ticketUrl: tickets?.url,
    // Bandsintown's own calls to action. With no ticket link yet, "Notify me"
    // stands in for the button, so the fan hears the moment tickets go on sale.
    rsvpUrl: trigger(event.url, "rsvp_going"),
    notifyUrl: tickets ? undefined : trigger(event.url, "notify_me"),
    soldOut: Boolean(event.sold_out) || tickets?.status === "sold out",
    // Bandsintown drops a cancelled date from the feed rather than flagging it.
    cancelled: false,
    supportActs: event.lineup.filter(
      (act) => act.toLowerCase() !== BAND_NAME,
    ),
    // Festivals put their name in the title, and often in the venue name too.
    presentedBy: title && title !== event.venue.name ? title : undefined,
  };
}

/** Upcoming shows, soonest first. */
export async function getBandsintownUpcomingShows(): Promise<Show[]> {
  "use cache";
  cacheTag(CACHE_TAGS.shows);
  cacheLife("hours");
  if (!env.bandsintown.isConfigured) return [];

  const url = new URL(`https://rest.bandsintown.com/artists/${ARTIST}/events`);
  url.searchParams.set("app_id", env.bandsintown.appId);
  url.searchParams.set("date", "upcoming");

  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) {
    throw new Error(`Bandsintown responded ${response.status}`);
  }

  // An unknown artist or bad key comes back 200 with an object, not an array.
  const events: unknown = await response.json();
  if (!Array.isArray(events)) {
    throw new Error(`Bandsintown returned ${JSON.stringify(events)}`);
  }

  return (events as BandsintownEvent[])
    .map(toShow)
    .sort((a, b) => a.date.localeCompare(b.date));
}
