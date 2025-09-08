import React from "react";
import { ArrowIcon } from "../../assets/icons/arrow";
import { ExploreByTheme } from "./ExploreByTheme";
import PillTag from "./PillTag";
import { NewsletterBanner } from "./NewsletterBanner";
import { PostsSlider } from "./PostsSlider";
import CommunityConnectionHubIcon from "../../assets/community-connection-hub.svg";
import BrowseAll from "./BrowseAll";
import { Breadcrumbs } from "./Breadcrumbs";

export function StoriesAndInterviews({ everyBodyHasAStory, candidConversations, blueprintStories, holocaustStories, breadcrumbs = [] }) {
  return (
    <div>
      <div className="bg-schemesPrimaryFixed">
        <div className="max-w-[1600px] mx-auto">
          <div className="hidden md:block md:px-8 md:pt-8 lg:px-16 lg:pt-8">
            <Breadcrumbs items={breadcrumbs} textColour="text-schemesPrimary" />
          </div>
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
          <PostsSlider events={everyBodyHasAStory || []} title="Everybody has a story" description="Every person has a unique journey worth sharing. In this podcast we shine a light on individual experiences, reminding us of the many paths that make up our community." viewAllUrl="/podcasts/?series=everybody-has-a-story" />
        </div>
      </div>
      <div className="bg-schemesSurfaceContainerLow">
        <div className="flex flex-col max-w-[1600px] mx-auto lg:p-16 md:p-8 p-4 gap-4 lg:gap-8">
          <PostsSlider events={candidConversations || []} title="Candid Conversations" description="Open, thoughtful discussions with people from across Jewish life in Melbourne. These conversations explore challenges, hopes, and perspectives with honesty and care." viewAllUrl="/podcasts/?series=candid-conversations" />
        </div>
      </div>
      <div className="bg-schemesSurfaceBright">
        <div className="flex flex-col max-w-[1600px] mx-auto lg:p-16 md:p-8 p-4 gap-4 lg:gap-8">
          <PostsSlider events={blueprintStories || []} title="Blueprint Stories" description="Articles and reflections that capture culture, identity, and everyday community life. From practical advice to inspiring voices, discover writing that informs and uplifts." viewAllUrl="/articles/?article_category=blueprint-stories" />
        </div>
      </div>
      <div className="bg-schemesSecondaryFixed">
        <div className="flex flex-col max-w-[1600px] mx-auto lg:p-16 md:p-8 p-4 gap-4 lg:gap-8">
          <PostsSlider events={holocaustStories || []} title="Holocaust stories" description="First-hand accounts and interviews that honour memory, resilience, and the importance of sharing these experiences with future generations." viewAllUrl="/articles/?article_category=holocaust-stories" />
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