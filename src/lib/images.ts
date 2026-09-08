/**
 * Shipped imagery.
 *
 * Six images, each chosen for what it does on the page rather than for being
 * the nicest picture: a near-black frame for the hero so display type can sit
 * straight in the black, a crowdsurf at a full King Tut's as evidence for the
 * sold-out streak, a backlit frame that shows the palette's flash value in
 * situ, and the three release covers.
 *
 * ⚠ TWO OPEN ITEMS BEFORE LAUNCH:
 *   1. These are downscaled from the band's Instagram, not from originals.
 *      Swap in full-resolution files from the photographers.
 *   2. Photographer permission needs confirming, and `credit` below needs to
 *      name the right person per image. The archive credits
 *      @danielblakevisuals most often but not exclusively, so the per-image
 *      attributions are marked unconfirmed rather than guessed.
 *
 * Editorial imagery moves to Sanity once the band's project exists, so they can
 * change a hero without a deploy. These stay as the shipped fallback.
 */

export type SiteImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** Photographer. `null` where the archive does not establish who shot it. */
  credit: string | null;
  creditConfirmed: boolean;
};

export const IMAGES = {
  liveMic: {
    src: "/press/live-mic.webp",
    width: 1400,
    height: 1750,
    alt: "Jacob Hunter at the microphone in near-darkness, lit from one side, wearing a camouflage cap.",
    credit: null,
    creditConfirmed: false,
  },
  liveCrowd: {
    src: "/press/live-crowd.webp",
    width: 1400,
    height: 1750,
    alt: "A packed room at King Tut's Wah Wah Hut, someone crowdsurfing over raised hands and phones.",
    credit: null,
    creditConfirmed: false,
  },
  liveBacklit: {
    src: "/press/live-backlit.webp",
    width: 1400,
    height: 1750,
    alt: "heavyskint mid-set, the singer doubled over the microphone against blown-out white stage smoke.",
    credit: null,
    creditConfirmed: false,
  },
  artworkVice: {
    src: "/press/artwork-vice.webp",
    width: 1200,
    height: 1200,
    alt: "Cover for the single vice: a dim house party, a figure at a table with their head in their hands.",
    credit: null,
    creditConfirmed: false,
  },
  artworkJesus: {
    src: "/press/artwork-jesus.webp",
    width: 1200,
    height: 1200,
    alt: "Cover for when are you coming for me jesus?: a crowd in blank white masks around one unmasked face.",
    credit: null,
    creditConfirmed: false,
  },
  artworkHeSays: {
    src: "/press/artwork-hesays.webp",
    width: 1080,
    height: 1080,
    alt: "Cover for he says, she says: a figure kneeling in front of a stacked wall of televisions showing static.",
    credit: null,
    creditConfirmed: false,
  },
} as const satisfies Record<string, SiteImage>;

/** Cover art by release title, so a release renders its own artwork. */
export const RELEASE_COVERS: Record<string, SiteImage> = {
  vice: IMAGES.artworkVice,
  "when are you coming for me jesus?": IMAGES.artworkJesus,
  "he says, she says": IMAGES.artworkHeSays,
};
