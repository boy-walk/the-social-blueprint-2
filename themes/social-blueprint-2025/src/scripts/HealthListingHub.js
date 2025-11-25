import React from "react";
import { ExploreByTheme } from "./ExploreByTheme";
import PillTag from "./PillTag";
import { NewsletterBanner } from "./NewsletterBanner";
import BrowseAll from "./BrowseAll";
import { Card } from "./Card";
import { Breadcrumbs } from "./Breadcrumbs";

export function HealthListingHub({ categories = [], breadcrumbs = [] }) {
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
                Health & Wellbeing
              </h1>
              <p className="text-schemesOnPrimaryFixedVariant Blueprint-body-small md:Blueprint-body-medium lg:Blueprint-body-large max-w-xl">
                Explore health professionals, wellbeing programs, and support groups for mental, physical, and emotional health.
              </p>
            </div>
          </div>

          {categories.length > 0 && (
            <div className="p-4 md:pb-8 lg:px-16">
              <h2 className="Blueprint-title-small-emphasized md:Blueprint-title-medium-emphasized lg:Blueprint-title-large-emphasized text-schemesOnSurface mb-4 mt-4">
                Quick Links
              </h2>
              <div className="mt-6">
                <div className="flex gap-4 sm:gap-6 overflow-x-auto overflow-y-visible snap-x snap-mandatory scrollbar-hidden pb-2">
                  {categories.map((category) => {
                    const categoryLink = `/health_listing/category/${category.slug}`;
                    const bgColor = category.color || '#6ED4BE';
                    const hasFaIcon = category.fa_icon && typeof category.fa_icon === 'string';

                    // Build image URL if available
                    const imageUrl = category.image_url
                      ? (category.image_url.startsWith('http')
                        ? category.image_url
                        : `/wp-content/uploads/${category.image_url}`)
                      : null;

                    return (
                      <div key={category.id} className="shrink-0 snap-start w-[45%] sm:w-[30%] md:w-[200px]">
                        <Card styles="shadow-3x3" href={categoryLink}>
                          <div className="flex flex-col gap-2 h-[8em] justify-between items-start p-4 w-full">
                            {hasFaIcon ? (
                              <div
                                className="rounded-full flex items-center justify-center"
                                style={{ backgroundColor: bgColor }}
                              >
                                <i
                                  className={`${category.fa_icon} text-white`}
                                  style={{ fontSize: '16px' }}
                                  aria-hidden="true"
                                ></i>
                              </div>
                            ) : imageUrl ? (
                              <div className="w-full h-full flex items-center justify-center">
                                <img
                                  src={imageUrl}
                                  alt={category.name}
                                  className="max-w-full max-h-[4em] object-contain"
                                />
                              </div>
                            ) : null}
                            <div className="lg:Blueprint-body-large-emphasized md:Blueprint-body-medium-emphasized Blueprint-body-small-emphasized">
                              {category.name}
                            </div>
                          </div>
                        </Card>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto">
        <BrowseAll
          title="Browse all health directory listings"
          endpoint="/wp-json/tsb/v1/browse"
          baseQuery={{
            per_page: 10,
            hide_recurring: true,
            post_type: ['gd_health_listing']
          }}
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
    </div>
  );
}