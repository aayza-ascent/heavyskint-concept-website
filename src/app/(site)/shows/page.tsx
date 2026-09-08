import type { Metadata } from "next";
import { readUpcomingShows, readPastShows } from "@/lib/content";
import { ShowRow, NoShows } from "@/components/site/ShowRow";
import { PageHeading } from "@/components/site/PageHeading";
import { isoDate } from "@/lib/format";
import type { Show } from "@/lib/sanity/types";

export const metadata: Metadata = {
  title: "Shows",
  description: "Upcoming heavyskint live dates and tickets.",
};

/** Past shows bucketed by calendar year, newest year first. */
function groupByYear(shows: Show[]): [string, Show[]][] {
  const byYear = new Map<string, Show[]>();
  for (const show of shows) {
    const year = show.date.slice(0, 4);
    byYear.set(year, [...(byYear.get(year) ?? []), show]);
  }
  return [...byYear.entries()].sort((a, b) => b[0].localeCompare(a[0]));
}

/**
 * Shows.
 *
 * The past list is not filler. The band's whole argument is the live record, so
 * a visitor scrolling a year of sold-out rooms in Glasgow, Edinburgh, London
 * and Hull is reading the proof — which is why past shows keep their sold-out
 * flags instead of being reduced to a plain list of names.
 */
export default async function ShowsPage() {
  const [upcoming, past] = await Promise.all([
    readUpcomingShows(),
    readPastShows(),
  ]);

  const soldOutPast = past.filter((s) => s.soldOut && !s.cancelled).length;

  return (
    <>
      <PageHeading title="shows" />

      <section
        aria-labelledby="upcoming"
        className="px-gutter pb-void"
      >
        <h2 id="upcoming" className="hs-label text-smoke">
          Upcoming
        </h2>
        {upcoming.length > 0 ? (
          <ul className="mt-step">
            {upcoming.map((show) => (
              <ShowRow key={show._id} show={show} />
            ))}
          </ul>
        ) : (
          <div className="mt-step">
            <NoShows />
          </div>
        )}
      </section>

      {past.length > 0 ? (
        <section
          aria-labelledby="past"
          className="border-t border-smoke px-gutter py-void"
        >
          <h2 id="past" className="hs-label text-smoke">
            Played
          </h2>
          {soldOutPast > 0 ? (
            <p className="hs-body mt-step text-ink-white">
              {soldOutPast} of these sold out.
            </p>
          ) : null}

          {/*
            Grouped by year rather than run as one flat list. Thirteen
            identical rows have no rhythm, and the world's spacing is
            deliberately bimodal — tight within a group, a lot of nothing
            between them. It also makes the argument legible: a visitor can see
            a whole year of sold-out rooms at once.
          */}
          {/* impeccable-disable-next-line monotonous-spacing -- rows are
              separated by a hairline rule and vertical padding, not margin, so
              the measured sibling gap is 0. The flush listing block is the
              system's signature (see DESIGN.md, Components > Show Row); the
              page's rhythm comes from the year groups. */}
          {groupByYear(past).map(([year, shows], index) => (
            <section
              key={year}
              aria-labelledby={`year-${year}`}
              className={index === 0 ? "mt-gap" : "mt-void"}
            >
              <h3
                id={`year-${year}`}
                className="hs-headline hs-nums text-smoke"
              >
                {year}
              </h3>
              <ul className="mt-step">
                {shows.map((show) => (
                  <ShowRow key={show._id} show={show} past />
                ))}
              </ul>
            </section>
          ))}
        </section>
      ) : null}

      {/* Rich results for shows still on sale. Only the fields we actually
          hold — no invented offers, prices or performer URLs. */}
      {upcoming.length > 0 ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              upcoming.map((show) => ({
                "@context": "https://schema.org",
                "@type": "MusicEvent",
                name: `heavyskint at ${show.venue}`,
                startDate: isoDate(show.date),
                eventStatus: show.cancelled
                  ? "https://schema.org/EventCancelled"
                  : "https://schema.org/EventScheduled",
                location: {
                  "@type": "Place",
                  name: show.venue,
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: show.city,
                    addressCountry: show.country,
                  },
                },
                performer: { "@type": "MusicGroup", name: "heavyskint" },
                ...(show.ticketUrl
                  ? {
                      offers: {
                        "@type": "Offer",
                        url: show.ticketUrl,
                        availability: show.soldOut
                          ? "https://schema.org/SoldOut"
                          : "https://schema.org/InStock",
                      },
                    }
                  : {}),
              })),
            ),
          }}
        />
      ) : null}
    </>
  );
}
