import type { Money } from "@/lib/shopify/types";

/**
 * Format Shopify money for a UK audience.
 * Currency comes from Shopify rather than being hardcoded, so switching the
 * store's currency doesn't silently mislabel prices as GBP.
 */
export function formatMoney(money: Money): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: money.currencyCode,
  }).format(Number(money.amount));
}

/**
 * Show dates, en-GB throughout — the audience is UK and the plan fixes the
 * locale rather than letting it follow the server.
 *
 * `showDate` is the poster voice: "SAT 10 OCT 2026", uppercased at the type
 * layer via the label role rather than here, so the string stays reusable.
 */
export function showDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Europe/London",
  })
    .format(new Date(iso))
    .replace(/,/g, "");
}

/** Long form for prose: "10 October 2026". */
export function longDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/London",
  }).format(new Date(iso));
}

/** Machine-readable value for a <time datetime> attribute. */
export function isoDate(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10);
}
