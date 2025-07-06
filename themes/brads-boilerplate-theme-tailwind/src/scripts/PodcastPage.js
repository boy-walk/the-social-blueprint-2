import React from "react";
import { MoreInterviews } from "./MoreInterviews";

export default function PodcastPage({
    title,
    subtitle,
    videoUrl,
    sections,
    tags,
    moreInterviews
}) {
    return (
        <main className="bg-schemesSurface text-schemesOnSurface py-12 px-4 lg:px-16">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 max-w-7xl mx-auto sm:px-6">
                {/* Left Column: Main Content */}
                <div className="flex-1 space-y-10">
                    {/* Title and Subtitle */}
                    <header className="space-y-2">
                        <h1 className="Blueprint-headline-large leading-tight">{title}</h1>
                        {subtitle && (
                            <p className="Blueprint-body-large text-schemesOnSurfaceVariant">
                                {subtitle}
                            </p>
                        )}
                    </header>

                    {videoUrl && (
                        <div className="w-full aspect-video rounded-xl overflow-hidden shadow-md">
                            <iframe
                                src={videoUrl.replace("watch?v=", "embed/")}
                                title="Podcast Video"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                            ></iframe>
                        </div>
                    )}

                    {/* Post Body */}
                    <section className="space-y-6 max-w-3xl">
                        {sections.map((section, index) => (
                            <div
                                key={index}
                                className="prose [&_ul]:list-disc [&_ul]:pl-5 break-words prose-a:break-all"
                                dangerouslySetInnerHTML={{ __html: section.text }}
                            />
                        ))}
                    </section>

                    {/* Tags */}
                    {tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-4">
                            {tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="bg-schemesSurfaceVariant text-schemesOnSurface px-3 py-1 rounded-full text-sm"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column: Related Content */}
                <aside className="w-full lg:w-80 space-y-4 sticky top-12">
                    <h2 className="Blueprint-headline-small-emphasized">Related Content</h2>
                    <div className="bg-white rounded-lg shadow-inner h-64 flex items-center justify-center">
                        <span className="text-schemesOutline">Related content placeholder</span>
                    </div>
                </aside>
            </div>

            {/* More Interviews aligned with left column */}
            <div className="max-w-7xl mx-auto sm:px-6 mt-20">
                <MoreInterviews items={moreInterviews} />
            </div>
        </main >
    );
}
