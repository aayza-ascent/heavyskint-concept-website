import { defineType, defineField } from "sanity";

/**
 * A photograph for the gallery.
 *
 * `alt` and `credit` are both required-by-intent: the site leans entirely on
 * other people's photography, so crediting it is not optional, and a gallery
 * of undescribed images is unusable with a screen reader.
 */
export const galleryImage = defineType({
  name: "galleryImage",
  title: "Photo",
  type: "document",
  fields: [
    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      description:
        "Upload the full-size file. The site resizes and crops it as needed.",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Describe the photo",
      type: "string",
      description:
        "One sentence, for people using a screen reader. For example: a packed room at King Tut's, someone crowdsurfing over raised hands.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "credit",
      title: "Photographer",
      type: "string",
      description:
        "Who took it. Shown on the site next to the photo — always fill this in if you know it.",
    }),
  ],
  preview: {
    select: { title: "alt", subtitle: "credit", media: "image" },
    prepare({ title, subtitle, media }) {
      return {
        title: title ?? "Undescribed photo",
        subtitle: subtitle ? `Photo: ${subtitle}` : "No photographer credited",
        media,
      };
    },
  },
});
