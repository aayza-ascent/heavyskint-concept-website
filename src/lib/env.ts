/**
 * Server-only environment access.
 *
 * Throws loudly at first use rather than letting `undefined` reach an API call
 * and surface as a confusing 401 from Shopify or Sanity.
 *
 * Nothing here may be imported from a Client Component — these are secrets.
 */

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. See .env.example.`,
    );
  }
  return value;
}

function optional(name: string): string | undefined {
  return process.env[name] || undefined;
}

export const env = {
  // --- Sanity (content) ---
  sanity: {
    /**
     * Whether Sanity is wired up yet.
     *
     * "Not configured" is a real state during initial build-out, not an error.
     * Reads short-circuit on this so the site renders empty states instead of
     * throwing inside a `use cache` function, which would fail the prerender.
     */
    get isConfigured() {
      return Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
    },
    get projectId() {
      return required("NEXT_PUBLIC_SANITY_PROJECT_ID");
    },
    get dataset() {
      return process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
    },
    get apiVersion() {
      return process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-09-07";
    },
    /** Only needed for draft/preview reads. Never expose to the browser. */
    get readToken() {
      return optional("SANITY_API_READ_TOKEN");
    },
    get webhookSecret() {
      return required("SANITY_REVALIDATE_SECRET");
    },
  },

  // --- Shopify (merch) ---
  shopify: {
    /** Whether the Shopify storefront is wired up yet. See sanity.isConfigured. */
    get isConfigured() {
      return Boolean(
        process.env.SHOPIFY_STORE_DOMAIN &&
          process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      );
    },
    /** e.g. heavyskint.myshopify.com */
    get storeDomain() {
      return required("SHOPIFY_STORE_DOMAIN");
    },
    get storefrontToken() {
      return required("SHOPIFY_STOREFRONT_ACCESS_TOKEN");
    },
    get apiVersion() {
      return process.env.SHOPIFY_API_VERSION ?? "2026-07";
    },
    /** Shared secret from the Shopify webhook config, for HMAC verification. */
    get webhookSecret() {
      return required("SHOPIFY_WEBHOOK_SECRET");
    },
  },

  // --- Bandsintown (upcoming shows) ---
  bandsintown: {
    /** Whether the Bandsintown feed is wired up. See sanity.isConfigured. */
    get isConfigured() {
      return Boolean(process.env.BANDSINTOWN_APP_ID);
    },
    get appId() {
      return required("BANDSINTOWN_APP_ID");
    },
  },

  // --- Email (booking / contact) ---
  get resendApiKey() {
    return required("RESEND_API_KEY");
  },
  get bookingEmailTo() {
    return required("BOOKING_EMAIL_TO");
  },
  /**
   * Resend segment the mailing list signs people up to. Optional: until it is
   * set, the sign-up form says sign-ups aren't open yet instead of failing.
   */
  get newsletterSegmentId() {
    return optional("RESEND_NEWSLETTER_SEGMENT_ID");
  },

  get siteUrl() {
    return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  },
} as const;
