import React from "react";
import { Card } from "./Card";
import { ArrowIcon } from "../../assets/icons/arrow";
export function DetailedCard({
  image,
  title,
  location,
  description,
  date,
  href,
  buttonText = "Read more",
  shadow = false,
}) {
  return (
    <Card
      styles={`h-full transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 ${shadow ? "shadow-3x3" : ""
        }`}
    >
      <a href={href || "#"} className="flex h-full w-full gap-2 group">
        {/* Image Section */}
        <div className="flex-shrink-0 basis-2/5 max-w-[40%] p-2">
          <div className="w-full aspect-[6/5] overflow-hidden rounded-lg bg-gray-100">
            {image && (
              <img
                src={image}
                alt={title || ""}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
              />
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col justify-between flex-1 py-2 pr-3 min-w-0">
          <div className="space-y-1">
            {date && (
              <p className="Blueprint-body-small text-schemesOnSurfaceVariant group-hover:text-schemesOnSurface">
                {date}
              </p>
            )}

            {title && (
              <h3 className="Blueprint-body-large-emphasized text-schemesLightOnSurface group-hover:text-[var(--schemesPrimary)] line-clamp-2 md:line-clamp-3">
                {title}
              </h3>
            )}

            {description && (
              <p className="Blueprint-body-small md:Blueprint-body-medium lg:Blueprint-body-medium text-schemesOnSurfaceVariant line-clamp-2 group-hover:text-schemesOnSurface">
                {description}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 pt-2 mt-auto">
            {location && (
              <p className="Blueprint-body-small md:Blueprint-label-large text-schemesOnSurfaceVariant truncate">
                {location}
              </p>
            )}

            <span className="inline-flex items-center gap-1 Blueprint-body-small md:Blueprint-label-large text-schemesOnSurface group-hover:underline whitespace-nowrap flex-shrink-0">
              {buttonText}
              <ArrowIcon />
            </span>
          </div>
        </div>
      </a>
    </Card>
  );
}
