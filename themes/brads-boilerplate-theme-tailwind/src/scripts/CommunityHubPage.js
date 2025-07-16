import React from "react";
import { ContentCard } from "./ContentCard";

export function CommunityHubPage() {
    return (
        <div>
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
                <div className="pt-4">
                    <h2 className="Blueprint-headline-medium text-schemesOnSurface mb-4 mt-4">Quick Links</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            "Community message board",
                            "Stories and Interviews",
                            "Upcoming community events",
                            "Submit your own story",
                        ].map((text, i) => (
                            <div
                                key={i}
                                className="bg-white border border-outlineVariant rounded-lg p-4 text-center text-sm Blueprint-label-large"
                            >
                                {text}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="py-8 px-4 sm:px-8 lg:px-16">
                <h2 className="Blueprint-headline-medium text-schemesOnSurface mb-4">Featured in Community</h2>
                <div className="flex flex-wrap gap-6 justify-start items-stretch">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] max-w-[280px] flex-grow">
                            <ContentCard
                                image="/placeholder.jpg"
                                title="Placeholder Featured"
                                type="Podcast"
                                subtitle="Host Name | 42 min"
                                badge="New Interview"
                                href="#"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="py-8 px-4 sm:px-8 lg:px-16">
                <h2 className="Blueprint-headline-medium text-schemesOnSurface mb-4">Recent message board posts</h2>
                <div className="flex flex-wrap gap-6 justify-start items-stretch">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] max-w-[280px] flex-grow">
                            <ContentCard
                                image="/placeholder.jpg"
                                title="Youth Art Competition Update"
                                type="Post"
                                subtitle="Community | 2 days ago"
                                badge="Notice"
                                href="#"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="py-8 px-4 sm:px-8 lg:px-16 bg-[#E6E8FD]">
                <h2 className="Blueprint-headline-medium text-schemesOnSurface mb-4">What's on this week</h2>
                <div className="flex flex-wrap gap-6 justify-start items-stretch">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] max-w-[280px] flex-grow">
                            <ContentCard
                                image="/placeholder.jpg"
                                title="Enough is Enough: Stand for Peace in Melbourne"
                                type="Event"
                                subtitle="Thu, May 14 | 6PM | Melbourne CBD"
                                badge="Event"
                                href="#"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="py-8 px-4 sm:px-8 lg:px-16">
                <h2 className="Blueprint-headline-medium text-schemesOnSurface mb-4">Browse all community</h2>
                <div className="flex flex-wrap gap-6 justify-start items-stretch">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] max-w-[280px] flex-grow">
                            <ContentCard
                                image="/placeholder.jpg"
                                title="Post Title Placeholder"
                                type="Event"
                                subtitle="Melbourne CBD"
                                badge="Event"
                                href="#"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
