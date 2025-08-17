import React, { useRef, useState, useEffect } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { ContentCard } from "./ContentCard";

export function PostsSlider({ events, itemsToDisplay = 4 }) {
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
    if (!itemRefs.current.length) return;

    const measure = () => {
      const h = Math.max(
        0,
        ...itemRefs.current.map((el) => (el ? el.offsetHeight : 0))
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

  const totalSlides = Math.ceil(events.length / itemsPerView);

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
  itemRefs.current = Array(events.length);


  return (
    <div>
      <div className="overflow-hidden">
        <div
          ref={scrollRef}
          className="flex items-stretch transition-transform duration-300 ease-in-out overflow-x-auto scrollbar-hidden max-h-[350px]"
        >
          {events.map((post, idx) => (
            <div
              key={post.id}
              className="flex-shrink-0 px-2 flex pb-4"
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
                    type={post.type || "Event"}
                    subtitle={post.meta?.author || post.meta?.location || ""}
                    badge={"Event"}
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
