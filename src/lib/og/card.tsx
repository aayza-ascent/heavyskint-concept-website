import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * The shared OG card.
 *
 * A link preview is the one surface where the design system is judged without
 * any of its motion, grain or scale — a 1200x630 still, usually seen at a
 * fraction of that size in a message thread. So the card is built as poster
 * furniture rather than as a shrunken web page: the wordmark, a knocked-out
 * bone bar carrying the section, and the claim set in display type. Nothing
 * else. Cropped to a thumbnail it still reads as this band.
 *
 * Everything here is baked at build time. `opengraph-image` is a Route Handler
 * that Next caches by default, and nothing below touches a request-time API, so
 * these render once rather than per share.
 */

/** The card's fixed dimensions. Re-exported by each route as `size`. */
export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

/*
 * Satori parses font data itself and accepts only ttf/otf/woff, while
 * `next/font` emits woff2 — so the card cannot reuse the site's loaded webfont
 * and needs raw files. It also honours neither `font-variation-settings` nor
 * `font-stretch`, so the display and label instances are pinned to the weights
 * and widths the tokens ask for. See assets/fonts/README.md.
 */
const FONT_DIR = join(process.cwd(), "assets/fonts");
const [displayFont, labelFont] = await Promise.all([
  readFile(join(FONT_DIR, "Archivo-Display.ttf")),
  readFile(join(FONT_DIR, "Archivo-Label.ttf")),
]);

/*
 * The traced wordmark, inlined as a data URI.
 *
 * The committed SVG paints with `fill="currentColor"` so it inherits text
 * colour in the app. Inside an <img> there is no inheriting element and
 * `currentColor` resolves to nothing, so the fill is substituted for the
 * literal token value here.
 */
const INK_WHITE = "#e2e2e1";
const wordmarkSvg = (await readFile(
  join(process.cwd(), "public/wordmark/heavyskint.svg"),
  "utf8",
)).replaceAll("currentColor", INK_WHITE);
const wordmarkSrc = `data:image/svg+xml;base64,${Buffer.from(wordmarkSvg).toString("base64")}`;

/** Intrinsic wordmark ratio, from its viewBox (1317x258). */
const WORDMARK_WIDTH = 420;
const WORDMARK_HEIGHT = Math.round(WORDMARK_WIDTH * (258 / 1317));

/* Tokens, restated as literals. Satori resolves no custom properties, and a
   stylesheet import would not reach it — mirror of src/styles/tokens.css. */
const INK = "#0f0f10";
const BONE = "#e9e6d5";
const SMOKE = "#848484";

type CardOptions = {
  /** Section name, knocked out of the bone bar. Uppercased by the renderer. */
  label: string;
  /** The claim. Set in display type, lowercase, and kept short — this is a thumbnail. */
  title: string;
};

export function ogCard({ label, title }: CardOptions) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: INK,
          padding: 72,
          fontFamily: "Archivo Display",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- Satori renders
            raw <img> only; next/image has no meaning inside ImageResponse. */}
        <img
          src={wordmarkSrc}
          alt="heavyskint."
          width={WORDMARK_WIDTH}
          height={WORDMARK_HEIGHT}
        />

        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* The hairline. Smoke, not ash — at 1.33:1 ash is invisible as a
              functional edge, and a 1px rule scaled into a thumbnail needs
              every bit of the 5.12:1 smoke carries. */}
          <div style={{ display: "flex", height: 1, backgroundColor: SMOKE }} />

          {/* The bone bar: the system's loudest gesture, rationed to one
              element. Knocked out rather than outlined, as on the handbills. */}
          <div style={{ display: "flex", marginTop: 28 }}>
            <div
              style={{
                display: "flex",
                backgroundColor: BONE,
                color: INK,
                fontFamily: "Archivo Label",
                fontSize: 24,
                letterSpacing: 24 * 0.08,
                textTransform: "uppercase",
                padding: "10px 18px 12px",
              }}
            >
              {label}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 28,
              color: INK_WHITE,
              fontSize: 104,
              lineHeight: 0.85,
              letterSpacing: 104 * -0.04,
              textTransform: "lowercase",
            }}
          >
            {title}
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        {
          name: "Archivo Display",
          data: displayFont as unknown as ArrayBuffer,
          style: "normal",
          weight: 900,
        },
        {
          name: "Archivo Label",
          data: labelFont as unknown as ArrayBuffer,
          style: "normal",
          weight: 700,
        },
      ],
    },
  );
}
