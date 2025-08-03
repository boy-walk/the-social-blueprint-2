import React from "react";
import { Card } from "./Card";

export function ContentCard({
  image,
  type,
  title,
  date,
  subtitle,
  badge,
  href,
  fullHeight = false,
  fullWidth = false
}) {
  const cardStyles = `
    flex flex-col 
    ${fullHeight ? "h-full" : ""} 
    ${fullWidth ? "w-full" : ""} 
    p-1
  `.trim();

  return (
    <Card href={href} styles={cardStyles}>
      <div className="flex flex-col flex-grow">
        <div className="rounded-lg overflow-hidden relative aspect-[5/2.5] bg-gray-100">
          {image && (
            <img
              src={image}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          {badge && (
            <span className="absolute top-2 left-2 bg-schemesSurfaceContainer Blueprint-label-small font-medium px-4 py-1.5 rounded z-10">
              {badge}
            </span>
          )}
        </div>
        {title && (
          <div className="p-4 space-y-1 flex flex-col flex-grow">
            {date && (
              <div className="Blueprint-body-medium text-schemesOnSurfaceVariant">
                {date}
              </div>
            )}
            <h3 className="Blueprint-body-large-emphasized line-clamp-2 min-h-[3.2em]">{title}</h3>
            {subtitle && (
              <p className="text-sm text-schemesOnSurfaceVariant">{subtitle}</p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
