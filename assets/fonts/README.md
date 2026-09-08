# OG-card fonts

Build-time only. These are **not** served to browsers — the site's webfont is
loaded by `next/font` in `src/app/layout.tsx`. These files exist because
`ImageResponse` (Satori) needs raw font data it can parse itself, and it accepts
only `ttf`, `otf` and `woff`, while `next/font` emits `woff2`.

## Why two static instances rather than the variable font

Satori honours neither `font-variation-settings` nor `font-stretch`. The weight
and width the design system calls for therefore have to be baked into the file:

| File | wght | wdth | Matches |
|---|---|---|---|
| `Archivo-Display.ttf` | 900 | 110 | `.hs-display` (`--hs-display-weight`, `font-stretch: 110%`) |
| `Archivo-Label.ttf` | 700 | 100 | `.hs-label` (`--hs-label-weight`) |

Both are subset to printable ASCII plus the typographic marks the site uses
(`‘’“”–—…£·`), which is what keeps them at ~18KB each. `ImageResponse` has a
hard 500KB budget covering JSX, CSS, fonts and images together; the unsubset
variable font is 658KB and blows it on its own.

## Provenance

Instanced and subset from `Archivo[wdth,wght].ttf` in `google/fonts`
(`ofl/archivo`), with `fontTools.varLib.instancer`. Licensed under the SIL Open
Font License 1.1 — see `OFL.txt`. The OFL permits redistribution, so unlike the
band's own typefaces these carry no embedding risk and can live in the repo.

To rebuild, pin the axes and subset to the same character set; do not commit the
variable font.
