import React from "react";
import { ExploreByTheme } from "./ExploreByTheme";
import PillTag from "./PillTag";
import { NewsletterBanner } from "./NewsletterBanner";
import { PostsSlider } from "./PostsSlider";
import SupportServicesIcon from "../../assets/support-services.svg";
import BrowseAll from "./BrowseAll";
import { Card } from "./Card";
import { FirstAidIcon, HeadCircuitIcon, ButterflyIcon, TrendUpIcon, AppWindowIcon } from "@phosphor-icons/react";
import { Breadcrumbs } from "./Breadcrumbs";

export const SupportAndServicesHub = ({ podcasts, articles, breadcrumbs = [] }) => {
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
                Get the Support You Need
              </h1>
              <p className="text-schemesOnPrimaryFixedVariant Blueprint-body-small md:Blueprint-body-medium lg:Blueprint-body-large max-w-xl">
                We've gathered practical resources to help you through tough times, from mental health support to community aid services.
              </p>
            </div>
            <img src={SupportServicesIcon} alt="Community Connection Hub" className="lg:block hidden translate-y-10 -translate-x-20" />
          </div>
          <div className="p-4 md:pb-8 lg:px-16">
            <h2 className="Blueprint-title-small-emphasized md:Blueprint-title-medium-emphasized lg:Blueprint-title-large-emphasized text-schemesOnSurface mb-4 mt-4">Quick Links</h2>
            <div className="mt-6">
              <div className="mt-6">
                <div className="flex gap-4 overflow-x-auto overflow-y-visible snap-x snap-mandatory
                md:grid md:grid-cols-5 md:overflow-visible md:snap-none scrollbar-hidden pb-2 md:pb-0">
                  <div className="shrink-0 snap-start w-3/7 md:w-64 md:w-auto">
                    <Card styles="shadow-3x3" href="/aid_listing.health_listing/?topic_tag=mental-health">
                      <div className="flex flex-col gap-2 h-[8em] justify-between items-start p-4 w-full">
                        <div className="bg-schemesPrimaryFixed rounded-[12px] p-1">
                          <HeadCircuitIcon size={22} />
                        </div>
                        <div className="lg:Blueprint-body-large-emphasized md:Blueprint-body-medium-emphasized Blueprint-body-small-emphasized">Mental Health Resources</div>
                      </div>
                    </Card>
                  </div>
                  <div className="shrink-0 snap-start w-3/7 md:w-64 md:w-auto">
                    <Card styles="shadow-3x3" href="/stories-and-interviews">
                      <div className="flex flex-col gap-2 h-[8em] justify-between items-start p-4 w-full">
                        <div className="bg-schemesPrimaryFixed rounded-[12px] p-1">
                          <FirstAidIcon size={22} />
                        </div>
                        <div className="lg:Blueprint-body-large-emphasized md:Blueprint-body-medium-emphasized Blueprint-body-small-emphasized">Aid and Support</div>
                      </div>
                    </Card>
                  </div>
                  <div className="shrink-0 snap-start w-3/7 md:w-64 md:w-auto">
                    <Card styles="shadow-3x3" href="/categories/cost-of-living">
                      <div className="flex flex-col gap-2 h-[8em] justify-between items-start p-4 w-full">
                        <div className="bg-schemesPrimaryFixed rounded-[12px] p-1">
                          <ButterflyIcon size={22} />
                        </div>
                        <div className="lg:Blueprint-body-large-emphasized md:Blueprint-body-medium-emphasized Blueprint-body-small-emphasized">Free Community Services</div>
                      </div>
                    </Card>
                  </div>
                  <div className="shrink-0 snap-start w-3/7 md:w-64 md:w-auto">
                    <Card styles="shadow-3x3">
                      <div className="flex flex-col gap-2 h-[8em] justify-between items-start p-4 w-full">
                        <div className="bg-schemesPrimaryFixed rounded-[12px] p-1">
                          <TrendUpIcon size={22} />
                        </div>
                        <div className="lg:Blueprint-body-large-emphasized md:Blueprint-body-medium-emphasized Blueprint-body-small-emphasized">Mental Health & Wellbeing</div>
                      </div>
                    </Card>
                  </div>
                  <div className="shrink-0 snap-start w-3/7 md:w-64 md:w-auto">
                    <Card styles="shadow-3x3">
                      <div className="flex flex-col gap-2 h-[8em] justify-between items-start p-4 w-full">
                        <div className="bg-schemesPrimaryFixed rounded-[12px] p-1">
                          <AppWindowIcon size={22} />
                        </div>
                        <div className="lg:Blueprint-body-large-emphasized md:Blueprint-body-medium-emphasized Blueprint-body-small-emphasized">Jeap App</div>
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
          <PostsSlider events={podcasts || []} title="Recent Podcasts" description="Hear personal stories and expert voices that shine a light on the many paths and shared experiences in our community." viewAllUrl="/podcasts/?theme=support-and-services" />
        </div>
      </div>
      <div className="bg-schemesSecondaryFixed">
        <div className="flex flex-col max-w-[1600px] mx-auto lg:p-16 md:p-8 p-4 gap-4 lg:gap-8">
          <PostsSlider events={articles || []} title="Mental Health & Inspriring Stories" description="Explore first-hand stories and conversations that highlight resilience, wellbeing, and the importance of seeking support." viewAllUrl="/articles/?theme=support-and-services" />
        </div>
      </div>
      <div className="max-w-[1600px] mx-auto">
        <BrowseAll
          title="Browse all Support & Services"
          endpoint="/wp-json/tsb/v1/browse"
          baseQuery={{
            post_type: ['tribe_events', 'podcast', 'article', 'directory', 'gd_discount', 'gd_aid_listing', 'gd_health_listing', 'gd_business', 'gd_photo_gallery', 'gd_cost_of_living'],
            per_page: 10,
            order: "DESC",
            orderby: "date",
            tax: [{ taxonomy: 'theme', field: 'slug', terms: ['support-and-services'] }],
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