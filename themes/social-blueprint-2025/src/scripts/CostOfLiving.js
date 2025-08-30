import React from "react";
import { ExploreByTheme } from "./ExploreByTheme";
import PillTag from "./PillTag";
import { NewsletterBanner } from "./NewsletterBanner";
import CommunityConnectionHubIcon from "../../assets/community-connection-hub.svg";
import BrowseAll from "./BrowseAll";
import { Card } from "./Card";
import { BowlFoodIcon, CarIcon, HeartHalfIcon, MicrophoneStageIcon, MoneyWavyIcon, StarOfDavidIcon } from "@phosphor-icons/react";

export function CostOfLiving({ sections }) {
  console.log(sections);
  return (
    <div>
      <div className="hidden md:block bg-schemesPrimaryFixed">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex p-4 md:p-8 lg:px-16 lg:pt-16 items-end justify-between">
            <div className="flex flex-col gap-2">
              <h1 className="lg:Blueprint-headline-large-emphasized md:Blueprint-headline-medium-emphasized Blueprint-headline-small-emphasized text-schemesOnSurface mb-3">
                Cost of Living Resources
              </h1>
              <p className="text-schemesOnPrimaryFixedVariant Blueprint-body-small md:Blueprint-body-medium lg:Blueprint-body-large max-w-xl">
                Access financial resources, interest-free loans, utility support, and community programs to help manage daily expenses.
              </p>
            </div>
          </div>
          <div className="p-4 md:pb-8 lg:px-16">
            <h2 className="Blueprint-title-small-emphasized md:Blueprint-title-medium-emphasized lg:Blueprint-title-large-emphasized text-schemesOnSurface mb-4 mt-4">Quick Links</h2>
            <div className="mt-6">
              <div className="mt-6">
                <div className="flex gap-4 sm:gap-6 overflow-x-auto overflow-y-visible snap-x snap-mandatory
                md:grid md:grid-cols-6 md:gap-6 md:overflow-visible md:snap-none scrollbar-hidden pb-2 md:pb-0">
                  <div className="shrink-0 snap-start w-3/7 md:w-64 md:w-auto">
                    <Card href="/message-board">
                      <div className="flex flex-col gap-2 h-[8em] justify-between items-start p-4 w-full">
                        <div className="bg-[#6ED4BE] rounded-[12px] p-1">
                          <MoneyWavyIcon size={22} />
                        </div>
                        <div className="lg:Blueprint-body-large-emphasized md:Blueprint-body-medium-emphasized Blueprint-body-small-emphasized">Financial Health</div>
                      </div>
                    </Card>
                  </div>

                  <div className="shrink-0 snap-start w-3/7 md:w-64 md:w-auto">
                    <Card href="/stories-and-interviews">
                      <div className="flex flex-col gap-2 h-[8em] justify-between items-start p-4 w-full">
                        <div className="bg-[#A3B4FF] rounded-[12px] p-1">
                          <BowlFoodIcon size={22} />
                        </div>
                        <div className="lg:Blueprint-body-large-emphasized md:Blueprint-body-medium-emphasized Blueprint-body-small-emphasized">Food Support</div>
                      </div>
                    </Card>
                  </div>

                  <div className="shrink-0 snap-start w-3/7 md:w-64 md:w-auto">
                    <Card href="/events">
                      <div className="flex flex-col gap-2 h-[8em] justify-between items-start p-4 w-full">
                        <div className="bg-[#FF9388] rounded-[12px] p-1">
                          <HeartHalfIcon size={22} />
                        </div>
                        <div className="lg:Blueprint-body-large-emphasized md:Blueprint-body-medium-emphasized Blueprint-body-small-emphasized">Education & Learning</div>
                      </div>
                    </Card>
                  </div>

                  <div className="shrink-0 snap-start w-3/7 md:w-64 md:w-auto">
                    <Card>
                      <div className="flex flex-col gap-2 h-[8em] justify-between items-start p-4 w-full">
                        <div className="bg-[#F7D471] rounded-[12px] p-1">
                          <MicrophoneStageIcon size={22} />
                        </div>
                        <div className="lg:Blueprint-body-large-emphasized md:Blueprint-body-medium-emphasized Blueprint-body-small-emphasized">Housing & Utility</div>
                      </div>
                    </Card>
                  </div>

                  <div className="shrink-0 snap-start w-3/7 md:w-64 md:w-auto">
                    <Card>
                      <div className="flex flex-col gap-2 h-[8em] justify-between items-start p-4 w-full">
                        <div className="bg-[#7FD0FF] rounded-[12px] p-1">
                          <StarOfDavidIcon size={22} />
                        </div>
                        <div className="lg:Blueprint-body-large-emphasized md:Blueprint-body-medium-emphasized Blueprint-body-small-emphasized">Grants & Awards</div>
                      </div>
                    </Card>
                  </div>

                  <div className="shrink-0 snap-start w-3/7 md:w-64 md:w-auto">
                    <Card>
                      <div className="flex flex-col gap-2 h-[8em] justify-between items-start p-4 w-full">
                        <div className="bg-[#C7A9EA] rounded-[12px] p-1">
                          <CarIcon size={22} />
                        </div>
                        <div className="lg:Blueprint-body-large-emphasized md:Blueprint-body-medium-emphasized Blueprint-body-small-emphasized">Transport</div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-[1600px] mx-auto">
        <BrowseAll
          title="Browse all cost of living"
          endpoint="/wp-json/tsb/v1/browse"
          baseQuery={{
            per_page: 10,
            hide_recurring: true,
            post_type: ['gd_cost_of_living']
          }}
          filters={[
            { label: "Community jobs", tax: { taxonomy: "gd_cost_of_livingcategory", terms: ["education"] } },
          ]}
          className="p-6 md:p-8 lg:p-16"
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