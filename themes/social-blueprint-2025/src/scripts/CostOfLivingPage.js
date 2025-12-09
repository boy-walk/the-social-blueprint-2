import React from "react";
import PillTag from "./PillTag";
import { ShareButton } from "./ShareButton";
import { RelatedContentCard } from "./RelatedContentCard";
import { ExploreByTheme } from "./ExploreByTheme";

const colProseCSS = `
/* Scope styles to this page only */
.sbp-col-prose { color: var(--schemesOnSurface); }
.sbp-col-prose h2 { margin: 1.25rem 0 .5rem; font-weight: 700; }

/* Base list reset (opt-out with .unstyled-list on a UL in the editor) */
.sbp-col-prose ul:not(.unstyled-list) {
  list-style: none;
  padding-left: 0;
  margin-left: 0;
  display: grid;
  grid-template-columns: 1fr;           /* sm: 1 column */
  gap: .65rem .9rem;
}
@media (min-width: 768px) {             /* md: 2 columns */
  .sbp-col-prose ul:not(.unstyled-list) {
    grid-template-columns: 1fr 1fr;
  }
}
@media (min-width: 1280px) {            /* xl+: 3 columns */
  .sbp-col-prose ul:not(.unstyled-list) {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

/* List item “pill” (top-aligned content) */
.sbp-col-prose ul:not(.unstyled-list) > li {
  position: relative;
  padding: .7rem 1rem .7rem 3rem;       /* more space between icon and text */
  border-radius: .85rem;
  line-height: 1.25;
}

/* Top-aligned check tile: larger, with bigger radius */
.sbp-col-prose ul:not(.unstyled-list) > li::before {
  content: "✓";
  position: absolute;
  left: .75rem;
  top: .7rem;                           /* align to top, not middle */
  transform: none;
  width: 1.85rem;                       /* bigger tile */
  height: 1.85rem;
  border-radius: .6rem;                 /* larger radius */
  display: grid;
  place-items: center;
  font-size: .95rem;
  font-weight: 700;
  color: var(--schemesOnSecondaryContainer);
  background: var(--schemesSecondaryFixed);
}

/* Variant: .chiplist (no icon; tighter pill) */
.sbp-col-prose ul.chiplist > li { padding-left: 1rem; }
.sbp-col-prose ul.chiplist > li::before { content: none; }

/* Variant: .checklist (explicit; same as default) */
.sbp-col-prose ul.checklist > li::before { content: "✓"; }
`;

export default function CostOfLivingPage({
  title,
  date,
  author,              // { name, avatar }
  categories = [],     // [ { name, link } ]
  featuredImage,       // url
  contentHtml,         // raw HTML from the editor
  relatedContent = [], // [ { id, title, href, thumbnail } ]
  pdfFile,             // url
  breadcrumbs = [],    // [ { label, url } ]
}) {
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-AU", { year: "numeric", month: "long", day: "numeric" })
    : "";

  return (
    <main className="bg-schemesSurface text-schemesOnSurface">
      {/* Page-scoped CSS */}
      <style dangerouslySetInnerHTML={{ __html: colProseCSS }} />

      <div className="p-6 md:p-8 lg:p-12">
        <div className="lg:max-w-[1600px] sm:max-w-[640px] md:max-w-[640px] mx-auto px-0 lg:px-16">
          <div className="flex flex-col lg:flex-row lg:gap-16">
            {/* Main */}
            <div className="flex-1 min-w-0 space-y-5 lg:space-y-6">
              <h1 className="Blueprint-headline-small md:Blueprint-headline-medium lg:Blueprint-headline-large leading-tight">
                {title}
              </h1>

              {pdfFile && (
                <div className="rounded-xl overflow-hidden shadow-md mb-6">
                  <iframe
                    src={`${pdfFile}#toolbar=0&navpanes=0&view=FitH`}
                    className="w-full h-[620px] md:h-[720px] border-0"
                    loading="lazy"
                    title="PDF"
                  />
                </div>
              )}

              {/* Author + share */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {author?.avatar && (
                    <img src={author.avatar} alt="" className="w-10 h-10 rounded-full" />
                  )}
                  <div className="flex flex-col gap-0.5">
                    <div className="lg:Blueprint-title-medium">{author?.name || ""}</div>
                    {formattedDate && (
                      <div className="Blueprint-label-large text-schemesOnSurfaceVariant">{formattedDate}</div>
                    )}
                  </div>
                </div>

                <ShareButton
                  title={title}
                  summary=""
                  url={typeof window !== "undefined" ? window.location.href : undefined}
                />
              </div>

              {/* Editor content (lists styled via .sbp-col-prose rules above) */}
              <section
                className="sbp-col-prose lg:Blueprint-body-large md:Blueprint-body-medium sm:Blueprint-body-small text-schemesOnSurfaceVariant break-words
                                [&_ul]:list-disc [&_ul]:pl-5 [&_a]:underline
                                [&_img]:max-w-full [&_img]:h-auto [&_img]:block
                                [&_figure]:max-w-full [&_figure]:overflow-hidden
                                [&_p]:mb-4"
                dangerouslySetInnerHTML={{ __html: contentHtml || "" }}
              />
              {/* Chips */}
              {categories?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {categories.map((c, i) => (
                    <a key={i} href={c.link || "#"} className="no-underline">
                      <span className="px-3 py-1.5 rounded-full bg-[var(--schemesSurfaceContainerHigh)] text-[var(--schemesOnSurface)] Blueprint-label-small">
                        {c.name}
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Rail */}
            <aside className="w-full lg:w-[360px] space-y-4 mt-10 lg:mt-0">
              <h2 className="Blueprint-headline-small-emphasized text-schemesOnSurfaceVariant p-2">
                Related Content
              </h2>
              <div className="space-y-3">
                {relatedContent.length > 0 ? (
                  relatedContent.map((item) => (
                    <RelatedContentCard
                      key={item.id}
                      image={item.thumbnail}
                      title={item.title}
                      href={item.href}
                    />
                  ))
                ) : (
                  <p className="text-schemesOnSurfaceVariant">No related content available.</p>
                )}
                <a href="/topics" className="mt-1">
                  <div className="Blueprint-label-large underline text-schemesPrimary p-2">
                    Explore all topics
                  </div>
                </a>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Explore by Theme band (optional) */}
      <div className="bg-schemesPrimaryFixed w-full">
        <div className="p-6 md:p-8 lg:p-16 flex flex-col max-w-[1600px] mx-auto gap-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="lg:Blueprint-headline-large-emphasized md:Blueprint-title-medium-emphasized Blueprint-title-small-emphasized italic">
              Explore more by
            </div>
            <PillTag label="Theme" backgroundColor="schemesPrimaryContainer" />
          </div>
          <div className="Blueprint-body-small md:Blueprint-body-medium lg:Blueprint-body-large text-schemesOnSurface mb-8 lg:mb-12 max-w-[68ch]">
            From support services to creative culture, start where you're curious.
          </div>
          <ExploreByTheme />
        </div>
      </div>
    </main>
  );
}
