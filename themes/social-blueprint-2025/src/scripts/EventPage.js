import React from "react";
import PillTag from "./PillTag";
import { ShareButton } from "./ShareButton";
import { Tag } from "./Tag";
import { RelatedContentCard } from "./RelatedContentCard";
import { ExploreByTheme } from "./ExploreByTheme";
import { Button } from "./Button";
import { PostsSlider } from "./PostsSlider";

function fmtEventDateRange({ startISO, endISO }) {
  if (!startISO) return "";
  const start = new Date(startISO);
  const end = endISO ? new Date(endISO) : null;

  const sameDay = end && start.toDateString() === end.toDateString();
  const dateStr = new Intl.DateTimeFormat("en-AU", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(start);

  const timeFmt = new Intl.DateTimeFormat("en-AU", { hour: "numeric", minute: "2-digit" });
  const startTime = timeFmt.format(start);
  const endTime = end ? timeFmt.format(end) : null;

  return sameDay && endTime ? `${dateStr} at ${startTime}–${endTime}` : `${dateStr} at ${startTime}`;
}

export function EventPage({
  title,
  subtitle,
  startISO,
  endISO,
  locationLabel,
  venueUrl,
  isOnline = false,
  heroUrl,
  organizer = {},
  sections = [],
  tags = [],
  relatedContent = [],
  trendingTopics = [],
  moreThisWeek = [],
  calendarUrl = "#",
  bookingUrl = "#",
}) {
  const dateLine = fmtEventDateRange({ startISO, endISO });
  return (
    <main className="bg-schemesSurface text-schemesOnSurface">
      <div className="py-8 sm:py-10 lg:py-12">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <div className="flex-3 min-w-0 space-y-8 lg:space-y-10">
              {tags.length > 0 && (<div className="flex flex-wrap gap-2">
                {tags?.map((t) => <Tag key={t} tagName={t} href={`${t}`} />)}
              </div>)}
              <header className="space-y-2">
                {dateLine && <div className="Blueprint-label-large text-schemesOnSurfaceVariant">{dateLine}</div>}
                <h1 className="Blueprint-headline-large lg:Blueprint-display-small-emphasized leading-tight">
                  {title}
                </h1>
                {subtitle && (
                  <p className="Blueprint-body-large text-schemesOnSurfaceVariant max-w-[68ch]">
                    {subtitle}
                  </p>
                )}
                {(locationLabel || isOnline) && (
                  <div className="mt-2">
                    <PillTag
                      label={isOnline ? "Online" : locationLabel}
                      href={venueUrl}
                      backgroundColor="schemesPrimaryContainer"
                    />
                  </div>
                )}
              </header>

              <section className="space-y-6 lg:space-y-7 max-w-3xl">
                {sections.length > 0 ? (
                  sections.map((s, i) => (
                    <div
                      key={i}
                      className="break-words [&_ul]:list-disc [&_ul]:pl-5 [&_a]:underline"
                      dangerouslySetInnerHTML={{ __html: s.text }}
                    />
                  ))
                ) : (
                  <p className="Blueprint-body-large text-schemesOnSurfaceVariant">Details coming soon.</p>
                )}
              </section>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={organizer?.avatar ?? "/wp-content/plugins/userswp/assets/images/no_profile.png"}
                    alt={organizer?.name || "Organizer"}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="Blueprint-title-medium">{organizer?.name || "Organizer"}</div>
                </div>
                <div className="ml-auto flex flex-wrap gap-2 items-center">
                  <Button
                    label="Add to Calendar"
                    size="lg"
                    variant="tonal"
                    onClick={() => window.location.href = calendarUrl || "#"}
                  />
                  <ShareButton
                    title={title}
                    size="lg"
                    variant="tonal"
                    summary={subtitle || ""}
                    url={typeof window !== "undefined" ? window.location.href : undefined}
                  />
                  <Button
                    label="Book Now"
                    size="lg"
                    variant="filled"
                    onClick={() => window.location.href = bookingUrl}
                  />
                </div>
              </div>

              {heroUrl && (
                <div className="w-full rounded-xl overflow-hidden shadow-md">
                  <img src={heroUrl} alt="" className="w-full h-auto block max-h-175 object-cover" loading="lazy" />
                </div>
              )}

              {tags?.length > 0 && (
                <div className="pt-2">
                  <div className="Blueprint-headline-small-emphasized mb-4">Keep exploring</div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((t) => <Tag key={t} tagName={t} />)}
                  </div>
                </div>
              )}
            </div>

            <aside className="w-full h-full lg:w-auto space-y-4 lg:sticky lg:top-16 flex-1">
              <div className="space-y-2 lg:sticky lg:top-[88px]">
                <h2 className="Blueprint-headline-small-emphasized text-schemesOnSurfaceVariant p-2">
                  Related Content
                </h2>
                <div className="flex flex-col gap-2">
                  {relatedContent?.length ? (
                    relatedContent.map((item) => (
                      <RelatedContentCard key={item.id} image={item.thumbnail} title={item.title} href={item.link} />
                    ))
                  ) : (
                    <p className="text-schemesOnSurfaceVariant">No related content available.</p>
                  )}
                  <a href="/events" className="mt-1 p-2">
                    <div className="Blueprint-label-large underline text-schemesPrimary">Browse all events</div>
                  </a>
                </div>

                <div className="space-y-4 p-2">
                  <h3 className="Blueprint-title-medium-emphasized text-schemesOnSurfaceVariant">Trending Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {trendingTopics?.length ? trendingTopics.map((t) => <Tag key={t} tagName={t} />) : (
                      <div className="Blueprint-body-medium text-schemesOnSurfaceVariant">No topics yet.</div>
                    )}
                  </div>
                  <a href="/topics" className="Blueprint-label-large underline text-schemesPrimary">
                    Explore all topics
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>

        <div className="bg-palettesPrimary90/30 mt-12 lg:mt-16">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-16 py-8 lg:py-12 space-y-4">
            <div className="Blueprint-headline-small-emphasized">More on this week</div>
            {moreThisWeek?.length ? (
              <PostsSlider events={moreThisWeek} itemsToDisplay={3} />
            ) : (
              <div className="Blueprint-body-medium text-schemesOnSurfaceVariant">No events to show.</div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-schemesPrimaryFixed w-full">
        <div className="py-12 sm:py-14 lg:py-16 px-4 sm:px-8 lg:px-16 flex flex-col max-w-[1600px] mx-auto gap-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="Blueprint-headline-medium italic">Explore more by</div>
            <PillTag label="Theme" backgroundColor="schemesPrimaryContainer" />
          </div>
          <div className="Blueprint-title-large text-schemesOnSurface mb-8 lg:mb-12 max-w-[68ch]">
            From support services to creative culture, start where you're curious.
          </div>
          <ExploreByTheme />
        </div>
      </div>
    </main>
  );
}
