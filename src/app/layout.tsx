import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";

/**
 * Archivo, variable across weight and width.
 *
 * One family carries the whole system: the posters use no monospace, no serif
 * and no script, so neither does the site. The width axis is the reason this
 * face and not another — the wordmark is notably wide, and a normal-width
 * grotesque set heavy reads too condensed beside it.
 *
 * INTERIM. Chosen because it is SIL OFL licensed and therefore carries no
 * web-embedding risk while the band's own typeface licences are unconfirmed.
 * Self-hosted by next/font, so no request leaves for Google.
 */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  // The name is always lowercase and always carries its full stop.
  title: {
    default: "heavyskint.",
    template: "%s — heavyskint.",
  },
  description:
    "heavyskint are a five-piece from Glasgow. Shows, music and merch.",
  openGraph: {
    siteName: "heavyskint.",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-GB"
      className={`${archivo.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
