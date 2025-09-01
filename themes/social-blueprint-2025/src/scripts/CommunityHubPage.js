import React, { useState, useMemo } from "react";
import { Card } from "./Card";
import { ArrowIcon } from "../../assets/icons/arrow";
import { ExploreByTheme } from "./ExploreByTheme";
import PillTag from "./PillTag";
import { CellTowerIcon, MailboxIcon, CalendarDotIcon, TrendUpIcon, StarIcon, CaretLeftIcon, CaretRightIcon, Bread } from "@phosphor-icons/react";
import { MessageBoardSlider } from "./MessageBoardSlider";
import { NewsletterBanner } from "./NewsletterBanner";
import { PostsSlider } from "./PostsSlider";
import FeaturedPostLayout from "./FeaturedPostLayout";
import { useTranslation } from "../../node_modules/react-i18next";
import CommunityConnectionHubIcon from "../../assets/community-connection-hub.svg";
import BrowseAll from "./BrowseAll";
import { Breadcrumbs } from "./Breadcrumbs";

export function CommunityHubPage({ featured, messageBoard, events, breadcrumbs = [], }) {
  const { t } = useTranslation();
  return (
    <div className="bg-schemesSurface">
      <div className="bg-schemesPrimaryFixed">
        <div className="max-w-[1600px] mx-auto">
          <div className="hidden md:block md:px-8 md:pt-8 lg:px-16 lg:pt-8">
            <Breadcrumbs items={breadcrumbs} textColour="text-schemesPrimary" />
          </div>
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
                    <Card href="/message-board">
                      <div className="flex flex-col gap-2 h-[8em] justify-between items-start p-4 w-full">
                        <div className="bg-schemesPrimaryFixed rounded-[12px] p-1">
                          <MailboxIcon size={22} />
                        </div>
                        <div className="lg:Blueprint-body-large-emphasized md:Blueprint-body-medium-emphasized Blueprint-body-small-emphasized">Community message board</div>
                      </div>
                    </Card>
                  </div>

                  <div className="shrink-0 snap-start w-3/7 md:w-64 md:w-auto">
                    <Card href="/stories-and-interviews">
                      <div className="flex flex-col gap-2 h-[8em] justify-between items-start p-4 w-full">
                        <div className="bg-schemesPrimaryFixed rounded-[12px] p-1">
                          <CellTowerIcon size={22} />
                        </div>
                        <div className="lg:Blueprint-body-large-emphasized md:Blueprint-body-medium-emphasized Blueprint-body-small-emphasized">Stories and interviews</div>
                      </div>
                    </Card>
                  </div>

                  <div className="shrink-0 snap-start w-3/7 md:w-64 md:w-auto">
                    <Card href="/events">
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

      <div className="flex flex-col max-w-[1600px] mx-auto lg:p-16 md:p-8 p-4 gap-24 lg:gap-32">
        <div>
          <h2 className="Blueprint-title-small-emphasized md:Blueprint-title-medium-emphasized lg:Blueprint-title-large-emphasized text-schemesOnSurface py-3 mb-4">
            Featured in Community
          </h2>
          <FeaturedPostLayout posts={featured} />
        </div>
        <div>
          <div className="flex justify-between lg:justify-start items-center gap-2 mb-8">
            <h2 className="Blueprint-title-small-emphasized md:Blueprint-title-medium-emphasized lg:Blueprint-title-large-emphasized text-schemesOnSurface">
              {t("recentMessageBoardPosts")}
            </h2>
            <ArrowIcon />
          </div>
          <MessageBoardSlider messageBoard={messageBoard} />
        </div>
      </div>
      {/* Events */}
      <div className="bg-schemesSecondaryFixed">
        <div className="flex flex-col max-w-[1600px] mx-auto lg:p-16 md:p-8 p-4 gap-4 lg:gap-8">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="Blueprint-title-small-emphasized md:Blueprint-title-medium-emphasized lg:Blueprint-title-large-emphasized text-schemesOnSecondaryFixed">What's on this week</h2>
            <ArrowIcon className="text-schemesOnSecondaryFixed" />
          </div>
          <PostsSlider events={events} />
        </div>
      </div>
      <div className="max-w-[1600px] mx-auto">
        <BrowseAll
          title="Browse all community"
          endpoint="/wp-json/tsb/v1/browse"
          baseQuery={{
            post_type: ['tribe_events', 'podcast', 'article', 'directory', 'gd_discount', 'gd_aid_listing', 'gd_health_listing', 'gd_business', 'gd_photo_gallery', 'gd_cost_of_living'],
            per_page: 10,
            orderby: 'date',
            order: 'DESC',
            tax: [{ taxonomy: 'theme', field: 'slug', terms: ['community-and-connection'] }],
          }}
          filters={[
            { label: "Community jobs", tax: { taxonomy: "topic_tag", terms: ["community-jobs"] } },
            { label: "Activities & Programs", tax: { taxonomy: "topic_tag", terms: ["activities-programs"] } },
            { label: "Volunteering & Getting Involved", tax: { taxonomy: "topic_tag", terms: ["volunteering-getting-involved"] } },
          ]}
          className="py-16 px-4 sm:px-8 lg:px-16 mx-auto"
        />
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