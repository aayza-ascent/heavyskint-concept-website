import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

/**
 * Advertises the releases feed to anything that looks for one.
 *
 * Declared on the site group rather than the root layout on purpose. Root
 * metadata is also resolved for /studio/[[...tool]], and `alternates` there
 * turns metadata resolution into uncached runtime data on an optional
 * catch-all route, which fails the prerender. It is the right scope regardless:
 * the Studio is the band's editor and has no business advertising an RSS feed.
 */
export const metadata: Metadata = {
  alternates: {
    types: {
      "application/rss+xml": [
        { url: absoluteUrl("/releases.xml"), title: "heavyskint. — releases" },
      ],
    },
  },
};

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
