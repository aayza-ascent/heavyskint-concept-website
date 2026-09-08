"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

/**
 * The Studio, behind a client boundary.
 *
 * This has to be a Client Component. Sanity Studio is a browser application,
 * and importing it (or `sanity.config.ts`, which pulls the whole package in)
 * from the server graph resolves dependencies like `swr` to their
 * `react-server` builds, which don't export what Studio expects. The build
 * fails with "Export default doesn't exist in target module".
 */
export function StudioClient() {
  return <NextStudio config={config} />;
}
