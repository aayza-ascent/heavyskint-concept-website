import { defineType, defineField } from "sanity";

/**
 * A show.
 *
 * Written for the one band member who maintains this, not for a developer.
 * Every field title is what they would call the thing out loud, every field
 * that could be got wrong carries help text, and the preview shows the date and
 * city so a long list of gigs is scannable without opening anything.
 *
 * Upcoming and past are split in GROQ against `now()`, so a gig rolls into the
 * past on its own. Nobody has to come back and move it.
 */
export const show = defineType({
  name: "show",
  title: "Show",
  type: "document",
  fields: [
    defineField({
      name: "date",
      title: "Date and time",
      type: "datetime",
      description:
        "When you go on, or door time if you don't know yet. The show moves itself into Past shows once this date passes.",
      validation: (Rule) => Rule.required(),
      options: { dateFormat: "ddd D MMM YYYY", timeFormat: "HH:mm" },
    }),
    defineField({
      name: "venue",
      title: "Venue",
      type: "string",
      description: "For example: King Tut's Wah Wah Hut",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
      description: "For example: Glasgow",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "country",
      title: "Country",
      type: "string",
      initialValue: "Scotland",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "ticketUrl",
      title: "Ticket link",
      type: "url",
      description:
        "Where people buy tickets. Leave empty if they aren't on sale yet — the site will say “On sale soon” instead of showing a dead button.",
    }),
    defineField({
      name: "supportActs",
      title: "Support acts",
      type: "array",
      of: [{ type: "string" }],
      description: "One per line. They show on the site as “+ Band name”.",
    }),
    defineField({
      name: "presentedBy",
      title: "Promoter or festival",
      type: "string",
      description:
        "Only if the show runs under someone else's name — a promoter or a festival, for example Tenement Trail.",
    }),
    defineField({
      name: "soldOut",
      title: "Sold out",
      type: "boolean",
      initialValue: false,
      description:
        "Tick this and the ticket button is replaced with a SOLD OUT flag. Worth doing straight away — it's the thing people most want to know.",
    }),
    defineField({
      name: "cancelled",
      title: "Cancelled",
      type: "boolean",
      initialValue: false,
      description:
        "Keeps the show listed but clearly marked off. Better than deleting it, so anyone holding a ticket can see what happened.",
    }),
  ],
  orderings: [
    {
      title: "Date, soonest first",
      name: "dateAsc",
      by: [{ field: "date", direction: "asc" }],
    },
    {
      title: "Date, most recent first",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      venue: "venue",
      city: "city",
      date: "date",
      soldOut: "soldOut",
      cancelled: "cancelled",
    },
    prepare({ venue, city, date, soldOut, cancelled }) {
      const when = date
        ? new Intl.DateTimeFormat("en-GB", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric",
            timeZone: "Europe/London",
          }).format(new Date(date))
        : "No date set";
      const flag = cancelled ? " — CANCELLED" : soldOut ? " — SOLD OUT" : "";
      return {
        title: `${venue ?? "Untitled show"}, ${city ?? ""}`.replace(/, $/, ""),
        subtitle: `${when}${flag}`,
      };
    },
  },
});
