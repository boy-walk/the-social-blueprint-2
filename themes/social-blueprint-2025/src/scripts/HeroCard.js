import React from "react";
import { Card } from "./Card";
import { ArrowIcon } from "../../assets/icons/arrow";

export function HeroCard({
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
      <div className="flex h-full min-h-0 flex-col relative">
        {/* Image Layer */}
        <div
          className={[
            "relative overflow-hidden rounded-lg bg-gray-100",
            "transition-opacity duration-500 ease-in-out",
            "group-hover:opacity-0",
            fullHeight
              ? "aspect-[4/3] max-h-60 md:max-h-50 lg:max-h-100"
              : "aspect-[4/3] max-h-56 md:max-h-40 lg:max-h-75",
          ].join(" ")}
        >
          {image && (
            <img
              src={image}
              alt={title}
              className="
                h-full w-full
                object-cover
                transition-transform duration-500 ease-in-out
                group-hover:scale-110
                [transform-origin:center]
              "
              loading="lazy"
              decoding="async"
            />
          )}
          {badge && (
            <span className="absolute left-2 top-2 z-10 rounded bg-schemesSurfaceContainer px-4 py-1.5 Blueprint-label-small font-medium transition-all duration-300">
              {badge}
            </span>
          )}
        </div>

        {/* Content Layer - Absolutely positioned to overlay */}
        {title && (
          <div
            className="
              absolute inset-0
              flex flex-col
              p-2
              opacity-0
              transition-all duration-500 ease-in-out
              group-hover:opacity-100
              translate-y-4
              group-hover:translate-y-0
              pointer-events-none
              group-hover:pointer-events-auto
            "
          >
            <div className="space-y-2 flex-grow">
              {date && (
                <div className="Blueprint-label-small md:Blueprint-label-medium text-schemesOnSurfaceVariant">
                  {date}
                </div>
              )}

              <h3
                className="
                  Blueprint-body-medium-emphasized md:Blueprint-body-medium-emphasized lg:Blueprint-body-large-emphasized
                  line-clamp-3
                  text-schemesOnSurface
                "
              >
                {title}
              </h3>

              {subtitle && (
                <p
                  className="
                    Blueprint-body-small md:Blueprint-body-medium text-schemesOnSurfaceVariant
                    line-clamp-3
                  "
                >
                  {subtitle}
                </p>
              )}

              {author && (
                <p className="mt-2 Blueprint-body-small lg:Blueprint-body-medium text-schemesOnSurfaceVariant">
                  {author}
                </p>
              )}
            </div>
            <span className="inline-flex items-center gap-1 Blueprint-label-large text-schemesOnSurface group-hover:underline transition-all duration-200 group-hover:text-blue-600 mt-auto">
              Read more
              <ArrowIcon className="w-5 transition-transform duration-200 group-hover:translate-x-1" />
            </span>
          </div>
        )}
      </div>
    </Card >
  );
}