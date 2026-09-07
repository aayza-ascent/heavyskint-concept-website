import type { SanityImageSource } from "@sanity/image-url";

export type Show = {
  _id: string;
  /** ISO date string */
  date: string;
  venue: string;
  city: string;
  country: string;
  ticketUrl?: string;
  soldOut: boolean;
  cancelled: boolean;
  supportActs?: string[];
};

export type ReleaseLink = {
  platform: string;
  url: string;
};

export type Release = {
  _id: string;
  title: string;
  type: "album" | "ep" | "single";
  cover?: SanityImageSource;
  releaseDate: string;
  links?: ReleaseLink[];
  tracklist?: string[];
};

export type GalleryImage = {
  _id: string;
  image: SanityImageSource;
  alt: string;
  credit?: string;
};

export type SiteSettings = {
  bio?: string;
  bookingEmail?: string;
  pressKitUrl?: string;
  socials?: { platform: string; url: string }[];
};
