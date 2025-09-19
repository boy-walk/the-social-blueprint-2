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
  `.trim();

  return (
    <Card href={href} styles={cardStyles}>
      <div className="flex h-full min-h-0 flex-col">
        <div
          className={[
            "relative overflow-hidden rounded-lg bg-gray-100",
            fullHeight
              ? "aspect-[4/3] md:aspect-[1] max-h-60 md:max-h-50 lg:max-h-100"
              : "aspect-[4/3] md:aspect-[1.6] max-h-56 md:max-h-40 lg:max-h-75",
          ].join(" ")}
        >
          {image && (
            <img
              src={image}
              alt={title}
              className="
                h-full w-full
                object-cover
                transition-transform duration-700 ease-out will-change-transform
                md:group-hover:-translate-y-[6%] md:group-hover:scale-[1.04]
              "
              loading="lazy"
              decoding="async"
            />
          )}
          {badge && (
            <span className="absolute left-2 top-2 z-10 rounded bg-schemesSurfaceContainer px-4 py-1.5 Blueprint-label-small font-medium">
              {badge}
            </span>
          )}
        </div>

        {title && (
          <div
            className="
              relative p-4 pt-3
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
            <div className="md:transition-transform md:duration-300 md:ease-out md:group-hover:-translate-y-1.5">
              {date && (
                <div className="Blueprint-body-small md:Blueprint-body-small lg:Blueprint-body-medium text-schemesOnSurfaceVariant">
                  {date}
                </div>
              )}

              <h3
                className="
                  Blueprint-body-medium-emphasized md:Blueprint-body-medium-emphasized lg:Blueprint-body-large-emphasized
                  line-clamp-2
                "
              >
                {title}
              </h3>

              {subtitle && (
                <p
                  className="
                    Blueprint-body-small md:Blueprint-body-medium lg:Blueprint-body-large text-schemesOnSurfaceVariant
                    line-clamp-2
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
