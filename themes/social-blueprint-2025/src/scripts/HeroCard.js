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
    group relative flex flex-col rounded-2xl
    ${shadow ? "shadow-lg" : ""}
    ${fullHeight ? "h-full" : ""}
    ${fullWidth ? "w-full" : ""}
    p-2
    bg-white
    transition-all duration-300 ease-in-out
    hover:shadow-xl
    hover:-translate-y-1
    overflow-hidden
  `.trim();

  return (
    <Card href={href} styles={cardStyles}>
      <div className="relative h-full w-full overflow-hidden rounded-xl">
        {/* Background image that fades out on hover */}
        {image && (
          <img
            src={image}
            alt={title}
            className="
              absolute inset-0 h-full w-full object-cover
              transition-opacity duration-500 ease-in-out
              group-hover:opacity-0
            "
            loading="lazy"
            decoding="async"
          />
        )}

        {/* Badge */}
        {badge && (
          <span className="absolute left-3 top-3 z-20 rounded bg-white/80 px-3 py-1 Blueprint-label-small text-schemesOnSurfaceVariant backdrop-blur-sm group-hover:opacity-0">
            {badge}
          </span>
        )}

        {/* Overlay content (appears on hover) */}
        <div
          className="
            absolute inset-0 flex flex-col justify-between
            p-4 text-schemesOnSurface
            opacity-0 group-hover:opacity-100
            translate-y-3 group-hover:translate-y-0
            transition-all duration-500 ease-in-out
          "
        >
          {/* Top text group */}
          <div>
            {date && (
              <div className="Blueprint-label-small mb-1 text-schemesOnSurfaceVariant">
                {date}
              </div>
            )}

            {title && (
              <h3 className="Blueprint-body-large-emphasized leading-snug line-clamp-3">
                {title}
              </h3>
            )}

            {subtitle && (
              <p className="Blueprint-body-medium mt-2 text-schemesOnSurfaceVariant line-clamp-3">
                {subtitle}
              </p>
            )}

            {author && (
              <p className="mt-3 Blueprint-body-small text-schemesOnSurfaceVariant">
                {author}
              </p>
            )}
          </div>

          {/* Bottom read more */}
          <div className="mt-3 inline-flex items-center gap-1 Blueprint-label-large text-schemesOnSurface group-hover:text-blue-600 transition-colors duration-300">
            Read more
            <ArrowIcon className="w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Card>
  );
}
