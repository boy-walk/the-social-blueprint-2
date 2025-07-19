import React from "react";
import { ContentCard } from "./ContentCard";
import { SimpleCard } from "./SimpleCard";
import { Card } from "./Card";
import { ArrowIcon } from "../../assets/icons/arrow";
import { DetailedCard } from "./DetailedCard";
import { ExploreByTheme } from "./ExploreByTheme";
import PillTag from "./PillTag";
import { CellTowerIcon, MailboxIcon, CalendarDotIcon, TrendUpIcon, StarIcon } from "@phosphor-icons/react";

export function CommunityHubPage({ featured, messageBoard, events, browseAll }) {
    return (
        <div>
            <div className="flex px-12 h-16 py-3 items-center bg-schemesPrimaryFixed Blueprint-label-large text-schemesLightPrimary">
                Breadcrumb placeholder
            </div>
            <div className="bg-schemesPrimaryFixed py-8 px-4 sm:px-8 lg:px-16">
                <div className="flex pb-4 justify-between items-center">
                    <div className="flex flex-col gap-2">
                        <h1 className="Blueprint-display-small-emphasized text-schemesOnSurface mb-3">
                            Community Connection
                        </h1>
                        <p className="text-schemesOnPrimaryFixedVariant Blueprint-title-large max-w-xl">
                            Stay informed and connected. Find community jobs, volunteer opportunities,
                            local notices, and informal support through our active message boards and groups.
                        </p>
                    </div>
                    <div className="border border-black p-2 h-45 w-65 border-dotted">

                    </div>
                </div>
                {/* Quick Links */}
                <div className="pt-4">
                    <h2 className="Blueprint-headline-medium text-schemesOnSurface mb-4 mt-4">Quick Links</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mt-6 min-h-[10rem]">
                        <Card>
                            <div className="flex flex-col gap-2 h-full justify-between items-start p-4 w-full">
                                <div className="bg-schemesPrimaryFixed rounded-[12px] p-1" >
                                    <MailboxIcon size={22} />
                                </div>
                                <div className="Blueprint-title-medium">
                                    Community message board
                                </div>

                            </div>
                        </Card>
                        <Card>
                            <div className="flex flex-col gap-2 h-full justify-between items-start p-4 w-full">
                                <div className="bg-schemesPrimaryFixed rounded-[12px] p-1" >
                                    <CellTowerIcon size={22} />
                                </div>
                                <div className="Blueprint-title-medium">
                                    Stories and interviews
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="flex flex-col gap-2 h-full justify-between items-start p-4 w-full">
                                <div className="bg-schemesPrimaryFixed rounded-[12px] p-1" >
                                    <CalendarDotIcon size={22} />
                                </div>
                                <div className="Blueprint-title-medium">
                                    Upcoming community events
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="flex flex-col gap-2 h-full justify-between items-start p-4 w-full">
                                <div className="bg-schemesPrimaryFixed rounded-[12px] p-1" >
                                    <TrendUpIcon size={22} />
                                </div>
                                <div className="Blueprint-title-medium">
                                    Submit your own story
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="flex flex-col gap-2 h-full justify-between items-start p-4 w-full">
                                <div className="bg-schemesPrimaryFixed rounded-[12px] p-1" >
                                    <StarIcon size={22} />
                                </div>
                                <div className="Blueprint-title-medium">
                                    Nominate someone
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            <div className="py-16 px-4 sm:px-8 lg:px-16">
                <h2 className="Blueprint-headline-medium text-schemesOnSurface mb-6">
                    Featured in Community
                </h2>

                <div className="flex flex-col lg:flex-row gap-3 lg:gap-3 mx-auto w-full">
                    {/* Left column - hero */}
                    {featured[0] && (
                        <div className="flex-1 flex">
                            <ContentCard
                                image={featured[0].thumbnail}
                                type={featured[0].post_type}
                                badge={
                                    featured[0].post_type.toLowerCase() === "podcast"
                                        ? "Podcast"
                                        : featured[0].post_type.toLowerCase() === "blog"
                                            ? "Blog"
                                            : featured[0].post_type.toLowerCase() === "event"
                                                ? "Event"
                                                : featured[0].post_type.toLowerCase() === "article" ?
                                                    "Article"
                                                    : null
                                }
                                href={featured[0].permalink}
                            />
                        </div>
                    )}

                    {/* Right column - stacked simple cards */}
                    <div className="flex-1 flex flex-col gap-3">
                        {featured.slice(1).map((post, i) => (
                            <DetailedCard
                                key={i}
                                image={post.thumbnail}
                                category={post.post_type}
                                title={post.title}
                                description={post.excerpt}
                                author={post.author}
                                date={post.date}
                                href={post.permalink}
                                buttonText="Read more"
                            />
                        ))}
                    </div>
                </div>

            </div>

            {/* Message Board */}
            <div className="py-16 px-16 sm:px-8 lg:px-16">
                <div className="flex items-center gap-2 mb-4">
                    <h2 className="Blueprint-headline-medium text-schemesOnSurface">Recent message board posts</h2>
                    <ArrowIcon />
                </div>

                <div className="flex flex-wrap gap-4 sm:gap-6 justify-start items-stretch">
                    {messageBoard.map((post) => (
                        <div
                            key={post.id}
                            className="w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(33%-18px)] flex-grow"
                        >
                            <Card>
                                <div className="flex flex-col gap-2 items-start p-4 w-full">
                                    <div className="rounded-md px-3 py-1.5 bg-schemesSurfaceContainer Blueprint-label-small">
                                        Health & Wellbeing
                                    </div>
                                    <div>
                                        {post.title && (
                                            <h3 className="Blueprint-title-medium text-schemesOnSurface mb-2
                                        line-clamp-2">
                                                {post.title}
                                            </h3>
                                        )}
                                    </div>
                                    <div className="text-schemesOnSurfaceVariant Blueprint-label-medium">
                                        {post.excerpt}
                                    </div>
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>

            {/* Events */}
            <div className="py-16 px-16 sm:px-8 lg:px-16 bg-schemesSecondaryFixed">
                <div className="flex items-center gap-2 mb-6">
                    <h2 className="Blueprint-headline-medium text-schemesOnSecondaryFixed">What's on this week</h2>
                    <ArrowIcon className="text-schemesOnSecondaryFixed" />
                </div>
                <div className="flex flex-wrap gap-4 sm:gap-6 justify-start items-stretch">
                    {events.map((event, index) => (
                        <div
                            key={`event.id-${index}`}
                            className="w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] flex-grow"
                        >
                            <ContentCard
                                image={event.thumbnail}
                                title={event.title}
                                type="Event"
                                subtitle={event.date}
                                href={event.permalink}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Browse All */}
            <div className="py-16 px-16 sm:px-8 lg:px-16">
                <h2 className="Blueprint-headline-medium text-schemesOnSurface mb-4">Browse all community</h2>
                {console.log(browseAll)}
                <div className="flex flex-wrap gap-4 sm:gap-6 justify-start items-stretch">
                    {browseAll.map((post) => (
                        <div
                            key={post.id}
                            className="w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] max-w-[280px] flex-grow"
                        >
                            <ContentCard
                                image={post.thumbnail}
                                title={post.title}
                                type={post.post_type}
                                subtitle={post.date}
                                href={post.permalink}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <div className="py-16 px-16 sm:px-8 lg:px-16 bg-schemesPrimaryFixed flex flex-col gap-4">
                <div className="flex gap-3 items-center">
                    <div className="Blueprint-headline-medium italic">
                        Explore more by
                    </div>
                    <PillTag label="Theme" backgroundColor="#007ea8" />
                </div>
                <div className="Blurprint-title-large mb-6 text-schemesOnSurface">
                    From support services to creative culture, start where you're curious.
                </div>
                <ExploreByTheme />
            </div>

        </div>
    );
}
