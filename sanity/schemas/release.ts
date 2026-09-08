import { defineType, defineField } from "sanity";

/**
 * A release: single, EP or album.
 *
 * Streaming links are a free list rather than fixed Spotify/Apple/Bandcamp
 * fields, so the band can add whatever platform matters next without waiting
 * for a developer.
 */
export const release = defineType({
  name: "release",
  title: "Release",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description:
        "Exactly as you want it written on the site, including capitalisation.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      initialValue: "single",
      options: {
        list: [
          { title: "Single", value: "single" },
          { title: "EP", value: "ep" },
          { title: "Album", value: "album" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "releaseDate",
      title: "Release date",
      type: "date",
      description:
        "Future dates are fine — the site can show it as coming out soon.",
      validation: (Rule) => Rule.required(),
      options: { dateFormat: "D MMM YYYY" },
    }),
    defineField({
      name: "cover",
      title: "Cover artwork",
      type: "image",
      description:
        "Square, and as large as you have. The site crops it for you, so upload the full-size file rather than a resized one.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Describe the artwork",
          type: "string",
          description:
            "One sentence, for people using a screen reader. For example: a crowd in blank white masks around one unmasked face.",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "links",
      title: "Where to listen",
      type: "array",
      description: "Add one for each platform. They appear in this order.",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              description: "For example: Spotify, Bandcamp, Apple Music",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "url",
              title: "Link",
              type: "url",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: { select: { title: "platform", subtitle: "url" } },
        },
      ],
    }),
    defineField({
      name: "tracklist",
      title: "Tracklist",
      type: "array",
      of: [{ type: "string" }],
      description: "One track per line, in order. Leave empty for a single.",
    }),
  ],
  orderings: [
    {
      title: "Release date, newest first",
      name: "releaseDateDesc",
      by: [{ field: "releaseDate", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", type: "type", date: "releaseDate", media: "cover" },
    prepare({ title, type, date, media }) {
      const when = date
        ? new Intl.DateTimeFormat("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }).format(new Date(date))
        : "No date set";
      const label = type === "ep" ? "EP" : type ? type[0].toUpperCase() + type.slice(1) : "";
      return { title: title ?? "Untitled release", subtitle: `${label} · ${when}`, media };
    },
  },
});
