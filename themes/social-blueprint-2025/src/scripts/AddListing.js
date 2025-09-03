import React from "react";
import { NewsletterBanner } from "./NewsletterBanner";
import { Card } from "./Card";
import { BowlFoodIcon, HeartHalfIcon, MicrophoneStageIcon, MoneyWavyIcon, StarOfDavidIcon } from "@phosphor-icons/react";
import { Breadcrumbs } from "./Breadcrumbs";

export function AddListing({ breadcrumbs = [] }) {
  return (
    <div>
      <div className="hidden md:block bg-schemesPrimaryFixed">
        <div className="max-w-[1600px] mx-auto">
          <div className="md:px-8 md:pt-8 lg:px-16 lg:pt-8">
            <Breadcrumbs items={breadcrumbs} textColour="text-schemesPrimary" />
          </div>
          <div className="flex p-4 md:p-8 lg:px-16 lg:pt-16 items-end justify-between">
            <div className="flex flex-col gap-2">
              <h1 className="lg:Blueprint-headline-large-emphasized md:Blueprint-headline-medium-emphasized Blueprint-headline-small-emphasized text-schemesOnSurface mb-3">
                Add Listing
              </h1>
              <p className="text-schemesOnPrimaryFixedVariant Blueprint-body-small md:Blueprint-body-medium lg:Blueprint-body-large max-w-xl">
                Choose what you want to add. Listings help people find events, services, stories, and local support.
              </p>
            </div>
          </div>
          <div className="p-4 md:pb-8 lg:px-16">
            <h2 className="Blueprint-title-small-emphasized md:Blueprint-title-medium-emphasized lg:Blueprint-title-large-emphasized text-schemesOnSurface mb-4 mt-4">What would you like to add?</h2>
            <div className="mt-6">
              <div className="mt-6">
                <div className="flex gap-4 sm:gap-6 overflow-x-auto overflow-y-visible snap-x snap-mandatory
                md:grid md:grid-cols-5 md:gap-6 md:overflow-visible md:snap-none scrollbar-hidden pb-2 md:pb-0">
                  <div className="shrink-0 snap-start w-3/7 md:w-64 md:w-auto">
                    <Card href="/add-listing/health_listing">
                      <div className="flex flex-col gap-2 h-[8em] justify-between items-start p-4 w-full">
                        <div className="bg-[#6ED4BE] rounded-[12px] p-1">
                          <MoneyWavyIcon size={22} />
                        </div>
                        <div className="lg:Blueprint-body-large md:Blueprint-body-medium Blueprint-body-small">Add Health and Wellbeing<br />Clinicians, groups, programs.</div>
                      </div>
                    </Card>
                  </div>

                  <div className="shrink-0 snap-start w-3/7 md:w-64 md:w-auto">
                    <Card href="/add-listing/aid_listing">
                      <div className="flex flex-col gap-2 h-[8em] justify-between items-start p-4 w-full">
                        <div className="bg-[#A3B4FF] rounded-[12px] p-1">
                          <BowlFoodIcon size={22} />
                        </div>
                        <div className="lg:Blueprint-body-large md:Blueprint-body-medium Blueprint-body-small">Add Aid and Support<br />Community services, help.</div>
                      </div>
                    </Card>
                  </div>

                  <div className="shrink-0 snap-start w-3/7 md:w-64 md:w-auto">
                    <Card href="/add-listing/message-boards">
                      <div className="flex flex-col gap-2 h-[8em] justify-between items-start p-4 w-full">
                        <div className="bg-[#FF9388] rounded-[12px] p-1">
                          <HeartHalfIcon size={22} />
                        </div>
                        <div className="lg:Blueprint-body-large md:Blueprint-body-medium Blueprint-body-small">Post to message board<br />Items, jobs, services.</div>
                      </div>
                    </Card>
                  </div>

                  <div className="shrink-0 snap-start w-3/7 md:w-64 md:w-auto">
                    <Card href="/events-calendar/community/add">
                      <div className="flex flex-col gap-2 h-[8em] justify-between items-start p-4 w-full">
                        <div className="bg-[#F7D471] rounded-[12px] p-1">
                          <MicrophoneStageIcon size={22} />
                        </div>
                        <div className="lg:Blueprint-body-large md:Blueprint-body-medium Blueprint-body-small">Add an event<br />Workshops, festivals, classes.</div>
                      </div>
                    </Card>
                  </div>

                  <div className="shrink-0 snap-start w-3/7 md:w-64 md:w-auto">
                    <Card>
                      <div className="flex flex-col gap-2 h-[8em] justify-between items-start p-4 w-full">
                        <div className="bg-[#7FD0FF] rounded-[12px] p-1">
                          <StarOfDavidIcon size={22} />
                        </div>
                        <div className="lg:Blueprint-body-large md:Blueprint-body-medium Blueprint-body-small">Submit an article<br />Stories, interviews, opinions</div>
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
        <div className="py-16 px-4 sm:px-8 lg:px-16">
          <NewsletterBanner />
        </div>
      </div>
    </div >
  );
}