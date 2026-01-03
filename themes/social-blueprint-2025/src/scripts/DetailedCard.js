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
    <Card styles={`h-full transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 ${shadow ? 'shadow-3x3' : ''}`}>
      <a href={href || "#"} className="flex h-full w-full gap-2 group">
        <div className="lg:aspect-[4/3] max-h-[275px] w-1/2 lg:w-2/5 flex-shrink-0 p-2">
          <div className="w-full h-full overflow-hidden rounded-lg bg-gray-100">
            <img
              src={image}
              alt={image ? title : null}
              className="w-full h-full object-cover rounded-lg transition-transform duration-300 ease-in-out group-hover:scale-105"
            />
          </div>
        </div>
        <div className="flex flex-col justify-between w-full h-full pr-1 py-1">
          <div className="space-y-1 py-1 lg:py-2">
            {date && (
              <p className="Blueprint-body-medium text-schemesOnSurfaceVariant transition-colors duration-200 group-hover:text-schemesOnSurface">
                {date}
              </p>
            )}
            {title && (
              <h3 className="Blueprint-body-large-emphasized text-schemesLightOnSurface transition-colors duration-200 group-hover:text-[var(--schemesPrimary)]">
                {title}
              </h3>
            )}
            {description && (
              <p className="Blueprint-body-small md:Blueprint-body-medium lg:Blueprint-body-medium text-schemesOnSurfaceVariant line-clamp-2 transition-colors duration-200 group-hover:text-schemesOnSurface">
                {description}
              </p>
            )}
          </div>

          <div className="flex items-center pt-2 mt-auto w-full">
            {location && (
              <p className="Blueprint-label-large text-schemesOnSurfaceVariant transition-colors duration-200 group-hover:text-schemesOnSurface">
                {location}
              </p>
            )}

            <span className="inline-flex ml-auto items-center gap-1 Blueprint-label-large text-schemesOnSurface group-hover:underline transition-all duration-200 group-hover:text-blue-600">
              {buttonText}
              <ArrowIcon />
            </span>
          </div>
        </div>
      </a>
    </Card>
  );
}