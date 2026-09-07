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
