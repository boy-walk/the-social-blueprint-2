import React from "react";
import classNames from "clsx";

export function SimpleCard({
  title,
  description,
  category,
  subtext,
  badge,
  image,
  buttonText,
  iconButton,
  href,
}) {
  const content = (
    <div
      className={classNames(
        "rounded-lg bg-white border border-schemesOutlineVariant shadow-3x2",
        "flex p-4 gap-4 w-full max-w-full h-full"
      )}
    >
      {image && (
        <img
          src={image}
          alt={title}
          className="w-24 h-24 rounded-md object-cover flex-shrink-0"
        />
      )}

      <div className="flex flex-col justify-end w-full min-h-[96px]">
        {badge && (
          <div className="text-xs font-semibold bg-[#B3ECDD] text-[#006A61] px-2 py-1 rounded-full w-fit mb-1 self-start">
            {badge}
          </div>
        )}
        <div className="flex flex-col justify-end flex-grow">
          {category && (
            <p className="text-xs text-schemesOnSurfaceVariant mb-1">
              {category}
            </p>
          )}
          <h3 className="text-sm font-semibold text-schemesOnSurface leading-snug">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-schemesOnSurfaceVariant mt-1 line-clamp-2">
              {description}
            </p>
          )}
          {subtext && (
            <p className="text-xs text-schemesOnSurfaceVariant mt-1">
              {subtext}
            </p>
          )}
          {(buttonText || iconButton) && (
            <div className="mt-2 flex items-center gap-2">
              {buttonText && (
                <a
                  href={href || "#"}
                  className="text-white bg-primary px-3 py-1 text-sm rounded-full Blueprint-label-medium"
                >
                  {buttonText}
                </a>
              )}
              {iconButton}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return href ? (
    <a href={href} className="block no-underline hover:opacity-90 h-full">
      {content}
    </a>
  ) : (
    content
  );
}
