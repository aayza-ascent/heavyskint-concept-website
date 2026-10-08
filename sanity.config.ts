import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";

/**
 * Studio configuration, mounted in the app at /studio.
 *
 * The project id is read without throwing when unset: before the band's Sanity
 * project exists the app still has to build, and the /studio route renders a
 * setup notice instead of a broken Studio.
 */
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export default defineConfig({
  name: "heavyskint",
  title: "heavyskint",
  basePath: "/studio",
  projectId,
  dataset,
  schema: { types: schemaTypes },
  tools: (prev) => prev,
  plugins: [
    structureTool({
      /**
       * The sidebar is the band's mental model, in their words: photos, then
       * the settings. Shows and music are not here — they come from Bandsintown
       * and Apple Music, and a second place to enter either is a second place
       * for it to be wrong.
       *
       * Site settings is a singleton — one document, opened directly, with no
       * way to create a second one and wonder which is live.
       */
      structure: (S) =>
        S.list()
          .title("heavyskint")
          .items([
            S.documentTypeListItem("galleryImage").title("Photos"),
            S.divider(),
            S.listItem()
              .title("Site settings")
              .id("siteSettings")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings")
                  .title("Site settings"),
              ),
          ]),
    }),
    // Lets us run a GROQ query against live data while debugging a page.
    visionTool({ defaultApiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-09-07" }),
  ],
  document: {
    // Site settings is a singleton: never listed as a creatable type.
    newDocumentOptions: (prev) =>
      prev.filter((item) => item.templateId !== "siteSettings"),
    actions: (prev, { schemaType }) =>
      schemaType === "siteSettings"
        ? prev.filter(
            (action) =>
              !["duplicate", "delete", "unpublish"].includes(
                String(action.action),
              ),
          )
        : prev,
  },
});
