import Link from "next/link";
import { Suspense } from "react";
import { Wordmark } from "@/components/ui/Wordmark";
import { HeaderNav, HeaderNavWithPath } from "@/components/site/HeaderNav";

/**
 * Site header.
 *
 * A Server Component so the wordmark — 10KB of traced outline — stays out of
 * the client bundle. Only the navigation needs the current route, and reading
 * it suspends during prerendering on routes with fallback params, so it sits
 * behind a Suspense boundary whose fallback is the same nav without the active
 * highlight. Same geometry, so nothing shifts when it resolves.
 */
export function SiteHeader() {
  return (
    <header className="relative z-50">
      <div className="flex items-center justify-between gap-step px-gutter py-block">
        <Link
          href="/"
          aria-label="heavyskint. — home"
          className="shrink-0 text-ink-white transition-colors duration-[120ms] ease-[steps(2,end)] hover:text-flash"
        >
          {/* Sized to roughly 2× the nav label height. */}
          <Wordmark className="h-[1.4rem] w-auto sm:h-[1.6rem]" />
        </Link>

        <Suspense fallback={<HeaderNav activePath={null} />}>
          <HeaderNavWithPath />
        </Suspense>
      </div>
    </header>
  );
}
