import { Card } from "./Card";

export const RelatedContentCard = ({
  title,
  date,
  image,
  href,
  description,
}) => {
  return (
    <Card href={href} styles="overflow-hidden shadow-3x2 group transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
      <div className="flex h-full">
        <div className="w-[6em] h-[7em] flex-shrink-0 p-2">
          <img
            src={image}
            alt={image ? title : null}
            className="w-full h-full object-cover rounded-sm bg-gray-200 transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
        </div>

        {/* Text content */}
        <div className="p-2 flex flex-col gap-1 justify-start w-2/3">
          {date && (
            <div className="Blueprint-body-small md:Blueprint-body-medium lg:Blueprint-body-medium text-[var(--schemesOnSurfaceVariant)] transition-colors duration-200 group-hover:text-[var(--schemesOnSurface)]">
              {date}
            </div>
          )}
          <div className="Blueprint-body-small-emphasized md:Blueprint-body-medium-emphasized lg:Blueprint-body-large-emphasized font-bold line-clamp-1 transition-colors duration-200 group-hover:text-[var(--schemesPrimary)]">
            {title}
          </div>
          {description && (
            <div className="Blueprint-body-small md:Blueprint-body-medium lg:Blueprint-body-medium text-[var(--schemesOnSurfaceVariant)] line-clamp-2 transition-colors duration-200 group-hover:text-[var(--schemesOnSurface)]">
              {description}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};