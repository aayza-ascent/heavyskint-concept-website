import type { Metadata } from "next";
import Image from "next/image";
import { readSiteSettings } from "@/lib/content";
import { PageHeading } from "@/components/site/PageHeading";
import { PosterButton } from "@/components/ui/PosterButton";
import { PRESS } from "@/lib/fixtures";
import { IMAGES } from "@/lib/images";

export const metadata: Metadata = {
  title: "About",
  description:
    "heavyskint are a five-piece from Glasgow: 90s shoegaze, grunge and alt-rock with an unfiltered intensity.",
};

const MEMBERS = [
  { name: "Jacob Hunter", role: "Vocals" },
  { name: "Jamie Kelly", role: "Guitar" },
  { name: "Sean Reilly", role: "Guitar" },
  { name: "Maddie Thomasset", role: "Bass" },
  { name: "Joel Walker", role: "Drums" },
] as const;

/**
 * About.
 *
 * This page does double duty: a listener wanting to know who the band are, and
 * a promoter deciding whether to book them. Both are served by the same
 * material — the bio, the line-up, the press — so it stays one page rather than
 * splitting into a separate press area nobody would maintain.
 *
 * The bio comes from Sanity when set. The fallback below is the band's own
 * approved text, so the page is never empty and never invented.
 */
export default async function AboutPage() {
  const settings = await readSiteSettings();

  return (
    <>
      <PageHeading title="about" />

      <section className="grid grid-cols-1 gap-void border-t border-smoke px-gutter py-void lg:grid-cols-[1fr_minmax(0,34rem)] lg:gap-chasm">
        <div>
          {settings?.bio ? (
            <div className="hs-body whitespace-pre-line text-ink-white">
              {settings.bio}
            </div>
          ) : (
            <div className="hs-body text-ink-white">
              <p>
                Since forming last year, heavyskint have wasted no time in
                establishing themselves as ones to watch. Initially a bedroom
                side project, since coming together Summer ‘25 the band have
                since sold out every show they have played to date including
                turns at iconic Glasgow venues as King Tuts and QMU, as well as
                Edinburgh Sneaky Petes. Fronted by the enigmatic Jacob Hunter,
                the raw, unpredictable nature of such performances have gained
                the band a growing following across Scotland.
              </p>
              <p className="mt-step">
                Hailing from Glasgow, heavyskint have quickly established
                themselves as a strong presence in Scottish music since their
                emergence in early 2025. To this date they have sold out every
                show they have played across the country. These raw and
                unpredictable performances have gained the band a growing
                reputation that saw them recognised as one of the country’s most
                exciting live acts at the most recent Scottish Live Music
                Awards. heavyskint&rsquo;s sound draws upon 90s shoegaze, grunge and
                alt rock coupled with a soulful tinge and an unfiltered
                intensity that marks them out as a distinct force within modern
                guitar music.
              </p>
              <p className="mt-step">
                With a line-up completed by Jamie Kelly, Joel Walker, Sean
                Reilly and Maddie Tommasset , heavyskint came together through
                the Glasgow scene, the unifying force of music overriding the
                wildly different experiences and backgrounds within the group.
                Such diversity within the group is shown in their audience, with
                a heavyskint show bringing groups of people together that would
                never otherwise exist in the same room. All ages, sexualities,
                genders and identities coming together; as an outlet for
                personal frustrations whilst also celebrating the broader
                community and vital sound of Scottish youth.
              </p>
              <p className="mt-step">
                Drawing upon influences of modern indie-rock while possessing
                the brooding, spacious vintage of Pink Floyd and the
                confrontational edge of 90’s acts such as The Verve and
                Spiritualized. Moody atmosphere, big choruses, noisy guitars,
                and high intensity. The sound of a band that sources its musical
                strength in dark places, finding therapy from respective
                struggles with addiction, sexuality, religion and grief.
              </p>
            </div>
          )}

          <h2 className="hs-label mt-void text-smoke">Line-up</h2>
          <ul className="mt-step">
            {MEMBERS.map((member) => (
              <li
                key={member.name}
                className="flex flex-wrap items-baseline justify-between gap-block border-t border-smoke py-block"
              >
                <span className="hs-title text-ink-white">{member.name}</span>
                <span className="hs-label text-smoke">{member.role}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="hs-grain relative aspect-[4/5] w-full max-w-[34rem] overflow-hidden">
          <Image
            src={IMAGES.bandGroup.src}
            alt={IMAGES.bandGroup.alt}
            fill
            sizes="(min-width: 544px) 34rem, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      <section
        aria-labelledby="press"
        className="border-t border-smoke px-gutter py-void"
      >
        <h2 id="press" className="hs-label text-smoke">
          Press
        </h2>
        <ul className="mt-step">
          {PRESS.map((item) => (
            <li key={item.source} className="border-t border-smoke py-step">
              <blockquote>
                <p className="hs-body hs-quote text-ink-white">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <footer className="hs-label mt-tight text-smoke">
                  {item.source}
                </footer>
              </blockquote>
            </li>
          ))}
        </ul>

        <div className="mt-gap flex flex-wrap items-center gap-block">
          <PosterButton href="/contact">Booking enquiries</PosterButton>
          {settings?.pressKitUrl ? (
            <PosterButton href={settings.pressKitUrl} variant="ghost" external>
              Press kit
            </PosterButton>
          ) : null}
        </div>
      </section>
    </>
  );
}
