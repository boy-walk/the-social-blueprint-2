import React from "react";
import { ArrowIcon } from "../../assets/icons/arrow";

export function MoreInterviews({ items = [] }) {
    if (!items.length) return null;

    return (
        <section className="space-y-6">
            <div className="flex items-center gap-2">
                <h2 className="Blueprint-headline-medium">More Interviews</h2>
                {/* Optional: decorative arrow icon */}
                <ArrowIcon className="w-6 h-6 text-schemesPrimary" />
            </div>

            <div className="flex flex-wrap gap-6">
                {items.map((item) => (
                    <a
                        key={item.id}
                        href={item.link}
                        className="block rounded-xl overflow-hidden shadow-md bg-white w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] transition hover:shadow-lg"
                    >
                        {item.thumbnail && (
                            <img
                                src={item.thumbnail}
                                alt={item.title}
                                className="w-full aspect-[16/9] object-cover"
                            />
                        )}
                        <div className="p-4">
                            <span className="text-xs text-gray-500 font-medium uppercase mb-2 block">Event</span>
                            <h3 className="font-bold text-lg text-schemesOnSurface">{item.title}</h3>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
}
