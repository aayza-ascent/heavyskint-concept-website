import { cacheTag } from "next/cache";
import { getSanityClient } from "./client";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { env } from "@/lib/env";
import type { Show, Release, GalleryImage, SiteSettings } from "./types";

const SHOW_FIELDS = /* groq */ `
  _id, date, venue, city, country, ticketUrl,
  "soldOut": coalesce(soldOut, false),
  "cancelled": coalesce(cancelled, false),
  supportActs
`;

/**
 * Upcoming shows, soonest first.
 *
 * The upcoming/past split is done in GROQ against `now()` rather than in JS,
 * so a show rolls into the past on its own without anyone republishing.
 */
export async function getUpcomingShows(): Promise<Show[]> {
  "use cache";
  cacheTag(CACHE_TAGS.shows);
  if (!env.sanity.isConfigured) return [];

  return getSanityClient().fetch<Show[]>(
    /* groq */ `*[_type == "show" && date >= now()] | order(date asc) { ${SHOW_FIELDS} }`,
  );
}

/** Past shows, most recent first. */
export async function getPastShows(): Promise<Show[]> {
  "use cache";
  cacheTag(CACHE_TAGS.shows);
  if (!env.sanity.isConfigured) return [];

  return getSanityClient().fetch<Show[]>(
    /* groq */ `*[_type == "show" && date < now()] | order(date desc) { ${SHOW_FIELDS} }`,
  );
}

/** The single next show — used by the homepage hero. */
export async function getNextShow(): Promise<Show | null> {
  "use cache";
  cacheTag(CACHE_TAGS.shows);
  if (!env.sanity.isConfigured) return null;

  return getSanityClient().fetch<Show | null>(
    /* groq */ `*[_type == "show" && date >= now() && cancelled != true] | order(date asc)[0] { ${SHOW_FIELDS} }`,
  );
}

export async function getReleases(): Promise<Release[]> {
  "use cache";
  cacheTag(CACHE_TAGS.releases);
  if (!env.sanity.isConfigured) return [];

  return getSanityClient().fetch<Release[]>(
    /* groq */ `*[_type == "release"] | order(releaseDate desc) {
      _id, title, type, cover, releaseDate, links, tracklist
    }`,
  );
}

export async function getGallery(): Promise<GalleryImage[]> {
  "use cache";
  cacheTag(CACHE_TAGS.gallery);
  if (!env.sanity.isConfigured) return [];

  return getSanityClient().fetch<GalleryImage[]>(
    /* groq */ `*[_type == "galleryImage"] | order(_createdAt desc) {
      _id, image, alt, credit
    }`,
  );
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  "use cache";
  cacheTag(CACHE_TAGS.siteSettings);
  if (!env.sanity.isConfigured) return null;

  return getSanityClient().fetch<SiteSettings | null>(
    /* groq */ `*[_type == "siteSettings"][0] {
      bio, bookingEmail, pressKitUrl, socials
    }`,
  );
}
