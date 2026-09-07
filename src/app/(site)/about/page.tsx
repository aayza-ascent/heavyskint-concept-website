import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/sanity/queries";
import { safe } from "@/lib/safe";

export const metadata: Metadata = {
  title: "About",
  description: "About Heavyskint.",
};

export default async function AboutPage() {
  const settings = await safe("about:settings", getSiteSettings, null);

  return (
    <main>
      <h1>About</h1>
      {settings?.bio ? <p>{settings.bio}</p> : <p>Biography coming soon.</p>}

      {settings?.pressKitUrl && (
        <p>
          <a href={settings.pressKitUrl} rel="noopener noreferrer" target="_blank">
            Press kit
          </a>
        </p>
      )}
    </main>
  );
}
