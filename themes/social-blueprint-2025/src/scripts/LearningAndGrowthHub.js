import React from "react";
import { ExploreByTheme } from "./ExploreByTheme";
import PillTag from "./PillTag";
import { NewsletterBanner } from "./NewsletterBanner";
import { PostsSlider } from "./PostsSlider";
import LearningGrowthIcon from "../../assets/learning-growth.svg";
import BrowseAll from "./BrowseAll";
import { Card } from "./Card";
import { CellTowerIcon, MailboxIcon, CalendarDotIcon, TrendUpIcon, StarIcon } from "@phosphor-icons/react";
import FeaturedPostLayout from "./FeaturedPostLayout";
import { Breadcrumbs } from "./Breadcrumbs";

export const LearningAndGrowthHub = ({ featured, podcasts, events, costOfLiving, breadcrumbs = [] }) => {
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
                Learning & Growth
              </h1>
              <p className="text-schemesOnPrimaryFixedVariant Blueprint-body-small md:Blueprint-body-medium lg:Blueprint-body-large max-w-xl">
                Educational resources and inspiring stories to support your personal growth.
              </p>
            </div>
            <img src={LearningGrowthIcon} alt="Community Connection Hub" className="lg:block hidden translate-y-10 -translate-x-20" />
          </div>
          <div className="p-4 md:pb-8 lg:px-16">
            <h2 className="Blueprint-title-small-emphasized md:Blueprint-title-medium-emphasized lg:Blueprint-title-large-emphasized text-schemesOnSurface mb-4 mt-4">Quick Links</h2>
            <div className="mt-6">
              <div className="mt-6">
                <div className="flex gap-4 overflow-x-auto overflow-y-visible snap-x snap-mandatory
                md:grid md:grid-cols-5 md:overflow-visible md:snap-none scrollbar-hidden pb-2 md:pb-0">
                  <div className="shrink-0 snap-start w-3/7 md:w-64 md:w-auto">
                    <Card styles="shadow-3x3" href="/message-board">
                      <div className="flex flex-col gap-2 h-[8em] justify-between items-start p-4 w-full">
                        <div className="bg-schemesPrimaryFixed rounded-[12px] p-1">
                          <MailboxIcon size={22} />
                        </div>
                        <div className="lg:Blueprint-body-large-emphasized md:Blueprint-body-medium-emphasized Blueprint-body-small-emphasized">Educational Podcasts</div>
                      </div>
                    </Card>
                  </div>
                  <div className="shrink-0 snap-start w-3/7 md:w-64 md:w-auto">
                    <Card styles="shadow-3x3" href="/stories-and-interviews">
                      <div className="flex flex-col gap-2 h-[8em] justify-between items-start p-4 w-full">
                        <div className="bg-schemesPrimaryFixed rounded-[12px] p-1">
                          <CellTowerIcon size={22} />
                        </div>
                        <div className="lg:Blueprint-body-large-emphasized md:Blueprint-body-medium-emphasized Blueprint-body-small-emphasized">Educational Articles</div>
                      </div>
                    </Card>
                  </div>
                  <div className="shrink-0 snap-start w-3/7 md:w-64 md:w-auto">
                    <Card styles="shadow-3x3" href="/categories/cost-of-living">
                      <div className="flex flex-col gap-2 h-[8em] justify-between items-start p-4 w-full">
                        <div className="bg-schemesPrimaryFixed rounded-[12px] p-1">
                          <CalendarDotIcon size={22} />
                        </div>
                        <div className="lg:Blueprint-body-large-emphasized md:Blueprint-body-medium-emphasized Blueprint-body-small-emphasized">Cost of Living</div>
                      </div>
                    </Card>
                  </div>
                  <div className="shrink-0 snap-start w-3/7 md:w-64 md:w-auto">
                    <Card styles="shadow-3x3">
                      <div className="flex flex-col gap-2 h-[8em] justify-between items-start p-4 w-full">
                        <div className="bg-schemesPrimaryFixed rounded-[12px] p-1">
                          <TrendUpIcon size={22} />
                        </div>
                        <div className="lg:Blueprint-body-large-emphasized md:Blueprint-body-medium-emphasized Blueprint-body-small-emphasized">Reports and Surveys</div>
                      </div>
                    </Card>
                  </div>
                  <div className="shrink-0 snap-start w-3/7 md:w-64 md:w-auto">
                    <Card styles="shadow-3x3">
                      <div className="flex flex-col gap-2 h-[8em] justify-between items-start p-4 w-full">
                        <div className="bg-schemesPrimaryFixed rounded-[12px] p-1">
                          <StarIcon size={22} />
                        </div>
                        <div className="lg:Blueprint-body-large-emphasized md:Blueprint-body-medium-emphasized Blueprint-body-small-emphasized">Israel &<br />Jewish Global Affairs</div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="flex flex-col max-w-[1600px] mx-auto lg:p-16 md:p-8 p-4 gap-4 lg:gap-8">
          <h2 className="py-3 Blueprint-title-small-emphasized md:Blueprint-title-medium-emphasized lg:Blueprint-title-large-emphasized text-schemesOnSecondaryFixed">Featured in Learning and Growth</h2>
          <FeaturedPostLayout posts={featured} />
        </div>
      </div>
      <div>
        <div className="flex flex-col max-w-[1600px] mx-auto lg:p-16 md:p-8 p-4 gap-4 lg:gap-8">
          <PostsSlider events={podcasts || []} title="Educational Podcasts" viewAllUrl="/podcasts/?theme=learning-and-growth" description="Hear conversations and stories from within the Jewish community and beyond, exploring education, wellbeing, and culture." />
        </div>
      </div>
      <div>
        <div className="flex flex-col max-w-[1600px] mx-auto lg:p-16 md:p-8 p-4 gap-4 lg:gap-8">
          <PostsSlider events={events || []} title="Educational Events" description="Find talks, classes, and workshops that encourage personal development and community connection through learning." viewAllUrl="/events/?theme=learning-and-growth" />
        </div>
      </div>
      <div>
        <div className="flex flex-col max-w-[1600px] mx-auto lg:p-16 md:p-8 p-4 gap-4 lg:gap-8">
          <PostsSlider events={costOfLiving || []} title="Cost of Living" description="Access practical resources and advice to help manage rising costs with confidence, tailored to our community’s needs." viewAllUrl="/cost_of_living/?theme=learning-and-growth" />
        </div>
      </div>
      <div className="max-w-[1600px] mx-auto">
        <BrowseAll
          title="Browse all Learning and Growth"
          endpoint="/wp-json/tsb/v1/browse"
          baseQuery={{
            post_type: ['tribe_events', 'podcast', 'article', 'directory', 'gd_discount', 'gd_aid_listing', 'gd_health_listing', 'gd_business', 'gd_photo_gallery', 'gd_cost_of_living'],
            per_page: 10,
            order: "DESC",
            orderby: "date",
            tax: [{ taxonomy: 'theme', field: 'slug', terms: ['learning-and-growth'] }],
          }}
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