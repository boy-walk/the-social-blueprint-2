import React from "react";

export function ContentCard({ image, type, title, subtitle, badge, href }) {
    return (
        <a
            href={href}
            className="bg-white rounded-xl shadow-3x2 hover:shadow-md transition overflow-hidden w-full flex flex-col border border-gray-200 p-1"
        >
            <div className="p-1 pb-0">
                <div className="rounded-lg overflow-hidden relative aspect-[5/2.5] bg-gray-100">
                    {image && (
                        <img
                            src={image}
                            alt={title}
                            className="w-full h-full object-cover"
                        />
                    )}
                    {badge && (
                        <span className="absolute top-2 left-2 bg-white Blueprint-label-small font-medium px-4 py-1.5 rounded Blueprint-label-small z-10">
                            {badge}
                        </span>
                    )}
                </div>
            </div>

            {title && (<div className="p-4 space-y-1">
                <p className="text-sm text-schemesOnSurfaceVariant font-medium">{type}</p>
                <h3 className="Blueprint-body-large-emphasized line-clamp-2 min-h-[3.2em]">
                    {title}
                </h3>
                {subtitle && (
                    <p className="text-sm text-schemesOnSurfaceVariant">{subtitle}</p>
                )}
            </div>)}
        </a>
    );
}
