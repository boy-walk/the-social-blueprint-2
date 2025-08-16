import React from "react";
import { Tag } from "./Tag";
import { ExploreByTheme } from "./ExploreByTheme";
import PillTag from "./PillTag";
import { ShareButton } from "./ShareButton";
import { RelatedContentCard } from "./RelatedContentCard";
import { PostsSlider } from "./PostsSlider";
import { ArrowIcon } from "../../assets/icons/arrow";

export function ArticlePage({
  title,
  date,
  subtitle,
  imageUrl,
  content,
  tags = [],
  author,
  relatedContent = [],
  moreByAuthor = [],
  moreArticles = [],
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
      <div className="p-6 md:p-8 lg:p-12">
        <div className="lg:max-w-[1600px] sm:max-w-[640px] md:max-w-[640px] mx-auto px-0 lg:px-16">
          <div className="flex flex-col md:flex-col lg:flex-row lg:gap-16">
            {/* Content */}
            <div className="flex-3 min-w-0 space-y-4">
              <header className="space-y-1 lg:space-y-2">
                <h1 className="Blueprint-headline-small md:Blueprint-headline-medium lg:Blueprint-headline-large leading-tight py-3">
                  {title}
                </h1>
                {subtitle && (
                  <p className="Blueprint-title-small md:Blueprint-title-medium lg:Blueprint-title-large text-schemesOnSurfaceVariant max-w-[68ch]">
                    {subtitle}
                  </p>
                )}
              </header>

              <div className="flex flex-col gap-4 items-center justify-center">
                {imageUrl && (
                  <div className="w-full rounded-xl overflow-hidden shadow-md">
                    <img
                      src={imageUrl}
                      alt={title || ""}
                      className="w-full h-auto block"
                      loading="lazy"
                    />
                  </div>
                )}

                <div className="flex flex-wrap items-start sm:items-center justify-between gap-4 w-full">
                  <div className="flex items-center gap-4">
                    <img
                      src={author?.avatar || "/default-avatar.png"}
                      alt={author?.name || "Author"}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex flex-col gap-1">
                      <div className="Blueprint-title-medium">
                        {author?.name || "Author"}
                      </div>
                      <div className="Blueprint-label-large text-schemesOnSurfaceVariant">
                        {formattedDate}
                      </div>
                    </div>
                  </div>

                  <ShareButton
                    title={title}
                    summary={subtitle || ""}
                    url={
                      typeof window !== "undefined" ? window.location.href : undefined
                    }
                  />
                </div>
              </div>

              <section className="space-y-6 lg:space-y-7 max-w-3xl lg:Blueprint-body-large md:Blueprint-body-medium sm:Blueprint-body-small text-schemesOnSurfaceVariant">
                {content ? (
                  <div
                    className="break-words [&_ul]:list-disc [&_ul]:pl-5 [&_a]:underline"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                ) : (
                  <p className="Blueprint-body-large text-schemesOnSurfaceVariant">
                    Content coming soon.
                  </p>
                )}
              </section>

              {tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {tags.map((tag) => (
                    <Tag key={tag} tagName={tag} />
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
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
      </div>

      {/* Lower sections (use same container spacing as PodcastPage’s slider) */}
      <div className="p-6 md:p-8 lg:p-16 lg:max-w-[1600px] mx-auto">
        <section className="space-y-6 mb-12">
          <div className="flex items-center gap-2">
            <div className="Blueprint-headline-small-emphasized">
              More From {author?.name || "the Author"}
            </div>
            <ArrowIcon />
          </div>
          {moreByAuthor.length ? (
            <PostsSlider events={moreByAuthor} />
          ) : (
            <div className="Blueprint-label-large text-schemesOnSurfaceVariant">
              No more articles by this author yet.
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="Blueprint-headline-small-emphasized">More Articles</div>
            <ArrowIcon />
          </div>
          {moreArticles.length ? (
            <PostsSlider events={moreArticles} />
          ) : (
            <div className="Blueprint-label-large text-schemesOnSurfaceVariant">
              Nothing to show yet.
            </div>
          )}
        </section>
      </div>

      <div className="bg-schemesPrimaryFixed w-full">
        <div className="p-6 md:p-8 lg:p-16 flex flex-col max-w-[1600px] mx-auto gap-4">
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
