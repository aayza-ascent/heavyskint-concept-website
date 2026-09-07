import type { Metadata } from "next";
import { getUpcomingShows, getPastShows } from "@/lib/sanity/queries";
import { safe } from "@/lib/safe";
import type { Show } from "@/lib/sanity/types";

export const metadata: Metadata = {
  title: "Shows",
  description: "Upcoming Heavyskint live dates and tickets.",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function ShowRow({ show }: { show: Show }) {
  return (
    <li>
      <time dateTime={show.date}>{formatDate(show.date)}</time>{" "}
      {show.venue}, {show.city}, {show.country}
      {show.cancelled ? (
        <span> — Cancelled</span>
      ) : show.soldOut ? (
        <span> — Sold out</span>
      ) : show.ticketUrl ? (
        <a href={show.ticketUrl} rel="noopener noreferrer" target="_blank">
          Tickets
        </a>
      ) : null}
    </li>
  );
}

export default async function ShowsPage() {
  const [upcoming, past] = await Promise.all([
    safe("shows:upcoming", getUpcomingShows, [] as Show[]),
    safe("shows:past", getPastShows, [] as Show[]),
  ]);

  return (
    <main>
      <h1>Shows</h1>

      <section aria-labelledby="upcoming-heading">
        <h2 id="upcoming-heading">Upcoming</h2>
        {upcoming.length > 0 ? (
          <ul>
            {upcoming.map((show) => (
              <ShowRow key={show._id} show={show} />
            ))}
          </ul>
        ) : (
          <p>No upcoming shows announced. Check back soon.</p>
        )}
      </section>

      {past.length > 0 && (
        <section aria-labelledby="past-heading">
          <h2 id="past-heading">Past</h2>
          <ul>
            {past.map((show) => (
              <ShowRow key={show._id} show={show} />
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
