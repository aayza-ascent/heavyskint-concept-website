import type { Metadata } from "next";
import { getReleases } from "@/lib/sanity/queries";
import { safe } from "@/lib/safe";
import type { Release } from "@/lib/sanity/types";

export const metadata: Metadata = {
  title: "Music",
  description: "Heavyskint releases — albums, EPs and singles.",
};

export default async function MusicPage() {
  const releases = await safe("music:releases", getReleases, [] as Release[]);

  return (
    <main>
      <h1>Music</h1>

      {releases.length > 0 ? (
        <ul>
          {releases.map((release) => (
            <li key={release._id}>
              <h2>{release.title}</h2>
              <p>
                {release.type} —{" "}
                {new Date(release.releaseDate).getFullYear()}
              </p>
              {release.links && release.links.length > 0 && (
                <ul>
                  {release.links.map((link) => (
                    <li key={link.url}>
                      <a
                        href={link.url}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {link.platform}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>Releases coming soon.</p>
      )}
    </main>
  );
}
