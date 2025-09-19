import React, { useRef, useState, useEffect } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { ContentCard } from "./ContentCard";
import { getBadge } from "./getBadge";
import { Button } from "./Button";

export function PostsSlider({ title = null, description = null, events, itemsToDisplay = 4, viewAllUrl = null }) {
  const scrollRef = useRef(null);
  const itemRefs = useRef([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(itemsToDisplay);
  const [maxCardHeight, setMaxCardHeight] = useState(0);

  // Detect screen size
  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;
      setItemsPerView(width < 640 ? 1 : itemsToDisplay);
    };
    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, [itemsToDisplay]);

  // Equalize heights (watch content + resize)
  useEffect(() => {
    if (!itemRefs.current?.length || 0) return;

    const measure = () => {
      const h = Math.max(
        0,
        ...itemRefs.current?.map((el) => (el ? el.offsetHeight : 0))
      );
      setMaxCardHeight(h);
    };

    // Observe size changes (images, fonts, etc.)
    const ro = new ResizeObserver(() => measure());
    itemRefs.current.forEach((el) => el && ro.observe(el));

    measure();
    window.addEventListener("resize", measure);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [events, itemsPerView]);

  const totalSlides = Math.ceil(events?.length || 0 / itemsPerView);

  const scrollToIndex = (index) => {
    if (!scrollRef.current) return;
    const itemWidth = scrollRef.current.offsetWidth / itemsPerView;
    const scrollLeft = itemWidth * itemsPerView * index;
    scrollRef.current.scrollTo({ left: scrollLeft, behavior: "smooth" });
    setCurrentIndex(index);
  };

  const next = () => currentIndex < totalSlides - 1 && scrollToIndex(currentIndex + 1);
  const prev = () => currentIndex > 0 && scrollToIndex(currentIndex - 1);

  // Keep refs array in sync
  itemRefs.current = Array(events?.length || 0);


  return (
    <div className="flex flex-col w-full">
      {title && (
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-6 gap-4">
          <div className="flex flex-col gap-4">
            <h2 className="Blueprint-title-small-emphasized md:Blueprint-title-medium-emphasized lg:Blueprint-title-large-emphasized text-schemesOnSurface">
              {title}
            </h2>
            {description && (
              <p className="Blueprint-body-small md:Blueprint-body-medium lg:Blueprint-body-large text-schemesOnSurfaceVariant mt-1 max-w-2xl">
                {description}
              </p>
            )}
          </div>
          {viewAllUrl && (
            <Button
              label="View All"
              variant="tonal"
              size="sm"
              onClick={() => { window.location.href = viewAllUrl }}
            />
          )}
        </div>
      )}
      <div className="overflow-hidden">
        <div
          ref={scrollRef}
          className="flex items-stretch transition-transform duration-300 ease-in-out overflow-x-auto scrollbar-hidden max-h-[375px]"
        >
          {events?.map((post, idx) => (
            <div
              key={post.id}
              className="flex-shrink-0 flex px-0 lg:px-1"
              style={{ width: `${100 / itemsPerView}%` }}
            >
              <a href={post.permalink} className="block w-full h-full">
                <div
                  ref={(el) => (itemRefs.current[idx] = el)}
                  style={maxCardHeight ? { height: maxCardHeight } : undefined}
                  className="h-full"
                >
                  <ContentCard
                    image={post.thumbnail}
                    date={post.date}
                    author={post.author}
                    title={post.title}
                    badge={getBadge(post.post_type)}
                    subtitle={post.meta?.location || post.subtitle || ""}
                    href={post.link}
                    fullHeight
                  />
                </div>
              </a>
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
          <ArrowLeftIcon size={20} weight="bold" />
        </button>
        <button
          onClick={next}
          className={`bg-schemesSurface rounded-xl py-1.5 px-3 flex items-center justify-center ${currentIndex >= totalSlides - 1 ? "opacity-30 cursor-not-allowed" : ""
            }`}
          disabled={currentIndex >= totalSlides - 1}
        >
          <ArrowRightIcon size={20} weight="bold" />
        </button>
      </div>
    </div>
  );
}
