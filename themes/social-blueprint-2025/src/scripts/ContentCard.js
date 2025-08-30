import React from "react";
import { Card } from "./Card";

export function ContentCard({
  image,
  title,
  date,
  subtitle,
  badge,
  href,
  author,
  fullHeight = false,
  fullWidth = false,
}) {
  const cardStyles = `
    group
    flex flex-col
    ${fullHeight ? "h-full" : ""}
    ${fullWidth ? "w-full" : ""}
    p-2
  `.trim();

  return (
    <Card href={href} styles={cardStyles}>
      <div className="flex h-full min-h-0 flex-col">
        {/* IMAGE — fixed area; only parallax/scroll effect */}
        <div
          className={[
            "relative overflow-hidden rounded-lg bg-gray-100",
            fullHeight ? "aspect-[1] max-h-50 lg:max-h-100" : "aspect-[1.6] max-h-40 lg:max-h-75",
          ].join(" ")}
        >
          {image && (
            <img
              src={image}
              alt={title}
              className="
                h-full w-full object-cover
                transition-transform duration-700 ease-out will-change-transform
                group-hover:-translate-y-[6%] group-hover:scale-[1.04]
              "
            />
          )}
          {badge && (
            <span className="absolute left-2 top-2 z-10 rounded bg-schemesSurfaceContainer px-4 py-1.5 Blueprint-label-small font-medium">
              {badge}
            </span>
          )}
        </div>

        {/* TEXT — fixed HEIGHT; inner content slides up on hover (no layout shift) */}
        {title && (
          <div
            className="
              relative p-4 pt-3
              /* lock the text area height so the card never changes size */
              h-[112px] md:h-[116px] lg:h-[128px]
              overflow-hidden
            "
          >
            {/* subtle fade at bottom when not hovering */}
            <div
              className="
                pointer-events-none absolute inset-x-0 bottom-0 h-8
                opacity-100 transition-opacity duration-200
                group-hover:opacity-0
              "
            />

            {/* move the whole stack up on hover to reveal more lines,
               but keep the container height fixed */}
            <div className="transition-transform duration-300 ease-out group-hover:-translate-y-1.5">
              {date && (
                <div className="md:Blueprint-body-small lg:Blueprint-body-medium text-schemesOnSurfaceVariant">
                  {date}
                </div>
              )}

              <h3
                className="
                  Blueprint-body-large-emphasized md:Blueprint-body-small-emphasized
                  line-clamp-2
                  group-hover:line-clamp-none
                "
              >
                {title}
              </h3>

              {subtitle && (
                <p
                  className="
                    text-sm text-schemesOnSurfaceVariant
                    line-clamp-2
                    group-hover:line-clamp-none
                  "
                >
                  {subtitle}
                </p>
              )}

              {author && (
                <p className="mt-1 Blueprint-body-small lg:Blueprint-body-medium text-schemesOnSurfaceVariant">
                  {author}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
