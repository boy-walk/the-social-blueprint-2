import React from "react";
import { MoreInterviews } from "./MoreInterviews";
import { Tag } from "./Tag";
import { ExploreByTheme } from "./ExploreByTheme";
import PillTag from "./PillTag";
import { ShareButton } from "./ShareButton";
import { RelatedContentCard } from "./RelatedContentCard";

export default function PodcastPage({
  title,
  date,
  subtitle,
  videoUrl,
  sections,
  tags,
  moreInterviews,
  author,
  relatedContent = [],
}) {
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-AU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : "No date provided";

  return (
    <main className="bg-schemesSurface text-schemesOnSurface">
      <div className="py-8 sm:py-10 lg:py-12">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <div className="flex-3 min-w-0 space-y-8 lg:space-y-10">
              <header className="space-y-2">
                <h1 className="Blueprint-headline-large lg:Blueprint-display-small-emphasized leading-tight">
                  {title}
                </h1>
                {subtitle && (
                  <p className="Blueprint-body-large text-schemesOnSurfaceVariant max-w-[68ch]">
                    {subtitle}
                  </p>
                )}
              </header>

              <div className="flex flex-col gap-4">
                {videoUrl && (
                  <div className="w-full aspect-video rounded-xl overflow-hidden shadow-md">
                    <iframe
                      src={videoUrl.replace("watch?v=", "embed/")}
                      title="Podcast Video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>
                )}

                <div className="flex flex-wrap items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={author?.avatar || "/default-avatar.png"}
                      alt={author?.name || "Podcast Author"}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex flex-col gap-1">
                      <div className="Blueprint-title-medium">
                        {author?.name ? `${author.name}` : "Podcast Author"}
                      </div>
                      <div className="Blueprint-label-large text-schemesOnSurfaceVariant">
                        {formattedDate}
                      </div>
                    </div>
                  </div>

                  <ShareButton
                    title={title}
                    summary={subtitle || ""}
                    url={typeof window !== "undefined" ? window.location.href : undefined}
                  />
                </div>
              </div>

              <section className="space-y-6 lg:space-y-7 max-w-3xl">
                {sections.map((section, index) => (
                  <div
                    key={index}
                    className="break-words [&_ul]:list-disc [&_ul]:pl-5 [&_a]:underline"
                    dangerouslySetInnerHTML={{ __html: section.text }}
                  />
                ))}
              </section>

              {tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {tags.map((tag) => (
                    <Tag key={tag} tagName={tag} />
                  ))}
                </div>
              )}
            </div>

            <aside className="w-full h-full lg:w-auto space-y-4 lg:sticky lg:top-16 flex-1">
              <h2 className="Blueprint-headline-small-emphasized text-schemesOnSurfaceVariant p-4">
                Related Content
              </h2>

              <div className="rounded-lg flex items-stretch justify-center">
                <div className="flex flex-col gap-2 w-full">
                  {relatedContent.length > 0 ? (
                    relatedContent.map((item) => (
                      <RelatedContentCard
                        key={item.id}
                        image={item.thumbnail}
                        title={item.title}
                        href={item.link}
                      />
                    ))
                  ) : (
                    <p className="text-schemesOnSurfaceVariant">
                      No related content available.
                    </p>
                  )}

                  <a href="/topics" className="mt-1">
                    <div className="Blueprint-label-large underline text-schemesPrimary">
                      Explore all topics
                    </div>
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-16 mt-16 lg:mt-20">
          <MoreInterviews items={moreInterviews} />
        </div>
      </div>

      <div className="bg-schemesPrimaryFixed w-full">
        <div className="py-12 sm:py-14 lg:py-16 px-4 sm:px-8 lg:px-16 flex flex-col max-w-[1600px] mx-auto gap-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="Blueprint-headline-medium italic">
              Explore more by
            </div>
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
