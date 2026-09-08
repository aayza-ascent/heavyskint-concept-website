import { PosterButton } from "@/components/ui/PosterButton";
import { ShowStatus } from "@/components/ui/Tag";
import { showDate, isoDate } from "@/lib/format";
import type { Show } from "@/lib/sanity/types";

/**
 * A show, as a listing block rather than a card.
 *
 * Transparent on the ink ground with a single smoke hairline above, so a stack
 * of these reads as a poster's listing — the McChuills bottom block — instead
 * of a set of floating panels. Cards are the lazy container here; the divider
 * does the work.
 *
 * Horizontal padding is zero on purpose: the type aligns to the page gutter
 * rather than being inset a second time inside it.
 */
export function ShowRow({ show, past = false }: { show: Show; past?: boolean }) {
  const unavailable = show.soldOut || show.cancelled;

  return (
    <li
      className={`hs-grain grid grid-cols-1 items-baseline gap-tight border-t border-smoke py-step sm:grid-cols-[10.5rem_1fr_auto] sm:gap-x-step ${
        past ? "text-smoke" : ""
      }`}
    >
      <time
        dateTime={isoDate(show.date)}
        className={`hs-label ${past ? "text-smoke" : "text-smoke"}`}
      >
        {showDate(show.date)}
      </time>

      <div className="sm:col-start-2">
        <h3
          className={`hs-title ${past ? "text-smoke" : "text-ink-white"}`}
        >
          {show.venue}
        </h3>
        <p className="hs-label mt-hair text-smoke">
          {show.city}
          {show.country && show.city !== show.country ? `, ${show.country}` : ""}
        </p>
        {show.supportActs && show.supportActs.length > 0 ? (
          // The "+" prefix is the posters' own convention for a support bill.
          <p className="hs-meta mt-tight text-smoke">
            {show.supportActs.map((act) => `+ ${act}`).join("   ")}
          </p>
        ) : null}
      </div>

      <div className="mt-tight flex items-center gap-block sm:col-start-3 sm:mt-0 sm:justify-self-end">
        <ShowStatus soldOut={show.soldOut} cancelled={show.cancelled} />
        {!past && !unavailable && show.ticketUrl ? (
          <PosterButton href={show.ticketUrl} external>
            Tickets
          </PosterButton>
        ) : null}
        {!past && !unavailable && !show.ticketUrl ? (
          <span className="hs-label text-smoke">On sale soon</span>
        ) : null}
      </div>
    </li>
  );
}

/**
 * The empty state. The band plays constantly, so an empty list is a gap between
 * announcements rather than a permanent condition — the copy should say that
 * and point somewhere useful, not apologise.
 */
export function NoShows({ children }: { children?: React.ReactNode }) {
  return (
    <div className="border-t border-smoke py-step">
      <p className="hs-title text-ink-white">nothing announced right now</p>
      <p className="hs-body mt-tight text-smoke">
        {children ?? "New dates go up here first. Follow along for the announcement."}
      </p>
    </div>
  );
}
