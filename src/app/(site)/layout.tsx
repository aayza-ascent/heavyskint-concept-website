import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

/**
 * The public site shell.
 *
 * Separate from the root layout so `/studio` — the band's editing surface —
 * gets Sanity's own chrome rather than the band's header and footer wrapped
 * around it.
 *
 * The page-level dither lives here: fixed, so its density stays constant in
 * device pixels as the viewport grows, which is what makes it read as print
 * rather than as a texture image scaling with the layout. It sits above the
 * content and below the header's z-index, and never intercepts a click.
 */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <a
        href="#main"
        className="hs-label sr-only bg-bone px-tight py-hair text-ink focus:not-sr-only focus:absolute focus:left-gutter focus:top-block focus:z-[70]"
      >
        Skip to content
      </a>

      <SiteHeader />

      <main id="main" className="flex-1">
        {children}
      </main>

      <SiteFooter />

      <div
        aria-hidden="true"
        className="hs-grain hs-grain-page pointer-events-none fixed inset-0"
      />
    </>
  );
}
