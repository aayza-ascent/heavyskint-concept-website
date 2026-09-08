/**
 * The top of an interior page.
 *
 * Display type filling the measure, sitting straight on the ink ground with the
 * page dither over it — the poster's top band. No eyebrow above the heading:
 * the heading carries its own weight.
 */
export function PageHeading({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="hs-grain px-gutter pb-gap pt-void">
      <h1 className="hs-display text-ink-white">{title}</h1>
      {children ? (
        <div className="mt-step hs-body text-smoke">{children}</div>
      ) : null}
    </div>
  );
}
