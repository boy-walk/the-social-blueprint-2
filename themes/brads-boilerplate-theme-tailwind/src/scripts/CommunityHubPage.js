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
import { PostsSlider } from "./PostsSlider";
import FeaturedPostLayout from "./FeaturedPostLayout";
import { useTranslation } from "react-i18next";
import CommunityConnectionHubIcon from "../../assets/community-connection-hub.svg";

export function CommunityHubPage({ featured, messageBoard, events, browseAll }) {
  const { t } = useTranslation();
  return (
    <div>
      <div className="bg-schemesPrimaryFixed">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex p-4 pt-12 md:p-8 lg:px-16 lg:py-8 items-center justify-between">
            <div className="flex flex-col gap-2">
              <h1 className="lg:Blueprint-headline-large-emphasized md:Blueprint-headline-medium-emphasized Blueprint-headline-small-emphasized text-schemesOnSurface mb-3">
                Community Connection
              </h1>
              <p className="text-schemesOnPrimaryFixedVariant Blueprint-body-small md:Blueprint-body-medium lg:Blueprint-body-large max-w-xl">
                Stay informed and connected. Find community jobs, volunteer opportunities,
                local notices, and informal support through our active message boards and groups.
              </p>
            </div>
            <img src={CommunityConnectionHubIcon} alt="Community Connection Hub" className="lg:block hidden translate-y-10 -translate-x-20" />
          </div>
          {/* Quick Links */}
          <div className="p-4 md:pb-8 lg:px-16">
            <h2 className="Blueprint-title-small-emphasized md:Blueprint-title-medium-emphasized lg:Blueprint-title-large-emphasized text-schemesOnSurface mb-4 mt-4">Quick Links</h2>
            <div className="mt-6">
              <div className="mt-6">
                <div className="flex gap-4 sm:gap-6 overflow-x-auto overflow-y-visible snap-x snap-mandatory
                md:grid md:grid-cols-5 md:gap-6 md:overflow-visible md:snap-none scrollbar-hidden pb-2 md:pb-0">
                  <div className="shrink-0 snap-start w-3/7 md:w-64 md:w-auto">
                    <Card>
                      <div className="flex flex-col gap-2 h-[8em] justify-between items-start p-4 w-full">
                        <div className="bg-schemesPrimaryFixed rounded-[12px] p-1">
                          <MailboxIcon size={22} />
                        </div>
                        <div className="lg:Blueprint-body-large-emphasized md:Blueprint-body-medium-emphasized Blueprint-body-small-emphasized">Community message board</div>
                      </div>
                    </Card>
                  </div>

                  <div className="shrink-0 snap-start w-3/7 md:w-64 md:w-auto">
                    <Card>
                      <div className="flex flex-col gap-2 h-[8em] justify-between items-start p-4 w-full">
                        <div className="bg-schemesPrimaryFixed rounded-[12px] p-1">
                          <CellTowerIcon size={22} />
                        </div>
                        <div className="lg:Blueprint-body-large-emphasized md:Blueprint-body-medium-emphasized Blueprint-body-small-emphasized">Stories and interviews</div>
                      </div>
                    </Card>
                  </div>

                  <div className="shrink-0 snap-start w-3/7 md:w-64 md:w-auto">
                    <Card>
                      <div className="flex flex-col gap-2 h-[8em] justify-between items-start p-4 w-full">
                        <div className="bg-schemesPrimaryFixed rounded-[12px] p-1">
                          <CalendarDotIcon size={22} />
                        </div>
                        <div className="lg:Blueprint-body-large-emphasized md:Blueprint-body-medium-emphasized Blueprint-body-small-emphasized">Upcoming community events</div>
                      </div>
                    </Card>
                  </div>

                  <div className="shrink-0 snap-start w-3/7 md:w-64 md:w-auto">
                    <Card>
                      <div className="flex flex-col gap-2 h-[8em] justify-between items-start p-4 w-full">
                        <div className="bg-schemesPrimaryFixed rounded-[12px] p-1">
                          <TrendUpIcon size={22} />
                        </div>
                        <div className="lg:Blueprint-body-large-emphasized md:Blueprint-body-medium-emphasized Blueprint-body-small-emphasized">Submit your own story</div>
                      </div>
                    </Card>
                  </div>

                  <div className="shrink-0 snap-start w-3/7 md:w-64 md:w-auto">
                    <Card>
                      <div className="flex flex-col gap-2 h-[8em] justify-between items-start p-4 w-full">
                        <div className="bg-schemesPrimaryFixed rounded-[12px] p-1">
                          <StarIcon size={22} />
                        </div>
                        <div className="lg:Blueprint-body-large-emphasized md:Blueprint-body-medium-emphasized Blueprint-body-small-emphasized">Nominate someone</div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col max-w-[1600px] mx-auto lg:p-16 md:p-8 p-4 gap-8 md:gap-16 lg:gap-32">
        <div>
          <h2 className="Blueprint-title-small-emphasized md:Blueprint-title-medium-emphasized lg:Blueprint-title-large-emphasized text-schemesOnSurface py-3 mb-4">
            Featured in Community
          </h2>
          <FeaturedPostLayout posts={featured} />
        </div>
        <div>
          <div className="flex md:justify-between lg:justify-start items-center gap-2 mb-8">
            <h2 className="Blueprint-title-small-emphasized md:Blueprint-title-medium-emphasized lg:Blueprint-title-large-emphasized text-schemesOnSurface">
              {t("recentMessageBoardPosts")}
            </h2>
            <ArrowIcon />
          </div>
          <MessageBoardSlider messageBoard={messageBoard} />
        </div>
      </div>
      {/* Events */}
      <div className="py-16 px-4 sm:px-8 lg:px-16 bg-schemesSecondaryFixed">
        <div className="max-w-[1500px] mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="Blueprint-title-small-emphasized md:Blueprint-title-medium-emphasized lg:Blueprint-title-large-emphasized text-schemesOnSecondaryFixed">What's on this week</h2>
            <ArrowIcon className="text-schemesOnSecondaryFixed" />
          </div>
          <PostsSlider events={events} />
        </div>
      </div>
      <div className="max-w-[1600px] mx-auto">
        {/* Browse All */}
        <BrowseAllCommunity posts={browseAll} />
        <div className="py-16 px-4 sm:px-8 lg:px-16">
          <NewsletterBanner />
        </div>
      </div>
      <div className="bg-schemesPrimaryFixed flex flex-col gap-4">
        <div className="max-w-[1600px] mx-auto py-16 px-4 sm:px-8 lg:px-16">
          <div className="flex gap-2 md:gap-4 items-center">
            <div className="Blueprint-title-small-emphasized md:Blueprint-title-medium-emphasized lg:Blueprint-title-large-emphasized italic py-6">
              Explore more by
            </div>
            <PillTag label="Theme" backgroundColor="schemesPrimaryContainer" />
          </div>
          <div className="Blueprint-title-small md:Blueprint-title-medium lg:Blueprint-title-large mb-12 text-schemesOnSurface">
            From support services to creative culture, start where you're curious.
          </div>
          <ExploreByTheme />
        </div>
      </div>
    </div >
  );
}

function BrowseAllCommunity({ posts }) {
  const filters = [
    "All",
    "test tag",
    "Community jobs",
    "Activities & Programs",
    "Volunteering & Getting Involved",
  ];
  const [activeFilter, setActiveFilter] = useState("All");
  const [page, setPage] = useState(0);

  const filteredPosts = useMemo(() => {
    if (activeFilter === "All") return posts;
    return posts.filter((post) =>
      post.topics?.includes(activeFilter)
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