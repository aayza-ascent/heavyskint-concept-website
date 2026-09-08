"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Wordmark } from "@/components/ui/Wordmark";
import { Menu, Close } from "@/components/ui/Icon";

const ROUTES = [
  { href: "/shows", label: "Shows" },
  { href: "/music", label: "Music" },
  { href: "/merch", label: "Merch" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

function isActive(pathname: string | null, href: string) {
  if (!pathname) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * The navigation, with the active route passed in rather than read.
 *
 * Split this way because `usePathname` suspends during prerendering on any
 * route with a fallback param — `/merch/[handle]` — so reading it here would
 * push the whole header behind a Suspense boundary. Instead the pathname
 * arrives as a prop: `HeaderNavWithPath` reads it inside the boundary, and this
 * component renders fully interactive either way. The only thing missing from
 * the prerendered fallback is the active highlight, and the geometry is
 * identical, so nothing moves when it resolves.
 */
export function HeaderNav({ activePath }: { activePath: string | null }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    // The overlay is the page while it is up; don't let the page scroll behind.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <nav aria-label="Main" className="hidden md:block">
        <ul className="flex items-center gap-hair">
          {ROUTES.map((route) => {
            const active = isActive(activePath, route.href);
            return (
              <li key={route.href}>
                <Link
                  href={route.href}
                  aria-current={active ? "page" : undefined}
                  className={`hs-label inline-flex items-center whitespace-nowrap px-tight py-hair no-underline transition-colors duration-[120ms] ease-[steps(2,end)] ${
                    active
                      ? // The knocked-out bar, as the current-page mark.
                        "bg-bone text-ink"
                      : "text-ink-white hover:text-flash"
                  }`}
                >
                  {route.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="site-menu"
        className="hs-label flex items-center gap-tight text-ink-white transition-colors duration-[120ms] ease-[steps(2,end)] hover:text-flash md:hidden"
      >
        Menu
        <Menu className="text-[1.3em]" />
      </button>

      {/*
        Mobile: a full page, not a drawer. At this size the menu is one of the
        best chances in the whole site to look like the poster, so the items are
        display type filling the measure rather than a list of small links.
      */}
      <div
        id="site-menu"
        hidden={!open}
        className="hs-grain hs-grain-strong fixed inset-0 z-50 flex flex-col bg-ink md:hidden"
      >
        <div className="flex items-center justify-between px-gutter py-block">
          <Wordmark className="h-[1.4rem] w-auto text-ink-white" />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="hs-label flex items-center gap-tight text-ink-white hover:text-flash"
          >
            Close
            <Close className="text-[1.3em]" />
          </button>
        </div>

        <nav
          aria-label="Main"
          className="flex flex-1 flex-col justify-center px-gutter pb-void"
        >
          <ul>
            {ROUTES.map((route) => (
              <li key={route.href}>
                <Link
                  href={route.href}
                  onClick={() => setOpen(false)}
                  aria-current={
                    isActive(activePath, route.href) ? "page" : undefined
                  }
                  className={`hs-headline block py-hair no-underline ${
                    isActive(activePath, route.href)
                      ? "text-flash"
                      : "text-ink-white"
                  }`}
                >
                  {route.label.toLowerCase()}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}

/** Reads the pathname. Must be rendered inside a Suspense boundary. */
export function HeaderNavWithPath() {
  return <HeaderNav activePath={usePathname()} />;
}
