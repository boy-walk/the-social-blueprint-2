import React from "react";
import { Card } from "./Card";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
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
    <Card styles="h-full">
      <a href={href || "#"} className="flex h-full w-full gap-4 group">
        <div className="aspect-[4/3] max-h-[250px] w-1/4 flex-shrink-0 overflow-hidden rounded-lg p-2">
          {image && (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Right content */}
        <div className="flex flex-col justify-between w-full h-full p-4">
          <div className="space-y-1 py-2">
            {date && (
              <p className="Blueprint-body-medium text-schemesOnSurfaceVariant">
                {date}
              </p>
            )}
            {title && (
              <h3 className="Blueprint-body-large-emphasized text-schemesLightOnSurface">
                {title}
              </h3>
            )}
            {description && (
              <p className="Blueprint-body-medium text-schemesOnSurfaceVariant line-clamp-2">
                {description}
              </p>
            )}
          </div>

          <div className="flex items-center pt-2 mt-auto w-full">
            {location && (
              <p className="Blueprint-label-large text-schemesOnSurfaceVariant">
                {location}
              </p>
            )}

            <span className="inline-flex ml-auto items-center gap-1 Blueprint-label-large text-schemesOnSurface group-hover:underline">
              {buttonText}
              <ArrowIcon className="w-7.5" />
            </span>
          </div>
        </div>
      </a>
    </Card>
  );
}
