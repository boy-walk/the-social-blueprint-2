import React, { useRef, useState, useEffect, useMemo } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { Card } from "./Card";

/**
 * messageBoard: Array<{
 *   id: string|number,
 *   permalink: string,
 *   title: string,
 *   excerpt?: string,
 *   categories?: string[],       // <-- used for the chips
 *   iconUrl?: string             // optional square art for the left tile
 * }>
 */
export function MessageBoardSlider({ messageBoard = [], displaySlider = true }) {
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  if (!Array.isArray(messageBoard) || messageBoard.length === 0) return null;

  useEffect(() => {
    const update = () => setItemsPerView(window.innerWidth < 1028 ? 1 : 3);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const totalSlides = useMemo(
    () => Math.ceil(messageBoard.length / itemsPerView),
    [messageBoard.length, itemsPerView]
  );

  const scrollToIndex = (index) => {
    const el = scrollRef.current;
    if (!el) return;
    const itemWidth = el.offsetWidth / itemsPerView;
    el.scrollTo({ left: itemWidth * itemsPerView * index, behavior: "smooth" });
    setCurrentIndex(index);
  };

  const next = () => { if (currentIndex < totalSlides - 1) scrollToIndex(currentIndex + 1); };
  const prev = () => { if (currentIndex > 0) scrollToIndex(currentIndex - 1); };

  return (
    <div>
      <div className="overflow-hidden">
        <div
          ref={scrollRef}
          className="flex items-stretch transition-transform duration-300 ease-in-out overflow-x-auto scrollbar-hidden"
        >
          {messageBoard.map((post) => {
            const cats = Array.isArray(post.categories) ? post.categories.slice(0, 2) : [];
            const extra = Array.isArray(post.categories) && post.categories.length > 2
              ? post.categories.length - 2
              : 0;

            return (
              <div
                key={post.id}
                className="flex-shrink-0"
                style={{ width: `${100 / itemsPerView}%` }}
              >
                <Card href={post.permalink} styles="h-full">
                  <div className="flex gap-2">
                    {/* Left tile */}
                    <div className="flex-none w-27 h-36 overflow-hidden grid place-items-center p-2">
                      {post.thumbnail ? (
                        <img
                          src={post.thumbnail}
                          alt=""
                          className="aspect-[3/4] w-full h-full object-cover rounded-lg"
                          loading="lazy"
                        />
                      ) : (
                        <svg viewBox="0 0 24 24" className="w-10 h-10 text-schemesOnSecondaryContainer">
                          <path fill="currentColor" d="M3 20h18v-2H3v2Zm9-4q-2.075 0-3.537-1.463T7 11q0-2.075 1.463-3.538T12 6q2.075 0 3.538 1.462T17 11q0 2.075-1.462 3.537T12 16Z" />
                        </svg>
                      )}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1 p-4">
                      {/* Chips */}
                      {cats.length > 0 && (<div className="flex flex-wrap gap-2 mb-2">
                        <span
                          key={`${cats[0].id}-cat`}
                          className="rounded-md px-3 py-1.5 bg-schemesSurfaceContainer text-schemesOnSurface Blueprint-label-small"
                        >
                          {cats[0]}
                        </span>
                      </div>)}

                      <h3 className="Blueprint-body-small-emphasized md:Blueprint-body-medium-emphasized lg:Blueprint-body-large-emphasized text-schemesOnSurface mb-1 md:mb-2 line-clamp-2">
                        {post.title}
                      </h3>

                      {post.subtitle && (
                        <p className="text-schemesOnSurfaceVariant Blueprint-body-small md:Blueprint-body-medium line-clamp-3">
                          {post.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div >

      {displaySlider && (
        <div className="flex justify-between gap-4 mt-6">
          <button
            onClick={prev}
            aria-label="Previous"
            className={`bg-schemesSurface rounded-xl py-1.5 px-3 flex items-center justify-center ${currentIndex === 0 ? "opacity-30 cursor-not-allowed" : ""}`}
            disabled={currentIndex === 0}
          >
            <ArrowLeftIcon size={20} weight="bold" />
          </button>
          <button
            onClick={next}
            aria-label="Next"
            className={`bg-schemesSurface rounded-xl py-1.5 px-3 flex items-center justify-center ${currentIndex >= totalSlides - 1 ? "opacity-30 cursor-not-allowed" : ""}`}
            disabled={currentIndex >= totalSlides - 1}
          >
            <ArrowRightIcon size={20} weight="bold" />
          </button>
        </div>
      )
      }
    </div >
  );
}
