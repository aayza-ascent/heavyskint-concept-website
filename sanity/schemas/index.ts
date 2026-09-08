import { show } from "./show";
import { release } from "./release";
import { galleryImage } from "./galleryImage";
import { siteSettings } from "./siteSettings";

/**
 * Every document type the Studio knows about.
 *
 * `productMeta` from the original plan is deliberately absent: nothing reads it
 * yet, and a schema no query touches is a field the band can fill in for no
 * effect. Add it when there is a product page that needs editorial copy.
 */
export const schemaTypes = [show, release, galleryImage, siteSettings];
