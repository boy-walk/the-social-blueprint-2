import React from "react";

export function ContentCard({ image, type, title, subtitle, badge, href }) {
    return (
        <a
            href={href}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col border border-gray-200"
        >
            <div className="p-1 pb-0">
                <div className="rounded-lg overflow-hidden relative aspect-[4/5] bg-gray-100">
                    {image && (
                        <img
                            src={image}
                            alt={title}
                            className="w-full h-full object-cover"
                        />
                    )}
                    {badge && (
                        <span className="absolute top-2 left-2 bg-white Blueprint-label-small font-medium px-2 py-1 rounded text-xs z-10">
                            {badge}
                        </span>
                    )}
                </div>
            </div>

            <div className="p-4 space-y-1">
                <p className="text-sm text-schemesOnSurfaceVariant font-medium">{type}</p>
                <h3 className="Blueprint-body-large-emphasized font-semibold line-clamp-2 min-h-[3.2em]">
                    {title}
                </h3>
                {subtitle && (
                    <p className="text-sm text-schemesOnSurfaceVariant">{subtitle}</p>
                )}
            </div>
        </a>
    );
}
