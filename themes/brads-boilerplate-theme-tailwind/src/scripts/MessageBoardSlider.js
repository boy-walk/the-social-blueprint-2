import React, { useRef, useState, useEffect } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { Card } from "./Card";
import { ArrowIcon } from "../../assets/icons/arrow";
import { useTranslation } from "react-i18next";

export function MessageBoardSlider({ messageBoard, displaySlider = true }) {
  const { t } = useTranslation();
  const scrollRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  if (!messageBoard || messageBoard.length === 0) {
    return null;
  }

  // Detect screen size
  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;
      setItemsPerView(width < 1028 ? 1 : 3);
    };
    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, [window.innerWidth]);

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
    <div>
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
                    {t("healthAndWellbeing")}
                  </div>
                  <h3 className="Blueprint-body-small-emphasized md:Blueprint-body-medium-emphasized lg:Blueprint-body-large-emphasized text-schemesOnSurface mb-1 md:mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <div className="text-schemesOnSurfaceVariant Blueprint-body-small md:Blueprint-body-medium lg:Blueprint-body-medium line-clamp-3">
                    {post.excerpt}
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {displaySlider && (<div className="flex justify-between gap-4 mt-6">
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
