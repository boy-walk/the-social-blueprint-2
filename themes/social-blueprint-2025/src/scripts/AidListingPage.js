import React, { useMemo } from "react";
import { Breadcrumbs } from "./Breadcrumbs";
import { RelatedContentCard } from "./RelatedContentCard";
import { Button } from "./Button";
import {
  GlobeIcon,
  MailboxIcon,
  PhoneCallIcon,
  MapPinIcon,
} from "@phosphor-icons/react";
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
    tags = [],
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

  const hasContactInfo =
    contact.website || contact.email || contact.phone || contact.address;

  return (
    <main className="bg-schemesSurface text-schemesOnSurface">
      <div className="p-4 sm:p-6 md:p-8 lg:p-12">
        <div className="max-w-[1600px] mx-auto px-0 lg:px-16">
          <Breadcrumbs items={breadcrumbs} />
          <div className="flex flex-col lg:flex-row lg:gap-16">
            <div className="flex-[3] min-w-0 space-y-4">
              <header className="space-y-3 lg:space-y-4">
                <h1 className="Blueprint-title-large sm:Blueprint-headline-small md:Blueprint-headline-medium lg:Blueprint-headline-large leading-tight py-2 lg:py-3">
                  {title}
                </h1>

                {gdHtml.notifications && (
                  <div
                    className="!px-0 break-words
                                [&_ul]:list-disc [&_ul]:pl-5 [&_a]:underline
                                [&_img]:max-w-full [&_img]:h-auto [&_img]:block
                                [&_figure]:max-w-full [&_figure]:overflow-hidden
                                [&_p]:mb-4"
                    dangerouslySetInnerHTML={{ __html: gdHtml.notifications }}
                  />
                )}

                <div className="flex items-center gap-3">
                  {author?.avatar && (
                    <img
                      src={author.avatar}
                      alt={author?.name || ""}
                      className="w-10 h-10 rounded-full flex-shrink-0"
                    />
                  )}
                  <div className="flex flex-col gap-0.5">
                    <div className="Blueprint-title-small lg:Blueprint-title-medium">
                      {author?.name || ""}
                    </div>
                    <div className="Blueprint-label-medium lg:Blueprint-label-large text-schemesOnSurfaceVariant">
                      {formattedDate}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row flex-wrap gap-2">
                  {contact.website && (
                    <Button
                      variant="tonal"
                      onClick={() => window.open(contact.website, "_blank")}
                      className="w-full sm:w-auto justify-center sm:justify-start"
                      label="Website"
                      icon={<GlobeIcon size={22} />}
                    />
                  )}
                  {contact.email && (
                    <Button
                      variant="tonal"
                      onClick={() =>
                        (window.location.href = `mailto:${contact.email}`)
                      }
                      className="w-full sm:w-auto justify-center sm:justify-start"
                      label="Email"
                      icon={<MailboxIcon size={22} />}
                    />
                  )}
                  {contact.phone && (
                    <Button
                      variant="tonal"
                      onClick={() =>
                        (window.location.href = `tel:${contact.phone}`)
                      }
                      className="w-full sm:w-auto justify-center sm:justify-start"
                      label="Call"
                      icon={<PhoneCallIcon size={22} />}
                    />
                  )}
                  <ShareButton
                    title={title}
                    summary=""
                    size="lg"
                    url={
                      typeof window !== "undefined"
                        ? window.location.href
                        : undefined
                    }
                  />
                </div>
              </header>

              {gdHtml.taxonomies && (
                <section
                  className="sbp-gd-chips !px-0"
                  dangerouslySetInnerHTML={{ __html: gdHtml.taxonomies }}
                />
              )}

              {gdHtml.tabs && (
                <section
                  className="rounded-xl !px-0 [&_iframe]:w-full [&_iframe]:h-auto [&_iframe]:aspect-video"
                  dangerouslySetInnerHTML={{ __html: gdHtml.tabs }}
                />
              )}

              {hasContactInfo && (
                <section className="rounded-xl bg-schemesSurfaceContainerLow p-4 sm:p-6 space-y-4">
                  <h2 className="Blueprint-title-medium-emphasized lg:Blueprint-title-large-emphasized">
                    Contact Details
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {contact.address && (
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-schemesSurfaceContainerHigh flex-shrink-0">
                          <MapPinIcon
                            size={20}
                            className="text-schemesOnSurfaceVariant"
                          />
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="Blueprint-label-large text-schemesOnSurfaceVariant">
                            Address
                          </span>
                          <span className="Blueprint-body-medium text-schemesOnSurface">
                            {contact.address}
                          </span>
                        </div>
                      </div>
                    )}

                    {contact.phone && (
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-schemesSurfaceContainerHigh flex-shrink-0">
                          <PhoneCallIcon
                            size={20}
                            className="text-schemesOnSurfaceVariant"
                          />
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="Blueprint-label-large text-schemesOnSurfaceVariant">
                            Phone
                          </span>
                          <a
                            href={`tel:${contact.phone}`}
                            className="Blueprint-body-medium text-schemesPrimary hover:underline"
                          >
                            {contact.phone}
                          </a>
                        </div>
                      </div>
                    )}

                    {contact.email && (
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-schemesSurfaceContainerHigh flex-shrink-0">
                          <MailboxIcon
                            size={20}
                            className="text-schemesOnSurfaceVariant"
                          />
                        </div>
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span className="Blueprint-label-large text-schemesOnSurfaceVariant">
                            Email
                          </span>
                          <a
                            href={`mailto:${contact.email}`}
                            className="Blueprint-body-medium text-schemesPrimary hover:underline break-all"
                          >
                            {contact.email}
                          </a>
                        </div>
                      </div>
                    )}

                    {contact.website && (
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-schemesSurfaceContainerHigh flex-shrink-0">
                          <GlobeIcon
                            size={20}
                            className="text-schemesOnSurfaceVariant"
                          />
                        </div>
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span className="Blueprint-label-large text-schemesOnSurfaceVariant">
                            Website
                          </span>
                          <a
                            href={contact.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="Blueprint-body-medium text-schemesPrimary hover:underline break-all"
                          >
                            {contact.website.replace(/^https?:\/\//, "")}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}
            </div>

            <aside className="w-full lg:w-auto space-y-4 lg:sticky lg:top-16 lg:self-start flex-1 lg:min-w-70 lg:max-w-80 mt-8 lg:mt-0">
              <section>
                <h2 className="Blueprint-title-medium-emphasized lg:Blueprint-headline-small-emphasized text-schemesOnSurfaceVariant p-2">
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
                          description={item.description}
                        />
                      ))
                    ) : (
                      <p className="text-schemesOnSurfaceVariant Blueprint-body-medium p-2">
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
        <div className="p-4 sm:p-6 md:p-8 lg:p-16 flex flex-col max-w-[1600px] mx-auto gap-4">
          <div className="flex flex-wrap gap-2 sm:gap-3 items-center">
            <div className="Blueprint-title-medium-emphasized sm:Blueprint-title-large-emphasized lg:Blueprint-headline-large-emphasized italic">
              Explore more by
            </div>
            <PillTag label="Theme" backgroundColor="schemesPrimaryContainer" />
          </div>

          <div className="Blueprint-body-small sm:Blueprint-body-medium lg:Blueprint-body-large text-schemesOnSurface mb-6 sm:mb-8 lg:mb-12 max-w-[68ch]">
            From support services to creative culture, start where you're
            curious.
          </div>

          <ExploreByTheme />
        </div>
      </div>
    </main>
  );
}