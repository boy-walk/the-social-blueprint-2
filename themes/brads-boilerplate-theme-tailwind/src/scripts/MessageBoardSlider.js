import React, { useRef, useState, useEffect } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { Card } from "./Card";
import { ArrowIcon } from "../../assets/icons/arrow";

export function MessageBoardSlider({ messageBoard }) {
    const scrollRef = useRef();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(3);

    // Detect screen size
    useEffect(() => {
        const updateItemsPerView = () => {
            const width = window.innerWidth;
            setItemsPerView(width < 640 ? 1 : 3);
        };
        updateItemsPerView();
        window.addEventListener("resize", updateItemsPerView);
        return () => window.removeEventListener("resize", updateItemsPerView);
    }, []);

    const totalSlides = Math.ceil(messageBoard.length / itemsPerView);

    const scrollToIndex = (index) => {
        if (!scrollRef.current) return;
        const itemWidth = scrollRef.current.offsetWidth / itemsPerView;
        const scrollLeft = itemWidth * itemsPerView * index;
        scrollRef.current.scrollTo({
            left: scrollLeft,
            behavior: "smooth",
        });
        setCurrentIndex(index);
    };

    const next = () => {
        if (currentIndex < totalSlides - 1) {
            scrollToIndex(currentIndex + 1);
        }
    };

    const prev = () => {
        if (currentIndex > 0) {
            scrollToIndex(currentIndex - 1);
        }
    };

    return (
        <div className="py-16 px-4 sm:px-8 lg:px-16">
            {/* Header */}
            <div className="flex items-center gap-2 mb-8">
                <h2 className="Blueprint-headline-medium text-schemesOnSurface">
                    Recent message board posts
                </h2>
                <ArrowIcon />
            </div>

            {/* Scrollable view */}
            <div className="overflow-hidden">
                <div
                    ref={scrollRef}
                    className="flex items-stretch transition-transform duration-300 ease-in-out overflow-x-auto scrollbar-hidden"
                >
                    {messageBoard.map((post) => (
                        <div
                            key={post.id}
                            className="flex-shrink-0 px-2 flex flex-col pb-4"
                            style={{
                                width: `${100 / itemsPerView}%`,
                            }}
                        >
                            <Card href={post.permalink} styles="h-full flex flex-col">
                                <div className="flex flex-col gap-2 items-start p-4 flex-grow">
                                    <div className="rounded-md px-3 py-1.5 bg-schemesSurfaceContainer Blueprint-label-small">
                                        Health & Wellbeing
                                    </div>
                                    <h3 className="Blueprint-title-medium text-schemesOnSurface mb-2 line-clamp-2">
                                        {post.title}
                                    </h3>
                                    <div className="text-schemesOnSurfaceVariant Blueprint-label-medium line-clamp-3">
                                        {post.excerpt}
                                    </div>
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>

            {/* Arrows */}
            <div className="flex justify-between gap-4 mt-6">
                <button
                    onClick={prev}
                    className={`bg-schemesSurface rounded-xl py-1.5 px-3 flex items-center justify-center ${currentIndex === 0 ? "opacity-30 cursor-not-allowed" : ""
                        }`}
                    disabled={currentIndex === 0}
                >
                    <ArrowLeftIcon size={20} fill="bold"/>
                </button>
                <button
                    onClick={next}
                    className={`bg-schemesSurface rounded-xl py-1.5 px-3 flex items-center justify-center ${currentIndex >= totalSlides - 1 ? "opacity-30 cursor-not-allowed" : ""
                        }`}
                    disabled={currentIndex >= totalSlides - 1}
                >
                    <ArrowRightIcon size={20} fill="bold"/>
                </button>
            </div>
        </div>
    );
}
