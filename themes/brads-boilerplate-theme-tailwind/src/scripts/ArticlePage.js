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
  tags,
  moreArticles,
  author,
  relatedContent = [],
}) {
  return (
    <main className="bg-schemesSurface text-schemesOnSurface">
      <div className="py-12 px-4 lg:px-16">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 max-w-[1600px] mx-auto sm:px-6">
          <div className="flex-1 space-y-10">
            <header className="space-y-2">
              <h1 className="Blueprint-headline-large leading-tight">{title}</h1>
              {subtitle && (
                <p className="Blueprint-body-large text-schemesOnSurfaceVariant">
                  {subtitle}
                </p>
              )}
            </header>
            <div className="flex flex-col gap-4">
              {imageUrl && (
                <div className="w-full aspect-video rounded-xl overflow-hidden shadow-md">
                  <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full"
                  ></img>
                </div>
              )}
              <div className="flex justify-between">
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
                    <div className="Blueprint-label-large">
                      {date
                        ? new Date(date).toLocaleDateString("en-AU", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                        : "No date provided"}
                    </div>
                  </div>
                </div>
                <ShareButton
                  title="Understanding Kindness in a Strained World"
                  summary="Great read from Rabbi Yaakov Glasman AM"
                  url={typeof window !== 'undefined' ? window.location.href : undefined}
                />
              </div>
            </div>
            <section className="space-y-6">
              <div
                className="prose [&_ul]:list-disc [&_ul]:pl-5 break-words prose-a:break-all"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </section>
            {tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4">
                {tags.map((tag) => (
                  <Tag key={tag} tagName={tag} />
                ))}
              </div>
            )}
          </div>
          <aside className="w-full h-full lg:w-80 space-y-4 sticky top-16">
            <h2 className="Blueprint-headline-small-emphasized text-schemesOnSurfaceVariant">
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
                <a href="/topics" className="mt-2">
                  <div className="Blueprint-label-large underline text-schemesPrimary" >
                    Explore all topics
                  </div>
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
      <div className="bg-schemesPrimaryFixed w-full">
        <div className="py-16 px-4 sm:px-8 lg:px-16 flex flex-col max-w-[1600px] mx-auto gap-4">
          <div className="flex gap-3 items-center">
            <div className="Blueprint-headline-medium italic">
              Explore more by
            </div>
            <PillTag label="Theme" backgroundColor="schemesPrimaryContainer" />
          </div>
          <div className="Blurprint-title-large mb-12 text-schemesOnSurface">
            From support services to creative culture, start where you're curious.
          </div>
          <ExploreByTheme />
        </div>
      </div>
    </main >
  );
}
