import Link from "next/link";
import { Wordmark } from "@/components/ui/Wordmark";
import { ArrowUpRight } from "@/components/ui/Icon";
import { readSiteSettings } from "@/lib/content";

/**
 * Footer.
 *
 * Socials and the press kit come from Sanity so the band controls them, and
 * render as absent when unset — a fabricated Spotify URL in the footer of every
 * page is worse than no link at all.
 *
 * The mark sits large at the bottom edge, dissolving into the dither: the sheet
 * running out rather than a section ending.
 */
export async function SiteFooter() {
  const settings = await readSiteSettings();
  const socials = settings?.socials ?? [];

  return (
    <footer className="mt-chasm border-t border-smoke">
      <div className="px-gutter py-void">
        <div className="flex flex-col gap-void md:flex-row md:justify-between">
          <div>
            <h2 className="hs-label text-smoke">Bookings and press</h2>
            <p className="hs-body mt-block text-ink-white">
              For booking enquiries, press and anything else, the form reaches
              the band directly.
            </p>
            <Link
              href="/contact"
              className="hs-label mt-block inline-flex items-center whitespace-nowrap text-ink-white underline transition-colors duration-[120ms] ease-[steps(2,end)] hover:text-flash"
            >
              Get in touch
            </Link>
            {settings?.bookingEmail ? (
              <p className="hs-label mt-tight text-smoke">
                {settings.bookingEmail}
              </p>
            ) : null}
          </div>

          {socials.length > 0 ? (
            <div>
              <h2 className="hs-label text-smoke">Elsewhere</h2>
              <ul className="mt-block flex flex-col gap-tight">
                {socials.map((social) => (
                  <li key={social.url}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hs-label inline-flex items-center gap-tight text-ink-white no-underline transition-colors duration-[120ms] ease-[steps(2,end)] hover:text-flash"
                    >
                      {social.platform}
                      <ArrowUpRight className="text-[1.15em]" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {settings?.pressKitUrl ? (
            <div>
              <h2 className="hs-label text-smoke">Press kit</h2>
              <a
                href={settings.pressKitUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hs-label mt-block inline-flex items-center gap-tight text-ink-white no-underline hover:text-flash"
              >
                Download
                <ArrowUpRight className="text-[1.15em]" />
              </a>
            </div>
          ) : null}
        </div>

        {/*
          Small print. Sits as one line of poster furniture rather than a second
          nav — these are pages a visitor looks for only when they need them,
          and UK distance selling requires the shop to link them somewhere
          reachable from every page.
        */}
        <div className="mt-void flex flex-wrap items-baseline gap-x-block gap-y-tight">
          <nav aria-label="Legal" className="flex flex-wrap gap-block">
            <Link
              href="/returns"
              className="hs-meta text-smoke underline transition-colors duration-[120ms] ease-[steps(2,end)] hover:text-ink-white"
            >
              Returns
            </Link>
            <Link
              href="/privacy"
              className="hs-meta text-smoke underline transition-colors duration-[120ms] ease-[steps(2,end)] hover:text-ink-white"
            >
              Privacy
            </Link>
          </nav>

          {/*
            Photography is credited on principle: the archive is the work of
            named photographers and the site leans on it entirely.
          */}
          <p className="hs-meta text-smoke">
            Photography by Daniel Blake Visuals and others
          </p>
        </div>
      </div>

      {/* The sheet running out: the mark dissolving into the grain. */}
      <div
        aria-hidden="true"
        className="hs-grain hs-dissolve-b overflow-hidden px-gutter"
      >
        <Wordmark className="w-full text-ink-raised" />
      </div>
    </footer>
  );
}
