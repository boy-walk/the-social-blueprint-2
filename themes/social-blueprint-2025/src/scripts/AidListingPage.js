import React, { useMemo } from "react";
import { Breadcrumbs } from "./Breadcrumbs";
import { RelatedContentCard } from "./RelatedContentCard";
import { Button } from "./Button";
import { GlobeIcon, MailboxIcon, PhoneCallIcon } from "@phosphor-icons/react";
import { ShareButton } from "./ShareButton";
import { ExploreByTheme } from "./ExploreByTheme";
import PillTag from "./PillTag";

export default function AidListingPage({ props }) {
  const {
    title = "",
    date = "",
    author = {},
    breadcrumbs = [],
    contact = {},
    related = [],
  } = props || {};

  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-AU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : "";

  const gdHtml = useMemo(() => {
    const node = document.getElementById("aid-gd-html");
    if (!node) return {};
    try {
      return JSON.parse(node.textContent || "{}");
    } catch {
      return {};
    }
  }, []);

  return (
    <main className="bg-schemesSurface text-schemesOnSurface">
      <div className="p-6 md:p-8 lg:p-12">
        <div className="lg:max-w-[1600px] sm:max-w-[640px] md:max-w-[640px] mx-auto px-0 lg:px-16">
          <Breadcrumbs items={breadcrumbs} />
          <div className="flex flex-col lg:flex-row lg:gap-16">
            <div className="flex-[3] min-w-0 space-y-4">
              <header className="space-y-1 lg:space-y-2">
                <h1 className="Blueprint-headline-small md:Blueprint-headline-medium lg:Blueprint-headline-large leading-tight py-3">
                  {title}
                </h1>
                <div className="flex flex-row justify-between">
                  <div className="flex items-center gap-4">
                    {author?.avatar ? (
                      <img
                        src={author.avatar}
                        alt={author?.name || ""}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : null}
                    <div className="flex flex-col gap-1">
                      <div className="lg:Blueprint-title-medium">
                        {author?.name || ""}
                      </div>
                      <div className="Blueprint-label-large text-schemesOnSurfaceVariant">
                        {formattedDate}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row justify-end gap-1">
                    {contact.website && (
                      <Button
                        variant="tonal"
                        onClick={() => { window.open(contact.website, "_blank") }}
                        className="whitespace-nowrap"
                        label="Website"
                        icon={<GlobeIcon size={22} />}
                      />
                    )}
                    {contact.email && (
                      <Button
                        variant="tonal"
                        onClick={() => { window.location.href = `mailto:${contact.email}` }}
                        className="whitespace-nowrap"
                        label="Email"
                        icon={<MailboxIcon size={22} />}
                      />
                    )}
                    {contact.phone && (
                      <Button
                        variant="tonal"
                        onClick={() => { window.location.href = `tel:${contact.phone}` }}
                        className="whitespace-nowrap"
                        label="Call"
                        icon={<PhoneCallIcon size={22} />}
                      />
                    )}
                    <ShareButton
                      title={title}
                      summary=""
                      size="lg"
                      url={typeof window !== "undefined" ? window.location.href : undefined}
                    />
                  </div>
                </div>
              </header>

              {/* GD EXACT DATA */}
              {gdHtml.notifications && (
                <div className="!px-0" dangerouslySetInnerHTML={{ __html: gdHtml.notifications }} />
              )}

              {gdHtml.taxonomies && (
                <section
                  className="sbp-gd-chips !px-0"
                  dangerouslySetInnerHTML={{ __html: gdHtml.taxonomies }}
                />
              )}

              {gdHtml.tabs && (
                <section
                  className="rounded-xl !px-0"
                  dangerouslySetInnerHTML={{ __html: gdHtml.tabs }}
                />
              )}
            </div>

            <aside className="w-full lg:w-auto space-y-4 lg:sticky lg:top-16 flex-1 min-w-70 mt-10 lg:mt-0">
              <section>
                <h2 className="Blueprint-headline-small-emphasized text-schemesOnSurfaceVariant p-2">
                  Related Content
                </h2>
                <div className="rounded-lg flex items-stretch justify-center">
                  <div className="flex flex-col gap-2 w-full">
                    {Array.isArray(related) && related.length > 0 ? (
                      related.map((item) => (
                        <RelatedContentCard
                          key={item.id}
                          image={item.thumbnail}
                          title={item.title}
                          href={item.href}
                        />
                      ))
                    ) : (
                      <p className="text-schemesOnSurfaceVariant">
                        No related content available.
                      </p>
                    )}
                    <a href="/topics" className="mt-1">
                      <div className="Blueprint-label-large underline text-schemesPrimary p-2">
                        Explore all topics
                      </div>
                    </a>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </div>
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
