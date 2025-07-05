import React from 'react';

export default function PodcastPage() {
  return (
    <div className="flex gap-16">
        <div className="max-w-7xl mx-auto flex flex-col flex-3 gap-16">
        {/* Podcast Heading & Meta */}
        <header className="flex flex-col gap-4 text-left">
            <h1 className="Blueprint-headline-large">Podcast Title Placeholder</h1>
            <p className="Blueprint-label-large text-schemesOnSurfaceVariant">Interview with Guest Name · July 2025</p>
        </header>

        {/* Video/Audio or Image Embed */}
        <div className="w-full aspect-video bg-white rounded-xl shadow-md flex items-center justify-center">
            <span className="text-schemesOutline">Post Embed Placeholder</span>
        </div>

        {/* Description Text */}
        <section className="Blueprint-body-large text-schemesOnSurface max-w-2xl mx-auto text-left">
            <p className="mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nec justo nec sapien ultricies viverra.
            </p>
            <p>
            This would be the description or transcript of the podcast episode. You can render this dynamically from WP.
            </p>
        </section>

        {/* More Interviews */}
        <section className="flex flex-col gap-4">
            <h2 className="Blueprint-title-medium">More Interviews</h2>
            <div className="bg-white rounded-lg h-64 shadow-inner flex items-center justify-center">
            <span className="text-schemesOutline">More interviews placeholder</span>
            </div>
        </section>
        </div>
        <div className="flex-1 w-full h-full bg-schemesSurfaceVariant rounded-lg shadow-md p-6">
                    {/* Related Content */}
        <section className="flex flex-col gap-4">
            <h2 className="Blueprint-title-medium">Related Content</h2>
            <div className="bg-white rounded-lg h-64 shadow-inner flex items-center justify-center">
            <span className="text-schemesOutline">Related content placeholder</span>
            </div>
        </section>
        </div>
    </div>
  );
}
