import { galleryImage } from "./galleryImage";
import { siteSettings } from "./siteSettings";

/**
 * Every document type the Studio knows about.
 *
 * `productMeta` from the original plan is deliberately absent: nothing reads it
 * yet, and a schema no query touches is a field the band can fill in for no
 * effect. Add it when there is a product page that needs editorial copy.
 *
 * `show` and `release` are unregistered for the same reason: shows are read
 * from Bandsintown and releases from Apple Music. The show schema stays so a
 * checkout without the Bandsintown key still has Sanity shows to fall back on.
 */
export const schemaTypes = [galleryImage, siteSettings];
