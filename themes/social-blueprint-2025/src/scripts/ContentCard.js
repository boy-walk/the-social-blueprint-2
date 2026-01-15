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
  shadow = false,
}) {
  const cardStyles = `
    group
    flex flex-col
    ${shadow ? "shadow-3x3" : ""}
    ${fullHeight ? "h-full" : ""}
    ${fullWidth ? "w-full" : ""}
    p-2
    transition-all duration-300 ease-in-out
    hover:shadow-lg
    hover:-translate-y-1
    transform-gpu
    [transform-origin:center]
  `.trim();

  return (
    <Card href={href} styles={cardStyles}>
      <div className="flex h-full min-h-0 flex-col">
        <div
          className="relative overflow-hidden rounded-lg bg-gray-100 aspect-[4/3] w-full"
        >
          {image && (
            <img
              src={image}
              alt={title}
              className="
                h-full w-full
                object-cover
                transition-transform duration-300 ease-in-out
                group-hover:scale-105
                [transform-origin:center]
              "
              loading="lazy"
              decoding="async"
            />
          )}
          {badge && (
            <span className="absolute left-1 top-1 z-10 rounded bg-schemesPrimary text-schemesOnPrimary px-1.5 py-1 Blueprint-label-small font-medium transition-colors duration-200 group-hover:bg-blue-100">
              {badge}
            </span>
          )}
        </div>

        {title && (
          <div
            className="
              relative p-1 pt-2
              h-auto md:h-[116px] lg:h-[128px]
              md:overflow-hidden
            "
          >
            <div
              className="
                pointer-events-none absolute inset-x-0 bottom-0 h-8
                opacity-0 md:opacity-100 transition-opacity duration-200
                md:group-hover:opacity-0
              "
            />
            <div className="flex flex-col gap-1 transition-transform duration-200 ease-in-out">
              {date && (
                <div className="Blueprint-body-small md:Blueprint-body-small lg:Blueprint-body-medium text-schemesOnSurfaceVariant transition-colors duration-200 group-hover:text-schemesOnSurface">
                  {date}
                </div>
              )}

              <h3
                className="
                  Blueprint-body-medium-emphasized md:Blueprint-body-medium-emphasized lg:Blueprint-body-large-emphasized
                  line-clamp-2
                  transition-colors duration-200 group-hover:text-[var(--schemesPrimary)]
                "
              >
                {title}
              </h3>

              {subtitle && (
                <p
                  className="
                    Blueprint-body-small md:Blueprint-body-medium lg:Blueprint-body-medium text-schemesOnSurfaceVariant
                    line-clamp-3
                    transition-colors duration-200 group-hover:text-schemesOnSurface
                  "
                >
                  {subtitle}
                </p>
              )}

              {author && (
                <p className="mt-1 Blueprint-body-small lg:Blueprint-body-medium text-schemesOnSurfaceVariant transition-colors duration-200 group-hover:text-schemesOnSurface">
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