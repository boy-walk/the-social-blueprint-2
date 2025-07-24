import React, { useState, useMemo } from "react";
import { ContentCard } from "./ContentCard";
import { Card } from "./Card";
import { ArrowIcon } from "../../assets/icons/arrow";
import { DetailedCard } from "./DetailedCard";
import { ExploreByTheme } from "./ExploreByTheme";
import PillTag from "./PillTag";
import { CellTowerIcon, MailboxIcon, CalendarDotIcon, TrendUpIcon, StarIcon, CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { MessageBoardSlider } from "./MessageBoardSlider";
import { NewsletterBanner } from "./NewsletterBanner";
import { EventsSlider } from "./EventsSlider";
import { SimpleCard } from "./SimpleCard";

export function CommunityHubPage({ featured, messageBoard, events, browseAll }) {
  return (
    <div>
      <div className="flex px-12 h-16 py-3 items-center bg-schemesPrimaryFixed Blueprint-label-large text-schemesLightPrimary">
        Breadcrumb placeholder
      </div>
      <div className="bg-schemesPrimaryFixed py-8 px-4 sm:px-8 lg:px-16">
        <div className="flex pb-4 justify-between items-center">
          <div className="flex flex-col gap-2">
            <h1 className="Blueprint-display-small-emphasized text-schemesOnSurface mb-3">
              Community Connection
            </h1>
            <p className="text-schemesOnPrimaryFixedVariant Blueprint-title-large max-w-xl">
              Stay informed and connected. Find community jobs, volunteer opportunities,
              local notices, and informal support through our active message boards and groups.
            </p>
          </div>
          <div className="border border-black p-2 h-45 w-65 border-dotted">

          </div>
        </div>
        {/* Quick Links */}
        <div className="pt-4">
          <h2 className="Blueprint-headline-medium text-schemesOnSurface mb-4 mt-4">Quick Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mt-6 min-h-[10rem]">
            <Card>
              <div className="flex flex-col gap-2 h-full justify-between items-start p-4 w-full">
                <div className="bg-schemesPrimaryFixed rounded-[12px] p-1" >
                  <MailboxIcon size={22} />
                </div>
                <div className="Blueprint-title-medium">
                  Community message board
                </div>

              </div>
            </Card>
            <Card>
              <div className="flex flex-col gap-2 h-full justify-between items-start p-4 w-full">
                <div className="bg-schemesPrimaryFixed rounded-[12px] p-1" >
                  <CellTowerIcon size={22} />
                </div>
                <div className="Blueprint-title-medium">
                  Stories and interviews
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex flex-col gap-2 h-full justify-between items-start p-4 w-full">
                <div className="bg-schemesPrimaryFixed rounded-[12px] p-1" >
                  <CalendarDotIcon size={22} />
                </div>
                <div className="Blueprint-title-medium">
                  Upcoming community events
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex flex-col gap-2 h-full justify-between items-start p-4 w-full">
                <div className="bg-schemesPrimaryFixed rounded-[12px] p-1" >
                  <TrendUpIcon size={22} />
                </div>
                <div className="Blueprint-title-medium">
                  Submit your own story
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex flex-col gap-2 h-full justify-between items-start p-4 w-full">
                <div className="bg-schemesPrimaryFixed rounded-[12px] p-1" >
                  <StarIcon size={22} />
                </div>
                <div className="Blueprint-title-medium">
                  Nominate someone
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="py-16 px-4 sm:px-8 lg:px-16">
        <h2 className="Blueprint-headline-medium text-schemesOnSurface mb-6">
          Featured in Community
        </h2>

        <div className="flex flex-col lg:flex-row gap-3 lg:gap-3 mx-auto w-full">
          {/* Left column - hero */}
          {featured[0] && (
            <div className="flex-1 h-full">
              <ContentCard
                image={featured[0].thumbnail}
                type={featured[0].post_type}
                badge={
                  featured[0].post_type.toLowerCase() === "podcast"
                    ? "Podcast"
                    : featured[0].post_type.toLowerCase() === "blog"
                      ? "Blog"
                      : featured[0].post_type.toLowerCase() === "event"
                        ? "Event"
                        : featured[0].post_type.toLowerCase() === "article" ?
                          "Article"
                          : null
                }
                href={featured[0].permalink}
                fullHeight
                fullWidth
              />
            </div>
          )}

          {/* Right column - stacked simple cards */}
          <div className="flex-1 flex flex-col gap-3">
            {featured.slice(1).map((post, i) => (
              <DetailedCard
                key={i}
                image={post.thumbnail}
                category={post.post_type}
                title={post.title}
                description={post.excerpt}
                author={post.author}
                date={post.date}
                href={post.permalink}
                buttonText="Read more"
              />
            ))}
          </div>
        </div>

      </div>

      <MessageBoardSlider messageBoard={messageBoard} />

      {/* Events */}
      <div className="py-16 px-4 sm:px-8 lg:px-16 bg-schemesSecondaryFixed">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="Blueprint-headline-medium text-schemesOnSecondaryFixed">What's on this week</h2>
          <ArrowIcon className="text-schemesOnSecondaryFixed" />
        </div>
        <EventsSlider events={events} />
      </div>

      {/* Browse All */}
      <BrowseAllCommunity posts={browseAll} />
      <div className="py-16 px-4 sm:px-8 lg:px-16">
        <NewsletterBanner />
      </div>
      <div className="py-16 px-4 sm:px-8 lg:px-16 bg-schemesPrimaryFixed flex flex-col gap-4">
        <div className="flex gap-3 items-center">
          <div className="Blueprint-headline-medium italic">
            Explore more by
          </div>
          <PillTag label="Theme" backgroundColor="#007ea8" />
        </div>
        <div className="Blurprint-title-large mb-6 text-schemesOnSurface">
          From support services to creative culture, start where you're curious.
        </div>
        <ExploreByTheme />
      </div>
    </div>
  );
}

function BrowseAllCommunity({ posts }) {
  const filters = [
    "All",
    "Notice Board",
    "Community Jobs",
    "Activities & Programs",
    "Volunteering & Getting Involved",
  ];
  const [activeFilter, setActiveFilter] = useState("All");
  const [page, setPage] = useState(0);

  const filteredPosts = useMemo(() => {
    if (activeFilter === "All") return posts;
    return posts.filter((post) =>
      post.tags?.includes(activeFilter)
    );
  }, [activeFilter, posts]);

  const postsPerPage = 10;
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginatedPosts = filteredPosts.slice(
    page * postsPerPage,
    page * postsPerPage + postsPerPage
  );

  return (
    <section className="py-16 px-4 sm:px-8 lg:px-16 mx-auto">
      <h2 className="Blueprint-headline-medium mb-6">Browse all community</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((label) => (
          <button
            key={label}
            onClick={() => {
              setActiveFilter(label);
              setPage(0);
            }}
            className={`px-4 py-1.5 text-sm rounded-full border transition ${activeFilter === label
              ? "bg-[var(--schemesPrimary)] text-white"
              : "bg-[var(--schemesSurface)] text-[var(--schemesOnSurface)] border-[var(--schemesOutlineVariant)]"
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {paginatedPosts.map((post) => (
          <ContentCard
            image={post.thumbnail}
            title={post.title}
            type={post.post_type}
            subtitle={post.date}
            href={post.permalink}
          />
        ))}
      </div>

      {/* Pagination Arrows */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          disabled={page === 0}
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          className="p-2 rounded-full bg-[var(--schemesSurface)] border border-[var(--schemesOutlineVariant)] disabled:opacity-30"
        >
          <CaretLeftIcon size={24} weight="bold" />
        </button>
        <span className="text-sm font-medium">
          {page + 1} / {totalPages}
        </span>
        <button
          disabled={page >= totalPages - 1}
          onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
          className="p-2 rounded-full bg-[var(--schemesSurface)] border border-[var(--schemesOutlineVariant)] disabled:opacity-30"
        >
          <CaretRightIcon size={24} weight="bold" />
        </button>
      </div>
    </section>
  );
}