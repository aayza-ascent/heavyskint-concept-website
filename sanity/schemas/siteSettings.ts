import { defineType, defineField } from "sanity";

/**
 * Site settings. One document, edited in place — never created twice.
 *
 * Socials and the press kit render as absent when unset rather than as broken
 * links, so it is safe to fill this in gradually.
 */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({
      name: "bio",
      title: "Biography",
      type: "text",
      rows: 8,
      description:
        "The band description used on the About page and in press. Plain text.",
    }),
    defineField({
      name: "bookingEmail",
      title: "Booking email",
      type: "string",
      description:
        "Shown in the footer and used for booking enquiries. Leave empty to route everything through the contact form only.",
      validation: (Rule) =>
        Rule.regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
          name: "email",
          invert: false,
        }).warning("That doesn't look like an email address."),
    }),
    defineField({
      name: "pressKitUrl",
      title: "Press kit link",
      type: "url",
      description:
        "A folder or file promoters and press can download — photos, logo, bio.",
    }),
    defineField({
      name: "socials",
      title: "Social and streaming links",
      type: "array",
      description:
        "Add one for each place you exist. They appear in the footer in this order.",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              description: "For example: Instagram, Spotify, Bandcamp",
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
  ],
  preview: {
    prepare() {
      return { title: "Site settings" };
    },
  },
});
