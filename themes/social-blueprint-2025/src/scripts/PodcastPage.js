import React, { useState, useMemo } from "react";
import { MoreInterviews } from "./MoreInterviews";
import { Tag } from "./Tag";
import { ExploreByTheme } from "./ExploreByTheme";
import PillTag from "./PillTag";
import { ShareButton } from "./ShareButton";
import { RelatedContentCard } from "./RelatedContentCard";
import { PostsSlider } from "./PostsSlider";
import { Breadcrumbs } from "./Breadcrumbs";
import { DropdownSelect } from "./DropdownSelect";

export default function PodcastPage({
  title,
  date,
  subtitle,
  videoUrl,
  content,
  tags,
  moreInterviews,
  author,
  relatedContent = [],
  breadcrumbs = [],
  interviewees = [],
}) {
  const [selectedInterviewee, setSelectedInterviewee] = useState('');

  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-AU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : "No date provided";

  // Convert interviewees to DropdownSelect format
  const intervieweeOptions = useMemo(() =>
    interviewees.map((person) => ({
      value: String(person.id),
      label: person.name,
    })),
    [interviewees]
  );

  // Handle interviewee selection - navigate to their page
  const handleIntervieweeChange = (value) => {
    setSelectedInterviewee(value);
    if (value) {
      const person = interviewees.find((p) => String(p.id) === value);
      if (person?.link) {
        window.location.href = person.link;
      }
    }
  };

  return (
    <main className="bg-schemesSurface text-schemesOnSurface">
      <div className="p-6 md:p-8 lg:p-12">
        <div className="lg:max-w-[1600px] max-w-[640px] md:max-w-[1200px] mx-auto px-0 lg:px-16">
          <Breadcrumbs items={breadcrumbs} />
          <div className="flex flex-col md:flex-col lg:flex-row lg:gap-16">
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

                <div className="flex flex-wrap items-start sm:items-center justify-between gap-4 w-full">
                  <div className="flex items-center gap-4">
                    <img
                      src={author?.avatar || "/default-avatar.png"}
                      alt={author?.name || "Podcast Author"}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex flex-col gap-1">
                      <div className="lg:Blueprint-title-medium">
                        {author?.name ? `${author.name}` : "Inteview Author"}
                      </div>
                      <div className="Blueprint-label-large text-schemesOnSurfaceVariant">
                        {formattedDate}
                      </div>
                    </div>
                  </div>

                  <ShareButton />
                </div>
              </div>

              <section className="space-y-6 lg:space-y-7 max-w-5xl lg:Blueprint-body-large md:Blueprint-body-medium sm:Blueprint-body-small text-schemesOnSurfaceVariant">
                <div
                  className="break-words
                                [&_ul]:list-disc [&_ul]:pl-5 [&_a]:underline
                                [&_img]:max-w-full [&_img]:h-auto [&_img]:block
                                [&_figure]:max-w-full [&_figure]:overflow-hidden
                                [&_p]:mb-4"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </section>

              {tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {tags.map((tag) => (
                    <Tag href={tag.url} key={tag} tagName={tag.name} />
                  ))}
                </div>
              )}
            </div>

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
                        href={item.link}
                        description={item.subtitle}
                      />
                    ))
                  ) : (
                    <p className="text-schemesOnSurfaceVariant">
                      No related content available.
                    </p>
                  )}

                  <a href="/topics" className="mt-1">
                    <div className="Blueprint-label-large underline text-schemesPrimary p-2">
                      Explore all topics
                    </div>
                  </a>

                  {interviewees.length > 0 && (
                    <div className="mt-4">
                      <DropdownSelect
                        label="Browse by Interviewee"
                        placeholder="Select an interviewee..."
                        multiple={false}
                        searchable
                        searchPlaceholder="Search interviewees..."
                        options={intervieweeOptions}
                        value={selectedInterviewee}
                        onChange={handleIntervieweeChange}
                      />
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <div className="hidden md:block md:p-8 lg:p-16 lg:max-w-[1600px] mx-auto">
        <PostsSlider events={moreInterviews} itemsToDisplay={4} />
      </div>

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