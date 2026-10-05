/**
 * The wordmark, and the full lockup.
 *
 * Not type. These are the band's own vector artwork, converted path-for-path
 * from the Affinity PDFs in `assets/logos/` — `type (black).pdf` for the
 * wordmark and `full artwork (white).pdf` for the lockup (the face-down figure
 * over the wordmark). No webfont reproduces the mark's eroded, ink-bled
 * strokes, so it is never set in a typeface.
 *
 * Rendered as a CSS mask over the SVG file rather than inline: the mark keeps
 * `currentColor` — so it inherits hover and focus colour — while ~48KB of path
 * data is fetched once and cached instead of being pasted into every page's
 * HTML three times (header, mobile menu, footer). The Shopify theme does the
 * same in `snippets/wordmark.liquid`. Render it in ink-white
 * (`--hs-ink-white`), not pure white, which is what it prints as.
 */

/** Intrinsic aspect ratios, from each SVG's viewBox, for reserving space without CLS. */
export const WORDMARK_RATIO = 747.2 / 146.2;
export const LOCKUP_RATIO = 709.5 / 304.2;

type MarkProps = {
  className?: string;
  /**
   * Accessible name. Defaults to none: in the site header the mark sits inside
   * a link that already carries a label, and a second name would double up.
   */
  title?: string;
};

function Mark({
  src,
  ratio,
  className,
  title,
}: MarkProps & { src: string; ratio: number }) {
  return (
    <span
      // `inline-flex`, not `inline-block`: the `block` spacing token turns
      // `inline-block` into a 1rem inline-size that beats the width classes.
      className={`inline-flex bg-current align-middle ${className ?? ""}`}
      // Width or height alone sizes the mark; aspect-ratio supplies the other.
      style={{
        aspectRatio: ratio,
        WebkitMask: `url(${src}) no-repeat center / contain`,
        mask: `url(${src}) no-repeat center / contain`,
      }}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    />
  );
}

export function Wordmark(props: MarkProps) {
  return (
    <Mark src="/wordmark/heavyskint.svg" ratio={WORDMARK_RATIO} {...props} />
  );
}

export function Lockup(props: MarkProps) {
  return <Mark src="/wordmark/lockup.svg" ratio={LOCKUP_RATIO} {...props} />;
}
