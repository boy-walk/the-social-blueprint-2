import React from "react";
import { ArrowIcon } from "../../assets/icons/arrow";
import { ExploreByTheme } from "./ExploreByTheme";
import PillTag from "./PillTag";
import { NewsletterBanner } from "./NewsletterBanner";
import { PostsSlider } from "./PostsSlider";
import BrowseAll from "./BrowseAll";
import { Card } from "./Card";
import { CellTowerIcon, MailboxIcon, CalendarDotIcon, TrendUpIcon, StarIcon } from "@phosphor-icons/react";
import { ListingCallout } from "./ListingCallout";

export const DirectoryHub = ({ costOfLiving, contactLists }) => {
  return (
    <div className="bg-schemesSurface">
      <div className="bg-schemesPrimaryFixed">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex p-4 pt-12 md:p-8 lg:px-16 lg:py-8 items-center justify-between">
            <div className="flex flex-col gap-2">
              <h1 className="lg:Blueprint-headline-large-emphasized md:Blueprint-headline-medium-emphasized Blueprint-headline-small-emphasized text-schemesOnSurface mb-3">
                Community Directory
              </h1>
              <p className="text-schemesOnPrimaryFixedVariant Blueprint-body-small md:Blueprint-body-medium lg:Blueprint-body-large max-w-xl">
                Stay informed and connected. Find community jobs, volunteer opportunities, local notices, and informal support through our active message boards and groups.
              </p>
            </div>
          </div>
          <div className="p-4 md:pb-8 lg:px-16">
            <h2 className="Blueprint-title-small-emphasized md:Blueprint-title-medium-emphasized lg:Blueprint-title-large-emphasized text-schemesOnSurface mb-4 mt-4">Quick Links</h2>
            <div className="mt-6">
              <div className="mt-6">
                <div className="flex gap-4 sm:gap-6 overflow-x-auto overflow-y-visible snap-x snap-mandatory
                md:grid md:grid-cols-5 md:gap-6 md:overflow-visible md:snap-none scrollbar-hidden pb-2 md:pb-0">
                  <div className="shrink-0 snap-start w-3/7 md:w-64 md:w-auto">
                    <Card href="/cost_of_living">
                      <div className="flex flex-col gap-2 h-[8em] justify-between items-start p-4 w-full">
                        <div className="bg-schemesPrimaryFixed rounded-[12px] p-1">
                          <MailboxIcon size={22} />
                        </div>
                        <div className="lg:Blueprint-body-large-emphasized md:Blueprint-body-medium-emphasized Blueprint-body-small-emphasized">Cost of Living</div>
                      </div>
                    </Card>
                  </div>
                  <div className="shrink-0 snap-start w-3/7 md:w-64 md:w-auto">
                    <Card href="/aid_listing">
                      <div className="flex flex-col gap-2 h-[8em] justify-between items-start p-4 w-full">
                        <div className="bg-schemesPrimaryFixed rounded-[12px] p-1">
                          <CellTowerIcon size={22} />
                        </div>
                        <div className="lg:Blueprint-body-large-emphasized md:Blueprint-body-medium-emphasized Blueprint-body-small-emphasized">Aid</div>
                      </div>
                    </Card>
                  </div>
                  <div className="shrink-0 snap-start w-3/7 md:w-64 md:w-auto">
                    <Card href="/health_listing">
                      <div className="flex flex-col gap-2 h-[8em] justify-between items-start p-4 w-full">
                        <div className="bg-schemesPrimaryFixed rounded-[12px] p-1">
                          <CalendarDotIcon size={22} />
                        </div>
                        <div className="lg:Blueprint-body-large-emphasized md:Blueprint-body-medium-emphasized Blueprint-body-small-emphasized">Health</div>
                      </div>
                    </Card>
                  </div>
                  <div className="shrink-0 snap-start w-3/7 md:w-64 md:w-auto">
                    <Card href="/business">
                      <div className="flex flex-col gap-2 h-[8em] justify-between items-start p-4 w-full">
                        <div className="bg-schemesPrimaryFixed rounded-[12px] p-1">
                          <TrendUpIcon size={22} />
                        </div>
                        <div className="lg:Blueprint-body-large-emphasized md:Blueprint-body-medium-emphasized Blueprint-body-small-emphasized">Media Contact List</div>
                      </div>
                    </Card>
                  </div>
                  <div className="shrink-0 snap-start w-3/7 md:w-64 md:w-auto">
                    <Card href="/listings/category/jewish-life-cycle/">
                      <div className="flex flex-col gap-2 h-[8em] justify-between items-start p-4 w-full">
                        <div className="bg-schemesPrimaryFixed rounded-[12px] p-1">
                          <StarIcon size={22} />
                        </div>
                        <div className="lg:Blueprint-body-large-emphasized md:Blueprint-body-medium-emphasized Blueprint-body-small-emphasized">Jewish Lifecycle</div>
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
          <div className="flex items-center gap-2 mb-6">
            <h2 className="Blueprint-title-small-emphasized md:Blueprint-title-medium-emphasized lg:Blueprint-title-large-emphasized text-schemesOnSecondaryFixed">Cost of Living</h2>
            <ArrowIcon className="text-schemesOnSecondaryFixed" />
          </div>
          <PostsSlider events={costOfLiving || []} />
        </div>
      </div>
      <div className="bg-schemesSecondaryFixed">
        <div className="flex flex-col max-w-[1600px] mx-auto lg:p-16 md:p-8 p-4 gap-4 lg:gap-8">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="Blueprint-title-small-emphasized md:Blueprint-title-medium-emphasized lg:Blueprint-title-large-emphasized text-schemesOnSecondaryFixed">Contact Lists</h2>
            <ArrowIcon className="text-schemesOnSecondaryFixed" />
          </div>
          <PostsSlider events={contactLists || []} />
        </div>
      </div>
      <div className="max-w-[1600px] mx-auto">
        <BrowseAll
          title="Browse all directories"
          endpoint="/wp-json/tsb/v1/browse"
          baseQuery={{
            post_type: ['directory', 'gd_aid_listing', 'gd_health_listing', 'gd_business', 'gd_cost_of_living'],
            per_page: 10,
            order: "DESC",
            orderby: "date",
          }}
        />
        <div className="py-16 px-4 sm:px-8 lg:px-16">
          <ListingCallout />
        </div>
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