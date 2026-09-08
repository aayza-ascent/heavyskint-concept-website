/**
 * Seed the band's own history into a fresh Sanity dataset.
 *
 * Run once, after creating the Sanity project:
 *
 *   SANITY_API_WRITE_TOKEN=sk... node sanity/seed.ts
 *   SANITY_API_WRITE_TOKEN=sk... node sanity/seed.ts --replace
 *
 * Why this exists: the band shouldn't open a brand-new CMS to an empty list and
 * have to retype thirteen gigs they already played. The content comes from
 * `src/lib/fixtures.ts`, reconstructed from their own posters and captions.
 *
 * ⚠ The dates are read off posters, not supplied by the band. Anything the
 * fixtures flag with `unverifiedDate` had only a month to go on, and this
 * script writes those shows with a visible marker in the venue field so they
 * are impossible to miss in the Studio and cannot quietly go live wrong.
 *
 * Idempotent: documents use stable ids, so re-running updates rather than
 * duplicating. `--replace` overwrites existing documents; without it, existing
 * documents are left alone and only missing ones are created.
 */

import { createClient } from "@sanity/client";
import { SHOWS, RELEASES } from "../src/lib/fixtures.ts";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
const replace = process.argv.includes("--replace");
const dryRun = process.argv.includes("--dry-run");

if (!dryRun && !projectId) {
  console.error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID. Set it in .env.local or pass it inline.",
  );
  process.exit(1);
}
if (!dryRun && !token) {
  console.error(
    "Missing SANITY_API_WRITE_TOKEN.\n" +
      "Create one at sanity.io/manage → API → Tokens with Editor permissions.\n" +
      "It is a write credential: never commit it, and never put it in NEXT_PUBLIC_*.",
  );
  process.exit(1);
}

const client = dryRun
  ? null
  : createClient({
      projectId: projectId!,
      dataset,
      token,
      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-09-07",
      useCdn: false,
    });

const UNVERIFIED_MARKER = " [CHECK DATE]";

function showDoc(show: (typeof SHOWS)[number]) {
  return {
    _id: show._id,
    _type: "show",
    // Shows are stored as datetimes; the archive only gives us the day, so
    // 19:00 Europe/London stands in for door time until the band corrects it.
    date: `${show.date}T19:00:00.000Z`,
    venue: show.unverifiedDate ? `${show.venue}${UNVERIFIED_MARKER}` : show.venue,
    city: show.city,
    country: show.country,
    soldOut: show.soldOut,
    cancelled: show.cancelled,
    ...(show.supportActs ? { supportActs: show.supportActs } : {}),
    ...(show.presentedBy ? { presentedBy: show.presentedBy } : {}),
  };
}

function releaseDoc(release: (typeof RELEASES)[number]) {
  return {
    _id: release._id,
    _type: "release",
    title: release.title,
    type: release.type,
    releaseDate: release.releaseDate,
  };
}

async function main() {
  type Doc = { _id: string; _type: string } & Record<string, unknown>;
  const docs: Doc[] = [...SHOWS.map(showDoc), ...RELEASES.map(releaseDoc)];

  if (dryRun || !client) {
    console.log(`Dry run — ${docs.length} documents would be written:\n`);
    for (const doc of docs) console.log(JSON.stringify(doc));
    console.log(`\n${docs.filter((d) => d._type === "show").length} shows, ` +
      `${docs.filter((d) => d._type === "release").length} releases.`);
    return;
  }

  console.log(
    `Seeding ${docs.length} documents into ${projectId}/${dataset} ` +
      `(${replace ? "replacing existing" : "skipping existing"}).`,
  );

  const existing: string[] = await client.fetch(
    "*[_id in $ids]._id",
    { ids: docs.map((d) => d._id) },
  );
  const existingSet = new Set(existing);

  let created = 0;
  let replaced = 0;
  let skipped = 0;

  const tx = docs.reduce((t, doc) => {
    if (!existingSet.has(doc._id)) {
      created += 1;
      return t.create(doc);
    }
    if (replace) {
      replaced += 1;
      return t.createOrReplace(doc);
    }
    skipped += 1;
    return t;
  }, client.transaction());

  if (created + replaced > 0) await tx.commit();

  console.log(
    `Done. Created ${created}, replaced ${replaced}, left alone ${skipped}.`,
  );

  const flagged = SHOWS.filter((s) => s.unverifiedDate);
  if (flagged.length > 0) {
    console.log(
      `\n${flagged.length} shows have a reconstructed date and are marked` +
        ` "${UNVERIFIED_MARKER.trim()}" in the Studio:`,
    );
    for (const s of flagged) {
      console.log(`  · ${s.venue}, ${s.city} — recorded as ${s.date}`);
    }
    console.log(
      "Ask the band for the real dates, fix them in the Studio, then remove the marker.",
    );
  }

  console.log(
    "\nSite settings is a singleton and is not seeded — the bio, booking email\n" +
      "and social links are the band's to write, and inventing them would put\n" +
      "wrong information in the footer of every page.",
  );
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
