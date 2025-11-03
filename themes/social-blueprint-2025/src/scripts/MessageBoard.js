import React from "react";
import { ShareButton } from "./ShareButton";
import { RelatedContentCard } from "./RelatedContentCard";
import { ExploreByTheme } from "./ExploreByTheme";
import PillTag from "./PillTag";
import { Tag } from "./Tag";
import { Breadcrumbs } from "./Breadcrumbs";
import { ArrowIcon } from "../../assets/icons/arrow";
import { MessageBoardSlider } from "./MessageBoardSlider";

export default function MessageBoardPage({
  title,
  date,
  author,
  categories = [],
  contentHtml,
  featuredImage,
  relatedContent = [],
  recentPosts = [],
  trendingTopics = [],
  breadcrumbs = [],
}) {
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-AU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : "";

  return (
    <main className="bg-schemesSurface text-schemesOnSurface">
      <div className="p-6 md:p-8 lg:p-12">
        <div className="lg:max-w-[1600px] sm:max-w-[640px] md:max-w-[640px] mx-auto px-0 lg:px-16">
          <Breadcrumbs items={breadcrumbs} />
          <div className="flex flex-col md:flex-col lg:flex-row lg:gap-16">
            <div className="flex-3 min-w-0 space-y-6">
              {/* Header */}
              <header className="space-y-3">
                {/* Category chips */}
                {categories?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {categories.map((c, i) => (
                      <span
                        key={`${c}-${i}`}
                        className="px-3 py-2 rounded-lg bg-[var(--schemesSurfaceContainerHigh)] text-[var(--schemesOnSurface)] Blueprint-label-small"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}

                <h1 className="Blueprint-headline-small md:Blueprint-headline-medium lg:Blueprint-headline-large leading-tight">
                  {title}
                </h1>

                {/* Author/Date + Share */}
                <div className="flex flex-wrap items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={author?.avatar || "/no_profile.png"}
                      alt={author?.name || "Author"}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex flex-col gap-0.5">
                      <div className="lg:Blueprint-title-medium">
                        {author?.name || "Author"}
                      </div>
                      {formattedDate && (
                        <div className="Blueprint-label-large text-schemesOnSurfaceVariant">
                          {formattedDate}
                        </div>
                      )}
                    </div>
                  </div>

                  <ShareButton
                    title={title}
                    summary=""
                    url={typeof window !== "undefined" ? window.location.href : undefined}
                  />
                </div>
              </header>
              {/* Content */}
              <section
                className="space-y-6 lg:space-y-7 max-w-3xl lg:Blueprint-body-large md:Blueprint-body-medium sm:Blueprint-body-small text-schemesOnSurfaceVariant
                           break-words [&_ul]:list-disc [&_ul]:pl-5 [&_a]:underline
                           [&_img]:max-w-full [&_img]:h-auto [&_img]:block
                           [&_figure]:max-w-full [&_figure]:overflow-hidden"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />

              {/* Hero image (poster) */}
              {featuredImage && (
                <figure className="rounded-2xl overflow-hidden shadow-md">
                  <img
                    src={featuredImage}
                    alt=""
                    className="w-full h-auto object-cover"
                  />
                </figure>
              )}
              {/* Optional “Recent message board posts” */}
            </div>

            {/* SIDEBAR */}
            <aside className="w-full h-full lg:w-auto space-y-4 lg:sticky lg:top-16 flex-1 min-w-70 mt-10 lg:mt-0">
              <h2 className="Blueprint-headline-small-emphasized text-schemesOnSurfaceVariant p-2">
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
                        href={item.href || item.link}
                        description={item.description}
                      />
                    ))
                  ) : (
                    <p className="text-schemesOnSurfaceVariant">
                      No related content available.
                    </p>
                  )}
                </div>
              </div>
              <a href="/message-boards" className="">
                <div className="Blueprint-label-large underline text-schemesPrimary p-2">
                  Browse all message board
                </div>
              </a>
              {/* Trending Topics */}
              {trendingTopics?.length > 0 && (
                <div className="rounded-xl p-3">
                  <div className="Blueprint-title-small-emphasized mb-4">
                    Trending Topics
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {trendingTopics.map((t, i) =>
                      t?.link ? (
                        <a key={i} href={t.link}>
                          <Tag href={t.link} tagName={t.name} />
                        </a>
                      ) : (
                        <Tag key={i} href="#" tagName={t.name || String(t)} />
                      )
                    )}
                  </div>
                </div>
              )}
            </aside>
          </div>
          {recentPosts?.length > 0 && (
            <div className="hidden md:block pt-6 lg:pt-12">
              <div className="flex items-center gap-2 mb-8">
                <div className="Blueprint-headline-small-emphasized">
                  Recent message board posts
                </div>
                <ArrowIcon />
              </div>
              <MessageBoardSlider messageBoard={recentPosts} />
            </div>
          )}
        </div>
      </div>

      {/* Explore by Theme (same block as podcast) */}
      <div className="bg-schemesPrimaryFixed w-full">
        <div className="p-6 md:p-8 lg:p-16 flex flex-col max-w-[1600px] mx-auto gap-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="lg:Blueprint-headline-large-emphasized md:Blueprint-title-medium-emphasized Blueprint-title-small-emphasized italic">
              Explore more by
            </div>
            <PillTag label="Theme" backgroundColor="schemesPrimaryContainer" />
          </div>

          <div className="Blueprint-body-small md:Blueprint-body-medium lg:Blueprint-body-large text-schemesOnSurface mb-8 lg:mb-12 max-w-[68ch]">
            From support services to creative culture, start where you're curious.
          </div>

          <ExploreByTheme />
        </div>
      </div>
    </main>
  );
}
