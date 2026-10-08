import Link from "next/link";
import { Wordmark } from "@/components/ui/Wordmark";
import { ArrowUpRight } from "@/components/ui/Icon";
import { readSiteSettings } from "@/lib/content";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { MERCH_ONLINE, SOCIALS } from "@/lib/site";

/**
 * Footer.
 *
 * The band's profiles are the six on their Linktree (SOCIALS in site.ts), as
 * icons on every page. The press kit comes from Sanity and renders as absent
 * when unset.
 *
 * The mark sits large at the bottom edge, dissolving into the dither: the sheet
 * running out rather than a section ending.
 */
export async function SiteFooter() {
  const settings = await readSiteSettings();

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

          <div>
            <h2 className="hs-label text-smoke">Elsewhere</h2>
            <ul className="mt-block -ml-[10px] flex flex-wrap">
              {SOCIALS.map((social) => (
                <li key={social.url}>
                  {/* 44px square: the icon is small, the target is not. */}
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`heavyskint on ${social.label}`}
                    title={social.label}
                    className="flex h-[44px] w-[44px] items-center justify-center text-ink-white transition-colors duration-[120ms] ease-[steps(2,end)] hover:text-flash focus-visible:outline-2 focus-visible:outline-flash focus-visible:outline-offset-2"
                  >
                    <BrandIcon brand={social.brand} className="text-[24px]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

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
            {MERCH_ONLINE ? (
              <Link
                href="/returns"
                className="hs-meta text-smoke underline transition-colors duration-[120ms] ease-[steps(2,end)] hover:text-ink-white"
              >
                Returns
              </Link>
            ) : null}
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
            Photography by Daniel Blake Visuals and Adam Strachan
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
