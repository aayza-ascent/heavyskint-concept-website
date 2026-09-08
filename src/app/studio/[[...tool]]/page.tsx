import type { Metadata, Viewport } from "next";
import { env } from "@/lib/env";
import { StudioClient } from "./StudioClient";

/**
 * Sanity Studio, embedded.
 *
 * This is the band's editing surface — "website stuff": dates, music, photos,
 * copy. Merch lives in Shopify admin instead.
 *
 * Deliberately outside the (site) route group, so it gets Studio's own chrome
 * rather than the band's header and footer wrapped around it.
 */
export const metadata: Metadata = {
  title: "Studio",
  // An editing surface has no business in search results.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  // Studio manages its own layout and needs the full viewport.
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "resizes-content",
};

export default function StudioPage() {
  if (!env.sanity.isConfigured) {
    return (
      <main
        style={{
          padding: "48px 24px",
          maxWidth: "42rem",
          fontFamily: "system-ui, sans-serif",
          lineHeight: 1.5,
        }}
      >
        <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
          Studio isn&rsquo;t connected yet
        </h1>
        <p style={{ marginBottom: "1rem" }}>
          The editing tools load once this site is pointed at a Sanity project.
          Nothing is broken — the connection details just haven&rsquo;t been
          added.
        </p>
        <p>
          Create a project at <a href="https://sanity.io/manage">sanity.io/manage</a>,
          then set <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> and{" "}
          <code>NEXT_PUBLIC_SANITY_DATASET</code>. See <code>.env.example</code>{" "}
          for the full list.
        </p>
      </main>
    );
  }

  return <StudioClient />;
}
