import React, { useRef, useState, useEffect } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { Card } from "./Card";
import { useTranslation } from "../../node_modules/react-i18next";

export function TestimonialSlider({ testimonials, displaySlider = true }) {
  const { t } = useTranslation();
  const scrollRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(2);

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  // Detect screen size
  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;
      setItemsPerView(width < 1023 ? 1 : 2);
    };
    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, [window.innerWidth]);

  const totalSlides = Math.ceil(testimonials.length / itemsPerView);

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
    <div>
      <div className="overflow-hidden">
        <div
          ref={scrollRef}
          className="flex items-stretch transition-transform duration-300 ease-in-out overflow-x-auto scrollbar-hidden"
        >
          {testimonials.map((post) => (
            <div
              key={post.id}
              className="flex-shrink-0 px-2 flex flex-col pb-4"
              style={{
                width: `${100 / itemsPerView}%`,
              }}
            >
              <Card styles="h-full flex flex-col">
                <div className="flex flex-col p-4 md:p-8 h-full">
                  <h3 className="Blueprint-body-small md:Blueprint-body-medium lg:Blueprint-body-large text-schemesOnSurface mb-2">
                    {post.quote}
                  </h3>
                  {/* Spacer pushes author to bottom */}
                  <div className="flex-grow"></div>
                  <div className="text-schemesOnSurfaceVariant Blueprint-body-small-emphasized md:Blueprint-body-medium-emphasized lg:Blueprint-body-large-emphasized line-clamp-3">
                    {post.author}
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {displaySlider && (<div className="flex justify-between gap-4 mt-4 md:mt-6 lg:mt-8">
        <button
          onClick={prev}
          className={`bg-schemesSurface rounded-xl py-1.5 px-3 flex items-center justify-center ${currentIndex === 0 ? "opacity-30 cursor-not-allowed" : ""
            }`}
          disabled={currentIndex === 0}
        >
          <ArrowLeftIcon size={20} fill="bold" />
        </button>
        <button
          onClick={next}
          className={`bg-schemesSurface rounded-xl py-1.5 px-3 flex items-center justify-center ${currentIndex >= totalSlides - 1 ? "opacity-30 cursor-not-allowed" : ""
            }`}
          disabled={currentIndex >= totalSlides - 1}
        >
          <ArrowRightIcon size={20} fill="bold" />
        </button>
      </div>)}
    </div>
  );
}
