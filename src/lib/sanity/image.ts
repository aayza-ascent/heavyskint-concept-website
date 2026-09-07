import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { env } from "@/lib/env";

type Builder = ReturnType<typeof imageUrlBuilder>;

let builder: Builder | undefined;

function getBuilder(): Builder {
  if (!builder) {
    builder = imageUrlBuilder({
      projectId: env.sanity.projectId,
      dataset: env.sanity.dataset,
    });
  }
  return builder;
}

/** Build a Sanity CDN URL. Always serve from their CDN, never proxy. */
export function urlForImage(source: SanityImageSource) {
  return getBuilder().image(source).auto("format").fit("max");
}
