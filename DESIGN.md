---
name: heavyskint
description: A photocopied black field where the live photography does the shouting.
colors:
  void: "#000000"
  ink: "#0F0F10"
  ink-raised: "#1C1C1E"
  ash: "#2A2A2A"
  smoke: "#848484"
  ink-white: "#E2E2E1"
  bone: "#E9E6D5"
  paper-shadow: "#484540"
  flash: "#FFFFFF"
typography:
  display:
    fontFamily: "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: "clamp(3rem, 13vw, 11rem)"
    fontWeight: 900
    lineHeight: 0.85
    letterSpacing: "-0.04em"
    fontVariation: "'wdth' 110"
  headline:
    fontFamily: "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: "clamp(2rem, 6vw, 4rem)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.03em"
    fontVariation: "'wdth' 105"
  title:
    fontFamily: "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Archivo, 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.08em"
rounded:
  none: "0px"
spacing:
  hair: "4px"
  tight: "8px"
  block: "16px"
  step: "24px"
  gap: "48px"
  void: "96px"
  chasm: "160px"
components:
  button-poster:
    backgroundColor: "{colors.bone}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "16px 28px"
  button-poster-hover:
    backgroundColor: "{colors.flash}"
    textColor: "{colors.void}"
    rounded: "{rounded.none}"
    padding: "16px 28px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-white}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "16px 28px"
  button-ghost-hover:
    backgroundColor: "{colors.ink-raised}"
    textColor: "{colors.flash}"
    rounded: "{rounded.none}"
    padding: "16px 28px"
  button-disabled:
    backgroundColor: "transparent"
    textColor: "{colors.smoke}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "16px 28px"
  tag-soldout:
    backgroundColor: "{colors.bone}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "4px 8px"
  card-show:
    backgroundColor: "transparent"
    textColor: "{colors.ink-white}"
    rounded: "{rounded.none}"
    padding: "24px 0"
  input-field:
    backgroundColor: "{colors.ink-raised}"
    textColor: "{colors.flash}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "14px 16px"
---

# Design System: heavyskint

## Overview

**Creative North Star: "The Photocopied Dark"**

This system was not invented. It was measured out of 157 images the band has already published, and
every value below traces to a specific file. The band's world is a near-black field — their release
artwork sits at a median luminance of 6–13 out of 255, with 67–76% of every frame below L=24 — with
one lit subject in it and nothing else. Over that field lies photocopier grain: not a smooth
gradient but a **1-bit dither**, where white shapes dissolve at their edges into scattered dots. The
wordmark, `heavyskint.`, prints in eroded off-white ink with the paper's tooth eating into the
letterforms.

The site is that surface. Black is not a dark theme here; it is the ground the photography was shot
against, and it should occupy most of every viewport the way it occupies most of every frame. Type
is set large, lowercase, and tight enough to nearly touch the edges, the way it sits on the gig
posters. Where something needs to be pressed, it is a knocked-out bone bar with black uppercase type
in it — poster furniture, cut from paper, never a rounded UI button. Nothing has a corner radius.
Nothing casts a shadow.

The restraint is not minimalism. It is a room with the lights off and a flash going off in it. The
photography — a crowd surfing at a sold-out King Tut's, a silhouette against blown-white smoke, a
kneeling figure in front of a wall of CRT static — carries all the volume. The interface exists to
get out of its way and then, at the two or three moments that matter, to hit hard.

**Key Characteristics:**

- Achromatic by measurement, not by taste: every band-authored image scores 0.000 mean saturation.
- Near-black ground (`#0F0F10`), with the true void (`#000000`) reserved for where photography bleeds away.
- Photocopier dither over the whole interface — edges dissolve into dots, they never fade.
- Lowercase display type, negative tracking, leading below 1.0; uppercase reserved for metadata.
- Zero corner radius, zero shadows, hard rectangles throughout.
- One warm note in the entire palette: bone photocopier paper (`#E9E6D5`).
- Real photography only, always credited. The band has 157 images and a working photographer.

## Colors

Achromatic, and that is a hard invariant rather than a stylistic lean — mean saturation measures
0.000 across every release artwork and live photograph in the archive. The single warm value in the
system is the photocopier paper of the McChuills poster, and it earns its place by being the only
one.

### Primary

- **Ink** (`#0F0F10`): The page ground, measured from the darkest 1% of the London poster. Not pure
  black — it carries a faint warmth that keeps a full-bleed page from looking like a switched-off
  screen. Every surface starts here.
- **Bone** (`#E9E6D5`): Photocopier paper, measured from the McChuills handbill. The system's only
  warm value and its loudest gesture. Used for knocked-out label bars, primary buttons, and the
  rare full paper-ground surface. Ink on bone reads at 15.28:1.

### Neutral

- **Void** (`#000000`): True black, measured as the floor of every release artwork. Reserved for
  where a photograph bleeds to nothing and for the deepest edge of a dither dissolve. Not a
  general-purpose background — using it as the page ground flattens the tonal layering.
- **Ink Raised** (`#1C1C1E`): One tonal step up from the ground, measured as the London poster's
  median. Cards, input fields, and hovered rows. This is how the system builds depth, since it has
  no shadows.
- **Ash** (`#2A2A2A`): Tonal separation only. Measured as the median of the King Tut's poster and
  the SWG3 live frame. See the Ash Is Not A Border Rule below — at 1.33:1 against the ground it is
  invisible as a functional edge.
- **Smoke** (`#848484`): Secondary text, functional dividers, and disabled states. Measured from
  the midtones of the awards-night photograph. Reads 5.12:1 on ink and 4.55:1 on ink-raised — AA at
  body size, and the darkest value in the system that a user can actually be asked to perceive.
- **Ink White** (`#E2E2E1`): The off-white the wordmark genuinely prints as on the posters, measured
  from the brightest 1% of the London poster. Default text colour, at 14.78:1. Their white is not
  pure white, and using pure white for body copy loses the printed quality.
- **Paper Shadow** (`#484540`): The warm mid-grey of the photocopier sheet, measured as the
  McChuills median. Secondary text *on bone surfaces* (7.61:1). Never used on the dark ground.
- **Flash** (`#FFFFFF`): Pure white, measured as the genuine blown highlight of the live
  photography. Reserved for maximum emphasis — a hovered primary action, a live-now indicator, the
  one number on a page that has to be read first. It is the brightest thing the system owns and
  should appear about as often as a camera flash does.

### Named Rules

**The Zero Chroma Rule.** Mean saturation across all band-authored imagery measures 0.000. There is
no accent colour, no hue-based state colour, and no coloured link. A red error message, a green
success tick, or a blue focus ring is a defect in this system, not an accessibility affordance —
carry state in weight, luminance, dither density, and the bone bar instead. The only permitted
warmth is bone (`#E9E6D5`) and paper shadow (`#484540`), and both come from paper, not from ink.

**The Ash Is Not A Border Rule.** Ash (`#2A2A2A`) sits at 1.33:1 against the ground — well under the
3:1 needed for a perceivable non-text edge. It is a tonal-layering value only. Any border, divider,
or outline a user must actually see is drawn in smoke (`#848484`, 5.12:1). Getting this backwards
produces a page that looks correct on a design monitor and has invisible structure on a phone in
daylight, which is exactly where the primary visitor is.

**The Flash Rationing Rule.** Pure white (`#FFFFFF`) appears on no more than one element per
viewport. Everything else that reads as white is ink white (`#E2E2E1`). The gap between the two is
small enough to feel like a printing artefact and large enough to establish a top of the hierarchy.

## Typography

**Display Font:** Archivo Variable (`wght` 100–900, `wdth` 62–125), with `'Helvetica Neue',
Helvetica, Arial, sans-serif`
**Body Font:** Archivo Variable — the same family throughout
**Wordmark:** `heavyskint.` ships as a traced SVG asset, not as text in any typeface

**Character:** A heavy grotesque with a large x-height, short ascenders, and squarish wide bowls,
tracked negative until the letters nearly collide — matched to the wordmark on the posters, where
`sk` and `int` almost fuse. Archivo's width axis is what makes the match work: the wordmark is
notably wide, and a normal-width grotesque set heavy reads too condensed against it. One family
carries the whole system. The posters use no monospace, no serif, and no script beyond a
hand-marker support-act credit, so the system has none either.

### Hierarchy

- **Display** (900, `clamp(3rem, 13vw, 11rem)`, leading 0.85, tracking -0.04em, `wdth` 110):
  Lowercase. Page-defining statements only — a venue name, a city, a release title. Scaled until it
  nearly touches both edges of its measure, per the rule below.
- **Headline** (800, `clamp(2rem, 6vw, 4rem)`, leading 0.92, tracking -0.03em, `wdth` 105):
  Lowercase. Section openings and show titles.
- **Title** (700, `clamp(1.25rem, 2.5vw, 1.75rem)`, leading 1.05, tracking -0.015em): Venue and
  product names in lists, where a display size would break the scan.
- **Body** (400, `1.0625rem`, leading 1.5): Bio, release notes, product descriptions, policy copy.
  Hold the measure to 62–70ch. This is the only place in the system with generous leading, and it
  is deliberate: everything else is compressed, so reading copy should feel like the room's one
  quiet surface.
- **Label** (700, `0.75rem`, tracking 0.08em, uppercase): Dates, ticket states, sizes, prices,
  photo credits, button text. This is the poster's metadata voice — `FREE ENTRY / 31ST JULY 2026`
  set in stacked lines with leading at 1.0.

### Named Rules

**The Lowercase Rule.** The band's name is always `heavyskint.`, lowercase, carrying its terminal
full stop — including sentence-initial, in the `<title>` tag, and in navigation. Display and
headline type is lowercase too. Uppercase exists in exactly one place: the label role, for metadata.
A lowercase label or an uppercase headline both break the system.

**The Fill The Measure Rule.** Display type is sized until it nearly touches both edges of its
container, the way the wordmark spans the full width of every poster. A display line sitting at 60%
of its available width with comfortable margins is the single fastest way to make this world look
like a generic dark template. If the text is short, the type gets bigger; it does not get centred in
white space.

**The Sub-Unity Leading Rule.** Multi-line display and headline type sets at leading below 1.0
(0.85 display, 0.92 headline) so the lines lock into a single block, as the stacked metadata does on
the London poster. Body copy is the exception at 1.5.

## Layout

The spatial model is **the poster frame**: a full-bleed field with content anchored hard into its
corners, not a centred column floating in a container. The London poster puts the wordmark top-left
and the venue block bottom-left, with the entire middle given to the image; the Edinburgh poster
centres the wordmark at the top and the date block at the bottom, with the photograph filling
everything between. Both leave the middle to the photography and push the words to the edges.

Page edge margin is 6–7% of viewport width on the posters (the wordmark begins ~90px into a 1350px
sheet), and the site holds that: a tight gutter, not a comfortable one. Reading copy is the only
content that gets a narrow measure; everything else runs to the gutters.

The rhythm is bimodal, which is the whole character of the spacing scale. Related information packs
tight — `tight` (8px) and `block` (16px) between a date and its venue, leading under 1.0 inside a
type block — and then unrelated blocks are separated by a lot of nothing: `void` (96px) between
sections, `chasm` (160px) where a page changes subject. There is no medium. Even spacing throughout
would read as a web page; the tight-then-empty alternation is what reads as a poster.

Source imagery is 4:5 (1350×1687, 1440×1800) for posters and press shots and 1:1 for release
artwork and some live frames. Honour those ratios rather than cropping to 16:9 — the vertical frame
is part of the world, and it is also the shape a phone wants.

Responsive behaviour: the layout is single-column and phone-first by default, since the primary
visitor arrives cold on a phone. Display type scales on viewport width (`13vw` at the display role),
so the fill-the-measure property holds at every size without breakpoint-specific sizing. Grain
density stays fixed in device pixels as the viewport grows — scaling the noise with the layout makes
it read as a texture image rather than as print.

## Elevation & Depth

**This system has no shadows.** Not "subtle shadows" — none. Nothing in 157 images casts one, and a
`box-shadow` would announce a rendered UI in a world built out of ink on a surface.

Depth comes from three real mechanisms instead:

1. **Tonal layering.** `void` (`#000000`) → `ink` (`#0F0F10`) → `ink-raised` (`#1C1C1E`) →
   `ash` (`#2A2A2A`). Four steps, all achromatic, each barely separated from the next. A card is
   ink-raised on an ink ground; a hovered row lifts one step. The steps are close enough that
   layering reads as varying ink density rather than as stacked panels.
2. **Grain density.** Noise is not uniform. Heavier dither reads as further back; a cleaner surface
   reads as nearer and more important. This is the primary depth cue in the system and it is what
   replaces shadow.
3. **The dissolve.** Where a surface or an image ends, it breaks into scattered 1-bit dots rather
   than terminating on a clean line — the property measured at native resolution in the London
   poster, where the white window panes disintegrate into stochastic speckle.

### Named Rules

**The No Shadow Rule.** Zero `box-shadow`, zero `filter: drop-shadow`, zero `text-shadow` anywhere
in the system. If an element needs to separate from its ground, move it one tonal step, change its
grain density, or put a bone bar behind it.

**The Grain Is The Interface Rule.** The dither sits over the entire page, not only over
photographs — ground, panel edges, and the transitions between sections. It is static, never
animated. The audit test: screenshot any 200×200px region of any page at any scroll position and it
should contain visible noise. A clean flat black region is a defect.

## Shapes

Hard rectangles, universally. Corner radius is `0px` everywhere — buttons, cards, inputs, images,
tags, the lot. The posters are cut sheets and knocked-out bars; there is not one rounded corner in
the archive, and a single `border-radius: 4px` reads as a different brand.

The recurring form is **the knocked-out bar**: a solid rectangle of bone with black uppercase label
type inside it, sometimes rotated a degree or two off true and sometimes with its edge torn, as on
the King Tut's poster where the wordmark, `king tuts.`, and `10th jan 2026.` each sit in their own
white bar. This is the system's signature silhouette and it does the work a rounded pill button
would do elsewhere.

Images are hard-edged rectangles at 4:5 or 1:1, threshold-crushed where they function as graphics
and left in full tonal range where they function as photographs. Borders, where they exist at all,
are 1px `smoke` hairlines — never a heavier rule, never a double rule.

### Named Rules

**The Zero Radius Rule.** `border-radius: 0` on every element without exception, including avatars,
image masks, and form controls. Not a default to be overridden per component — an invariant.

**The Dissolve Rule.** Edges break into dither, they never fade in a gradient. A linear-gradient
fade to transparent is the wrong mechanic in this world; the correct one is a threshold mask over
noise, so the boundary scatters into dots the way the photocopy does.

## Components

Poster furniture, throughout. These are cut paper and stamped ink, not interface chrome.

### Buttons

- **Shape:** Hard rectangle, no radius (`0px`). Label typography — uppercase, 700, tracking 0.08em.
- **Primary (`button-poster`):** A knocked-out bone bar (`#E9E6D5`) with ink text (`#0F0F10`),
  padding `16px 28px`. Reads at 15.28:1. This is the "buy", "get tickets", "add to bag" action.
- **Hover / Focus:** Ground goes to flash (`#FFFFFF`) and text to void (`#000000`) — the bar appears
  to catch the light. `focus-visible` draws a 2px flash outline at 2px offset; there is no coloured
  focus ring in this system, per the Zero Chroma Rule. Transition 120ms, and hard-cut rather than
  eased — nothing in this world has a soft ease.
- **Secondary (`button-ghost`):** Transparent ground, ink-white text (`#E2E2E1`), 1px smoke hairline
  (`#848484`). Hover fills to ink-raised (`#1C1C1E`) with flash text.
- **Disabled (`button-disabled`):** Transparent, smoke text (`#848484`), smoke hairline, no hover
  response. Used for a sold-out show or an out-of-stock size — states this band hits often, so they
  need to look deliberate rather than broken.

### Tags

- **Style:** `tag-soldout` — a small bone bar with ink uppercase label type, padding `4px 8px`, no
  radius. The knocked-out bar at its smallest.
- **State:** `SOLD OUT` and `CANCELLED` both take the bone bar, since both are information the
  visitor most needs to see. `LAST TICKETS` takes the ghost treatment — a smoke hairline with
  ink-white text — so it reads as a warning without competing with a sold-out flag on the same page.

### Cards / Containers

- **Corner Style:** `0px`.
- **Background:** Transparent by default on the ink ground (`card-show`), with a 1px smoke hairline
  as the top divider only — a stacked list of shows reads as a poster's listing block, not as a set
  of floating panels. `ink-raised` (`#1C1C1E`) is used only where a card genuinely needs to lift,
  such as a merch item in a grid.
- **Shadow Strategy:** None. See Elevation & Depth.
- **Border:** 1px smoke hairline where a divider is needed. Never ash.
- **Internal Padding:** `step` (24px) vertical, and zero horizontal on list rows so type aligns to
  the page gutter rather than being inset twice.

### Inputs / Fields

- **Style:** `ink-raised` (`#1C1C1E`) ground, flash text (`#FFFFFF`), 1px smoke hairline, no radius,
  padding `14px 16px`. Labels sit above the field in label typography, never as a placeholder — the
  contact form is a booking route for promoters and needs to survive being half-filled.
- **Focus:** Hairline goes to flash (`#FFFFFF`) and thickens to 2px. No glow, no colour shift.
- **Error:** Message in ink-white body type beneath the field, prefixed with a bone bar containing
  `ERROR` in label type. No red — per the Zero Chroma Rule, the bar carries the alarm.
- **Disabled:** Ink ground, smoke text, smoke hairline.

### Navigation

- **Style:** Label typography, uppercase, tracking 0.08em, ink-white on ink, spaced along the top
  gutter. The traced wordmark SVG sits at the left, sized to roughly 2× the nav label height.
- **States:** Default ink-white (`#E2E2E1`); hover goes flash (`#FFFFFF`) with no underline; the
  active route gets a bone bar behind it with ink text — the knocked-out bar again, doing duty as
  the current-page indicator.
- **Mobile:** Full-screen ink overlay with display-role lowercase type as the menu items, set to
  fill the measure. Not a slide-in drawer with a list of small links — at this scale the menu is a
  page, and it is one of the best chances in the whole site to look like the poster.

### The Wordmark

Not type. `heavyskint.` ships as a traced SVG asset, because the mark's character is its erosion:
photocopied, ink-bled, with the paper's tooth biting into the strokes and the terminal full stop
rendered as a fat, slightly irregular square. No webfont reproduces that, and setting the name in
Archivo Black instead produces something legibly similar and completely dead. Rendered in ink white
(`#E2E2E1`) rather than pure white, at 100% width of its container in hero contexts.

Two constraints carry over from PRODUCT.md and are not yet resolved: the band's true vector logo
with lockups and clear-space rules has not been supplied, and the trace is an interim derived from a
raster poster. The Archivo pairing is likewise interim — chosen because it is SIL OFL licensed and
therefore carries no web-embedding risk while the band's own typeface licences remain unconfirmed.

## Do's and Don'ts

### Do:

- **Do** let black hold the majority of every viewport. Their artwork is 67–76% below L=24; a
  viewport that is mostly content is off-world.
- **Do** put the dither over everything, statically. The audit test: any 200×200px region of any
  page contains visible noise.
- **Do** set the band's name as `heavyskint.` — lowercase, with the full stop — everywhere,
  including the `<title>` tag and navigation.
- **Do** size display type until it nearly touches both edges of its measure. Short text gets
  bigger type, not more margin.
- **Do** draw every functional border in smoke (`#848484`) at 1px, and keep ash (`#2A2A2A`) for
  tonal layering only.
- **Do** use the knocked-out bone bar for the things that matter most: primary actions, sold-out
  flags, the active nav item.
- **Do** honour 4:5 and 1:1 image ratios, and credit the photographer on every image
  (`@danielblakevisuals` and others appear throughout the archive).
- **Do** hold reading copy to 62–70ch at leading 1.5 — the one relaxed surface in a compressed
  system.

### Don't:

- **Don't** introduce any hue. Measured saturation across all band-authored imagery is 0.000, so a
  red error, a green success state, or a blue link is a defect. State lives in weight, luminance,
  grain density, and the bone bar.
- **Don't** apply a corner radius to anything, including images, avatars, and form controls.
- **Don't** use `box-shadow`, `drop-shadow`, or `text-shadow`. Depth is tonal layering, grain
  density, and the dissolve.
- **Don't** fade an edge with a linear gradient. Edges dissolve into scattered dots.
- **Don't** animate the grain. The texture is a print artefact, and moving it turns a photocopy into
  a screensaver.
- **Don't** use `#000000` as the page ground. The ground is ink (`#0F0F10`); the void is for where
  photography bleeds away.
- **Don't** use pure white (`#FFFFFF`) for body copy. Their printed white is ink white (`#E2E2E1`);
  flash is rationed to one element per viewport.
- **Don't** set the wordmark in a typeface. It is a traced SVG, and its erosion is the point.
- **Don't** treat promoter artwork as brand authority. The No A Mean City coral-and-blue, the
  Tenement Trail green, and the Slay Sessions oxblood belong to those promoters, not to this band.
- **Don't** use stock or AI-generated imagery. There are 157 real photographs and a working
  photographer; substituting either would break the one thing this band's site has going for it.
