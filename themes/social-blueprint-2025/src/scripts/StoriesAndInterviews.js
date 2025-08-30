import React from "react";
import { ArrowIcon } from "../../assets/icons/arrow";
import { ExploreByTheme } from "./ExploreByTheme";
import PillTag from "./PillTag";
import { NewsletterBanner } from "./NewsletterBanner";
import { PostsSlider } from "./PostsSlider";
import CommunityConnectionHubIcon from "../../assets/community-connection-hub.svg";
import BrowseAll from "./BrowseAll";

export function StoriesAndInterviews({ everyBodyHasAStory, candidConversations, blueprintStories, holocaustStories }) {
  return (
    <div>
      <div className="bg-schemesPrimaryFixed">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex p-4 pt-12 md:p-8 lg:px-16 lg:py-8 items-center justify-between">
            <div className="flex flex-col gap-2">
              <h1 className="lg:Blueprint-headline-large-emphasized md:Blueprint-headline-medium-emphasized Blueprint-headline-small-emphasized text-schemesOnSurface mb-3">
                Stories & Interviews
              </h1>
              <p className="text-schemesOnPrimaryFixedVariant Blueprint-body-small md:Blueprint-body-medium lg:Blueprint-body-large max-w-xl">
                Podcasts and written pieces sharing lived experiences, ideas, and reflections from Melbourne's Jewish community.
              </p>
            </div>
            <img src={CommunityConnectionHubIcon} alt="Community Connection Hub" className="lg:block hidden translate-y-10 -translate-x-20" />
          </div>
        </div>
      </div>

      <div className="bg-schemesSurfaceBright">
        <div className="flex flex-col max-w-[1600px] mx-auto lg:p-16 md:p-8 p-4 gap-24 lg:gap-32">
          <div>
            <h2 className="Blueprint-title-small-emphasized md:Blueprint-title-medium-emphasized lg:Blueprint-title-large-emphasized text-schemesOnSurface py-3 mb-4">
              Everybody Has A Story
            </h2>
            <PostsSlider events={everyBodyHasAStory || []} />
          </div>
        </div>
      </div>
      <div className="bg-schemesSurfaceContainerLow">
        <div className="flex flex-col max-w-[1600px] mx-auto lg:p-16 md:p-8 p-4 gap-4 lg:gap-8">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="Blueprint-title-small-emphasized md:Blueprint-title-medium-emphasized lg:Blueprint-title-large-emphasized text-schemesOnSecondaryFixed">Candid Conversations</h2>
            <ArrowIcon className="text-schemesOnSecondaryFixed" />
          </div>
          <PostsSlider events={candidConversations || []} />
        </div>
      </div>
      <div className="bg-schemesSurfaceBright">
        <div className="flex flex-col max-w-[1600px] mx-auto lg:p-16 md:p-8 p-4 gap-4 lg:gap-8">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="Blueprint-title-small-emphasized md:Blueprint-title-medium-emphasized lg:Blueprint-title-large-emphasized text-schemesOnSecondaryFixed">Blueprint Stories</h2>
            <ArrowIcon className="text-schemesOnSecondaryFixed" />
          </div>
          <PostsSlider events={blueprintStories || []} />
        </div>
      </div>
      <div className="bg-schemesSecondaryFixed">
        <div className="flex flex-col max-w-[1600px] mx-auto lg:p-16 md:p-8 p-4 gap-4 lg:gap-8">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="Blueprint-title-small-emphasized md:Blueprint-title-medium-emphasized lg:Blueprint-title-large-emphasized text-schemesOnSecondaryFixed">Holocaust Stories</h2>
            <ArrowIcon className="text-schemesOnSecondaryFixed" />
          </div>
          <PostsSlider events={holocaustStories || []} />
        </div>
      </div>
      <div className="max-w-[1600px] mx-auto">
        <BrowseAll
          title="Browse all stories"
          endpoint="/wp-json/tsb/v1/browse"
          baseQuery={{
            per_page: 10,
            hide_recurring: true,
            post_type: ['podcast', 'article']
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