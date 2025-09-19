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
}) {
  return (
    <Card styles="h-full transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
      <a href={href || "#"} className="flex h-full w-full gap-4 group">
        <div className="lg:aspect-[4/3] max-h-[250px] w-1/4 flex-shrink-0 overflow-hidden p-2 rounded-lg">
          <img
            src={image}
            alt={image ? title : null}
            className="w-full h-full object-cover bg-gray-100 rounded-lg transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
        </div>
        <div className="flex flex-col justify-between w-full h-full p-2 lg:p-4">
          <div className="space-y-1 py-1 lg:py-2">
            {date && (
              <p className="Blueprint-body-medium text-schemesOnSurfaceVariant transition-colors duration-200 group-hover:text-schemesOnSurface">
                {date}
              </p>
            )}
            {title && (
              <h3 className="Blueprint-body-large-emphasized text-schemesLightOnSurface transition-colors duration-200">
                {title}
              </h3>
            )}
            {description && (
              <p className="Blueprint-body-medium text-schemesOnSurfaceVariant line-clamp-2 transition-colors duration-200 group-hover:text-schemesOnSurface">
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
              <ArrowIcon className="w-7.5 transition-transform duration-200 group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </a>
    </Card>
  );
}