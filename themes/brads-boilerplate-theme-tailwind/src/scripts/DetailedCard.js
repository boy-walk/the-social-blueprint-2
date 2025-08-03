import React from "react";
import { Card } from "./Card";
import { ArrowUpRightIcon } from "@phosphor-icons/react";

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
      <a href={href || "#"} className="flex h-full w-full p-3 gap-4 group">
        <div className="aspect-[4/3] max-h-[250px] w-1/4 flex-shrink-0 overflow-hidden rounded-lg bg-schemesSurface">
          {image && (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Right content */}
        <div className="flex flex-col justify-between w-full h-full">
          <div className="space-y-1">
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

          <div className="flex justify-between items-end pt-2 mt-auto">
            {location && (
              <p className="Blueprint-label-medium text-schemesOnSurfaceVariant">
                {location}
              </p>
            )}

            <span className="inline-flex items-center gap-1 Blueprint-label-medium text-schemesOnSurfaceVariant group-hover:underline">
              {buttonText}
              <ArrowUpRightIcon size={18} weight="duotone" />
            </span>
          </div>
        </div>
      </a>
    </Card>
  );
}
