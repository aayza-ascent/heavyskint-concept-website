/**
 * The knocked-out bar at its smallest.
 *
 * `SOLD OUT` and `CANCELLED` both take the bone bar, because both are the thing
 * a visitor most needs to see before they plan a night out. `LAST TICKETS`
 * takes the ghost treatment so it reads as a warning without competing with a
 * sold-out flag sitting next to it on the same page.
 */

type Tone = "bone" | "ghost";

const tones: Record<Tone, string> = {
  bone: "bg-bone text-ink",
  ghost: "border border-smoke text-ink-white",
};

export function Tag({
  children,
  tone = "bone",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={`hs-label inline-flex items-center whitespace-nowrap px-tight py-hair text-[0.6875rem] ${tones[tone]} ${className ?? ""}`}
    >
      {children}
    </span>
  );
}

/** The flag for a show, derived rather than passed, so the rules live in one place. */
export function ShowStatus({
  soldOut,
  cancelled,
}: {
  soldOut: boolean;
  cancelled: boolean;
}) {
  if (cancelled) return <Tag>Cancelled</Tag>;
  if (soldOut) return <Tag>Sold out</Tag>;
  return null;
}
