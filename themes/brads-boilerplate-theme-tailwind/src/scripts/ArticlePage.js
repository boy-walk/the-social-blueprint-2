import React from "react";
import { Tag } from "./Tag";
import { ExploreByTheme } from "./ExploreByTheme";
import PillTag from "./PillTag";
import { ShareButton } from "./ShareButton";
import { DetailedCard } from "./DetailedCard";
import { RelatedContentCard } from "./RelatedContentCard";

export function ArticlePage({
  title,
  date,
  subtitle,
  imageUrl,
  content,
  tags = [],
  author,
  relatedContent = [],
  // new (optional) props to match the design; safe empty states
  moreFromAuthor = [],
  moreArticles = [],
  trendingTopics = [],
  thoughtLeaders = [],
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
      {/* Top section – matches PodcastPage */}
      <div className="py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_20rem] gap-8 lg:gap-12 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-16">
          {/* Content */}
          <div className="min-w-0 space-y-8 lg:space-y-10">
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

              {/* Author + Share row */}
              <div className="flex flex-wrap items-start sm:items-center justify-between gap-4">
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
                  url={typeof window !== "undefined" ? window.location.href : undefined}
                />
              </div>
            </div>

            {/* Article body */}
            <section className="space-y-6 lg:space-y-7 max-w-3xl">
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

            {/* CTA block (placeholder if you don’t have it yet) */}
            <div className="rounded-xl bg-palettesPrimary100 p-5 sm:p-6 lg:p-7 flex gap-4 items-start">
              <div className="w-12 h-12 rounded-lg bg-red-500/20 text-red-900 flex items-center justify-center shrink-0">
                {/* placeholder icon */}
                !
              </div>
              <div className="min-w-0">
                <div className="Blueprint-headline-small-emphasized mb-1">
                  Wanna hear more from us?
                </div>
                <div className="Blueprint-body-large text-schemesOnSurfaceVariant">
                  Subscribe to our newsletter
                </div>
              </div>
              <a href="/subscribe" className="ml-auto self-center">
                <div className="Blueprint-label-large underline text-schemesPrimary">
                  Subscribe
                </div>
              </a>
            </div>

            {/* Tags */}
            {tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {tags.map((tag) => (
                  <Tag key={tag} tagName={tag} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar – mirrors PodcastPage and includes red placeholders for new blocks */}
          <aside className="w-full h-full space-y-4 lg:sticky lg:top-16">
            <h2 className="Blueprint-headline-small-emphasized text-schemesOnSurfaceVariant">
              Related Content
            </h2>

            <div className="rounded-lg">
              <div className="flex flex-col gap-2">
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

            {/* New sections from design (placeholders until wired) */}
            <div className={trendingTopics.length ? "" : "bg-red-500/10 p-3 rounded"}>
              <h3 className="Blueprint-title-medium-emphasized text-schemesOnSurfaceVariant">
                Trending Topics
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {trendingTopics.length ? (
                  trendingTopics.map((t) => <Tag key={t} tagName={t} />)
                ) : (
                  <div className="Blueprint-label-large text-red-900">placeholder</div>
                )}
              </div>
            </div>

            <div className={thoughtLeaders.length ? "" : "bg-red-500/10 p-3 rounded"}>
              <h3 className="Blueprint-title-medium-emphasized text-schemesOnSurfaceVariant">
                Thought Leaders
              </h3>
              <div className="mt-2 space-y-2">
                {thoughtLeaders.length ? (
                  thoughtLeaders.map((p) => (
                    <div key={p.id || p.name} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.avatar || "/default-avatar.png"}
                          alt={p.name}
                          className="w-8 h-8 rounded-full"
                          loading="lazy"
                        />
                        <div className="Blueprint-label-large">{p.name}</div>
                      </div>
                      {p.href && (
                        <a href={p.href} className="Blueprint-label-large underline text-schemesPrimary">
                          View
                        </a>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="Blueprint-label-large text-red-900">placeholder</div>
                )}
              </div>
              <a href="/thought-leaders" className="Blueprint-label-large underline text-schemesPrimary">
                See more suggestions
              </a>
            </div>

            <div className="space-y-2">
              <h3 className="Blueprint-title-medium-emphasized text-schemesOnSurfaceVariant">
                Looking for something else?
              </h3>
              <form action="/search" method="get" className="relative">
                <input
                  type="text"
                  name="s"
                  placeholder="Search for more"
                  className="w-full rounded-lg px-3 py-2 Blueprint-body-medium text-schemesOnSurface border border-schemesOutlineVariant"
                />
              </form>
            </div>
          </aside>
        </div>

        {/* Lower sections – mirror PodcastPage structure; placeholders if empty */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-16 mt-16 lg:mt-20 space-y-12">
          <section className={moreFromAuthor.length ? "space-y-4" : "space-y-4 bg-red-500/10 p-3 rounded"}>
            <div className="flex items-center gap-2">
              <div className="Blueprint-headline-small-emphasized">
                More From {author?.name || "the Author"}
              </div>
              <div className="Blueprint-headline-small-emphasized">💬💬</div>
            </div>
            {moreFromAuthor.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {moreFromAuthor.map((it) => (
                  <DetailedCard key={it.id} {...it} />
                ))}
              </div>
            ) : (
              <div className="Blueprint-label-large text-red-900">placeholder</div>
            )}
          </section>

          <section className={moreArticles.length ? "space-y-4" : "space-y-4 bg-red-500/10 p-3 rounded"}>
            <div className="flex items-center gap-2">
              <div className="Blueprint-headline-small-emphasized">More Articles</div>
              <div className="Blueprint-headline-small-emphasized">💬💬</div>
            </div>
            {moreArticles.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {moreArticles.map((it) => (
                  <DetailedCard key={it.id} {...it} />
                ))}
              </div>
            ) : (
              <div className="Blueprint-label-large text-red-900">placeholder</div>
            )}
          </section>
        </div>
      </div>

      {/* Explore by Theme – same wrapper as PodcastPage */}
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
