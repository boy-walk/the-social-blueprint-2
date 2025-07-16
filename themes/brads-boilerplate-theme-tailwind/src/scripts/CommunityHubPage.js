import React from "react";
import { ContentCard } from "./ContentCard";
import { SimpleCard } from "./SimpleCard";

export function CommunityHubPage({ featured, messageBoard, events, browseAll }) {
    return (
        <div>
            {/* Hero Section */}
            <div className="bg-schemesPrimaryFixed py-8 px-4 sm:px-8 lg:px-16">
                <div className="pb-4">
                    <h1 className="Blueprint-display-small-emphasized text-schemesOnSurface mb-3">
                        Community Connection
                    </h1>
                    <p className="text-schemesOnSurfaceVariant Blueprint-body-medium max-w-xl">
                        Stay informed and connected. Find community jobs, volunteer opportunities,
                        local notices, and informal support through our active message boards and groups.
                    </p>
                </div>

                {/* Quick Links */}
                <div className="pt-4">
                    <h2 className="Blueprint-headline-medium text-schemesOnSurface mb-4 mt-4">Quick Links</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mt-6 min-h-[8rem]">
                        <SimpleCard title="Community message board" />
                        <SimpleCard title="Stories and interviews" />
                        <SimpleCard title="Upcoming community events" />
                        <SimpleCard title="Submit your own story" />
                        <SimpleCard title="Nominate someone" />
                    </div>
                </div>
            </div>

            {/* Featured in Community */}
            <div className="py-8 px-4 sm:px-8 lg:px-16 bg-schemesSurface">
                <h2 className="Blueprint-headline-medium text-schemesOnSurface mb-6">Featured in Community</h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Hero Feature */}
                    {featured[0] && (
                        <div className="rounded-lg overflow-hidden shadow-md border border-outlineVariant">
                            <img
                                src={featured[0].thumbnail || "/placeholder.jpg"}
                                alt={featured[0].title}
                                className="w-full h-auto object-cover"
                            />
                            <div className="p-4 bg-white">
                                <span className="text-xs font-semibold bg-schemesSurfaceVariant text-schemesOnSurface px-2 py-1 rounded-full inline-block mb-2">
                                    {featured[0].post_type}
                                </span>
                                <h3 className="text-lg font-semibold text-schemesOnSurface">{featured[0].title}</h3>
                            </div>
                        </div>
                    )}

                    {/* Right Column - Stacked Cards */}
                    <div className="flex flex-col gap-6">
                        {featured.slice(1).map((post, i) => (
                            <SimpleCard
                                key={i}
                                image={post.thumbnail}
                                category={post.post_type}
                                label={post.title}
                                description={post.excerpt}
                                buttonText="Read more"
                                href={post.permalink}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Message Board */}
            <div className="py-8 px-4 sm:px-8 lg:px-16">
                <h2 className="Blueprint-headline-medium text-schemesOnSurface mb-4">Recent message board posts</h2>
                <div className="flex flex-wrap gap-4 sm:gap-6 justify-start items-stretch">
                    {messageBoard.map((post) => (
                        <div
                            key={post.id}
                            className="w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] max-w-[280px] flex-grow"
                        >
                            <ContentCard
                                image={post.thumbnail}
                                title={post.title}
                                type="Notice"
                                subtitle={`Posted on ${post.date}`}
                                href={post.permalink}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Events */}
            <div className="py-8 px-4 sm:px-8 lg:px-16 bg-[#E6E8FD]">
                <h2 className="Blueprint-headline-medium text-schemesOnSurface mb-4">What's on this week</h2>
                <div className="flex flex-wrap gap-4 sm:gap-6 justify-start items-stretch">
                    {events.map((event) => (
                        <div
                            key={event.id}
                            className="w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] max-w-[280px] flex-grow"
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
            <div className="py-8 px-4 sm:px-8 lg:px-16">
                <h2 className="Blueprint-headline-medium text-schemesOnSurface mb-4">Browse all community</h2>
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
        </div>
    );
}
