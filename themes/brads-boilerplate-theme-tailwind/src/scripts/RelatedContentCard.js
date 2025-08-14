import { Card } from "./Card";

export const RelatedContentCard = ({
  title,
  date,
  location,
  image,
  href,
}) => {
  return (
    <Card href={href} styles="overflow-hidden shadow-3x2">
      <div className="flex h-full">
        <div className="w-[6em] h-[7em] flex-shrink-0 p-2">
          <img
            src={image}
            alt={image ? title : null}
            className="w-full h-full object-cover rounded-sm bg-gray-200"
          />
        </div>

        {/* Text content */}
        <div className="p-4 flex flex-col justify-start w-2/3">
          {date && (
            <div className="text-sm text-[var(--schemesOnSurfaceVariant)] mb-1">
              {date}
            </div>
          )}
          <div className="Blueprint-title-medium font-bold mb-1 line-clamp-3">
            {title}
          </div>
          {location && (
            <div className="text-sm text-[var(--schemesOnSurfaceVariant)]">
              {location}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
